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
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // TODO: Secure with JWT and ADMIN role validation
    if (!event.body) throw new Error("Request body is missing.");
    const { id, ...productData }: Product = JSON.parse(event.body);

    if (!id) throw new Error("Product ID is missing.");
    
    // Construct an explicit update payload to handle clearing fields with null
    const updatePayload = {
      name: productData.name,
      category: productData.category,
      fullBottleWeight: productData.fullBottleWeight ?? null,
      parLevel: productData.parLevel ?? null,
      orderUnitSize: productData.orderUnitSize ?? null,
      minOrderUnits: productData.minOrderUnits ?? null,
      primarySupplierId: productData.primarySupplierId ?? null,
      secondarySupplierId: productData.secondarySupplierId ?? null,
      tertiarySupplierId: productData.tertiarySupplierId ?? null,
    };

    const docRef = db.collection('products').doc(id);
    await docRef.update(updatePayload);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id, ...productData }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update product.', details: errorMessage }),
    };
  }
};

export { handler };