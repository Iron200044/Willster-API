import { IsString, IsOptional } from 'class-validator';

export class CreateNotebookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
