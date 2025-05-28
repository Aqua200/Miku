

import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎨';
  const emoji2 = '⏳';
  const errorEmoji = '❌';
  const defaultMsg = `${emoji} *Uso correcto:* ${usedPrefix + command} <descripción>`;

  if (!args.length) {
    return conn.reply(m.chat, defaultMsg, m);
  }

  const prompt = args.join(' ').trim();
  const apiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`;

  try {
    await conn.reply(m.chat, `${emoji2} *Generando imagen, por favor espera...*`, m);

    const { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await conn.sendMessage(
      m.chat,
      { image: Buffer.from(data), caption: `${emoji} *Imagen generada con éxito.*` },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error al generar la imagen:', error);
    await conn.reply(m.chat, `${errorEmoji} *Ocurrió un error al generar la imagen. Intenta más tarde.*`, m);
  }
};

handler.command = ['dalle'];
handler.help = ['dalle <descripción>'];
handler.tags = ['tools'];

export default handler;
