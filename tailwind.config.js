/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  darkMode: "selector",
  theme: {
    extend: {
      size: {
        "1.5": "0.375rem",
      },
      boxShadow: {
        "card-hover": "0px 0px 0px 11px var(--shadow-color)",
        "focus-visible": "0 0 0 4px var(--shadow-color)",
      },  
      gridTemplateColumns: {
        "countries": "repeat(auto-fill, minmax(220px, 1fr))",
      },
    },
  },
  plugins: [],
}
