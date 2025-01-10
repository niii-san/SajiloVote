import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    htmlFor?: string;
}

const Label = ({ children, htmlFor, ...props }: LabelProps) => {
    return (
        <label htmlFor={htmlFor ?? ""} {...props}>
            {children}
        </label>
    );
};

export default Label;
