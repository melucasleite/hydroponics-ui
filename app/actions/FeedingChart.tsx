"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

interface IFeedingChart {
  action: {
    id: number;
    weeklyParts: {
      volumeA: string;
      runA: string;
      volumeB: string;
      runB: string;
      volumeC: string;
      runC: string;
    }[];
  };
}

export const FeedingChart: React.FC<IFeedingChart> = ({ action }) => {
  return (
    <Line
      data={{
        labels: action.weeklyParts.map((part, index) => "Week " + (index + 1)),
        datasets: [
          {
            label: "Volume A",
            data: action.weeklyParts.map((part) => parseFloat(part.volumeA)),
            borderColor: "red",
            fill: false,
          },
          {
            label: "Volume B",
            data: action.weeklyParts.map((part) => parseFloat(part.volumeB)),
            borderColor: "green",
            fill: false,
          },
          {
            label: "Volume C",
            data: action.weeklyParts.map((part) => parseFloat(part.volumeC)),
            borderColor: "blue",
            fill: false,
          },
        ],
      }}
    />
  );
};
