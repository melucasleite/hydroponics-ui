import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

async function detectArduinoMega(): Promise<string | undefined> {
    const arduinoMegaVendorId = '2341';
    const arduinoMegaProductId = '0042';

    const ports = await SerialPort.list();
    for (const port of ports) {
        if (port.vendorId === arduinoMegaVendorId && port.productId === arduinoMegaProductId) {
            return port.path
        }
    }
    return undefined;
}

// @ts-ignore
const path = await detectArduinoMega();

if (!path) {
    console.error('Arduino Mega not found');
    process.exit(1);
}

const port = new SerialPort({ path, baudRate: 115200 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

console.log("Testing relays...")

setTimeout(() => {
    // how many elements are in this array?
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].forEach(i => {
        port.write(`U${i}\n`);
    })
}, 1000)

const log = (data: string) => {
    console.log('Received data:', data);
}

parser.on('data', log);