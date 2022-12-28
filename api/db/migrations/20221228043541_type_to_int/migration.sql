/*
  Warnings:

  - The primary key for the `Oidc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `type` on the `Oidc` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Oidc" DROP CONSTRAINT "Oidc_pkey",
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL,
ADD CONSTRAINT "Oidc_pkey" PRIMARY KEY ("id", "type");
