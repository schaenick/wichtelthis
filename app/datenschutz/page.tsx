export default function Datenschutz() {
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Rechtliches</p>
        <h1 className="font-serif text-3xl">Datenschutz&shy;erklärung</h1>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Verantwortliche Person</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Nicki Jana Schäfer, Weilerstraße 80, 46049 Oberhausen<br />
          E-Mail: <a href="mailto:muecelee@web.de" className="text-blue-600 hover:text-blue-700">muecelee@web.de</a>
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Welche Daten wir erheben</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Zur Nutzung von WichtelThis erheben wir ausschließlich die folgenden personenbezogenen Daten:
        </p>
        <ul className="text-sm text-stone-600 leading-relaxed list-disc list-inside flex flex-col gap-1">
          <li>Vor- und Nachname</li>
          <li>E-Mail-Adresse</li>
          <li>Freiwillig angegebene Interessen</li>
        </ul>
        <p className="text-sm text-stone-600 leading-relaxed">
          Es ist keine Registrierung oder Erstellung eines Benutzerkontos erforderlich.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Zweck der Datenverarbeitung</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Die erhobenen Daten werden ausschließlich zur Organisation von Wichtelrunden verwendet – konkret zur Auslosung von Geschenkpartnern und zur Benachrichtigung der Teilnehmer per E-Mail.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Speicherdauer</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Alle Daten werden automatisch nach dem vom Ersteller der Runde festgelegten Ablaufdatum gelöscht. Es findet keine dauerhafte Speicherung statt.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Auftragsverarbeiter</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Wir nutzen folgende Dienstleister zur Bereitstellung des Angebots:
        </p>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-medium">Supabase Inc.</p>
            <p className="text-xs text-stone-400">Datenbankhosting – Server in der EU (Frankfurt)</p>
          </div>
          <div>
            <p className="text-sm font-medium">Resend Inc.</p>
            <p className="text-xs text-stone-400">E-Mail-Versand – Datenverarbeitungsvertrag vorhanden</p>
          </div>
          <div>
            <p className="text-sm font-medium">Hetzner Online GmbH</p>
            <p className="text-xs text-stone-400">Serverhosting – Server in Deutschland</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Deine Rechte</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Du hast jederzeit das Recht auf Auskunft, Berichtigung und Löschung deiner gespeicherten Daten. Wende dich dafür per E-Mail an <a href="mailto:muecelee@web.de" className="text-blue-600 hover:text-blue-700">muecelee@web.de</a>.
        </p>
      </div>

    </div>
  );
}