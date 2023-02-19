-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(32) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `token` VARCHAR(255) NULL,
    `role` ENUM('PATIENT', 'DOCTOR') NULL DEFAULT 'DOCTOR',
    `memberId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `patientId` VARCHAR(32) NULL,
    `doctorId` VARCHAR(32) NULL,

    UNIQUE INDEX `User_memberId_key`(`memberId`),
    UNIQUE INDEX `User_patientId_key`(`patientId`),
    UNIQUE INDEX `User_doctorId_key`(`doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` VARCHAR(32) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `experience` VARCHAR(255) NULL,
    `workPlace` VARCHAR(255) NULL,
    `specialize` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(32) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `phone` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `avatar` VARCHAR(255) NULL,
    `job` VARCHAR(255) NULL,
    `insuranceNumber` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `medicalHistory` VARCHAR(255) NULL,
    `doctorId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversation` (
    `id` VARCHAR(32) NOT NULL,
    `avatar` TEXT NULL,
    `typeConversation` ENUM('SINGLE', 'GROUP') NULL DEFAULT 'SINGLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(32) NOT NULL,
    `typeMessage` ENUM('TEXT', 'IMAGE', 'VIDEO', 'FILE', 'RECALL', 'NOTIFY') NULL,
    `content` VARCHAR(255) NULL,
    `conversationId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(32) NOT NULL,
    `title` VARCHAR(255) NULL,
    `typeNotification` ENUM('WARNING', 'SYSTEM', 'APPOINTMENT') NULL DEFAULT 'SYSTEM',
    `content` VARCHAR(255) NULL,
    `isRead` BOOLEAN NULL DEFAULT false,
    `userId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationApointment` (
    `id` VARCHAR(32) NOT NULL,
    `appointmentNote` VARCHAR(255) NOT NULL,
    `time` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(32) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HealthRecord` (
    `id` VARCHAR(32) NOT NULL,
    `generalInformation` VARCHAR(255) NULL,
    `content` VARCHAR(255) NULL,
    `status` ENUM('SAFE', 'DANGER', 'CRITIAL') NULL DEFAULT 'SAFE',
    `patientId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    UNIQUE INDEX `HealthRecord_patientId_key`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bmi` (
    `id` VARCHAR(32) NOT NULL,
    `height` VARCHAR(255) NULL,
    `weight` VARCHAR(255) NULL,
    `indexBmi` VARCHAR(255) NULL,
    `healthRecordId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodPressure` (
    `id` VARCHAR(32) NOT NULL,
    `systolic` VARCHAR(255) NOT NULL,
    `diastolic` VARCHAR(255) NOT NULL,
    `healthRecordId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Heartbeat` (
    `id` VARCHAR(32) NOT NULL,
    `heartRateIndicator` VARCHAR(255) NOT NULL,
    `healthRecordId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cholesterol` (
    `id` VARCHAR(32) NOT NULL,
    `cholesterol` VARCHAR(255) NOT NULL,
    `healthRecordId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Glucose` (
    `id` VARCHAR(32) NOT NULL,
    `glucose` VARCHAR(255) NOT NULL,
    `healthRecordId` VARCHAR(32) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(32) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(32) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedBy` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_user_conversation` (
    `A` VARCHAR(32) NOT NULL,
    `B` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `_user_conversation_AB_unique`(`A`, `B`),
    INDEX `_user_conversation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HealthRecord` ADD CONSTRAINT `HealthRecord_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bmi` ADD CONSTRAINT `Bmi_healthRecordId_fkey` FOREIGN KEY (`healthRecordId`) REFERENCES `HealthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodPressure` ADD CONSTRAINT `BloodPressure_healthRecordId_fkey` FOREIGN KEY (`healthRecordId`) REFERENCES `HealthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Heartbeat` ADD CONSTRAINT `Heartbeat_healthRecordId_fkey` FOREIGN KEY (`healthRecordId`) REFERENCES `HealthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cholesterol` ADD CONSTRAINT `Cholesterol_healthRecordId_fkey` FOREIGN KEY (`healthRecordId`) REFERENCES `HealthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Glucose` ADD CONSTRAINT `Glucose_healthRecordId_fkey` FOREIGN KEY (`healthRecordId`) REFERENCES `HealthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_conversation` ADD CONSTRAINT `_user_conversation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_conversation` ADD CONSTRAINT `_user_conversation_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
