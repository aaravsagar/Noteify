import React from 'react';

interface SettingsProps {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  notificationsEnabled,
  toggleNotifications,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="flex items-center space-x-4">
        <div
          onClick={toggleNotifications}
          className={`relative w-14 h-8 flex items-center cursor-pointer rounded-full transition-colors ${
            notificationsEnabled ? 'bg-yellow-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute w-6 h-6 bg-orange-500 rounded-full transition-transform ${
              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          ></div>
        </div>
        <span>
          {notificationsEnabled
            ? 'Notifications are enabled'
            : 'Notifications are disabled'}
        </span>
      </div>
    </div>
  );
};
