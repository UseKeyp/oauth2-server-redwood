/*
  Warnings:

  - Changed the type of `accessLevel` on the `ClientsOnDevelopers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ClientAccessLevel" AS ENUM ('OWNER', 'EDITOR');

-- AlterTable
ALTER TABLE "ClientsOnDevelopers" DROP COLUMN "accessLevel",
ADD COLUMN     "accessLevel" "ClientAccessLevel" NOT NULL;

-- AlterTable
ALTER TABLE "Oidc" ADD COLUMN     "disabled" BOOLEAN;

-- DropEnum
DROP TYPE "ClientPermissions";
