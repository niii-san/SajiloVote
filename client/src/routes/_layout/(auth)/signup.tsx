import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Label, Input } from "../../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../../utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../../assets/logo.svg";

export const Route = createFileRoute("/_layout/(auth)/signup")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [signing, setSigning] = useState<boolean>(false);
    const [resErr, setResErr] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                .oneOf([yup.ref("password")], "Confirm password did not match")
                .required("Confirm password is required"),
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
            toast.success("Signed up successfully, Proceed to login", {
                duration: 5000,
            });
            reset();
            navigate({ to: "/login" });
        } catch (error: any) {
            setResErr(error?.response?.data?.message);
        } finally {
            setSigning(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center mt-20 p-4">
            {/* Logo Section */}
            <div className="mb-8 flex flex-col items-center">
                <img src={logo} alt="logo" className="w-56" />
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Your Account
                    </h2>
                    <p className="text-gray-500">Start your journey with us</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                type="text"
                                {...register("firstName")}
                                placeholder="John"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${errors.firstName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                type="text"
                                {...register("lastName")}
                                placeholder="Doe"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${errors.lastName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />
                            {errors.lastName && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
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
                            placeholder="your@email.com"
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

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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

                        <div>
                            <Label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register("confirmPassword")}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${errors.confirmPassword
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
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
                        loading={signing}
                        disabled={signing}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                    >
                        Create Account
                    </Button>

                    {/* Login Link */}
                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
