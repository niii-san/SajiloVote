import { useEffect, useState } from "react";
import {
    FaPlay,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaUserCircle,
} from "react-icons/fa";
import { EventParticipantType, Event, User } from "../types";
import { api, capitalize } from "../utils";

interface EventWithCreator extends Event {
    creator: User;
}

interface ParticiaptedEvent extends EventParticipantType {
    event: EventWithCreator;
}

function ParticipatedEvents() {
    const [participatedEvents, setParticipatedEvents] = useState<
        ParticiaptedEvent[]
    >([]);

    const fetchSetParticipatedEvents = async () => {
        try {
            const res = await api.get("/api/v1/events/participated");
            if (res.data.success) {
                setParticipatedEvents(res.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSetParticipatedEvents();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    const getEventStatus = (eventData: Event) => {
        const currentTime = Date.now();
        const startTime = eventData.start_at
            ? new Date(eventData.start_at).getTime()
            : null;
        const endTime = new Date(eventData.end_at).getTime();

        if (eventData.start_type === "manual" && startTime === null) {
            return {
                status: "Start",
                color: "bg-purple-100 text-purple-800",
                icon: FaPlay,
            };
        } else if (startTime && currentTime < startTime) {
            return {
                status: "Upcoming",
                color: "bg-blue-100 text-blue-800",
                icon: FaClock,
            };
        } else if (startTime && currentTime <= endTime) {
            return {
                status: "Ongoing",
                color: "bg-green-100 text-green-800",
                icon: FaCheckCircle,
            };
        } else {
            return {
                status: "Ended",
                color: "bg-red-100 text-red-800",
                icon: FaTimesCircle,
            };
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Participated Events
                <span className="text-blue-600 text-lg">
                    ({participatedEvents.length})
                </span>
            </h2>

            {participatedEvents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">
                        No events participated yet
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participatedEvents.map((item) => {
                        const status = getEventStatus(item.event);
                        return (
                            <div
                                key={item.event_id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {item.event.title}
                                    </h3>
                                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                                        {item.event.type}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                                    >
                                        <status.icon className="w-4 h-4 mr-1" />
                                        {status.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FaClock className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {formatDate(
                                                item.event.start_at ?? "",
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaTimesCircle className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {formatDate(item.event.end_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                                    <FaUserCircle className="w-6 h-6 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        Created by{" "}
                                        {capitalize(
                                            item.event.creator.first_name ?? "",
                                        )}{" "}
                                        {capitalize(
                                            item.event.creator.last_name ?? "",
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ParticipatedEvents;
