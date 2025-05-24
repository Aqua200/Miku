import PhoneNumber from 'awesome-phonenumber';

// ---------------------------------------------------------------------------------//
//         CONFIGURA ESTAS VARIABLES CON TU INFORMACIÓN REAL                       //
// ---------------------------------------------------------------------------------//
const ownerNumber = '5216631079388'; // Número del propietario SIN el '+' o '@s.whatsapp.net'.
const ownerName = 'Neykoor 💜';     // Nombre del propietario como quieres que aparezca.
// Ya no se necesitan otras variables de configuración para esta versión simplificada.
// ---------------------------------------------------------------------------------//


let handler = async (m, { conn }) => {
  m.react('🩵');

  const ownerJid = `${ownerNumber}@s.whatsapp.net`;
  const botJid = conn.user.jid;

  // Obtener el nombre actual del owner desde WhatsApp, si no, usa el configurado.
  const currentOwnerName = await conn.getName(ownerJid) || ownerName;

  await sendContactArray(conn, m.chat, [
    [
      ownerNumber,                          // Número del propietario
      `👑 ${currentOwnerName} 👑`,          // Nombre a mostrar para el propietario
      '⚡ Propietario Principal ⚡'         // Organización/descripción para el propietario
    ],
    [
      botJid.split('@')[0],                 // Número del bot
      '🤖 Es un Bot 🤖',                   // Nombre genérico para el bot
      '✨ Asistente Virtual ✨'             // Organización/descripción para el bot
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
  // Ahora data solo contendrá [number, displayName, organization]
  for (let [number, displayName, organization] of data) {
    number = number.replace(/[^0-9]/g, ''); // Asegurar que solo sean números
    let waid = number;
    let formattedPhoneNumber;
    try {
      if (number) { // Solo intentar formatear si hay un número
        formattedPhoneNumber = PhoneNumber('+' + number).getNumber('international');
      } else {
        formattedPhoneNumber = ''; // Evitar errores si el número es inválido o vacío
      }
    } catch (e) {
      formattedPhoneNumber = number ? '+' + number : ''; // Fallback
    }

    // vCard simplificado
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${displayName.replace(/\n/g, '\\n')};;;
FN:${displayName.replace(/\n/g, '\\n')}
ORG:${(organization || '').replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${waid}:${formattedPhoneNumber}
END:VCARD`.trim();

    contacts.push({ vcard, displayName: displayName });
  }
  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `👥 Contactos Clave` : contacts[0]?.displayName) || "Contacto",
      contacts,
    }
  }, {
    quoted,
    ...options
  });
}

