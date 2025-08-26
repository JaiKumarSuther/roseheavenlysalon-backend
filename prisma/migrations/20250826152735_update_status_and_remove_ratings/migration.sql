/*
  Warnings:

  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_userId_fkey`;

-- AlterTable
ALTER TABLE `events` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE `ratings`;
