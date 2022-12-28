/*
  Warnings:

  - The primary key for the `Oidc` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Oidc" DROP CONSTRAINT "Oidc_pkey",
ADD CONSTRAINT "Oidc_pkey" PRIMARY KEY ("id", "type");
