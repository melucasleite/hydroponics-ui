'use server'
import { PrismaClient, Settings, Info } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { cache } from "react";

const prisma = new PrismaClient()

export const getSettings = cache(async () => {
    return findOrCreateSettings();
});

export const getReadings = cache(async () => {
    const readings = await prisma.reading.findMany({
        orderBy: { timestamp: 'desc' },
        take: 20
    })
    return readings.map((reading) => {
        return { ...reading, temperature: toFloat(reading.temperature) }
    });
})

export const getInfo = cache(async () => {
    return findOrCreateInfo();
});


export const saveSettings = async (data: Settings) => {
    await findOrCreateSettings();
    const updatedSettings = await prisma.settings.update({
        where: { id: data.id },
        data: { flowRateA: data.flowRateA, flowRateB: data.flowRateB, flowRateC: data.flowRateC, flowRateD: data.flowRateD }
    });
    revalidatePath('/settings')
    return updatedSettings;
}


const findOrCreateSettings = async () => {
    const found = await prisma.settings.findFirst();
    if (!found) {
        const newSettings = await prisma.settings.create({
            data: { flowRateA: 0, flowRateB: 0, flowRateC: 0, flowRateD: 0 }
        })
        return newSettings;
    }
    return found
}

const findOrCreateInfo = async () => {
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