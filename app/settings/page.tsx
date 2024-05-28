// app/settings.tsx
import React from "react";
import SettingsTable from "./table";
import { getSettings } from "../utils";

const Settings: React.FC = async () => {
  const settings = await getSettings();

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Settings</h2>
        <SettingsTable settings={settings} />
      </div>
    </div>
  );
};

export default Settings;
