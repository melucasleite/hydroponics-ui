import { Info } from '@prisma/client';
import { ReadlineParser, SerialPort } from 'serialport';

let port;

const relayMapToPin = {
    "K1": "01",
    "K2": "02",
    "K3": "03",
    "K4": "04",
    "K5": "05",
    "K6": "06",
    "K7": "07",
    "K8": "08",
    "K9": "09",
    "K10": "10",
}

export async function initSerial({ onData }) {
    const path = await detectArduinoMega();

    if (!path) {
        console.error('Arduino Mega not found');
        process.exit(1);
    }

    port = new SerialPort({ path, baudRate: 115200 });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', onData);
}

export async function detectArduinoMega(): Promise<string | undefined> {
    const arduinoMegaVendorId = '2341';
    const arduinoMegaProductId = '0042';

    const ports = await SerialPort.list();
    for (const port of ports) {
        if (port.vendorId === arduinoMegaVendorId && port.productId === arduinoMegaProductId) {
            return port.path;
        }
    }
    return undefined;
}

export const requestReadings = () => {
    console.log('Requesting readings...');
    port.write('analog\n');
};

export const sendRelays = (relays: { port: string, status: boolean }[]) => {
    const relaysString = relays.map(({ port, status }) => `${port}:${status ? 'U' : 'D'}`).join('');
    console.log('Sending relays:', `R${relaysString}\n`);
    port.write(`R${relaysString}\n`);
}

export async function getRelayConfig(info: Info) {
    const relayConfig: { port: string, status: boolean }[] = [
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
    return value.toString().padStart(2, '0');
}