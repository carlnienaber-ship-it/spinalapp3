import React from 'react';

type NumericInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const NumericInput: React.FC<NumericInputProps> = ({ className, ...props }) => {
  const baseStyles = 'block w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 text-gray-50 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50';

  const combinedClassName = [baseStyles, className].join(' ');

  return (
    <input
      type="number"
      className={combinedClassName}
      {...props}
    />
  );
};

export default NumericInput;