module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
      ["@babel/plugin-transform-runtime",
        {
          "regenerator": true
        }
      ],
      'istanbul',
    ],
  };
};
