/*
  Warnings:

  - The primary key for the `ClientsOnDevelopers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientId` on the `ClientsOnDevelopers` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `oidcId` to the `ClientsOnDevelopers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientsOnDevelopers" DROP CONSTRAINT "ClientsOnDevelopers_clientId_fkey";

-- AlterTable
ALTER TABLE "ClientsOnDevelopers" DROP CONSTRAINT "ClientsOnDevelopers_pkey",
DROP COLUMN "clientId",
ADD COLUMN     "oidcId" TEXT NOT NULL,
ADD COLUMN     "oidcType" INTEGER NOT NULL DEFAULT 5,
ADD CONSTRAINT "ClientsOnDevelopers_pkey" PRIMARY KEY ("userId", "oidcId");

-- DropTable
DROP TABLE "Client";

-- AddForeignKey
ALTER TABLE "ClientsOnDevelopers" ADD CONSTRAINT "ClientsOnDevelopers_oidcId_oidcType_fkey" FOREIGN KEY ("oidcId", "oidcType") REFERENCES "Oidc"("id", "type") ON DELETE RESTRICT ON UPDATE CASCADE;
