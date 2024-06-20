// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-unused-vars": "warn",
    "vue/no-unused-refs": "warn",
    "@typescript-eslint/no-explicit-any": "off",
  },
  ignores: [".output", "**/src-tauri/**"],
});
// Your custom configs here
