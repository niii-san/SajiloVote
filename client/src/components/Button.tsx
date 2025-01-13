import * as React from "react";
import { cn } from "../lib/utils";

type Variant = "filled" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant: Variant;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

const Button = ({
    children,
    variant,
    className,
    loading = false,
    disabled = false,
    onClick,
    ...props
}: ButtonProps) => {
    const baseStyle =
        "w-full py-2 border-2 border-primary rounded-lg text-background text-base flex justify-center items-center cursor-pointer transition ease-in-out duration-300";

    const ButtonVariants = {
        outline: "text-dark_text hover:bg-primary hover:bg-opacity-20",
        filled: "bg-primary hover:bg-opacity-80 ",
    };

    const disabledStyle =
        "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed hover:bg-gray-300";
    const loadingStyle = "cursor-wait opacity-80";

    const buttonVariant = !disabled
        ? ButtonVariants[variant] || ButtonVariants.filled
        : disabledStyle;

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        onClick?.(); // Only call the onClick if not disabled/loading
    };

    return (
        <button
            disabled={disabled}
            onClick={handleClick}
            className={cn(
                `${baseStyle} ${buttonVariant} ${disabled ? disabledStyle : ""} ${loading ? loadingStyle : ""}`,
                className,
            )}
            {...props}
        >
            {loading ? (
                <div className="flex justify-center items-center gap-x-2">
                    <span className="w-6 h-6 border-4 border-t-primary border-secondary rounded-full animate-spin"></span>
                    <span>{children}</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
