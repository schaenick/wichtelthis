"use client";

import { useState } from "react";
import { themes } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

interface Teilnehmer {
  id: string;
  name: string;
  email: string;
  interessen: string | null;
}

interface Runde {
  id: string;
  name: string;
  beschreibung: string | null;
  budget: string | null;
  stichtag: string | null;
  ablaufdatum: string;
  status: string;
  ersteller_name: string;
  ersteller_email: string;
  selbstanmeldung: boolean;
  theme: Theme;
  teilnehmer: Teilnehmer[];
}

interface Props {
  runde: Runde;
  token: string;
}

export default function AdminAnsicht({ runde, token }: Props) {
  const t = themes[runde.theme] ?? themes.neutral;
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>(runde.teilnehmer);
  const [neuerName, setNeuerName] = useState("");
  const [neueEmail, setNeueEmail] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingAuslosung, setLoadingAuslosung] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const einladeLink = `${window.location.origin}/runde/${runde.id}/beitreten`;

  async function teilnehmerHinzufuegen() {
    if (!neuerName || !neueEmail) return;
    setLoadingAdd(true);
    setError(null);

    const res = await fetch("/api/teilnehmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runde_id: runde.id,
        name: neuerName,
        email: neueEmail,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Fehler beim Hinzufügen.");
    } else {
      setTeilnehmer((prev) => [...prev, data]);
      setNeuerName("");
      setNeueEmail("");
    }

    setLoadingAdd(false);
  }

  async function auslosungStarten() {
    if (!confirm("Auslosung jetzt starten? Das kann nicht rückgängig gemacht werden.")) return;
    setLoadingAuslosung(true);
    setError(null);

    const res = await fetch("/api/auslosung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runde_id: runde.id, admin_token: token }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Fehler bei der Auslosung.");
    } else {
      setSuccess("Auslosung erfolgreich! Alle Teilnehmer wurden per E-Mail benachrichtigt.");
    }

    setLoadingAuslosung(false);
  }

  async function mailNochmalSenden(teilnehmerId: string) {
    const res = await fetch("/api/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teilnehmer_id: teilnehmerId, admin_token: token }),
    });

    if (res.ok) {
      setSuccess("Mail wurde erneut gesendet.");
    } else {
      setError("Mail konnte nicht gesendet werden.");
    }
  }

  return (
    <div className={`min-h-screen ${t.bg} -mx-4 -mt-10 px-4 pt-10 pb-20`}>
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        <div className={`bg-white border ${t.border} rounded-xl p-5`}>
          <div className="flex items-start justify-between mb-2">
            <h1 className="font-serif text-2xl">{runde.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.badge} ${t.badgeText}`}>
              {runde.status}
            </span>
          </div>
          {runde.beschreibung && (
            <p className="text-stone-500 text-sm mb-3">{runde.beschreibung}</p>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-stone-400">
            {runde.budget && <span>Budget: {runde.budget}</span>}
            {runde.stichtag && (
              <span>Auslosung: {new Date(runde.stichtag).toLocaleDateString("de-DE")} um 12:00 Uhr</span>
            )}
            <span>Löschen: {new Date(runde.ablaufdatum).toLocaleDateString("de-DE")}</span>
          </div>
        </div>

        {runde.selbstanmeldung && (
          <div className={`bg-white border ${t.border} rounded-xl p-5`}>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Einlade-Link</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-stone-600 truncate flex-1">{einladeLink}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(einladeLink);
                  setSuccess("Link kopiert!");
                }}
                className="text-xs font-medium shrink-0 text-blue-600 hover:text-blue-700"
              >
                Kopieren
              </button>
            </div>
          </div>
        )}

        <div className={`bg-white border ${t.border} rounded-xl p-5`}>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">
            Teilnehmer ({teilnehmer.length})
          </p>

          {teilnehmer.length === 0 && (
            <p className="text-sm text-stone-400 mb-4">Noch keine Teilnehmer.</p>
          )}

          <div className="flex flex-col gap-2 mb-4">
            {teilnehmer.map((tn) => (
              <div
                key={tn.id}
                className={`flex items-center justify-between ${t.highlight} border ${t.border} rounded-lg px-3 py-2`}
              >
                <div>
                  <p className="text-sm font-medium">{tn.name}</p>
                  <p className="text-xs text-stone-400">{tn.email}</p>
                </div>
                {runde.status === "ausgelost" && (
                  <button
                    onClick={() => mailNochmalSenden(tn.id)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mail nochmal senden
                  </button>
                )}
              </div>
            ))}
          </div>

          {runde.status === "offen" && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name"
                value={neuerName}
                onChange={(e) => setNeuerName(e.target.value)}
                className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={neueEmail}
                onChange={(e) => setNeueEmail(e.target.value)}
                className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={teilnehmerHinzufuegen}
                disabled={loadingAdd}
                className={`${t.accent} ${t.accentHover} ${t.accentText} disabled:opacity-50 text-sm font-medium rounded-lg px-3 py-2 transition-colors`}
              >
                +
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {runde.status === "offen" && (
          <div className="flex flex-col gap-2">
            <button
              onClick={auslosungStarten}
              disabled={loadingAuslosung || teilnehmer.length < 2}
              className={`w-full ${t.accent} ${t.accentHover} ${t.accentText} disabled:opacity-40 font-medium rounded-xl px-4 py-3 text-sm transition-colors`}
            >
              {loadingAuslosung ? "Wird ausgelost..." : "Auslosung starten 🎲"}
            </button>
            {teilnehmer.length < 2 && (
              <p className="text-xs text-stone-400 text-center">
                Mindestens 2 Teilnehmer für die Auslosung nötig.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}