import { PrismaClient } from '@prisma/client';

export async function downsampleReadings(prisma: PrismaClient) {
  // Get current date and subtract 48 hours
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  console.log('Starting downsampleReadings...');

  // Run raw SQL query to get readings to keep
  const readingsToKeep: {
    hour: Date;
    avg_temperature: number;
    avg_ph: number;
    min_id: number;
  }[] = await prisma.$queryRawUnsafe(`
  SELECT 
    date_trunc('hour', timestamp) as hour,
    AVG(temperature) as avg_temperature,
    AVG(ph) as avg_ph,
    MIN(id) as min_id
  FROM "Reading"
  WHERE timestamp <= $1
  GROUP BY date_trunc('hour', timestamp)
`, twoDaysAgo);

  console.log(`Found ${readingsToKeep.length} readings to keep.`);

  // Update the readings
  for (const reading of readingsToKeep) {
    await prisma.reading.update({
      where: { id: reading.min_id },
      data: {
        temperature: reading.avg_temperature,
        ph: reading.avg_ph,
      },
    });

    console.log(`Updated reading with id ${reading.min_id}.`);
  }

  console.log('Finished updating readings.');
  console.log('Deleting old readings...');

  // log how many readings are being deleted
  const rowCount = await prisma.$executeRawUnsafe(`
      WITH readings_to_keep AS (
        SELECT 
          MIN(id) as min_id
        FROM "Reading"
        WHERE timestamp <= $1
        GROUP BY date_trunc('hour', timestamp)
      )
      DELETE FROM "Reading"
      WHERE timestamp <= $1 AND id NOT IN (SELECT min_id FROM readings_to_keep);
    `, twoDaysAgo);

  console.log(`Deleted ${rowCount} readings.`);

  console.log('Finished downsampleReadings.');
}