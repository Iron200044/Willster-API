import { Module } from '@nestjs/common';
import { AppController } from './core/app.controller';
import { AppService } from './core/app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import { NotebooksModule } from './notebooks/notebooks.module';
import { AIService } from './ai/ai.service';
import { GamesModule } from './games/games.module';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NotesModule,
    NotebooksModule,
    GamesModule,
    OcrModule,
  ],
  controllers: [AppController],
  providers: [AppService, AIService],
})
export class AppModule {}
