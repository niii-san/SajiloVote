import * as React from "react";
import { cn } from "../lib/utils";

type Variant = "filled" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant: Variant;
    className?: string;
}

const Button = ({ children, variant, className, ...props }: ButtonProps) => {
    const ButtonVarients = {
        outline: "",
        filled: "bg-secondary",
    };

    const buttonVariant = ButtonVarients[variant] || ButtonVarients.filled;

    return (
        <button className={cn(`${buttonVariant}`, className)} {...props}>
            {children}
        </button>
    );
};

export default Button;
