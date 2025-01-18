import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Notebook, CheckSquare, Timer, Settings as SettingsIcon } from 'lucide-react';
import { useStore } from '../store';

export function Layout() {
  const { settings } = useStore();

  return (
    <div className={`min-h-screen ${settings.theme}`}>
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-[var(--bg-primary)] border-t border-theme shadow-lg md:top-0 md:bottom-auto md:border-t-0 md:border-b z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-[var(--text-primary)]">
              Noteify
            </Link>
            <div className="flex space-x-4">
              <NavLink to="/notes" icon={<Notebook />} label="Notes" />
              <NavLink to="/todos" icon={<CheckSquare />} label="Todos" />
              <NavLink to="/pomodoro" icon={<Timer />} label="Pomodoro" />
              <NavLink to="/settings" icon={<SettingsIcon />} label="Settings" />
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 pb-24 pt-6 md:pt-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}