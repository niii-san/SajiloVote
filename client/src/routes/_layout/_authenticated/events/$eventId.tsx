import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
    Event,
    EventParticipantType,
    VoteCandidateType,
    VoteRecordType,
    PollOptionsType,
    User,
} from "../../../../types";
import { api } from "../../../../utils";
import { Button, Loader } from "../../../../components";

export const Route = createFileRoute("/_layout/_authenticated/events/$eventId")(
    {
        component: RouteComponent,
    },
);

interface JoinedEventType extends Event {
    event_participants: EventParticipantType[];
    poll_options: PollOptionsType[];
    vote_candidates: VoteCandidateType[];
    vote_records: VoteRecordType[];
    creator: User;
}

function RouteComponent() {
    const { eventId } = Route.useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [joinedEvent, setJoinedEvent] = useState<JoinedEventType | null>(
        null,
    );
    const [resErr, setResErr] = useState<string | null>(null);

    const fetchSetJointedEvent = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/v1/events/${eventId}`);
            if (res.data.success) {
                setJoinedEvent(res.data.data);
            }
        } catch (error: any) {
            if (error.response.data.reason === "not_allowed") {
                navigate({ to: `/join/${eventId}` });
            } else {
                setResErr(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSetJointedEvent();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (resErr) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-600">{resErr}</p>
                    <Button
                        onClick={() => navigate({ to: "/events" })}
                        className="w-full mt-4 bg-red-600 border-red-600 hover:bg-red-700"
                    >
                        Go back
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div>
                <h1>creator</h1>
                <span>{joinedEvent?.creator}</span>
            </div>
            <h1>{joinedEvent?.title}</h1>
        </div>
    );
}
