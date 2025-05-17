-- CreateEnum
CREATE TYPE "EVENT_TYPE" AS ENUM ('POLL', 'VOTE');

-- CreateEnum
CREATE TYPE "START_TYPE" AS ENUM ('IMMEDIATE', 'MANUAL', 'TIME');

-- CreateEnum
CREATE TYPE "END_TYPE" AS ENUM ('MANUAL', 'TIME');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspended_till" TIMESTAMPTZ,
    "email_address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EVENT_TYPE" NOT NULL,
    "creator_id" TEXT NOT NULL,
    "start_type" "START_TYPE" NOT NULL,
    "start_at" TIMESTAMP(3),
    "end_type" "END_TYPE" NOT NULL,
    "end_at" TIMESTAMP(3),
    "multi_vote" BOOLEAN NOT NULL DEFAULT false,
    "anonymous_vote" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_event_candidate_options" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "candidate_name" TEXT NOT NULL,
    "candidate_email" TEXT,

    CONSTRAINT "vote_event_candidate_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_event_vote_options" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,

    CONSTRAINT "poll_event_vote_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteRecord" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "voted_candidate_option_id" INTEGER,
    "voted_poll_option_id" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "VoteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_address_key" ON "users"("email_address");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_event_candidate_options" ADD CONSTRAINT "vote_event_candidate_options_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_event_vote_options" ADD CONSTRAINT "poll_event_vote_options_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteRecord" ADD CONSTRAINT "VoteRecord_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteRecord" ADD CONSTRAINT "VoteRecord_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
