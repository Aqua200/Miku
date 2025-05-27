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

    // --- Información del Sistema Mejorada ---
    const cpus = os.cpus();
    const cpuModel = cpus && cpus.length > 0 ? cpus[0].model : 'N/A';
    const numCores = cpus ? cpus.length : 'N/A';
    
    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();
    const usedRAM = totalRAM - freeRAM;
    
    const uptime = os.uptime();
    const loadAvg = os.loadavg().map(avg => avg.toFixed(2)).join(', '); // Promedio de carga (1m, 5m, 15m)
    
    const nodeVersion = process.version;
    const hostname = os.hostname();

    let systemInfoText = `💻 *Estadísticas del Servidor*\n\n`;
    systemInfoText += `OS: ${os.type()} ${os.release()} (${os.platform()})\n`;
    systemInfoText += `Arquitectura: ${os.arch()}\n`;
    systemInfoText += `Hostname: ${hostname}\n`;
    systemInfoText += `\n🧠 *CPU:*\n`;
    systemInfoText += `  Modelo: ${cpuModel}\n`;
    systemInfoText += `  Núcleos: ${numCores}\n`;
    systemInfoText += `  Carga Promedio: ${loadAvg} (1m, 5m, 15m)\n`; // Más útil en Linux/macOS
    systemInfoText += `\n💾 *RAM:*\n`;
    systemInfoText += `  Total: ${(totalRAM / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    systemInfoText += `  Usada: ${(usedRAM / 1024 / 1024 / 1024).toFixed(2)} GB (${((usedRAM / totalRAM) * 100).toFixed(1)}%)\n`;
    systemInfoText += `  Libre: ${(freeRAM / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    systemInfoText += `\n⏱️ *Uptime del Sistema:*\n  ${formatUptime(uptime)}\n`;
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

    const dDisplay = d > 0 ? d + (d === 1 ? " día, " : " días, ") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " hora, " : " horas, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " minuto, " : " minutos, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " segundo" : " segundos") : "";
    
    let result = dDisplay + hDisplay + mDisplay + sDisplay;
    if (result.endsWith(", ")) { // Quitar la última coma y espacio si existe
        result = result.substring(0, result.length - 2);
    }
    return result.length > 0 ? result : "Ahora mismo";
}

handler.help = ['ping', 'speed', 'p', 'status', 'estado'];
handler.tags = ['info', 'main'];
handler.command = ['ping', 'speed', 'p', 'status', 'estado'];
handler.register = true;

export default handler;
