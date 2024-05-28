"use client"
import React from 'react';

import { getCurrentState } from './utils';
import { HistoryChart } from './components/dashboard/HistoryChart';
import { Water } from './components/dashboard/Water';
import { Temperature } from './components/dashboard/Temperature';
import { PH } from './components/dashboard/PH';
import { Nutrient } from './components/dashboard/Nutrient';

const poolingInterval = 1000;

const Info: React.FC = () => {
    const [currentState, setCurrentState] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchCurrentState = async () => {
            const data = await getCurrentState();
            setCurrentState(data);
        };

        fetchCurrentState();

        const interval = setInterval(fetchCurrentState, poolingInterval);

        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!currentState) {
        return (
            <div className='w-full flex items-center justify-center h-52'>
                <p><span className="loading loading-ring loading-lg"></span>
                </p>
            </div>
        )
    }

    const { waterLevel, temperature, ec, ph } = currentState;

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
                                <Nutrient ec={ec} />
                                <PH ph={ph} />
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