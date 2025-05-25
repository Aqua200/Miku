import db from '../lib/database.js';
import { createHash } from 'crypto';
import axios from 'axios';

const REGEX_REG = /\|?(.*)([.|] *?)([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
  if (!text) {
    return m.reply(`『✦』Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad*\nEjemplo: *${usedPrefix + command} Usuario.18*`);
  }

  const who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender;

  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg');
  const senderName = await conn.getName(m.sender).catch(() => 'Usuario');

  let user = global.db.data.users[m.sender] ??= {
    registered: false,
    coin: 0,
    exp: 0,
    joincount: 0,
  };

  if (user.registered === true) {
    return m.reply(`『✦』Ya estás registrado.\n\n*¿Quiere volver a registrarse?*\n\nUse este comando para eliminar su registro.\n*${usedPrefix}unreg*`);
  }

  if (!REGEX_REG.test(text)) {
    return m.reply(`『✦』Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad*\nEjemplo: *${usedPrefix + command} ${senderName}.18*`);
  }

  const match = text.match(REGEX_REG);
  const [_, nameRaw, , ageText] = match;

  if (!nameRaw || !nameRaw.trim()) return m.reply(`『✦』El nombre no puede estar vacío.`);
  const name = nameRaw.trim();

  if (!ageText) return m.reply(`『✦』La edad no puede estar vacía.`);
  const age = parseInt(ageText);

  if (name.length >= 100) return m.reply(`『✦』El nombre es demasiado largo.`);
  if (isNaN(age)) return m.reply(`『✦』La edad debe ser un número.`);
  if (age > 100) return m.reply(`『✦』Wow el abuelo quiere jugar al bot.`);
  if (age < 5) return m.reply(`『✦』hay un abuelo bebé jsjsj.`);

  user.name = name + '✓';
  user.age = age;
  user.regTime = Date.now();
  user.registered = true;
  user.sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20);

  user.coin += 40;
  user.exp += 300;
  user.joincount += 20;

  const moneda = global.moneda || 'COIN';
  const dev = global.dev || 'El Creador';
  const textbot = global.textbot || 'Tu Asistente Virtual';
  const channel = global.channel || 'https://www.youtube.com/channel/UCnK8V-2981L2CQq-B0SHAwA';

  const regbot = `
✦ 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗔 𝗗 𝗢 ✦
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
> ᰔᩚ Nombre » ${name}
> ✎ Edad » ${age} años
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
❀ 𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
> • ⛁ *${moneda}* » 40
> • ✰ *Experiencia* » 300
> • ❖ *Tokens* » 20
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
> ${dev}
  `.trim();

  await m.react('📩');

  const thumb = await axios.get(pp, { responseType: 'arraybuffer' }).then(res => res.data).catch(() => null);

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '✧ Usuario Verificado ✧',
        body: textbot,
        thumbnail: thumb ? Buffer.from(thumb) : null,
        sourceUrl: channel,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['reg <nombre.edad>'];
handler.tags = ['rg'];
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'];

export default handler;
