"use client"
import React, { useEffect, useState } from 'react';
import { getSchedules, getSettings } from '../utils';
import { Line } from 'react-chartjs-2';
import { Schedule, Settings } from '@prisma/client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
interface WeeklyPart {
  id: number;
  week: number;
  partA: number;
  partB: number;
  partC: number;
}

interface SchedulesWithWeeklyParts {
  id: number;
  weeklyParts: WeeklyPart[];
}

const Actions: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    id: 0,
    flowRateA: 0,
    flowRateB: 0,
    flowRateC: 0,
    flowRateD: 0,
    mainVolumeContainer: 0
  });
  const [schedules, setSchedules] = useState<SchedulesWithWeeklyParts[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const settings = await getSettings();
      const schedules = await getSchedules();
      setSettings(settings);
      setSchedules(schedules);
    }
    fetchData()
  }, []);
  const actions = schedules.map((schedule) => {
    return {
      ...schedule, weeklyParts: schedule.weeklyParts.map((part) => ({
        volumeA: (part.partA * settings.mainVolumeContainer).toFixed(1) + "ml",
        runA: ((part.partA * settings.mainVolumeContainer) / (settings.flowRateA / 60)).toFixed(1) + "s",
        volumeB: (part.partB * settings.mainVolumeContainer).toFixed(1) + "ml",
        runB: ((part.partB * settings.mainVolumeContainer) / (settings.flowRateB / 60)).toFixed(1) + "s",
        volumeC: (part.partC * settings.mainVolumeContainer).toFixed(1) + "ml",
        runC: ((part.partC * settings.mainVolumeContainer) / (settings.flowRateC / 60)).toFixed(1) + "s"
      }))
    };
  });

  return (
    <div className='p-5 border-2 border-white rounded'>
      <h1 className="text-2xl font-bold mb-4">Actions</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Week</th>
            <th className="py-2 px-4 border-b">Volume A</th>
            <th className="py-2 px-4 border-b">Run A</th>
            <th className="py-2 px-4 border-b">Volume B</th>
            <th className="py-2 px-4 border-b">Run B</th>
            <th className="py-2 px-4 border-b">Volume C</th>
            <th className="py-2 px-4 border-b">Run C</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action, index) => (
            action.weeklyParts.map((part, partIndex) => (
              <tr key={`${index}-${partIndex}`}>
                <td className="py-2 px-4 border-b">{partIndex}</td>
                <td className="py-2 px-4 border-b">{part.volumeA}</td>
                <td className="py-2 px-4 border-b">{part.runA}</td>
                <td className="py-2 px-4 border-b">{part.volumeB}</td>
                <td className="py-2 px-4 border-b">{part.runB}</td>
                <td className="py-2 px-4 border-b">{part.volumeC}</td>
                <td className="py-2 px-4 border-b">{part.runC}</td>
              </tr>
            ))
          ))}
          <tr>
            <td className="py-2 px-4 border-b">Total</td>
            <td className="py-2 px-4 border-b">{actions.reduce((total, action) => total + action.weeklyParts.reduce((partTotal, part) => partTotal + parseFloat(part.volumeA), 0), 0).toFixed(1)}ml</td>
            <td className="py-2 px-4 border-b">{actions.reduce((total, action) => total + action.weeklyParts.reduce((partTotal, part) => partTotal + parseFloat(part.runA), 0), 0).toFixed(1)}s</td>
            <td className="py-2 px-4 border-b">{actions.reduce((total, action) => total + action.weeklyParts.reduce((partTotal, part) => partTotal + parseFloat(part.volumeB), 0), 0).toFixed(1)}ml</td>
            <td className="py-2 px-4 border-b">{actions.reduce((total, action) => total + action.weeklyParts.reduce((partTotal, part) => partTotal + parseFloat(part.runB), 0), 0).toFixed(1)}s</td>
            <td className="py-2 px-4 border-b">{actions.reduce((total, action) => total + action.weeklyParts.reduce((partTotal, part) => partTotal + parseFloat(part.volumeC), 0), 0).toFixed(1)}ml</td>
            <td className="py-2 px-4 border-b">{actions.reduce((total, action) => total + action.weeklyParts.reduce((partTotal, part) => partTotal + parseFloat(part.runC), 0), 0).toFixed(1)}s</td>
          </tr>
        </tbody>
      </table>
      {actions && actions.length > 0 && (
        <Line
          data={{
            labels: actions[0].weeklyParts.map((part, index) => "Week " + (index + 1)),
            datasets: [
              {
                label: 'Volume A',
                data: actions[0].weeklyParts.map((part) => parseFloat(part.volumeA)),
                borderColor: 'red',
                fill: false,
              },
              {
                label: 'Volume B',
                data: actions[0].weeklyParts.map((part) => parseFloat(part.volumeB)),
                borderColor: 'green',
                fill: false,
              },
              {
                label: 'Volume C',
                data: actions[0].weeklyParts.map((part) => parseFloat(part.volumeC)),
                borderColor: 'blue',
                fill: false,
              },
            ],
          }}
        />)}
    </div>
  );
};

export default Actions;