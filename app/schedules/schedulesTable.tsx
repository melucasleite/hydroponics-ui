"use client"
import React from 'react';
import { deleteSchedule } from '../utils';

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

interface SchedulesTableProps {
    schedules: SchedulesWithWeeklyParts[];
}

const SchedulesTable: React.FC<SchedulesTableProps> = ({ schedules }) => {
    return (
        <div>
            {schedules.map((schedule) => (
                <div key={schedule.id}>
                    <table>
                        <thead>
                            <tr>
                                <th className='p-2'>Part</th>
                                {schedule.weeklyParts.map((part) => (
                                    <th className='p-2' key={part.id}>Week {part.week}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='p-2 text-center'>Part A</td>
                                {schedule.weeklyParts.map((part) => (
                                    <td className={"text-center border border-white"} key={"a" + part.id}>{part.partA.toFixed(2)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className='p-2 text-center'>Part B</td>
                                {schedule.weeklyParts.map((part) => (
                                    <td className={"text-center border border-white"} key={"b" + part.id}>{part.partB.toFixed(2)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className='p-2 text-center'>Part C</td>
                                {schedule.weeklyParts.map((part) => (
                                    <td className={"text-center border border-white"} key={"c" + part.id}>{part.partC.toFixed(2)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                    <div className='flex pt-5'>
                        <button className='ml-auto rounded bg-primary p-1 px-2' onClick={() => deleteSchedule(schedule.id)}>Delete</button>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default SchedulesTable;