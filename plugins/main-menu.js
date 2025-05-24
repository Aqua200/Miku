let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    // let user = global.db.data.users[userId]; // No se usa directamente en txt
    // let name = conn.getName(userId); // Ya se usa
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
    let botname = global.botname || conn.user.name || "MiLindaAsistente"; // Nombre del bot

    // Variables para contextInfo (asegúrate que estén definidas globalmente)
    let channelRD = global.channelRD || { id: '123456789@newsletter', name: '🌸 Mi Rincón Secreto 🌸' };
    let textbot = global.textbot || `Con cariño, de ${botname} para ti~ ✨`;
    let banner = global.banner || 'https://url.to.your/feminine_banner.jpg'; // URL de un banner bonito
    let redes = global.redes || 'https://linktr.ee/yourbot'; // Enlace a tus redes o un linktree

    let txt = `
｡･ﾟﾟ･ sweetly greets @${userId.split('@')[0]} ･ﾟﾟ･｡
¡Holi! Soy *${botname}* (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
Tu asistente virtual lista para ayudarte con un toque de magia ~ 🎀

╭┈─────── ୨୧ ───────┈╮
┊ ｡ﾟﾟ･｡･ﾟﾟ｡  𝐈𝐍𝐅𝐎 𝐃𝐄 𝐋𝐀 𝐁𝐎𝐓  ｡ﾟﾟ･｡･ﾟﾟ｡
┊ ﾟ。       🌸        ｡ﾟ
┊      ﾟ･｡･ﾟ
┊  ❀  *Usuario:*  @${userId.split('@')[0]}
┊  ❀  *Modo:*  Público con ✨chispitas✨
┊  ❀  *Bot:*  ${(conn.user.jid == global.conn.user.jid ? 'Princesa Principal 👑' : 'Estrellita Ayudante ⭐')}
┊  ❀  *Activa Desde:*  ${uptime}
┊  ❀  *Comunidad:*  ${totalreg} usuarios bellos
┊  ❀  *Hechizos (Comandos):*  ${totalCommands}
┊  ❀  *Conexión Mágica:*  Baileys (Multi-Device)
╰┈─────── ୨୧ ───────┈╯

╭┈─── ୨♡୧ ───┈╮
┊  ✨ *Crea tu Propio Ayudante Mágico* ✨
┊  Usa  ` + "`#qr`" + `  o  ` + "`#code`" + `
┊  ¡Y ten un sub-bot tan lindo como yo!
╰┈─── ୨♡୧ ───┈╯

╭┈─────── ୨୧ ───────┈╮
┊ ｡ﾟﾟ･｡･ﾟﾟ｡  𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐄𝐒𝐄𝐍𝐂𝐈𝐀𝐋𝐄𝐒  ｡ﾟﾟ･｡･ﾟﾟ｡
┊ ﾟ。       💖        ｡ﾟ
┊      ﾟ･｡･ﾟ
┊  ୨♡୧  *#help • #menu*
┊        ↳  Muestra mi lista de encantos y comandos.
┊
┊  ୨♡୧  *#uptime • #runtime*
┊        ↳  Para saber cuánto tiempo llevo brillando.
┊
┊  ୨♡୧  *#sc • #script*
┊        ↳  ¿Curiosidad por mi magia interna? ¡Pregunta!
┊
╰┈─────── ୨୧ ───────┈╯

Espero que te guste mi menú, ¡hecho con mucho cariño! (｡˃ ᵕ ˂ )ﾉﾞ💖
`.trim();

  await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
              title: `🎀 ${botname} 🎀`,
              body: textbot,
              thumbnailUrl: banner,
              sourceUrl: redes,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m });

}

handler.help = ['menu', 'help']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']

export default handler;

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    // Devuelve un formato más amigable como "X horas, Y minutos, Z segundos"
    let H = h > 0 ? `${h} hora${h > 1 ? 's' : ''}, ` : '';
    let M = m > 0 ? `${m} minuto${m > 1 ? 's' : ''}, ` : '';
    let S = s > 0 ? `${s} segundo${s > 1 ? 's' : ''}` : '';
    let dura = H + M + S;
    return dura.replace(/, $/, '') || 'menos de un segundo'; // Elimina la última coma y espacio
}
