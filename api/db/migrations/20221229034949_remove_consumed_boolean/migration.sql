/*
  Warnings:

  - You are about to drop the column `consumed` on the `Oidc` table. All the data in the column will be lost.
  - Made the column `payload` on table `Oidc` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Oidc" DROP COLUMN "consumed",
ALTER COLUMN "payload" SET NOT NULL;
