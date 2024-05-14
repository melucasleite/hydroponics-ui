'use server'
import { PrismaClient, Settings, Info, Reading, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import _ from "lodash"

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

export type Granularity = 'second' | 'minute' | 'hour' | "6hours";

function generateTimeSeries(granularity: Granularity): Date[] {
    const current = Date.now();

    switch (granularity) {
        case 'second':
            return Array.from({ length: 60 }, (_, i) => {
                const date = new Date(current - (i * 1000));
                date.setMilliseconds(0);
                return date;
            });
        case 'minute':
            return Array.from({ length: 60 }, (_, i) => {
                const date = new Date(current - (i * 60 * 1000));
                date.setMilliseconds(0);
                date.setSeconds(0);
                return date;
            });
        case 'hour':
            return Array.from({ length: 48 }, (_, i) => {
                const date = new Date(current - (i * 60 * 60 * 1000));
                date.setMilliseconds(0);
                date.setSeconds(0);
                date.setMinutes(0);
                return date;
            });
        case '6hours':
            return Array.from({ length: 48 }, (_, i) => {
                const date = new Date(current - (i * 6 * 60 * 60 * 1000));
                date.setMilliseconds(0);
                date.setSeconds(0);
                date.setMinutes(0);
                return date;
            });
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
    } else if (granularity === '6hours') {
        take = 4 * 3600 * 24;
    }

    const readings = await prisma.reading.findMany({
        orderBy,
        take
    });

    if (granularity === 'second' || granularity === 'minute' || granularity === 'hour' || granularity === '6hours') {
        for (const reading of readings) {
            if (granularity === 'second') {
                reading.timestamp.setMilliseconds(0)
            } else if (granularity === 'minute') {
                reading.timestamp.setMilliseconds(0)
                reading.timestamp.setSeconds(0)
            } else if (granularity === 'hour') {
                reading.timestamp.setMilliseconds(0)
                reading.timestamp.setSeconds(0)
                reading.timestamp.setMinutes(0)
            } else if (granularity === '6hours') {
                reading.timestamp.setMilliseconds(0)
                reading.timestamp.setSeconds(0)
                reading.timestamp.setMinutes(0)
            }
        }

        const groupedReadings = _.groupBy(readings, (reading) => reading.timestamp.getTime());
        const timeSeries = generateTimeSeries(granularity);

        const result = timeSeries.map((timestamp) => {
            const reading = groupedReadings[timestamp.getTime()];
            if (reading) {
                return {
                    timestamp: timestamp,
                    temperature: calculateAverageTemperature(reading),
                    ph: calculateAveragePh(reading)
                };
            } else {
                return {
                    timestamp: timestamp,
                    temperature: null,
                    ph: null
                };
            }
        });

        return result.reverse();
    };

    return readings.map((reading) => {
        return {
            ...reading,
            temperature: toFloat(reading.temperature),
            ph: toFloat(reading.ph)
        }
    }).reverse();
});

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
        data
    });
    revalidatePath('/settings')
    return updatedSettings;
}


const findFirstOrCreateSettings = async () => {
    const found = await prisma.settings.findFirst();
    if (!found) {
        const newSettings = await prisma.settings.create({
            data: { flowRateA: 0, flowRateB: 0, flowRateC: 0, flowRateD: 0, mainVolumeContainer: 0 }
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