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

    const cpus = os.cpus();
    const cpuModel = cpus && cpus.length > 0 ? cpus[0].model : 'N/A';
    const numCores = cpus ? cpus.length : 'N/A';

    // System RAM
    const totalRAMBytes = os.totalmem();
    const freeRAMBytes = os.freemem();
    const usedRAMBytes = totalRAMBytes - freeRAMBytes;

    // Process RAM (Bot's own memory usage)
    const processMemoryUsage = process.memoryUsage();

    const systemUptimeSeconds = os.uptime();
    const processUptimeSeconds = process.uptime();

    const loadAvg = os.loadavg().map(avg => avg.toFixed(2)).join(', ');

    const nodeVersion = process.version;
    const hostname = os.hostname();

    let systemInfoText = `💻 *Estadísticas del Servidor*\n\n`;
    systemInfoText += `OS: ${os.type()} ${os.release()} (${os.platform()})\n`;
    systemInfoText += `Arquitectura: ${os.arch()}\n`;
    systemInfoText += `Hostname: ${hostname}\n`;
    systemInfoText += `\n🧠 *CPU:*\n`;
    systemInfoText += `  Modelo: ${cpuModel}\n`;
    systemInfoText += `  Núcleos: ${numCores}\n`;
    systemInfoText += `  Carga Promedio: ${loadAvg} (1m, 5m, 15m)\n`; // Note: os.loadavg() returns [0,0,0] on Windows
    systemInfoText += `\n💾 *RAM del Sistema:*\n`;
    systemInfoText += `  Total: ${(totalRAMBytes / 1024 / 1024 / 1024).toFixed(2)} GiB\n`;
    systemInfoText += `  Usada: ${(usedRAMBytes / 1024 / 1024 / 1024).toFixed(2)} GiB (${((usedRAMBytes / totalRAMBytes) * 100).toFixed(1)}%)\n`;
    systemInfoText += `  Libre: ${(freeRAMBytes / 1024 / 1024 / 1024).toFixed(2)} GiB\n`;
    systemInfoText += `\n📊 *Uso de Memoria del Bot (Proceso Node.js):*\n`;
    systemInfoText += `  RSS (Residente): ${(processMemoryUsage.rss / 1024 / 1024).toFixed(2)} MiB\n`;
    systemInfoText += `  Heap Total: ${(processMemoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MiB\n`;
    systemInfoText += `  Heap Usado: ${(processMemoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MiB\n`;
    systemInfoText += `  Externo (C++): ${(processMemoryUsage.external / 1024 / 1024).toFixed(2)} MiB\n`;
    systemInfoText += `\n⏱️ *Tiempos Activo:*\n`;
    systemInfoText += `  Sistema: ${formatUptime(systemUptimeSeconds)}\n`;
    systemInfoText += `  Bot: ${formatUptime(processUptimeSeconds)}\n`;
    systemInfoText += `\n🔧 *Entorno:*\n`;
    systemInfoText += `  Node.js: ${nodeVersion}\n`;


    const responseText = `✰ *¡Pong!* ✰\n` +
                       `> 🏓 Latencia (Bot ↔️ WhatsApp): ${botPing}\n` +
                       `> ⚡ Velocidad Script: ${scriptSpeed}\n\n` +
                       `${systemInfoText.trim()}`;

    conn.reply(m.chat, responseText, m);
};

function formatUptime(seconds) {
    seconds = Number(seconds);
    if (isNaN(seconds) || seconds < 0) return 'N/A';

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + (d === 1 ? " día" : " días") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " hora" : " horas") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " minuto" : " minutos") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " segundo" : " segundos") : "";

    const parts = [dDisplay, hDisplay, mDisplay, sDisplay].filter(Boolean);

    if (parts.length === 0) return "Ahora mismo";
    if (parts.length === 1) return parts[0];

    const lastPart = parts.pop();
    return parts.join(', ') + (parts.length > 0 ? ' y ' : '') + lastPart;
}

handler.help = ['ping', 'speed', 'p', 'status', 'estado'];
handler.tags = ['info', 'main'];
handler.command = ['ping', 'speed', 'p', 'status', 'estado'];
handler.register = true;

export default handler;
