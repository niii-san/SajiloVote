function Loader() {
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-primary to-primary/60 backdrop-blur-sm">
            <div className="relative">
                {/* Spinner */}
                <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-transparent animate-spin"></div>

                {/* Pulse effect */}
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-gray-300/30"></div>
            </div>
        </div>
    );
}

export default Loader;
