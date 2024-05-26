"use client"
import React, { HtmlHTMLAttributes, ReactNode } from 'react';

import { getInfo } from '@/app/utils';
import { HistoryChart } from '@/app/components/history';
import { Card } from '@/app/components/card';
import WaterIcon from '@/public/water.svg'
import WaterUpIcon from '@/public/water-up.svg'
import WaterDownIcon from '@/public/water-down.svg'
import TemperatureIcon from '@/public/temperature.svg'
import TemperatureSnowIcon from '@/public/temperature-snow.svg'
import TemperatureSunIcon from '@/public/temperature-sun.svg'
import { Info as IInfo } from '@prisma/client';


interface WaterLevelProps {
    level: IInfo['waterLevel'];
}

const Water: React.FC<WaterLevelProps> = ({ level }) => {
    const color = {
        LOW: 'stroke-red-500',
        NORMAL: 'stroke-primary',
        HIGH: 'stroke-green-500'
    }
    const Icon = level === 'LOW' ? WaterDownIcon : level === 'NORMAL' ? WaterIcon : WaterUpIcon;
    return (
        <div className={`tooltip tooltip-right`} data-tip={level === 'LOW' ? "Water is low" : level === 'NORMAL' ? "Water is on optimal levels" : "Water is on it's max level"}>
            <Icon className={`w-[42px] h-[42px] stroke-2 ${color[level]}`} />
        </div>
    )
};

interface TemperatureLevelProps {
    temperature: number;
}

const Temperature: React.FC<TemperatureLevelProps> = ({ temperature }) => {
    const tempInF = Math.round((temperature * 9 / 5) + 32);

    const tempLevel = tempInF < 60 ? 'low' : tempInF > 90 ? 'high' : 'normal';

    const color = {
        low: 'fill-blue-200',
        normal: 'fill-primary',
        high: 'fill-red-500'
    }

    const Icon = tempLevel === 'low' ? TemperatureSnowIcon : tempLevel === 'normal' ? TemperatureIcon : TemperatureSunIcon;

    return (
        <div className={`flex items-center`}>
            <div className='tooltip tooltip-right' data-tip={`${tempInF} F`}>
                <Icon className={`w-[42px] h-[42px] ${color[tempLevel]}`} />
            </div>
        </div>
    );
};

const poolingInterval = 1000;

const Info: React.FC = () => {
    const [info, setInfo] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchInfo = async () => {
            const data = await getInfo();
            setInfo(data);
        };

        fetchInfo();

        const interval = setInterval(fetchInfo, poolingInterval);

        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!info) {
        return (
            <div className='w-full flex items-center justify-center h-52'>
                <p><span className="loading loading-ring loading-lg"></span>
                </p>
            </div>
        )
    }

    const { waterLevel, temperature } = info;

    return (
        <div>
            <div className='space space-y-5'>
                <div className="flex gap-5">
                    <div className="w-full card lg:w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Nutrient container</h2>
                            <div className='flex items-center gap-5'>
                                <Water level={waterLevel} />
                                <Temperature temperature={temperature} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="collapse collapse-arrow border border-base-300 bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        History
                    </div>
                    <div className="collapse-content p-0">
                        <div className='p-5'>
                            <HistoryChart poolingInterval={poolingInterval} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Info;