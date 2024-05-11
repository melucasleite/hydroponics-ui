import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { HIGH_TEMP_THRESHOLD, LOW_TEMP_THRESHOLD } from "../constants";
import { getReadings, seedReadings } from "../utils";
import { Reading } from "@prisma/client";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

type parsedReading = Omit<Reading, 'temperature' | 'id'> & {
    temperature: number;
};

const TemperatureHistory = () => {
    const [temperatureData, setTemperatureData] = React.useState<parsedReading[]>([]);
    const [granularity, setGranularity] = React.useState('second');
    const [lastGranularity, setLastGranularity] = React.useState('second');
    const [isLoading, setIsLoading] = React.useState(true); // Add loading state

    const fetchInfo = async () => {
        if (lastGranularity !== granularity) {
            setIsLoading(true); // Set loading state to true
            setLastGranularity(granularity);
        }
        const data = await getReadings(granularity);
        setTemperatureData(data);
        setIsLoading(false); // Set loading state to false after data is fetched
    };

    React.useEffect(() => {
        const interval = setInterval(fetchInfo, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [granularity, lastGranularity]);

    const points = temperatureData.slice(0, 100).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const lowerThreshold = LOW_TEMP_THRESHOLD;
    const upperThreshold = HIGH_TEMP_THRESHOLD;

    const data = {
        labels: points.map((reading) => new Date(reading.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: "Temperature",
                data: points.map((reading) => reading.temperature),
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "rgba(75,192,192,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(75,192,192,1)",
            },
            {
                label: "Lower Threshold",
                data: Array(points.length).fill(lowerThreshold),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(points.length).fill(upperThreshold),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

    if (isLoading) {
        return <div>Loading...</div>; // Render loader while data is fetching
    }

    if (temperatureData.length === 0) {
        return (
            <>
                <div>No temperature history </div>
                <button onClick={() => { seedReadings() }}>Seed</button>
            </>
        );
    }

    return (
        <div>
            <div className="flex ml-auto">
                <button
                    className={`px-2 mx-2 bg-${granularity === 'second' ? 'primary' : 'black'}`}
                    onClick={() => setGranularity('second')}
                >
                    Second
                </button>
                <button
                    className={`px-2 mx-2 bg-${granularity === 'minute' ? 'primary' : 'black'}`}
                    onClick={() => setGranularity('minute')}
                >
                    Minute
                </button>
                <button
                    className={`px-2 mx-2 bg-${granularity === 'hour' ? 'primary' : 'black'}`}
                    onClick={() => setGranularity('hour')}
                >
                    Hour
                </button>
            </div>
            <Line data={data} options={{
                scales: {
                    y: {
                        min: 10, max: 50, ticks: {
                            callback: (value) => `${value}°C`,
                        },
                    }
                }
            }} />
            <button onClick={() => { seedReadings() }}>Seed</button>
        </div>
    );
};

export default TemperatureHistory;