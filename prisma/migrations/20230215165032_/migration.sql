/*
  Warnings:

  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdBy` VARCHAR(32) NULL,
    ADD COLUMN `dateMeeting` DATETIME(3) NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `deletedBy` VARCHAR(32) NULL,
    ADD COLUMN `doctorId` VARCHAR(32) NULL,
    ADD COLUMN `fullName` TEXT NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `notes` VARCHAR(255) NULL,
    ADD COLUMN `patientId` VARCHAR(32) NULL,
    ADD COLUMN `phone` VARCHAR(32) NULL,
    ADD COLUMN `reason` VARCHAR(255) NULL,
    ADD COLUMN `statusAppointment` ENUM('CREATED', 'APPROVED', 'REFUSED', 'CANCELED') NOT NULL DEFAULT 'CREATED',
    ADD COLUMN `timeMeeting` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedBy` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `bloodpressure` MODIFY `systolic` VARCHAR(255) NULL,
    MODIFY `diastolic` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `cholesterol` MODIFY `cholesterol` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `leaderId` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `glucose` MODIFY `glucose` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `heartbeat` MODIFY `heartRateIndicator` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `Carer` (
    `id` VARCHAR(32) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_patient_carer` (
    `A` VARCHAR(32) NOT NULL,
    `B` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `_patient_carer_AB_unique`(`A`, `B`),
    INDEX `_patient_carer_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_patient_carer` ADD CONSTRAINT `_patient_carer_A_fkey` FOREIGN KEY (`A`) REFERENCES `Carer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_patient_carer` ADD CONSTRAINT `_patient_carer_B_fkey` FOREIGN KEY (`B`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
