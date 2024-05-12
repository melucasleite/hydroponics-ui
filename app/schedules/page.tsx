import React from 'react';
import SchedulesTable from './schedulesTable';
import AddSchedule from './addSchedule';
import { getSchedules } from '../utils';

const Schedules: React.FC = async () => {
  const schedules = await getSchedules();
  return (
    <div>
      <h1>Schedules</h1>
      <p>This is the Schedules page.</p>
      <SchedulesTable schedules={schedules} />
      <AddSchedule />
    </div>
  );
};

export default Schedules;