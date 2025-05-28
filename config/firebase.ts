import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'), // Necesario
  }),
});

const db = admin.firestore();

export { db, admin };