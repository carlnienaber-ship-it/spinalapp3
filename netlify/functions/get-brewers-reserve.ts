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

const handler: Handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  try {
    const productsSnapshot = await db.collection('products')
      .where('isActive', '==', true)
      .where('isBrewersReserve', '==', true)
      .get();
      
    const products: Product[] = [];
    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    // Sort alphabetically by name
    products.sort((a, b) => a.name.localeCompare(b.name));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error('Error fetching Brewer\'s Reserve products:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch products.', details: errorMessage }),
    };
  }
};

export { handler };