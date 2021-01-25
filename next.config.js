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
    // // https://github.com/vercel/next.js/issues/3141
    // config.module.rules.push(
    //   {
    //     test: /\.ya?ml$/,
    //     use: 'js-yaml-loader',
    //   },
    //   {
    //     test: /\.md$/,
    //     use: 'raw-loader',
    //   }
    // );

    // https://github.com/3rd-Eden/useragent/pull/117
    config.node = {
      fs: "empty",
    };

    // config.plugins.push(new MonacoWebpackPlugin());

    return config;
  },

  // https://stackoverflow.com/questions/59773190/monaco-editor-with-nextjs
  // cssLoaderOptions: { url: false }
};


