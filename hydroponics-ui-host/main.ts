import { getInfo, insertReading, updateInfo } from "./persistance";
import {
    getRelayConfig,
    initSerial,
    requestReadings,
    sendRelays,
} from "./arduinoComn";
import { convertToVolts } from "./utils";

const setup = async () => {
    initSerial({ onData: readAndInsert });
    setInterval(() => {
        requestReadings();
    }, 1000);
    setInterval(() => {
        getInfoAndSendRelays();
    }, 1000);
};

export const readAndInsert = (data: string) => {
    console.log("Received data:", data);
    const readings = data.split("-").map((reading: string) => {
        const [port, value] = reading.split("V");
        return { port, value: Number(value) };
    });
    console.log("Parsed readings:", readings);
    const temperatureRaw = readings.find(
        (reading) => reading.port === "T1"
    )?.value;
    const phRaw = readings.find((reading) => reading.port === "A1")?.value;
    const waterSensorA0 = readings.find(
        (reading) => reading.port === "A0"
    )?.value;
    if (
        temperatureRaw !== undefined &&
        phRaw !== undefined &&
        waterSensorA0 !== undefined
    ) {
        insertReading(
            temperatureRaw / 10,
            convertToVolts(phRaw),
            convertToVolts(waterSensorA0)
        );
        updateInfo(temperatureRaw / 10);
    } else console.error("Invalid readings");
};

export const getInfoAndSendRelays = async () => {
    const info = await getInfo();
    if (!info) {
        console.error("Info not found");
        return;
    }
    const relayConfig = await getRelayConfig(info);
    if (!relayConfig) {
        console.error("Relay config couldn't be generated");
    } else {
        console.log("Relay config:", relayConfig);
        sendRelays(relayConfig);
    }
}

await setup();
