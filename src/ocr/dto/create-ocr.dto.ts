// src/ocr/dto/create-ocr.dto.ts
import { IsString, MinLength } from 'class-validator';

export class CreateOcrDto {
  @IsString()
  url: string;
}