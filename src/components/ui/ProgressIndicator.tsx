// FIX: Implemented the ProgressIndicator component to show shift progress.
import React from 'react';
import { ShiftStep } from '../../types';

type ProgressIndicatorProps = {
  steps: { id: ShiftStep; title: string }[];
  currentStepId: ShiftStep;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <div className="w-full mb-8 overflow-x-auto pb-3">
      <ol className="flex items-center" style={{ minWidth: '750px' }}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          let statusClasses = 'text-gray-400 bg-gray-700';
          if (isCurrent) {
            statusClasses = 'text-blue-50 bg-blue-600';
          }
          if (isCompleted) {
            statusClasses = 'text-emerald-50 bg-emerald-600';
          }

          return (
            <li
              key={step.id}
              className={`flex w-full items-center ${
                index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-700 after:border-4 after:inline-block" : ''
              } ${ isCompleted ? 'after:border-emerald-600' : 'after:border-gray-700' }`}
            >
              <div className="flex flex-col items-center justify-center w-24">
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${statusClasses}`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </span>
                <span className={`text-xs text-center mt-2 ${isCurrent ? 'text-blue-300 font-semibold' : 'text-gray-400'}`}>{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProgressIndicator;