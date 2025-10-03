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

// Define the shape of the seed data
type ProductSeed = {
  name: string;
  category: 'Spirits' | 'Cans and Bottles' | 'Food' | "Brewer's Reserve";
  grossWeight?: number;
  emptyBottleWeight?: number;
};

// =================================================================================
// TODO: USER ACTION REQUIRED
// Please replace the contents of this array with your original list of products.
// This is the data that will be imported into your live database when you click
// the "Import Default Products" button in the admin panel.
// =================================================================================
const DEFAULT_PRODUCTS: ProductSeed[] = [
  // --- Spirits --- (Note: grossWeight is calculated as emptyBottleWeight + 705g)
  { name: 'African Dry Gin', category: 'Spirits', grossWeight: 1255, emptyBottleWeight: 550 },
  { name: 'Aperol', category: 'Spirits', grossWeight: 1305, emptyBottleWeight: 600 },
  { name: 'Bain\'s', category: 'Spirits', grossWeight: 1325, emptyBottleWeight: 620 },
  { name: 'Die Mas 5y/o Brandy', category: 'Spirits', grossWeight: 1305, emptyBottleWeight: 600 },
  { name: 'El Jimador', category: 'Spirits', grossWeight: 1315, emptyBottleWeight: 610 },
  { name: 'Floating Dutchman', category: 'Spirits', grossWeight: 1285, emptyBottleWeight: 580 },
  { name: 'Jägermeister', category: 'Spirits', grossWeight: 1405, emptyBottleWeight: 700 },
  { name: 'Jameson', category: 'Spirits', grossWeight: 1305, emptyBottleWeight: 600 },
  { name: 'Johnnie Walker Black', category: 'Spirits', grossWeight: 1255, emptyBottleWeight: 550 },
  { name: 'Olmeca', category: 'Spirits', grossWeight: 1335, emptyBottleWeight: 630 },
  { name: 'Rooster', category: 'Spirits', grossWeight: 1315, emptyBottleWeight: 610 },
  { name: 'Stolichnaya', category: 'Spirits', grossWeight: 1285, emptyBottleWeight: 580 },
  { name: 'Tanqueray', category: 'Spirits', grossWeight: 1355, emptyBottleWeight: 650 },
  { name: 'Ugly Gin', category: 'Spirits', grossWeight: 1155, emptyBottleWeight: 450 },

  // --- Cans and Bottles ---
  { name: 'Amstel Lager NRB', category: 'Cans and Bottles' },
  { name: 'Appletiser 330ml', category: 'Cans and Bottles' },
  { name: 'Black Label NRB', category: 'Cans and Bottles' },
  { name: 'Castle Free NRB', category: 'Cans and Bottles' },
  { name: 'Castle Lite NRB', category: 'Cans and Bottles' },
  { name: 'Coke Can 300ml', category: 'Cans and Bottles' },
  { name: 'Coke Light Can 300ml', category: 'Cans and Bottles' },
  { name: 'Coke Zero Can 300ml', category: 'Cans and Bottles' },
  { name: 'Flying Fish NRB', category: 'Cans and Bottles' },
  { name: 'Fitch & Leedes Ginger Ale', category: 'Cans and Bottles' },
  { name: 'Fitch & Leedes Indian Tonic', category: 'Cans and Bottles' },
  { name: 'Fitch & Leedes Pink Tonic', category: 'Cans and Bottles' },
  { name: 'Heineken NRB', category: 'Cans and Bottles' },
  { name: 'Hunters Dry NRB', category: 'Cans and Bottles' },
  { name: 'Savanna Dry NRB', category: 'Cans and Bottles' },
  { name: 'Sprite Can 300ml', category: 'Cans and Bottles' },
  { name: 'Sprite Zero Can 300ml', category: 'Cans and Bottles' },
  { name: 'Valpre Still Water 500ml', category: 'Cans and Bottles' },
  { name: 'Valpre Sparkling Water 500ml', category: 'Cans and Bottles' },
  { name: 'Windhoek Lager NRB', category: 'Cans and Bottles' },

  // --- Food ---
  { name: 'Biltong', category: 'Food' },
  { name: 'Droëwors', category: 'Food' },
  { name: 'Peanuts & Raisins', category: 'Food' },
];

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

    const productsCollection = db.collection('products');
    const snapshot = await productsCollection.limit(1).get();

    if (!snapshot.empty) {
      return {
        statusCode: 409, // Conflict
        headers,
        body: JSON.stringify({ error: 'Products collection is not empty. Seeding aborted to prevent duplication.' }),
      };
    }

    if (DEFAULT_PRODUCTS.length === 0) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Default product list is empty. Please add products to seed-products.ts.' }),
        };
    }

    const batch = db.batch();
    let count = 0;
    DEFAULT_PRODUCTS.forEach(product => {
      const docRef = productsCollection.doc();
      batch.set(docRef, { ...product, isActive: true });
      count++;
    });

    await batch.commit();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Successfully seeded products.', count }),
    };
  } catch (error) {
    console.error('Error seeding products:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("Authorization") || errorMessage.includes("Access denied")) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized", details: errorMessage }) };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to seed products.', details: errorMessage }),
    };
  }
};

export { handler };