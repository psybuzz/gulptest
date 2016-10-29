/**
 * Each page has its own bundle.  Common scripts are bundled together.
 * 
 * TODO: when a leading bundler has won, use it (gulp, webpack, rollup, es6 in time?)
 * 
 * Per-folder bundled files
 * https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
 */

var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var packageJSON  = require('./package');
var jshintConfig = packageJSON.jshintConfig;

// Define paths.
var Paths = {
    build: 'public/build/',
    watchScripts: [
        'public/**/*.js',
        '!public/third_party/*',
        '!public/build/*',
    ], 
    pages: 'public/pages/',

    // Manually defined common scripts.
    commonScripts: [
        'public/common/**/*.js',
        'public/actors/**/*.js',
        'public/models/**/*.js',
        'public/shaders/**/*.js',
    ],
    vendorScripts: [
        'public/third_party/three*.js',		// load three.js first before modules it depends on
        'public/third_party/*.js',
    ],
};


// Lint scripts.
gulp.task('lint', function (){
    return gulp.src(Paths.watchScripts)
            .pipe(jshint(jshintConfig))
            .pipe(jshint.reporter('default'));
});

// Combine and minify scripts.
gulp.task('scripts', function (done){
    var scriptsPath = getFolders(Paths.pages);
    var pageScripts = scriptsPath.map(function (folder){
        return gulp.src([path.join(Paths.pages, folder, '/**/!(main)*.js'), path.join(Paths.pages, folder, '/main.js')])
            .pipe(sourcemaps.init())
            .pipe(concat(folder + '.js')) 
            // .pipe(uglify())
            .on('error', done)
            .pipe(rename(folder + '.min.js')) 
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(Paths.build));
    });

    var commonScripts = gulp.src(Paths.commonScripts)
            .pipe(sourcemaps.init())
            .pipe(concat('scripts-all.js'))
            .pipe(gulp.dest(Paths.build))
            .pipe(rename('scripts-all.min.js'))
            // .pipe(uglify())
            .on('error', done)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(Paths.build));

    return merge(pageScripts, commonScripts);
});

// Combine vendor scripts.
gulp.task('vendorScripts', function (){
    return gulp.src(Paths.vendorScripts)
            .pipe(concat('vendor-all.min.js'))
            .pipe(gulp.dest(Paths.build));
});

// Watch source files for changes.
gulp.task('watch', function (){
    gulp.watch(Paths.watchScripts, ['lint', 'scripts']);
    gulp.watch(Paths.vendorScripts, ['vendorScripts']);
});

// Server!
gulp.task('serve', function(){
    var server = require('./index');
});

// Default task.
gulp.task('default', ['vendorScripts', 'scripts', 'watch', 'serve']);


function getFolders(dir) {
    return fs.readdirSync(dir)
            .filter(function(file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
}