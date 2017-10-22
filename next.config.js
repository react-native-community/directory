module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.map(rule => {
      if (rule.loader === 'babel-loader') {
        rule.options.babelrc = true;
      }

      return rule;
    });

    return config;
  },
};
