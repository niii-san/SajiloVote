import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores";
import { Button, Loader } from "../../components";
import { capitalize } from "../../utils";
import { FiCheck, FiStar, FiAward, FiUsers, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/_layout/")({
    component: RouteComponent,
});

const features = [
    {
        icon: FiCheck,
        title: "Instant Voting",
        description: "Real-time results and live updates",
    },
    {
        icon: FiStar,
        title: "Featured Contests",
        description:
            "Participate in high-profile competitions with amazing prizes",
    },
    {
        icon: FiUsers,
        title: "Community Driven",
        description:
            "Join thousands of active users in fair, transparent voting",
    },
];

function RouteComponent() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();
    const userData = useAuthStore((state) => state.userData);
    const [joinVal, setJoinVal] = useState<string>("");

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-primary/10 to-background">
                {/* Hero Section */}
                <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold text-dark_text mb-6"
                        >
                            Decide Who{" "}
                            <span className="text-primary">Wins</span>
                        </motion.h1>
                        <p className="text-xl text-dark_text/90 mb-8 max-w-3xl mx-auto">
                            Shape outcomes through community-powered decisions
                            in real-time
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={() => navigate({ to: "/signup" })}
                                className="px-8 py-4 text-lg bg-secondary hover:bg-secondary/90 border-secondary text-dark_text
                                           shadow-md hover:shadow-lg transition-all"
                            >
                                Get Started
                            </Button>
                            <Button
                                onClick={() => navigate({ to: "/login" })}
                                className="px-8 py-4 text-lg bg-primary hover:bg-primary/90 text-white
                                           shadow-md hover:shadow-lg transition-all"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-24 grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all
                                         border-2 border-secondary/30"
                            >
                                <feature.icon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="text-2xl font-semibold mb-2 text-dark_text">
                                    {feature.title}
                                </h3>
                                <p className="text-dark_text/80 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-24 text-center bg-secondary/20 rounded-2xl p-12 shadow-lg backdrop-blur-sm"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-dark_text">
                            Ready to Make Impact?
                        </h2>
                        <p className="text-dark_text/80 mb-8 max-w-2xl mx-auto">
                            Join our growing community of decision-makers
                            shaping competitions worldwide
                        </p>
                        <Button
                            onClick={() => navigate({ to: "/signup" })}
                            className="px-8 py-4 text-lg bg-primary hover:bg-primary/90 text-white
                                       shadow-md hover:shadow-lg transition-all"
                        >
                            Start Voting Now
                        </Button>
                    </motion.div>
                </section>
            </div>
        );
    }

    if (!userData) {
        return <Loader />;
    }

    // Logged In View
    return (
        <div className="min-h-screen w-full bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-lg mb-12 border-2 border-secondary/20"
                >
                    <h1 className="text-4xl font-bold mb-2 text-dark_text">
                        Welcome Back,{" "}
                        {capitalize(userData.first_name ?? "Voter")}! 👋
                    </h1>
                    <p className="text-dark_text/80 text-xl">Ready to vote?</p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-primary/90 w-full min-h-32 rounded-xl shadow-lg mb-8 mt-20 flex items-center py-6
                              backdrop-blur-sm"
                >
                    <div className="w-full">
                        <h1 className="text-white mx-auto w-fit text-2xl font-bold mb-4 text-center">
                            Join an Event
                            <span className="block text-sm font-normal mt-1 opacity-90">
                                Enter your event code below
                            </span>
                        </h1>

                        <div className="w-[90%] md:w-[70%] lg:w-[60%] mx-auto flex group relative">
                            <input
                                type="text"
                                value={joinVal}
                                onChange={(e) => setJoinVal(e.target.value)}
                                placeholder="Event code (e.g. 123)"
                                className="w-full border-2 border-primary/50 bg-white/95 focus:bg-white
                                       text-dark_text px-12 py-3 text-lg focus:outline-none placeholder-gray-500
                                       transition-all duration-200 h-[48px] rounded-l-lg shadow-sm
                                       focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                            />
                            <button
                                className="border-2 border-primary/50 px-6 md:px-8 bg-white/95 text-primary
                                       font-semibold h-[48px] rounded-r-lg flex items-center justify-center gap-2 transition-all duration-200
                                       shadow-sm hover:shadow-md hover:border-primary/70"
                                onClick={() => {
                                    if (joinVal.length > 0) {
                                        navigate({ to: `/join/${joinVal}` });
                                    }
                                }}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-8 mt-28">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white text-black p-8 rounded-2xl shadow-lg border-2"
                    >
                        <FiAward className="w-12 h-12 mb-6 text-primary" />
                        <h2 className="text-2xl font-bold mb-4">
                            Explore Events
                        </h2>
                        <p className="mb-6 opacity-90">
                            Discover trending competitions and cast your votes
                        </p>
                        <Button onClick={() => navigate({ to: "/events" })}>
                            Browse Events
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-secondary/30"
                    >
                        <FiPlus className="w-12 h-12 mb-6 text-primary" />
                        <h2 className="text-2xl font-bold mb-4 text-dark_text">
                            Create Event
                        </h2>
                        <p className="mb-6 text-dark_text/80">
                            Create your own event
                        </p>
                        <Button
                            onClick={() => navigate({ to: "/events/create" })}
                            className="bg-primary hover:bg-primary/90 text-white
                                       shadow-md hover:shadow-lg"
                        >
                            Start Creating
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
