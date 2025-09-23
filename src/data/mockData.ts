import { ShiftState, StockCategory, Task, Product } from '../types';

export const openingTasks: Task[] = [
    { id: 'ac_on_open', text: 'Turn on airconditioner', type: 'toggle', completed: false },
    { id: 'open_sign', text: 'Change window sign to "Open"', type: 'toggle', completed: false },
    { id: 'a_frame', text: 'Take Happy Hour sign outside', type: 'toggle', completed: false },
    { id: 'bathroom_unlock', text: 'Unlock bathroom', type: 'toggle', completed: false },
    { id: 'menu_board_check', text: 'Check menu board', type: 'radio', options: ['OK', 'Needs Update'], completed: false, value: '' },
    { id: 'beer_quality_check', text: 'Check beer quality', type: 'radio_text', options: ['Good', 'Needs Attention'], completed: false, value: '', notes: '' },
    { id: 'lights_on_open', text: 'Turn on lamps and under bar lights', type: 'toggle', completed: false },
];

export const closingTasks: Task[] = [
    { id: 'closed_sign', text: 'Change window sign to "Closed"', type: 'toggle', completed: false },
    { id: 'happy_hour_sign', text: 'Bring Happy Hour sign inside', type: 'toggle', completed: false },
    { id: 'notify_shortages', text: 'Notify Carl about shortages', type: 'toggle', completed: false },
    { id: 'close_tabs', text: 'Close all outstanding bar tabs', type: 'toggle_text', completed: false, notes: '', description: 'Notify Carl if any tabs remain open.' },
    { id: 'clean_glassware', text: 'Clean all glassware and dishes', type: 'toggle', completed: false },
    { id: 'plug_in_devices_close', text: 'Plug in iPad and Yoco', type: 'toggle', completed: false },
    { id: 'storeroom_lock', text: 'Lock store room', type: 'toggle', completed: false },
    { id: 'electricity_meter_check_close', text: 'Check prepaid electricity meter', type: 'toggle', completed: false, description: 'Notify Carl if under 30 units.' },
    { id: 'bathroom_lock', text: 'Lock bathroom', type: 'toggle', completed: false },
    { id: 'back_door_lock', text: 'Lock back door', type: 'toggle', completed: false },
    { id: 'lights_off', text: 'Switch off lamps and under bar lights', type: 'toggle', completed: false },
    { id: 'ac_off', text: 'Switch off airconditioner', type: 'toggle', completed: false },
];

// Deep copy function to avoid mutation issues between opening and closing stock
const deepCopyStock = (stock: StockCategory[]): StockCategory[] => JSON.parse(JSON.stringify(stock));

export const generateInitialShiftState = (products: Product[]): ShiftState => {
  const stockCategories: StockCategory[] = [
    { title: 'Spirits', headers: ['FOH', 'Store Room', 'Open Bottle Weight'], items: [] },
    { title: 'Cans and Bottles', headers: ['FOH', 'Store Room'], items: [] },
    { title: 'Food', headers: ['Quantity'], items: [] },
    { title: "Brewer's Reserve", headers: ['FOH', 'Store Room'], items: [] },
  ];

  products.forEach(product => {
    const category = stockCategories.find(c => c.title === product.category);
    if (category) {
      const stockItem: any = { name: product.name };
      if (product.fullBottleWeight) {
        stockItem.fullBottleWeight = product.fullBottleWeight;
      }
      category.items.push(stockItem);
    }
  });

  // Sort items alphabetically within each category
  stockCategories.forEach(category => {
    category.items.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return {
    currentStep: 'welcome',
    startTime: null,
    endTime: null,
    openingTasks,
    closingTasks,
    openingStock: deepCopyStock(stockCategories),
    closingStock: deepCopyStock(stockCategories),
    newStockDeliveries: [],
    shiftFeedback: {
      rating: null,
      comment: '',
    },
  };
};