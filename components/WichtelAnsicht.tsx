"use client";

import { useState } from "react";
import { themes } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

interface Teilnehmer {
  id: string;
  name: string;
  interessen: string | null;
  wichtel_token: string;
}

interface Runde {
  id: string;
  name: string;
  beschreibung: string | null;
  budget: string | null;
  theme: Theme;
}

interface Props {
  geber: Teilnehmer;
  empfaenger: Teilnehmer;
  runde: Runde;
  token: string;
}

export default function WichtelAnsicht({ geber, empfaenger, runde, token }: Props) {
  const t = themes[runde.theme] ?? themes.neutral;
  const [interessen, setInteressen] = useState(geber.interessen ?? "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function interessenSpeichern() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/interessen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wichtel_token: token,
        interessen,
      }),
    });

    if (res.ok) {
      setSuccess("Gespeichert! Dein Wichtel wird benachrichtigt.");
      setEditing(false);
    } else {
      setError("Fehler beim Speichern.");
    }

    setLoading(false);
  }

  return (
    <div className={`min-h-screen ${t.bg} -mx-4 -mt-10 px-4 pt-10 pb-20 transition-colors duration-300`}>
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Wichtelrunde</p>
          <h1 className="font-serif text-3xl">{runde.name}</h1>
        </div>

        <div className={`bg-white border ${t.border} rounded-xl p-6 text-center`}>
          <p className="text-sm text-stone-500 mb-2">Hallo {geber.name}! Du beschenkst</p>
          <p className="font-serif text-4xl mb-2">{empfaenger.name}</p>
          {runde.budget && (
            <span className={`text-xs px-3 py-1 rounded-full ${t.badge} ${t.badgeText}`}>
              Budget: {runde.budget}
            </span>
          )}
        </div>

        {empfaenger.interessen && (
          <div className={`bg-white border ${t.border} rounded-xl p-5`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
              Interessen von {empfaenger.name}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              {empfaenger.interessen}
            </p>
          </div>
        )}

        {!empfaenger.interessen && (
          <div className={`${t.highlight} border ${t.border} rounded-xl p-5`}>
            <p className="text-sm text-stone-500">
              {empfaenger.name} hat noch keine Interessen eingetragen. Du bekommst eine E-Mail sobald das passiert!
            </p>
          </div>
        )}

        {runde.beschreibung && (
          <div className={`bg-white border ${t.border} rounded-xl p-5`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
              Über die Runde
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              {runde.beschreibung}
            </p>
          </div>
        )}

        <div className={`bg-white border ${t.border} rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
              Deine Interessen
            </p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {geber.interessen ? "Bearbeiten" : "Eintragen"}
              </button>
            )}
          </div>

          {!editing && (
            <>
              {geber.interessen ? (
                <p className="text-sm text-stone-600 leading-relaxed">{geber.interessen}</p>
              ) : (
                <p className="text-sm text-stone-400">
                  Noch nichts eingetragen. Dein Wichtel freut sich über Tipps!
                </p>
              )}
            </>
          )}

          {editing && (
            <div className="flex flex-col gap-3">
              <textarea
                value={interessen}
                onChange={(e) => setInteressen(e.target.value)}
                placeholder="Was magst du? Hobbys, Lieblingsfarben, Wünsche..."
                rows={4}
                className={`w-full border ${t.border} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              <div className="flex gap-2">
                <button
                  onClick={interessenSpeichern}
                  disabled={loading}
                  className={`${t.accent} ${t.accentHover} ${t.accentText} disabled:opacity-50 text-sm font-medium rounded-lg px-4 py-2 transition-colors`}
                >
                  {loading ? "Speichert..." : "Speichern"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setInteressen(geber.interessen ?? "");
                  }}
                  className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

      </div>
    </div>
  );
}