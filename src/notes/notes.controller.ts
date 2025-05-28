import { Controller, Post, Get, Delete, Body, Param, Patch } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('users/:uid/notebooks/:notebookId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(uid, notebookId, dto);
  }

  @Patch(':noteId/resumen')
  async generarResumenIA(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.generarResumenIA(uid, notebookId, noteId);
  }

  @Get()
  findAll(@Param('uid') uid: string, @Param('notebookId') notebookId: string) {
    return this.notesService.findAll(uid, notebookId);
  }

  @Get(':noteId')
  findOne(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.findOne(uid, notebookId, noteId);
  }

  @Delete(':noteId')
  remove(
    @Param('uid') uid: string,
    @Param('notebookId') notebookId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.delete(uid, notebookId, noteId);
  }
}
