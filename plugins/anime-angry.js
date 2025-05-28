/*
❀ Código creado por Destroy
✧ https://github.com/The-King-Destroy/Yuki_Suou-Bot.git
*/

let handler = async (m, { conn }) => {
  let who = m.mentionedJid.length > 0 
    ? m.mentionedJid[0] 
    : (m.quoted ? m.quoted.sender : m.sender)

  let name = conn.getName(who)
  let name2 = conn.getName(m.sender)

  let str = m.mentionedJid.length > 0 || m.quoted 
    ? `\`${name2}\` está enojado/a con \`${name || who}\` 凸ಠ益ಠ)凸` 
    : `\`${name2}\` está enojado/a 凸ಠ益ಠ)凸`

  if (m.isGroup) {
    const videos = [
      'https://files.catbox.moe/dnk7oc.mp4',
      // Agrega más URLs si deseas variedad
    ]

    const video = videos[Math.floor(Math.random() * videos.length)]

    await conn.sendMessage(m.chat, {
      video: { url: video },
      gifPlayback: true,
      caption: str,
      mentions: [who]
    }, { quoted: m })
  }
}

handler.help = ['angry']
handler.tags = ['anime']
handler.command = ['angry', 'enojado']
handler.group = true

export default handler
