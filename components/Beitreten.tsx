"use client";

import { useState } from "react";
import { themes } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

interface Runde {
  id: string;
  name: string;
  beschreibung: string | null;
  budget: string | null;
  stichtag: string | null;
  theme: Theme;
}

interface Props {
  runde: Runde;
}

export default function Beitreten({ runde }: Props) {
  const t = themes[runde.theme] ?? themes.neutral;

  const [form, setForm] = useState({
    name: "",
    email: "",
    interessen: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [erfolg, setErfolg] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/teilnehmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runde_id: runde.id,
        name: form.name,
        email: form.email,
        interessen: form.interessen || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Etwas ist schiefgelaufen.");
      setLoading(false);
      return;
    }

    setErfolg(true);
    setLoading(false);
  }

  if (erfolg) {
    return (
      <div className={`min-h-screen ${t.bg} -mx-4 -mt-10 px-4 pt-10 pb-20`}>
        <div className="max-w-lg mx-auto text-center pt-20">
          <div className="text-5xl mb-6">🎁</div>
          <h1 className="font-serif text-3xl mb-3">Du bist dabei!</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Sobald die Auslosung stattgefunden hat, bekommst du eine E-Mail mit deinem Wichtel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${t.bg} -mx-4 -mt-10 px-4 pt-10 pb-20 transition-colors duration-300`}>
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Wichtelrunde</p>
          <h1 className="font-serif text-3xl mb-1">{runde.name}</h1>
          {runde.beschreibung && (
            <p className="text-stone-500 text-sm">{runde.beschreibung}</p>
          )}
          <div className="flex gap-4 text-xs text-stone-400 mt-2">
            {runde.budget && <span>Budget: {runde.budget}</span>}
            {runde.stichtag && (
              <span>
                Auslosung: {new Date(runde.stichtag).toLocaleDateString("de-DE")}
              </span>
            )}
          </div>
        </div>

        <div className={`bg-white border ${t.border} rounded-xl p-5 flex flex-col gap-4`}>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Deine Daten</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Dein Name"
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-Mail *</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="deine@email.de"
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Deine Interessen
              <span className="text-stone-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              name="interessen"
              value={form.interessen}
              onChange={handleChange}
              placeholder="Was magst du? Hobbys, Lieblingsfarben, Wünsche... Dein Wichtel freut sich über Tipps!"
              rows={4}
              className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full ${t.accent} ${t.accentHover} ${t.accentText} disabled:opacity-50 font-medium rounded-xl px-4 py-3 text-sm transition-colors`}
          >
            {loading ? "Wird eingetragen..." : "Ich bin dabei! 🎉"}
          </button>
        </div>

      </div>
    </div>
  );
}