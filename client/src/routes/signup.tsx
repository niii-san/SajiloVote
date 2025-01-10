import { createFileRoute } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";

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
        <div className="min-h-[800px]">
            <h1>Signup Form</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div id="firstNameBody">
                    <label htmlFor="firstName">First name</label>
                    <input
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
                        <p className="text-red-600">{errors.firstName.message}</p>
                    )}
                </div>

                <div id="lastNameBody">
                    <label htmlFor="lastName">Last name</label>
                    <input
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
                        <p className="text-red-600">{errors.lastName.message}</p>
                    )}
                </div>

                <div id="emailBody">
                    <label htmlFor="email">Email</label>
                    <input
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
                        <p className="text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div id="passwordBody">
                    <label htmlFor="password">Password</label>
                    <input
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
                                value.trim() !== "" || "Password cannot contain only spaces",
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div id="confirmPassword">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="text"
                        {...register("confirmPassword", {
                            required: "Confirm password is required",
                            validate: (value) =>
                                value === password || "Passwords do not match",
                        })}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div id="submitButton">
                    <button
                        type="submit"
                        className="border-2 border-black px-6 py-2 rounded-lg"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
