// src/types/index.ts

// Basic types for tasks
export type Task = {
  id: string;
  text: string;
  type: 'toggle' | 'radio' | 'radio_text' | 'toggle_text';
  completed: boolean;
  options?: string[];
  value?: string;
  notes?: string;
  description?: string;
};

// Types for stock management
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
  name:string;
  quantity: number;
};

// Types for shift progression
export type ShiftStep = 
  | 'welcome' 
  | 'openingTasks' 
  | 'openingStock' 
  | 'midShift' 
  | 'newStockDelivery'
  | 'closingStock' 
  | 'closingTasks' 
  | 'feedback' 
  | 'submitting'
  | 'complete';

// Main shift state object
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
  user?: {
    name?: string;
    email?: string;
    picture?: string;
  };
};

// Shift record as stored in the database
export type ShiftRecord = ShiftState & {
  id: string;
};

// Product information
export type Product = {
  id: string;
  name: string;
  category: 'Spirits' | 'Cans and Bottles' | 'Food' | "Brewer's Reserve";
  fullBottleWeight?: number;
  isActive: boolean;
  parLevel?: number;
  orderUnitSize?: number;
  minOrderQuantity?: number;
  reorderQuantity?: number;
  primarySupplierId?: string;
  secondarySupplierId?: string;
  tertiarySupplierId?: string;
  isBrewersReserve?: boolean;
  tastingNotes?: string;
  abv?: number;
  price?: number;
};

// Supplier information
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

// Types for stock ordering report
export type OrderItem = {
    productName: string;
    currentStock: number;
    parLevel: number;
    reorderQuantity: number;
    orderUnitSize: number;
    minOrderQuantity: number;
    recommendedOrder: number;
};

export type SupplierOrder = {
    supplierId: string;
    supplierName: string;
    supplierEmail: string;
    items: OrderItem[];
};

export type LowStockReport = {
    reportGeneratedAt: string;
    lastShiftDate: string | null;
    orders: SupplierOrder[];
};

// Types for the DETAILED hours worked report
export type ShiftDetailRecord = {
  id: string;
  startTime: string;
  endTime: string;
  hours: number;
};

export type DetailedHoursWorkedReport = {
  userName: string;
  userEmail: string;
  totalHours: number;
  shifts: ShiftDetailRecord[];
};
