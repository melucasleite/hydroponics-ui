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
                    <h2>Schedule {schedule.id}</h2>
                    <button onClick={() => deleteSchedule(schedule.id)}>Delete</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Part/Week</th>
                                {schedule.weeklyParts.map((part) => (
                                    <th key={part.id}>Week {part.week}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Part A</td>
                                {schedule.weeklyParts.map((part) => (
                                    <td key={"a" + part.id}>{part.partA.toFixed(2)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Part B</td>
                                {schedule.weeklyParts.map((part) => (
                                    <td key={"b" + part.id}>{part.partB.toFixed(2)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Part C</td>
                                {schedule.weeklyParts.map((part) => (
                                    <td key={"c" + part.id}>{part.partC.toFixed(2)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default SchedulesTable;