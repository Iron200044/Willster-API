import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
