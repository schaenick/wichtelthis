"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { themes, type Theme } from "@/lib/themes";

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export default function RundeErstellen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    beschreibung: "",
    budget: "",
    stichtag: "",
    manuell: false,
    pufferwochen: "2",
    ersteller_name: "",
    ersteller_email: "",
    ersteller_nimmt_teil: true,
    selbstanmeldung: true,
    theme: "neutral" as Theme,
  });

  const t = themes[form.theme];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function ablaufdatumBerechnen(): string | null {
    if (form.manuell || !form.stichtag) return null;
    const auslosung = new Date(form.stichtag);
    const ablauf = new Date(auslosung);
    ablauf.setDate(ablauf.getDate() + parseInt(form.pufferwochen) * 7);
    return toDateString(ablauf);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.manuell && !form.stichtag) {
      setError("Bitte wähle ein Auslosungsdatum oder aktiviere die manuelle Auslosung.");
      setLoading(false);
      return;
    }

    const ablaufdatum = ablaufdatumBerechnen();

    const res = await fetch("/api/runde", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ablaufdatum,
        stichtag: form.manuell ? null : form.stichtag,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Etwas ist schiefgelaufen.");
      setLoading(false);
      return;
    }

    router.push(`/runde/${data.id}?token=${data.admin_token}`);
  }

  const ablaufVorschau = ablaufdatumBerechnen();

  return (
    <div className={`min-h-screen ${t.bg} -mx-4 -mt-10 px-4 pt-10 pb-20 transition-colors duration-300`}>
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-3xl mb-1">Neue Wichtelrunde</h1>
        <p className="text-stone-500 text-sm mb-8">
          Erstelle deine Runde – ganz ohne Account. Du bekommst einen Admin-Link per Mail.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className={`bg-white border ${t.border} rounded-xl p-5 flex flex-col gap-4 transition-colors duration-300`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Über die Runde</p>

            <div>
              <label className="block text-sm font-medium mb-1">Name der Runde *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="z.B. Büro-Wichteln 2025"
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Beschreibung</label>
              <textarea
                name="beschreibung"
                value={form.beschreibung}
                onChange={handleChange}
                placeholder="Was ist das Thema? Gibt es Regeln?"
                rows={3}
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="text"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="z.B. ca. 20€"
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
          </div>

          <div className={`bg-white border ${t.border} rounded-xl p-5 flex flex-col gap-4 transition-colors duration-300`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Auslosung & Datenlöschung</p>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="manuell"
                checked={form.manuell}
                onChange={handleChange}
                className="rounded"
              />
              Ich lose manuell aus
            </label>

            {!form.manuell && (
              <div>
                <label className="block text-sm font-medium mb-1">Auslosung am *</label>
                <input
                  type="date"
                  name="stichtag"
                  value={form.stichtag}
                  onChange={handleChange}
                  min={toDateString(tomorrow)}
                  className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Daten löschen</label>
              <select
                name="pufferwochen"
                value={form.pufferwochen}
                onChange={handleChange}
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                <option value="1">1 Woche nach Auslosung</option>
                <option value="2">2 Wochen nach Auslosung</option>
                <option value="3">3 Wochen nach Auslosung</option>
                <option value="4">4 Wochen nach Auslosung</option>
                <option value="5">5 Wochen nach Auslosung</option>
                <option value="6">6 Wochen nach Auslosung</option>
              </select>
              {ablaufVorschau && (
                <p className="text-xs text-stone-400 mt-1">
                  Daten werden am {new Date(ablaufVorschau).toLocaleDateString("de-DE")} gelöscht.
                </p>
              )}
              {form.manuell && (
                <p className="text-xs text-stone-400 mt-1">
                  Die Frist beginnt ab dem Tag der manuellen Auslosung.
                </p>
              )}
            </div>
          </div>

          <div className={`bg-white border ${t.border} rounded-xl p-5 flex flex-col gap-3 transition-colors duration-300`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Theme</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(themes) as [Theme, typeof themes[Theme]][]).map(([key, tv]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, theme: key }))}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border text-sm transition-all ${
                    form.theme === key
                      ? `${t.badge} ${t.border} ${t.badgeText} font-medium`
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <span className="text-xl">{tv.emoji}</span>
                  <span className="text-xs">{tv.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`bg-white border ${t.border} rounded-xl p-5 flex flex-col gap-4 transition-colors duration-300`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Deine Daten</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="ersteller_name"
                  required
                  value={form.ersteller_name}
                  onChange={handleChange}
                  placeholder="Dein Name"
                  className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-Mail *</label>
                <input
                  type="email"
                  name="ersteller_email"
                  required
                  value={form.ersteller_email}
                  onChange={handleChange}
                  placeholder="deine@email.de"
                  className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="ersteller_nimmt_teil"
                  checked={form.ersteller_nimmt_teil}
                  onChange={handleChange}
                  className="rounded"
                />
                Ich mache selbst mit
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="selbstanmeldung"
                  checked={form.selbstanmeldung}
                  onChange={handleChange}
                  className="rounded"
                />
                Teilnehmer können sich selbst anmelden
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${t.accent} ${t.accentHover} ${t.accentText} disabled:opacity-50 font-medium rounded-xl px-4 py-3 text-sm transition-colors`}
          >
            {loading ? "Wird erstellt..." : "Runde erstellen →"}
          </button>

        </form>
      </div>
    </div>
  );
}