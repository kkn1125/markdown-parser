import { defineConfig, loadEnv } from "vite";
import path from "path";
import dotenv from "dotenv";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  dotenv.config({
    path: path.join(path.resolve(), ".env"),
  });
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      host: process.env.HOST,
      port: +(process.env.PORT || 5000),
    },
    base: process.env.NODE_ENV === "development" ? "/" : "/wiki/",
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve("src") },
        { find: "@core", replacement: path.resolve("src/core") },
        { find: "@modules", replacement: path.resolve("src/core/modules") },
        { find: "@script", replacement: path.resolve("src/script") },
      ],
    },
    build: {
      minify: "terser",
      cssMinify: true,
      terserOptions: {
        keep_classnames: true,
      },
    },
  };
});
