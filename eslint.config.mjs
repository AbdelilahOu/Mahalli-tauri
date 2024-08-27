import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    ignores: [".output", "**/src-tauri/**"],
  },
  {
    rules: {
      "node/prefer-global/process": "off",
    },
  },
);
