"use client";
import React from 'react';
import TemperatureIcon from '@/public/temperature.svg';
import TemperatureSnowIcon from '@/public/temperature-snow.svg';
import TemperatureSunIcon from '@/public/temperature-sun.svg';

interface TemperatureLevelProps {
    temperature: number;
}
export const Temperature: React.FC<TemperatureLevelProps> = ({ temperature }) => {
    const tempLevel = temperature < 60 ? 'low' : temperature > 90 ? 'high' : 'normal';

    const color = {
        low: 'fill-blue-200',
        normal: 'fill-primary',
        high: 'fill-red-500'
    };

    const Icon = tempLevel === 'low' ? TemperatureSnowIcon : tempLevel === 'normal' ? TemperatureIcon : TemperatureSunIcon;

    return (
        <div className={`flex items-center`}>
            <div className='tooltip tooltip-right' data-tip={`${temperature} F`}>
                <Icon className={`w-[42px] h-[42px] ${color[tempLevel]}`} />
            </div>
        </div>
    );
};
