-- CreateTable
CREATE TABLE `Peserta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Peserta_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaKelas` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `instruktur` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesertaId` INTEGER NOT NULL,
    `kelasId` INTEGER NOT NULL,
    `tanggalDaftar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_pesertaId_fkey` FOREIGN KEY (`pesertaId`) REFERENCES `Peserta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
