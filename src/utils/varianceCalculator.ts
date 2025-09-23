import { ShiftRecord } from '../types';

export type VarianceItem = {
  name: string;
  variance: number;
  unit: 'units' | 'shots';
};

export type VarianceCategory = {
  categoryTitle: string;
  items: VarianceItem[];
};

const SHOT_WEIGHT_GRAMS = 23.5;
const WEIGHT_TOLERANCE_GRAMS = 7;

export function calculateShiftVariance(shift: ShiftRecord): VarianceCategory[] {
  const varianceReport: VarianceCategory[] = [];

  shift.openingStock.forEach((openingCategory, categoryIndex) => {
    const closingCategory = shift.closingStock[categoryIndex];
    const categoryVariance: VarianceCategory = {
      categoryTitle: openingCategory.title,
      items: [],
    };

    openingCategory.items.forEach((openingItem) => {
      const closingItem = closingCategory.items.find(item => item.name === openingItem.name);
      if (!closingItem) return;

      const delivery = shift.newStockDeliveries.find(d => d.name === openingItem.name);
      const deliveryQty = delivery ? delivery.quantity : 0;

      let variance: number = 0;
      let unit: 'units' | 'shots' = 'units';

      // Logic for Spirits (mass-based calculation)
      if (openingCategory.title === 'Spirits') {
        unit = 'shots';
        const fullBottleWeight = openingItem.fullBottleWeight || 0;

        const openingFullBottles = (openingItem.foh || 0) + (openingItem.storeRoom || 0);
        const openingMass = (openingFullBottles * fullBottleWeight) + (openingItem.openBottleWeight || 0) + (deliveryQty * fullBottleWeight);
        
        const closingFullBottles = (closingItem.foh || 0) + (closingItem.storeRoom || 0);
        const closingMass = (closingFullBottles * fullBottleWeight) + (closingItem.openBottleWeight || 0);

        const varianceInGrams = openingMass - closingMass;
        
        // Apply the tolerance rule
        const finalVarianceInGrams = Math.abs(varianceInGrams) <= WEIGHT_TOLERANCE_GRAMS ? 0 : varianceInGrams;
        
        variance = finalVarianceInGrams / SHOT_WEIGHT_GRAMS;

      } else { // Logic for simple items (unit-based calculation)
        const openingCount = (openingItem.foh || 0) + (openingItem.storeRoom || 0) + (openingItem.quantity || 0);
        const closingCount = (closingItem.foh || 0) + (closingItem.storeRoom || 0) + (closingItem.quantity || 0);
        
        variance = (openingCount + deliveryQty) - closingCount;
      }
      
      categoryVariance.items.push({
        name: openingItem.name,
        variance,
        unit,
      });
    });
    
    // Only add the category to the report if it has items
    if (categoryVariance.items.length > 0) {
        varianceReport.push(categoryVariance);
    }
  });

  return varianceReport;
}