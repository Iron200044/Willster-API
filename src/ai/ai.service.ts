import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AIService {
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  async generarResumenYTitulo(texto: string): Promise<{ summary: string; titleSummary: string }> {
        try {
        const prompt = `
            Eres un asistente que ayuda a crear resúmenes breves y títulos llamativos a partir de notas de estudiantes.

            Texto de la nota:
            """${texto}"""

            Devuélveme solo el resumen y el título en el siguiente formato JSON:
            {
                "title": "...",
                "summary": "..."
            }
            `;

        const response = await axios.post(
        `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
        {
        contents: [
            {
                parts: [{ text: prompt }],
            },
            ],
        },
        {
            headers: {
            'Content-Type': 'application/json',
            },
        },
        );

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('Respuesta cruda de Gemini:', content);
        if (!content) throw new Error('Respuesta vacía de Gemini');

        // Intentar extraer solo el JSON desde el texto recibido
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error('No se encontró JSON en la respuesta');
        }

        const jsonString = content.substring(jsonStart, jsonEnd + 1);
        const json = JSON.parse(jsonString);

        return {
            titleSummary: json.title || 'Sin título',
            summary: json.summary || 'Sin resumen',
        };
        } catch (error) {
            console.error('Error al generar resumen:', error);
            throw new InternalServerErrorException('Error al generar resumen con IA');
        }
    }

    async generarJuego(prompt: string): Promise<any> {
        try {
            const response = await axios.post(
            `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            {
                headers: { 'Content-Type': 'application/json' },
            },
            );

            const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}');
            const jsonString = content.substring(jsonStart, jsonEnd + 1);

            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error al generar juego:', error);
            throw new InternalServerErrorException('Error al generar juego con IA');
        }
    }
}
