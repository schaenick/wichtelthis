export function adminMailHtml({
  name,
  rundenName,
  adminLink,
  stichtag,
}: {
  name: string;
  rundenName: string;
  adminLink: string;
  stichtag?: string | null;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
      <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">🎁 Deine Runde ist bereit!</h1>
      <p style="color: #78716c; margin-bottom: 24px;">Hallo ${name}!</p>
      <p>Deine Wichtelrunde <strong>${rundenName}</strong> wurde erfolgreich erstellt.</p>
      ${stichtag ? `<p style="color: #78716c; font-size: 14px;">Die Auslosung erfolgt automatisch am <strong>${new Date(stichtag).toLocaleDateString("de-DE")}</strong> um 12:00 Uhr.</p>` : ""}
      <a href="${adminLink}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #1c1917; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
        Runde verwalten →
      </a>
      <p style="margin-top: 32px; font-size: 12px; color: #a8a29e;">
        Speichere diesen Link – er ist dein Zugang zur Runde. Alle Daten werden nach Ablauf automatisch gelöscht.
      </p>
    </div>
  `;
}

export function beitrittsMailHtml({
  name,
  rundenName,
  wichtelLink,
  budget,
}: {
  name: string;
  rundenName: string;
  wichtelLink: string;
  budget?: string | null;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
      <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">🎁 Du wurdest eingetragen!</h1>
      <p style="color: #78716c; margin-bottom: 24px;">Hallo ${name}!</p>
      <p>Du nimmst jetzt an der Wichtelrunde <strong>${rundenName}</strong> teil.</p>
      ${budget ? `<p style="color: #78716c; font-size: 14px;">Budget: <strong>${budget}</strong></p>` : ""}
      <p style="font-size: 14px; color: #78716c;">Trage deine Interessen ein damit dein Wichtel weiß was dir gefällt – sobald die Auslosung stattgefunden hat siehst du hier auch wen du beschenkst.</p>
      <a href="${wichtelLink}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #1c1917; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
        Interessen eintragen →
      </a>
      <p style="margin-top: 32px; font-size: 12px; color: #a8a29e;">
        Speichere diesen Link – er ist dein persönlicher Zugang zur Runde.
      </p>
    </div>
  `;
}

export function auslosungsMailHtml({
  geberName,
  empfaengerName,
  rundenName,
  wichtelLink,
  budget,
  interessen,
}: {
  geberName: string;
  empfaengerName: string;
  rundenName: string;
  wichtelLink: string;
  budget?: string | null;
  interessen?: string | null;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
      <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">🎲 Die Auslosung hat stattgefunden!</h1>
      <p style="color: #78716c; margin-bottom: 24px;">Hallo ${geberName}!</p>
      <p>Die Auslosung für <strong>${rundenName}</strong> ist durch.</p>
      <div style="margin: 24px 0; padding: 20px; background: #fafaf9; border-radius: 12px; border: 1px solid #e7e5e4;">
        <p style="font-size: 12px; color: #a8a29e; margin: 0 0 8px;">Du beschenkst</p>
        <p style="font-size: 28px; font-weight: 600; margin: 0;">${empfaengerName}</p>
        ${budget ? `<p style="font-size: 14px; color: #78716c; margin: 8px 0 0;">Budget: ${budget}</p>` : ""}
      </div>
      ${interessen ? `
        <div style="padding: 16px; background: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4; margin-bottom: 24px;">
          <p style="font-size: 12px; color: #a8a29e; margin: 0 0 6px;">Interessen von ${empfaengerName}</p>
          <p style="font-size: 14px; margin: 0;">${interessen}</p>
        </div>
      ` : ""}
      <a href="${wichtelLink}" style="display: inline-block; padding: 12px 24px; background: #1c1917; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
        Meine Zuteilung ansehen →
      </a>
      <p style="margin-top: 32px; font-size: 12px; color: #a8a29e;">
        Viel Spaß beim Schenken! 🎄
      </p>
    </div>
  `;
}

export function interessenMailHtml({
  geberName,
  empfaengerName,
  interessen,
  wichtelLink,
}: {
  geberName: string;
  empfaengerName: string;
  interessen: string;
  wichtelLink: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
      <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">✨ Neue Interessen eingetragen!</h1>
      <p style="color: #78716c; margin-bottom: 24px;">Hallo ${geberName}!</p>
      <p>Dein Wichtel <strong>${empfaengerName}</strong> hat gerade Interessen eingetragen:</p>
      <div style="margin: 16px 0; padding: 16px; background: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4;">
        <p style="font-size: 14px; margin: 0;">${interessen}</p>
      </div>
      <a href="${wichtelLink}" style="display: inline-block; margin-top: 8px; padding: 12px 24px; background: #1c1917; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
        Zuteilung ansehen →
      </a>
    </div>
  `;
}