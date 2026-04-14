import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = createServerClient();
  const { teilnehmer_id, admin_token } = await req.json();

  if (!teilnehmer_id || !admin_token) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen." },
      { status: 400 }
    );
  }

  const { data: teilnehmer } = await supabase
    .from("teilnehmer")
    .select("*, runden(*)")
    .eq("id", teilnehmer_id)
    .single();

  if (!teilnehmer) {
    return NextResponse.json(
      { error: "Teilnehmer nicht gefunden." },
      { status: 404 }
    );
  }

  if (teilnehmer.runden.admin_token !== admin_token) {
    return NextResponse.json(
      { error: "Kein Zugriff." },
      { status: 403 }
    );
  }

  if (teilnehmer.runden.status !== "ausgelost") {
    return NextResponse.json(
      { error: "Runde wurde noch nicht ausgelost." },
      { status: 400 }
    );
  }

  const { data: zuweisung } = await supabase
    .from("zuweisungen")
    .select("*, empfaenger:empfaenger_id(*)")
    .eq("geber_id", teilnehmer_id)
    .single();

  if (!zuweisung) {
    return NextResponse.json(
      { error: "Keine Zuweisung gefunden." },
      { status: 404 }
    );
  }

  const runde = teilnehmer.runden;
  const empfaenger = zuweisung.empfaenger;
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/wichtel/${teilnehmer.wichtel_token}`;

  await resend.emails.send({
    from: "WichtelThis <onboarding@resend.dev>",
    to: teilnehmer.email,
    subject: `🎁 Dein Wichtel für „${runde.name}"`,
    html: `
      <p>Hallo ${teilnehmer.name}!</p>
      <p>Du beschenkst: <strong>${empfaenger.name}</strong></p>
      ${empfaenger.interessen ? `<p>Interessen: ${empfaenger.interessen}</p>` : ""}
      ${runde.budget ? `<p>Budget: ${runde.budget}</p>` : ""}
      <p><a href="${link}">Deine Zuteilung ansehen →</a></p>
      <p>Viel Spaß beim Schenken! 🎄</p>
    `,
  });

  return NextResponse.json({ ok: true });
}