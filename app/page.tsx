"use client"
import React from 'react';

import { getCurrentState } from './utils';
import { HistoryChart } from './components/dashboard/HistoryChart';
import { Water } from './components/dashboard/Water';
import { Temperature } from './components/dashboard/Temperature';
import { PH } from './components/dashboard/PH';
import { Nutrient } from './components/dashboard/Nutrient';
import { Recommendation, getRecommendedCare } from './ai';
import { WaterLevel } from '@prisma/client';

const poolingInterval = 1000;

const plantName = 'tomatoes';
const stage = 'vegetative';

type CurrentState = {
    waterLevel: WaterLevel;
    temperature: number;
    ec: number;
    ph: number;
}

const Info: React.FC = () => {
    const [currentState, setCurrentState] = React.useState<CurrentState | null>(null);
    const [recommendations, setRecommendations] = React.useState<Recommendation | null>(null);
    const [recommendationsFetched, setRecommendationsFetched] = React.useState<boolean>(false);

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

    React.useEffect(() => {
        if (!currentState || recommendationsFetched) {
            return;
        }

        const { waterLevel, temperature, ec, ph } = currentState;

        const fetchRecommendations = async () => {
            const recommendations = await getRecommendedCare({
                plantName,
                stage,
                ec,
                waterLevel,
                temperature,
                ph,
            });
            setRecommendations(recommendations);
        };

        fetchRecommendations();

    }, [currentState?.ec, currentState?.ph, currentState?.temperature, currentState?.waterLevel])

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
                <div className="flex flex-wrap flex-row lg:flex-nowrap gap-5">
                    <div className="w-full card lg:w-1/3 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Status</h2>
                            <div className='flex h-full items-center gap-10 justify-center'>
                                <Water level={waterLevel} />
                                <Temperature temperature={temperature} />
                                <Nutrient ec={ec} />
                                <PH ph={ph} />
                            </div>
                            <div>
                                {plantName && <p>Plant: {plantName}</p>}
                                {stage && <p>Stage: {stage}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="w-full card lg:w-1/3 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">AI Recommendations</h2>
                            <div className='flex flex-col gap-5 mt-5'>
                                {recommendations?.water && <p>{recommendations?.water}</p>}
                                {recommendations?.temperature && <p>{recommendations?.temperature}</p>}
                                {recommendations?.ph && <p>{recommendations?.ph}</p>}
                                {recommendations?.ec && <p>{recommendations?.ec}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="w-full card lg:w-1/3 bg-base-100 shadow-xl">
                        <div className="card-body items-center justify-center">
                            <div className='flex items-center justify-center'>
                                <p><i>"{recommendations?.encouragement}"</i></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full collapse collapse-arrow border border-base-300 bg-base-200">
                    <input type="checkbox" />
                    <div className="w-full collapse-title text-xl font-medium">
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