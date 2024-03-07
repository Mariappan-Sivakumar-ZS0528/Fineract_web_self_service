'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

var paths = gulp.paths;

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {

  gulp.src(paths.e2e + '/**/*.js')
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
}

gulp.task('protractor',runProtractor, ['protractor:src']);
gulp.task('protractor:src',runProtractor, ['serve:e2e', 'webdriver-update']);
gulp.task('protractor:dist',runProtractor, ['serve:e2e-dist', 'webdriver-update']);
