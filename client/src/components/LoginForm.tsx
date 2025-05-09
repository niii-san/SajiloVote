"use client";
import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Button,
} from "./index";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import api from "@/lib/api";

function LoginForm() {
    const formSchema = z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().nonempty("Password is required"),
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [resErr, setResErr] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (resErr) setResErr(null);
        try {
            const res = await api.post("/api/v1/auth/login", {
                email_address: values.email,
                password: values.password,
            });
            if (res.status == 200) {
                window.location.href = "/";
            }
        } catch (error: any) {
            setResErr(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="w-full max-w-md space-y-6 p-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome Back
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to your account
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="hello@mail.com"
                                        {...field}
                                        autoComplete="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={
                                                isPasswordVisible
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="********"
                                            {...field}
                                            autoComplete="current-password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                            onClick={() =>
                                                setIsPasswordVisible((p) => !p)
                                            }
                                            aria-label={
                                                isPasswordVisible
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {isPasswordVisible ? (
                                                <AiOutlineEyeInvisible className="h-5 w-5" />
                                            ) : (
                                                <AiOutlineEye className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage>{resErr}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium underline underline-offset-4"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? "Signing in..."
                            : "Sign In"}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        OR CONTINUE WITH
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <Button
                    variant="outline"
                    className="w-full gap-2 cursor-pointer"
                    type="button"
                >
                    <FcGoogle className="h-5 w-5" />
                    <span>Continue with Google</span>
                </Button>

                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium underline underline-offset-4"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
