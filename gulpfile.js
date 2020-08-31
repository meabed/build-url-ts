const gulp = require("gulp");
const pump = require("pump");

function copy(cb) {
  pump([gulp.src("./src/build-url.js"), gulp.dest("./dist")], cb);
}

exports.default = gulp.series(copy);
