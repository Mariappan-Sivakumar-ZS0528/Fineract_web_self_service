'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    ghostMode:false,
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });
}

gulp.task('serve', function () {
  browserSyncInit([
    paths.tmp + '/serve',
    paths.src
  ], [    
    paths.src + '/src/**/*.js',
    paths.src + '/src/**/*.html',       
    paths.src + '/assets/images/**/*', 
    paths.tmp + '/serve/*.html',
    paths.tmp + '/serve/**/*.html',
    paths.tmp + '/serve/**/*.css'
  ]);
}, ['watch']);

gulp.task('serve:dist', function () {
  browserSyncInit(paths.dist);
}, ['build']);

gulp.task('serve:e2e', function () {
  browserSyncInit([paths.tmp + '/serve', paths.src], null, []);
}, ['inject']);

gulp.task('serve:e2e-dist', function () {
  browserSyncInit(paths.dist, null, []);
}, ['build']);
