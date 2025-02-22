import { ReactElement } from "react";
import Button from "./Button";

interface ConfirmJoinModalProps {
    setModalFn: (state: boolean) => void;
    onConfirmFn: () => void;
    loading: boolean;
    className?: string;
    resErr: string | null;
}

function ConfirmJoinModal({
    setModalFn,
    onConfirmFn,
    loading,
    className,
    resErr, // Added resErr to destructured props
}: ConfirmJoinModalProps): ReactElement {
    const handleBackdropClick = () => {
        if (!loading) {
            setModalFn(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-xl p-6 w-full max-w-md ${className || ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold mb-4 text-center">
                    Confirm Join
                </h3>

                {/* Error message display */}
                <p className="text-gray-600 mb-6 text-center">
                    Are you sure to join this event?
                </p>
                {resErr && (
                    <div
                        role="alert"
                        className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <span className="text-sm">{resErr}</span>
                    </div>
                )}

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => !loading && setModalFn(false)}
                        disabled={loading}
                        className="px-4 py-2"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirmFn}
                        disabled={loading}
                        className="px-4 py-2"
                    >
                        {loading ? "Joining" : "Join"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmJoinModal;
