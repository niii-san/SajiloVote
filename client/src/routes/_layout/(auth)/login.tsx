import {
    createFileRoute,
    Link,
    useNavigate,
    useSearch,
} from "@tanstack/react-router";
import { Input, Label, Button } from "../../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { api } from "../../../utils";
import { useAuthStore } from "../../../stores";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Route = createFileRoute("/_layout/(auth)/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const login = useAuthStore((state) => state.login);

    const [loading, setLoading] = useState<boolean>(false);
    const [resErr, setResErr] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearch({ from: "" });

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
            await api.post("/api/v1/auth/login", payload);
            navigate({ to: "/" });
            login();
        } catch (error: any) {
            setResErr(error.response?.data?.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const redirectTo = searchParams?.redirect || "/";
            navigate({ to: redirectTo });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* Logo Section */}
            <div className="mb-8 flex flex-col items-center">
                <div className="bg-primary text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center mb-2">
                    LOGO
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Who Wins</h1>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500">Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <Label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <Label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <a
                            href="#"
                            className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Error Message */}
                    {resErr && (
                        <div className="text-red-600 text-sm text-center">
                            {resErr}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="filled"
                        loading={loading}
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                    >
                        Sign In
                    </Button>

                    {/* Signup Link */}
                    <div className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
