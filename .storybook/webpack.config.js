// https://github.com/storybooks/storybook/issues/270#issuecomment-318101549
// this config augments the storybook one with support for node modules
// storybook does not have support for node moduels out of the box
// if CRA were to be present, storybook webpack augment those configs
module.exports = {
  module: {
    rules: [
      {
        test: /\.module.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
};
