import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const splitReadings = async () => {
    const readings = await prisma.reading.findMany();
    if (!readings) {
        return [];
    }

    // Split readings timestamp into date, hour, minute, second
    const splitReadings = readings.map((reading) => {
        const date = new Date(reading.timestamp);
        const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
        return {
            id: reading.id,
            date: utcDate,
            hour: date.getUTCHours(),
            minute: date.getUTCMinutes(),
            second: date.getUTCSeconds(),
        };
    });

    let values = splitReadings.map(reading =>
        `(${reading.id}, to_timestamp('${reading.date.toISOString()}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), ${reading.hour}, ${reading.minute}, ${reading.second})`
    ).join(', ');

    let query = `
        WITH updates(id, date, hour, minute, second) AS (VALUES ${values})
        UPDATE "Reading" r SET 
            date = u.date,
            hour = u.hour,
            minute = u.minute,
            second = u.second
        FROM updates u
        WHERE r.id = u.id;
    `;

    // Execute raw SQL query
    await prisma.$executeRawUnsafe(query);
}

splitReadings()