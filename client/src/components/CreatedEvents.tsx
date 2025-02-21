import { Link } from "@tanstack/react-router";
import Button from "./Button";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { Event } from "../types";
import { api } from "../utils";
import toast from "react-hot-toast";

function CreatedEvents() {
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);

    const fetchSetCreatedEvents = async () => {
        try {
            const res = await api.get("/api/v1/events/self");
            if (res.data.success) {
                setCreatedEvents(res.data.data);
            }
        } catch (_) {
            toast.error("failed to load created events");
        }
    };

    useEffect(() => {
        fetchSetCreatedEvents();
    }, []);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                    Created Events
                </h2>
                <Link to={"/events/create"}>
                    <Button className="hidden md:inline-flex px-6 py-3">
                        Create New Event
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdEvents.map((item) => (
                    <EventCard eventData={item} key={item.event_id} />
                ))}
            </div>
        </div>
    );
}

export default CreatedEvents;
