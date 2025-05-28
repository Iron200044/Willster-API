// src/ocr/ocr.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { CreateOcrDto } from './dto/create-ocr.dto';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post()
  async recognize(@Body() body: CreateOcrDto) {
    const { url } = body;
    const text = await this.ocrService.analyzeImageFromUrl(url);
    return { text };
  }
}