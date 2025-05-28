import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Controller('users/:uid/notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create(@Param('uid') uid: string, @Body() dto: CreateNotebookDto) {
    return this.notebooksService.create(uid, dto);
  }

  @Get()
  findAll(@Param('uid') uid: string) {
    return this.notebooksService.findAll(uid);
  }

  @Get(':id')
  findOne(@Param('uid') uid: string, @Param('id') id: string) {
    return this.notebooksService.findOne(uid, id);
  }

  @Patch(':id')
  update(@Param('uid') uid: string, @Param('id') id: string, @Body() dto: UpdateNotebookDto) {
    return this.notebooksService.update(uid, id, dto);
  }

  @Delete(':id')
  remove(@Param('uid') uid: string, @Param('id') id: string) {
    return this.notebooksService.remove(uid, id);
  }
}
