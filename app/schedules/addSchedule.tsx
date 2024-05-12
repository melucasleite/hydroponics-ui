"use client"
import React, { useState } from 'react';
import { addSChedule } from '../utils';

const AddSchedule: React.FC = () => {
    const [weeklyParts, setWeeklyParts] = useState([{ week: 1, partA: 0, partB: 0, partC: 0 }]);

    const addWeeklyPart = () => {
        setWeeklyParts([...weeklyParts, { week: 1, partA: 0, partB: 0, partC: 0 }]);
    };

    const handleWeeklyPartChange = (index: number, field: string, value: number) => {
        const newWeeklyParts: any[] = [...weeklyParts];
        newWeeklyParts[index][field] = value;
        setWeeklyParts(newWeeklyParts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const schedule = { weeklyParts };
        addSChedule(schedule);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {weeklyParts.map((part, index) => (
                <div key={index} className="space-y-2">
                    <div>
                        <label className="flex items-center">
                            Week:
                            <input min={1} max={20} className="ml-2 w-full rounded text-black" type="number" value={part.week} onChange={(e) => handleWeeklyPartChange(index, 'week', Number(e.target.value))} />
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center">
                            Part A (ml/g):
                            <input className="ml-2 w-full rounded text-black" type="number" value={part.partA} onChange={(e) => handleWeeklyPartChange(index, 'partA', Number(e.target.value))} />
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center">
                            Part B (ml/g):
                            <input className="ml-2 w-full rounded text-black" type="number" value={part.partB} onChange={(e) => handleWeeklyPartChange(index, 'partB', Number(e.target.value))} />
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center">
                            Part C (ml/g):
                            <input className="ml-2 w-full rounded text-black" type="number" value={part.partC} onChange={(e) => handleWeeklyPartChange(index, 'partC', Number(e.target.value))} />
                        </label>
                    </div>
                </div>
            ))}
            <button type="button" onClick={addWeeklyPart}>Add Weekly Part</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddSchedule;