module.exports = {
  parser: "espree", // Use default JS parser
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "next/core-web-vitals", // You can keep Next.js config
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  // additional settings
};
