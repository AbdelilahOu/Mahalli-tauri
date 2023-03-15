/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00BBF0",
      },
      transitionProperty: {
        width: "width",
      },
      screens: {},
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
