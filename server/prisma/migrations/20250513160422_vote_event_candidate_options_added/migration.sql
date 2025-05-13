-- AlterTable
ALTER TABLE "events" ADD COLUMN     "anonymous_vote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "multi_vote" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "vote_event_candidate_options" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "candidate_name" TEXT NOT NULL,
    "candidate_email" TEXT,

    CONSTRAINT "vote_event_candidate_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vote_event_candidate_options" ADD CONSTRAINT "vote_event_candidate_options_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
