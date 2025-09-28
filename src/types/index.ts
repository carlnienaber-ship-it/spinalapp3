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
  fullBottleWeight?: number;
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

// For supplier management
export type Supplier = {
  id: string;
  supplierName: string;
  supplierEmail: string;
  contactPerson?: string;
  address?: string;
  telephone?: string;
  liquorLicenseNumber?: string;
  bankDetails?: string;
  isActive: boolean;
};

// For product management
export type Product = {
  id: string;
  name: string;
  category: 'Spirits' | 'Cans and Bottles' | 'Food' | "Brewer's Reserve";
  fullBottleWeight?: number;
  isActive: boolean;
  parLevel?: number;
  orderUnitSize?: number;
  minOrderUnits?: number;
  primarySupplierId?: string;
  secondarySupplierId?: string;
  tertiarySupplierId?: string;
};