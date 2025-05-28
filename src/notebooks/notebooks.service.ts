import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../config/firebase';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  async create(uid: string, dto: CreateNotebookDto) {
    const ref = db.collection('users').doc(uid).collection('notebooks');
    const newNotebook = await ref.add({
      ...dto,
      createdAt: new Date(),
    });

    return { id: newNotebook.id, ...dto };
  }

  async findAll(uid: string) {
    const snapshot = await db.collection('users').doc(uid).collection('notebooks').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(uid: string, id: string) {
    const doc = await db.collection('users').doc(uid).collection('notebooks').doc(id).get();
    if (!doc.exists) throw new NotFoundException('Notebook not found');
    return { id: doc.id, ...doc.data() };
  }

  async update(uid: string, id: string, dto: UpdateNotebookDto) {
    const docRef = db.collection('users').doc(uid).collection('notebooks').doc(id);
    await docRef.update({ ...dto });
    return { message: 'Notebook updated' };
  }

  async remove(uid: string, id: string) {
    const docRef = db.collection('users').doc(uid).collection('notebooks').doc(id);
    await docRef.delete();
    return { message: 'Notebook deleted' };
  }
}
