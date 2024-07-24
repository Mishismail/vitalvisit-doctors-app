// frontend/webpack.config.js

module.exports = {
    // other configurations...
    module: {
      rules: [
        // other rules...
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/redux-thunk/,
            /node_modules\/redux/,
          ],
        },
      ],
    },
  };
  