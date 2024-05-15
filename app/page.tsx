"use client"
import React from 'react';
import { getInfo } from './utils';
import HistoryChart from './components/history';

interface WaterLevelProps {
    level: boolean;
    label: string;
}

const WaterLevel: React.FC<WaterLevelProps> = ({ level, label }) => {
    return (
        <div className={`flex-1 p-4 rounded border-2 ${level ? 'border-danger' : 'border-green-500'}`}>
            <h2>{label}</h2>
            <p>{level ? 'Low' : 'Normal'}</p>
        </div>
    );
};

interface TemperatureLevelProps {
    temperature: number;
    label: string;
}

const TemperatureLevel: React.FC<TemperatureLevelProps> = ({ temperature, label }) => {
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
            <h2>{label}</h2>
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

    const { lowWaterA, lowWaterB, lowWaterC, lowWaterD, temperature } = info;

    return (
        <div>
            <div className="flex flex-wrap gap-2 text-center">
                <WaterLevel level={lowWaterA} label="Water Level A" />
                <WaterLevel level={lowWaterB} label="Water Level B" />
                <WaterLevel level={lowWaterC} label="Water Level C" />
                <WaterLevel level={lowWaterD} label="Water Level D" />
                <TemperatureLevel temperature={temperature} label={`Temperature: ${temperature}°C`} />
            </div>
            <HistoryChart poolingInterval={poolingInterval} />
        </div>
    );
};

export default Info;