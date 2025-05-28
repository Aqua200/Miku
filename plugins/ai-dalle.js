import axios from 'axios';


const API_BASE_URL = 'https://eliasar-yt-api.vercel.app/api/ai/text2img';
const REQUEST_TIMEOUT = 60000;


const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    
    const prompt = text || args.join(' ');

    if (!prompt) {
        await conn.reply(m.chat,
            `🖼️ *Generador de Imágenes DALL-E (Conceptual)* 🖼️\n\n` +
            `Por favor, proporciona una descripción para generar la imagen.\n\n` +
            `✨ *Ejemplo de uso:*\n` +
            `${usedPrefix + command} un gato astronauta flotando en el espacio con planetas de fondo\n\n` +
            `💡 *Consejos para mejores resultados:*\n` +
            `- Sé descriptivo y específico.\n` +
            `- Experimenta con diferentes estilos (ej: "estilo pixel art", "fotorrealista", "pintura al óleo").`,
            m
        );
        return;
    }

    try {
        await conn.reply(m.chat, `⏳ Procesando tu solicitud para generar imagen con la descripción:\n_"${prompt}"_\n\nPor favor, espera un momento...`, m);

        const apiUrl = `${API_BASE_URL}?prompt=${encodeURIComponent(prompt)}`;

        console.log(`[DALL-E] Solicitando imagen con prompt: ${prompt}`);
        console.log(`[DALL-E] URL de API: ${apiUrl}`);

        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer', 
            timeout: REQUEST_TIMEOUT     
        });

        
        if (response.data && response.data.byteLength > 0 && response.headers['content-type'] && response.headers['content-type'].startsWith('image/')) {
            await conn.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: `✅ ¡Aquí tienes tu imagen generada!\n\n*Prompt:* _${prompt}_`
            }, { quoted: m });
        } else {
            console.error('[DALL-E] La API no devolvió una imagen válida. Respuesta:', response.headers);
            await conn.reply(m.chat, `⚠️ Lo siento, la API no devolvió una imagen válida para tu descripción. Intenta con algo diferente o revisa si el servicio está funcionando.`, m);
        }

    } catch (error) {
        console.error('[DALL-E] Error al generar la imagen:', error.message);
        let userErrorMessage = '❌ Ocurrió un error inesperado al generar la imagen. Por favor, intenta nuevamente más tarde.';

        if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
            userErrorMessage = `⏳ La solicitud tardó demasiado en responder (más de ${REQUEST_TIMEOUT / 1000} segundos). Intenta con una descripción más simple o prueba más tarde.`;
        } else if (error.response) {
            
            console.error('[DALL-E] Detalles del error de la API:', { status: error.response.status, data: error.response.data ? error.response.data.toString() : 'N/A' });
            userErrorMessage = `⚠️ El servicio de generación de imágenes devolvió un error (Código: ${error.response.status}). Es posible que el servicio esté temporalmente caído o haya un problema con tu solicitud.`;
            if (error.response.status === 403) userErrorMessage += "\n(Podría ser un problema de acceso o rate limit en la API)";
            if (error.response.status === 500) userErrorMessage += "\n(Error interno del servidor de imágenes)";
        } else if (error.request) {
            
            userErrorMessage = '🔌 No se pudo obtener respuesta del servidor de imágenes. Verifica tu conexión a internet o el estado del servicio.';
        }

        await conn.reply(m.chat, userErrorMessage, m);
    }
};

// --- Configuración del Comando ---
handler.command = ['dalle'];
handler.help = ['dalle'];
handler.tags = ['tools'];

export default handler;
