/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#fafaff",
                secondary: "#1c1c1c",
                background: "#eef0f2",
            },
        },
    },
    plugins: [],
};
