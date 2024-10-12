const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#EDE9FE",
          300: "#C4B5FD",
          600: "#7C3AED",
        },
        secondary: {
          100: "#FEEFED",
          300: "#75E3EA",
          600: "#1DB5BE",
        },
        neutral: {
          300: "#D1D5DB",
          500: "#6B7280",
          700: "#374151",
          900: "#111827",
        }
      },
    },
  },
  plugins: [flowbite.plugin()],
};
