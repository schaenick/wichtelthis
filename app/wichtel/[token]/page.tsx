import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WichtelAnsicht from "@/components/WichtelAnsicht";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function WichtelPage({ params }: Props) {
  const { token } = await params;
  const supabase = createServerClient();

  const { data: geber } = await supabase
    .from("teilnehmer")
    .select("*, runden(*)")
    .eq("wichtel_token", token)
    .single();

  if (!geber) notFound();
  if (geber.runden.status !== "ausgelost") notFound();

  const { data: zuweisung } = await supabase
    .from("zuweisungen")
    .select("*, empfaenger:empfaenger_id(*)")
    .eq("geber_id", geber.id)
    .single();

  if (!zuweisung) notFound();

  return (
    <WichtelAnsicht
      geber={geber}
      empfaenger={zuweisung.empfaenger}
      runde={geber.runden}
      token={token}
    />
  );
}