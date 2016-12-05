var gulp = require('gulp'),
uglify = require('gulp-uglify'),
sass = require('gulp-ruby-sass'),
plumber = require('gulp-plumber'),
livereload = require('gulp-livereload'),
imagemin = require('gulp-imagemin'),
prefix = require('gulp-autoprefixer')
;


function errorLog(error){
    console.error.bind(error);
    this.emit('end');
}

gulp.task('default', ['scripts', 'styles', 'watch']);

// Script Task
// Uglifies
gulp.task('scripts', function(){
    gulp.src('public/javascripts/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('minjs'));
});

// Image Task
// Compress
gulp.task('image', function(){
    gulp.src('public/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img/'));
});

// Style Task
// Compile to SASS
gulp.task('styles', function(){
    sass('public/stylesheets/*.sass', {style: 'compressed'})
    .on('error', errorLog)      // on error is after action, plumber is before
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('mincss'))
    .pipe(livereload());
})

// Watch
gulp.task('watch', function(){
    var server = livereload();
    gulp.watch('public/javascripts/*.js', ['scripts']);
    gulp.watch('public/stylesheets/*.sass', ['styles']);

})


// using pump, official example
gulp.task('compressJS', function(cb){
    pump([
        gulp.src('public/javascripts/*.js'),
        uglify(),
        gulp.dest('minjs')
        ], cb);
})
