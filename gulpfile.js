// Gulp Requires Vars
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    webp = require('gulp-webp'),
    svgmin = require('gulp-svgmin');
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    base64 = require('gulp-base64'),
    imagemin = require('gulp-imagemin'),
    svg2png = require('gulp-svg2png'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    sitemap = require('gulp-sitemap'),
    notify = require('gulp-notify'),

// Compile Sass Task
gulp.task('sass', function () {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
      style: 'expanded',
      errLogToConsole: true,
      sourceComments: 'map'
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(base64({
      extensions: ['svg', 'png'],
      debug: true
    }))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Sass Compiled Successfully' }));
});

// Concat + Uglify Scripts Task
gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Optimize Images + Webp Support Task
gulp.task('images', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg,gif,png}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
    .pipe(webp({ quality: 60, lossless: false }))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Convert SVG to PNG
gulp.task('svg2png', function () {
  return gulp.src('src/images/**/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('dist/images'));
});

// Minify SVG Task
gulp.task('svgmin', function() {
  return gulp.src('src/images/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/images'));
});

// Generate Search Engine Friendly XML Sitemap
gulp.task('sitemap', function () {
  return gulp.src('./index.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'http://koy.io',
  }))
  .pipe(gulp.dest('./dist/'));
});

// Init Browser-Sync
gulp.task('browser-sync', function() {
  browserSync.init(["src/styles/*.scss", "dist/styles/*.css", "dist/scripts/*.js", "./*.html"], {
    server: {
      baseDir: "./"
    }
  });
});

// Clean Up Things
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});

// Default Gulp Task
gulp.task('default', ['clean', 'sass', 'scripts', 'images', 'svg2png', 'svgmin', 'browser-sync'], function () {
  gulp.watch("src/styles/*.scss", ['sass']);
});
