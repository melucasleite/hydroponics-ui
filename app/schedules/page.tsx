import React from "react";
import SchedulesTable from "./schedulesTable";
import AddSchedule from "./addSchedule";
import { getSchedules } from "../utils";

const Schedules: React.FC = async () => {
  const schedules = await getSchedules();
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Feeding Schedule</h2>
        <SchedulesTable schedules={schedules} />
        {schedules.length == 0 && <AddSchedule />}
      </div>
    </div>
  );
};

export default Schedules;
