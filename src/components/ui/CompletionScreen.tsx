
import React from 'react';
import Button from './Button';

type CompletionScreenProps = {
  onStartNewShift: () => void;
};

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onStartNewShift }) => {
  return (
    <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-emerald-400 mb-4">Shift Handover Complete!</h2>
      <p className="text-lg text-gray-300 mb-8">
        Great work! Your shift report has been submitted successfully. Have a great rest of your day.
      </p>
      <Button onClick={onStartNewShift} size="lg" variant="secondary">
        Start New Shift
      </Button>
    </div>
  );
};

export default CompletionScreen;
