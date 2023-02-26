/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(25,23,17,0.6)",
      },
      fontFamily: {
        // sans: ["gotham"],
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
