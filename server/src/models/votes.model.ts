export interface VoteEventCandidateOptionsModel {
    id: number;
    event_id: number;
    candidate_name: string;
    candidate_email: string | null;
}

export interface PollEventVoteOptions {
    id: number;
    event_id: number;
    option_text: string;
}

export interface VoteRecordModel {
    id: number;
    event_id: number;
    voter_id: number;
    voted_candidate_option_id: number | null;
    voted_poll_option_id: number | null;
    created_at: Date;
    updated_at: Date;
}
