import React from 'react';
import AcidIcon from '@/public/acid.svg';

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

    const Icon = AcidIcon

    return (
        <div className={`flex items-center`}>
            <div className='tooltip tooltip-right' data-tip={`PH: ${ph}`}>
                <Icon className={`w-[42px] h-[42px] ${color[phLevel]}`} />
                <p>{ph}</p>
            </div>
        </div>
    );
};
