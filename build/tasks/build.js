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

gulp.task('build-html-es6', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-es6', ['build-html-es6'], function () {
  return gulp.src(paths.source)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-html-commonjs', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-commonjs', ['build-html-commonjs'], function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'common'})))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-html-amd', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-amd', ['build-html-amd'], function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'amd'})))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-html-system', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-system', ['build-html-system'], function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-css', function () {
  var lessSettings = { paths: [paths.root] };

  return gulp.src(paths.less)
    .pipe(less(lessSettings))
    .pipe(gulp.dest(paths.styleFolder));
});

gulp.task('minifyCSS', function () {
    var amdCSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"amd"));

    var sysCSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"system"));

    var commonCSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"commonjs"));

     var es6CSS = gulp.src(paths.style)
     .pipe(minifyCSS({ keepBreaks: false }))
     .pipe(gulp.dest(paths.output+"es6"));

    return es.concat(amdCSS,sysCSS,commonCSS,es6CSS);
});

gulp.task('build-html-system', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-system', ['build-html-system'], function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-commonjs', 'build-amd', 'build-system', 'build-es6', 'build-css'],
    'minifyCSS',
    callback
  );
});
