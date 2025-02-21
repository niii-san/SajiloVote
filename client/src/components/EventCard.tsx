import { Link } from "@tanstack/react-router";
import Button from "./Button";
import { Event } from "../types";

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

    const { status, color, timeText, icon } = getEventStatus(eventData);

    return (
        <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-200 ease-in-out overflow-hidden">
            {/* Status ribbon */}
            <div
                className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-sm font-semibold flex items-center gap-1.5 ${color}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    {icon}
                </svg>
                {status}
            </div>

            <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 pr-14 truncate">
                    {eventData.title}
                </h3>

                <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <div>
                            <span className="font-medium">{timeText}:</span>{" "}
                            {formatDate(eventData.start_at)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <div>
                            <span className="font-medium">Ends:</span>{" "}
                            {formatDate(eventData.end_at)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Link
                    to={`/events/${eventData.event_id}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-lg"
                >
                    <Button variant="outline">
                        View
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
