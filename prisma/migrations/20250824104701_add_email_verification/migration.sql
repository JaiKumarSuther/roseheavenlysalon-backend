-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerificationCode` INTEGER NULL DEFAULT 0,
    ADD COLUMN `emailVerificationExpires` DATETIME(3) NULL,
    ADD COLUMN `isEmailVerified` BOOLEAN NOT NULL DEFAULT false;
