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
import { api, capitalize } from "../../../../utils";
import { Button, Loader } from "../../../../components";
import {
    FaCalendar,
    FaUsers,
    FaInfoCircle,
    FaSignOutAlt,
    FaClock,
    FaVoteYea,
    FaPoll,
} from "react-icons/fa";
import { format } from "date-fns";

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

    const handleLeaveEvent = async () => {
        // Implement leave event logic here
        console.log("Leave event");
        navigate({ to: "/events" });
    };

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
        <div className="min-h-screen w-full bg-gray-50 p-6 md:p-8 lg:p-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {joinedEvent?.title}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FaUsers className="text-blue-500" />
                            <span>
                                Created by{" "}
                                {capitalize(
                                    joinedEvent?.creator.first_name ?? "",
                                )}{" "}
                                {capitalize(
                                    joinedEvent?.creator.last_name ?? "",
                                )}
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={handleLeaveEvent}
                        className="bg-red-500 border-red-500 w-fit hover:bg-red-600 text-white flex items-center gap-2 px-6 py-2 "
                    >
                        <FaSignOutAlt /> Leave Event
                    </Button>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Event Info Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FaInfoCircle className="text-blue-500 text-xl" />
                                <h2 className="text-xl font-semibold">
                                    Event Details
                                </h2>
                            </div>

                            {joinedEvent?.description && (
                                <p className="text-gray-600 mb-6">
                                    {joinedEvent.description}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <FaCalendar className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Start Date
                                        </p>
                                        <p className="font-medium">
                                            {joinedEvent?.start_type ===
                                            "manual"
                                                ? "Manual Start"
                                                : format(
                                                      joinedEvent?.start_at
                                                          ? new Date(
                                                                joinedEvent?.start_at,
                                                            )
                                                          : new Date(),

                                                      "PPp",
                                                  )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            End Date
                                        </p>
                                        <p className="font-medium">
                                            {format(
                                                joinedEvent?.end_at
                                                    ? new Date(
                                                          joinedEvent?.end_at,
                                                      )
                                                    : new Date(),
                                                "PPp",
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Poll/Vote Section */}
                        {joinedEvent?.type === "poll" ? (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <FaPoll className="text-green-500 text-xl" />
                                    <h2 className="text-xl font-semibold">
                                        Poll Options
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {joinedEvent?.poll_options.map((option) => (
                                        <label
                                            key={option.option_id}
                                            className="flex items-center gap-3 p-4 border rounded-lg hover:border-blue-400 transition-all cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="poll"
                                                className="h-5 w-5 text-blue-500"
                                            />
                                            <span className="text-gray-700">
                                                {option.option_text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : joinedEvent?.type === "vote" ? (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <FaVoteYea className="text-purple-500 text-xl" />
                                    <h2 className="text-xl font-semibold">
                                        Vote Candidates
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {joinedEvent?.vote_candidates.map(
                                        (candidate) => (
                                            <label
                                                key={
                                                    candidate.vote_candidate_id
                                                }
                                                className="flex items-center gap-3 p-4 border rounded-lg hover:border-blue-400 transition-all cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="vote"
                                                    className="h-5 w-5 text-blue-500"
                                                    id={candidate.vote_candidate_id.toString()}
                                                />
                                                <span className="text-gray-700">
                                                    {candidate.candidate_name}
                                                </span>
                                            </label>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Right Column - Participants */}
                    <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
                        <div className="flex items-center gap-2 mb-6">
                            <FaUsers className="text-orange-500 text-xl" />
                            <h2 className="text-xl font-semibold">
                                Participants
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-blue-500">
                                {joinedEvent?.event_participants.length ?? 0}
                            </span>
                            <span className="text-gray-500">
                                Total Participants
                            </span>
                        </div>
                        <div className="space-y-3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
