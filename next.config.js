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
};
