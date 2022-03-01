import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  publicPath: './',
  history: 'hash',
  hash: true, //添加hash后缀
  treeShaking: true,
  exportStatic: false,
  targets: {
    ie: 10,
    chrome: 47,
    firefox: 40,
    ios: 7,
    android: 4,
  },
  cssnano: {
    mergeRules: false,
  },
  autoprefixer: { flexbox: true },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: '二维码识别',
        dll: true,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};

export default config;
