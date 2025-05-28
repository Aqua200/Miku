import moment from 'moment-timezone';
import fetch from 'node-fetch';

// --- CONFIGURACIÓN / VARIABLES GLOBALES (ASEGÚRATE DE QUE ESTÉN DEFINIDAS) ---
const dev = 'Tu Nombre/Grupo Dev';
const packname = 'NombreDelPack';
const redes = 'https://tus.redes.sociales';
const msm = '[!]';
const error = '❌';
const fkontak = { key: {participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net"}, message: {"groupInviteMessage": {"groupJid": "51995386439-1616986525@g.us", "inviteCode": "m", "groupName": "P", "caption": packname, "jpegThumbnail": null}}};
const channelRD = {
    name: 'NombreDelCanalOficial',
    id: 'id_del_canal_oficial@newsletter'
};
// --- FIN DE CONFIGURACIÓN ---

const GITHUB_REPO_URL = 'https://api.github.com/repos/Aqua200/Miku';

let handler = async (m, { conn, args }) => {
    try {
        const res = await fetch(GITHUB_REPO_URL);

        if (!res.ok) {
            throw new Error(`Error al obtener datos del repositorio: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();

        const {
            name,
            watchers_count,
            size,
            updated_at,
            html_url,
            forks_count,
            stargazers_count
        } = json;

        const txt = `*乂  S C R I P T  -  M A I N  乂*

✩  *Nombre* : ${name}
✩  *Visitas* : ${watchers_count}
✩  *Peso* : ${(size / 1024).toFixed(2)} MB
✩  *Actualizado* : ${moment(updated_at).format('DD/MM/YY - HH:mm:ss')}
✩  *Url* : ${html_url}
✩  *Forks* : ${forks_count}
✩  *Stars* : ${stargazers_count}

> *${dev}*`;

        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: channelRD.name,
                    newsletterJid: channelRD.id,
                },
                externalAdReply: {
                    title: packname,
                    body: dev,
                    thumbnailUrl: 'https://files.catbox.moe/s1bf95.jpg',
                    sourceUrl: redes,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: fkontak });

    } catch (err) {
        console.error('Error en el comando script:', err);
        await conn.reply(m.chat, `${msm} Ocurrió un error al obtener la información del script. Detalles: ${err.message}. Por favor, inténtalo de nuevo más tarde.`, m);
        await m.react(error);
    }
};

handler.help = ['script'];
handler.tags = ['main'];
handler.command = ['script', 'sc'];
handler.register = true;

export default handler;
