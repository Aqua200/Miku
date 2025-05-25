import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['5216631079388', '🜲 Propietario 🜲', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = [] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = '❥♡ﮩﮩ٨ــﮩـــ𝙷𝚊𝚝𝚜𝚞𝚗𝚎 𝚖𝚒𝚔𝚞❥'
global.namebot = '❥♡ﮩﮩ٨ــﮩـــ𝙷𝚊𝚝𝚜𝚞𝚗𝚎 𝚖𝚒𝚔𝚞❥'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.Starlights = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '✿◟𝚖𝚒𝚔𝚞◞✿'
global.botname = '✿◟𝚖𝚒𝚔𝚞◞✿'
global.wm = '✿◟𝚖𝚒𝚔𝚞◞✿'
global.author = '𝙽𝚎𝚢𝚔𝚘𝚘𝚛 𝚡 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙'
global.dev = '𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝙽𝚎𝚢𝚔𝚘𝚘𝚛'
global.textbot = '𝙼𝚒𝚔𝚞 𝚡 𝙽𝚎𝚢𝚔𝚘𝚘𝚛'
global.etiqueta = '𝙼𝚒𝚔𝚞 𝚡 𝙽𝚎𝚢𝚔𝚘𝚘𝚛'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '¥enes'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://files.catbox.moe/xicfbv.jpg'
global.avatar = 'https://files.catbox.moe/z2n6z9.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/BCKgflZ3LPT50NpwcFQu91'
global.comunidad1 = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
global.channel = 'https://whatsapp.com/channel/0029VazHywx0rGiUAYluYB24'
global.channel2 = 'https://whatsapp.com/channel/0029VazHywx0rGiUAYluYB24'
global.md = 'https://github.com/Aqua200/Miku.git'
global.correo = 'chinquepapa@gmail.com'
global.cn ='https://whatsapp.com/channel/0029VazHywx0rGiUAYluYB24';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363392571425662@newsletter',
}
global.multiplier = 70

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
