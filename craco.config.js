const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        process: require.resolve('process/browser'),
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        fs: false,
        net: false,
        http: require.resolve('stream-http'),
        url: require.resolve('url/'),
        buffer: require.resolve('buffer/'),
        assert: require.resolve('assert/'),
        util: require.resolve('util/'),
        express: false 
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser'
        }),
        new webpack.IgnorePlugin({ resourceRegExp: /^express$/ })
      );

      return webpackConfig;
    }
  }
};
