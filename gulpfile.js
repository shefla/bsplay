var gulp = require('gulp');
var exec = require('child_process').exec;
var less = require('gulp-less');

gulp.task('build:jquery', function (done){
	exec('cd jquery && npm run build', done);
});

gulp.task('build:style', function (done){
	gulp.src('./src/bsplay.less')
		.pipe(less())
		.pipe(gulp.dest('build'))
	;
});
