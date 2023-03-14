const {src, dest, series, watch} = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const del = require("del");
const concat = require("gulp-concat");

function scss() {
  return src("./scss/*.scss")
          .pipe(sass())
          .pipe(concat("style.css"))
          .pipe(dest("./css"));
}

function clear() {
  return del("./css");
}

function watchFor() {
  watch("./scss/**/*.scss", series(clear,scss));
}

exports.watch = watchFor;
exports.build = series(clear, scss);