/*
  Warnings:

  - You are about to drop the column `esiId` on the `Alliance` table. All the data in the column will be lost.
  - You are about to drop the column `esiId` on the `Corporation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Alliance_esiId_key";

-- DropIndex
DROP INDEX "Corporation_esiId_key";

-- AlterTable
ALTER TABLE "Alliance" DROP COLUMN "esiId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Alliance_id_seq";

-- AlterTable
ALTER TABLE "Corporation" DROP COLUMN "esiId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Corporation_id_seq";
