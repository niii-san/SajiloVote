import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button, Input, Label } from "../../../../components";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useState } from "react";
import moment from "moment";
import { FiPlus, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

export const Route = createFileRoute("/_layout/_authenticated/events/create")({
    component: RouteComponent,
});

function RouteComponent() {
    type Inputs = {
        eventTitle: string;
        eventDescription: string;
        eventType: "poll" | "vote";
        pollOptions: Array<{ option: string }>;
        voteCandidates: Array<{ name: string; email?: string }>;
        startNow: boolean;
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
            startNow: true,
            eventStartTime: moment().toISOString(),
            eventEndTime: moment().add(2, "hours").toISOString(),
        },
        mode: "onChange",
    });

    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const eventType = watch("eventType");
    const startNow = watch("startNow");
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

    const isValidDate = (currentDate: moment.Moment, isEndDate = false) => {
        const now = moment();
        const comparisonDate = startNow ? now : moment(eventStartTime);
        return isEndDate
            ? currentDate.isSameOrAfter(comparisonDate, "minute")
            : currentDate.isSameOrAfter(now, "minute");
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
            start_at: data.startNow ? "now" : data.eventStartTime,
            end_at: data.eventEndTime,
        };
        if (eventType === "poll") {
            payload = { ...pre_payload, poll_options: data.pollOptions };
        } else {
            payload = { ...pre_payload, vote_candidates: data.voteCandidates };
        }

        console.log(payload);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create Event</h1>
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-6 [&_input]:transition-all"
            >
                {/* Event Type Tabs */}
                <div>
                    <Label className="block mb-3">Event Type</Label>
                    <div className="flex gap-2 border-2 border-primary rounded-xl p-1">
                        {["poll", "vote"].map((type) => (
                            <label
                                key={type}
                                className={`flex-1 text-center p-2 rounded-lg cursor-pointer transition-colors ${eventType === type
                                        ? "bg-primary text-white"
                                        : "hover:bg-primary/10"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    {...register("eventType", {})}
                                    value={type}
                                    className="hidden"
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Event Title */}
                <div>
                    <span className="block mb-3">Event Title</span>
                    <Input
                        placeholder="Enter event title"
                        {...register("eventTitle", {
                            required: "Event title is required",
                        })}
                        className={`w-full ${errors.eventTitle ? "border-red-500" : ""
                            }`}
                    />
                    {errors.eventTitle && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.eventTitle.message}
                        </p>
                    )}
                </div>

                {/* Event Description */}
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            if (descriptionOpen) {
                                resetField("eventDescription");
                                setDescriptionOpen(false);
                            } else {
                                setDescriptionOpen(true);
                            }
                            setDescriptionOpen(!descriptionOpen);
                        }}
                        className="flex items-center gap-2 text-primary hover:text-primary/90 mb-3"
                    >
                        {descriptionOpen ? <FiChevronUp /> : <FiChevronDown />}
                        {descriptionOpen ? "Hide" : "Add"} Description
                    </button>
                    {descriptionOpen && (
                        <textarea
                            {...register("eventDescription")}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            rows={4}
                            placeholder="Describe your event..."
                        />
                    )}
                </div>

                {/* Poll Options */}
                {eventType === "poll" && (
                    <div>
                        <span className="block mb-3">Poll Options</span>
                        <div className="space-y-3">
                            {pollFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <div className="flex-1">
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
                                            className={
                                                errors.pollOptions?.[index]
                                                    ?.option
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.pollOptions?.[index]
                                            ?.option && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {
                                                        errors.pollOptions[index]
                                                            ?.option?.message
                                                    }
                                                </p>
                                            )}
                                    </div>
                                    {pollFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                removePoll(index);
                                                trigger("pollOptions");
                                            }}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
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
                            className="mt-3 flex items-center gap-2 text-primary hover:text-primary/90"
                        >
                            <FiPlus />
                            Add Option
                        </button>
                        {errors.pollOptions?.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pollOptions.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Vote Candidates */}
                {eventType === "vote" && (
                    <div>
                        <span className="block mb-3">Candidates</span>
                        <div className="space-y-4">
                            {candidateFields.map((field, index) => (
                                <div key={field.id} className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
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
                                                placeholder={`Candidate ${index + 1
                                                    } name`}
                                                className={
                                                    errors.voteCandidates?.[
                                                        index
                                                    ]?.name
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.voteCandidates?.[index]
                                                ?.name && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {
                                                            errors.voteCandidates[
                                                                index
                                                            ]?.name?.message
                                                        }
                                                    </p>
                                                )}
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
                                    <div>
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
                                            placeholder={`Candidate ${index + 1
                                                } email (optional)`}
                                            type="email"
                                        />
                                        {errors.voteCandidates?.[index]
                                            ?.email && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {
                                                        errors.voteCandidates[index]
                                                            ?.email?.message
                                                    }
                                                </p>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddCandidate}
                            className="mt-3 flex items-center gap-2 text-primary hover:text-primary/90"
                        >
                            <FiPlus />
                            Add Candidate
                        </button>
                        {errors.voteCandidates?.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.voteCandidates.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Event Timing */}
                <div className="space-y-4">
                    <div>
                        <Label className="block mb-3">Start Time</Label>
                        <label className="flex items-center gap-3 mb-4">
                            <input
                                type="checkbox"
                                {...register("startNow")}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                            />
                            <span>Start event immediately</span>
                        </label>
                        {!startNow && (
                            <div className="border rounded-lg p-3">
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
                                    isValidDate={(current) =>
                                        isValidDate(current)
                                    }
                                    inputProps={{
                                        className:
                                            "w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/50",
                                        placeholder: "Select start date & time",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <span className="block mb-3">End Time</span>
                        <div className="border rounded-lg p-3">
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
                                isValidDate={(current) =>
                                    isValidDate(current, true)
                                }
                                inputProps={{
                                    className:
                                        "w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/50",
                                    placeholder: "Select end date & time",
                                }}
                            />
                        </div>
                        {moment(eventEndTime).isBefore(
                            startNow ? moment() : moment(eventStartTime),
                        ) && (
                                <p className="text-red-500 text-sm mt-1">
                                    End time must be after start time
                                </p>
                            )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full py-3 font-medium"
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
