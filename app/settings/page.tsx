// app/settings.tsx
import React from 'react';
import SettingsTable from './table';
import { getSettings } from '../utils';

const Settings: React.FC = async () => {
  const settings = await getSettings();

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className='border-2 rounded border-white p-5'>
        <SettingsTable settings={settings} />
      </div>
    </div>
  );
};

export default Settings;