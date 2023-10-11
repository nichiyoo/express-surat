-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `telepon` VARCHAR(191) NOT NULL,
    `role` ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_nim_key`(`nim`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_telepon_key`(`telepon`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Formulir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe` ENUM('Praktek', 'Skripsi', 'Penelitian') NOT NULL,
    `instansi` VARCHAR(191) NOT NULL,
    `proposal` VARCHAR(191) NULL,
    `judul` VARCHAR(191) NULL,
    `subjek` VARCHAR(191) NULL,
    `tujuan` VARCHAR(191) NULL,
    `status` ENUM('Diterima', 'Ditolak', 'Menunggu') NOT NULL DEFAULT 'Menunggu',
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `surat` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Formulir` ADD CONSTRAINT `Formulir_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
