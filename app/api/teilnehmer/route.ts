import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();

  const { runde_id, name, email } = body;

  if (!runde_id || !name || !email) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen." },
      { status: 400 }
    );
  }

  const { data: runde } = await supabase
    .from("runden")
    .select("status")
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
    .insert({ runde_id, name, email })
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

  return NextResponse.json(teilnehmer);
}