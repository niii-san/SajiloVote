-- CreateEnum
CREATE TYPE "EVENT_TYPE" AS ENUM ('POLL', 'VOTE');

-- CreateEnum
CREATE TYPE "START_TYPE" AS ENUM ('IMMEDIATE', 'MANUAL', 'TIME');

-- CreateEnum
CREATE TYPE "END_TYPE" AS ENUM ('MANUAL', 'TIME');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT,
    "created_at" TIMESTAMPTZ(5) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EVENT_TYPE" NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "start_type" "START_TYPE" NOT NULL,
    "start_at" TIMESTAMP(3),
    "end_type" "END_TYPE" NOT NULL,
    "end_at" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_address_key" ON "users"("email_address");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
