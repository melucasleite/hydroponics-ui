"use client"
import React, { FC, useEffect } from "react";
import { HIGH_PH_THRESHOLD, HIGH_TEMP_THRESHOLD, LOW_PH_THRESHOLD, LOW_TEMP_THRESHOLD } from "../constants";
import { Granularity, getReadings } from "../utils";
import { getChartData } from "./historyUtils";
import { LineChart } from "./lineChart";
import { TooltipItem, TooltipModel } from "chart.js";

type ParsedReading = {
    reading_count: number;
    interval: Date;
    temperature: number | null;
    ph: number | null;
};

const windowByGranularityMap = {
    second: ["1 minute", "5 minutes"],
    minute: ["1 hour", "6 hours"],
    hour: ["1 day", "7 days"],
    day: ["7 days", "30 days"],
};

const granularityList: Granularity[] = ['second', 'minute', 'hour', 'day'];

interface IHistoryChart {
    poolingInterval: number;
}

const HistoryChart: FC<IHistoryChart> = ({ poolingInterval }) => {
    const [readings, setReadings] = React.useState<ParsedReading[]>([]);
    const [granularity, setGranularity] = React.useState<Granularity>(granularityList[0]);
    const [window, setWindow] = React.useState(windowByGranularityMap[granularity][0]); // Default to the first window in the list
    const granularityRef = React.useRef(granularity);
    const windowRef = React.useRef(window);
    const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null); // Use a ref to hold the timeout id

    useEffect(() => {
        fetchInfo();
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [granularity]);

    const fetchInfo = async () => {
        const data = await getReadings(granularityRef.current, windowRef.current);
        setReadings(data);
        timeoutIdRef.current = setTimeout(fetchInfo, poolingInterval);
    };

    useEffect(() => {
        granularityRef.current = granularity;
        windowRef.current = windowByGranularityMap[granularity][0];
        setWindow(windowByGranularityMap[granularity][0]);
    }, [granularity]);


    useEffect(() => {
        windowRef.current = window;
    }, [window]);


    const lowTemp = LOW_TEMP_THRESHOLD;
    const highTemp = HIGH_TEMP_THRESHOLD;

    const lowPh = LOW_PH_THRESHOLD;
    const highPh = HIGH_PH_THRESHOLD;

    const temperatureData = getChartData("Temperature", readings.map((reading) => reading.temperature), lowTemp, highTemp, readings.map((reading) => reading.interval.toLocaleString()));

    const phData = getChartData("PH", readings.map((reading) => reading.ph), lowPh, highPh, readings.map((reading) => reading.interval.toLocaleTimeString()));

    function tooltipFooter(this: TooltipModel<"line">, tooltipItems: TooltipItem<"line">[]): string | void | string[] {
        const item = tooltipItems[0];
        if (item) {
            const value = readings[item.dataIndex].reading_count;
            return `Readings: ${value}`;
        }
    }
    return (
        <div className="mt-2">
            <div className="flex gap-2 mb-2">
                {granularityList.map((g) => (
                    <button
                        key={g}
                        className={`px-2 border-2 rounded ${granularity === g ? 'border-primary' : 'black'}`}
                        onClick={() => setGranularity(g)}
                    >
                        {g}
                    </button>
                ))}
                <select className="p-2 border-2 rounded bg-black" onChange={(e) => setWindow(e.target.value)}   >
                    {windowByGranularityMap[granularity].map((w) => (
                        <option key={w} value={w} selected={w === window}>{w}</option>
                    ))}
                </select>
            </div>
            <div className="rounded-lg border-white border-2 bg-black p-4">
                <h2 className="text-white">Temperature Chart</h2>
                <LineChart data={temperatureData} min={lowTemp} max={highTemp} valueFormater={(value) => `${value}C`} tooltipFooter={tooltipFooter} />
            </div>
            <div className="rounded-lg border-white border-2 bg-black p-4 mt-4">
                <h2 className="text-white">PH Chart</h2>
                <LineChart data={phData} min={lowPh} max={highPh} valueFormater={(value) => `${value}`} tooltipFooter={tooltipFooter} />
            </div>
        </div>
    );
};

export default HistoryChart;
