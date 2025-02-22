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
