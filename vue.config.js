// eslint-disable-next-line no-unused-vars
const path = require('path');

module.exports = {
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      externals: ['mariadb'],
      nodeIntegration: true,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          additionalData: `@import "@/assets/sass/global.scss";`,
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/check-licences': {
        target: 'http://localhost',
        changeOrigin: true,
        pathRewrite: { '^/check-licences': '/check-licences' },
      },
    },
  },
};
