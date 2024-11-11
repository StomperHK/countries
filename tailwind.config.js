/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  darkMode: "selector",
  theme: {
    extend: {
      gridTemplateColumns: {
        "countries": "repeat(auto-fill, minmax(220px, 1fr))",
      },
    },
  },
  plugins: [],
}

