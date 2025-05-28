// src/games/games.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { db } from '../../config/firebase';

@Injectable()
export class GamesService {
  constructor(private readonly aiService: AIService) {}

  async crearJuego(
    uid: string,
    notebookId: string,
    noteId: string,
    type: 'memory' | 'hangman' | 'quiz'
  ) {
    const noteRef = db
      .collection('users')
      .doc(uid)
      .collection('notebooks')
      .doc(notebookId)
      .collection('notes')
      .doc(noteId);

    const noteSnap = await noteRef.get();
    if (!noteSnap.exists) throw new Error('Nota no encontrada');

    const { summary, titleSummary, content, title } = noteSnap.data() || {};

    let prompt = '';

    if (type === 'memory') {
      prompt = `
        Crea un juego de memoria (parejas concepto-descripción) en JSON a partir de este resumen/contenido:
        Título: "${title}"
        Resumen: """${summary}"""
        Contenido completo: """${content}"""
        Quiero 5 cartas con la estructura:
        {
          "title": "${title}",
          "cards": [
            { "concept": "Ejemplo", "description": "Explicación del concepto" }
          ]
        }
      `;
    } else if (type === 'hangman') {
      prompt = `
        Genera 5 palabras clave para un juego de ahorcado basándote en este resumen/contenido:
        Título: "${title}"
        Resumen: """${summary}"""
        Contenido completo: """${content}"""
        Devuélvelas en JSON con este formato:
        {
          "title": "${title}",
          "words": [
            { "word": "término" }
          ]
        }
      `;
    } else if (type === 'quiz') {
      prompt = `
        Crea un quiz de opción múltiple estilo Kahoot a partir de este resumen/contenido:
        Título: "${title}"
        Resumen: """${summary}"""
        Contenido completo: """${content}"""
        Necesito 5 preguntas con 4 opciones cada una y la respuesta correcta,
        y el resultado en JSON con esta estructura:
        {
          "title": "${title}",
          "questions": [
            {
              "question": "¿Pregunta?",
              "options": ["a", "b", "c", "d"],
              "answer": "b"
            }
          ]
        }
      `;
    }

    const gameData = await this.aiService.generarJuego(prompt);

    await noteRef.collection('games').doc(type).set({
      type,
      data: gameData,
      createdAt: new Date().toISOString(),
    });

    return { message: `Juego ${type} generado exitosamente`, game: gameData };
  }

  async obtenerJuego(
    uid: string,
    notebookId: string,
    noteId: string,
    type: 'memory' | 'hangman' | 'quiz'
  ) {
    const gameRef = db
      .collection('users')
      .doc(uid)
      .collection('notebooks')
      .doc(notebookId)
      .collection('notes')
      .doc(noteId)
      .collection('games')
      .doc(type);

    const snapshot = await gameRef.get();

    if (!snapshot.exists) {
      throw new NotFoundException(`Juego de tipo '${type}' no encontrado`);
    }

    return snapshot.data();
  }

  async actualizarScore(
    uid: string,
    notebookId: string,
    noteId: string,
    type: 'memory' | 'hangman' | 'quiz',
    newScore: number
  ) {
    const gameRef = db
      .collection('users')
      .doc(uid)
      .collection('notebooks')
      .doc(notebookId)
      .collection('notes')
      .doc(noteId)
      .collection('games')
      .doc(type);

    const gameSnap = await gameRef.get();
    if (!gameSnap.exists) {
      throw new NotFoundException(`Juego de tipo '${type}' no encontrado`);
    }

    await gameRef.update({ score: newScore });

    return { message: 'Score actualizado', score: newScore };
  }
}