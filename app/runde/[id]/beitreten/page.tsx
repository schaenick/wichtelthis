import { createServerClient } from "@/lib/supabase/server";
import { notFound }  from "next/navigation";
import Beitreten from "@/components/Beitreten";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BeitretenPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: runde } = await supabase
    .from("runden")
    .select("id, name, beschreibung, budget, stichtag, status, selbstanmeldung, theme")
    .eq("id", id)
    .single();

  if (!runde) notFound();
  if (!runde.selbstanmeldung) notFound();
  if (runde.status !== "offen") notFound();

  return <Beitreten runde={runde} />;
}