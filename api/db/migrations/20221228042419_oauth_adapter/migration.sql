/*
  Warnings:

  - You are about to drop the column `mintCredits` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClientPermissions" AS ENUM ('OWNER', 'EDITOR');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mintCredits";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "redirectUrls" TEXT NOT NULL,
    "clientSecret" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "paused" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientsOnDevelopers" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "accessLevel" "ClientPermissions" NOT NULL,

    CONSTRAINT "ClientsOnDevelopers_pkey" PRIMARY KEY ("userId","clientId")
);

-- CreateTable
CREATE TABLE "Oidc" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "consumedAt" TIMESTAMP(3),
    "grantId" TEXT,
    "userCode" TEXT,
    "uid" TEXT,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "payload" JSONB,

    CONSTRAINT "Oidc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientsOnDevelopers" ADD CONSTRAINT "ClientsOnDevelopers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsOnDevelopers" ADD CONSTRAINT "ClientsOnDevelopers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
