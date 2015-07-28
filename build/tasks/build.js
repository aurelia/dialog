var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var es = require('event-stream');

gulp.task('build-es6', function () {
  return gulp.src(paths.source)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-commonjs', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'common'})))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'amd'})))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(gulp.dest(paths.output + 'system'));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
  var amdHtml = gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output+"amd"));

  var sysHtml = gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output+"system"));

  var commonHtml = gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output+"commonjs"));

    return es.concat(amdHtml, sysHtml, commonHtml);
});

gulp.task('build-css', function () {
  var lessSettings = { paths: [paths.root] };

  return gulp.src(paths.less)
    .pipe(less(lessSettings))
    .pipe(gulp.dest(paths.styleFolder));
});

gulp.task('minifyCSS', function () {
    //minify the css after compiling the SaaS files
    var amdCSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"amd"));

     var sysCSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"system"));

     var commonCSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"commonjs"));

     return es.concat(amdCSS,sysCSS,commonCSS);
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-commonjs', 'build-amd', 'build-system','build-html'],
    'build-css', 'minifyCSS',
    callback
  );
});