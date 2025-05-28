import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OcrService {
  constructor(private configService: ConfigService) {}

  async analyzeImageFromUrl(imageUrl: string): Promise<string> {
    const apiKey = this.configService.get<string>('OCR_SPACE_API_KEY');

    if (!apiKey) {
      throw new Error('API key no definida en variables de entorno');
    }

    const formData = new URLSearchParams();
    formData.append('url', imageUrl);
    formData.append('language', 'spa');
    formData.append('isOverlayRequired', 'false');

    try {
      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        formData,
        {
          headers: {
            apikey: apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log('Respuesta OCR:', JSON.stringify(response.data, null, 2));

      const parsedResults = response.data?.ParsedResults || [];

      const allText = parsedResults
        .map((result: any) => result?.ParsedText)
        .filter((text: string) => !!text)
        .join('\n');

      const cleanedText = allText.replace(/\r/g, ' ').replace(/\n/g, ' '); // o .replace(/\r/g, '') si prefieres eliminar todo \r
      return cleanedText || 'No se detectó texto';

    } catch (error: any) {
      console.error('Error al comunicarse con OCR.Space:', error?.response?.data || error.message);
      throw new Error('Error en OCR');
    }
  }
}