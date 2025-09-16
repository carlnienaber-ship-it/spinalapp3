// FIX: Added type definitions for the application.
export type Task = {
  id: string;
  text: string;
  description?: string;
  type: 'toggle' | 'radio' | 'radio_text' | 'toggle_text';
  completed: boolean;
  options?: string[];
  value?: string;
  notes?: string;
};

export type StockItem = {
  name: string;
  foh?: number;
  storeRoom?: number;
  openBottleWeight?: number;
  quantity?: number;
  fullBottlesTotal?: number; // Added for pre-submission calculation
};

export type StockCategory = {
  title: string;
  headers: string[];
  items: StockItem[];
};

export type NewStockDeliveryItem = {
    id: string;
    name: string;
    quantity: number;
};

// Represents the distinct steps in the shift handover process.
export type ShiftStep = 
  | 'welcome' 
  | 'opening_tasks' 
  | 'opening_stock'
  | 'motivational' // Hub for mid-shift tasks
  | 'new_stock_delivery' // Non-linear step accessed from motivational
  | 'closing_stock'
  | 'closing_tasks'
  | 'complete';

export type ShiftState = {
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