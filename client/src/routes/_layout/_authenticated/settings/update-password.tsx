import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../../stores";
import { Loader, Button } from "../../../../components";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../utils";
import { FiLock, FiLoader, FiArrowLeft } from "react-icons/fi";

export const Route = createFileRoute(
    "/_layout/_authenticated/settings/update-password",
)({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const userData = useAuthStore((state) => state.userData);

    if (!userData) {
        return <Loader />;
    }

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [passwordUpdating, setPasswordUpdating] = useState<boolean>(false);
    const [resError, setResError] = useState<string | null>(null);

    const handleUpdatePassword = async () => {
        if (passwordUpdating) {
            toast.error("Please wait for the previous request to finish");
            return;
        }
        setPasswordUpdating(true);
        try {
            const res = await api.put("/api/v1/users/update/password", {
                old_password: oldPassword,
                new_password: newPassword,
            });
            if (res.data.success) {
                toast.success("Password updated");
                navigate({ to: "/settings" });
            }
        } catch (error: any) {
            setResError(error.response.data.message ?? "Something went wrong");
        } finally {
            setPasswordUpdating(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate({ to: "/settings" })}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-800 text-sm"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Settings
                </button>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <FiLock className="text-blue-600" />
                        Change Password
                    </h1>

                    <div className="space-y-6">
                        {/* Old Password */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FiLock className="text-gray-500" />
                                Old Password
                            </label>
                            <div className="md:col-span-2">
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FiLock className="text-gray-500" />
                                New Password
                            </label>
                            <div className="md:col-span-2">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {resError && (
                            <div className="text-red-600 text-sm mt-2">
                                {resError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6 border-t mt-6">
                            <Button
                                onClick={handleUpdatePassword}
                                className="w-full px-6 py-3 mx-auto  text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                disabled={passwordUpdating}
                            >
                                {passwordUpdating ? (
                                    <>
                                        <FiLoader className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiLock className="w-4 h-4" />
                                        Update Password
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
