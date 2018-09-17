var gulp = require('gulp');
var shell = require('gulp-shell');
var pjson = require('../../package.json');

var build_dir = 'dist';

gulp.task('copy', function() {
    return gulp.src([
        'app/**/*',
        '!app/js',
        '!app/js/**/*',
        '!app/styles',
        '!app/styles/**/*']
        )
        .pipe(gulp.dest('dist'))
        .on('end', function(){
            // gulp.run('version');
        });
});
