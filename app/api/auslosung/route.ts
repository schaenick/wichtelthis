import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { auslosungsMailHtml } from "@/lib/mails";

const resend = new Resend(process.env.RESEND_API_KEY);

function auslosung(teilnehmer: { id: string }[]): Map<string, string> {
  const ids = teilnehmer.map((t) => t.id);
  let versuche = 0;

  while (true) {
    versuche++;
    const gemischt = [...ids].sort(() => Math.random() - 0.5);
    const gueltig = ids.every((id, i) => id !== gemischt[i]);
    if (gueltig) {
      const zuweisung = new Map<string, string>();
      ids.forEach((id, i) => zuweisung.set(id, gemischt[i]));
      return zuweisung;
    }
    if (versuche > 100) throw new Error("Auslosung fehlgeschlagen.");
  }
}

export async function POST(req: Request) {
  const supabase = createServerClient();
  const { runde_id, admin_token } = await req.json();

  if (!runde_id || !admin_token) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen." },
      { status: 400 }
    );
  }

  const { data: runde } = await supabase
    .from("runden")
    .select("*")
    .eq("id", runde_id)
    .eq("admin_token", admin_token)
    .single();

  if (!runde) {
    return NextResponse.json(
      { error: "Runde nicht gefunden oder kein Zugriff." },
      { status: 403 }
    );
  }

  if (runde.status !== "offen") {
    return NextResponse.json(
      { error: "Runde wurde bereits ausgelost." },
      { status: 400 }
    );
  }

  const { data: teilnehmer } = await supabase
    .from("teilnehmer")
    .select("*")
    .eq("runde_id", runde_id);

  if (!teilnehmer || teilnehmer.length < 2) {
    return NextResponse.json(
      { error: "Mindestens 2 Teilnehmer erforderlich." },
      { status: 400 }
    );
  }

  let zuweisung: Map<string, string>;
  try {
    zuweisung = auslosung(teilnehmer);
  } catch {
    return NextResponse.json(
      { error: "Auslosung fehlgeschlagen, bitte nochmal versuchen." },
      { status: 500 }
    );
  }

  const zuweisungen = Array.from(zuweisung.entries()).map(
    ([geber_id, empfaenger_id]) => ({ runde_id, geber_id, empfaenger_id })
  );

  const { error: insertError } = await supabase
    .from("zuweisungen")
    .insert(zuweisungen);

  if (insertError) {
    return NextResponse.json(
      { error: "Zuweisungen konnten nicht gespeichert werden." },
      { status: 500 }
    );
  }

  const basis = new Date();
  const ablauf = new Date(basis);
  ablauf.setDate(ablauf.getDate() + (runde.pufferwochen ?? 14));

  await supabase
    .from("runden")
    .update({
      status: "ausgelost",
      ablaufdatum: ablauf.toISOString().split("T")[0],
    })
    .eq("id", runde_id);

  const teilnehmerMap = new Map(teilnehmer.map((t) => [t.id, t]));

  const mailPromises = Array.from(zuweisung.entries()).map(
    ([geber_id, empfaenger_id]) => {
      const geber = teilnehmerMap.get(geber_id)!;
      const empfaenger = teilnehmerMap.get(empfaenger_id)!;
      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/wichtel/${geber.wichtel_token}`;

      return resend.emails.send({
        from: "WichtelThis <noreply@wichtelthis.klingfer.de>",
        to: geber.email,
        subject: `🎲 Die Auslosung für „${runde.name}" hat stattgefunden!`,
        html: auslosungsMailHtml({
          geberName: geber.name,
          empfaengerName: empfaenger.name,
          rundenName: runde.name,
          wichtelLink: link,
          budget: runde.budget,
          interessen: empfaenger.interessen,
        }),
      });
    }
  );

  await Promise.all(mailPromises);

  return NextResponse.json({ ok: true });
}