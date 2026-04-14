"use client";

import { useState } from "react";

interface Runde {
  id: string;
  name: string;
  beschreibung: string | null;
  budget: string | null;
  stichtag: string | null;
}

interface Props {
  runde: Runde;
}

export default function Beitreten({ runde }: Props) {
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
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-4">🎁</div>
        <h1 className="text-2xl font-serif mb-2">Du bist dabei!</h1>
        <p className="text-stone-500 text-sm">
          Sobald die Auslosung stattgefunden hat, bekommst du eine E-Mail mit
          deinem Wichtel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">
        Wichtelrunde
      </p>
      <h1 className="text-2xl font-serif mb-1">{runde.name}</h1>

      {runde.beschreibung && (
        <p className="text-stone-500 text-sm mb-1">{runde.beschreibung}</p>
      )}

      <div className="flex gap-4 text-xs text-stone-400 mb-8">
        {runde.budget && <span>Budget: {runde.budget}</span>}
        {runde.stichtag && (
          <span>
            Auslosung:{" "}
            {new Date(runde.stichtag).toLocaleDateString("de-DE")}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Deine Interessen
          </label>
          <textarea
            name="interessen"
            value={form.interessen}
            onChange={handleChange}
            placeholder="Was magst du? Hobbys, Lieblingsfarben, Wünsche... Dein Wichtel freut sich über Tipps!"
            rows={4}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500/90 hover:bg-blue-600/90 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {loading ? "Wird eingetragen..." : "Ich bin dabei! 🎉"}
        </button>
      </form>
    </div>
  );
}