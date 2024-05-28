import React from 'react';
import TemperatureIcon from '@/public/temperature.svg';
import TemperatureSnowIcon from '@/public/temperature-snow.svg';
import TemperatureSunIcon from '@/public/temperature-sun.svg';

interface PHProps {
    ph: number;
}
export const PH: React.FC<PHProps> = ({ ph }) => {
    const phLevel = ph < 5.5 ? 'low' : ph > 6.5 ? 'high' : 'normal';

    const color = {
        low: 'fill-blue-200',
        normal: 'fill-primary',
        high: 'fill-red-500'
    };

    const Icon = phLevel === 'low' ? TemperatureSnowIcon : phLevel === 'normal' ? TemperatureIcon : TemperatureSunIcon;

    return (
        <div className={`flex items-center`}>
            <div className='tooltip tooltip-right' data-tip={`${ph} ph`}>
                <Icon className={`w-[42px] h-[42px] ${color[phLevel]}`} />
            </div>
        </div>
    );
};
