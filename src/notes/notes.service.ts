import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../config/firebase';
import { CreateNoteDto } from './dto/create-note.dto';
import { AIService } from '../ai/ai.service';


@Injectable()
export class NotesService {
  constructor(private readonly aiService: AIService) {}
  // Generar notas en el notebook
  async create(uid: string, notebookId: string, dto: CreateNoteDto) {
    const notebookRef = db.collection('users').doc(uid).collection('notebooks').doc(notebookId);
    const notebookSnap = await notebookRef.get();
    if (!notebookSnap.exists) throw new NotFoundException('Notebook not found');

    const noteRef = await notebookRef.collection('notes').add({
      ...dto,
      createdAt: new Date(),
    });

    return { message: 'Note created', id: noteRef.id };
  }

  async generarResumenIA(uid: string, notebookId: string, noteId: string) {
    const noteRef = db
      .collection('users')
      .doc(uid)
      .collection('notebooks')
      .doc(notebookId)
      .collection('notes')
      .doc(noteId);

    const snapshot = await noteRef.get();

    if (!snapshot.exists) {
      throw new NotFoundException('Nota no encontrada');
    }

    const note = snapshot.data();

    if (!note) {
      throw new NotFoundException('Nota no encontrada');
    }
    console.log('Texto de la nota para resumir:', note.content);
    const { summary, titleSummary } = await this.aiService.generarResumenYTitulo(note.content);

    await noteRef.update({
      summary,
      titleSummary,
    });

    return { mensaje: 'Resumen y título generados con éxito', summary, titleSummary };
  }

  // Obtener todas las notas de un notebook
  async findAll(uid: string, notebookId: string) {
    const notesRef = db.collection('users').doc(uid).collection('notebooks').doc(notebookId).collection('notes');
    const snapshot = await notesRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Obtener una nota específica
  async findOne(uid: string, notebookId: string, noteId: string) {
    const noteRef = db.collection('users').doc(uid).collection('notebooks').doc(notebookId).collection('notes').doc(noteId);
    const doc = await noteRef.get();
    if (!doc.exists) throw new NotFoundException('Note not found');
    return { id: doc.id, ...doc.data() };
  }

  // Actualizar una nota
  async delete(uid: string, notebookId: string, noteId: string) {
    const noteRef = db.collection('users').doc(uid).collection('notebooks').doc(notebookId).collection('notes').doc(noteId);
    await noteRef.delete();
    return { message: 'Note deleted' };
  }
}
