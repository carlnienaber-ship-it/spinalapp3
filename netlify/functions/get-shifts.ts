import type { Handler, HandlerEvent } from "@netlify/functions";
import admin from 'firebase-admin';
import { ShiftRecord } from "../../src/types";
import { verifyJwtAndCheckRole } from "../utils/auth";

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Secure endpoint: Require a valid JWT with the 'Admin' role.
    await verifyJwtAndCheckRole(event, 'Admin');

    const shiftsSnapshot = await db.collection('shifts').orderBy('startTime', 'desc').get();
    const shifts: ShiftRecord[] = [];
    shiftsSnapshot.forEach(doc => {
      shifts.push({
        id: doc.id,
        ...doc.data(),
      } as ShiftRecord);
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(shifts),
    };
  } catch (error) {
    console.error('Error fetching shifts:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch shifts.', details: errorMessage }),
    };
  }
};

export { handler };