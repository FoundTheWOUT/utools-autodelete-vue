module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
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
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      scale: ["active"],
      boxShadow: ["active"],
    },
  },
  plugins: [],
};
