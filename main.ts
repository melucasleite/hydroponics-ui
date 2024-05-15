import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const convertToVolts = (value: number) => {
    return (value * 5 / 1023);
}

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
    const readings = data.split('-').map((reading: string) => {
        const [port, value] = reading.split('V');
        return { port, value: Number(value) };
    });
    console.log('Parsed readings:', readings);
    const temperatureRaw = readings.find((reading) => reading.port === 'T1')?.value;
    const phRaw = readings.find((reading) => reading.port === 'A1')?.value;
    if (temperatureRaw !== undefined && phRaw !== undefined)
        insertReading(temperatureRaw / 10, convertToVolts(phRaw));
    else
        console.error('Invalid readings');
}

parser.on('data', readAndInsert);

async function insertReading(temperature: number, ph: number, retryCount = 10): Promise<void> {
    console.log('Inserting reading:', { temperature, ph });
    try {
        await prisma.reading.create({
            data: {
                temperature,
                ph,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && retryCount > 0) {
            console.log(`Error inserting reading. Retrying... (${retryCount} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await insertReading(temperature, ph, retryCount - 1);
        } else {
            console.error('Failed to insert reading:', error);
        }
    }
}

const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};