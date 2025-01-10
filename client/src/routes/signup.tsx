import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Label, Input } from "../components";

export const Route = createFileRoute("/signup")({
    component: RouteComponent,
});

type Inputs = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

function RouteComponent() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const password = watch("password");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data.firstName);
    };

    return (
        <div className="min-h-[800px] ">
            <div className="w-[500px] mx-auto mt-32 text-[#5D3FD3]">
                <h1 className="text-center text-2xl font-bold">
                    {" "}
                    Get started with Vote-Niverse
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-2 mt-16"
                >
                    <div
                        id="names"
                        className="flex mx-auto gap-x-2 justify-between w-[80%]"
                    >
                        <div id="firstNameBody">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                type="text"
                                {...register("firstName", {
                                    required: "First name is required",
                                    pattern: {
                                        value: /^[A-Za-z]+$/,
                                        message: "First name should only contain letters",
                                    },
                                })}
                            />
                            {errors.firstName && (
                                <p className="text-red-600 text-sm">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div id="lastNameBody">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                type="text"
                                {...register("lastName", {
                                    required: "Last name is required",
                                    pattern: {
                                        value: /^[A-Za-z]+$/,
                                        message: "Last name should only contain letters",
                                    },
                                })}
                            />
                            {errors.lastName && (
                                <p className="text-red-600 text-sm">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div id="otherFields" className="w-[80%] mx-auto">
                        <div id="emailBody">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="text"
                                {...register("email", {
                                    required: "Email address is required",
                                    pattern: {
                                        value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/,
                                        message: "Invalid email address format",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        <div id="passwordBody">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="text"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,

                                        message: "Password must be at least 8 characters long",
                                    },
                                    maxLength: {
                                        value: 16,

                                        message: "Password must be below 16 characters",
                                    },
                                    validate: (value) =>
                                        value.trim() !== "" ||
                                        "Password cannot contain only spaces",
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div id="confirmPassword">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="text"
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div id="submitButton" className="w-[80%] mx-auto">
                        <Button
                            variant="outline"
                            type="submit"
                            className="w-full border border-black  py-2 rounded-lg"
                        >
                            Get started
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
