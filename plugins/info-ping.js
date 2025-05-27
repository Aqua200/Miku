import speed from 'performance-now';
import { exec } from 'child_process';

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

    exec('neofetch --stdout', (error, stdout, stderr) => {
        let systemInfo = 'No se pudo obtener la información del sistema.';
        if (error) {
            console.error(`Error al ejecutar neofetch: ${error.message}`);
            systemInfo = `Error al obtener info: ${error.message}`;
        } else if (stderr && !stdout) {
            console.warn(`Neofetch stderr: ${stderr}`);
            systemInfo = `Neofetch stderr: ${stderr.substring(0, 100)}`;
        }
        else {
            systemInfo = stdout.toString('utf-8').replace(/Memory:/, 'RAM:');
            if (stderr) {
                console.warn(`Neofetch stderr (warnings): ${stderr}`);
            }
        }

        const responseText = `✰ *¡Pong!*\n` +
                           `> 応答 (Bot a WhatsApp): ${botPing}\n` +
                           `> Velocidad Script: ${scriptSpeed}\n\n` +
                           `💻 *Información del Sistema:*\n${systemInfo.trim()}`;

        conn.reply(m.chat, responseText, m);
    });
};

handler.help = ['ping', 'speed', 'p'];
handler.tags = ['info'];
handler.command = ['ping', 'speed', 'p'];
handler.register = true;

export default handler;
