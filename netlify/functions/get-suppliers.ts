import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { Supplier } from "../../src/types";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

const db = admin.firestore();

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // TODO: Secure with JWT and ADMIN role validation
    const suppliersSnapshot = await db.collection('suppliers').where('isActive', '==', true).get();
    const suppliers: Supplier[] = [];
    suppliersSnapshot.forEach(doc => {
      suppliers.push({ id: doc.id, ...doc.data() } as Supplier);
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(suppliers),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch suppliers.', details: errorMessage }),
    };
  }
};

export { handler };