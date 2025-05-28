import baileys from '@whiskeysockets/baileys'
const { proto, generateWAMessage, areJidsSameUser } = baileys.default

export async function all(m, chatUpdate) {
  if (m.isBaileys || !m.message || !m.msg?.fileSha256) return

  const hash = Buffer.from(m.msg.fileSha256).toString('base64')
  const stickerData = global.db?.data?.sticker?.[hash]
  if (!stickerData) return

  const { text, mentionedJid } = stickerData

  try {
    const msg = await generateWAMessage(
      m.chat,
      { text, mentions: mentionedJid },
      {
        userJid: this.user.id,
        quoted: m.quoted?.fakeObj,
      }
    )

    msg.key.fromMe = areJidsSameUser(m.sender, this.user.id)
    msg.key.id = m.key.id
    msg.pushName = m.pushName
    if (m.isGroup) msg.participant = m.sender

    const payload = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(msg)],
      type: 'append',
    }

    this.ev.emit('messages.upsert', payload)
  } catch (e) {
    console.error('❌ Error al generar el mensaje automático:', e)
  }
}
