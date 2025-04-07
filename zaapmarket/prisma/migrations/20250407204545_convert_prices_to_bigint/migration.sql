/*
  Warnings:

  - You are about to alter the column `purchasePrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - You are about to alter the column `sellingPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "purchasePrice" SET DATA TYPE BIGINT,
ALTER COLUMN "sellingPrice" SET DATA TYPE BIGINT;
