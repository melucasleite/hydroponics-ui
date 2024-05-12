import React from 'react';
import SchedulesTable from './schedulesTable';
import AddSchedule from './addSchedule';
import { getSchedules } from '../utils';

const Schedules: React.FC = async () => {
  const schedules = await getSchedules();
  return (
    <div>
      <SchedulesTable schedules={schedules} />
      {schedules.length == 0 && <AddSchedule />}
    </div>
  );
};

export default Schedules;