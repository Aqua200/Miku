import { watchFile as observeFileChanges, unwatchFile as stopObservingFileChanges } from 'fs';
import TerminalColors from 'chalk';
import { fileURLToPath as convertUrlToPath } from 'url';
import NodeFileSystem from 'fs';
import WebScraper from 'cheerio';
import DataFetcher from 'node-fetch';
import HttpRequest from 'axios';
import AdvancedDate from 'moment-timezone';

global.botIdentificationNumber = '';

global.botOwners = [
  ['5216631079388', '⚜️ Administrador Principal ⚜️', true],
];

global.moderatorUsers = [];
global.groupTagNotify = [];
global.premiumMembers = [];

global.botCoreDetails = {
  libraryUsed: 'Baileys',
  baileysVersion: 'V 6.7.16',
  scriptVersion: '2.2.1',
  qrIdentifier: '🌀 MikuBotQR 🌀',
  botNickname: '🌀 Hatsune Miku Bot 🌀',
  sessionFolderName: 'MikuAuthSessions',
  multiDeviceFolderName: 'SubBotsData',
  starlightMode: true,
};

global.brandAssets = {
  defaultStickerPack: '⭐ Miku Creations ⭐',
  botUserName: '⭐ Miku Chan ⭐',
  defaultWaterMark: '⭐ Miku WM ⭐',
  stickerCreator: 'Neykoor & MikuDevs',
  developmentCredit: 'Neykoor Technologies',
  signatureText: 'MikuBot x Neykoor',
  tagIdentifier: '🏷️ MikuTag 🏷️',
};

global.localizationSettings = {
  currencyName: 'Yenes',
  welcomeMessageTemplate: '🔔 Modificar con .setwelcome',
  goodbyeMessageTemplate: '👋 Modificar con .setbye',
  profileBannerUrl: 'https://files.catbox.moe/xicfbv.jpg',
  profileAvatarUrl: 'https://files.catbox.moe/z2n6z9.jpg',
};

global.externalLinks = {
  primaryGroup: 'https://chat.whatsapp.com/BCKgflZ3LPT50NpwcFQu91',
  communityHub: 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa',
  mainChannel: 'https://whatsapp.com/channel/0029VazHywx0rGiUAYluYB24',
  backupChannel: 'https://whatsapp.com/channel/0029VazHywx0rGiUAYluYB24',
  repositoryUrl: 'https://github.com/Aqua200/Miku.git',
  contactEmail: 'chinquepapa@gmail.com',
  newsFeed: 'https://whatsapp.com/channel/0029VazHywx0rGiUAYluYB24',
};

global.botResources = {
  productCatalogVisual: NodeFileSystem.readFileSync('./src/catalogo.jpg'),
  messageVisualStyle: {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...({ remoteJid: "5219992095479-1625305606@g.us" } || {})
    },
    message: {
      orderMessage: {
        itemCount: -999999,
        status: 1,
        surface: 1,
        message: global.brandAssets.defaultStickerPack,
        orderTitle: 'Bang',
        thumbnail: NodeFileSystem.readFileSync('./src/catalogo.jpg'),
        sellerJid: '0@s.whatsapp.net'
      }
    }
  },
  newsletterSource: {
    principal: '120363392571425662@newsletter',
  },
  xpMultiplier: 80,
};

global.ScraperUtil = WebScraper;
global.FileManager = NodeFileSystem;
global.NetFetcher = DataFetcher;
global.ApiClient = HttpRequest;
global.TimeHandler = AdvancedDate;

constconfigFileToWatch = convertUrlToPath(import.meta.url);

observeFileChanges(configFileToWatch, async (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    stopObservingFileChanges(configFileToWatch);
    console.log(TerminalColors.magentaBright(`[CONFIG UPDATE] El archivo 'settings.js' ha sido modificado. Recargando...`));
    await import(`${convertUrlToPath(import.meta.url)}?version=${Date.now()}`);
  }
});

console.log(TerminalColors.green('Configuraciones personalizadas cargadas.'));
