var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('build:jquery', function (done){
	exec('cd jquery && npm run build', done);
});
