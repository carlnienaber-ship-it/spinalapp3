import React, { useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocalStorage } from './src/hooks/useLocalStorage';
import { useApiClient } from './src/hooks/useApiClient';
import { initialShiftState, stockTemplate } from './src/data/mockData';
import { ShiftState, ShiftStep, Task, StockItem, NewStockDeliveryItem, ShiftRecord } from './src/types';

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
  const [shiftState, setShiftState] = useLocalStorage<ShiftState>('shiftState', initialShiftState);
  const { submitShift, getShifts, loading: apiLoading, error: apiError } = useApiClient();

  const [adminShowDashboard, setAdminShowDashboard] = useState(false);
  const [showNewDelivery, setShowNewDelivery] = useState(false);

  const isAdmin = useMemo(() => {
    const roles = user?.['https://spinalapp.com/roles'] as string[] | undefined;
    return roles?.includes('Admin') ?? false;
  }, [user]);

  const canProceed = isAdmin || isWithinFence;
  const isGeoDisabled = !canProceed && shiftState.currentStep !== 'welcome' && !adminShowDashboard && shiftState.currentStep !== 'complete';

  const steps: { id: ShiftStep; title: string }[] = [
    { id: 'openingTasks', title: 'Opening' },
    { id: 'openingStock', title: 'Stocktake' },
    { id: 'midShift', title: 'On Shift' },
    { id: 'closingStock', title: 'Stocktake' },
    { id: 'closingTasks', title: 'Closing' },
    { id: 'feedback', title: 'Feedback' },
  ];

  const handleNextStep = (nextStep: ShiftStep) => {
    let updates: Partial<ShiftState> = { currentStep: nextStep };
    if (nextStep === 'openingTasks') {
      updates.startTime = new Date().toISOString();
    }
    setShiftState(prev => ({ ...prev, ...updates }));
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setShiftState(initialShiftState);
    setShowNewDelivery(false);
    setAdminShowDashboard(false);
  };

  const handleTaskChange = (list: 'openingTasks' | 'closingTasks') => (updatedTask: Task) => {
    setShiftState(prev => ({
      ...prev,
      [list]: prev[list].map(task => (task.id === updatedTask.id ? updatedTask : task)),
    }));
  };

  const handleStockChange = (
    list: 'openingStock' | 'closingStock'
  ) => (categoryIndex: number, itemIndex: number, field: Exclude<keyof StockItem, 'name'>, value: number) => {
    setShiftState(prev => {
      const newStock = JSON.parse(JSON.stringify(prev[list]));
      const itemToUpdate = newStock[categoryIndex].items[itemIndex];
      itemToUpdate[field] = value;
      return { ...prev, [list]: newStock };
    });
  };
  
  const handleFeedbackChange = (rating: 'Great' | 'Normal' | 'Bad' | null, comment: string) => {
    setShiftState(prev => ({
      ...prev,
      shiftFeedback: { rating, comment },
    }));
  };

  const handleNewDeliveryAdd = (item: NewStockDeliveryItem) => {
    setShiftState(prev => ({
      ...prev,
      newStockDeliveries: [...prev.newStockDeliveries, item],
    }));
  };

  const handleNewDeliveryRemove = (id: string) => {
    setShiftState(prev => ({
      ...prev,
      newStockDeliveries: prev.newStockDeliveries.filter(d => d.id !== id),
    }));
  };

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
      handleNextStep('feedback'); // Revert on failure
    }
  };

  const allStockItems = useMemo(() => {
    const itemSet = new Set<string>();
    stockTemplate.forEach(category => {
      category.items.forEach(item => {
        itemSet.add(item.name);
      });
    });
    return Array.from(itemSet).sort();
  }, []);
  
  const areOpeningTasksComplete = useMemo(() => shiftState.openingTasks.every(t => t.completed), [shiftState.openingTasks]);
  const areClosingTasksComplete = useMemo(() => shiftState.closingTasks.every(t => t.completed), [shiftState.closingTasks]);

  const renderStepContent = () => {
    switch (shiftState.currentStep) {
      case 'welcome':
        return (
          <div className="text-center">
            <Header title={`Welcome, ${user?.given_name || user?.name}!`} subtitle={`Logged in as ${user?.email}`} />
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
              {!isWithinFence && !isAdmin && <GeoStatus />}
              {isWithinFence && <GeoStatus />}
              {isAdmin && !isWithinFence && <AdminGeoOverrideIndicator />}
              <Button onClick={() => handleNextStep('openingTasks')} size="lg" className="mt-6 w-full" disabled={!canProceed || geoLoading}>
                {geoLoading ? 'Verifying Location...' : 'Clock In & Start Shift'}
              </Button>
              {isAdmin && (
                <Button onClick={() => setAdminShowDashboard(true)} variant="secondary" className="mt-4 w-full">
                  Admin Dashboard
                </Button>
              )}
            </div>
          </div>
        );
        
      case 'openingTasks':
        return (
          <>
            <TaskList title="Opening Tasks" tasks={shiftState.openingTasks} onTaskChange={handleTaskChange('openingTasks')} disabled={isGeoDisabled} />
            <Button onClick={() => handleNextStep('openingStock')} className="mt-8 w-full" size="lg" disabled={!areOpeningTasksComplete || isGeoDisabled}>
              Continue to Opening Stocktake
            </Button>
            {!areOpeningTasksComplete && <p className="text-center text-sm text-yellow-400 mt-2">All tasks must be completed to continue.</p>}
          </>
        );

      case 'openingStock':
        return (
          <>
            <StocktakeForm title="Opening Stocktake" stockData={shiftState.openingStock} onStockChange={handleStockChange('openingStock')} disabled={isGeoDisabled} />
            <Button onClick={() => handleNextStep('midShift')} className="mt-8 w-full" size="lg" disabled={isGeoDisabled}>
              Continue to Mid-Shift
            </Button>
          </>
        );
      
      case 'midShift':
        return (
          <MotivationalScreen
            onNewDelivery={() => setShowNewDelivery(true)}
            onProceed={() => handleNextStep('closingStock')}
            disabled={isGeoDisabled}
          />
        );
      
      case 'closingStock':
        return (
          <>
            <StocktakeForm title="Closing Stocktake" stockData={shiftState.closingStock} onStockChange={handleStockChange('closingStock')} disabled={isGeoDisabled} />
            <Button onClick={() => handleNextStep('closingTasks')} className="mt-8 w-full" size="lg" disabled={isGeoDisabled}>
              Continue to Closing Tasks
            </Button>
          </>
        );

      case 'closingTasks':
        return (
          <>
            <TaskList title="Closing Tasks" tasks={shiftState.closingTasks} onTaskChange={handleTaskChange('closingTasks')} disabled={isGeoDisabled} />
            <Button onClick={() => handleNextStep('feedback')} className="mt-8 w-full" size="lg" disabled={!areClosingTasksComplete || isGeoDisabled}>
              Continue to Feedback
            </Button>
            {!areClosingTasksComplete && <p className="text-center text-sm text-yellow-400 mt-2">All tasks must be completed to continue.</p>}
          </>
        );
      
      case 'feedback':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-50 mb-6">Final Step: Shift Feedback</h2>
            <Feedback feedback={shiftState.shiftFeedback} onFeedbackChange={handleFeedbackChange} disabled={isGeoDisabled} />
            <div className="mt-8">
              {apiError && <p className="text-red-400 text-center mb-4">Error: {apiError.message}</p>}
              <Button onClick={handleSubmit} className="w-full" size="lg" disabled={apiLoading || !shiftState.shiftFeedback.rating || isGeoDisabled}>
                {apiLoading ? 'Submitting...' : 'Clock Out & Submit Report'}
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
  
  if (adminShowDashboard && isAdmin) {
    return <AdminDashboard onBack={() => setAdminShowDashboard(false)} />;
  }

  if (showNewDelivery) {
    return (
       <main className="container mx-auto p-4 md:p-8">
         <NewStockDelivery
            deliveries={shiftState.newStockDeliveries}
            stockItems={allStockItems}
            onAdd={handleNewDeliveryAdd}
            onRemove={handleNewDeliveryRemove}
            disabled={isGeoDisabled}
          />
          <Button onClick={() => setShowNewDelivery(false)} className="mt-8" variant="secondary">Back to Mid-Shift Hub</Button>
       </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Spinäl Äpp Handover</h1>
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
        {isGeoDisabled && <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 mb-6 rounded-r-lg" role="alert"><p className="font-bold">Functionality Disabled</p><p>You are outside the required geofence. Please return to the location to continue your shift.</p></div>}
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