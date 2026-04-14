import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { beitrittsMailHtml } from "@/lib/mails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();

  const { runde_id, name, email, interessen } = body;

  if (!runde_id || !name || !email) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen." },
      { status: 400 }
    );
  }

  const { data: runde } = await supabase
    .from("runden")
    .select("*")
    .eq("id", runde_id)
    .single();

  if (!runde || runde.status !== "offen") {
    return NextResponse.json(
      { error: "Runde ist nicht mehr offen." },
      { status: 400 }
    );
  }

  const { data: teilnehmer, error } = await supabase
    .from("teilnehmer")
    .insert({ runde_id, name, email, interessen: interessen || null })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Diese E-Mail ist bereits eingetragen." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Teilnehmer konnte nicht hinzugefügt werden." },
      { status: 500 }
    );
  }

  const wichtelLink = `${process.env.NEXT_PUBLIC_BASE_URL}/wichtel/${teilnehmer.wichtel_token}`;

  await resend.emails.send({
    from: "WichtelThis <noreply@wichtelthis.klingfer.de>",
    to: email,
    subject: `🎁 Du nimmst an „${runde.name}" teil!`,
    html: beitrittsMailHtml({
      name,
      rundenName: runde.name,
      wichtelLink,
      budget: runde.budget,
    }),
  });

  return NextResponse.json(teilnehmer);
}