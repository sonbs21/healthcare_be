/*
  Warnings:

  - You are about to drop the column `typeMessage` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `_patient_carer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_patient_carer` DROP FOREIGN KEY `_patient_carer_A_fkey`;

-- DropForeignKey
ALTER TABLE `_patient_carer` DROP FOREIGN KEY `_patient_carer_B_fkey`;

-- AlterTable
ALTER TABLE `carer` ADD COLUMN `patientId` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `typeMessage`,
    ADD COLUMN `attachments` JSON NULL;

-- DropTable
DROP TABLE `_patient_carer`;

-- AddForeignKey
ALTER TABLE `Carer` ADD CONSTRAINT `Carer_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
