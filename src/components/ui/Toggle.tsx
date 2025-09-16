import React from 'react';

type ToggleProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

const Toggle: React.FC<ToggleProps> = ({ id, checked, onChange, label }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-gray-300 flex-grow pr-4 cursor-pointer">
        {label}
      </label>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        className={`${
          checked ? 'bg-emerald-500' : 'bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Toggle;
