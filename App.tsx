import React, { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocalStorage } from './src/hooks/useLocalStorage';
import { useGeolocation } from './src/hooks/useGeolocation';
import { useApiClient } from './src/hooks/useApiClient';
import { initialShiftState, stockTemplate } from './src/data/mockData';
import { ShiftState, ShiftStep, Task, StockCategory, StockItem, NewStockDeliveryItem } from './src/types';

import Header from './src/components/ui/Header';
import GeoStatus from './src/components/ui/GeoStatus';
import Button from './src/components/ui/Button';
import ProgressIndicator from './src/components/ui/ProgressIndicator';
import TaskList from './src/components/tasks/TaskList';
import StocktakeForm from './src/components/stock/StocktakeForm';
import NewStockDelivery from './src/components/stock/NewStockDelivery';
import Feedback from './src/components/ui/Feedback';
import CompletionScreen from './src/components/ui/CompletionScreen';
import MotivationalScreen from './src/components/ui/MotivationalScreen';
import AdminGeoOverrideIndicator from './src/components/ui/AdminGeoOverrideIndicator';

const allStockItems = stockTemplate.flatMap(cat => cat.items.map(item => item.name));

const App: React.FC = () => {
  const { user, logout } = useAuth0();
  const { isWithinFence, loading: geoLoading, error: geoError } = useGeolocation();
  const { postData, isSubmitting, error: submissionError } = useApiClient();

  const [shiftState, setShiftState] = useLocalStorage<ShiftState>('shiftState', initialShiftState);

  // Check for Admin role to bypass geofence
  const roles = user?.['https://spinalapp.com/roles'] as string[] | undefined;
  const isAdmin = roles?.includes('Admin') || false;

  // Geofence is disabled if the user is off-site AND not an admin
  const isGeoDisabled = !isWithinFence && !isAdmin && shiftState.currentStep !== 'welcome' && shiftState.currentStep !== 'opening_tasks';

  const setStep = (step: ShiftStep) => {
    setShiftState((prev) => ({ ...prev, currentStep: step }));
  };

  const handleStartShift = () => {
    setShiftState({
      ...initialShiftState,
      startTime: new Date().toISOString(),
      currentStep: 'opening_tasks',
    });
  };
  
  const handleStartNewShift = () => {
    setShiftState(initialShiftState); 
  };

  const handleTaskChange = useCallback((updatedTask: Task, taskType: 'opening' | 'closing') => {
    setShiftState(prev => {
      const tasks = taskType === 'opening' ? prev.openingTasks : prev.closingTasks;
      const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      return taskType === 'opening'
        ? { ...prev, openingTasks: newTasks }
        : { ...prev, closingTasks: newTasks };
    });
  }, [setShiftState]);
  
  const handleStockChange = useCallback((categoryIndex: number, itemIndex: number, field: keyof StockItem, value: number, stockType: 'opening' | 'closing') => {
    setShiftState(prev => {
      const stock = stockType === 'opening' ? prev.openingStock : prev.closingStock;
      const newStock = JSON.parse(JSON.stringify(stock)) as StockCategory[];
      const itemToUpdate = newStock[categoryIndex].items[itemIndex];
      
      if (field !== 'name') {
        type WritableStockItem = Omit<StockItem, 'name'>;
        (itemToUpdate as WritableStockItem)[field as keyof WritableStockItem] = value;
      }
      
      return stockType === 'opening'
        ? { ...prev, openingStock: newStock }
        : { ...prev, closingStock: newStock };
    });
  }, [setShiftState]);
  
  const handleAddDelivery = (item: NewStockDeliveryItem) => {
    setShiftState(prev => ({
      ...prev,
      newStockDeliveries: [...prev.newStockDeliveries, item]
    }));
  };

  const handleRemoveDelivery = (id: string) => {
    setShiftState(prev => ({
      ...prev,
      newStockDeliveries: prev.newStockDeliveries.filter(item => item.id !== id)
    }));
  };

  const handleFeedbackChange = (rating: 'Great' | 'Normal' | 'Bad' | null, comment: string) => {
    setShiftState(prev => ({
      ...prev,
      shiftFeedback: { rating, comment }
    }));
  };

  const handleSubmitShift = async () => {
    const finalState: ShiftState = {
      ...shiftState,
      endTime: new Date().toISOString(),
    };
    const success = await postData(finalState);
    if (success) {
        setShiftState(finalState);
        setStep('complete');
    }
  };

  const renderCurrentStep = () => {
    switch (shiftState.currentStep) {
      case 'welcome':
        const welcomeName = user?.given_name || (user?.name && !user.name.includes('@') ? user.name.split(' ')[0] : '');
        return (
          <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <Header title={`Welcome${welcomeName ? ` ${welcomeName}` : ''}`} subtitle={`Logged in as ${user?.email}`} />
            <div className="my-6 flex justify-center"><GeoStatus /></div>
            <Button 
              onClick={handleStartShift}
              disabled={(!isWithinFence && !isAdmin) || geoLoading} 
              className="mt-4"
              size="lg"
            >
              {geoLoading ? 'Verifying Location...' : 'Clock In'}
            </Button>
            {geoError && <p className="text-red-400 mt-4">Could not verify location: {geoError.message}</p>}
            {!geoLoading && !isWithinFence && !isAdmin && <p className="text-yellow-400 mt-4">You must be at the approved location to start a shift.</p>}
          </div>
        );
      case 'opening_tasks':
        const areOpeningTasksComplete = shiftState.openingTasks.every(task => task.completed);
        return (
          <>
            <TaskList title="Opening Tasks" tasks={shiftState.openingTasks} onTaskChange={(task) => handleTaskChange(task, 'opening')} />
            <div className="mt-8 text-center">
              <Button onClick={() => setStep('opening_stock')} className="w-full" size="lg" disabled={!areOpeningTasksComplete}>
                Continue to Opening Stocktake
              </Button>
              {!areOpeningTasksComplete && (
                <p className="text-yellow-400 mt-4">
                  All opening tasks must be completed before you can proceed.
                </p>
              )}
            </div>
          </>
        );
      case 'opening_stock':
         return (
          <>
            <StocktakeForm title="Opening Stocktake" stockData={shiftState.openingStock} onStockChange={(catIdx, itemIdx, field, val) => handleStockChange(catIdx, itemIdx, field, val, 'opening')} disabled={isGeoDisabled} />
            <Button onClick={() => setStep('motivational')} className="mt-8 w-full" size="lg" disabled={isGeoDisabled}>Finish Opening Handover</Button>
          </>
        );
      case 'motivational':
        return <MotivationalScreen onNewDelivery={() => setStep('new_stock_delivery')} onProceed={() => setStep('closing_stock')} disabled={isGeoDisabled} />;
      case 'new_stock_delivery':
        return (
          <>
            <NewStockDelivery 
              deliveries={shiftState.newStockDeliveries}
              stockItems={allStockItems} 
              onAdd={handleAddDelivery}
              onRemove={handleRemoveDelivery}
              disabled={isGeoDisabled}
            />
            <Button onClick={() => setStep('motivational')} className="mt-8 w-full" size="lg">Back to Mid-Shift Hub</Button>
          </>
        );
      case 'closing_stock':
        return (
          <>
            <StocktakeForm title="Closing Stocktake" stockData={shiftState.closingStock} onStockChange={(catIdx, itemIdx, field, val) => handleStockChange(catIdx, itemIdx, field, val, 'closing')} disabled={isGeoDisabled}/>
            <Button onClick={() => setStep('closing_tasks')} className="mt-8 w-full" size="lg" disabled={isGeoDisabled}>Continue to Closing Tasks</Button>
          </>
        );
      case 'closing_tasks':
        const areClosingTasksComplete = shiftState.closingTasks.every(task => task.completed);
        const isFeedbackComplete = !(
          (shiftState.shiftFeedback.rating === 'Great' || shiftState.shiftFeedback.rating === 'Bad') &&
          !shiftState.shiftFeedback.comment.trim()
        );
        const canSubmit = areClosingTasksComplete && isFeedbackComplete;

        return (
          <>
            <TaskList title="Closing Tasks" tasks={shiftState.closingTasks} onTaskChange={(task) => handleTaskChange(task, 'closing')} disabled={isGeoDisabled} />
            <Feedback feedback={shiftState.shiftFeedback} onFeedbackChange={handleFeedbackChange} disabled={isGeoDisabled}/>
            <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Ready to Clock Out?</h3>
              <p className="text-gray-400 mb-6">This will finalize and submit your shift report. It cannot be changed after submission.</p>
              <Button onClick={handleSubmitShift} disabled={isSubmitting || isGeoDisabled || !canSubmit} className="w-full" size="lg">
                {isSubmitting ? 'Submitting...' : 'Clock Out'}
              </Button>
              {submissionError && <p className="text-red-400 mt-4 text-center">{submissionError}</p>}
              {!canSubmit && (
                <p className="text-yellow-400 mt-4 text-center">
                  All closing tasks and required shift feedback must be completed before you can clock out.
                </p>
              )}
            </div>
          </>
        );
      case 'complete':
        return <CompletionScreen onStartNewShift={handleStartNewShift} />;
      default:
        return <p>Invalid step.</p>;
    }
  };

  const progressSteps = [
      { id: 'opening_tasks' as ShiftStep, title: 'Opening Tasks' },
      { id: 'opening_stock' as ShiftStep, title: 'Opening Stock' },
      { id: 'on_shift' as ShiftStep, title: 'On Shift' },
      { id: 'closing_stock' as ShiftStep, title: 'Closing Stock' },
      { id: 'closing_tasks' as ShiftStep, title: 'Closing Tasks' },
  ];
  
  const getProgressStepId = (): ShiftStep => {
    if (shiftState.currentStep === 'motivational' || shiftState.currentStep === 'new_stock_delivery') {
      return 'on_shift' as ShiftStep;
    }
    return shiftState.currentStep;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans overflow-x-hidden">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Spinäl Äpp</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:inline">{user?.email}</span>
            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} variant="secondary" size="sm">
              Log Out
            </Button>
          </div>
        </div>
        
        {isAdmin && !isWithinFence && (
            <AdminGeoOverrideIndicator />
        )}

        {isGeoDisabled && (
          <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 mb-6 rounded-r-lg" role="alert">
            <p className="font-bold">Functionality Disabled</p>
            <p>You are outside the required geofence. Please return to the location to continue your shift.</p>
          </div>
        )}

        {shiftState.currentStep !== 'welcome' && shiftState.currentStep !== 'complete' && (
          <ProgressIndicator steps={progressSteps} currentStepId={getProgressStepId()} />
        )}

        <main>
          {renderCurrentStep()}
        </main>
      </div>
    </div>
  );
};

export default App;