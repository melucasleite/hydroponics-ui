import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client";
import { Info } from "@prisma/client";

export async function insertReading(
  { temperature, waterLevel, ph },
  retryCount = 10
): Promise<void> {
  console.log("Inserting reading:", { temperature, ph });
  try {
    await prisma.reading.create({
      data: {
        temperature,
        ph,
        waterSensorA0: waterLevel,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && retryCount > 0) {
      console.log(
        `Error inserting reading. Retrying... (${retryCount} attempts left)`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await insertReading({ temperature, waterLevel, ph }, retryCount - 1);
    } else {
      console.error("Failed to insert reading:", error);
    }
  }
}

export async function updateInfo(temperature: number) {
  console.log("Updating info:", { temperature });
  try {
    const info = await prisma.info.findFirst();
    if (info) {
      await prisma.info.update({
        where: { id: info.id },
        data: {
          temperature,
        },
      });
    } else {
      console.error("Info not found");
    }
  } catch (error) {
    console.error("Failed to update info:", error);
  }
}

export async function getInfo(): Promise<Info> {
  console.log("Getting info");
  const info = await prisma.info.findFirst();
  if (info === null) {
    throw new Error("Info not found");
  }
  console.log("Got info:", info);
  return info;
}
