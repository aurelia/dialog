const path = require('path');
const { AureliaPlugin } = require('aurelia-webpack-plugin');

module.exports = function(config) {
  const browsers = config.browsers;
  config.set({

    basePath: '',
    frameworks: ["jasmine"],
    files: ["test/**/*.spec.ts"],
    preprocessors: {
      "test/**/*.spec.ts": ["webpack"],
    },
    webpack: {
      mode: "development",
      entry: 'test/setup.ts',
      resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", 'test', "node_modules"],
        alias: {
          src: path.resolve(__dirname, "src"),
          test: path.resolve(__dirname, 'test'),
          'aurelia-dialog': path.resolve(__dirname, 'src/aurelia-dialog.ts')
        }
      },
      devtool: browsers.indexOf('ChromeDebugging') > -1 ? 'eval-source-map' : 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
              compilerOptions: {
                sourceMap: true
              }
            }
          },
          {
            test: /\.html$/i,
            loader: 'html-loader'
          }
        ]
      },
      plugins: [
        new AureliaPlugin({ dist: 'es2015' })
      ]
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ["mocha"],
    webpackServer: { noInfo: config.noInfo },
    browsers: browsers && browsers.length > 0 ? browsers : ['ChromeHeadless'],
    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"],
        debug: true
      }
    },
    singleRun: false,
    mochaReporter: {
      ignoreSkipped: true
    },
    webpackMiddleware: {
      logLevel: 'silent'
    },
  });
};
