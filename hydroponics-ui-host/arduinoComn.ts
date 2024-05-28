import { Relay } from "@prisma/client";
import { ReadlineParser, SerialPort } from "serialport";
import { convertToVolts } from "./utils";

let port;

interface IInitSerial {
  onData: (data: ArduinoReading) => void;
}

export async function initSerial({ onData }: IInitSerial) {
  const path = await detectArduinoMega();

  if (!path) {
    console.error("Arduino Mega not found");
    process.exit(1);
  }

  port = new SerialPort({ path, baudRate: 115200 });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  parser.on("data", (data: string) => {
    console.log("Received data:", data);
    const readings: ArduinoPortReading[] = parseArduinoRawData(data);
    const parsedReadings: ArduinoReading = parseArduinoReadings(readings);
    onData(parsedReadings);
  });
}

export async function detectArduinoMega(): Promise<string | undefined> {
  const arduinoMegaVendorId = "2341";
  const arduinoMegaProductId = "0042";

  const ports = await SerialPort.list();
  for (const port of ports) {
    if (
      port.vendorId === arduinoMegaVendorId &&
      port.productId === arduinoMegaProductId
    ) {
      return port.path;
    }
  }
  return undefined;
}

export const requestReadings = () => {
  console.log("Requesting readings.");
  port.write("analog\n");
};

export const sendRelays = (relays: { port: string; status: boolean }[]) => {
  const relaysString = relays
    .map(({ port, status }) => `${port}${status ? "U" : "D"}`)
    .join("");
  console.log("Sending relays:", `R${relaysString}\n`);
  port.write(`R${relaysString}\n`);
};

export function getRelayConfig(relay: Relay) {
  const relayConfig: { port: string; status: boolean }[] = [
    { port: formatToTwoNumbersString(relay.K1pin), status: relay.K1 },
    { port: formatToTwoNumbersString(relay.K2pin), status: relay.K2 },
    { port: formatToTwoNumbersString(relay.K3pin), status: relay.K3 },
    { port: formatToTwoNumbersString(relay.K4pin), status: relay.K4 },
    { port: formatToTwoNumbersString(relay.K5pin), status: relay.K5 },
    { port: formatToTwoNumbersString(relay.K6pin), status: relay.K6 },
    { port: formatToTwoNumbersString(relay.K7pin), status: relay.K7 },
    { port: formatToTwoNumbersString(relay.K8pin), status: relay.K8 },
    { port: formatToTwoNumbersString(relay.K9pin), status: relay.K9 },
    { port: formatToTwoNumbersString(relay.K10pin), status: relay.K10 },
  ];
  return relayConfig;
}

//
export const formatToTwoNumbersString = (value: number) => {
  return value.toString().padStart(2, "0");
};

function parseArduinoRawData(data: string): ArduinoPortReading[] {
  const readings = data
    .split("-")
    .map((reading) => reading.split("V"))
    .map(([port, value]) => ({ port, value: parseInt(value) }));
  return readings;
}

function parseArduinoReadings(data: ArduinoPortReading[]): ArduinoReading {
  const temperatureRaw = data.find((reading) => reading.port === "T1")?.value;
  const phRaw = data.find((reading) => reading.port === "A1")?.value;
  if (temperatureRaw === undefined || phRaw === undefined) {
    throw new Error("Invalid readings");
  }
  return {
    temperature: temperatureRaw / 10,
    ph: convertToVolts(phRaw),
    ec: 1.2,
    waterLevel: "NORMAL",
  };
}
