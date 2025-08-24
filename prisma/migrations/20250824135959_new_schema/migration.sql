/*
  Warnings:

  - You are about to drop the column `emailVerificationCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `emailVerificationCode`,
    DROP COLUMN `emailVerificationExpires`,
    DROP COLUMN `isEmailVerified`;
