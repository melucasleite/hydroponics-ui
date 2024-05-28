/*
  Warnings:

  - You are about to drop the column `K1` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K10` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K10pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K1pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K2` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K2pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K3` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K3pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K4` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K4pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K5` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K5pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K6` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K6pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K7` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K7pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K8` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K8pin` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K9` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `K9pin` on the `Info` table. All the data in the column will be lost.
  - Added the required column `ec` to the `Info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ph` to the `Info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Info" DROP COLUMN "K1",
DROP COLUMN "K10",
DROP COLUMN "K10pin",
DROP COLUMN "K1pin",
DROP COLUMN "K2",
DROP COLUMN "K2pin",
DROP COLUMN "K3",
DROP COLUMN "K3pin",
DROP COLUMN "K4",
DROP COLUMN "K4pin",
DROP COLUMN "K5",
DROP COLUMN "K5pin",
DROP COLUMN "K6",
DROP COLUMN "K6pin",
DROP COLUMN "K7",
DROP COLUMN "K7pin",
DROP COLUMN "K8",
DROP COLUMN "K8pin",
DROP COLUMN "K9",
DROP COLUMN "K9pin",
ADD COLUMN     "ec" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "ph" DECIMAL(5,2) NOT NULL;

-- CreateTable
CREATE TABLE "Relay" (
    "id" SERIAL NOT NULL,
    "K1" BOOLEAN NOT NULL DEFAULT false,
    "K2" BOOLEAN NOT NULL DEFAULT false,
    "K3" BOOLEAN NOT NULL DEFAULT false,
    "K4" BOOLEAN NOT NULL DEFAULT false,
    "K5" BOOLEAN NOT NULL DEFAULT false,
    "K6" BOOLEAN NOT NULL DEFAULT false,
    "K7" BOOLEAN NOT NULL DEFAULT false,
    "K8" BOOLEAN NOT NULL DEFAULT false,
    "K9" BOOLEAN NOT NULL DEFAULT false,
    "K10" BOOLEAN NOT NULL DEFAULT false,
    "K1pin" INTEGER NOT NULL DEFAULT 0,
    "K2pin" INTEGER NOT NULL DEFAULT 0,
    "K3pin" INTEGER NOT NULL DEFAULT 0,
    "K4pin" INTEGER NOT NULL DEFAULT 0,
    "K5pin" INTEGER NOT NULL DEFAULT 0,
    "K6pin" INTEGER NOT NULL DEFAULT 0,
    "K7pin" INTEGER NOT NULL DEFAULT 0,
    "K8pin" INTEGER NOT NULL DEFAULT 0,
    "K9pin" INTEGER NOT NULL DEFAULT 0,
    "K10pin" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Relay_pkey" PRIMARY KEY ("id")
);
