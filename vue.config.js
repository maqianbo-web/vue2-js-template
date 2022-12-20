//  yarn add image-webpack-loader webpack-bundle-analyzer -D
const path = require("path");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === "production";
const isDevelopment = NODE_ENV === "development";

// 多页面打包配置
const getPages = () => {
  return {
    index: {
      entry: "src/pages/index/main.js", // page 的入口
      template: "public/index.html", // 模板来源
      filename: "index.html", // 在 dist/index.html 的输出
      title: "首页", // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    list: {
      entry: "src/pages/list/main.js", // page 的入口
      template: "public/index.html", // 模板来源
      filename: "list.html",
      title: "列表页面",
      chunks: ["chunk-vendors", "chunk-common", "list"],
    },
  };
};

const getDevServe = () => {
  const devServer = {
    overlay: {
      warnings: false, // 让浏览器 overlay 同时显示警告和错误
      errors: true,
    },
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    hotOnly: true, // 热更新
    proxy: {
      // 配置多个跨域
      "/api": {
        target: "http://xxx.xxx",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  };
  if (isDevelopment) {
    // 配置开发环境  访问路径跳转相关的html   http://localhost:8088/list#/ =>  http://localhost:8088/list.html#/
    const pages = getPages();
    Object.keys(pages).forEach((page) => {
      Reflect.set(devServer.proxy, `/${page}`, {
        target: "./",
        bypass: (req) => {
          const { path } = req;
          return path.indexOf("html") !== -1 ? path : `${path}.html`;
        },
      });
    });
  }
};

const getChainWebpack = (config) => {
  config.module
    .rule("images")
    .use("image-webpack-loader")
    .loader("image-webpack-loader")
    .options({
      bypassOnDebug: true,
    })
    .end();
  if (isProduction) {
    config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
      {
        analyzerMode: "static",
      },
    ]); // 打包环境做打包后文件大小分析展示
  }
};

const setOptimization = (config) => {
  // 提取公共chunk和node_modules的公共文件
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        common: {
          //抽取所有入口页面都需要的公共chunk
          name: "chunk-common",
          chunks: "initial",
          minChunks: 2,
          priority: 1,
          enforce: true,
          minSize: 0,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "chunk-vendors",
          chunks: "all",
        }, // node_modules的打包文件
      },
    },
  };
};

module.exports = {
  pages: getPages(), // 入口文件配置
  publicPath: "./", // 打包资源引入，使用相对路径的引入，打出来的包可以被部署在任意路径
  lintOnSave: !isProduction, // 生产环境禁用eslint-loader，可以加快生产构建
  parallel: true, // 是否为 Babel 或 TypeScript 使用 thread-loader，多线程打包
  css: {
    requireModuleExtension: false, // 去除 样式文件的 .module 后缀
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/style/variable.less")], // 设置less变量覆盖，一般用来覆盖elementUI组件的样式风格
    },
  }, //这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项
  devServer: getDevServe(), // 开发环境dev-serve配置
  chainWebpack: (config) => getChainWebpack(config), // 通过 webpack-merge 合并到最终的配置中
  configureWebpack: (config) => {
    setOptimization(config);
  }, // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。 一般可以用来做config的一些配置的更改
};
