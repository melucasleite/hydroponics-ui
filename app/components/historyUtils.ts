
export const getChartData = (label: string, data: (number | null)[], lowThreshold: number, highThreshold: number, labels: string[]) => {
    return {
        labels,
        datasets: [
            {
                label: label,
                data: data,
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
                data: Array(data.length).fill(lowThreshold),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
            {
                label: "Upper Threshold",
                data: Array(data.length).fill(highThreshold),
                fill: false,
                borderColor: "rgba(255,0,0,1)",
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };
};
