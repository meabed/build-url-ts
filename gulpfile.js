const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

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

gulp.task('build', ['uglify', 'copy']);
gulp.task('default', ['build', 'watch']);
