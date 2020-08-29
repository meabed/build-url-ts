const gulp = require("gulp");
const header = require("gulp-header");
const pump = require("pump");
const pkg = require("./package.json");
const banner = [
  "/**",
  " * <%= pkg.name %> - <%= pkg.description %>",
  " * @version v<%= pkg.version %>",
  " * @link <%= pkg.homepage %>",
  " * @license <%= pkg.license %>",
  " */\n",
].join("\n");

function copy(cb) {
  pump(
    [
      gulp.src("./src/build-url.js"),
      header(banner, { pkg: pkg }),
      gulp.dest("./dist"),
    ],
    cb
  );
}

exports.default = gulp.series(copy);
