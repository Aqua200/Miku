import speed from 'performance-now';

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

    const processUptimeSeconds = process.uptime();
    const nodeVersion = process.version;

    let botInfoText = `📊 *Rendimiento del Bot:*\n\n`;
    botInfoText += `  Node.js: ${nodeVersion}\n`;
    botInfoText += `  Tiempo Activo (Bot): ${formatUptime(processUptimeSeconds)}\n`;

    const responseText = `✰ *¡Pong!* ✰\n` +
                       `> 🏓 Latencia (Bot ↔️ WhatsApp): ${botPing}\n` +
                       `> ⚡ Velocidad Script: ${scriptSpeed}\n\n` +
                       `${botInfoText.trim()}`;

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
