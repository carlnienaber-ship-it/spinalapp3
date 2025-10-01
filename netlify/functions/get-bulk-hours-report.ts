import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { verifyJwtAndCheckRole } from "../utils/auth";
import { ShiftRecord, BulkHoursWorkedReport, UserHoursSummary } from "../../src/types";

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
    await verifyJwtAndCheckRole(event, 'Admin');
    
    const { startDate, endDate } = event.queryStringParameters || {};

    if (!startDate || !endDate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'startDate and endDate query parameters are required.' }),
      };
    }

    const shiftsSnapshot = await db.collection('shifts')
        .where('startTime', '>=', startDate)
        .where('startTime', '<=', `${endDate}T23:59:59.999Z`)
        .get();
        
    const userHoursMap = new Map<string, UserHoursSummary>();
    
    shiftsSnapshot.forEach(doc => {
      const shift = doc.data() as ShiftRecord;
      if (!shift.startTime || !shift.endTime || !shift.user?.email) {
        return;
      }
      
      const durationMs = new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      const userEmail = shift.user.email;
      const userName = shift.user.name || userEmail;

      if (userHoursMap.has(userEmail)) {
        const existing = userHoursMap.get(userEmail)!;
        existing.totalHours += durationHours;
      } else {
        userHoursMap.set(userEmail, {
          userEmail,
          userName,
          totalHours: durationHours,
        });
      }
    });

    const report: BulkHoursWorkedReport = Array.from(userHoursMap.values())
      .sort((a, b) => a.userName.localeCompare(b.userName));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(report),
    };
  } catch (error) {
    console.error('Error generating bulk hours worked report:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate report.', details: errorMessage }),
    };
  }
};

export { handler };