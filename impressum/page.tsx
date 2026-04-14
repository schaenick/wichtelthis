export default function Impressum() {
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Rechtliches</p>
        <h1 className="font-serif text-3xl">Impressum</h1>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">Angaben gemäß § 5 TMG</p>
        <p className="text-sm">Nicki Jana Schäfer</p>
        <p className="text-sm">Weilerstraße 80</p>
        <p className="text-sm">46049 Oberhausen</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">Kontakt</p>
        <p className="text-sm">E-Mail: <a href="mailto:muecelee@web.de" className="text-blue-600 hover:text-blue-700">muecelee@web.de</a></p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Haftungsausschluss</p>
        <p className="text-sm text-stone-600 leading-relaxed">
          Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. WichtelThis ist ein privates Projekt ohne kommerzielle Absicht.
        </p>
      </div>
    </div>
  );
}