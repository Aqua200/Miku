import PhoneNumber from 'awesome-phonenumber';

// ---------------------------------------------------------------------------------//
//         CONFIGURA ESTAS VARIABLES CON TU INFORMACIÓN REAL                       //
// ---------------------------------------------------------------------------------//
const ownerNumber = '5216631079388'; // Número del propietario SIN '+' ni '@s.whatsapp.net'. Ejemplo: '521xxxxxxxxxx'
const ownerName = 'Tu Nombre de Propietario';
const botName = 'NombreDeTuBot';
const ownerEmail = 'propietario@example.com';
const ownerWebsite = 'https://github.com/tu-usuario';
const ownerCountry = '⊹˚• Mexico •˚⊹';

const botPackname = 'Paquete del Bot';
const botDeveloper = 'Desarrollador del Bot';
// const botEmail = 'bot@example.com'; // Descomenta y usa si el bot tiene email diferente
const botCountry = '🌐 Internet 🌐';
const botChannel = 'https://whatsapp.com/channel/tu-canal';
// ---------------------------------------------------------------------------------//


let handler = async (m, { conn }) => {
  m.react('🩵');

  let ownerJid = `${ownerNumber}@s.whatsapp.net`;
  let botJid = conn.user.jid;

  let ownerBioInfo;
  try {
    ownerBioInfo = await conn.fetchStatus(ownerJid);
  } catch (e) {
    ownerBioInfo = { status: 'Sin Biografía' };
  }
  const ownerBio = ownerBioInfo.status?.toString() || 'Sin Biografía';

  let botBioInfo;
  try {
    botBioInfo = await conn.fetchStatus(botJid);
  } catch (e) {
    botBioInfo = { status: 'Sin Biografía' };
  }
  const botBio = botBioInfo.status?.toString() || 'Sin Biografía';

  await sendContactArray(conn, m.chat, [
    [
      ownerNumber,
      `👑 Propietario (${ownerName})`,
      botName,
      '❀ Contacto Principal',
      ownerEmail,
      ownerCountry,
      ownerWebsite,
      ownerBio
    ],
    [
      conn.user.jid.split('@')[0],
      `𝙷𝚊𝚝𝚜𝚞𝚗𝚎 𝚖𝚒𝚔𝚞 🩵`,//Nombre del bot
      botPackname,
      'Bot Oficial',
      ownerEmail, // o botEmail si lo defines
      botCountry,
      botChannel,
      botBio
    ]
  ], m);
}

handler.help = ["creador", "owner"];
handler.tags = ["info"];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
  let contacts = [];
  for (let [number, displayName, org, phoneLabel, email, addressRegion, website, note] of data) {
    number = number.replace(/[^0-9]/g, '');
    let waid = number;
    let formattedPhoneNumber;
    try {
      formattedPhoneNumber = PhoneNumber('+' + number).getNumber('international');
    } catch (e) {
      formattedPhoneNumber = '+' + number;
    }

    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${displayName.replace(/\n/g, '\\n')};;;
FN:${displayName.replace(/\n/g, '\\n')}
ORG:${org.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${waid}:${formattedPhoneNumber}
X-ABLabel:${phoneLabel.replace(/\n/g, '\\n')}
EMAIL;type=INTERNET:${email.replace(/\n/g, '\\n')}
ADR:;;${addressRegion.replace(/\n/g, '\\n')};;;;
X-ABLabel:📍 Región
URL:${website.replace(/\n/g, '\\n')}
X-ABLabel:🌐 Website/Canal
NOTE:${note.replace(/\n/g, '\\n')}
END:VCARD`.trim();
    contacts.push({ vcard, displayName: displayName });
  }
  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `👥 Contactos (${contacts.length})` : contacts[0].displayName) || null,
      contacts,
    }
  }, {
    quoted,
    ...options
  });
}
