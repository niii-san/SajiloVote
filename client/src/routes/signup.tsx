import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Label, Input } from "../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const Route = createFileRoute("/signup")({
    component: RouteComponent,
});

const signupSchema = yup
    .object({
        firstName: yup.string().trim().required("First name is required"),
        lastName: yup.string().trim().required("Last name is required"),
        email: yup
            .string()
            .email("Invalid email format")
            .required("Email address is required"),
        password: yup
            .string()
            .min(8)
            .max(16, "Password should be less than 16 characters")
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Confirm password did not matched"),
    })
    .required();
type FormData = yup.InferType<typeof signupSchema>;

function RouteComponent() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(signupSchema) });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    };

    return (
        <div className="min-h-[800px] ">
            <div className="w-[500px] mx-auto mt-32">
                <h1 className="text-center text-2xl font-bold">
                    Get started with Vote-Niverse
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col  mt-16 h-[500px]"
                >
                    <div
                        id="names"
                        className="flex mx-auto gap-x-2 justify-between w-[80%]"
                    >
                        <div id="firstNameBody">
                            <Label htmlFor="firstName">First name</Label>
                            <Input type="text" {...register("firstName")} />
                            {errors.firstName && (
                                <p className="text-red-600 text-sm">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div id="lastNameBody">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input type="text" {...register("lastName")} />
                            {errors.lastName && (
                                <p className="text-red-600 text-sm">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div id="otherFields" className="w-[80%] mx-auto">
                        <div id="emailBody" className="mt-5">
                            <Label htmlFor="email">Email</Label>
                            <Input type="text" {...register("email")} />
                            {errors.email && (
                                <p className="text-red-600 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div id="passwordBody" className="mt-5">
                            <Label htmlFor="password">Password</Label>
                            <Input type="text" {...register("password")} />
                            {errors.password && (
                                <p className="text-red-600 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div id="confirmPassword" className="mt-5">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="text"
                                {...register("confirmPassword")}
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
                            className="w-full border border-black  py-2 rounded-lg text-white mt-10"
                        >
                            Get started
                        </Button>
                    </div>
                    <div className="w-[80%] mx-auto flex justify-center mt-4">
                        <p>Already have a account?</p>{" "}
                        <p className="ml-2 hover:underline cursor-pointer">
                            <Link to={"/login"}>Login here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
