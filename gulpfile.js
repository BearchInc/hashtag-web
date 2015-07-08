var gulp = require('gulp')
  , gutil = require('gulp-util')
  , watch = require('gulp-watch')
  , concat = require('gulp-concat-sourcemap')
  , sass = require('gulp-sass')
  , templateCache = require('gulp-angular-templatecache')
  , del = require('del')
  , runSequence = require('run-sequence')
  , rev = require('gulp-rev')
  , plumber = require('gulp-plumber')

var paths = {
  appSass: [
    'app/scss/app.scss',
    'bower_components/ladda/dist/ladda-themeless.min.css',
    'bower_components/angular-flash-alert/dist/angular-flash.css',
  ],
  sassWatch: 'app/scss/**/*.scss',
  sassBootstrap: 'bower_components/bootstrap-sass-official/assets/stylesheets',
  appJs: [
    'app/js/app.js',
    'app/js/**/*.js',
  ],
  appViews: 'app/public/views/**/*.html',
  appLibs: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-ui-select/dist/select.min.js',
    'bower_components/angular-strap/dist/angular-strap.js',
    'bower_components/angular-strap/dist/angular-strap.tpl.js',
    'bower_components/moment/moment.js',
    'bower_components/ladda/js/spin.js',
    'bower_components/ladda/js/ladda.js',
    'bower_components/angular-ladda/dist/angular-ladda.js',
    'bower_components/angular-bootstrap/ui-bootstrap.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-flash-alert/dist/angular-flash.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js'
  ],

  termsSass: 'app/scss/terms.scss',

  dist: 'app/public/dist',
  distFiles: [
    'app/public/dist/app.css',
    'app/public/dist/app.js',
    'app/public/dist/app_libs.js',
    'app/public/dist/app_views.js',
    'app/public/dist/terms.css',
  ]
}

/* APP */

gulp.task('app_css', function () {
  return gulp.src(paths.appSass)
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message))
        this.emit('end')
    }))
    .pipe(sass({ includePaths: [ paths.sassBootstrap ] }))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('app_js', function() {
  return gulp.src(paths.appJs)
    .pipe(concat('app.js', { sourceRoot: '../', prefix: 2 }))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('app_libs', function() {
  return gulp.src(paths.appLibs)
    .pipe(concat('app_libs.js', { sourceRoot: '../', prefix: 2 }))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('app_views', function () {
  return gulp.src(paths.appViews)
    .pipe(concat('app_views.js'))
    .pipe(gulp.dest(paths.dist))
})

/* TERMS */

gulp.task('terms_css', function () {
  return gulp.src(paths.termsSass)
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message))
        this.emit('end')
    }))
    .pipe(sass())
    .pipe(gulp.dest(paths.dist))
})

/* DIST */

gulp.task('clean', function (cb) {
  del(paths.dist, cb)
})

gulp.task('revision', function () {
  return gulp.src(paths.distFiles)
    .pipe(rev())
    .pipe(gulp.dest(paths.dist))
    .pipe(rev.manifest({ path: 'dist_manifest.json' }))
    .pipe(gulp.dest(paths.dist))
});

/*
  COMMAND LINE TASKS
*/

gulp.task('watch', function () {
  watch(paths.sassWatch, function () { runSequence('app_css', 'terms_css', 'revision') })
  watch(paths.appJs,     function () { runSequence('app_js',    'revision') })
  watch(paths.appViews,  function () { runSequence('app_views', 'revision') })
})

gulp.task('build', function (cb) {
  runSequence(['clean'],
              ['app_css', 'app_js', 'app_libs', 'app_views', 'terms_css'],
              ['revision'], cb)
})

gulp.task('default', function (cb) {
  runSequence('build', 'watch', cb)
})
