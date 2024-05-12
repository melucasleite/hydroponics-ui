"use client"
import React, { useState } from 'react';
import { addSchedule } from '../utils';

const AddSchedule: React.FC = () => {
    const [weeklyParts, setWeeklyParts] = useState([{ week: 1, partA: 0, partB: 0, partC: 0 }]);

    const addWeeklyPart = () => {
        setWeeklyParts([...weeklyParts, { week: weeklyParts.length + 1, partA: 0, partB: 0, partC: 0 }]);
    };

    const removeWeeklyPart = (index: number) => {
        const newWeeklyParts = [...weeklyParts];
        newWeeklyParts.splice(index, 1);
        setWeeklyParts(newWeeklyParts);
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
        <div className='rounder border-2 border-white p-4 mt-3'>
            <form onSubmit={handleSubmit} className="space-y-4">
                <table>
                    <thead>
                        <tr>
                            <th>Week</th>
                            {weeklyParts.map((part, index) => (
                                <th key={index}>{part.week}</th>
                            ))}
                            {weeklyParts.length > 1 && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Part A (ml/g)</td>
                            {weeklyParts.map((part, index) => (
                                <td key={index}>
                                    <input className="ml-2 w-full rounded text-black text-center" type="number" value={part.partA} onChange={(e) => handleWeeklyPartChange(index, 'partA', Number(e.target.value))} />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Part B (ml/g)</td>
                            {weeklyParts.map((part, index) => (
                                <td key={index}>
                                    <input className="ml-2 w-full rounded text-black text-center" type="number" value={part.partB} onChange={(e) => handleWeeklyPartChange(index, 'partB', Number(e.target.value))} />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Part C (ml/g)</td>
                            {weeklyParts.map((part, index) => (
                                <td key={index}>
                                    <input className="ml-2 w-full rounded text-black text-center" type="number" value={part.partC} onChange={(e) => handleWeeklyPartChange(index, 'partC', Number(e.target.value))} />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <button type="button" className='p-1 px-2 rounded bg-primary' onClick={addWeeklyPart}>Add Week</button>
                <button type="submit" className='p-1 px-2 rounded bg-primary ml-2'>Submit</button>
                <button type="button" className='p-1 px-2 rounded bg-primary ml-2' onClick={() => removeWeeklyPart(weeklyParts.length - 1)}>Delete Week</button>
            </form>
        </div>
    );
};

export default AddSchedule;