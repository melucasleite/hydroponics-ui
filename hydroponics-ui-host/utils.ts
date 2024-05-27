
const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

export const convertToVolts = (value: number) => {
    return (value * 5 / 1023);
}