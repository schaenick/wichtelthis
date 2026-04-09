"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RundeErstellen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    beschreibung: "",
    budget: "",
    stichtag: "",
    ablaufdatum: "",
    ersteller_name: "",
    ersteller_email: "",
    ersteller_nimmt_teil: true,
    selbstanmeldung: true,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/runde", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Etwas ist schiefgelaufen.");
      setLoading(false);
      return;
    }

    router.push(`/runde/${data.id}?token=${data.admin_token}`);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif mb-1">WichtelThis 🎁</h1>
      <p className="text-stone-500 mb-8">
        Erstelle jetzt deine Wichtelrunde – ganz ohne Account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name der Runde *
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="z.B. Büro-Wichteln 2024"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Beschreibung
          </label>
          <textarea
            name="beschreibung"
            value={form.beschreibung}
            onChange={handleChange}
            placeholder="Was ist das Thema? Gibt es Regeln?"
            rows={3}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Budget</label>
            <input
              type="text"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="z.B. ca. 20€"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Auslosung am
            </label>
            <input
              type="date"
              name="stichtag"
              value={form.stichtag}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Daten löschen am *
          </label>
          <input
            type="date"
            name="ablaufdatum"
            required
            value={form.ablaufdatum}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-stone-400 mt-1">
            Nach diesem Datum werden alle Daten automatisch gelöscht.
          </p>
        </div>

        <div className="border-t border-stone-100 pt-4">
          <p className="text-sm font-medium mb-3">Deine Daten</p>
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
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
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

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {loading ? "Wird erstellt..." : "Runde erstellen →"}
        </button>
      </form>
    </div>
  );
}