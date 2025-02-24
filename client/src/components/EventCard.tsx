import { Link } from "@tanstack/react-router";
import Button from "./Button";
import { Event } from "../types";
import {
    FaPlay,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowRight,
    FaTrash,
} from "react-icons/fa";

export default function EventCard({ eventData }: { eventData: Event }) {
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
                icon: FaPlay,
            };
        } else if (startTime && currentTime < startTime) {
            return {
                status: "Upcoming",
                color: "bg-blue-100 text-blue-800",
                timeText: "Starts",
                icon: FaClock,
            };
        } else if (startTime && currentTime <= endTime) {
            return {
                status: "Ongoing",
                color: "bg-green-100 text-green-800",
                timeText: "Started",
                icon: FaCheckCircle,
            };
        } else {
            return {
                status: "Ended",
                color: "bg-red-100 text-red-800",
                timeText: "Started",
                icon: FaTimesCircle,
            };
        }
    }

    const {
        status,
        color,
        timeText,
        icon: StatusIcon,
    } = getEventStatus(eventData);

    return (
        <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-200 ease-in-out overflow-hidden">
            {/* Status ribbon */}
            <div
                className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-sm font-semibold flex items-center gap-1.5 ${color}`}
            >
                <StatusIcon className="w-4 h-4" />
                {status}
            </div>

            <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 pr-14 truncate">
                    {eventData.title}
                </h3>

                <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="w-5 h-5 flex-shrink-0 text-gray-400" />
                        <div>
                            <span className="font-medium">{timeText}:</span>{" "}
                            {formatDate(eventData.start_at)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaTimesCircle className="w-5 h-5 flex-shrink-0 text-gray-400" />
                        <div>
                            <span className="font-medium">Ends:</span>{" "}
                            {formatDate(eventData.end_at)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center gap-4">
                    <Link
                        to={`/events/${eventData.event_id}`}
                        className="focus:outline-none focus-visible:ring-2 w-full focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-lg"
                    >
                        <Button variant="outline" className="gap-2 ">
                            View
                            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                    <Button
                        className="w-fit px-6 py-3 bg-red-500 border-red-500 hover:bg-red-600 text-white gap-2"
                        onClick={() => {
                            /* Add delete handler */
                        }}
                    >
                        <FaTrash className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
