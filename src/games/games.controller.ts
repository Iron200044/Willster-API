import { Controller, Post, Param, Body, Get, Patch } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateScoreDto } from './dto/update-game.dto';

@Controller('users/:uid/notebooks/:notebookId/notes/:noteId/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async generarJuego(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Param('noteId') noteId: string,
    @Body() createGameDto: CreateGameDto,
  ) {
    return this.gamesService.crearJuego(uid, notebookId, noteId, createGameDto.type);
  }
  @Get(':type')
  async getGame(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Param('noteId') noteId: string,
    @Param('type') type: 'memory' | 'hangman' | 'quiz',
  ) {
    return this.gamesService.obtenerJuego(uid, notebookId, noteId, type);
  }

  @Patch(':type/score')
  async updateScore(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Param('noteId') noteId: string,
    @Param('type') type: 'memory' | 'hangman' | 'quiz',
    @Body() updateScoreDto: UpdateScoreDto,
  ) {
    return this.gamesService.actualizarScore(
      uid,
      notebookId,
      noteId,
      type,
      updateScoreDto.score,
    );
  }
}
