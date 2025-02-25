import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-primary text-gray-300 border-t border-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4">
                        <span className="text-xl font-bold text-secondary cursor-pointer">
                            NISHAN BISTA
                        </span>
                    </div>
                    <div className="text-sm space-y-2">
                        <p className="hover:text-white transition-colors cursor-pointer">
                            © {new Date().getFullYear()} All Rights Reserved
                        </p>
                        <p className="text-xs text-gray-500">
                            Crafted with passion and precision
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
