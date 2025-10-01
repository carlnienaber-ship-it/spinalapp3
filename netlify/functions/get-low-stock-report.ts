import type { Handler } from "@netlify/functions";
import admin from 'firebase-admin';
import { verifyJwtAndCheckRole } from "../utils/auth";
import { Product, ShiftRecord, Supplier, LowStockReport, SupplierOrder, OrderItem } from "../../src/types";

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
    
    const { shiftId } = event.queryStringParameters || {};

    if (!shiftId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'A shiftId query parameter is required.' }),
      };
    }

    // 1. Fetch all products and suppliers
    const productsSnapshot = await db.collection('products').where('isActive', '==', true).get();
    const products: Product[] = [];
    productsSnapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() } as Product));
    const productsMap = new Map(products.map(p => [p.name, p]));

    const suppliersSnapshot = await db.collection('suppliers').where('isActive', '==', true).get();
    const suppliersMap = new Map(suppliersSnapshot.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as Supplier]));

    // 2. Fetch the SPECIFIED shift report
    const shiftDoc = await db.collection('shifts').doc(shiftId).get();
    
    if (!shiftDoc.exists) {
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: `Shift with ID ${shiftId} not found.` }),
        };
    }

    const targetShift = shiftDoc.data() as ShiftRecord;
    const lowStockItems: OrderItem[] = [];

    // 3. Analyze closing stock against PAR levels
    targetShift.closingStock.forEach(category => {
      category.items.forEach(stockItem => {
        const productInfo = productsMap.get(stockItem.name);
        if (!productInfo || typeof productInfo.parLevel !== 'number') {
          return; // Skip if no product info or PAR level is not set
        }

        const currentStock = (stockItem.foh || 0) + (stockItem.storeRoom || 0) + (stockItem.quantity || 0);

        if (currentStock <= productInfo.parLevel) {
            // Provide defaults for robust calculation
            const reorderQty = productInfo.reorderQuantity || 1;
            const orderUnitSize = productInfo.orderUnitSize || 1;
            const minOrderQty = productInfo.minOrderQuantity || 1;

            // Calculate how many "order units" (e.g., cases) are needed to satisfy the reorder quantity, always rounding up.
            const unitsNeededForReorder = Math.ceil(reorderQty / orderUnitSize);

            // Determine the actual number of order units to recommend, ensuring it meets the MOQ.
            const recommendedOrderUnits = Math.max(unitsNeededForReorder, minOrderQty);

            // Convert the recommended order units back into the total number of individual items.
            const recommendedOrder = recommendedOrderUnits * orderUnitSize;

            lowStockItems.push({
                productName: productInfo.name,
                currentStock,
                parLevel: productInfo.parLevel,
                reorderQuantity: reorderQty,
                orderUnitSize: orderUnitSize,
                minOrderQuantity: minOrderQty,
                recommendedOrder: recommendedOrder
            });
        }
      });
    });

    // 4. Group low stock items by primary supplier
    const ordersBySupplier = new Map<string, SupplierOrder>();

    lowStockItems.forEach(item => {
        const productInfo = productsMap.get(item.productName);
        if (!productInfo || !productInfo.primarySupplierId) return;

        const supplierData = suppliersMap.get(productInfo.primarySupplierId);
        if (!supplierData) return;

        // FIX: Cast supplierData from 'unknown' to 'Supplier' to resolve TypeScript errors.
        const supplier = supplierData as Supplier;

        if (!ordersBySupplier.has(supplier.id)) {
            ordersBySupplier.set(supplier.id, {
                supplierId: supplier.id,
                supplierName: supplier.supplierName,
                supplierEmail: supplier.supplierEmail,
                items: [],
            });
        }
        ordersBySupplier.get(supplier.id)!.items.push(item);
    });

    const finalReport: LowStockReport = {
        reportGeneratedAt: new Date().toISOString(),
        lastShiftDate: targetShift.endTime,
        orders: Array.from(ordersBySupplier.values()),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(finalReport),
    };
  } catch (error) {
    console.error('Error generating low stock report:', error);
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