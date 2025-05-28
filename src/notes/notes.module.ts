import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [AIModule],
  providers: [NotesService],
  controllers: [NotesController]
})
export class NotesModule {}
