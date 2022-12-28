/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Oidc` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Oidc_uid_key" ON "Oidc"("uid");
