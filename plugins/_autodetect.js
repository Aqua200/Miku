import baileys from '@whiskeysockets/baileys';

const WAMessageStubType = baileys.default;

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };

  let chat = global.db.data.chats[m.chat];
  let usuario = participants.find(p => p.id === m.sender)?.name || `@${m.sender.split`@`[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  let eventos = {
    21: {
      mensaje: `《✦》${usuario} Ha cambiado el nombre del grupo.\n\n> ✧ Ahora el grupo se llama:\n> *${m.messageStubParameters[0]}*`,
      tipo: 'texto'
    },
    22: {
      mensaje: `《✦》Se ha cambiado la imagen del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'imagen',
      imagen: pp
    },
    23: {
      mensaje: `《✦》El enlace del grupo ha sido restablecido.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'texto'
    },
    24: {
      mensaje: `《✦》Se ha modificado la descripción del grupo.\n\n> ✧ Usuario:\n> » ${usuario}\n\n> ✧ Nueva descripción:\n> ${m.messageStubParameters?.[0] || 'Descripción no disponible'}`,
      tipo: 'texto'
    },
    25: {
      mensaje: `《✦》${usuario} Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`,
      tipo: 'texto'
    },
    26: {
      mensaje: `《✦》El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'} Por ${usuario}\n\n> ✧ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`,
      tipo: 'texto'
    },
    29: {
      mensaje: `《✦》${participants.find(p => p.id === m.messageStubParameters[0])?.name || `@${m.messageStubParameters[0].split`@`[0]}`} Ahora es admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'texto'
    },
    30: {
      mensaje: `《✦》${participants.find(p => p.id === m.messageStubParameters[0])?.name || `@${m.messageStubParameters[0].split`@`[0]}`} Deja de ser admin del grupo.\n\n> ✧ Acción hecha por:\n> » ${usuario}`,
      tipo: 'texto'
    }
  };

  if (chat.detect && eventos[m.messageStubType]) {
    let evento = eventos[m.messageStubType];
    if (evento.tipo === 'texto') {
      await conn.sendMessage(m.chat, {
        text: evento.mensaje,
        mentions: [m.sender]
      }, { quoted: fkontak });
    } else if (evento.tipo === 'imagen') {
      await conn.sendMessage(m.chat, {
        image: { url: evento.imagen },
        caption: evento.mensaje,
        mentions: [m.sender]
      }, { quoted: fkontak });
    }
  }
}
