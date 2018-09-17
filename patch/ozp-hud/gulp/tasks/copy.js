var gulp = require('gulp');

gulp.task('copy', function() {
    return gulp.src([
        'app/**/*',
        '!app/OzoneConfig.js',
        '!app/js',
        '!app/js/**/*',
        '!app/styles',
        '!app/styles/**/*']
        ).pipe(gulp.dest('dist'))
        .on('end', function(){
            // gulp.run('version');
        });
});
