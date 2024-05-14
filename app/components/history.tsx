import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { HIGH_PH_THRESHOLD, HIGH_TEMP_THRESHOLD, LOW_PH_THRESHOLD, LOW_TEMP_THRESHOLD } from "../constants";
import { Granularity, getReadings } from "../utils";
import { Reading } from "@prisma/client";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

type parsedReading = Omit<Reading, 'date' | 'hour' | 'minute' | 'second' | 'temperature' | 'id' | 'ph'> & {
    temperature: number | null;
    ph: number | null;
};

const HistoryChart = () => {
    const [readings, setReadings] = React.useState<parsedReading[]>([]);
    const [granularity, setGranularity] = React.useState<Granularity>('second');
    const granularityRef = React.useRef(granularity);
    const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null); // Use a ref to hold the timeout id

    React.useEffect(() => {
        granularityRef.current = granularity;
    }, [granularity]);

    const granularityToInterval = {
        'second': 5000,
        'minute': 60000,
        'hour': 3600000,
        '6hours': 21600000
    };

    const fetchInfo = async () => {
        const data = await getReadings(granularityRef.current);
        setReadings(data);
        timeoutIdRef.current = setTimeout(fetchInfo, granularityToInterval[granularityRef.current]);
    };

    const formatLabel = (value: string | number, granularity: Granularity) => {
        console.log(value)
        let date = new Date(value);
        switch (granularity) {
            case 'second':
                return `${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            case 'minute':
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            case 'hour':
            case '6hours':
                return `${date.getDate().toString().padStart(2, '0')}/${date.getMonth() + 1} - ${date.getHours().toString().padStart(2, '0')}`;
            default:
                return value;
        }
    }

    React.useEffect(() => {
        fetchInfo();
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [granularity]);

    const lowTemp = LOW_TEMP_THRESHOLD;
    const highTemp = HIGH_TEMP_THRESHOLD;

    const lowPh = LOW_PH_THRESHOLD;
    const highPh = HIGH_PH_THRESHOLD;


    const temperatureData = {
        labels: readings.map((reading) => formatLabel(reading.timestamp.toISOString(), granularity)),
        datasets: [
            {
                label: "Temperature",
                data: readings.map((reading) => reading.temperature),
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
                data: Array(readings.length).fill(lowTemp),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(readings.length).fill(highTemp),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

    console.log(temperatureData)

    const phData = {
        labels: readings.map((reading) => new Date(reading.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: "PH",
                data: readings.map((reading) => reading.ph),
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
                data: Array(readings.length).fill(lowPh),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(readings.length).fill(highPh),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

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
                <button
                    className={`px-2 border-2 rounded ${granularity === '6hours' ? 'border-primary' : 'black'}`}
                    onClick={() => setGranularity('6hours')}
                >
                    6 Hours
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
        </div>
    );
};

export default HistoryChart;
