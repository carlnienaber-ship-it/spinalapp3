// FIX: Replaced placeholder content with a functional Netlify serverless function.
// This handler processes shift submission data from the frontend, including
// CORS preflight requests, JSON body parsing, and returning a structured response.
import type { Handler, HandlerEvent } from "@netlify/functions";

// In a real monorepo setup, these types would be in a shared package to avoid duplication.
// --- START: Type definitions from src/types/index.ts ---
type Task = {
  id: string;
  text: string;
  description?: string;
  type: 'toggle' | 'radio' | 'radio_text' | 'toggle_text';
  completed: boolean;
  options?: string[];
  value?: string;
  notes?: string;
};

type StockItem = {
  name: string;
  foh?: number;
  storeRoom?: number;
  openBottleWeight?: number;
  quantity?: number;
  fullBottlesTotal?: number;
};

type StockCategory = {
  title: string;
  headers: string[];
  items: StockItem[];
};

type NewStockDeliveryItem = {
  id: string;
  name: string;
  quantity: number;
};

type ShiftStep =
  | 'welcome'
  | 'opening_tasks'
  | 'opening_stock'
  | 'motivational'
  | 'new_stock_delivery'
  | 'closing_stock'
  | 'closing_tasks'
  | 'complete';

type ShiftState = {
  currentStep: ShiftStep;
  startTime: string | null;
  endTime: string | null;
  openingTasks: Task[];
  closingTasks: Task[];
  openingStock: StockCategory[];
  closingStock: StockCategory[];
  newStockDeliveries: NewStockDeliveryItem[];
  shiftFeedback: {
    rating: 'Great' | 'Normal' | 'Bad' | null;
    comment: string;
  };
};
// --- END: Type definitions ---

const handler: Handler = async (event: HandlerEvent) => {
  // Generous CORS headers for development. In production, restrict the origin.
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers,
      body: '',
    };
  }

  // Ensure the request is a POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is missing.' }),
      };
    }

    const shiftData: ShiftState = JSON.parse(event.body);

    // Perform basic validation on the received data
    if (!shiftData.startTime || !shiftData.endTime || !shiftData.openingTasks) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid or incomplete shift data provided.' }),
      };
    }

    // In a real-world application, you would add more logic here:
    // 1. Authenticate the request by validating the Auth0 JWT in the 'Authorization' header.
    // 2. Sanitize and perform deeper validation of the shift data.
    // 3. Persist the validated data to a database (e.g., Fauna, Supabase, Firestore).
    // 4. Trigger any necessary follow-up actions (e.g., notifications, reports).
    console.log('Successfully received and parsed shift submission:', JSON.stringify(shiftData, null, 2));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Shift report submitted successfully.' }),
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
