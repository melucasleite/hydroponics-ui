import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { HIGH_TEMP_THRESHOLD, LOW_TEMP_THRESHOLD } from "../constants";
import { getInfo } from "../utils";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const TemperatureHistory = () => {
    const [temperatureData, setTemperatureData] = React.useState<number[]>([]);
    useEffect(() => {
        setTemperatureData(Array.from({ length: 100 }, () => Math.random() * (35.5 - 20.0) + 20.0));
    }, []);

    React.useEffect(() => {
        const fetchInfo = async () => {
            const data = await getInfo();
        };

        const interval = setInterval(fetchInfo, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const last20Points = temperatureData.slice(-20);
    const lowerThreshold = LOW_TEMP_THRESHOLD;
    const upperThreshold = HIGH_TEMP_THRESHOLD;

    const data = {
        labels: last20Points.map((_, index) => `Point ${index + 1}`),
        datasets: [
            {
                label: "Temperature",
                data: last20Points,
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
                data: Array(20).fill(lowerThreshold),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(20).fill(upperThreshold),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };
    return (
        <div>
            <Line data={data} />
        </div>
    );
};

export default TemperatureHistory;