import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Firestore } from '@google-cloud/firestore';
import {db} from '../../config/firebase';

@Injectable()
export class UsersService {

  //Crea un usuario en la base de datos
  async create(createUserDto: CreateUserDto) {
    const userRef = db.collection('users').doc(createUserDto.uid);
    await userRef.set({
      ...createUserDto,
      createdAt: new Date(),
    });

    return { message: 'User profile created successfully.' };
  }

  //Busca un usuario por uid
  async findOne(uid: string) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new Error('User not found');
    }

    return doc.data();
  }

  
  async update(uid: string, updateUserDto: UpdateUserDto) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new Error('User not found');
    }

    await userRef.update({
      ...updateUserDto,
      updatedAt: new Date(),
    });

    return { message: 'User updated successfully.' };
  }

  //Ekimina un usuario por uid
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
