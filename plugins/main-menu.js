let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = await conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let txt = `
╭─❀｡ﾟ･ ୨୧ *${botname}* ୨୧ ･ﾟ｡❀─╮
│ Konnichiwa, *${name}*~!
│ Bienvenido a tu espacio personal.
╰──────────────╯

╭─────〔 ✧ ESTADO ✧ 〕─────╮
│✦ Cliente: @${userId.split('@')[0]}
│✦ Modo: Público
│✦ Bot: ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Sub-Bot 🅑')}
│✦ Activa: ${uptime}
│✦ Usuarios: ${totalreg}
│✦ Comandos: ${totalCommands}
│✦ Motor: Baileys-MD
╰────────────────────────╯

╭─〔 ✿ Crear tu Sub-Bot ✿ 〕─╮
│ Usa *#qr* o *#code*
╰──────────────────────────╯

『 Info del bot』

・ *#menu* o *#help*  
↳ Lista completa de comandos.

・ *#uptime*  
↳ Tiempo que llevo activa.

・ *#sc* o *#script*  
↳ Mira mi código fuente.
`.trim()

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
                title: botname,
                body: textbot,
                thumbnailUrl: banner,
                sourceUrl: redes,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${h}h ${m}m ${s}s`
}
