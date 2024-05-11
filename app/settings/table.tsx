"use client"
import React from 'react';
import { saveSettings } from '../utils';
import { Settings } from '@prisma/client';
import { useForm } from 'react-hook-form';


const SettingsTable: React.FC<{ settings: Settings }> = ({ settings }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<Settings>();

    const handleOnSubmit = async (data: any) => {
        await saveSettings(data);
    };

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
            <input type="hidden" value={settings.id} {...register("id", { valueAsNumber: true })} />
            <div className="flex flex-nowrap mb-4 gap-2">
                <div className="w-1/4">
                    <label className="block text-center">Flow Rate A</label>
                    <input
                        type="number"
                        defaultValue={settings.flowRateA}
                        className="px-2 py-1 w-full border rounded text-black"
                        {...register("flowRateA", { required: true, min: 1, max: 100, valueAsNumber: true })}
                    />
                    {errors.flowRateA && <span className="text-red-500">Required (1-100)</span>}
                </div>
                <div className="w-1/4">
                    <label className="block text-center">Flow Rate B</label>
                    <input
                        type="number"
                        defaultValue={settings.flowRateB}
                        className="px-2 py-1 w-full border rounded text-black"
                        {...register("flowRateB", { required: true, min: 1, max: 100, valueAsNumber: true })}
                    />
                    {errors.flowRateB && <span className="text-red-500">Required (1-100)</span>}
                </div>
                <div className="w-1/4">
                    <label className="block text-center">Flow Rate C</label>
                    <input
                        type="number"
                        defaultValue={settings.flowRateC}
                        className="px-2 py-1 w-full border rounded text-black"
                        {...register("flowRateC", { required: true, min: 1, max: 100, valueAsNumber: true })}
                    />
                    {errors.flowRateC && <span className="text-red-500">Required (1-100)</span>}
                </div>
                <div className="w-1/4">
                    <label className="block text-center">Flow Rate D</label>
                    <input
                        type="number"
                        defaultValue={settings.flowRateD}
                        className="px-2 py-1 w-full border rounded text-black"
                        {...register("flowRateD", { required: true, min: 1, max: 100, valueAsNumber: true })}
                    />
                    {errors.flowRateD && <span className="text-red-500">Required (1-100)</span>}
                </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                Save
            </button>
        </form>
    );
};

export default SettingsTable;