import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client";
import { CurrentState, Relay } from "@prisma/client";

export async function insertReading(
  { temperature, waterLevel, ph },
  retryCount = 10
): Promise<void> {
  try {
    await prisma.reading.create({
      data: {
        temperature,
        ph,
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

export async function updateCurrentState(reading: ArduinoReading) {
  console.log("Updating CurrentState:", reading);
  const obj = await prisma.currentState.findFirst();
  if (!obj) {
    throw new Error("CurrentState not found");
  }
  await prisma.currentState.update({
    where: { id: obj.id },
    data: {
      temperature: reading.temperature,
      ph: reading.ph,
      waterLevel: reading.waterLevel,
    },
  });
}

export async function getCurrentState(): Promise<CurrentState> {
  console.log("Getting CurrentState");
  const obj = await prisma.currentState.findFirst();
  if (obj === null) {
    throw new Error("CurrentState not found");
  }
  return obj;
}

export async function getRelays(): Promise<Relay> {
  console.log("Getting Relays");
  const obj = await prisma.relay.findFirst();
  if (obj === null) {
    throw new Error("Relays not found");
  }
  return obj;
}
