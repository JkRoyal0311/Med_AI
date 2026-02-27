module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary:   "#0D7377",
        secondary: "#14BDAC",
        accent:    "#F4A261",
        danger:    "#E76F51",
        bg:        "#F8FAFB",
        card:      "#FFFFFF",
        text:      "#1A1A1A",
        muted:     "#6B7280",
      }
    }
  },
  plugins: [],
};
