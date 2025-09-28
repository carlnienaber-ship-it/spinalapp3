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
    const supplierData = JSON.parse(event.body);

    const newSupplier = {
        supplierName: supplierData.supplierName,
        supplierEmail: supplierData.supplierEmail,
        contactPerson: supplierData.contactPerson ?? null,
        address: supplierData.address ?? null,
        telephone: supplierData.telephone ?? null,
        liquorLicenseNumber: supplierData.liquorLicenseNumber ?? null,
        bankDetails: supplierData.bankDetails ?? null,
        isActive: true,
    };

    const docRef = await db.collection('suppliers').add(newSupplier);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: docRef.id, ...newSupplier }),
    };
  } catch (error) {
    console.error('Error adding supplier:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add supplier.', details: errorMessage }),
    };
  }
};

export { handler };