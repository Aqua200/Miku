

import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

const handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🕒');
        conn.sendPresenceUpdate('composing', m.chat);

        const pluginsDir = './plugins';
        const absolutePluginsDir = path.resolve(pluginsDir);

        let files;
        try {
            files = (await fs.readdir(absolutePluginsDir))
                .filter(file => file.endsWith('.js'));
        } catch (readDirError) {
            if (readDirError.code === 'ENOENT') {
                await m.react('⚠️');
                await conn.reply(m.chat, `⚠︎ El directorio de plugins '${absolutePluginsDir}' no existe.`, m);
                return;
            }
            throw readDirError;
        }
        

        if (files.length === 0) {
            await m.react('🤷');
            await conn.reply(m.chat, `✧ No se encontraron archivos .js en el directorio de plugins: ${absolutePluginsDir}`, m);
            return;
        }

        let responseText = `✧ *Revisión de Syntax Errors:*\n\n`;
        let hasErrors = false;
        const errorDetails = [];

        for (const file of files) {
            const filePath = path.join(absolutePluginsDir, file);
            const fileUrlWithCacheBust = `${pathToFileURL(filePath).href}?v=${Date.now()}`;
            
            try {
                await import(fileUrlWithCacheBust);
            } catch (error) {
                hasErrors = true;
                const stackLines = error.stack ? error.stack.split('\n') : [];
                let errorLine = 'Desconocido';
                
                const relevantStackLine = stackLines.find(line => line.includes(filePath) || line.includes(file));
                
                if (relevantStackLine) {
                    const lineMatch = relevantStackLine.match(/:(\d+):\d+/);
                    if (lineMatch && lineMatch[1]) {
                        errorLine = lineMatch[1];
                    }
                } else if (error.lineNumber) {
                    errorLine = error.lineNumber;
                } else {
                    const firstLineMatch = stackLines.length > 0 ? stackLines[0].match(/:(\d+):\d+/) : null;
                    if (firstLineMatch && firstLineMatch[1]) {
                        errorLine = firstLineMatch[1];
                    }
                }
                
                errorDetails.push(`⚠︎ *Error en:* \`${file}\`\n> ● Mensaje: ${error.message}\n> ● Línea aprox.: ${errorLine}`);
            }
        }

        if (!hasErrors) {
            responseText += '❀ ¡Todo está en orden! No se detectaron errores de sintaxis.';
        } else {
            responseText += errorDetails.join('\n\n');
        }

        await conn.reply(m.chat, responseText, m);
        await m.react('✅');

    } catch (err) {
        console.error("Error en el handler 'detectarsyntax':", err);
        await m.react('✖️');
        await conn.reply(m.chat, `⚠︎ Ocurrió un error inesperado al procesar el comando: ${err.message}`, m);
    }
};

handler.command = ['detectarsyntax', 'detectar'];
handler.help = ['detectarsyntax'];
handler.tags = ['tools'];
handler.rowner = true;

export default handler;
