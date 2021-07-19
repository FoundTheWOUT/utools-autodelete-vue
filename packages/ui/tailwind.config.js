module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: "class",
  theme: {
    maxWidth: {
      xxs: "8rem",
    },
    extend: {
      animation: {
        flow: "flow 0.5s ease",
      },
      keyframes: {
        flow: {
          "0%": { transform: "translateY(20px)" },
        },
      },
      boxShadow: {
        white: "0 10px 15px -3px rgba(77,84,93,0.9)",
        red: "0 10px 15px -3px rgba(250,198,198,0.9)",
        "dark-red": "0 10px 15px -3px rgba(130,0,20,0.9)",
        green: "0 10px 15px -3px rgba(222,245,199,0.9)",
        "dark-green": "0 10px 15px -3px rgba(19,82,0,0.9)",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderWidth: ["hover"],
      borderColor: ["checked"],
      scale: ["active"],
      boxShadow: ["active", "dark"],
    },
  },
  plugins: [],
};
