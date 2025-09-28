import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { Product } from "../../src/types";
import { verifyJwtAndCheckRole } from "../utils/auth";

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
    // Secure endpoint: Require a valid JWT from any authenticated user.
    await verifyJwtAndCheckRole(event);
    
    const productsSnapshot = await db.collection('products').where('isActive', '==', true).get();
    const products: Product[] = [];
    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
     if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch products.', details: errorMessage }),
    };
  }
};

export { handler };