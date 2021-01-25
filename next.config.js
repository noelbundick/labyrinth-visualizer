// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        // NOTE on rationale for '/:any*':
        //   https://colinhacks.com/essays/building-a-spa-with-nextjs
        source: '/:any*',
        destination: '/',
      },
    ];
  },

  webpack: function (config) {
    // https://github.com/vercel/next.js/issues/3141
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'raw-loader',
        // use: 'js-yaml-loader',
      },
      // {
      //   test: /\.md$/,
      //   use: 'raw-loader',
      // }
    );

    // https://github.com/3rd-Eden/useragent/pull/117
    config.node = {
      fs: "empty",
    };

    return config;
  },
};


