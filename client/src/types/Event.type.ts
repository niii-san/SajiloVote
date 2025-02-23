export interface Event {
    event_id: number;
    title: string;
    description: string;
    type: "vote" | "poll" | string;
    start_at: string | null;
    end_at: string;
    start_type: "immediate" | "manual" | "date";
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface EventParticipantType {
    id: number;
    user_id: number;
    event_id: number;
    created_at: string;
    updated_at: string;
}

export interface PollOptionsType {
    option_id: number;
    option_text: string;
}
export interface VoteCandidateType {
    vote_candidate_id: number;
    event_id: number;
    candidate_name: string;
    candidate_email: string | null;
}
export interface VoteRecordType {
    vote_record_id: number;
    event_id: number;
    vote_candidate_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}
