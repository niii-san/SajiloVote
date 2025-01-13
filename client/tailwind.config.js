/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#1e1f6e",
                secondary: "#cbe4fe",
                background: "#eef0f2",
                dark_text: "#1D1616",
            },
        },
    },
    plugins: [],
};
