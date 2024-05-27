"use client"
import React, { FC, useEffect } from "react";
import { HIGH_PH_THRESHOLD, HIGH_TEMP_THRESHOLD, LOW_PH_THRESHOLD, LOW_TEMP_THRESHOLD, validWindows } from "../constants";
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


const granularityList: Granularity[] = ['second', 'minute', 'hour', 'day'];

interface IHistoryChart {
    poolingInterval: number;
}

const HistoryChart: FC<IHistoryChart> = ({ poolingInterval }) => {
    const [readings, setReadings] = React.useState<ParsedReading[]>([]);
    const [granularity, setGranularity] = React.useState<Granularity>(granularityList[0]);
    const [window, setWindow] = React.useState(validWindows[granularity][0]); // Default to the first window in the list
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
        windowRef.current = validWindows[granularity][0];
        setWindow(validWindows[granularity][0]);
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
        <div className="mt-2 h-[50rem]">
            <div className="flex gap-1 mb-2 overflow-x-scroll">
                {granularityList.map((g) => (
                    <button
                        key={g}
                        className={`px-2 border-2 rounded ${granularity === g ? 'border-primary' : 'black'}`}
                        onClick={() => setGranularity(g)}
                    >
                        {g}
                    </button>
                ))}
            </div>
            <select className="px-2 border-2 rounded bg-black" onChange={(e) => setWindow(e.target.value)}   >
                {validWindows[granularity].map((w) => (
                    <option key={w} value={w} selected={w === window}>{w}</option>
                ))}
            </select>
            <div className="h-1/2 pb-5 pt-5">
                <LineChart data={temperatureData} valueFormater={(value) => `${value}C`} tooltipFooter={tooltipFooter} />
            </div>
            <div className="h-1/2 pb-12">
                <LineChart data={phData} min={lowPh} max={highPh} valueFormater={(value) => `${value}`} tooltipFooter={tooltipFooter} />
            </div>
        </div>
    );
};

export { HistoryChart };
