import React from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-50">{title}</h1>
      {subtitle && <p className="text-lg text-gray-400 mt-2">{subtitle}</p>}
    </header>
  );
};

export default Header;
