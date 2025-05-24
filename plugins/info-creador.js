import PhoneNumber from 'awesome-phonenumber';

// ---------------------------------------------------------------------------------//
// Mueve estas variables a un archivo de configuración (config.js) si es posible  //
// o defínelas aquí si es un bot simple.                                         //
// ASEGÚRATE DE REEMPLAZAR ESTOS VALORES CON LOS REALES                         //
// ---------------------------------------------------------------------------------//
const ownerNumber = '5216631079388'; // Número del propietario SIN el '+' o '@s.whatsapp.net', solo los dígitos. Ejemplo: '521xxxxxxxxxx'
const ownerName = 'Neykoor 💜'; // Nombre del propietario como quieres que aparezca
const botName = '𝙷𝚊𝚝𝚜𝚞𝚗𝚎 𝚖𝚒𝚔𝚞 ❥'; // Nombre de tu bot
const ownerEmail = 'propietario@example.com'; // Email del propietario
const ownerWebsite = 'https://github.com/tu-usuario'; // Website/GitHub del propietario
const ownerCountry = '⊹˚• Venezuela •˚⊹'; // País/Región del propietario

const botPackname = 'Paquete del Bot'; // Nombre del paquete del bot (ej. para stickers)
const botDeveloper = 'Desarrollador del Bot (puede ser el mismo propietario)'; // Nombre del desarrollador
// const botEmail = 'bot@example.com'; // Si el bot tiene un email diferente, si no, usa ownerEmail
const botCountry = '🌐 Internet 🌐'; // País/Región del bot
const botChannel = 'https://whatsapp.com/channel/tu-canal-si-tienes'; // Canal de WhatsApp del bot
// ---------------------------------------------------------------------------------//


let handler = async (m, { conn }) => {
  m.react('🩵');

  // Determinar a quién mostrar: el mencionado, el remitente (si no es el bot), o el propio bot (si m.fromMe)
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  
  // No necesitamos la foto de perfil para la tarjeta de contacto, pero la dejamos por si se usa en otro lado
  // let pp = await conn.profilePictureUrl(who).catch(_ => 'https://qu.ax/PRgfc.jpg');

  let ownerJid = `${ownerNumber}@s.whatsapp.net`;
  let botJid = conn.user.jid;

  let ownerBioInfo;
  try {
    ownerBioInfo = await conn.fetchStatus(ownerJid);
  } catch (e) {
    console.error(`Error fetching owner status for ${ownerJid}:`, e);
    ownerBioInfo = { status: 'Sin Biografía' };
  }
  const ownerBio = ownerBioInfo.status?.toString() || 'Sin Biografía';

  let botBioInfo;
  try {
    botBioInfo = await conn.fetchStatus(botJid);
  } catch (e) {
    console.error(`Error fetching bot status for ${botJid}:`, e);
    botBioInfo = { status: 'Sin Biografía' };
  }
  const botBio = botBioInfo.status?.toString() || 'Sin Biografía';

  // El nombre del propietario se define arriba, si quieres obtenerlo dinámicamente:
  // const dynamicOwnerName = await conn.getName(ownerJid); // O usar el ownerName predefinido

  await sendContactArray(conn, m.chat, [
    [
      ownerNumber,          // Número (sin @s.whatsapp.net)
      `👑 Propietario (${ownerName})`, // Nombre a mostrar en vCard
      botName,              // Organización (Nombre del Bot que maneja)
      '❀ Contacto Principal',// Etiqueta para el número
      ownerEmail,           // Email
      ownerCountry,         // Región/País
      ownerWebsite,         // Website
      ownerBio              // Biografía (Nota)
    ],
    [
      conn.user.jid.split('@')[0], // Número del bot
      `🤖 Asistente Virtual (${botName})`, // Nombre a mostrar en vCard
      botPackname,          // Organización (Nombre del "paquete" del bot)
      'Bot Oficial',        // Etiqueta para el número
      ownerEmail,           // Email (usamos el del owner o puedes definir botEmail)
      botCountry,           // Región/País del bot
      botChannel,           // Website (Canal del bot)
      botBio                // Biografía del bot (Nota)
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
    number = number.replace(/[^0-9]/g, ''); // Asegurar que solo sean números
    let waid = number;
    let formattedPhoneNumber;
    try {
      formattedPhoneNumber = PhoneNumber('+' + number).getNumber('international');
    } catch (e) {
      console.warn(`Could not format phone number: +${number}. Using raw number.`, e);
      formattedPhoneNumber = '+' + number; // Fallback
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

