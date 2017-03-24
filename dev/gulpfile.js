// Include gulp.
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var config = require('./config.json');

// Include plugins.
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var shell = require('gulp-shell');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefix = require('gulp-autoprefixer');
var glob = require('gulp-sass-glob');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssclean = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

// CSS.
gulp.task('css', function() {
  return gulp.src(config.css.src)
    .pipe(glob())
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
        }) (error);
        this.emit('end');
      }}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact',
      errLogToConsole: true,
      includePaths: config.css.includePaths
    }))
    .pipe(autoprefix('last 2 versions', 'ie >= 9', 'and_chr >= 2.3'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.css.dest))
    .pipe(browserSync.reload({ stream: true, match: '**/*.css' }));
});

//JS - Vendor JS
//Execute after including new js libraries: gulp vendorjs
var vendorLisJs = []
gulp.task('vendorjs', function() {
    return gulp.src(vendorLisJs)
        .pipe(concat('vendor-scripts.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(rename('vendor-scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
});

//CSS - Vendor CCS
//Execute after including new js libraries: gulp vendorcss
var vendorListCss = []
gulp.task('vendorcss', function() {
  return gulp.src(vendorListCss)
    .pipe(concat('vendor-styles.css'))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename('vendor-styles.min.css'))
    //.pipe(cssclean())
    .pipe(gulp.dest('assets/css'));
});

// Compress images.
gulp.task('images', function () {
  return gulp.src(config.images.src)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest(config.images.dest));
});

// Watch task.
gulp.task('watch', function() {
  gulp.watch(config.css.src, ['css']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.html.src);
});

// Static Server + Watch
gulp.task('serve', ['css', 'watch'], function() {
  browserSync.init({
    // proxy: config.proxy
    server: {
      baseDir: config.server.baseDir
    }
  });
});

// Default Task
gulp.task('default', ['serve']);
