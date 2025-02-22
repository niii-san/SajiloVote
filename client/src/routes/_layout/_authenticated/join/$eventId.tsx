import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Event } from "../../../../types";
import { api, capitalize } from "../../../../utils";
import { Button, Loader } from "../../../../components";
import { FiClock, FiCalendar, FiUser, FiInfo } from "react-icons/fi";

export const Route = createFileRoute("/_layout/_authenticated/join/$eventId")({
    component: RouteComponent,
});

interface PreEventType extends Event {
    creator: {
        user_id: number;
        first_name: string;
        last_name: string;
    };
}

function RouteComponent() {
    const { eventId } = Route.useParams();
    const [err, setErr] = useState<null | string>(null);
    const [preEvent, setPreEvent] = useState<PreEventType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleJoin = async () => {
        console.log("joining..");
    };

    const fetchSetPreEvent = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/v1/events/pre/${eventId}`);
            setPreEvent(res.data?.data);
        } catch (error: any) {
            if (error.response.data.reason === "not_found") {
                setErr("Event not found");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSetPreEvent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (err) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-600">{err}</p>
                    <Button
                        onClick={() => window.history.back()}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700"
                    >
                        Go back
                    </Button>
                </div>
            </div>
        );
    }

    if (!preEvent) return null;

    const eventStatus = getEventStatus(preEvent);

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl flex-1 flex flex-col">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col">
                    {/* Event Header */}
                    <div className="p-6 bg-gradient-to-r from-primary to-primary/60 text-white space-y-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">
                                {preEvent.title}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${eventStatus.color}`}
                            >
                                {eventStatus.status === "Start"
                                    ? "Not started"
                                    : eventStatus.status}
                            </span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        <div className="grid md:grid-cols-2 gap-8 p-6 flex-1">
                            {/* Event Details */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg mt-1">
                                        <FiCalendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">
                                            Event Date/Time
                                        </h3>
                                        <p className="text-gray-900 font-medium">
                                            {formatDate(preEvent.start_at)} -{" "}
                                            {formatDate(preEvent.end_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg mt-1">
                                        <FiClock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">
                                            Event Type
                                        </h3>
                                        <p className="text-gray-900 font-medium capitalize">
                                            {preEvent.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg mt-1">
                                        <FiUser className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">
                                            Organizer
                                        </h3>
                                        <p className="text-gray-900 font-medium">
                                            {capitalize(
                                                preEvent.creator.first_name,
                                            )}{" "}
                                            {capitalize(
                                                preEvent.creator.last_name,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="md:border-l md:pl-8 md:border-gray-200">
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Ready to Join?
                                        </h2>
                                        <p className="text-gray-500 text-sm">
                                            Click below to participate in this
                                            event
                                        </p>
                                    </div>
                                    <Button onClick={handleJoin}>
                                        Join Event
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    {preEvent.description && (
                        <div className="px-6 pb-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-3">
                                    <FiInfo className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                            About the Event
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {preEvent.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Footer */}
                    <div className="border-t bg-gray-50 p-4 mt-auto">
                        <div className="flex items-center gap-3 text-sm">
                            <svg
                                className={`w-5 h-5 ${eventStatus.color}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {eventStatus.icon}
                            </svg>
                            <span className="font-medium">
                                {eventStatus.timeText}:{" "}
                                {formatDate(preEvent.start_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Keep the formatDate and getEventStatus functions the same
function formatDate(timestamp: string | null) {
    if (!timestamp) return "Manual";
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = date.getTime() - now;

    if (Math.abs(diff) < 86400000) {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getEventStatus(eventData: Event) {
    const currentTime = Date.now();
    const startTime = eventData.start_at
        ? new Date(eventData.start_at).getTime()
        : null;
    const endTime = new Date(eventData.end_at).getTime();

    if (eventData.start_type === "manual" && startTime === null) {
        return {
            status: "Start",
            color: "bg-purple-100 text-purple-800",
            timeText: "Start",
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
            ),
        };
    } else if (startTime && currentTime < startTime) {
        return {
            status: "Upcoming",
            color: "bg-blue-100 text-blue-800",
            timeText: "Starts",
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            ),
        };
    } else if (startTime && currentTime <= endTime) {
        return {
            status: "Ongoing",
            color: "bg-green-100 text-green-800",
            timeText: "Started",
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            ),
        };
    } else {
        return {
            status: "Ended",
            color: "bg-red-400 text-gray-100",
            timeText: "Started",
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            ),
        };
    }
}
