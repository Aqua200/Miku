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
  let botJid = conn.user.jid; 

  if (!botJid || !botJid.includes('@')) {
    console.error("Error: botJid no está disponible o es inválido:", botJid);
    // Considera asignar un valor por defecto si es crucial:
    // botJid = "0@s.whatsapp.net"; // Placeholder
  }
  
  let currentOwnerName = ownerName;
  try {
    currentOwnerName = await conn.getName(ownerJid) || ownerName;
  } catch (getNameError) {
    console.warn(`No se pudo obtener el nombre para ${ownerJid}. Usando nombre configurado. Error: ${getNameError.message}`);
  }

  const contactData = [
    [
      ownerNumber,                          
      `ᰔᩚ Propietario (${currentOwnerName})`, 
      '❀ No Hacer Spam'                     
    ]
  ];

  const botNumber = botJid ? botJid.split('@')[0] : null;
  if (botNumber && botNumber !== "0") { 
    contactData.push([
      botNumber,                            
      '✦ Bot Asistente',                    
      '✨ Asistente Virtual ✨'              
    ]);
  } else {
    console.warn("No se pudo obtener el número del bot, no se añadirá su contacto.");
  }

  if (contactData.length > 0) {
    await sendContactArray(conn, m.chat, contactData, m);
  } else {
    m.reply("No se pudieron preparar los datos de contacto.");
  }
}

handler.help = ["creador", "owner"];
handler.tags = ["info"];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
  
  let contacts = [];
  
  for (let [numberInput, displayName, organization] of data) {
    const cleanedNumber = String(numberInput || '').replace(/[^0-9]/g, '');
    
    if (!cleanedNumber) {
      console.warn(`Número vacío o inválido proporcionado para '${displayName}'. Saltando este contacto.`);
      continue;
    }

    let waid = cleanedNumber; 
    let formattedPhoneNumber;

    try {
      const pnInstance = new PhoneNumber('+' + cleanedNumber); 
      
      if (pnInstance.isValid()) {
        formattedPhoneNumber = pnInstance.getNumber('international');
      } else {
        formattedPhoneNumber = '+' + cleanedNumber;
        console.warn(`[!] El número +${cleanedNumber} (para ${displayName}) no es válido. Usando fallback: ${formattedPhoneNumber}`);
      }
    } catch (e) {
      console.error(`[!] Error al formatear el número '+${cleanedNumber}' (para ${displayName}):`, e.message);
      formattedPhoneNumber = '+' + cleanedNumber; 
    }

    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${displayName.replace(/\n/g, '\\n')};;;
FN:${displayName.replace(/\n/g, '\\n')}
ORG:${(organization || '').replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${waid}:${formattedPhoneNumber || ('+' + waid)}
END:VCARD`.trim();

    contacts.push({ vcard, displayName: displayName });
  }

  if (contacts.length === 0) {
    console.warn("No se generaron contactos válidos para enviar.");
    return;
  }

  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `👥 Contactos Clave (${contacts.length})` : contacts[0]?.displayName) || "Contacto",
      contacts, 
    }
  }, {
    quoted,
    ...options
  });
}
