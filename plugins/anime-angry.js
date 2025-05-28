/* 
❀ Codígo creado por Destroy
✧ https://github.com/The-King-Destroy/Yuki_Suou-Bot.git 
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `\`${name2}\` está enojado/a \`${name || who}\` 凸ಠ益ಠ)凸` 
        : `\`${name2}\` está enojado/a 凸ಠ益ಠ)凸`
    
    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/dnk7oc.mp4'
        let pp2 = ''
        let pp3 = ''
        let pp4 = ''
        let pp5 = ''
        let pp6 = ''
        let pp7 = ''
        let pp8 = ''
        let pp9 = ''
        let pp10 = ''
        let pp11 = ''
        let pp12 = ''
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['angry']
handler.tags = ['anime']
handler.command = ['angry', 'enojado']
handler.group = true

export default handler
