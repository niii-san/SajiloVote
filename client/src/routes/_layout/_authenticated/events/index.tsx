import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
    Button,
    CreatedEvents,
    ParticipatedEvents,
} from "../../../../components";
import { useState } from "react";

export const Route = createFileRoute("/_layout/_authenticated/events/")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [joinErr, _] = useState<null | string>(null);
    const [joinVal, setJoinVal] = useState<string>("");
    return (
        <div className="min-h-screen w-full bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Section */}
                <div className="bg-primary w-full min-h-32 rounded-xl shadow-lg mb-8 flex items-center py-6">
                    <div className="w-full">
                        <h1 className="text-white mx-auto w-fit text-2xl font-bold mb-4 text-center">
                            Join an Event
                            <span className="block text-sm font-normal mt-1 opacity-90">
                                Enter the event code
                            </span>
                        </h1>

                        <div className="w-[90%] md:w-[70%] lg:w-[60%] mx-auto flex group relative">
                            <input
                                type="text"
                                value={joinVal}
                                onChange={(e) => setJoinVal(e.target.value)}
                                placeholder="Event code (e.g. 123)"
                                className="w-full border-y-2 border-l-2 border-primary bg-white/95 focus:bg-white 
                text-gray-900 px-12 py-3 text-lg focus:outline-none placeholder-gray-500 
                transition-all duration-200 h-[48px] rounded-l-lg shadow-sm
                focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                            />
                            {/* Input Icon */}

                            <button
                                className="border-y-2 border-r-2 px-6 md:px-8 border-primary bg-white/95 text-primary
                font-semibold h-[48px] rounded-r-lg hover:bg-gray-50
                flex items-center justify-center gap-2 transition-all duration-200
                shadow-sm hover:shadow-md "
                                onClick={() =>
                                    navigate({ to: `/join/${joinVal}` })
                                }
                            >
                                Join
                            </button>
                        </div>

                        {joinErr && (
                            <div className="text-center mt-1 h-3">
                                <span className="text-sm text-red-300">
                                    adjf
                                </span>
                            </div>
                        )}
                    </div>
                </div>{" "}
                <div className="space-y-12">
                    <CreatedEvents />
                    <ParticipatedEvents />
                </div>
                <Link to={"/events/create"}>
                    <Button className="fixed md:hidden bottom-8 right-8 w-14 h-14 rounded-full shadow-lg">
                        <span className="text-2xl">+</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
