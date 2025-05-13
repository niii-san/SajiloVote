-- CreateTable
CREATE TABLE "poll_event_vote_options" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "option_text" TEXT NOT NULL,

    CONSTRAINT "poll_event_vote_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "poll_event_vote_options" ADD CONSTRAINT "poll_event_vote_options_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
