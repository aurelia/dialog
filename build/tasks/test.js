var gulp = require('gulp');
var karma = require('karma');

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    var server = new karma.Server({
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true
    }, function(e) {
        done();
    });
    server.start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    var server = new karma.Server({
        configFile: __dirname + '/../../karma.conf.js'
    }, function(e) {
        done();
    });
    server.start();
});

/**
 * Run test once with code coverage and exit
 */
gulp.task('cover', function (done) {
  var server = new karma.Server({
    configFile: __dirname + '/../../karma.conf.js',
    singleRun: true,
    reporters: ['coverage'],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'build/reports/coverage'
    }
  }, function (e) {
    done();
  });
  server.start();
});
