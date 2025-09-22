export type TaskType = 'toggle' | 'radio' | 'radio_text' | 'toggle_text';

export type Task = {
  id: string;
  text: string;
  type: TaskType;
  completed: boolean;
  value?: string;
  options?: string[];
  notes?: string;
  description?: string;
};

export type StockItem = {
  name: string;
  foh?: number;
  storeRoom?: number;
  openBottleWeight?: number;
  quantity?: number;
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

export type ShiftFeedback = {
  rating: 'Great' | 'Normal' | 'Bad' | null;
  comment: string;
};

export type ShiftStep =
  | 'welcome'
  | 'openingTasks'
  | 'openingStock'
  | 'midShift'
  | 'newStockDelivery'
  | 'closingTasks'
  | 'closingStock'
  | 'feedback'
  | 'submitting'
  | 'complete'
  | 'admin_dashboard';

export type ShiftState = {
  currentStep: ShiftStep;
  startTime: string | null;
  endTime: string | null;
  openingTasks: Task[];
  closingTasks: Task[];
  openingStock: StockCategory[];
  closingStock: StockCategory[];
  newStockDeliveries: NewStockDeliveryItem[];
  shiftFeedback: ShiftFeedback;
  user?: {
    name?: string;
    email?: string;
    picture?: string;
  };
};

// For admin dashboard
export type ShiftRecord = ShiftState & {
  id: string;
};