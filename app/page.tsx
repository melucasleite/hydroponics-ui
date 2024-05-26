"use client"
import React from 'react';
import Image from 'next/image';

import { getInfo } from '@/app/utils';
import { HistoryChart } from '@/app/components/history';
import { Card } from '@/app/components/card';
import water from '@/public/water.svg'
import waterUp from '@/public/water-up.svg'
import waterDown from '@/public/water-down.svg'
import { Info as IInfo } from '@prisma/client';


interface WaterLevelProps {
    level: IInfo['waterLevel'];
}

const WaterLevel: React.FC<WaterLevelProps> = ({ level }) => {
    const imageMap = {
        LOW: waterDown,
        NORMAL: water,
        HIGH: waterUp
    }

    return (
        <div className='flex items-center gap-5'>
            {imageMap[level]}
        </div>
    );
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

const poolingInterval = 1000;

const Info: React.FC = () => {
    const [info, setInfo] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchInfo = async () => {
            const data = await getInfo();
            setInfo(data);
        };

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