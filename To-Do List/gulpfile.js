//Author: Robert A Howell, April 2023
//Source: https://www.typescriptlang.org/
//TypeScript: Documentation - Gulp. [online]. Available at: https://www.typescriptlang.org/docs/handbook/gulp.html.
var gulp = require("gulp"); // Package manager
var browserify = require("browserify"); // JS bundler tool
var source = require("vinyl-source-stream"); // Gulp pipeline dependency with browserify
var watchify = require("watchify"); // Recompile the browser components on save
var tsify = require("tsify"); // Browser plugin for compiling TypeScript
var fancy_log = require("fancy-log"); // Gulp terminal extension
var paths = {
  pages: ["dist/*.html"],
};
var watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/toDoWidget.ts"],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
);
gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});
function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("typescript.js"))
    .pipe(gulp.dest("dist"));
}
gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
