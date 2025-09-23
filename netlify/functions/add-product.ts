import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { Product } from "../../src/types";

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // TODO: Secure with JWT and ADMIN role validation
    if (!event.body) throw new Error("Request body is missing.");
    const productData = JSON.parse(event.body);
    const newProduct: Omit<Product, 'id'> = {
        name: productData.name,
        category: productData.category,
        fullBottleWeight: productData.fullBottleWeight || null,
        isActive: true,
    };
    const docRef = await db.collection('products').add(newProduct);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: docRef.id, ...newProduct }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add product.', details: errorMessage }),
    };
  }
};

export { handler };