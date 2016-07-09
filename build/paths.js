var path = require('path');
var fs = require('fs');

// hide warning //
var emitter = require('events');
emitter.defaultMaxListeners = 20;

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

var paths = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  packageName: pkg.name,
  useTypeScriptForDTS: false,
  importsToAdd: [],
  sort: true,
  styleSource: 'styles/input.less',
  styleOutput: 'styles'
};

paths.ignore = ['aurelia-dialog.js'];
paths.files = [
  'dialog-options.js',
  'dialog-result.js',
  'ai-dialog-body.js',
  'ai-dialog-footer.js',
  'ai-dialog-header.js',
  'ai-dialog.js',
  'attach-focus.js',
  'lifecycle.js',
  'dialog-controller.js',
  'renderer.js',
  'dialog-renderer.js',
  'dialog-service.js',
  'dialog-configuration.js',
  'aurelia-dialog.js'
  ].map(function(file){
  return paths.root + file;
});

paths.sample = 'sample';

module.exports = paths;
