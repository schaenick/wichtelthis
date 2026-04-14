import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminMailHtml } from "@/lib/mails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();

  const {
    name,
    beschreibung,
    budget,
    stichtag,
    pufferwochen,
    ersteller_name,
    ersteller_email,
    ersteller_nimmt_teil,
    selbstanmeldung,
    theme,
  } = body;

  if (!name || !ersteller_name || !ersteller_email) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen." },
      { status: 400 }
    );
  }

  const basis = stichtag ? new Date(stichtag) : new Date();
  const ablauf = new Date(basis);
  const puffer = parseInt(pufferwochen ?? "2") * 7;
  ablauf.setDate(ablauf.getDate() + puffer);
  const ablaufdatum = ablauf.toISOString().split("T")[0];

  const { data: runde, error } = await supabase
    .from("runden")
    .insert({
      name,
      beschreibung: beschreibung || null,
      budget: budget || null,
      stichtag: stichtag || null,
      ablaufdatum,
      pufferwochen: puffer,
      ersteller_name,
      ersteller_email,
      ersteller_nimmt_teil,
      selbstanmeldung,
      theme: theme ?? "neutral",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Runde konnte nicht erstellt werden." },
      { status: 500 }
    );
  }

  if (ersteller_nimmt_teil) {
    await supabase.from("teilnehmer").insert({
      runde_id: runde.id,
      name: ersteller_name,
      email: ersteller_email,
    });
  }

  const adminLink = `${process.env.NEXT_PUBLIC_BASE_URL}/runde/${runde.id}?token=${runde.admin_token}`;

  await resend.emails.send({
    from: "WichtelThis <noreply@wichtelthis.klingfer.de>",
    to: ersteller_email,
    subject: `🎁 Deine Wichtelrunde „${name}" ist bereit!`,
    html: adminMailHtml({
      name: ersteller_name,
      rundenName: name,
      adminLink,
      stichtag,
    }),
  });

  return NextResponse.json({
    id: runde.id,
    admin_token: runde.admin_token,
  });
}