"use client"
import React, { HtmlHTMLAttributes, ReactNode } from 'react';

import { getInfo } from '@/app/utils';
import { HistoryChart } from '@/app/components/history';
import { Card } from '@/app/components/card';
import Water from '@/public/water.svg'
import WaterUp from '@/public/water-up.svg'
import WaterDown from '@/public/water-down.svg'
import { Info as IInfo } from '@prisma/client';


interface WaterLevelProps {
    level: IInfo['waterLevel'];
}

const WaterLevel: React.FC<WaterLevelProps> = ({ level }) => {
    const ImageMap = {
        LOW: <WaterDown />,
        NORMAL: <Water />,
        HIGH: <WaterUp />
    }

    if (level === 'LOW') {
        return (
            <WaterDown className='w-[42px] h-[42px] stroke-red-500' />
        )
    }

    if (level === 'NORMAL') {
        return (
            <Water className='w-[42px] h-[42px] stroke-primary' />
        )
    }

    if (level === 'HIGH') {
        return (
            <WaterUp className='w-[42px] h-[42px] stroke-green-500' />
        )
    }
};

interface TemperatureLevelProps {
    temperature: number;
}

const TemperatureLevel: React.FC<TemperatureLevelProps> = ({ temperature }) => {
    let color = 'rounded border-2 border-green-500';
    if (temperature < 25) {
        color = 'rounded border-2 border-blue-500';
    } else if (temperature > 35) {
        color = 'rounded border-2 border-danger';
    } else {
        color = 'rounded border-2 border-green-500'
    }

    return (
        <div className={`flex-1 p-4 ${color}`}>
            <p>{temperature < 25 ? 'Low' : temperature > 35 ? 'High' : 'Normal'}</p>
        </div>
    );
};

const poolingInterval = 60 * 1000;

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
        return <p>Loading...</p>;
    }

    const { waterLevel, temperature } = info;

    return (
        <div>
            <div className='space space-y-5'>
                <div className="flex gap-5">
                    <Card title='Water Level' className="w-1/2">
                        <WaterLevel level={waterLevel} />
                    </Card>
                    <Card title='Temperature' className="w-1/2">
                        <TemperatureLevel temperature={temperature} />
                    </Card>
                </div>
                <Card title='History Chart'>
                    <HistoryChart poolingInterval={poolingInterval} />
                </Card>
            </div>
        </div>
    );
};

export default Info;