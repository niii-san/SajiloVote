import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";

export const Route = createFileRoute("/_layout/_authenticated/create")({
    component: RouteComponent,
});

function RouteComponent() {
    type Inputs = {
        eventTitle: string;
        eventDescription: string;
        eventType:"poll"|"vote";
        pollOptions:string[];
        voteCandidates:string[];
        eventStartTime:Date;
        eventEndTime:Date
        voteOrPollMethod:string
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onFormSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    return (
        <div className="w-full">
            <h1>Create Event</h1>
            {/*Event form*/}
            <form onSubmit={handleSubmit(onFormSubmit)}></form>
        </div>
    );
}
