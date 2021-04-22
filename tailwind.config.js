module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxWidth: {
      xxs: "8rem",
    },
    extend: {},
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
