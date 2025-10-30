/*
  Warnings:

  - You are about to alter the column `budget` on the `media` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `duration` on the `media` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `year` on the `media` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `director` on table `media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `media` MODIFY `director` VARCHAR(191) NOT NULL,
    MODIFY `budget` DOUBLE NULL,
    MODIFY `duration` INTEGER NULL,
    MODIFY `year` INTEGER NULL;
