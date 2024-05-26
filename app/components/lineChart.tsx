import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TooltipModel, TooltipItem } from "chart.js";
import { FC } from "react";
import { Line } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface ILineChart {
    data: any;
    min: number;
    max: number;
    valueFormater: (value: string | number) => string;
    tooltipFooter: (this: TooltipModel<"line">, tooltipItems: TooltipItem<"line">[]) => string | void | string[];
}

export const LineChart: FC<ILineChart> = ({ data, min, max, valueFormater, tooltipFooter }) => (
    <Line data={data} options={{
        maintainAspectRatio: false,
        scales: {
            y: {
                min, max, ticks: {
                    callback: valueFormater,
                }, grid: {
                    color: 'rgba(255,255,255,0.2)',
                },
            }
        }, plugins: {
            tooltip: {
                callbacks: {
                    footer: tooltipFooter,
                }
            }
        }
    }} />
)