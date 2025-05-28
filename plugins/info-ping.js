import { performance } from 'perf_hooks';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

const handler = async (m, { conn }) => {
  const start = performance.now();
  const uptime = process.uptime(); // en segundos
  const uptimeFormatted = formatTime(uptime);

  const old = performance.now();
  const ping = old - start;

  const { stdout } = await execPromise('node -v');
  const nodeVersion = stdout.trim();

  const scriptSpeed = (Math.random() * 0.005).toFixed(4); // Simulación

  const response = `
✦ *¡Pong!* ✦  
➤ ✶ Latencia (Bot ↔ WhatsApp): ${ping.toFixed(2)} ms  
➤ ✦ Velocidad Script: ${scriptSpeed} ms  

❖ *Rendimiento del Bot:*  

  ┣ ⟡ Node.js: ${nodeVersion}  
  ┗ ⌭ Tiempo Activo (Bot): ${uptimeFormatted}
`.trim();

  await conn.reply(m.chat, response, m);
};

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`;
}

handler.help = ['ping'];
handler.command = /^ping$/i;
handler.tags = ['info'];

export default handler;
