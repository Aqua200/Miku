import PhoneNumber from 'awesome-phonenumber';

// ---------------------------------------------------------------------------------//
//         CONFIGURA ESTAS VARIABLES CON TU INFORMACIÓN REAL                       //
// ---------------------------------------------------------------------------------//
const ownerNumber = '5216631079388'; // Número del propietario SIN el '+' o '@s.whatsapp.net'.
const ownerName = 'Neykoor 💜';     // Nombre del propietario.
const botNameConfig = '𝙷𝚊𝚝𝚜𝚞𝚗𝚎 𝚖𝚒𝚔𝚞 ❥'; // Nombre real de tu bot (usado en la bio del bot o en la org del owner).
const ownerEmail = 'propietario@example.com';
const ownerWebsite = 'https://github.com/tu-usuario';
const ownerCountry = '⊹˚• Venezuela •˚⊹';

const botPackname = 'Paquete del Bot';
// const botDeveloper = 'Desarrollador del Bot (puede ser el mismo propietario)';
// const botEmail = 'bot@example.com'; // Si el bot tiene un email diferente
const botCountry = '🌐 Internet 🌐';
const botChannel = 'https://whatsapp.com/channel/tu-canal-si-tienes';
// ---------------------------------------------------------------------------------//


let handler = async (m, { conn }) => {
  m.react('🩵');

  let ownerJid = `${ownerNumber}@s.whatsapp.net`;
  let botJid = conn.user.jid;

  let ownerBioInfo;
  try {
    ownerBioInfo = await conn.fetchStatus(ownerJid);
  } catch (e) {
    // console.error(`Error fetching owner status for ${ownerJid}:`, e); // Descomenta para depurar
    ownerBioInfo = { status: 'Sin Biografía' };
  }
  const ownerBio = ownerBioInfo.status?.toString() || 'Sin Biografía';
  const currentOwnerName = await conn.getName(ownerJid) || ownerName;


  let botBioInfo;
  try {
    botBioInfo = await conn.fetchStatus(botJid);
  } catch (e) {
    // console.error(`Error fetching bot status for ${botJid}:`, e); // Descomenta para depurar
    botBioInfo = { status: 'Sin Biografía' };
  }
  const botBio = botBioInfo.status?.toString() || `Soy ${botNameConfig}, un asistente virtual.`; // Fallback para la bio del bot

  await sendContactArray(conn, m.chat, [
    [
      ownerNumber,
      `👑 Propietario (${currentOwnerName})`,
      botNameConfig,              // Organización: El bot que maneja el propietario
      '❀ Contacto Principal',
      ownerEmail,
      ownerCountry,
      ownerWebsite,
      ownerBio
    ],
    [
      conn.user.jid.split('@')[0],
      `🤖 Es un Bot de WhatsApp 🤖`, // Nombre genérico para la tarjeta del bot
      botPackname,                  // Organización: Paquete del bot
      '✨ Cuenta de Bot ✨',         // Etiqueta para el número
      ownerEmail,                   // Email (puede ser el del owner o un botEmail específico)
      botCountry,
      botChannel,
      botBio                        // La biografía del bot puede incluir su nombre real si lo deseas
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
      // console.warn(`Could not format phone number: +${number}. Using raw number.`, e); // Descomenta para depurar
      formattedPhoneNumber = '+' + number; 
    }

    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${displayName.replace(/\n/g, '\\n')};;;
FN:${displayName.replace(/\n/g, '\\n')}
ORG:${(org || '').replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${waid}:${formattedPhoneNumber}
X-ABLabel:${(phoneLabel || '').replace(/\n/g, '\\n')}`;
    if (email && email !== 'N/A') {
        vcard += `\nEMAIL;type=INTERNET:${email.replace(/\n/g, '\\n')}`;
    }
    if (addressRegion && addressRegion !== 'N/A') {
        vcard += `\nADR:;;${addressRegion.replace(/\n/g, '\\n')};;;;\nX-ABLabel:📍 Región`;
    }
    if (website && website !== 'N/A') {
        vcard += `\nURL:${website.replace(/\n/g, '\\n')}\nX-ABLabel:🌐 Website/Canal`;
    }
    if (note && note !== 'N/A') {
        vcard += `\nNOTE:${note.replace(/\n/g, '\\n')}`;
    }
    vcard += `\nEND:VCARD`;
    vcard = vcard.trim();
    
    contacts.push({ vcard, displayName: displayName });
  }
  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `👥 Contactos Relevantes (${contacts.length})` : contacts[0]?.displayName) || "Contactos",
      contacts,
    }
  }, {
    quoted,
    ...options
  });
}
