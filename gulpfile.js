const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tagVersion = require('gulp-tag-version');

const inc = (importance) => {
  return gulp.src('./package.json')
    .pipe(bump({ type: importance }))
    .pipe(gulp.dest('.'))
    .pipe(git.commit('Bump version'))
    .pipe(filter('package.json'))
    .pipe(tagVersion());
};

gulp.task('uglify', () => {
  gulp.src('./src/build-url.js')
    .pipe(uglify())
    .pipe(rename('build-url.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', () => {
  gulp.src('./src/build-url.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
  gulp.watch('./src/build-url.js', ['build']);
});

gulp.task('patch', () => {
  return inc('patch');
});

gulp.task('feature', () => {
  return inc('minor');
});

gulp.task('release', () => {
  return inc('major');
});

gulp.task('publish', () => {
  if (process.argv.indexOf('--patch') !== -1) {
    gulp.run('patch');
  }
  if (process.argv.indexOf('--feature') !== -1) {
    gulp.run('minor');
  }
  if (process.argv.indexOf('--release') !== -1) {
    gulp.run('release');
  }
});

gulp.task('build', ['uglify', 'copy']);
gulp.task('default', ['build', 'watch']);
