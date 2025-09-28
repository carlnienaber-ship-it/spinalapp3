import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // Secure endpoint: Require a valid JWT with the 'Admin' role.
    await verifyJwtAndCheckRole(event, 'Admin');

    if (!event.body) throw new Error("Request body is missing.");
    const productData = JSON.parse(event.body);
    const newProduct = {
        name: productData.name,
        category: productData.category,
        fullBottleWeight: productData.fullBottleWeight ?? null,
        isActive: true,
        parLevel: productData.parLevel ?? null,
        orderUnitSize: productData.orderUnitSize ?? null,
        minOrderUnits: productData.minOrderUnits ?? null,
        primarySupplierId: productData.primarySupplierId ?? null,
        secondarySupplierId: productData.secondarySupplierId ?? null,
        tertiarySupplierId: productData.tertiarySupplierId ?? null,
    };
    const docRef = await db.collection('products').add(newProduct);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: docRef.id, ...newProduct }),
    };
  } catch (error) {
    console.error('Error adding product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add product.', details: errorMessage }),
    };
  }
};

export { handler };