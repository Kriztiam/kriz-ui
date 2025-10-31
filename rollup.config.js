import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import swcPlugin from "@rollup/plugin-swc";
import terser from "@rollup/plugin-terser";
import svgr from "@svgr/rollup";
import cssnano from "cssnano";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import { defineConfig } from "rollup";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import preserveDirectives from "rollup-preserve-directives";
import { fileURLToPath } from "url";

function minifyCssPlugin() {
  return {
    name: "minify-css",
    async writeBundle(options) {
      const outputDir = options.dir || path.dirname(options.file);
      const cssFiles = [];

      function walk(dir) {
        for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) walk(fullPath);
          else if (file.isFile() && file.name.endsWith(".css"))
            cssFiles.push(fullPath);
        }
      }

      walk(outputDir);

      if (cssFiles.length === 0) {
        console.log("No CSS files found to minify.");
        return;
      }

      const processor = postcss([cssnano({ preset: "default" })]);

      for (const file of cssFiles) {
        const css = fs.readFileSync(file, "utf8");
        const result = await processor.process(css, { from: file, to: file });
        fs.writeFileSync(file, result.css);
      }

      console.log("All CSS files minified successfully!");
    },
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    input: {
      index: "src/index.ts",
    },
    output: {
      dir: "dist",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      del({ targets: "dist" }),
      preserveDirectives(),
      peerDepsExternal(),
      alias({
        entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
      }),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".svg"],
      }),
      svgr({
        icon: "1.25em",
        svgProps: {
          fill: "currentColor",
        },
      }),
      swcPlugin({
        tsconfig: "./tsconfig.json",
        exclude: ["node_modules/**", "**/*.css", "**/*.module.css"],
      }),
      copy({
        targets: [{ src: "src/**/*.css", dest: "dist" }],
        flatten: false,
      }),
      terser({ compress: { directives: false } }),
      minifyCssPlugin(),
    ],
    external: (id) => id.endsWith(".module.css"),
  },
  {
    input: "src/index.ts",
    output: { file: "dist/index.d.ts", format: "esm" },
    plugins: [
      alias({
        entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
      }),
      dts(),
    ],
    external: (id) => id.endsWith(".svg"),
  },
]);
