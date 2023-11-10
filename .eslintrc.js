module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ["@babel/preset-env"],
    },
  },
  settings: {
    rules: {},
    "import/resolver": {
      alias: {
        map: [
          // ["babel-polyfill", "babel-polyfill/dist/polyfill.min.js"],
          // ["helper", "./utils/helper"],
          // ["material-ui/DatePicker", "../custom/DatePicker"],
          // ["material-ui", "material-ui-ie10"],
        ],
        extensions: [".ts", ".js", ".jsx", ".json"],
      },
    },
  },
};
