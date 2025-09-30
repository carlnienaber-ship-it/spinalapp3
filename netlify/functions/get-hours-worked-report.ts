import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { verifyJwtAndCheckRole } from "../utils/auth";
import { ShiftRecord, DetailedHoursWorkedReport, ShiftDetailRecord } from "../../src/types";

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
    
    const { userEmail, startDate, endDate } = event.queryStringParameters || {};

    if (!userEmail || !startDate || !endDate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userEmail, startDate, and endDate query parameters are required.' }),
      };
    }

    const shiftsSnapshot = await db.collection('shifts')
        .where('user.email', '==', userEmail)
        .where('startTime', '>=', startDate)
        .where('startTime', '<=', `${endDate}T23:59:59.999Z`)
        .orderBy('startTime', 'asc')
        .get();
        
    const detailedShifts: ShiftDetailRecord[] = [];
    let userName = '';
    
    shiftsSnapshot.forEach(doc => {
      const shift = { id: doc.id, ...doc.data() } as ShiftRecord;
      if (!shift.startTime || !shift.endTime || !shift.user?.email) {
        return;
      }
      
      // Capture username from the first valid record
      if (!userName && shift.user.name) {
        userName = shift.user.name;
      }
      
      const durationMs = new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      detailedShifts.push({
        id: shift.id,
        startTime: shift.startTime,
        endTime: shift.endTime,
        hours: durationHours,
      });
    });

    const totalHours = detailedShifts.reduce((sum, s) => sum + s.hours, 0);

    const report: DetailedHoursWorkedReport = {
        userEmail,
        userName: userName || userEmail,
        totalHours,
        shifts: detailedShifts,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(report),
    };
  } catch (error) {
    console.error('Error generating hours worked report:', error);
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
