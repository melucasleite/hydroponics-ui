"use client"
import React, { useState } from 'react';
import { addSchedule } from '../utils';

const AddSchedule: React.FC = () => {
    const [weeklyParts, setWeeklyParts] = useState([{ week: 1, partA: 0, partB: 0, partC: 0 }]);

    const addWeeklyPart = () => {
        setWeeklyParts([...weeklyParts, { week: weeklyParts.length + 1, partA: 0, partB: 0, partC: 0 }]);
    };

    const handleWeeklyPartChange = (index: number, field: string, value: number) => {
        const newWeeklyParts: any[] = [...weeklyParts];
        newWeeklyParts[index][field] = value;
        setWeeklyParts(newWeeklyParts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const schedule = { weeklyParts };
        addSchedule(schedule);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <table>
                <thead>
                    <tr>
                        <th>Week</th>
                        {weeklyParts.map((part, index) => (
                            <th key={index}>{part.week}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Part A (ml/g)</td>
                        {weeklyParts.map((part, index) => (
                            <td key={index}>
                                <input className="ml-2 w-full rounded text-black" type="number" value={part.partA} onChange={(e) => handleWeeklyPartChange(index, 'partA', Number(e.target.value))} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>Part B (ml/g)</td>
                        {weeklyParts.map((part, index) => (
                            <td key={index}>
                                <input className="ml-2 w-full rounded text-black" type="number" value={part.partB} onChange={(e) => handleWeeklyPartChange(index, 'partB', Number(e.target.value))} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td>Part C (ml/g)</td>
                        {weeklyParts.map((part, index) => (
                            <td key={index}>
                                <input className="ml-2 w-full rounded text-black" type="number" value={part.partC} onChange={(e) => handleWeeklyPartChange(index, 'partC', Number(e.target.value))} />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <button type="button" onClick={addWeeklyPart}>Add Weekly Part</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddSchedule;