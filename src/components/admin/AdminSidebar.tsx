import React from 'react';
import Button from '../ui/Button';

export type View = 'shifts' | 'products' | 'suppliers' | 'ordering' | 'hours';

type AdminSidebarProps = {
  currentView: View;
  onNavigate: (view: View) => void;
  onBack: () => void;
};

const NavLink: React.FC<{
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const baseClasses = 'flex items-center w-full text-left px-4 py-2.5 rounded-md transition-colors duration-150';
  const activeClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';
  
  return (
    <li>
      <button
        onClick={onClick}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-4 mt-6 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</h3>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onNavigate, onBack }) => {
  const navItems: { view: View; label: string; icon: React.ReactElement; section: string }[] = [
    { view: 'shifts', label: 'Shift Reports', icon: <ChartBarIcon />, section: 'Reports' },
    { view: 'hours', label: 'Hours Report', icon: <ClockIcon />, section: 'Reports' },
    { view: 'ordering', label: 'Stock Ordering', icon: <ClipboardListIcon />, section: 'Reports' },
    { view: 'products', label: 'Manage Products', icon: <CubeIcon />, section: 'Management' },
    { view: 'suppliers', label: 'Manage Suppliers', icon: <UsersIcon />, section: 'Management' },
  ];

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col flex-shrink-0 border-r border-gray-700">
      <div className="flex-grow">
        <nav>
          <SectionHeader title="Reports" />
          <ul className="space-y-1">
            {navItems.filter(item => item.section === 'Reports').map(item => (
              <NavLink
                key={item.view}
                label={item.label}
                icon={item.icon}
                isActive={currentView === item.view}
                onClick={() => onNavigate(item.view)}
              />
            ))}
          </ul>
          
          <SectionHeader title="Management" />
          <ul className="space-y-1">
             {navItems.filter(item => item.section === 'Management').map(item => (
              <NavLink
                key={item.view}
                label={item.label}
                icon={item.icon}
                isActive={currentView === item.view}
                onClick={() => onNavigate(item.view)}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <Button onClick={onBack} variant="secondary" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Welcome
        </Button>
      </div>
    </aside>
  );
};

// SVG Icon Components
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);
const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);
const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h0a2 2 0 002-2V4a2 2 0 00-2-2h0z" transform="rotate(45 10 10)"/>
        <path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h0a2 2 0 002-2V4a2 2 0 00-2-2h0z" transform="rotate(-45 10 10)"/>
    </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 14.07a5 5 0 01-2.5 1.47A6.97 6.97 0 006 16c0 .34.024.673.07 1h6.86z" />
    <path d="M16 16c0-.34.024-.673.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0113 14.07a5 5 0 01-2.5 1.47A6.97 6.97 0 009 16c0 .34.024.673.07 1h6.93z" />
  </svg>
);

export default AdminSidebar;