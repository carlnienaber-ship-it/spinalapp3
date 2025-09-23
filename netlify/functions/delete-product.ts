import type { Handler, HandlerEvent } from "@netlify/functions";
import admin from 'firebase-admin';

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

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-control-allow-headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // TODO: Secure with JWT and ADMIN role validation
    if (!event.body) throw new Error("Request body is missing.");
    const { id } = JSON.parse(event.body);

    if (!id) throw new Error("Product ID is missing.");
    
    await db.collection('products').doc(id).delete();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id, message: 'Product permanently deleted' }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete product.', details: errorMessage }),
    };
  }
};

export { handler };