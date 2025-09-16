import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useState } from 'react';
import { ShiftState, StockCategory, StockItem } from '../types';

const API_ENDPOINT = "/api/submit-shift"; // Example endpoint

const performPreSubmissionCalculations = (shiftData: ShiftState): ShiftState => {
  const calculatedState = JSON.parse(JSON.stringify(shiftData)) as ShiftState;

  // 1. Adjust Opening Stock with new deliveries
  calculatedState.newStockDeliveries.forEach(delivery => {
    for (const category of calculatedState.openingStock) {
      const item = category.items.find(i => i.name === delivery.name);
      if (item) {
        if (item.quantity !== undefined) {
          item.quantity += delivery.quantity;
        } else if (item.foh !== undefined) {
          // Assuming deliveries go to the storeroom by default
          item.storeRoom = (item.storeRoom || 0) + delivery.quantity;
        }
        break; 
      }
    }
  });

  // 2. Calculate fullBottlesTotal for spirits in both opening and closing stock
  const calculateSpiritTotals = (stock: StockCategory[]): StockCategory[] => {
    return stock.map(category => {
      if (category.title === 'Spirits') {
        const newItems = category.items.map(item => {
          const foh = item.foh || 0;
          const storeRoom = item.storeRoom || 0;
          return {
            ...item,
            fullBottlesTotal: foh + storeRoom
          };
        });
        return { ...category, items: newItems };
      }
      return category;
    });
  };

  calculatedState.openingStock = calculateSpiritTotals(calculatedState.openingStock);
  calculatedState.closingStock = calculateSpiritTotals(calculatedState.closingStock);

  return calculatedState;
};


export function useApiClient() {
  const { getAccessTokenSilently } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = useCallback(async (shiftData: ShiftState): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const finalData = performPreSubmissionCalculations(shiftData);
      
      console.log("Submitting final calculated data:", finalData);
      
      // MOCK: This section simulates an API call.
      // In a real application, you would uncomment and use the fetch logic.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      /*
      // REAL API CALL LOGIC
      const token = await getAccessTokenSilently();
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit shift report.');
      }
      */

      setIsSubmitting(false);
      return true; // Indicate success
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("Submission failed:", errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
      return false; // Indicate failure
    }
  }, [getAccessTokenSilently]);

  return { postData, isSubmitting, error };
}
