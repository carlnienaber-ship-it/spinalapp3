import type { Handler, HandlerEvent } from "@netlify/functions";
import admin from 'firebase-admin';
import { ShiftState } from "../../src/types";

// Initialize Firebase Admin SDK
// This requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY
// to be set as environment variables in the Netlify dashboard.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines with actual newlines for the private key
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
    'Access-Control-Allow-Origin': '*', // Or your specific domain for production
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // TODO: Add Auth0 JWT validation here for security
    
    if (!event.body) {
      throw new Error("Request body is missing.");
    }

    const shiftData: ShiftState = JSON.parse(event.body);

    // Add the shift data as a new document to the 'shifts' collection
    const docRef = await db.collection('shifts').add(shiftData);
    console.log('Shift data successfully stored with document ID:', docRef.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Shift report submitted successfully.', documentId: docRef.id }),
    };
  } catch (error) {
    console.error('Error processing submission:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process shift report.', details: errorMessage }),
    };
  }
};

export { handler };