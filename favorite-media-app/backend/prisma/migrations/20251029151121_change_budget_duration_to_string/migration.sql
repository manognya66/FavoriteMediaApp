/*
  Warnings:

  - You are about to alter the column `budget` on the `media` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `media` MODIFY `director` VARCHAR(191) NULL,
    MODIFY `budget` VARCHAR(191) NULL,
    MODIFY `duration` VARCHAR(191) NULL,
    MODIFY `year` VARCHAR(191) NULL;
