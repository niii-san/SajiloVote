import Link from "next/link";
import { headers } from "next/headers";

export default async function NotFound() {
    const headersList = await headers();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-red-500">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600">
                        The page you're looking for doesn't exist or has been
                        moved.
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
