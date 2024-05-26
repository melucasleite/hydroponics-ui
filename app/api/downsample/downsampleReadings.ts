import { PrismaClient } from '@prisma/client';

import logger from '@/logger';

export async function downsampleReadings(prisma: PrismaClient) {
  const logLabel = { task: 'downsampleReadings' }

  logger.info('started', logLabel);

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

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

  logger.info(`Found ${readingsToKeep.length} readings to keep.`, logLabel);

  // Update the readings
  for (const reading of readingsToKeep) {
    await prisma.reading.update({
      where: { id: reading.min_id },
      data: {
        temperature: reading.avg_temperature,
        ph: reading.avg_ph,
      },
    });

    logger.info(`Updated reading with id ${reading.min_id}.`, logLabel);
  }

  logger.info('Finished updating readings.', logLabel);
  logger.info('Deleting old readings...', logLabel);

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

  logger.info(`Deleted ${rowCount} readings.`, { ...logLabel, deletedRows: rowCount });

  logger.info('Finished.', logLabel);

  await logger.flush();
}