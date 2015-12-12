const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const bump = require('gulp-bump');
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

gulp.task('bump-patch', () => {
  gulp.src('./package.json')
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', () => {
  gulp.src('./package.json')
    .pipe(bump({ type: 'minor' }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-major', () => {
  gulp.src('./package.json')
    .pipe(bump({ type: 'major' }))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['uglify', 'copy']);
gulp.task('release-patch', ['build', 'bump-patch']);
gulp.task('release-minor', ['build', 'bump-minor']);
gulp.task('release-major', ['build', 'bump-major']);
gulp.task('default', ['build', 'watch']);
