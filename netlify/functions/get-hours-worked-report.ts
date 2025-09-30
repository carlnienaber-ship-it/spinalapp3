import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { verifyJwtAndCheckRole } from "../utils/auth";
import { ShiftRecord, HoursWorkedReport, UserHours, DailyHours } from "../../src/types";

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
        body: JSON.stringify({ error: 'Both startDate and endDate query parameters are required.' }),
      };
    }

    const shiftsSnapshot = await db.collection('shifts')
        .where('startTime', '>=', startDate)
        .where('startTime', '<=', `${endDate}T23:59:59.999Z`) // Include the entire end day
        .get();
        
    const userHoursMap = new Map<string, { userName: string, dailyHours: Map<string, number> }>();

    shiftsSnapshot.forEach(doc => {
      const shift = doc.data() as ShiftRecord;
      if (!shift.startTime || !shift.endTime || !shift.user?.email) {
        return;
      }
      
      const durationMs = new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      const date = new Date(shift.startTime).toISOString().split('T')[0];
      const email = shift.user.email;
      const name = shift.user.name || 'Unknown';

      if (!userHoursMap.has(email)) {
        userHoursMap.set(email, { userName: name, dailyHours: new Map() });
      }

      const userEntry = userHoursMap.get(email)!;
      userEntry.dailyHours.set(date, (userEntry.dailyHours.get(date) || 0) + durationHours);
    });

    const report: HoursWorkedReport = [];
    for (const [email, data] of userHoursMap.entries()) {
        const dailyBreakdown: DailyHours[] = Array.from(data.dailyHours.entries()).map(([date, hours]) => ({ date, hours }));
        const totalHours = dailyBreakdown.reduce((sum, day) => sum + day.hours, 0);

        report.push({
            userEmail: email,
            userName: data.userName,
            totalHours,
            dailyBreakdown,
        });
    }

    // Sort by user name
    report.sort((a, b) => a.userName.localeCompare(b.userName));

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