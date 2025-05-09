import Link from "next/link";

export default async function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-red-500">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-block px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
