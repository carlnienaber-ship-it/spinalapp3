

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocalStorage } from './src/hooks/useLocalStorage';
import { useApiClient } from './src/hooks/useApiClient';
import { generateInitialShiftState } from './src/data/mockData';
import { ShiftState, ShiftStep, Task, StockItem, NewStockDeliveryItem, Product } from './src/types';

// Components
import Header from './src/components/ui/Header';
import Button from './src/components/ui/Button';
import TaskList from './src/components/tasks/TaskList';
import StocktakeForm from './src/components/stock/StocktakeForm';
import Feedback from './src/components/ui/Feedback';
import GeoStatus from './src/components/ui/GeoStatus';
import AdminGeoOverrideIndicator from './src/components/ui/AdminGeoOverrideIndicator';
import { useGeolocation } from './src/hooks/useGeolocation';
import ProgressIndicator from './src/components/ui/ProgressIndicator';
import MotivationalScreen from './src/components/ui/MotivationalScreen';
import NewStockDelivery from './src/components/stock/NewStockDelivery';
import CompletionScreen from './src/components/ui/CompletionScreen';
import AdminDashboard from './src/components/admin/AdminDashboard';

const App: React.FC = () => {
  const { user, logout } = useAuth0();
  const { isWithinFence, loading: geoLoading } = useGeolocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Initialize shiftState with a default structure. It will be populated dynamically.
  const [shiftState, setShiftState] = useLocalStorage<ShiftState>('shiftState', {
    currentStep: 'welcome',
    startTime: null,
    endTime: null,
    openingTasks: [],
    closingTasks: [],
    openingStock: [],
    closingStock: [],
    newStockDeliveries: [],
    shiftFeedback: { rating: null, comment: '' },
  });

  const { submitShift, getProducts, loading: apiLoading, error: apiError } = useApiClient();
  const [showNewDelivery, setShowNewDelivery] = useState(false);
  const [adminShowDashboard, setAdminShowDashboard] = useState(true);
  
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      return fetchedProducts;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Handle error, maybe show a message to the user
      return [];
    } finally {
      setProductsLoading(false);
    }
  }, [getProducts]);
  
  // Effect 1: Fetch products on initial component mount.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Effect 2: Initialize shift state *after* products are successfully fetched,
  // but only if the shift is new and hasn't started yet.
  useEffect(() => {
    if (products.length > 0 && shiftState.currentStep === 'welcome' && !shiftState.startTime) {
      // Use only active products for the shift
      const activeProducts = products.filter(p => p.isActive);
      setShiftState(generateInitialShiftState(activeProducts));
    }
  }, [products, shiftState.currentStep, shiftState.startTime, setShiftState]);


  const isAdmin = useMemo(() => {
    const roles = user?.['https://spinalapp.com/roles'] as string[] | undefined;
    return roles?.includes('Admin') ?? false;
  }, [user]);

  const canProceed = isAdmin || isWithinFence;

  const allOpeningTasksCompleted = useMemo(() => {
    if (!shiftState.openingTasks || shiftState.openingTasks.length === 0) return false;
    return shiftState.openingTasks.every(task => task.completed);
  }, [shiftState.openingTasks]);

  const allClosingTasksCompleted = useMemo(() => {
    if (!shiftState.closingTasks || shiftState.closingTasks.length === 0) return false;
    return shiftState.closingTasks.every(task => task.completed);
  }, [shiftState.closingTasks]);

  const steps: { id: ShiftStep; title: string }[] = [
    { id: 'welcome', title: 'Start Shift' },
    { id: 'openingTasks', title: 'Opening Tasks' },
    { id: 'openingStock', title: 'Opening Stock' },
    { id: 'midShift', title: 'Mid-Shift' },
    { id: 'closingStock', title: 'Closing Stock' },
    { id: 'closingTasks', title: 'Closing Tasks' },
    { id: 'feedback', title: 'Feedback' },
    { id: 'complete', title: 'Complete' },
  ];

  const handleNextStep = useCallback((nextStep: ShiftStep) => {
    let updates: Partial<ShiftState> = { currentStep: nextStep };
    if (nextStep === 'openingTasks') {
      updates.startTime = new Date().toISOString();
    }
    setShiftState(prev => ({ ...prev, ...updates }));
    window.scrollTo(0, 0);
  }, [setShiftState]);

  const handleReset = useCallback(() => {
    const activeProducts = products.filter(p => p.isActive);
    setShiftState(generateInitialShiftState(activeProducts));
    setShowNewDelivery(false);
    setAdminShowDashboard(true);
  }, [products, setShiftState]);

  const handleTaskChange = useCallback((list: 'openingTasks' | 'closingTasks') => (updatedTask: Task) => {
    setShiftState(prev => ({
      ...prev,
      [list]: prev[list].map(task => (task.id === updatedTask.id ? updatedTask : task)),
    }));
  }, [setShiftState]);

  const handleStockChange = useCallback((
    list: 'openingStock' | 'closingStock'
  ) => (categoryIndex: number, itemIndex: number, field: keyof StockItem, value: number) => {
    setShiftState(prev => {
      const newStock = JSON.parse(JSON.stringify(prev[list]));
      newStock[categoryIndex].items[itemIndex][field] = value;
      return { ...prev, [list]: newStock };
    });
  }, [setShiftState]);
  
  const handleFeedbackChange = useCallback((rating: 'Great' | 'Normal' | 'Bad' | null, comment: string) => {
    setShiftState(prev => ({
      ...prev,
      shiftFeedback: { rating, comment },
    }));
  }, [setShiftState]);

  const handleNewDeliveryAdd = useCallback((item: NewStockDeliveryItem) => {
    setShiftState(prev => ({
      ...prev,
      newStockDeliveries: [...prev.newStockDeliveries, item],
    }));
  }, [setShiftState]);

  const handleNewDeliveryRemove = useCallback((id: string) => {
    setShiftState(prev => ({
      ...prev,
      newStockDeliveries: prev.newStockDeliveries.filter(d => d.id !== id),
    }));
  }, [setShiftState]);

  const handleSubmit = async () => {
    if (shiftState.shiftFeedback.rating && (shiftState.shiftFeedback.rating !== 'Normal' && !shiftState.shiftFeedback.comment)) {
      alert("Please add a comment for 'Great' or 'Bad' feedback.");
      return;
    }
    
    handleNextStep('submitting');
    
    const finalShiftData: ShiftState = {
      ...shiftState,
      endTime: new Date().toISOString(),
      user: {
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
      }
    };

    try {
      await submitShift(finalShiftData);
      handleNextStep('complete');
    } catch (e) {
      console.error("Submission failed:", e);
      // Revert to feedback step on failure
      handleNextStep('feedback');
    }
  };

  const allStockItems = useMemo(() => {
    return products.filter(p => p.isActive).map(p => p.name).sort();
  }, [products]);

  const renderStepContent = () => {
    if (productsLoading && shiftState.currentStep !== 'welcome') {
        return <div className="text-center p-8">Loading products...</div>;
    }
    
    if (isAdmin && shiftState.currentStep === 'welcome' && adminShowDashboard) {
      return (
        <AdminDashboard 
          products={products}
          productsLoading={productsLoading}
          // FIX: Wrap fetchProducts to match the expected `() => Promise<void>` signature.
          onProductsChange={async () => { await fetchProducts(); }}
          onBack={() => setAdminShowDashboard(false)} 
        />
      );
    }

    switch (shiftState.currentStep) {
      case 'welcome':
        return (
          <div className="text-center">
            <Header title="Ready to Start Your Shift?" subtitle={`Logged in as ${user?.name}`} />
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
              {isAdmin && !isWithinFence && <AdminGeoOverrideIndicator />}
              {!isAdmin && <GeoStatus />}
               <Button onClick={() => handleNextStep('openingTasks')} size="lg" className="mt-6 w-full" disabled={!canProceed || geoLoading || productsLoading}>
                {geoLoading ? 'Verifying Location...' : productsLoading ? 'Loading Products...' : 'Clock In & Start Shift'}
              </Button>
              {isAdmin && (
                <Button onClick={() => setAdminShowDashboard(true)} className="mt-4 w-full" disabled={apiLoading}>
                  Admin Dashboard
                </Button>
              )}
            </div>
          </div>
        );

      case 'openingTasks':
        return (
          <>
            <TaskList title="Opening Tasks" tasks={shiftState.openingTasks} onTaskChange={handleTaskChange('openingTasks')} />
            <Button
              onClick={() => handleNextStep('openingStock')}
              className="mt-8 w-full"
              size="lg"
              disabled={!allOpeningTasksCompleted}
            >
              Continue to Opening Stocktake
            </Button>
            {!allOpeningTasksCompleted && (
              <p className="text-center text-yellow-400 mt-2 text-sm">Please complete all tasks before continuing.</p>
            )}
          </>
        );

      case 'openingStock':
        return (
          <>
            <StocktakeForm title="Opening Stocktake" stockData={shiftState.openingStock} onStockChange={handleStockChange('openingStock')} />
            <Button onClick={() => handleNextStep('midShift')} className="mt-8 w-full" size="lg">Continue to Mid-Shift</Button>
          </>
        );
      
      case 'midShift':
        return (
          <MotivationalScreen
            onNewDelivery={() => setShowNewDelivery(true)}
            onProceed={() => {
              setShowNewDelivery(false);
              handleNextStep('closingStock');
            }}
          />
        );

      case 'newStockDelivery': // This step is shown conditionally via a modal or separate view
        return (
          <>
            <NewStockDelivery
              deliveries={shiftState.newStockDeliveries}
              stockItems={allStockItems}
              onAdd={handleNewDeliveryAdd}
              onRemove={handleNewDeliveryRemove}
            />
            <Button onClick={() => handleNextStep('midShift')} className="mt-8 w-full" size="lg">Back to Mid-Shift Hub</Button>
          </>
        );
      
      case 'closingStock':
        return (
          <>
            <StocktakeForm title="Closing Stocktake" stockData={shiftState.closingStock} onStockChange={handleStockChange('closingStock')} />
            <Button onClick={() => handleNextStep('closingTasks')} className="mt-8 w-full" size="lg">Continue to Closing Tasks</Button>
          </>
        );

      case 'closingTasks':
        return (
          <>
            <TaskList title="Closing Tasks" tasks={shiftState.closingTasks} onTaskChange={handleTaskChange('closingTasks')} />
            <Button
              onClick={() => handleNextStep('feedback')}
              className="mt-8 w-full"
              size="lg"
              disabled={!allClosingTasksCompleted}
            >
              Continue to Feedback
            </Button>
            {!allClosingTasksCompleted && (
              <p className="text-center text-yellow-400 mt-2 text-sm">Please complete all tasks before continuing.</p>
            )}
          </>
        );

      case 'feedback':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-50 mb-6">Final Step: Shift Feedback</h2>
            <Feedback feedback={shiftState.shiftFeedback} onFeedbackChange={handleFeedbackChange} />
            <div className="mt-8">
              {apiError && <p className="text-red-400 text-center mb-4">Error: {apiError.message}</p>}
              <Button onClick={handleSubmit} className="w-full" size="lg" disabled={apiLoading || !shiftState.shiftFeedback.rating}>
                {apiLoading ? 'Submitting...' : 'Complete Handover'}
              </Button>
            </div>
          </div>
        );
      
      case 'submitting':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100">Submitting your report...</h2>
            <p className="text-gray-400 mt-2">Please wait.</p>
          </div>
        );
      
      case 'complete':
        return <CompletionScreen onStartNewShift={handleReset} />;

      default:
        return <p>Unknown step.</p>;
    }
  };
  
  if (showNewDelivery) {
    return (
       <main className="container mx-auto p-4 md:p-8">
         <NewStockDelivery
            deliveries={shiftState.newStockDeliveries}
            stockItems={allStockItems}
            onAdd={handleNewDeliveryAdd}
            onRemove={handleNewDeliveryRemove}
          />
          <Button onClick={() => setShowNewDelivery(false)} className="mt-8" variant="secondary">Back to Mid-Shift Hub</Button>
       </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Spinäl Äpp</h1>
        <div>
          <span className="text-sm mr-4">{user?.name}</span>
          <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} variant="secondary" size="sm">
            Log Out
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {shiftState.currentStep !== 'welcome' && shiftState.currentStep !== 'complete' && (
           <ProgressIndicator steps={steps} currentStepId={shiftState.currentStep} />
        )}
        {renderStepContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Spinäl Täp. All rights reserved.</p>
        <button onClick={handleReset} className="text-gray-600 hover:text-gray-400 mt-2 text-xs">Reset Shift Data (Dev)</button>
      </footer>
    </div>
  );
};

export default App;