import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthStore } from "../../../../stores";
import { Loader } from "../../../../components";
import { api, capitalize } from "../../../../utils";
import { useState } from "react";
import toast from "react-hot-toast";

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
        console.log("update last name");
    };
    const updateEmail = async () => {
        console.log("update email");
    };

    return (
        <div>
            <h1>Account settings</h1>
            <div>
                <div>
                    first name :
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {firstName !== userData.first_name &&
                        firstName !== capitalize(userData.first_name ?? "") && (
                            <button onClick={updateFirstName}>update</button>
                        )}
                    {firstNameErr && <span>{firstNameErr}</span>}
                </div>

                <div>
                    last name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {lastName !== userData.last_name &&
                        lastName !== capitalize(userData?.last_name ?? "") && (
                            <button onClick={updateLastName}>update</button>
                        )}
                    {lastNameErr && <span>{lastNameErr}</span>}
                </div>
                <div>
                    email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {email !== userData.email &&
                        email.toLowerCase() !== userData.email && (
                            <button onClick={updateEmail}>update</button>
                        )}
                    {emailErr && <span>{emailErr}</span>}
                </div>

                <div>
                    <Link to={"/settings/update-password"}>
                        <button>Update password</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
