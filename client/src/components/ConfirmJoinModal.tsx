import { ReactElement } from "react";

interface ConfirmJoinModalProps {
    setModalFn: (state: boolean) => void;
    onConfirmFn: () => void;
    loading: boolean;
    className?: string;
}

function ConfirmJoinModal({
    setModalFn,
    onConfirmFn,
    loading,
    className,
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
                <h3 className="text-xl font-semibold mb-4">Confirm Join</h3>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to join this event? This action cannot
                    be undone.
                </p>

                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={() => !loading && setModalFn(false)}
                        disabled={loading}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirmFn}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Confirm Join"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmJoinModal;
