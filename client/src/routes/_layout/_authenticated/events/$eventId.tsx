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
    FaCheck,
} from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../stores";

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
    const userData = useAuthStore((state) => state.userData);

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

    const handleLeaveEvent = async () => {
        console.log("Leaving ");
    };

    const hasUserAlreadyVotedToCandidate = (): {
        hasVoted: boolean;
        voted_candidate_id: null | number;
    } => {
        let indx = -1;
        if (
            joinedEvent?.vote_records.some((record, i) => {
                indx = i;
                return record.voter_id === userData?.user_id;
            })
        ) {
            return {
                hasVoted: true,
                voted_candidate_id: Number(
                    joinedEvent?.vote_records[indx].voted_candidate_id,
                ),
            };
        }
        return {
            hasVoted: false,
            voted_candidate_id: null,
        };
    };

    const handleVoteCandidate = async (voteCandidateId: number) => {
        if (!hasUserAlreadyVotedToCandidate().hasVoted) {
            try {
                const res = await api.post(
                    `/api/v1/events/${eventId}/candidate/${voteCandidateId}/vote`,
                );
                if (res.data.success) {
                    fetchSetJointedEvent();
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
    };

    const hasUserAlreadyVotedToOption = (): {
        poll_option_id: number | null;
        hasVoted: boolean;
    } => {
        let indx = -1;

        if (joinedEvent?.poll_options.length === 0) {
            return { poll_option_id: null, hasVoted: false };
        }

        if (
            joinedEvent?.vote_records.some((record, i) => {
                indx = i;
                return record.voter_id === userData?.user_id;
            })
        ) {
            return {
                hasVoted: true,
                poll_option_id: Number(
                    joinedEvent?.vote_records[indx].voted_option_id,
                ),
            };
        }

        return { poll_option_id: null, hasVoted: false };
    };

    const handleVoteOption = async (pollOptionId: number) => {
        if (!hasUserAlreadyVotedToOption().hasVoted) {
            try {
                const res = await api.post(
                    `/api/v1/events/${eventId}/option/${pollOptionId}/vote`,
                );
                if (res.data.success) {
                    fetchSetJointedEvent();
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
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
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                        <FaInfoCircle className="text-red-600 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Oops!</h1>
                    <p className="text-gray-600 text-lg">{resErr}</p>
                    <Button
                        onClick={() => navigate({ to: "/events" })}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg py-3"
                    >
                        Return to Events
                    </Button>
                </div>
            </div>
        );
    }

    const candidateVoteStatus = hasUserAlreadyVotedToCandidate();
    const pollVoteStatus = hasUserAlreadyVotedToOption();

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            {joinedEvent?.title}
                        </h1>
                        <div className="flex items-center gap-3 text-gray-600">
                            <span className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full">
                                <FaUsers className="text-blue-600" />
                                <span className="text-sm font-medium">
                                    {capitalize(
                                        joinedEvent?.creator.first_name ?? "",
                                    )}{" "}
                                    {capitalize(
                                        joinedEvent?.creator.last_name ?? "",
                                    )}
                                </span>
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={handleLeaveEvent}
                        className=" w-fit bg-red-500 border-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-sm transition-all"
                    >
                        <FaSignOutAlt className="text-lg" />
                        Leave Event
                    </Button>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Event Details Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FaInfoCircle className="text-blue-600 text-2xl" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Event Details
                                </h2>
                            </div>

                            {joinedEvent?.description && (
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    {joinedEvent.description}
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <FaCalendar className="text-gray-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Start Date
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {joinedEvent?.start_type ===
                                                "manual"
                                                ? "Manual Start"
                                                : format(
                                                    new Date(
                                                        joinedEvent?.start_at ??
                                                        new Date(),
                                                    ),
                                                    "PPp",
                                                )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <FaClock className="text-gray-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            End Date
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {format(
                                                new Date(
                                                    joinedEvent?.end_at ??
                                                    new Date(),
                                                ),
                                                "PPp",
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Voting/Poll Section */}
                        {joinedEvent?.type === "poll" ? (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FaPoll className="text-green-600 text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Poll Options
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {joinedEvent?.poll_options.map((option) => (
                                        <label
                                            key={option.poll_option_id}
                                            className={`flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer group
      ${pollVoteStatus.hasVoted ? "opacity-75 cursor-not-allowed" : "hover:border-blue-300"}
      ${pollVoteStatus.poll_option_id === option.poll_option_id
                                                    ? "border-blue-400 bg-blue-50"
                                                    : "border-gray-200"
                                                }`}
                                            onClick={() => {
                                                if (!pollVoteStatus.hasVoted) {
                                                    handleVoteOption(
                                                        option.poll_option_id,
                                                    );
                                                }
                                            }}
                                        >
                                            {" "}
                                            <div
                                                className={`flex items-center justify-center h-6 w-6 border-2 rounded-full transition-colors
        ${pollVoteStatus.poll_option_id === option.poll_option_id
                                                        ? "border-blue-500 bg-blue-500"
                                                        : "border-gray-300 group-hover:border-blue-400"
                                                    }`}
                                            >
                                                {" "}
                                                <input
                                                    type="radio"
                                                    name="poll"
                                                    checked={
                                                        pollVoteStatus.poll_option_id ===
                                                        option.poll_option_id
                                                    }
                                                    disabled={
                                                        pollVoteStatus.hasVoted
                                                    }
                                                    className="opacity-0 absolute"
                                                />
                                                {pollVoteStatus.poll_option_id ===
                                                    option.poll_option_id && (
                                                        <FaCheck className="text-white text-sm" />
                                                    )}{" "}
                                            </div>
                                            <span className="text-gray-700 text-lg">
                                                {option.option_text}
                                            </span>{" "}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : joinedEvent?.type === "vote" ? (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FaVoteYea className="text-purple-600 text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Vote Candidates
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {joinedEvent?.vote_candidates.map(
                                        (candidate) => (
                                            <div
                                                key={
                                                    candidate.vote_candidate_id
                                                }
                                                onClick={() =>
                                                    handleVoteCandidate(
                                                        candidate.vote_candidate_id,
                                                    )
                                                }
                                                className={`p-4 border rounded-xl cursor-pointer transition-all
                                                    ${candidateVoteStatus.hasVoted ? "opacity-75" : "hover:border-blue-400 hover:bg-blue-50"}
                                                    ${candidateVoteStatus.voted_candidate_id ===
                                                        candidate.vote_candidate_id
                                                        ? "border-blue-400 bg-blue-50"
                                                        : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`flex items-center justify-center h-6 w-6 rounded-full 
                                                        ${candidateVoteStatus.voted_candidate_id ===
                                                                candidate.vote_candidate_id
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-gray-100"
                                                            }`}
                                                    >
                                                        {candidateVoteStatus.voted_candidate_id ===
                                                            candidate.vote_candidate_id && (
                                                                <FaCheck className="text-sm" />
                                                            )}
                                                    </div>
                                                    <span className="text-gray-900 font-medium">
                                                        {
                                                            candidate.candidate_name
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Right Column - Participants */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-fit">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <FaUsers className="text-orange-600 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Participants
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-bold text-blue-600">
                                {joinedEvent?.event_participants.length ?? 0}
                            </span>
                            <span className="text-gray-600">
                                Total Participants
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
