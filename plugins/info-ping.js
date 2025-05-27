import speed from 'performance-now';
import os from 'os';

let handler = async (m, { conn }) => {
    let botPing = 'N/A';
    if (m.messageTimestamp) {
        try {
            const messageTime = typeof m.messageTimestamp.low === 'number' && typeof m.messageTimestamp.high === 'number' ?
                                (m.messageTimestamp.low + (m.messageTimestamp.high * 4294967296)) * 1000 :
                                Number(m.messageTimestamp) * 1000;

            if (!isNaN(messageTime) && messageTime > 0) {
                botPing = (Date.now() - messageTime).toFixed(2) + ' ms';
            }
        } catch (e) {
            console.error("Error al procesar m.messageTimestamp:", e);
            if (typeof m.messageTimestamp === 'number') {
                 const messageTimeMs = m.messageTimestamp * 1000;
                 botPing = (Date.now() - messageTimeMs).toFixed(2) + ' ms';
            } else {
                 botPing = 'Error al calcular';
            }
        }
    } else {
        botPing = 'Timestamp no disponible';
    }

    let scriptExecutionStart = speed();
    let scriptSpeed = (speed() - scriptExecutionStart).toFixed(4) + ' ms';

    const cpus = os.cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
        return cpu;
    });

    const cpu = cpus[0];
    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();
    const uptime = os.uptime();

    let systemInfoText = `💻 *Información del Sistema (Node.js):*\n`;
    systemInfoText += `> OS: ${os.type()} (${os.platform()})\n`;
    systemInfoText += `> Arch: ${os.arch()}\n`;
    systemInfoText += `> CPU: ${cpu ? cpu.model : 'N/A'}\n`;
    systemInfoText += `> RAM Total: ${(totalRAM / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    systemInfoText += `> RAM Libre: ${(freeRAM / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    systemInfoText += `> Uptime: ${formatUptime(uptime)}\n`;


    const responseText = `✰ *¡Pong!*\n` +
                       `> 応答 (Bot a WhatsApp): ${botPing}\n` +
                       `> Velocidad Script: ${scriptSpeed}\n\n` +
                       `${systemInfoText.trim()}`;

    conn.reply(m.chat, responseText, m);
};

function formatUptime(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var secs = Math.floor(seconds % 60);

    return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
}

handler.help = ['ping', 'speed', 'p'];
handler.tags = ['info'];
handler.command = ['ping', 'speed', 'p'];
handler.register = true;

export default handler;
