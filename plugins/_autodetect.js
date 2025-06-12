import baileys, { WAMessageStubType as BaileysWAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const botUser = conn.user;
  const botJid = botUser.id.split('@')[0].split(':')[0]; // Número del bot sin @s.whatsapp.net
  const botName = botUser.name || conn.user.verifiedName || conn.user.notify || 'Bot';

  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        displayName: botName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${botName};;;\nFN:${botName}\nitem1.TEL;waid=${botJid}:${botJid}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };

  let chat = global.db.data.chats[m.chat];
  if (!chat) global.db.data.chats[m.chat] = {};
  chat = global.db.data.chats[m.chat];

  
  const getUserMention = (jid) => {
    if (!jid) return 'Desconocido';
    const user = global.db.data.users[jid];
    
    return user?.name || conn.getName(jid) || `@${jid.split('@')[0]}`;
  };

  
  const actorUserJid = m.sender;
  const actorUserName = getUserMention(actorUserJid); 

  
  let targetUserJid = null;
  let targetUserName = 'Alguien';

  if (m.messageStubParameters && m.messageStubParameters.length > 0) {
    const firstParam = m.messageStubParameters[0];
    if (typeof firstParam === 'string' && firstParam.includes('@')) {
      
      if (
        m.messageStubType === BaileysWAMessageStubType.GROUP_PARTICIPANT_ADD ||
        m.messageStubType === BaileysWAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
        m.messageStubType === BaileysWAMessageStubType.GROUP_PARTICIPANT_PROMOTE ||
        m.messageStubType === BaileysWAMessageStubType.GROUP_PARTICIPANT_DEMOTE
      ) {
        targetUserJid = firstParam;
        targetUserName = getUserMention(targetUserJid); // Nombre o @numero del afectado
      }
    }
  }
  
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  
  const eventos = {
    [BaileysWAMessageStubType.GROUP_CHANGE_SUBJECT]: {
      mensaje: `Cambio de Nombre del Grupo《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Nuevo nombre:\n> » *${m.messageStubParameters[0]}*\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: []
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_ICON]: {
      mensaje: `Cambio de Imagen del Grupo《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'imagen',
      imagen: pp,
      mencionesAdicionales: []
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_DESCRIPTION]: {
      mensaje: `Cambio de Descripción del Grupo《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Nueva descripción:\n> » ${m.messageStubParameters?.[0] || 'Descripción no disponible'}\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: []
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_RESTRICT]: {
      mensaje: `Ajustes de Grupo Modificados《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Ahora ${m.messageStubParameters[0] == 'on' || m.messageStubParameters[0] === true ? '*solo administradores*' : '*todos los participantes*'} pueden editar la información del grupo.\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: []
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_ANNOUNCE]: {
      mensaje: `Ajustes de Envío de Mensajes《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ El grupo ha sido ${m.messageStubParameters[0] == 'on' || m.messageStubParameters[0] === true ? '*CERRADO*' : '*ABIERTO*'}.\n> ✧ Ahora ${m.messageStubParameters[0] == 'on' || m.messageStubParameters[0] === true ? '*solo administradores*' : '*todos los participantes*'} pueden enviar mensajes.\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: []
    },
    [BaileysWAMessageStubType.GROUP_PARTICIPANT_PROMOTE]: {
      mensaje: ` @${m.messageStubParameters[0].split`@`[0]} Ahora es admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: targetUserJid ? [targetUserJid] : []
    },
    [BaileysWAMessageStubType.GROUP_PARTICIPANT_DEMOTE]: {
      mensaje: `Admin Degradado《✦》\n\n> ✧ Usuario degradado:\n> » ${targetUserName}\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: targetUserJid ? [targetUserJid] : []
    },
    
    [BaileysWAMessageStubType.GROUP_CHANGE_INVITE_LINK]: { // Esta es la constante más probable para el cambio de enlace
      mensaje: `Enlace del Grupo Restablecido《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: []
    }
  };
  
  
  if (m.messageStubType === 23 && !eventos[BaileysWAMessageStubType.GROUP_CHANGE_INVITE_LINK]) {
    
    eventos[23] = { 
      mensaje: `Enlace del Grupo Modificado/Restablecido《✦》\n\n> ✧ Acción hecha por:\n> » ${actorUserName}\n\n> ✧ Bot detector: @${botJid}`,
      tipo: 'texto',
      mencionesAdicionales: []
    };
  }


  const isDetectEnabled = chat && (typeof chat.detect === 'boolean' ? chat.detect : (chat.detect !== 'false' && chat.detect !== false));

  if (isDetectEnabled && eventos[m.messageStubType]) {
    const evento = eventos[m.messageStubType];
    
    
    let finalMentions = [actorUserJid, botUser.id]; 

    
    if (evento.mencionesAdicionales && evento.mencionesAdicionales.length > 0) {
      finalMentions.push(...evento.mencionesAdicionales.filter(jid => jid)); 
    }
    
    
    finalMentions = [...new Set(finalMentions.filter(jid => typeof jid === 'string' && jid.includes('@')))];

    if (evento.tipo === 'texto') {
      await conn.sendMessage(m.chat, {
        text: evento.mensaje,
        mentions: finalMentions
      }, { quoted: fkontak });
    } else if (evento.tipo === 'imagen') {
      await conn.sendMessage(m.chat, {
        image: { url: evento.imagen },
        caption: evento.mensaje,
        mentions: finalMentions
      }, { quoted: fkontak });
    }
  }
}
