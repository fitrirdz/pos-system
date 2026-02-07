/*
  Warnings:

  - Added the required column `discountTotal` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `discountTotal` INTEGER NOT NULL,
    ADD COLUMN `subtotal` INTEGER NOT NULL;
