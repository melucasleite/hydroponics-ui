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

export type Granularity = 'second' | 'minute' | 'hour' | 'day';

export const getReadings = cache(async (granularity: Granularity, window: string) => {
    let result: { interval: Date, reading_count: number, avg_temperature: Decimal | null, avg_ph: Decimal | null }[] = [];
    console.log(window)
    result = await prisma.$queryRawUnsafe(`
        WITH intervals AS (
            SELECT generate_series(
                date_trunc('${granularity}', NOW()),
                date_trunc('${granularity}', NOW()) - INTERVAL '${window}',
                INTERVAL '-1 ${granularity}'
            ) AS interval
        )
        SELECT 
            intervals.interval,
            COUNT("Reading".id) AS reading_count,
            AVG("Reading".temperature) AS avg_temperature,
            AVG("Reading".ph) AS avg_ph
        FROM 
            intervals
        LEFT JOIN 
            "Reading" ON date_trunc('${granularity}', "Reading".timestamp) = intervals.interval
        GROUP BY 
            intervals.interval
        ORDER BY 
            intervals.interval DESC;
    `);
    return result.map((reading) => {
        return {
            reading_count: reading.reading_count,
            interval: reading.interval,
            temperature: reading.avg_temperature ? toFloat(reading.avg_temperature) : null,
            ph: reading.avg_ph ? toFloat(reading.avg_ph) : null
        };
    }
    ).reverse();
});

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