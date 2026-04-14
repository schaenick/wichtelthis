import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = createServerClient();
  const { wichtel_token, interessen } = await req.json();

  if (!wichtel_token) {
    return NextResponse.json(
      { error: "Token fehlt." },
      { status: 400 }
    );
  }

  const { data: teilnehmer } = await supabase
    .from("teilnehmer")
    .select("*, runden(*)")
    .eq("wichtel_token", wichtel_token)
    .single();

  if (!teilnehmer) {
    return NextResponse.json(
      { error: "Teilnehmer nicht gefunden." },
      { status: 404 }
    );
  }

  await supabase
    .from("teilnehmer")
    .update({ interessen })
    .eq("id", teilnehmer.id);

  const { data: zuweisung } = await supabase
    .from("zuweisungen")
    .select("*, geber:geber_id(*)")
    .eq("empfaenger_id", teilnehmer.id)
    .single();

  if (zuweisung) {
    const geber = zuweisung.geber;
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/wichtel/${geber.wichtel_token}`;

    await resend.emails.send({
      from: "WichtelThis <onboarding@resend.dev>",
      to: geber.email,
      subject: `🎁 ${teilnehmer.name} hat Interessen eingetragen!`,
      html: `
        <p>Hallo ${geber.name}!</p>
        <p>Dein Wichtel <strong>${teilnehmer.name}</strong> hat gerade Interessen eingetragen:</p>
        <blockquote>${interessen}</blockquote>
        <p><a href="${link}">Hier ansehen →</a></p>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}