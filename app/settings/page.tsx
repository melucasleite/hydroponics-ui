// app/settings.tsx
import React from 'react';
import SettingsTable from './table';
import { getSettings } from '../utils';

const Settings: React.FC = async () => {
  const settings = await getSettings();

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>
      <SettingsTable settings={settings} />
    </div>
  );
};

export default Settings;