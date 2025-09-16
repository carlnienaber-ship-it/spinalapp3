import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
};

const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:pointer-events-none';

const variantStyles = {
  primary: 'bg-blue-600 text-gray-50 hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-700 text-gray-50 hover:bg-gray-600 focus:ring-gray-500',
  destructive: 'bg-red-600 text-gray-50 hover:bg-red-700 focus:ring-red-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ');

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
