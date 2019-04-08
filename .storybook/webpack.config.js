// https://github.com/storybooks/storybook/issues/270#issuecomment-318101549
// this config augments the storybook one with support for css modules
// storybook does not have support for css modules out of the box
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
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourcemap: true
            }
          }
        ]
      }
    ]
  }
};
