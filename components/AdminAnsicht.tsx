"use client";

import { useState } from "react";

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
  teilnehmer: Teilnehmer[];
}

interface Props {
  runde: Runde;
  token: string;
}

export default function AdminAnsicht({ runde, token }: Props) {
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
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-serif">{runde.name}</h1>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          runde.status === "offen"
            ? "bg-green-100 text-green-700"
            : runde.status === "geschlossen"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-stone-100 text-stone-600"
        }`}>
          {runde.status}
        </span>
      </div>

      {runde.beschreibung && (
        <p className="text-stone-500 text-sm mb-1">{runde.beschreibung}</p>
      )}

      <div className="flex gap-4 text-xs text-stone-400 mb-8">
        {runde.budget && <span>Budget: {runde.budget}</span>}
        {runde.stichtag && (
          <span>Auslosung: {new Date(runde.stichtag).toLocaleDateString("de-DE")}</span>
        )}
        <span>Löschen: {new Date(runde.ablaufdatum).toLocaleDateString("de-DE")}</span>
      </div>

      {runde.selbstanmeldung && (
        <div className="bg-stone-100 rounded-lg px-4 py-3 mb-8">
          <p className="text-xs font-medium text-stone-500 mb-1">Einlade-Link</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-stone-700 truncate flex-1">{einladeLink}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(einladeLink);
                setSuccess("Link kopiert!");
              }}
              className="text-xs text-orange-500 hover:text-orange-600 font-medium shrink-0"
            >
              Kopieren
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">
          Teilnehmer ({teilnehmer.length})
        </h2>

        {teilnehmer.length === 0 && (
          <p className="text-sm text-stone-400 mb-4">Noch keine Teilnehmer.</p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {teilnehmer.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border border-stone-100 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-stone-400">{t.email}</p>
              </div>
              {runde.status === "ausgelost" && (
                <button
                  onClick={() => mailNochmalSenden(t.id)}
                  className="text-xs text-orange-500 hover:text-orange-600"
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
              className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="email"
              placeholder="E-Mail"
              value={neueEmail}
              onChange={(e) => setNeueEmail(e.target.value)}
              className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={teilnehmerHinzufuegen}
              disabled={loadingAdd}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

      {runde.status === "offen" && (
        <button
          onClick={auslosungStarten}
          disabled={loadingAuslosung || teilnehmer.length < 2}
          className="w-full bg-stone-900 hover:bg-stone-700 disabled:opacity-40 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {loadingAuslosung ? "Wird ausgelost..." : "Auslosung starten 🎲"}
        </button>
      )}

      {teilnehmer.length < 2 && runde.status === "offen" && (
        <p className="text-xs text-stone-400 text-center mt-2">
          Mindestens 2 Teilnehmer für die Auslosung nötig.
        </p>
      )}
    </div>
  );
}