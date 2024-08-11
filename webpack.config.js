import path from "path";

const __dirname = path.resolve();

export default {
  mode: "development",
  entry: "./chat/js/main.js",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "chat/js/"),
  },
};
