"use client"
import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TooltipModel, TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { HIGH_PH_THRESHOLD, HIGH_TEMP_THRESHOLD, LOW_PH_THRESHOLD, LOW_TEMP_THRESHOLD } from "../constants";
import { Granularity, getReadings } from "../utils";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

type ParsedReading = {
    reading_count: number;
    interval: Date;
    temperature: number | null;
    ph: number | null;
};

const HistoryChart = () => {
    const [readings, setReadings] = React.useState<ParsedReading[]>([]);
    const [granularity, setGranularity] = React.useState<Granularity>('second');
    const granularityRef = React.useRef(granularity);
    const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null); // Use a ref to hold the timeout id

    const poolingInterval = {
        'second': 1000,
        'minute': 1000,
        'hour': 1000,
        'day': 1000
    };

    useEffect(() => {
        fetchInfo();
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [granularity]);

    const fetchInfo = async () => {
        const data = await getReadings(granularityRef.current);
        setReadings(data);
        timeoutIdRef.current = setTimeout(fetchInfo, 1000);
    };

    useEffect(() => {
        granularityRef.current = granularity;
    }, [granularity]);


    const lowTemp = LOW_TEMP_THRESHOLD;
    const highTemp = HIGH_TEMP_THRESHOLD;

    const lowPh = LOW_PH_THRESHOLD;
    const highPh = HIGH_PH_THRESHOLD;


    const temperatureData = {
        labels: readings.map((reading) => formatLabel(reading.interval, granularityRef.current)),
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
        ]
    };

    const phData = {
        labels: readings.map((reading) => formatLabel(reading.interval, granularityRef.current)),
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

    function footer(this: TooltipModel<"line">, tooltipItems: TooltipItem<"line">[]): string | void | string[] {
        const item = tooltipItems[0];
        if (item) {
            const value = readings[item.dataIndex].reading_count;
            return `Readings: ${value}`;
        }
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
                <button
                    className={`px-2 border-2 rounded ${granularity === 'day' ? 'border-primary' : 'black'}`}
                    onClick={() => setGranularity('day')}
                >
                    Day
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
                    }, plugins: {
                        tooltip: {
                            callbacks: {
                                footer,
                            }
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
                    }, plugins: {
                        tooltip: {
                            callbacks: {
                                footer,
                            }
                        }
                    }
                }} />
            </div>
        </div>
    );
};

export default HistoryChart;

function formatLabel(interval: Date, granularity: Granularity): string {
    switch (granularity) {
        case 'second':
            return interval.toLocaleTimeString();
        case 'minute':
            return interval.toLocaleTimeString();
        case 'hour':
            return interval.toLocaleTimeString();
        case 'day':
            return interval.toLocaleDateString();
    }
}

