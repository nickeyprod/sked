const {task, src, dest, watch, series} = require('gulp'),
      minifyCss = require('gulp-clean-css');
      concatCss = require('gulp-concat-css'),
      concat = require('gulp-concat'),
      sourcemaps = require('gulp-sourcemaps');
      uglify = require('gulp-uglify-es').default;
      rename = require('gulp-rename'),
      del = require('del');

const CSSwatcher = watch(['!public/css/layout.css', 'public/css/*.css']);
const JSwatcher = watch(['!public/js/main.js', '!public/js/distr/', 'public/js/*.js']);

function concatCSS(cb)  {
  return src(["!public/css/layout.css", "public/css/*.css"])
    .pipe(concatCss("layout.css"))
    .pipe(dest("public/css/"));
}

function minifyCSS(cb) {
  return src("public/css/layout.css")
  .pipe(minifyCss())
  .pipe(rename("layout.min.css"))
  .pipe(dest("public/css/distr/"));
}

function concatJS(cb) {
  return src(["!public/js/main.js", "public/js/*.js"])
    .pipe(concat("main.js"))
    .pipe(dest("public/js/"));
}

function minifyJS(cb) {
  return src("public/js/main.js")
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(sourcemaps.write("./maps"))
    .pipe(dest("public/js/distr/"))
}

function watchFiles(cb) {
  CSSwatcher.on('change', function(path, stats) {
    // concat and minify CSS files
    series(cleanCSS, concatCSS, minifyCSS)();
  });
  JSwatcher.on("change", function(path, stats) {
    // concat and minify JS files
    series(cleanJS, concatJS, minifyJS)();
  });
}

function cleanCSS(cb) {
  return del(["public/css/distr/", "public/css/layout.css"]);
}

function cleanJS(cb) {
  return del(["public/js/distr/", "public/js/main.js"]);
}

exports.concatCSS = concatCSS;
exports.minifyCSS = minifyCSS;
exports.concatJS = concatJS;
exports.minifyJS = minifyJS;
exports.watchFiles = watchFiles;
exports.cleanCSS = cleanCSS;
exports.cleanJS = cleanJS;