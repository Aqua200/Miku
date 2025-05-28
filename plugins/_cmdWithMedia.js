import baileys from '@whiskeysockets/baileys'
import { proto, generateWAMessage, areJidsSameUser } from '@whiskeysockets/baileys'

interface MessageData {
  isBaileys: boolean
  message?: any
  msg?: {
    fileSha256?: Buffer
  }
  chat: string
  sender: string
  key: { id: string }
  quoted?: { fakeObj?: any }
  isGroup: boolean
  pushName: string
}

interface ChatUpdate {
  [key: string]: any
}

interface StickerData {
  text: string
  mentionedJid: string[]
}

export async function all(this: any, m: MessageData, chatUpdate: ChatUpdate): Promise<void> {
  if (m.isBaileys || !m.message || !m.msg?.fileSha256) return

  const fileHash = m.msg.fileSha256.toString('base64')
  const stickerDatabase = global.db?.data?.sticker || {}

  if (!(fileHash in stickerDatabase)) return

  const { text, mentionedJid }: StickerData = stickerDatabase[fileHash]

  try {
    const generated = await generateWAMessage(
      m.chat,
      { text, mentions: mentionedJid },
      {
        userJid: this.user.id,
        quoted: m.quoted?.fakeObj
      }
    )

    generated.key.fromMe = areJidsSameUser(m.sender, this.user.id)
    generated.key.id = m.key.id
    generated.pushName = m.pushName

    if (m.isGroup) {
      generated.participant = m.sender
    }

    const messageObject = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(generated)],
      type: 'append'
    }

    this.ev.emit('messages.upsert', messageObject)

  } catch (err) {
    console.error('[Error generando mensaje automático]:', err)
  }
}
