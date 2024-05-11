'use server'
import { PrismaClient, Settings } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cache } from "react";

const prisma = new PrismaClient()

export const getSettings = cache(async () => {
    return findOrCreateSettings();
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