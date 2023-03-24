/*
  Warnings:

  - You are about to drop the column `attachments` on the `message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lastMessageId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `appointment` MODIFY `statusAppointment` ENUM('CREATED', 'APPROVED', 'REFUSED', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `lastMessageId` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `attachments`,
    ADD COLUMN `typeMessage` ENUM('TEXT', 'IMAGE', 'VIDEO', 'FILE', 'RECALL', 'NOTIFY') NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `url` TEXT NULL,
    MODIFY `typeNotification` ENUM('WARNING', 'SYSTEM', 'APPOINTMENT', 'EMERGENCY') NULL DEFAULT 'SYSTEM';

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(32) NOT NULL,
    `rate` SMALLINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,
    `patientId` VARCHAR(32) NULL,
    `doctorId` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(32) NOT NULL,
    `url` TEXT NULL,
    `name` TEXT NULL,
    `messageId` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_lastMessageId_key` ON `Conversation`(`lastMessageId`);

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_lastMessageId_fkey` FOREIGN KEY (`lastMessageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
