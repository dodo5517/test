const path = require("path"); //여기서는 ES6 쓰면 안 됨.

const __dirname = path.resolve();

module.exports = {
  mode: "development",
  entry: "./app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
};
