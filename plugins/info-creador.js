import PhoneNumber from 'awesome-phonenumber';

const ownerNumber = '5216631079388'; // SIN '+' o '@s.whatsapp.net'
const ownerName = 'Neykoor 💜';

let handler = async (m, { conn }) => {
  m.react?.('🩵');

  const ownerJid = `${ownerNumber}@s.whatsapp.net`;
  const botJid = conn.user.jid;
  const currentOwnerName = await conn.getName(ownerJid).catch(() => ownerName);

  await sendContactArray(conn, m.chat, [
    [
      ownerNumber,
      'ᰔᩚ Propietario',
      '❀ No Hacer Spam'
    ],
    [
      botJid.split('@')[0],
      '✦ Es Un Bot',
      '✨ Asistente Virtual ✨'
    ]
  ], m);
};

handler.help = ["creador", "owner"];
handler.tags = ["info"];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;

async function sendContactArray(conn, jid, data, quoted, options = {}) {
  if (!Array.isArray(data[0])) data = [data];

  const contacts = data.map(([number, displayName, organization]) => {
    number = number.replace(/\D/g, '');
    const waid = number;
    let formattedPhoneNumber = '+' + number;

    try {
      const pn = PhoneNumber('+' + number);
      if (pn.isValid()) formattedPhoneNumber = pn.getNumber('international');
    } catch {}

    const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${displayName.replace(/\n/g, '\\n')};;;
FN:${displayName.replace(/\n/g, '\\n')}
ORG:${(organization || '').replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${waid}:${formattedPhoneNumber}
END:VCARD`.trim();

    return { vcard, displayName };
  });

  return conn.sendMessage(jid, {
    contacts: {
      displayName: contacts.length > 1 ? '👥 Contactos Clave' : contacts[0]?.displayName || 'Contacto',
      contacts
    }
  }, { quoted, ...options });
}
