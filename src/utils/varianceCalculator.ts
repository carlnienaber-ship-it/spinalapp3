import { ShiftRecord, Product } from '../types';

export type StockOnHand = {
  bottles?: number;
  weight?: number;
  quantity?: number;
};

export type VarianceItem = {
  name: string;
  variance: number;
  unit: 'units' | 'shots';
  openingSOH: StockOnHand;
  closingSOH: StockOnHand;
};

export type VarianceCategory = {
  categoryTitle: string;
  items: VarianceItem[];
};

const SHOT_WEIGHT_GRAMS = 23.5;
const WEIGHT_TOLERANCE_GRAMS = 7;

export function calculateShiftVariance(shift: ShiftRecord, allProducts: Product[]): VarianceCategory[] {
  const varianceReport: VarianceCategory[] = [];
  const productsMap = new Map(allProducts.map(p => [p.name, p]));

  shift.openingStock.forEach((openingCategory, categoryIndex) => {
    const closingCategory = shift.closingStock[categoryIndex];
    const categoryVariance: VarianceCategory = {
      categoryTitle: openingCategory.title,
      items: [],
    };

    openingCategory.items.forEach((openingItem) => {
      const closingItem = closingCategory.items.find(item => item.name === openingItem.name);
      if (!closingItem) return;
      
      const productInfo = productsMap.get(openingItem.name);
      const delivery = shift.newStockDeliveries.find(d => d.name === openingItem.name);
      const deliveryQty = delivery ? delivery.quantity : 0;

      let variance: number = 0;
      let unit: 'units' | 'shots' = 'units';
      const openingSOH: StockOnHand = {};
      const closingSOH: StockOnHand = {};

      // Logic for Spirits (liquid mass-based calculation)
      if (openingCategory.title === 'Spirits') {
        unit = 'shots';
        // Get weights from the live product data for accuracy, not the historical shift record
        const { emptyBottleWeight, grossWeight } = productInfo || {};

        // If essential weight data is missing from the current product data, we cannot calculate accurately.
        if (typeof emptyBottleWeight !== 'number' || typeof grossWeight !== 'number') {
            variance = 0; // Skip calculation to avoid errors, defaults to 0
        } else {
            const liquidWeightPerBottle = grossWeight - emptyBottleWeight;

            const openingFullBottles = (openingItem.foh || 0) + (openingItem.storeRoom || 0);
            const openingOpenLiquid = (openingItem.openBottleWeight || 0) > emptyBottleWeight 
                ? (openingItem.openBottleWeight || 0) - emptyBottleWeight
                : 0;
            const openingTotalLiquid = (openingFullBottles * liquidWeightPerBottle) + openingOpenLiquid + (deliveryQty * liquidWeightPerBottle);

            const closingFullBottles = (closingItem.foh || 0) + (closingItem.storeRoom || 0);
            const closingOpenLiquid = (closingItem.openBottleWeight || 0) > emptyBottleWeight
                ? (closingItem.openBottleWeight || 0) - emptyBottleWeight
                : 0;
            const closingTotalLiquid = (closingFullBottles * liquidWeightPerBottle) + closingOpenLiquid;

            const varianceInGrams = openingTotalLiquid - closingTotalLiquid;
            
            // Apply the tolerance rule
            const finalVarianceInGrams = Math.abs(varianceInGrams) <= WEIGHT_TOLERANCE_GRAMS ? 0 : varianceInGrams;
            
            variance = finalVarianceInGrams / SHOT_WEIGHT_GRAMS;
        }

        // Capture SOH details for display
        openingSOH.bottles = (openingItem.foh || 0) + (openingItem.storeRoom || 0);
        openingSOH.weight = openingItem.openBottleWeight || 0;
        closingSOH.bottles = (closingItem.foh || 0) + (closingItem.storeRoom || 0);
        closingSOH.weight = closingItem.openBottleWeight || 0;

      } else { // Logic for simple items (unit-based calculation)
        const openingCount = (openingItem.foh || 0) + (openingItem.storeRoom || 0) + (openingItem.quantity || 0);
        const closingCount = (closingItem.foh || 0) + (closingItem.storeRoom || 0) + (closingItem.quantity || 0);
        
        variance = (openingCount + deliveryQty) - closingCount;

        // Capture SOH details
        openingSOH.quantity = openingCount;
        closingSOH.quantity = closingCount;
      }
      
      categoryVariance.items.push({
        name: openingItem.name,
        variance,
        unit,
        openingSOH,
        closingSOH,
      });
    });
    
    // Only add the category to the report if it has items
    if (categoryVariance.items.length > 0) {
        varianceReport.push(categoryVariance);
    }
  });

  return varianceReport;
}