import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      rootDir: "src",
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
    }),
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
    }),
  ],
  external: ["lit", "lit/decorators.js", "tslib"],
};
