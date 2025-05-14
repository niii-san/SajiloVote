export interface EventModel {
    id: number;
    title: string;
    description: string;
    type: "VOTE" | "POLL";
    creator_id: number;
    start_type: "MANUAL" | "MANUAL" | "TIME";
    start_at: Date | null;
    end_type: "MANUAL" | "TIME";
    end_at: Date | null;
    multi_vote: boolean;
    anonymous_vote: boolean;
    created_at: Date;
    updated_at: Date;
}
