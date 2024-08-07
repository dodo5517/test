import path from "path";

const __dirname = path.resolve();

export default {
  mode: "development",
  entry: "./app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
};
