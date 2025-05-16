"use client";
import {
    Button,
    Input,
    Label,
    Checkbox,
    Textarea,
    RadioGroup,
    RadioGroupItem,
} from "@/components";
import { useState } from "react";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { capitalize } from "@/lib/utils";

interface FormState {
    submitting: boolean;
    eventType: string;
    eventTitle: { value: string; error: string | null };
    eventDescription: string;
    pollOptions: { text: string; error: string | null }[];
    candidateOptions: {
        candidate_name: string;
        candidate_email: string;
        error: string | null;
    }[];
    startType: "immediate" | "manual" | "time";
    startAt: string | null;
    endType: "manual" | "time";
    endAt: string | null;
    multiVote: boolean;
    anonymousVote: boolean;
}

function CreateEvent() {
    const [form, setForm] = useState<FormState>({
        submitting: false,
        eventType: "poll",
        eventTitle: { value: "", error: null },
        eventDescription: "",
        pollOptions: [
            { text: "", error: null },
            { text: "", error: null },
        ],
        candidateOptions: [
            { candidate_name: "", candidate_email: "", error: null },
            { candidate_name: "", candidate_email: "", error: null },
        ],
        startType: "immediate",
        startAt: null,
        endType: "manual",
        endAt: null,
        multiVote: false,
        anonymousVote: false,
    });
    const [addEventDescription, setAddEventDescription] =
        useState<boolean>(false);
    const [resError, setResError] = useState<string | null>(null);

    const clearAllErrors = () => {
        setForm((prev) => ({
            ...prev,
            eventTitle: { ...prev.eventTitle, error: null },
            pollOptions: prev.pollOptions.map((option) => ({
                ...option,
                error: null,
            })),
            candidateOptions: prev.candidateOptions.map((option) => ({
                ...option,
                error: null,
            })),
        }));
        setResError(null);
    };

    const validateForm = () => {
        let isValid = true;
        if (!form.eventTitle.value.trim()) {
            setForm((prev) => ({
                ...prev,
                eventTitle: {
                    ...prev.eventTitle,
                    error: "Event title is required!",
                },
            }));
            isValid = false;
        }
        if (form.eventType === "poll") {
            const updatedOptions = [...form.pollOptions];

            form.pollOptions.forEach((option, index) => {
                if (!option.text.trim()) {
                    updatedOptions[index].error =
                        `Option ${index + 1} value cannot be empty!`;
                    isValid = false;
                } else {
                    updatedOptions[index].error = null;
                }
            });
            setForm((prev) => ({ ...prev, pollOptions: updatedOptions }));
        }
        if (form.eventType === "vote") {
            const updatedCandidates = [...form.candidateOptions];

            form.candidateOptions.forEach((candidate, index) => {
                if (!candidate.candidate_name.trim()) {
                    updatedCandidates[index].error =
                        `Candidate ${index + 1} name cannot be empty!`;
                    isValid = false;
                } else {
                    updatedCandidates[index].error = null;
                }
            });
            setForm((prev) => ({
                ...prev,
                candidateOptions: updatedCandidates,
            }));
        }

        return isValid;
    };

    const handleSubmit = async () => {
        console.log(validateForm());
    };

    return (
        <div>
            <h1>Create {capitalize(form.eventType)} Event</h1>

            <div>
                <Label>Event Type</Label>
                <div className="flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none">
                    <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                        <input
                            type="radio"
                            name="radio"
                            value="poll"
                            className="peer hidden"
                            checked={form.eventType === "poll"}
                            onChange={() =>
                                setForm({ ...form, eventType: "poll" })
                            }
                        />
                        <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                            Poll
                        </span>
                    </label>

                    <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                        <input
                            type="radio"
                            name="radio"
                            value="vote"
                            className="peer hidden"
                            onChange={() =>
                                setForm({ ...form, eventType: "vote" })
                            }
                        />
                        <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                            Vote
                        </span>
                    </label>
                </div>
                <div>
                    <Label>Event Title</Label>
                    <Input
                        type="text"
                        placeholder="Enter event title"
                        value={form.eventTitle.value}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                eventTitle: {
                                    value: e.target.value,
                                    error: null,
                                },
                            })
                        }
                    />
                    {form.eventTitle.error && (
                        <p className="text-destructive text-sm">
                            {form.eventTitle.error}
                        </p>
                    )}
                </div>
                <div>
                    <Label>Event Description</Label>
                    <Checkbox
                        checked={addEventDescription}
                        onCheckedChange={() =>
                            setAddEventDescription((p) => !p)
                        }
                    />

                    {addEventDescription && (
                        <>
                            <Textarea
                                className="min-h-[150px] max-h-[300px]"
                                placeholder="Enter event description"
                                value={form.eventDescription}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        eventDescription: e.target.value,
                                    })
                                }
                            />
                        </>
                    )}
                </div>
                <div>
                    {form.eventType} Vote Options
                    <div>
                        {form.eventType === "poll" ? (
                            <>
                                {form.pollOptions.map((option, index) => (
                                    <div key={`${option.text}${index}`}>
                                        <div className="flex space-x-2">
                                            <Input
                                                type="text"
                                                placeholder={`Enter option ${index + 1}`}
                                                value={option.text}
                                                onChange={(e) => {
                                                    const newOptions = [
                                                        ...form.pollOptions,
                                                    ];
                                                    newOptions[index].text =
                                                        e.target.value;
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        pollOptions: newOptions,
                                                    }));
                                                }}
                                            />
                                            <Button
                                                disabled={
                                                    form.pollOptions.length <= 2
                                                }
                                                onClick={() => {
                                                    const newOptions = [
                                                        ...form.pollOptions,
                                                    ];
                                                    newOptions.splice(index, 1);
                                                    setForm({
                                                        ...form,
                                                        pollOptions: newOptions,
                                                    });
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        {option.error && (
                                            <p className="text-destructive text-sm">
                                                {option.error}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    onClick={() => {
                                        setForm({
                                            ...form,
                                            pollOptions: [
                                                ...form.pollOptions,
                                                { text: "", error: null },
                                            ],
                                        });
                                    }}
                                >
                                    Add Option
                                </Button>
                            </>
                        ) : (
                            <>
                                {form.candidateOptions.map(
                                    (
                                        {
                                            candidate_name,
                                            candidate_email,
                                            error,
                                        },
                                        index,
                                    ) => (
                                        <div
                                            key={`${candidate_name},${candidate_email}${index}`}
                                        >
                                            <div className="flex space-x-2">
                                                <Input
                                                    type="text"
                                                    placeholder={`Enter candidate ${index + 1} name`}
                                                    value={candidate_name}
                                                    onChange={(e) => {
                                                        const newOptions = [
                                                            ...form.candidateOptions,
                                                        ];
                                                        newOptions[
                                                            index
                                                        ].candidate_name =
                                                            e.target.value;
                                                        setForm({
                                                            ...form,
                                                            candidateOptions:
                                                                newOptions,
                                                        });
                                                    }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder={`Enter candidate ${index + 1} email`}
                                                    value={candidate_email}
                                                    onChange={(e) => {
                                                        const newOptions = [
                                                            ...form.candidateOptions,
                                                        ];
                                                        newOptions[
                                                            index
                                                        ].candidate_email =
                                                            e.target.value;
                                                        setForm({
                                                            ...form,
                                                            candidateOptions:
                                                                newOptions,
                                                        });
                                                    }}
                                                />
                                                <Button
                                                    disabled={
                                                        form.candidateOptions
                                                            .length <= 2
                                                    }
                                                    onClick={() => {
                                                        const newOptions = [
                                                            ...form.candidateOptions,
                                                        ];
                                                        newOptions.splice(
                                                            index,
                                                            1,
                                                        );
                                                        setForm({
                                                            ...form,
                                                            candidateOptions:
                                                                newOptions,
                                                        });
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            {error && (
                                                <p className="text-destructive text-sm">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                                <Button
                                    onClick={() => {
                                        setForm({
                                            ...form,
                                            candidateOptions: [
                                                ...form.candidateOptions,
                                                {
                                                    candidate_name: "",
                                                    candidate_email: "",
                                                    error: null,
                                                },
                                            ],
                                        });
                                    }}
                                >
                                    Add Candidate
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <Label>Start Event</Label>

                    <RadioGroup
                        defaultValue="immediate"
                        value={form.startType}
                        onValueChange={(value) => {
                            setForm({
                                ...form,
                                startType: value as
                                    | "immediate"
                                    | "manual"
                                    | "time",
                                startAt:
                                    value === "immediate" || value === "manual"
                                        ? null
                                        : (new Date() as unknown as string),
                            });
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="immediate"
                                id="start-event-option-one"
                            />
                            <Label htmlFor="start-event-option-one">
                                Immediate
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="manual"
                                id="start-event-option-two"
                            />
                            <Label htmlFor="start-event-option-two">
                                Manually
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="time"
                                id="start-event-option-three"
                            />
                            <Label htmlFor="start-event-option-three">
                                Schedule
                            </Label>
                        </div>
                    </RadioGroup>

                    {form.startType === "time" && (
                        <DateTime
                            inputProps={{
                                className:
                                    "border-2 border-gray-300 rounded-md p-2",
                            }}
                            dateFormat="YYYY-MM-DD"
                            timeFormat="hh:mm A"
                            value={new Date(form.startAt || "")}
                            isValidDate={(currentDate) => {
                                const today = moment().startOf("day");
                                const fiveDaysLater = moment()
                                    .add(5, "days")
                                    .endOf("day");
                                return currentDate.isBetween(
                                    today,
                                    fiveDaysLater,
                                    null,
                                    "[]",
                                );
                            }}
                            onChange={(date) => {
                                setForm({
                                    ...form,
                                    startAt: new Date(
                                        date.toString(),
                                    ).toISOString(),
                                });
                            }}
                        />
                    )}
                </div>
                <div>
                    <Label>End event</Label>

                    <RadioGroup
                        value={form.endType}
                        onValueChange={(value) => {
                            setForm({
                                ...form,
                                endType: value as "manual" | "time",
                                endAt:
                                    value === "manual"
                                        ? null
                                        : (new Date() as unknown as string),
                            });
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="manual"
                                id="end-event-option-one"
                            />
                            <Label htmlFor="end-event-option-one">
                                Manually
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="time"
                                id="end-event-option-two"
                            />
                            <Label htmlFor="end-event-option-two">
                                Schedule
                            </Label>
                        </div>
                    </RadioGroup>

                    {form.endType === "time" && (
                        <DateTime
                            inputProps={{
                                className:
                                    "border-2 border-gray-300 rounded-md p-2",
                            }}
                            dateFormat="YYYY-MM-DD"
                            timeFormat="hh:mm A"
                            value={
                                new Date(
                                    new Date(form.endAt || "").getTime() +
                                        1200000,
                                )
                            }
                            isValidDate={(currentDate) => {
                                const today = moment().startOf("day");
                                const fiveDaysLater = moment()
                                    .add(5, "days")
                                    .endOf("day");
                                return currentDate.isBetween(
                                    today,
                                    fiveDaysLater,
                                    null,
                                    "[]",
                                );
                            }}
                            onChange={(date) => {
                                setForm({
                                    ...form,
                                    startAt: new Date(
                                        date.toString(),
                                    ).toISOString(),
                                });
                            }}
                        />
                    )}
                </div>

                <div>
                    <h2>Advance options</h2>
                    <div>
                        <Label>Allow multiple votes</Label>
                        <Checkbox
                            checked={form.multiVote}
                            onCheckedChange={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    multiVote: !prev.multiVote,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <Label>Anonymous voting</Label>
                        <Checkbox
                            checked={form.anonymousVote}
                            onCheckedChange={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    anonymousVote: !prev.anonymousVote,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>
            <Button onClick={handleSubmit} disabled={form.submitting}>
                Create Event
            </Button>
        </div>
    );
}

export default CreateEvent;
