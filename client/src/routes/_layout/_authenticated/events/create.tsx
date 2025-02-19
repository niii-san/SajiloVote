import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button, Input } from "../../../../components";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useState } from "react";
import moment from "moment";
import {
    FiPlus,
    FiX,
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiInfo,
} from "react-icons/fi";
import { api, capitalize } from "../../../../utils";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_layout/_authenticated/events/create")({
    component: RouteComponent,
});

// TODO: remove react hook form
function RouteComponent() {
    const navigate = useNavigate();
    type Inputs = {
        eventTitle: string;
        eventDescription: string;
        eventType: "poll" | "vote";
        pollOptions: Array<{ option: string }>;
        voteCandidates: Array<{ name: string; email?: string }>;
        startTime: "immediate" | "manual" | "custom" | Date;
        eventStartTime: string;
        eventEndTime: string;
        voteOrPollMethod: string;
    };

    const {
        register,
        handleSubmit,
        resetField,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
        trigger,
        clearErrors,
    } = useForm<Inputs>({
        defaultValues: {
            eventType: "poll",
            pollOptions: [{ option: "" }],
            voteCandidates: [{ name: "" }],
            startTime: "immediate",
            eventStartTime: moment().toISOString(),
            eventEndTime: moment().add(2, "hours").toISOString(),
        },
        mode: "onChange",
    });

    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const eventType = watch("eventType");
    const startTime = watch("startTime");
    const eventStartTime = watch("eventStartTime");
    const eventEndTime = watch("eventEndTime");

    const {
        fields: pollFields,
        append: appendPoll,
        remove: removePoll,
    } = useFieldArray({
        control,
        name: "pollOptions",
        rules: {
            validate: (value) =>
                eventType !== "poll" ||
                (value.length > 0 &&
                    value.every((item) => item.option.trim() !== "")) ||
                "At least one valid option is required",
        },
    });

    const {
        fields: candidateFields,
        append: appendCandidate,
        remove: removeCandidate,
    } = useFieldArray({
        control,
        name: "voteCandidates",
        rules: {
            validate: (value) =>
                eventType !== "vote" ||
                (value.length > 0 &&
                    value.every((c) => c.name.trim() !== "")) ||
                "At least one valid candidate is required",
        },
    });

    const [resErr, setResErr] = useState<null | string>(null);

    const isValidDate = (currentDate: moment.Moment) => {
        const today = moment().startOf("day"); // Start of today (00:00)

        return currentDate.isSameOrAfter(today, "day"); // Allows today
    };

    const handleAddPoll = () => {
        appendPoll({ option: "" }, { shouldFocus: true });
        clearErrors("pollOptions");
    };

    const handleAddCandidate = () => {
        appendCandidate({ name: "", email: "" }, { shouldFocus: true });
        clearErrors("voteCandidates");
    };

    const onFormSubmit: SubmitHandler<Inputs> = async (data) => {
        let payload;
        const pre_payload = {
            title: data.eventTitle,
            description: data?.eventDescription ?? "",
            type: data.eventType,
            start_at:
                data.startTime === "immediate"
                    ? "immediate"
                    : data.startTime === "manual"
                        ? "manual"
                        : data.eventStartTime,
            end_at: data.eventEndTime,
        };
        if (eventType === "poll") {
            payload = {
                ...pre_payload,
                poll_options: data.pollOptions.map((item) => ({
                    option_text: item.option,
                })),
            };
        } else {
            payload = {
                ...pre_payload,
                vote_candidates: data.voteCandidates.map((item) => ({
                    candidate_name: item.name,
                    candidate_email:
                        (item.email ?? "").trim().length === 0
                            ? null
                            : item.email,
                })),
            };
        }

        try {
            const res = await api.post("/api/v1/events", payload);
            if (res.data?.success) {
                toast.success("Event created");
            }
            navigate({ to: "/events" });
        } catch (error: any) {
            setResErr(error?.response.data?.message);
            toast.error("Failed to create event");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl text-center font-bold mb-8 text-gray-800 dark:text-white">
                Create
                <span className="text-primary mx-1">
                    {capitalize(eventType)}
                </span>
                Event
            </h1>
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-8 [&_input]:transition-all bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
            >
                {/* Event Type Tabs */}
                <div className="space-y-2">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Event Type
                    </span>
                    <div className="flex gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
                        {["poll", "vote"].map((type) => (
                            <label
                                key={type}
                                className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2
                                    ${eventType === type
                                        ? "bg-primary text-white shadow-md"
                                        : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    {...register("eventType", {})}
                                    value={type}
                                    className="hidden"
                                />
                                {eventType === type && (
                                    <FiCheck className="w-5 h-5" />
                                )}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Event Title */}
                <div className="space-y-2">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Event Title
                    </span>
                    <Input
                        placeholder="Enter event title"
                        {...register("eventTitle", {
                            required: "Event title is required",
                        })}
                        className={`w-full text-lg ${errors.eventTitle ? "border-red-500" : ""}`}
                    />
                    {errors.eventTitle && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <FiInfo className="w-4 h-4" />
                            {errors.eventTitle.message}
                        </p>
                    )}
                </div>

                {/* Event Description */}
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (descriptionOpen) {
                                resetField("eventDescription");
                                setDescriptionOpen(false);
                            } else {
                                setDescriptionOpen(true);
                            }
                        }}
                        className="flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-medium"
                    >
                        {descriptionOpen ? <FiChevronUp /> : <FiChevronDown />}
                        {descriptionOpen ? "Hide" : "Add"} Description
                    </button>
                    {descriptionOpen && (
                        <textarea
                            {...register("eventDescription")}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all
                                      bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[120px]"
                            placeholder="Describe your event..."
                        />
                    )}
                </div>

                {/* Poll Options */}
                {eventType === "poll" && (
                    <div className="space-y-4">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Poll Options
                        </span>
                        <div className="grid gap-3">
                            {pollFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex gap-2 group"
                                >
                                    <div className="flex-1 relative">
                                        <Input
                                            {...register(
                                                `pollOptions.${index}.option`,
                                                {
                                                    required:
                                                        "Option cannot be empty",
                                                    validate: (value) =>
                                                        value.trim() !== "" ||
                                                        "Option cannot be empty",
                                                },
                                            )}
                                            placeholder={`Option ${index + 1}`}
                                            className={`pl-10 ${errors.pollOptions?.[index]?.option ? "border-red-500" : ""}`}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                                            {index + 1}.
                                        </span>
                                    </div>
                                    {pollFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                removePoll(index);
                                                trigger("pollOptions");
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddPoll}
                            className="mt-2 flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-medium"
                        >
                            <FiPlus className="w-5 h-5" />
                            Add Option
                        </button>
                        {errors.pollOptions?.message && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <FiInfo className="w-4 h-4" />
                                {errors.pollOptions.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Vote Candidates */}
                {eventType === "vote" && (
                    <div className="space-y-4">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Candidates
                        </span>
                        <div className="grid gap-4">
                            {candidateFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                                >
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <Input
                                                {...register(
                                                    `voteCandidates.${index}.name`,
                                                    {
                                                        required:
                                                            "Name is required",
                                                        validate: (value) =>
                                                            value.trim() !==
                                                            "" ||
                                                            "Name cannot be empty",
                                                    },
                                                )}
                                                placeholder={`Candidate ${index + 1} name`}
                                                className={`pl-10 ${errors.voteCandidates?.[index]?.name ? "border-red-500" : ""}`}
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                                                {index + 1}.
                                            </span>
                                        </div>
                                        {candidateFields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    removeCandidate(index);
                                                    trigger("voteCandidates");
                                                }}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                            >
                                                <FiX className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            {...register(
                                                `voteCandidates.${index}.email`,
                                                {
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message:
                                                            "Invalid email address",
                                                    },
                                                },
                                            )}
                                            placeholder={`Candidate ${index + 1} email (optional)`}
                                            type="email"
                                            className="pl-10"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                                            @
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddCandidate}
                            className="mt-2 flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-medium"
                        >
                            <FiPlus className="w-5 h-5" />
                            Add Candidate
                        </button>
                        {errors.voteCandidates?.message && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <FiInfo className="w-4 h-4" />
                                {errors.voteCandidates.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Event Timing */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Event Start Time
                        </span>
                        <div className="grid gap-3 border rounded-lg p-4 dark:border-gray-600">
                            {[
                                { value: "immediate", label: "Start Immediately" },
                                { value: "manual", label: "Start Manually" },
                                {
                                    value: "custom",
                                    label: "Custom Date & Time",
                                },
                            ].map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register("startTime")}
                                            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                                        />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {startTime === "custom" && (
                            <div className="border rounded-lg p-4 mt-2 dark:border-gray-600">
                                <Datetime
                                    value={moment(eventStartTime)}
                                    onChange={(date) => {
                                        if (moment.isMoment(date)) {
                                            setValue(
                                                "eventStartTime",
                                                date.toISOString(),
                                            );
                                            trigger("eventEndTime");
                                        }
                                    }}
                                    isValidDate={isValidDate}
                                    inputProps={{
                                        className:
                                            "w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer",
                                        placeholder: "Select start date & time",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            End Time
                        </span>
                        <div className="border rounded-lg p-4 dark:border-gray-600">
                            <Datetime
                                value={moment(eventEndTime)}
                                onChange={(date) => {
                                    if (moment.isMoment(date)) {
                                        setValue(
                                            "eventEndTime",
                                            date.toISOString(),
                                        );
                                    }
                                }}
                                isValidDate={isValidDate}
                                inputProps={{
                                    className:
                                        "w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer",
                                    placeholder: "Select end date & time",
                                }}
                            />
                        </div>
                    </div>
                </div>
                {resErr && <p className="text-danger">{resErr}</p>}

                <Button
                    type="submit"
                    className="w-full py-3 font-medium text-lg mt-8"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="animate-pulse">Creating...</span>
                    ) : (
                        "Create Event"
                    )}
                </Button>
            </form>
        </div>
    );
}
