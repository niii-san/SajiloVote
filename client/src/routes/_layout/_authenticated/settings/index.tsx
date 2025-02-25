import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthStore } from "../../../../stores";
import { Loader } from "../../../../components";
import { api, capitalize } from "../../../../utils";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    FiCheck,
    FiLock,
    FiLoader,
    FiEdit,
    FiMail,
    FiUser,
} from "react-icons/fi";

export const Route = createFileRoute("/_layout/_authenticated/settings/")({
    component: RouteComponent,
});

function RouteComponent() {
    const userData = useAuthStore((state) => state.userData);
    const invalidateUserData = useAuthStore((state) => state.setUserData);
    if (!userData) {
        return <Loader />;
    }

    const [firstName, setFirstName] = useState(
        capitalize(userData.first_name ?? ""),
    );
    const [firstNameUpdating, setFirstNameUpdating] = useState(false);
    const [firstNameErr, setFirstNameErr] = useState<string | null>(null);

    const [lastName, setLastName] = useState(
        capitalize(userData.last_name ?? ""),
    );
    const [lastNameUpdating, setLastNameUpdating] = useState(false);
    const [lastNameErr, setLastNameErr] = useState<string | null>(null);

    const [email, setEmail] = useState(userData.email ?? "");
    const [emailUpdating, setEmailUpdating] = useState(false);
    const [emailErr, setEmailErr] = useState<string | null>(null);

    const updateFirstName = async () => {
        if (lastNameUpdating || emailUpdating) {
            toast.error("Please wait other fields are updating");
            return;
        }
        setFirstNameUpdating(true);
        try {
            const res = await api.put("/api/v1/users/update/first-name", {
                new_first_name: firstName,
            });
            if (res.data.success) {
                invalidateUserData();
                toast.success("First name updated");
            }
        } catch (error: any) {
            setFirstNameErr(
                error.response.data.message ?? "Something went wrong",
            );
        } finally {
            setFirstNameUpdating(false);
        }
    };
    const updateLastName = async () => {
        if (firstNameUpdating || emailUpdating) {
            toast.error("Please wait other fields are updating");
            return;
        }
        setLastNameUpdating(true);

        try {
            const res = await api.put("/api/v1/users/update/last-name", {
                new_last_name: lastName,
            });
            if (res.data.success) {
                invalidateUserData();
                toast.success("Last name updated");
            }
        } catch (error: any) {
            setLastNameErr(
                error.response.data.message ?? "Something went wrong",
            );
        } finally {
            setLastNameUpdating(false);
        }
    };
    const updateEmail = async () => {
        if (firstNameUpdating || lastNameUpdating) {
            toast.error("Please wait other fields are updating");
            return;
        }
        setEmailUpdating(true);

        try {
            const res = await api.put("/api/v1/users/update/email", {
                new_email: email,
            });
            if (res.data.success) {
                invalidateUserData();
                toast.success("Email updated");
            }
        } catch (error: any) {
            setEmailErr(error.response.data.message ?? "Something went wrong");
        } finally {
            setEmailUpdating(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 border-b pb-4 flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        Account Settings
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* First Name Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FiUser className="text-gray-500" />
                            First Name
                        </label>
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${firstNameErr
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {firstNameUpdating ? (
                                    <FiLoader className="absolute right-3 top-3 animate-spin text-gray-500" />
                                ) : (
                                    firstName !== userData.first_name &&
                                    firstName !==
                                    capitalize(
                                        userData.first_name ?? "",
                                    ) && (
                                        <button
                                            onClick={updateFirstName}
                                            className="absolute right-3 top-3 text-green-600 hover:text-green-700"
                                        >
                                            <FiCheck className="w-5 h-5" />
                                        </button>
                                    )
                                )}
                            </div>
                            {firstNameErr && (
                                <p className="mt-1 text-sm text-red-600">
                                    {firstNameErr}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Last Name Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FiUser className="text-gray-500" />
                            Last Name
                        </label>
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${lastNameErr
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {lastNameUpdating ? (
                                    <FiLoader className="absolute right-3 top-3 animate-spin text-gray-500" />
                                ) : (
                                    lastName !== userData.last_name &&
                                    lastName !==
                                    capitalize(
                                        userData?.last_name ?? "",
                                    ) && (
                                        <button
                                            onClick={updateLastName}
                                            className="absolute right-3 top-3 text-green-600 hover:text-green-700"
                                        >
                                            <FiCheck className="w-5 h-5" />
                                        </button>
                                    )
                                )}
                            </div>
                            {lastNameErr && (
                                <p className="mt-1 text-sm text-red-600">
                                    {lastNameErr}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FiMail className="text-gray-500" />
                            Email Address
                        </label>
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${emailErr
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {emailUpdating ? (
                                    <FiLoader className="absolute right-3 top-3 animate-spin text-gray-500" />
                                ) : (
                                    email !== userData.email &&
                                    email.toLowerCase() !== userData.email && (
                                        <button
                                            onClick={updateEmail}
                                            className="absolute right-3 top-3 text-green-600 hover:text-green-700"
                                        >
                                            <FiCheck className="w-5 h-5" />
                                        </button>
                                    )
                                )}
                            </div>
                            {emailErr && (
                                <p className="mt-1 text-sm text-red-600">
                                    {emailErr}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password Update Section */}
                    <div className="border-t pt-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <FiLock className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Password
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <Link to={"/settings/update-password"}>
                                    <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 justify-center">
                                        <FiEdit className="w-4 h-4" />
                                        Update Password
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
