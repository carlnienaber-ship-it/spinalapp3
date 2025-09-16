import React from 'react';
import Button from './Button';

type MotivationalScreenProps = {
  onNewDelivery: () => void;
  onProceed: () => void;
  disabled?: boolean;
};

const coreValues = [
    "Treat everyone with respect.",
    "Embrace diversity and inclusivity.",
    "Respect differing viewpoints.",
    "Celebrate irreverence and fun.",
    "Unwavering honesty is key.",
    "No tolerance for bigotry.",
];

const MotivationalScreen: React.FC<MotivationalScreenProps> = ({ onNewDelivery, onProceed, disabled = false }) => {
  return (
    <div className={`text-center bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Mid-Shift Hub</h2>
      <p className="text-lg text-gray-300 mb-6">
        You're doing great. Take a moment to remember our values at Spinäl Täp.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {coreValues.map((value) => (
          <div key={value} className="bg-gray-700 p-4 rounded-lg">
            <p className="font-semibold text-gray-50">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onNewDelivery} size="lg" variant="secondary" disabled={disabled}>
          Log New Stock Delivery
        </Button>
        <Button onClick={onProceed} size="lg" disabled={disabled}>
          Proceed to Closing
        </Button>
      </div>
    </div>
  );
};

export default MotivationalScreen;