var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var gulp = require('gulp');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var ngConstant = require('gulp-ng-constant');
var path = require('path');
var proxy = require('http-proxy-middleware');
var pump = require('pump');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache')
var uglify = require('gulp-uglify');
var uglifyES = require('gulp-uglify-es').default,
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    prefix = require('gulp-autoprefixer')
    ;

var BUILD_PATH = path.resolve("./public/build");


function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
}

gulp.task('develop', ['connect', 'constants', 'vendor', 'vendorCSS', 'vendorLess', 'scripts', 'watch', 'templates', 'fonts']);
gulp.task('prod', ['constants', 'vendor', 'vendorCSS', 'vendorLess', 'scripts', 'templates', 'fonts']);

gulp.task('default', function (cb) {
    runSequence('clean', 'develop', cb);
});
gulp.task('build', function (cb) {
    runSequence('clean', 'prod', cb);
});


/*------------------- following are subtasks -------------------*/

gulp.task('clean', function () {
    return gulp.src(BUILD_PATH)
        .pipe(clean({ read: false }))
})

gulp.task('connect', function () {
    connect.server({
        port: 5050,
        root: ['./app_server', path.resolve(BUILD_PATH, "..")],
        livereload: true,
        middleware: function (connect, opt) {
            return [historyApiFallback(), proxy('/api', {
                target: 'http://localhost:5000',
                changeOrigin: true
            })];
        }
    })
})

gulp.task('constants', function (cb) {
    var envConfig = require('./config.json')[process.env.NODE_ENV];
    pump([
        ngConstant({
            name: "constants",
            stream: true,
            constants: envConfig,
            wrap: false
        }),
        uglifyES({ mangle: false }),
        gulp.dest(BUILD_PATH),
        connect.reload()
    ], cb)
})

gulp.task('fonts', function () {
    gulp.src([
        './bower_components/components-font-awesome/fonts/*.{eot,svg,ttf,woff,woff2,otf}'
    ])
        .pipe(gulp.dest(path.resolve(BUILD_PATH, 'fonts')));
});


// vendor js compile, no need to livereload
gulp.task('vendor', function () {
    gulp.src(mainBowerFiles("**/*.js"))
        .pipe(uglify({ mangle: false }))
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(BUILD_PATH));
});

// vendor CSS
gulp.task('vendorCSS', function () {
    gulp.src(mainBowerFiles("**/*.css"))
        .pipe(cleanCSS())
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest(path.resolve(BUILD_PATH, "css")));
});

gulp.task('vendorLess', function () {
    return gulp.src(mainBowerFiles("**/*.less"))
        .pipe(less())
        .pipe(concat("vendorLess.css"))
        .pipe(gulp.dest(path.resolve(BUILD_PATH, "css")));
});

// our js files compile
// use pump because we want to see error messages
gulp.task('scripts', function (cb) {
    pump([
        gulp.src(['public/javascripts/app/**/*.module.js', 'public/javascripts/app/**/*.js']),
        uglify({ mangle: false }),
        concat("bundle.js"),
        gulp.dest(BUILD_PATH),
        connect.reload()
    ], cb)
});

gulp.task('templates', function () {
    gulp.src('./public/templates/**/*.html')
        .pipe(templateCache({ standalone: true }))
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(connect.reload());
});





// Image Task
// Compress
// gulp.task('image', function(){
//     gulp.src('public/images/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('build/img/'));
// });

// Style Task
// Compile to SASS
// gulp.task('styles', function(){
//     sass('public/stylesheets/*.sass', {style: 'compressed'})
//     .on('error', errorLog)      // on error is after action, plumber is before
//     .pipe(prefix('last 2 versions'))
//     .pipe(gulp.dest('mincss'))
//     .pipe(livereload());
// })

// Watch
gulp.task('watch', function () {
    gulp.watch('public/javascripts/app/**/*.js', ['scripts']);
    gulp.watch('public/templates/**/*.html', ['templates']);
    // gulp.watch('public/stylesheets/*.sass', ['styles']);

})

