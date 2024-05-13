import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

setInterval(() => {
    requestReadings();
}, 1000);

const requestReadings = () => {
    console.log('Requesting readings...');
    port.write('analog\n');
}

const readAndInsert = (data: string) => {
    console.log('Received data:', data);
    const readings = data.split('\n').map((reading: string) => {
        const [port, value] = reading.split('-');
        return { port, value: Number(value) };
    });
    const temperature = readings.find((reading) => reading.port === 'A0')?.value;
    const ph = readings.find((reading) => reading.port === 'A1')?.value;
    if (temperature && ph)
        insertReading(temperature, ph);
    else
        console.error('Invalid readings');
}

parser.on('data', readAndInsert);

async function insertReading(temperature: number, ph: number) {
    console.log('Inserting reading:', { temperature, ph });
    await prisma.reading.create({
        data: {
            temperature,
            ph,
        },
    });
}
