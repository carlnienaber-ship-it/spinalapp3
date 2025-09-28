import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { Supplier } from "../../src/types";
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
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // Secure endpoint: Require a valid JWT with the 'Admin' role.
    await verifyJwtAndCheckRole(event, 'Admin');

    if (!event.body) throw new Error("Request body is missing.");
    const { id, ...supplierData }: Supplier = JSON.parse(event.body);

    if (!id) throw new Error("Supplier ID is missing.");
    
    const updatePayload = {
      supplierName: supplierData.supplierName,
      supplierEmail: supplierData.supplierEmail,
      contactPerson: supplierData.contactPerson ?? null,
      address: supplierData.address ?? null,
      telephone: supplierData.telephone ?? null,
      liquorLicenseNumber: supplierData.liquorLicenseNumber ?? null,
      bankDetails: supplierData.bankDetails ?? null,
    };

    const docRef = db.collection('suppliers').doc(id);
    await docRef.update(updatePayload);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id, ...supplierData }),
    };
  } catch (error) {
    console.error('Error updating supplier:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update supplier.', details: errorMessage }),
    };
  }
};

export { handler };