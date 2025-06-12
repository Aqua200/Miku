import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts?.img ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
  if (m.sender === conn.user?.jid) return // Ignorar mensajes del bot

  const getNumber = (jid) => {
    try {
      return PhoneNumber('+' + jid.replace(/@.+/, '')).getNumber('international')
    } catch {
      return '+' + jid.replace(/@.+/, '')
    }
  }

  const oraColombia = new Date().toLocaleString('it-IT', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  const sender = getNumber(m.sender)
  const _name = await conn.getName(m.sender).catch(() => '')
  const chat = await conn.getName(m.chat).catch(() => '')
  const me = getNumber(conn.user?.jid || '')

  let filesize = (() => {
    if (!m.msg) return m.text?.length || 0
    if (m.msg.vcard) return m.msg.vcard.length
    if (m.msg.fileLength) return m.msg.fileLength.low || m.msg.fileLength
    if (m.msg.axolotlSenderKeyDistributionMessage)
      return m.msg.axolotlSenderKeyDistributionMessage.length
    return m.text?.length || 0
  })()

  const user = global.db?.data?.users?.[m.sender] || {}
  const chatName = m.isGroup ? 'Grupo: ' + chat : 'Chat privado: ' + chat

  const unit = ['', 'K', 'M', 'G', 'T', 'P']
  const size = filesize > 0
    ? `${(filesize / 1000 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)}${unit[Math.floor(Math.log(filesize) / Math.log(1000))]}B`
    : '0B'

  console.log(`${chalk.black(chalk.bgCyanBright(`${me} ~${conn.user.name}`))} ${chalk.cyanBright(oraColombia)}

❍ㅤ- ${chalk.cyanBright(m.messageStubType || 'WAMessageStubType')}
⌨ - ${chalk.cyanBright(`${filesize} [${size}]`)}
✦ - ${chalk.white(`${sender}${_name ? ' ~' + _name : ''}`)}
⎗ -ㅤ${chalk.cyanBright(`${m.exp || '?'}${user ? '|' + user.exp + '|' + user.limit : ''}${'|' + user.level}`)}
❑ -ㅤ${chalk.cyanBright(chatName)}
⎙ -ㅤ${chalk.cyanBright(m.mtype?.replace(/message$/i, '').replace('audio', m.msg?.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) || '')}
`)

  if (global.opts?.img && /sticker|image/gi.test(m.mtype)) {
    try {
      const img = await terminalImage.buffer(await m.download())
      if (img) console.log(img.trimEnd())
    } catch (e) {
      console.error(e)
    }
  }

  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
    const mdFormat = (depth = 4) => (_, type, text, mono) => {
      const styles = { _: 'italic', '*': 'bold', '~': 'strikethrough' }
      text = text || mono
      return !styles[type] || depth < 1 ? text : chalk[styles[type]](text.replace(mdRegex, mdFormat(depth - 1)))
    }

    if (log.length < 4096) {
      log = log.replace(urlRegex, (url, i, text) => {
        const end = url.length + i
        return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url
      })
    }

    log = log.replace(mdRegex, mdFormat(4))

    if (m.mentionedJid) {
      for (const jid of m.mentionedJid) {
        const mentionName = await conn.getName(jid).catch(() => jid.split('@')[0])
        log = log.replace('@' + jid.split('@')[0], chalk.blueBright('@' + mentionName))
      }
    }

    console.log(m.error ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
  }

  if (m.messageStubParameters) {
    console.log(m.messageStubParameters.map(jid => {
      jid = conn.decodeJid(jid)
      const name = conn.getName(jid).catch(() => '')
      const phone = getNumber(jid)
      return name ? chalk.gray(`${phone} (${name})`) : ''
    }).filter(Boolean).join(', '))
  }

  if (/document/i.test(m.mtype)) console.log(`⌦ ${m.msg.fileName || m.msg.displayName || 'Documento'}`)
  else if (/ContactsArray/i.test(m.mtype)) console.log(`᯼ ${' '}`)
  else if (/contact/i.test(m.mtype)) console.log(`✎ ${m.msg.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds || 0
    console.log(`${m.msg.ptt ? '⸙ㅤ(PTT ' : '🎵ㅤ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`)
  }

  console.log()
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})
