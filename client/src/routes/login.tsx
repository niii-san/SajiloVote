import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Input, Label, Button } from "../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { api } from "../utils";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [resErr, setResErr] = useState<string | null>(null);

    const signupSchema = yup
        .object({
            email: yup
                .string()
                .email("Invalid email format")
                .required("Email address is required"),
            password: yup.string().required("Password is required"),
        })
        .required();

    type FormData = yup.InferType<typeof signupSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(signupSchema) });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (resErr) setResErr(null);
        setLoading(true);
        const payload = {
            email: data.email,
            password: data.password,
        };

        try {
             await api.post("/auth/login",payload)
            navigate({to:"/"})
            //TODO: handle user state and load user data

        } catch (error: any) {
            setResErr(error.response?.data?.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[800px] ">
            <div className="bg-primary text-background w-[150px] h-[100px]">
                LOGO
            </div>
            <div className="w-[450px] rounded-md py-5 bg-white mx-auto mt-2">
                <h1 className="flex justify-center items-center gap-x-1 text-2xl font-bold text-primary">
                    Welcome back!
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-12 w-[80%] mx-auto"
                >
                    <div className="flex flex-col gap-y-4">
                        <div id="emailBody">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="text"
                                {...register("email")}
                                placeholder="xyz@mail.com"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div id="pwBody">
                            <Label htmlFor="password">Password</Label>
                            <Input type="text" {...register("password")} />
                            {errors.password && (
                                <p className="text-red-600 text-sm">
                                    {errors.password.message}
                                </p>
                            )}

                            {resErr && (
                                <p className="text-red-600 text-sm">{resErr}</p>
                            )}

                            <p className="mt-2 text-right text-sm text-primary font-bold cursor-pointer hover:opacity-80">
                                Forgot password?
                            </p>
                        </div>
                    </div>

                    <div id="loginButton" className="mx-auto">
                        <Button
                            loading={loading}
                            disabled={loading}
                            variant="filled"
                            type="submit"
                            className=" mt-8"
                        >
                            Login
                        </Button>
                    </div>
                    <div className="w-[80%] mx-auto flex justify-center mt-4">
                        <p>Don't have an account?</p>
                        <p className="ml-2 hover:underline cursor-pointer">
                            <Link
                                to={"/signup"}
                                className="text-primary font-bold"
                            >
                                Signup here.
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
