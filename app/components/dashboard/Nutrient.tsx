"use client";
import React from 'react';
import TemperatureIcon from '@/public/temperature.svg';
import TemperatureSnowIcon from '@/public/temperature-snow.svg';
import TemperatureSunIcon from '@/public/temperature-sun.svg';

interface NutrientProps {
    ec: number;
}
export const Nutrient: React.FC<NutrientProps> = ({ ec }) => {
    const ecLevel = ec < 1.0 ? 'low' : ec > 2 ? 'high' : 'normal';

    const color = {
        low: 'fill-blue-200',
        normal: 'fill-primary',
        high: 'fill-red-500'
    };

    const Icon = ecLevel === 'low' ? TemperatureSnowIcon : ecLevel === 'normal' ? TemperatureIcon : TemperatureSunIcon;

    return (
        <div className={`flex items-center`}>
            <div className='tooltip tooltip-right' data-tip={`${ec} ec`}>
                <Icon className={`w-[42px] h-[42px] ${color[ecLevel]}`} />
            </div>
        </div>
    );
};
