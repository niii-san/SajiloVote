"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
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
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { AxiosError } from "axios";

const formSchema = z
    .object({
        firstName: z.string().nonempty("First name is required"),
        lastName: z.string().nonempty("Last name is required"),
        email: z
            .string()
            .nonempty("Email address is required")
            .email("Invalid email address format"),
        password: z
            .string()
            .nonempty("Password is required")
            .min(8, "At least 8 character long")
            .max(25, "Not longer than 25 characters"),
        confirmPassword: z.string().nonempty("Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resErr, setResErr] = useState<null | string>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (resErr) setResErr(null);
        try {
            const payload = {
                first_name: values.firstName,
                last_name: values.lastName,
                email_address: values.email,
                password: values.password,
            };
            await api.post("/api/v1/auth/signup", payload);
            router.push("/login");
            toast.success("Account created! Continue to login.", {
                duration: 4000,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                setResErr(error?.response?.data?.message);
            }
        }
    };

    return (
        <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/signup-image.jpg"
                    alt="Signup Illustration"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Join SajiloVote
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your account to get started
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="your@mail.com"
                                                {...field}
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
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="********"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <AiOutlineEyeInvisible className="h-5 w-5" />
                                                    ) : (
                                                        <AiOutlineEye className="h-5 w-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="********"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword,
                                                        )
                                                    }
                                                >
                                                    {showConfirmPassword ? (
                                                        <AiOutlineEyeInvisible className="h-5 w-5" />
                                                    ) : (
                                                        <AiOutlineEye className="h-5 w-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        {(resErr ||
                                            form.formState.errors
                                                .confirmPassword) && (
                                            <FormMessage>{resErr}</FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                            >
                                Create Account
                            </Button>
                        </form>
                    </Form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="underline underline-offset-4">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-4">
                            Privacy Policy
                        </a>
                    </p>

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
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;
