var gulp    = require('gulp');
var exec    = require('child_process').exec;
var less    = require('gulp-less');
var htmlmin = require('gulp-htmlmin');

gulp.task('build:jquery', function (done){
	exec('cd jquery && npm run build', done);
});

gulp.task('build:style', function (){
	return gulp.src('./src/bsplay.less')
		.pipe(less())
		.pipe(gulp.dest('./build'))
	;
});

gulp.task('build:markup', function (){
	return gulp.src('./src/bsplay.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./build'))
	;
});
