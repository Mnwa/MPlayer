var gulp = require("gulp");
var ts = require("gulp-typescript");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var connect = require('gulp-connect');
var concat = require('gulp-concat');

/* Main commands:
    "gulp compile" - compile project
    "gulp autocompile" - autocompile for live development
    "gulp live" - start live server and autocompile for debug/development
    "gulp start" - start server
 */


//Output directory
var output = './www';         

//Directory for development              
var input = './develop';      

//Server port
var port = 3000;              

//Compile js (typescript -> es6 -> babel -> minifed)
gulp.task("typescript", function () {       
    var tsProject = ts.createProject("./tsconfig.json");
    return gulp.src([`${input}/libs/**/*.ts`, `!${input}/**`], {base: input})
        .pipe(ts(tsProject))
        .pipe(babel({
            presets: ["es2015"],
            plugins: ["transform-es2015-modules-systemjs"]
        }))
        //.pipe(uglify({mangle: {toplevel: true}}))                         //Comment out for debug
        .pipe(gulp.dest(output));
});

//Compile html and minifed
gulp.task('html', function() {                  
  return gulp.src([`${input}/**/*.html`, `!${input}/template/**/*`,'!./node_modules/**', '!./www/**'], {base: input})
    .pipe(htmlmin(
        {
            collapseWhitespace: true,
            minifyJS: true
        }
    ))  //Comment out for debug
    .pipe(gulp.dest(output))
});

//Compile sass to css
gulp.task('sass', function () {                 
  return gulp.src([`${input}/styles/**/*.scss`, '!./www/**'], {base: input})
    .pipe(sass())
    .pipe(minifyCss())                          //Comment out for debug
    .pipe(gulp.dest(output));
});

//Html template angular
gulp.task('angular', function () {                
    return gulp.src([`${input}/template/**/*.html`], {base: input})
     .pipe(gulp.dest(output))
});

//Copy non-compiled files to output directory
gulp.task('built', ['angular'], function () {                
    return gulp.src([`${input}/**/*.*`, `!${input}/package.json`, `!${input}/tsd.json`,`!${input}/{typings,typings/**}`,`!${input}/**/*.html`, `!${input}/styles/**/*.scss`, `!${input}/libs/**/*.ts`], {base: input})
     .pipe(gulp.dest(output))
});

//Copy non-compiled files to output directory and compile project
gulp.task('compile', ['built','typescript', 'html', 'sass']);

//Start live server for debug
gulp.task('live-start', function () {
    connect.server({
        root: output,
        livereload: true,
        port: port
    });
});

//Start server
gulp.task('start', function () {
    connect.server({
        root: output,
        livereload: false,
        port: port
    });
});

//Autocompile for live development
gulp.task('autocompile', function() {
    gulp.watch([`${input}/libs/**/*.ts`, `!${output}/**`], ['typescript']);
    gulp.watch([`${input}/styles/**/*.scss`, `!${output}/**`], ['sass']);
    gulp.watch([`${input}/**/*.html`, `!${input}/node_modules/**`, `!${output}/**`], ['html']);
    gulp.watch([`${input}/template/**/*.html`, `!${output}/**`], ['angular']);
});

//Start live server for debug/development
gulp.task('live', ['compile', 'autocompile', 'live-start']);

// var Js = ['./player/js/config.js', './player/js/song.js', './player/js/util.js', './player/js/url.js',  './player/js/genre.js', './player/js/vis.js', './player/js/gl/scene.js', './player/js/gl/geometry.js', './player/js/gl/light.js', './player/js/gl/render.js'];

// gulp.task('player-js',  function() {
//     return gulp.src(Js, {base: './player'})
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('./player-c/js'));
// });

// gulp.task('built-player',  function () {                
//     return gulp.src([`./player/**/*`,`!player/{js,js/**}`], {base: './player'})
//      .pipe(gulp.dest('./player-c'))
// });

// var cors = function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   next();
// };

// gulp.task('player', ['player-js', 'built-player']);
// gulp.task('start-p', function () {
//     connect.server({
//         root: './player-c',
//         livereload: true,
//         port: port,
//         middleware: function () {
//             return [cors];
//         }
//     });
// });