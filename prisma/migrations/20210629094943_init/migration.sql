-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User.guid_unique`(`guid`),
    UNIQUE INDEX `User.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `notificationTime` DATETIME(3) NOT NULL,
    `notificationText` VARCHAR(191) NOT NULL,
    `seen` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `taskState` INTEGER NOT NULL DEFAULT 1000,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Task.guid_unique`(`guid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
