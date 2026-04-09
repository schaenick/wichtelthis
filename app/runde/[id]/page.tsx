import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminAnsicht from "@/components/AdminAnsicht";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function RundePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;

  const supabase = createServerClient();

  const { data: runde } = await supabase
    .from("runden")
    .select("*, teilnehmer(*)")
    .eq("id", id)
    .single();

  if (!runde) notFound();
  if (runde.admin_token !== token) notFound();

  return <AdminAnsicht runde={runde} token={token!} />;
}