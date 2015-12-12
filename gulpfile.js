const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const header = require('gulp-header');
const pkg = require('./package.json');
const banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */\n'
].join('\n');

gulp.task('uglify', () => {
  gulp.src('./src/build-url.js')
    .pipe(uglify())
    .pipe(rename('build-url.min.js'))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', () => {
  gulp.src('./src/build-url.js')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
  gulp.watch('./src/build-url.js', ['build']);
});

gulp.task('build', ['uglify', 'copy']);
gulp.task('default', ['build', 'watch']);
