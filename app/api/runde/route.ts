import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();

  const {
    name,
    beschreibung,
    budget,
    stichtag,
    ablaufdatum,
    ersteller_name,
    ersteller_email,
    ersteller_nimmt_teil,
    selbstanmeldung,
  } = body;

  if (!name || !ablaufdatum || !ersteller_name || !ersteller_email) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen." },
      { status: 400 }
    );
  }

  const { data: runde, error } = await supabase
    .from("runden")
    .insert({
      name,
      beschreibung: beschreibung || null,
      budget: budget || null,
      stichtag: stichtag || null,
      ablaufdatum,
      ersteller_name,
      ersteller_email,
      ersteller_nimmt_teil,
      selbstanmeldung,
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

  return NextResponse.json({
    id: runde.id,
    admin_token: runde.admin_token,
  });
}