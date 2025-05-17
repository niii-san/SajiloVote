"use client";
import {
    Button,
    Input,
    Label,
    Switch,
    Textarea,
    RadioGroup,
    RadioGroupItem,
} from "@/components";
import { useState } from "react";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { capitalize, cn } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";

import {
    BarChart2,
    Vote,
    TextCursor,
    AlertCircle,
    Plus,
    Trash2,
    CalendarClock,
    Loader2,
    Info,
    Settings2,
    Calendar,
    Clock,
    List,
} from "lucide-react";
import { motion } from "motion/react";

interface FormState {
    submitting: boolean;
    eventType: string;
    eventTitle: { value: string; error: string | null };
    eventDescription: string;
    pollOptions: { text: string; error: string | null; id: string }[];
    candidateOptions: {
        candidate_name: string;
        candidate_email: string;
        error: string | null;
        id: string;
    }[];
    startType: "immediate" | "manual" | "time";
    startAt: string | null;
    endType: "manual" | "time";
    endAt: string | null;
    multiVote: boolean;
    anonymousVote: boolean;
}

function CreateEvent() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({
        submitting: false,
        eventType: "poll",
        eventTitle: { value: "", error: null },
        eventDescription: "",
        pollOptions: [
            { text: "", error: null, id: uuid() },
            { text: "", error: null, id: uuid() },
        ],
        candidateOptions: [
            {
                candidate_name: "",
                candidate_email: "",
                error: null,
                id: uuid(),
            },
            {
                candidate_name: "",
                candidate_email: "",
                error: null,
                id: uuid(),
            },
        ],
        startType: "immediate",
        startAt: null,
        endType: "manual",
        endAt: null,
        multiVote: false,
        anonymousVote: false,
    });
    console.log(form);
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
        setForm((prev) => ({ ...prev, submitting: true }));
        clearAllErrors();
        if (validateForm()) {
            const payload = {
                title: form.eventTitle.value,
                type: form.eventType,
                description: form.eventDescription,
                start_type: form.startType,
                start_at: form.startAt,
                end_type: form.endType,
                end_at: form.endAt,
                multi_vote: form.multiVote,
                anonymous_vote: form.anonymousVote,
                poll_options:
                    form.eventType === "poll"
                        ? form.pollOptions.map((option) => option.text)
                        : null,
                candidate_options:
                    form.eventType === "vote"
                        ? form.candidateOptions.map((candidate) => ({
                            candidate_name: candidate.candidate_name,
                            candidate_email: candidate.candidate_email,
                        }))
                        : null,
            };

            try {
                await api.post("/api/v1/events", payload);

                toast.success("Event created successfully!");
                setForm({
                    ...form,
                    submitting: false,
                });
                //TODO: navigate to created event page
                router.push(`/events`);
            } catch (error: any) {
                setForm((p) => ({ ...p, submitting: false }));
                setResError(
                    error?.response?.data?.message ?? "Something went wrong!",
                );
            }
        }
    };

    return (
        <div className="h-screen min-h-screen w-full p-8 bg-muted/40">
            <div className="max-w-6xl mx-auto h-full flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 mb-8"
                >
                    <h1 className="text-4xl font-bold flex items-center gap-3 text-primary">
                        <CalendarClock className="w-10 h-10" />
                        Create {capitalize(form.eventType)} Event
                    </h1>

                    {resError && (
                        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                            <p className="text-lg font-medium">{resError}</p>
                        </div>
                    )}
                </motion.div>

                <div className="flex-1 overflow-auto pb-8">
                    <div className="bg-background p-8 rounded-xl border space-y-10">
                        {/* Event Type Selection */}
                        <div className="space-y-6">
                            <Label className="text-xl font-semibold flex items-center gap-3">
                                <Settings2 className="w-6 h-6" />
                                Event Type
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="relative">
                                    <input
                                        type="radio"
                                        name="radio"
                                        value="poll"
                                        className="peer hidden"
                                        checked={form.eventType === "poll"}
                                        onChange={() =>
                                            setForm({
                                                ...form,
                                                eventType: "poll",
                                            })
                                        }
                                    />
                                    <div className="flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:ring-4 peer-checked:ring-primary/20">
                                        <BarChart2 className="w-10 h-10 mb-3 text-primary" />
                                        <span className="font-semibold text-lg">
                                            Poll
                                        </span>
                                    </div>
                                </label>

                                <label className="relative">
                                    <input
                                        type="radio"
                                        name="radio"
                                        value="vote"
                                        className="peer hidden"
                                        checked={form.eventType === "vote"}
                                        onChange={() =>
                                            setForm({
                                                ...form,
                                                eventType: "vote",
                                            })
                                        }
                                    />
                                    <div className="flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:ring-4 peer-checked:ring-primary/20">
                                        <Vote className="w-10 h-10 mb-3 text-primary" />
                                        <span className="font-semibold text-lg">
                                            Vote
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xl font-semibold flex items-center gap-3">
                                    <TextCursor className="w-6 h-6" />
                                    Event Title
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Enter event title"
                                    value={form.eventTitle.value}
                                    className="h-14 text-lg"
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
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="w-5 h-5" />
                                        <p className="text-base">
                                            {form.eventTitle.error}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xl font-semibold flex items-center gap-3">
                                        <Info className="w-6 h-6" />
                                        Event Description
                                    </Label>
                                    <Switch
                                        checked={addEventDescription}
                                        onCheckedChange={() =>
                                            setAddEventDescription((p) => !p)
                                        }
                                        className="h-6 w-12"
                                    />
                                </div>
                                {addEventDescription && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                    >
                                        <Textarea
                                            className="min-h-[150px] text-lg"
                                            placeholder="Describe your event..."
                                            value={form.eventDescription}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    eventDescription:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Options Section */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-semibold flex items-center gap-3">
                                <List className="w-6 h-6" />
                                {form.eventType === "poll"
                                    ? "Poll Options"
                                    : "Candidate Details"}
                            </h3>

                            {form.eventType === "poll" ? (
                                <div className="space-y-6">
                                    {form.pollOptions.map((option, index) => (
                                        <div
                                            key={option.id}
                                            className="space-y-3"
                                        >
                                            <div className="flex gap-3">
                                                <Input
                                                    placeholder={`Option ${index + 1}`}
                                                    value={option.text}
                                                    className="h-14 text-lg"
                                                    onChange={(e) => {
                                                        const newOptions = [
                                                            ...form.pollOptions,
                                                        ];
                                                        newOptions[index].text =
                                                            e.target.value;
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            pollOptions:
                                                                newOptions,
                                                        }));
                                                    }}
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="w-14"
                                                    disabled={
                                                        form.pollOptions
                                                            .length <= 2
                                                    }
                                                    onClick={() => {
                                                        const newOptions =
                                                            form.pollOptions.filter(
                                                                (_, i) =>
                                                                    i !== index,
                                                            );
                                                        setForm({
                                                            ...form,
                                                            pollOptions:
                                                                newOptions,
                                                        });
                                                    }}
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </Button>
                                            </div>
                                            {option.error && (
                                                <div className="flex items-center gap-2 text-destructive">
                                                    <AlertCircle className="w-5 h-5" />
                                                    <p className="text-base">
                                                        {option.error}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                pollOptions: [
                                                    ...form.pollOptions,
                                                    {
                                                        text: "",
                                                        error: null,
                                                        id: uuid(),
                                                    },
                                                ],
                                            })
                                        }
                                        className="h-14 text-lg gap-3"
                                    >
                                        <Plus className="w-6 h-6" />
                                        Add Option
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {form.candidateOptions.map(
                                            (candidate, index) => (
                                                <div
                                                    key={candidate.id}
                                                    className="space-y-3"
                                                >
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex gap-3">
                                                            <Input
                                                                placeholder={`Candidate ${index + 1} Name`}
                                                                value={
                                                                    candidate.candidate_name
                                                                }
                                                                className="h-14 text-lg flex-1"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const newOptions =
                                                                        [
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
                                                                placeholder={`Candidate ${index + 1} Email`}
                                                                value={
                                                                    candidate.candidate_email
                                                                }
                                                                className="h-14 text-lg flex-1"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const newOptions =
                                                                        [
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
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            className="w-full md:w-auto gap-3 h-14"
                                                            disabled={
                                                                form
                                                                    .candidateOptions
                                                                    .length <= 2
                                                            }
                                                            onClick={() => {
                                                                const newOptions =
                                                                    form.candidateOptions.filter(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                            index,
                                                                    );
                                                                setForm({
                                                                    ...form,
                                                                    candidateOptions:
                                                                        newOptions,
                                                                });
                                                            }}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                            Remove Candidate
                                                        </Button>
                                                    </div>
                                                    {candidate.error && (
                                                        <div className="flex items-center gap-2 text-destructive">
                                                            <AlertCircle className="w-5 h-5" />
                                                            <p className="text-base">
                                                                {
                                                                    candidate.error
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <Button
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                candidateOptions: [
                                                    ...form.candidateOptions,
                                                    {
                                                        candidate_name: "",
                                                        candidate_email: "",
                                                        error: null,
                                                        id: uuid(),
                                                    },
                                                ],
                                            })
                                        }
                                        className="h-14 text-lg gap-3"
                                    >
                                        <Plus className="w-6 h-6" />
                                        Add Candidate
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Schedule Section */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold flex items-center gap-3">
                                    <Clock className="w-6 h-6" />
                                    Event Schedule
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Start Time */}
                                    <div className="space-y-4">
                                        <Label className="text-lg">
                                            Start Event
                                        </Label>
                                        <RadioGroup
                                            value={form.startType}
                                            onValueChange={(value) => {
                                                setForm({
                                                    ...form,
                                                    startType: value as
                                                        | "immediate"
                                                        | "manual"
                                                        | "time",
                                                    startAt:
                                                        value === "immediate" ||
                                                            value === "manual"
                                                            ? null
                                                            : new Date().toISOString(),
                                                });
                                            }}
                                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        >
                                            {[
                                                {
                                                    value: "immediate",
                                                    label: "Immediately",
                                                },
                                                {
                                                    value: "manual",
                                                    label: "Manually",
                                                },
                                                {
                                                    value: "time",
                                                    label: "Schedule",
                                                },
                                            ].map((option) => (
                                                <Label
                                                    key={option.value}
                                                    className={cn(
                                                        "flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer text-base",
                                                        form.startType ===
                                                            option.value
                                                            ? "border-primary bg-primary/10 font-semibold"
                                                            : "border-muted hover:bg-accent/50",
                                                    )}
                                                >
                                                    <RadioGroupItem
                                                        value={option.value}
                                                        className="hidden"
                                                    />
                                                    {option.label}
                                                </Label>
                                            ))}
                                        </RadioGroup>

                                        {form.startType === "time" && (
                                            <div className="flex items-center gap-3 pl-2">
                                                <Calendar className="w-6 h-6 text-muted-foreground" />
                                                <DateTime
                                                    inputProps={{
                                                        className:
                                                            "border-2 border-gray-300 rounded-lg p-3 w-full text-lg",
                                                    }}
                                                    dateFormat="YYYY-MM-DD"
                                                    timeFormat="hh:mm A"
                                                    value={
                                                        new Date(
                                                            form.startAt || "",
                                                        )
                                                    }
                                                    isValidDate={(
                                                        currentDate,
                                                    ) => {
                                                        const today =
                                                            moment().startOf(
                                                                "day",
                                                            );
                                                        const fiveDaysLater =
                                                            moment()
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
                                            </div>
                                        )}
                                    </div>

                                    {/* End Time */}
                                    <div className="space-y-4">
                                        <Label className="text-lg">
                                            End Event
                                        </Label>
                                        <RadioGroup
                                            value={form.endType}
                                            onValueChange={(value) => {
                                                setForm({
                                                    ...form,
                                                    endType: value as
                                                        | "manual"
                                                        | "time",
                                                    endAt:
                                                        value === "manual"
                                                            ? null
                                                            : new Date(
                                                                new Date().getTime() +
                                                                10 *
                                                                60 *
                                                                1000,
                                                            ).toISOString(),
                                                });
                                            }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            {[
                                                {
                                                    value: "manual",
                                                    label: "Manually",
                                                },
                                                {
                                                    value: "time",
                                                    label: "Schedule",
                                                },
                                            ].map((option) => (
                                                <Label
                                                    key={option.value}
                                                    className={cn(
                                                        "flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer text-base",
                                                        form.endType ===
                                                            option.value
                                                            ? "border-primary bg-primary/10 font-semibold"
                                                            : "border-muted hover:bg-accent/50",
                                                    )}
                                                >
                                                    <RadioGroupItem
                                                        value={option.value}
                                                        className="hidden"
                                                    />
                                                    {option.label}
                                                </Label>
                                            ))}
                                        </RadioGroup>

                                        {form.endType === "time" && (
                                            <div className="flex items-center gap-3 pl-2">
                                                <Calendar className="w-6 h-6 text-muted-foreground" />
                                                <DateTime
                                                    inputProps={{
                                                        className:
                                                            "border-2 border-gray-300 rounded-lg p-3 w-full text-lg",
                                                    }}
                                                    dateFormat="YYYY-MM-DD"
                                                    timeFormat="hh:mm A"
                                                    value={
                                                        new Date(
                                                            form.endAt || "",
                                                        )
                                                    }
                                                    isValidDate={(
                                                        currentDate,
                                                    ) => {
                                                        const today =
                                                            moment().startOf(
                                                                "day",
                                                            );
                                                        const fiveDaysLater =
                                                            moment()
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
                                                            endAt: new Date(
                                                                date.toString(),
                                                            ).toISOString(),
                                                        });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-semibold flex items-center gap-3">
                                <Settings2 className="w-6 h-6" />
                                Advanced Options
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                    <div className="space-y-1">
                                        <Label className="text-lg">
                                            Allow Multiple Votes
                                        </Label>
                                        <p className="text-base text-muted-foreground">
                                            Participants can vote for multiple
                                            options
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.multiVote}
                                        onCheckedChange={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                multiVote: !prev.multiVote,
                                            }))
                                        }
                                        className="h-6 w-12"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                    <div className="space-y-1">
                                        <Label className="text-lg">
                                            Anonymous Voting
                                        </Label>
                                        <p className="text-base text-muted-foreground">
                                            Hide participant identities during
                                            voting
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.anonymousVote}
                                        onCheckedChange={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                anonymousVote:
                                                    !prev.anonymousVote,
                                            }))
                                        }
                                        className="h-6 w-12"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={form.submitting}
                            className="w-full h-14 text-xl gap-3 mt-10"
                        >
                            {form.submitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <CalendarClock className="w-6 h-6" />
                            )}
                            {form.submitting
                                ? "Creating Event..."
                                : "Create Event"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;
