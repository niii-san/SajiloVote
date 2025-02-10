import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Label, Input } from "../../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../../utils";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_layout/(auth)/signup")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [signing, setSigning] = useState<boolean>(false);
    const [resErr, setResErr] = useState<string | null>(null);
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
                .min(8, "Password must be at least 8 characters long")
                .max(16, "Password should be less than 16 characters")
                .required("Password is required"),
            confirmPassword: yup
                .string()
                .oneOf(
                    [yup.ref("password")],
                    "Confirm password did not matched",
                ),
        })
        .required();

    type FormData = yup.InferType<typeof signupSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(signupSchema) });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (resErr) setResErr(null);
        setSigning(true);
        const payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
        };

        try {
            await api.post("/api/v1/auth/signup", payload);
            toast.success("Signed up successfully, Proceed to login");
            reset();
            navigate({ to: "/login" });
        } catch (error: any) {
            setResErr(error?.response?.data?.message);
        } finally {
            setSigning(false);
        }
    };

    return (
        <div className="min-h-[800px] ">
            <div className="w-[1000px] h-[600px] mx-auto mt-36 flex justify-start">
                <div className="bg-primary w-[55%] h-full">something</div>
                <div className="w-[45%] rounded-r-md py-5 bg-white ">
                    <h1 className="flex justify-center items-center gap-x-1 text-2xl font-bold">
                        Get started with{" "}
                        <p className="text-primary">Who Wins</p>
                    </h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-12 px-5"
                    >
                        <div
                            id="names"
                            className="flex mx-auto gap-2 justify-between  "
                        >
                            <div id="firstNameBody">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    type="text"
                                    {...register("firstName")}
                                    placeholder="John"
                                />
                                <p className="h-[14px] text-red-600 text-sm">
                                    {errors.firstName &&
                                        errors.firstName.message}
                                </p>
                            </div>

                            <div id="lastNameBody">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Doe"
                                />
                                <p className="h-[14px] text-red-600 text-sm">
                                    {errors.lastName && errors.lastName.message}
                                </p>
                            </div>
                        </div>
                        <div id="otherFields" className="mx-auto">
                            <div id="emailBody" className="mt-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="text"
                                    {...register("email")}
                                    placeholder="xyz@mail.com"
                                    id="email"
                                />
                                <p className="h-[14px] text-red-600 text-sm">
                                    {errors.email && errors.email.message}
                                </p>
                            </div>

                            <div id="passwordBody" className="mt-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="text"
                                    id="password"
                                    {...register("password")}
                                />
                                <p className="h-[14px] text-red-600 text-sm">
                                    {errors.password && errors.password.message}
                                </p>
                            </div>

                            <div id="confirmPassword" className="mt-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="text"
                                    {...register("confirmPassword")}
                                />
                                <p className="h-[14px] text-red-600 text-sm">
                                    {errors.confirmPassword &&
                                        errors.confirmPassword.message}
                                </p>
                            </div>
                            {resErr && (
                                <p className="h-[14px] text-red-600 text-sm">
                                    {resErr}
                                </p>
                            )}
                        </div>

                        <div id="submitButton" className="">
                            <Button
                                loading={signing}
                                disabled={signing}
                                variant="filled"
                                type="submit"
                                className=" mt-8"
                            >
                                Get started
                            </Button>
                        </div>
                        <div className="w-[80%] mx-auto flex justify-center mt-4">
                            <p>Already have an account?</p>{" "}
                            <p className="ml-2 hover:underline cursor-pointer">
                                <Link
                                    to={"/login"}
                                    className="text-primary font-bold"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
