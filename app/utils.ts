'use server'
import { PrismaClient, Settings, Info, Reading, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { cache } from "react";

const prisma = new PrismaClient()

export const getSettings = cache(async () => {
    return findFirstOrCreateSettings();
})

export const getSchedules = cache(async () => {
    const schedules = await prisma.schedule.findMany({
        include: { weeklyParts: true }
    });
    return schedules.map((schedule) => {
        return {
            ...schedule, weeklyParts: schedule.weeklyParts.map((part) => ({
                ...part,
                partA: toFloat(part.partA),
                partB: toFloat(part.partB),
                partC: toFloat(part.partC)
            }))
        }
    });
})

export const addSchedule = async (data: any) => {
    const schedule = await prisma.schedule.create({
        data: {
            weeklyParts: { create: data.weeklyParts }
        }
    });
    revalidatePath('/schedules')
    return schedule;
}

export const deleteSchedule = async (id: number) => {
    await prisma.schedule.delete({
        where: { id }
    });
    revalidatePath('/schedules')
}

export const seedReadings = async () => {
    const baseTemperature = 25.5;
    const baseph = 4;
    const readings = [];
    for (let i = 0; i < 16; i++) {
        const temperature = baseTemperature + (i * 0.5) + (Math.random() * 1.5);
        const ph = baseph + (i * 0.1) + (Math.random() * 0.1);
        const timestamp = new Date();
        await prisma.reading.create({
            data: { temperature, timestamp, ph }
        });
        readings.push({ temperature, timestamp });
    }
}

export const getReadings = cache(async (granularity?: string) => {
    let take = 100;
    let orderBy: { timestamp: 'desc' } = { timestamp: 'desc' };

    if (granularity === 'second') {
        take = 1 * 60;
    } else if (granularity === 'minute') {
        take = 60 * 60;
    } else if (granularity === 'hour') {
        take = 3600 * 24;
    }

    const readings = await prisma.reading.findMany({
        orderBy,
        take
    });

    if (granularity === 'second' || granularity === 'minute' || granularity === 'hour') {
        const groupedReadings = groupReadingsByGranularity(readings, granularity);
        return groupedReadings.map((group) => {
            const averageTemperature = calculateAverageTemperature(group);
            const averagePh = calculateAveragePh(group);
            return { ph: averagePh, temperature: averageTemperature, timestamp: group[0].timestamp };
        });
    }

    return readings.map((reading) => {
        return { ...reading, temperature: toFloat(reading.temperature), ph: toFloat(reading.ph) };
    });
});

const groupReadingsByGranularity = (readings: Reading[], granularity: string) => {
    const groupedReadings: any[] = [];
    let group: any[] = [];
    let currentTimestamp: Date | null = null;

    for (const reading of readings) {
        if (!currentTimestamp) {
            currentTimestamp = reading.timestamp;
        }

        if (granularity === 'second' && reading.timestamp.getSeconds() !== currentTimestamp?.getSeconds()) {
            groupedReadings.push(group);
            group = [];
            currentTimestamp = reading.timestamp;
        } else if (granularity === 'minute' && reading.timestamp.getMinutes() !== currentTimestamp?.getMinutes()) {
            groupedReadings.push(group);
            group = [];
            currentTimestamp = reading.timestamp;
        } else if (granularity === 'hour' && reading.timestamp.getHours() !== currentTimestamp?.getHours()) {
            groupedReadings.push(group);
            group = [];
            currentTimestamp = reading.timestamp;
        }

        group.push(reading);
    }

    if (group.length > 0) {
        groupedReadings.push(group);
    }

    return groupedReadings;
};

const calculateAverageTemperature = (readings: Reading[]) => {
    const sum = readings.reduce((total, reading) => total + toFloat(reading.temperature), 0);
    return sum / readings.length;
};


const calculateAveragePh = (readings: Reading[]) => {
    const sum = readings.reduce((total, reading) => total + toFloat(reading.ph), 0);
    return sum / readings.length;
};

export const getInfo = cache(async () => {
    return findFirstOrCreateInfo();
});


export const saveSettings = async (data: Settings) => {
    await findFirstOrCreateSettings();
    const updatedSettings = await prisma.settings.update({
        where: { id: data.id },
        data: { flowRateA: data.flowRateA, flowRateB: data.flowRateB, flowRateC: data.flowRateC, flowRateD: data.flowRateD }
    });
    revalidatePath('/settings')
    return updatedSettings;
}


const findFirstOrCreateSettings = async () => {
    const found = await prisma.settings.findFirst();
    if (!found) {
        const newSettings = await prisma.settings.create({
            data: { flowRateA: 0, flowRateB: 0, flowRateC: 0, flowRateD: 0 }
        })
        return newSettings;
    }
    return found
}

const findFirstOrCreateInfo = async () => {
    const found = await prisma.info.findFirst();
    if (!found) {
        const info = await prisma.info.create({
            data: { lowWaterA: false, lowWaterB: false, lowWaterC: false, lowWaterD: false, temperature: -1.0 }
        })
        return { ...info, temperature: toFloat(info.temperature) };
    }
    return { ...found, temperature: toFloat(found.temperature) }
}

const toFloat = (value: Decimal) => {
    return parseFloat(value.toFixed(2));
}