import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button, Input, Label } from "../../../components";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useEffect, useState } from "react";
import moment from "moment";

export const Route = createFileRoute("/_layout/_authenticated/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const isValidDate = (currentDate: moment.Moment) => {
        return currentDate.isSameOrAfter(moment(), "day");
    };

    type Inputs = {
        eventTitle: string;
        eventDescription: string;
        eventType: "poll" | "vote";
        pollOptions: Array<{ option: string }>;
        voteCandidates: Array<{ name: string; email?: string }>;
        eventStartTime: string;
        eventEndTime: string;
        voteOrPollMethod: string;
    };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
        trigger,
        clearErrors,
    } = useForm<Inputs>({
        defaultValues: {
            eventType: "poll",
            pollOptions: [{ option: "" }],
            voteCandidates: [{ name: "" }],
        },
        mode: "onChange",
    });

    const [description, setDescription] = useState(false);
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(
        moment().toISOString(),
    );
    const [endDateTime, setEndDateTime] = useState(
        moment().add(2, "hour").toISOString(),
    );
    const [startNow, setStartNow] = useState(true);

    const {
        fields: pollFields,
        append: appendPoll,
        remove: removePoll,
    } = useFieldArray({
        control,
        name: "pollOptions",
        rules: {
            validate: (value) =>
                watch("eventType") !== "poll" ||
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
                watch("eventType") !== "vote" ||
                (value.length > 0 &&
                    value.every((c) => c.name.trim() !== "")) ||
                "At least one valid candidate is required",
        },
    });

    useEffect(() => {
        const subscription = watch((_, { name }) => {
            if (
                name?.startsWith("pollOptions") ||
                name?.startsWith("voteCandidates")
            ) {
                trigger(["pollOptions", "voteCandidates"]);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, trigger]);

    const handleStartNowToggle = () => {
        setStartNow((prev) => !prev);
    };

    const handleToggleDescription = () => {
        if (description) {
            reset({ eventDescription: "" });
        }
        setDescription((prev) => !prev);
    };

    const handleAddPoll = () => {
        appendPoll({ option: "" }, { shouldFocus: true });
        clearErrors("pollOptions");
    };

    const handleAddCandidate = () => {
        appendCandidate({ name: "", email: "" }, { shouldFocus: true });
        clearErrors("voteCandidates");
    };

    const onFormSubmit: SubmitHandler<Inputs> = (data) => {
        const payload = {
            ...data,
            start_at: startNow ? "now" : selectedStartDateTime,
            end_at: endDateTime,
        };
        console.log(payload);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create Event</h1>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                {/* Event Type Selection */}
                <div>
                    <Label htmlFor="eventType" className="block mb-2">
                        Event Type
                    </Label>
                    <div className="flex space-x-2 border-2 border-primary rounded-xl select-none">
                        {["poll", "vote"].map((type) => (
                            <label
                                key={type}
                                className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    {...register("eventType", {
                                        onChange: () =>
                                            trigger([
                                                "pollOptions",
                                                "voteCandidates",
                                            ]),
                                    })}
                                    value={type}
                                    className="peer hidden"
                                />
                                <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-primary/70 peer-checked:to-primary peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Event Title */}
                <div>
                    <Label htmlFor="eventTitle" className="block mb-2">
                        Event Title
                    </Label>
                    <Input
                        id="eventTitle"
                        placeholder="Enter event title"
                        {...register("eventTitle", {
                            required: "Event title is required",
                        })}
                        className="w-full"
                    />
                    {errors.eventTitle && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.eventTitle.message}
                        </p>
                    )}
                </div>

                {/* Event Description */}
                <div>
                    {description && (
                        <div>
                            <Label
                                htmlFor="eventDescription"
                                className="block mb-2"
                            >
                                Description
                            </Label>
                            <textarea
                                id="eventDescription"
                                {...register("eventDescription")}
                                className="w-full p-2 border rounded-md"
                                rows={4}
                            />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleToggleDescription}
                        className="text-primary hover:text-primary/90 text-sm"
                    >
                        {description ? "Remove description" : "Add description"}
                    </button>
                </div>

                {/* Poll Options */}
                {watch("eventType") === "poll" && (
                    <div>
                        <Label className="block mb-2">Poll Options</Label>
                        {pollFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 mb-2">
                                <div className="flex-grow">
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
                                    />
                                    {errors.pollOptions?.[index]?.option && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {
                                                errors.pollOptions[index]
                                                    ?.option?.message
                                            }
                                        </p>
                                    )}
                                </div>
                                {pollFields.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            removePoll(index);
                                            trigger("pollOptions");
                                        }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={handleAddPoll}
                            className="mt-2"
                        >
                            Add Option
                        </Button>
                        {errors.pollOptions?.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pollOptions.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Vote Candidates */}
                {watch("eventType") === "vote" && (
                    <div>
                        <Label className="block mb-2">Candidates</Label>
                        {candidateFields.map((field, index) => (
                            <div key={field.id} className="space-y-2 mb-4">
                                <div className="flex gap-2">
                                    <div className="flex-grow">
                                        <Input
                                            {...register(
                                                `voteCandidates.${index}.name`,
                                                {
                                                    required:
                                                        "Candidate name is required",
                                                    validate: (value) =>
                                                        value.trim() !== "" ||
                                                        "Candidate name cannot be empty",
                                                },
                                            )}
                                            placeholder={`Candidate ${index + 1} name`}
                                        />
                                        {errors.voteCandidates?.[index]
                                            ?.name && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {
                                                        errors.voteCandidates[index]
                                                            ?.name?.message
                                                    }
                                                </p>
                                            )}
                                    </div>
                                    {candidateFields.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                removeCandidate(index);
                                                trigger("voteCandidates");
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
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
                                />
                                {errors.voteCandidates?.[index]?.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {
                                            errors.voteCandidates[index]?.email
                                                ?.message
                                        }
                                    </p>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={handleAddCandidate}
                            className="mt-2"
                        >
                            Add Candidate
                        </Button>
                        {errors.voteCandidates?.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.voteCandidates.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Event Start Time */}
                <div>
                    <Label className="block mb-2">Start Time</Label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            checked={startNow}
                            onChange={handleStartNowToggle}
                            className="w-4 h-4"
                        />
                        <span>Start immediately</span>
                    </div>

                    {!startNow && (
                        <div className="border rounded-md p-2">
                            <Datetime
                                value={moment(selectedStartDateTime)}
                                onChange={(date) => {
                                    if (moment.isMoment(date)) {
                                        setSelectedStartDateTime(
                                            date.toISOString(),
                                        );
                                    }
                                }}
                                isValidDate={isValidDate}
                                inputProps={{
                                    className: "w-full p-2 border rounded-md",
                                    placeholder: "Select date and time",
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Event End Time */}
                <div>
                    <Label>End Time</Label>
                    <Datetime
                        value={moment(endDateTime)}
                        onChange={(date) => {
                            if (moment.isMoment(date)) {
                                setEndDateTime(date.toISOString());
                            }
                        }}
                        isValidDate={isValidDate}
                        inputProps={{
                            className: "w-full p-2 border rounded-md",
                        }}
                    />
                </div>

                <Button type="submit" className="w-full">
                    Create Event
                </Button>
            </form>
        </div>
    );
}
