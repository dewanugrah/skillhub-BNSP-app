/*
  Warnings:

  - You are about to drop the `kelas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pendaftaran` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `peserta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `Pendaftaran_kelasId_fkey`;

-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `Pendaftaran_pesertaId_fkey`;

-- DropTable
DROP TABLE `kelas`;

-- DropTable
DROP TABLE `pendaftaran`;

-- DropTable
DROP TABLE `peserta`;

-- CreateTable
CREATE TABLE `Participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Participant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `className` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `instructor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `participantId` INTEGER NOT NULL,
    `classId` INTEGER NOT NULL,
    `enrollmentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
