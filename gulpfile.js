const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tagVersion = require('gulp-tag-version');
const shell = require('gulp-shell');

const inc = (importance) => {
  return gulp.src('./package.json')
    .pipe(bump({ type: importance }))
    .pipe(gulp.dest('.'))
    .pipe(git.commit('Bump version'))
    .pipe(filter('package.json'))
    .pipe(tagVersion())
    .pipe(git.push('origin', 'master', {
      args: '--tags'
    }, (error) => {
      if (error) {
        throw error;
      }
    }));
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
    shell.task(['npm publish']);
  }
  if (process.argv.indexOf('--feature') !== -1) {
    gulp.run('minor');
    shell.task(['npm publish']);
  }
  if (process.argv.indexOf('--release') !== -1) {
    gulp.run('release');
    shell.task(['npm publish']);
  }
});

gulp.task('build', ['uglify', 'copy']);
gulp.task('default', ['build', 'watch']);
