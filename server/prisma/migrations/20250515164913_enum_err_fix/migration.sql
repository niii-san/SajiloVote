/*
  Warnings:

  - The values [MANUL] on the enum `END_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "END_TYPE_new" AS ENUM ('MANUAL', 'TIME');
ALTER TABLE "events" ALTER COLUMN "end_type" TYPE "END_TYPE_new" USING ("end_type"::text::"END_TYPE_new");
ALTER TYPE "END_TYPE" RENAME TO "END_TYPE_old";
ALTER TYPE "END_TYPE_new" RENAME TO "END_TYPE";
DROP TYPE "END_TYPE_old";
COMMIT;
