/** Configures JavaScript and JSX transforms for the installed Expo SDK. */
module.exports = function configureBabel(api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
