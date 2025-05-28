let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime); // Usará la nueva función clockString
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
    let botname = global.botname || conn.user.name || "MiLindaAsistente";

    let channelRD = global.channelRD || { id: '123456789@newsletter', name: '🌸 Mi Rincón Secreto 🌸' };
    let textbot = global.textbot || `Con cariño, de ${botname} para ti~ ✨`;
    let banner = global.banner || 'https://i.imgur.com/Ufxr0qH.jpeg'; // URL de un banner bonito (cambiado a una imagen de ejemplo)
    let redes = global.redes || 'https://linktr.ee/tu_bot'; // Enlace a tus redes o un linktree (cambiado para ser un placeholder)

    let txt = `
｡･ﾟﾟ･ sweetly greets 
@${userId.split('@')[0]} ･ﾟﾟ･｡
¡Holi! Soy
*${botname}* 

╭┈─────── ୨୧ ───────┈╮
┊  ❀  *Usuario:*  @${userId.split('@')[0]}
┊  ❀  *Modo:*  Público
┊  ❀  *Bot:*  ${(conn.user.jid == global.conn.user.jid ? 'Princesa Principal 👑' : 'Sub bot ✨')}
┊  ❀  *Activa Desde:*  ${uptime}
┊  ❀  *Comunidad:*  ${totalreg} usuarios 
┊  ❀  *Total de comandos:*  ${totalCommands}
┊  ❀  *Conexión:*  Baileys (Multi-Device)
╰┈─────── ୨୧ ───────┈╯

╭┈───── ୨♡୧ ─────┈╮
┊ *¿Como ser un sub-bot?* 
┊  Usa  ` + "`#qr`" + `  o  ` + "`#code`   " + `
┊  ¡Convierte en un sub-bot!
╰┈───── ୨♡୧ ─────┈╯

          𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 
 
 ୨♡୧  *#uptime • #runtime*
> ↳  Para saber cuánto tiempo llevo activa.

 ୨♡୧  *#sc • #script*
> ↳  mi repositorio oficial 

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
              title: `꧁༺🩵𝑴𝒊𝒌𝒖...𝑩𝒐𝒕🩵༻꧂`,
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

/**
 * Convierte milisegundos a una cadena de tiempo legible (Días, Horas, Minutos, Segundos)
 * @param {number} ms Milisegundos
 * @returns {string} Cadena de tiempo formateada
 */
function clockString(ms) {
    if (isNaN(ms) || ms < 0) {
        return '--'; // Retorna '--' si el valor no es un número o es negativo
    }

    const miliSegundosPorSegundo = 1000;
    const segundosPorMinuto = 60;
    const minutosPorHora = 60;
    const horasPorDia = 24;

    const miliSegundosPorMinuto = miliSegundosPorSegundo * segundosPorMinuto;
    const miliSegundosPorHora = miliSegundosPorMinuto * minutosPorHora;
    const miliSegundosPorDia = miliSegundosPorHora * horasPorDia;

    let d = Math.floor(ms / miliSegundosPorDia);
    let h = Math.floor((ms % miliSegundosPorDia) / miliSegundosPorHora);
    let m = Math.floor((ms % miliSegundosPorHora) / miliSegundosPorMinuto);
    let s = Math.floor((ms % miliSegundosPorMinuto) / miliSegundosPorSegundo);

    let parts = [];
    if (d > 0) parts.push(`${d} día${d > 1 ? 's' : ''}`);
    if (h > 0) parts.push(`${h} hora${h > 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} minuto${m > 1 ? 's' : ''}`);
    if (s > 0) parts.push(`${s} segundo${s > 1 ? 's' : ''}`);

    if (parts.length === 0) {
        return 'menos de un segundo';
    }

    return parts.join(', ');
}
