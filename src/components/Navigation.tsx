import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, BarChart } from 'lucide-react';

export default function Navigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
    }`;

  return (
    <nav className="flex gap-4">
      <NavLink to="/" className={linkClass}>
        <ClipboardList className="w-5 h-5" />
        Tasks
      </NavLink>
      <NavLink to="/statistics" className={linkClass}>
        <BarChart className="w-5 h-5" />
        Statistics
      </NavLink>
    </nav>
  );
}