import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

export const initializeApp=
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


