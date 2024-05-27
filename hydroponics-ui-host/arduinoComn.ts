import { Info } from "@prisma/client";
import { ReadlineParser, SerialPort } from "serialport";
import { convertToVolts } from "./utils";

let port;

type ArduinoParsedReading = {
  temperature: number;
  ph: number;
  waterLevel: "low" | "normal" | "high";
};

type ArduinoReading = {
  port: string;
  value: number;
};

interface IInitSerial {
  onData: (data: ArduinoParsedReading) => void;
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
    const readings: ArduinoReading[] = parseArduinoRawData(data);
    const parsedReadings: ArduinoParsedReading = parseArduinoReadings(readings);
    console.log(parsedReadings);
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
  console.log("Requesting readings...");
  port.write("analog\n");
};

export const sendRelays = (relays: { port: string; status: boolean }[]) => {
  const relaysString = relays
    .map(({ port, status }) => `${port}${status ? "U" : "D"}`)
    .join("");
  console.log("Sending relays:", `R${relaysString}\n`);
  port.write(`R${relaysString}\n`);
};

export function getRelayConfig(info: Info) {
  const relayConfig: { port: string; status: boolean }[] = [
    { port: formatToTwoNumbersString(info.K1pin), status: info.K1 },
    { port: formatToTwoNumbersString(info.K2pin), status: info.K2 },
    { port: formatToTwoNumbersString(info.K3pin), status: info.K3 },
    { port: formatToTwoNumbersString(info.K4pin), status: info.K4 },
    { port: formatToTwoNumbersString(info.K5pin), status: info.K5 },
    { port: formatToTwoNumbersString(info.K6pin), status: info.K6 },
    { port: formatToTwoNumbersString(info.K7pin), status: info.K7 },
    { port: formatToTwoNumbersString(info.K8pin), status: info.K8 },
    { port: formatToTwoNumbersString(info.K9pin), status: info.K9 },
    { port: formatToTwoNumbersString(info.K10pin), status: info.K10 },
  ];
  return relayConfig;
}

//
export const formatToTwoNumbersString = (value: number) => {
  return value.toString().padStart(2, "0");
};

function parseArduinoRawData(data: string): ArduinoReading[] {
  const readings = data
    .split(",")
    .map((reading) => reading.split(":"))
    .map(([port, value]) => ({ port, value: parseInt(value) }));
  return readings;
}

function parseArduinoReadings(data: ArduinoReading[]): ArduinoParsedReading {
  const temperatureRaw = data.find((reading) => reading.port === "T1")?.value;
  const phRaw = data.find((reading) => reading.port === "A1")?.value;
  if (temperatureRaw === undefined || phRaw === undefined) {
    throw new Error("Invalid readings");
  }
  return {
    temperature: temperatureRaw / 10,
    ph: convertToVolts(phRaw),
    waterLevel: "normal",
  };
}
