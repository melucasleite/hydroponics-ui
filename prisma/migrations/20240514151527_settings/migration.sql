/*
  Warnings:

  - Added the required column `mainVolumeContainer` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "mainVolumeContainer" INTEGER NOT NULL;
