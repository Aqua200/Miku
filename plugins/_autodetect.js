import baileys, { WAMessageStubType as BaileysWAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const botUser = conn.user;
  const botJid = botUser.id.split('@')[0].split(':')[0];
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

  const getUserName = (jid) => {
    if (!jid) return 'Desconocido';
    return conn.getName(jid) || `@${jid.split('@')[0]}`;
  };

  let usuario = getUserName(m.sender);
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  let mentions = [m.sender];
  let targetUserJid, targetUserName;

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
        targetUserName = getUserName(targetUserJid);
      }
    }
  }

  let eventos = {
    [BaileysWAMessageStubType.GROUP_CHANGE_SUBJECT]: {
      mensaje: `《✦》${usuario} Ha cambiado el nombre del grupo.\n\n> ✧ Ahora el grupo se llama:\n> *${m.messageStubParameters[0]}*`,
      tipo: 'texto'
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_ICON]: {
      mensaje: `《✦》Se ha cambiado la imagen del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'imagen',
      imagen: pp
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_DESCRIPTION]: {
      mensaje: `《✦》Se ha modificado la descripción del grupo.\n\n> ✧ Usuario:\n> » ${usuario}\n\n> ✧ Nueva descripción:\n> ${m.messageStubParameters?.[0] || 'Descripción no disponible'}`,
      tipo: 'texto'
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_RESTRICT]: {
      mensaje: `《✦》${usuario} Ha permitido que ${m.messageStubParameters[0] == 'on' || m.messageStubParameters[0] === true ? 'solo admins' : 'todos'} puedan configurar el grupo.`,
      tipo: 'texto'
    },
    [BaileysWAMessageStubType.GROUP_CHANGE_ANNOUNCE]: {
      mensaje: `《✦》El grupo ha sido ${m.messageStubParameters[0] == 'on' || m.messageStubParameters[0] === true ? '*cerrado*' : '*abierto*'} Por ${usuario}\n\n> ✧ Ahora ${m.messageStubParameters[0] == 'on' || m.messageStubParameters[0] === true ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`,
      tipo: 'texto'
    },
    [BaileysWAMessageStubType.GROUP_PARTICIPANT_PROMOTE]: {
      mensaje: `《✦》${targetUserName || (m.messageStubParameters[0] ? `@${m.messageStubParameters[0].split('@')[0]}` : 'Alguien')} Ahora es admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'texto',
      mencionesAdicionales: targetUserJid ? [targetUserJid] : []
    },
    [BaileysWAMessageStubType.GROUP_PARTICIPANT_DEMOTE]: {
      mensaje: `《✦》${targetUserName || (m.messageStubParameters[0] ? `@${m.messageStubParameters[0].split('@')[0]}` : 'Alguien')} Deja de ser admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'texto',
      mencionesAdicionales: targetUserJid ? [targetUserJid] : []
    }
  };

  if (m.messageStubType === 23) {
    eventos[23] = {
      mensaje: `《✦》El enlace del grupo ha sido restablecido.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'texto'
    };
  }

  const isDetectEnabled = chat && (typeof chat.detect === 'boolean' ? chat.detect : (chat.detect !== 'false' && chat.detect !== false));

  if (isDetectEnabled && eventos[m.messageStubType]) {
    let evento = eventos[m.messageStubType];
    let finalMentions = [m.sender];

    if (evento.mencionesAdicionales && evento.mencionesAdicionales.length > 0) {
      finalMentions.push(...evento.mencionesAdicionales);
    }

    finalMentions = [...new Set(finalMentions.filter(jid => typeof jid === 'string'))];

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
