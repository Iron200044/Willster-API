import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { AIService } from '../ai/ai.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, AIService],
})
export class GamesModule {}
