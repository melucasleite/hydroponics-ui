import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { HIGH_PH_THRESHOLD, HIGH_TEMP_THRESHOLD, LOW_PH_THRESHOLD, LOW_TEMP_THRESHOLD } from "./constants";
import { getReadings, seedReadings } from "./utils";
import { Reading } from "@prisma/client";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

type parsedReading = Omit<Reading, 'temperature' | 'id' | 'ph'> & {
    temperature: number;
    ph: number;
};

const HistoryChart = () => {
    const [readings, setReadings] = React.useState<parsedReading[]>([]);
    const [granularity, setGranularity] = React.useState('second');

    const fetchInfo = async () => {
        const data = await getReadings(granularity);
        setReadings(data);
    };

    React.useEffect(() => {
        const interval = setInterval(fetchInfo, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [granularity]);

    const points = readings.slice(0, 100).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const lowTemp = LOW_TEMP_THRESHOLD;
    const highTemp = HIGH_TEMP_THRESHOLD;

    const lowPh = LOW_PH_THRESHOLD;
    const highPh = HIGH_PH_THRESHOLD;

    const temperatureData = {
        labels: points.map((reading) => new Date(reading.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: "Temperature",
                data: points.map((reading) => reading.temperature),
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(30,142,255)",
                pointBackgroundColor: "rgba(30,142,255)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(30,142,255)",
            },
            {
                label: "Lower Threshold",
                data: Array(points.length).fill(lowTemp),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(points.length).fill(highTemp),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

    const phData = {
        labels: points.map((reading) => new Date(reading.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: "PH",
                data: points.map((reading) => reading.ph),
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(30,142,255)",
                pointBackgroundColor: "rgba(30,142,255)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(30,142,255)",
            },
            {
                label: "Lower Threshold",
                data: Array(points.length).fill(lowPh),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(points.length).fill(highPh),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

    console.log(phData)

    if (readings.length === 0) {
        return (
            <>
                <div>No temperature history </div>
                <button onClick={() => { seedReadings() }}>Seed</button>
            </>
        );
    }
    return (
        <div className="mt-2">
            <div className="flex gap-2 mb-2">
                <button
                    className={`px-2 ml-auto border-2 rounded ${granularity === 'second' ? 'border-primary' : 'black'}`}
                    onClick={() => setGranularity('second')}
                >
                    Second
                </button>
                <button
                    className={`px-2 border-2 rounded ${granularity === 'minute' ? 'border-primary' : 'black'}`}
                    onClick={() => setGranularity('minute')}
                >
                    Minute
                </button>
                <button
                    className={`px-2 border-2 rounded ${granularity === 'hour' ? 'border-primary' : 'black'}`}
                    onClick={() => setGranularity('hour')}
                >
                    Hour
                </button>
            </div>
            <div className="rounded-lg border-white border-2 bg-black p-4">
                <h2 className="text-white">Temperature Chart</h2>
                <Line data={temperatureData} options={{
                    scales: {
                        y: {
                            min: lowTemp, max: highTemp, ticks: {
                                callback: (value) => `${value}C`,
                            }, grid: {
                                color: 'rgba(255,255,255,0.2)',
                            },
                        }
                    }
                }} />
            </div>
            <div className="rounded-lg border-white border-2 bg-black p-4 mt-4">
                <h2 className="text-white">PH Chart</h2>
                <Line data={phData} options={{
                    scales: {
                        y: {
                            min: 1, max: 14, ticks: {
                                callback: (value) => `${value}`,
                            }, grid: {
                                color: 'rgba(255,255,255,0.2)',
                            },
                        },
                    }
                }} />
            </div>
            <button onClick={() => { seedReadings() }}>Seed</button>
        </div>
    );
};

export default HistoryChart;
