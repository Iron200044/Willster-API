import { PartialType } from '@nestjs/mapped-types';
import { CreateNotebookDto } from './create-notebook.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateNotebookDto extends PartialType(CreateNotebookDto) {
    @IsString()
    @IsOptional()
    title?: string;
    
    @IsString()
    @IsOptional()
    tags?: string;
}
