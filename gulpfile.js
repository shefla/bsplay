var fs      = require('fs');
var path    = require('path');
var gulp    = require('gulp');
var exec    = require('child_process').exec;
var less    = require('gulp-less');
var cssmin  = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');

gulp.task('build:jquery', function (done){
	exec('cd jquery && npm run build', done);
});

gulp.task('build:style', function (){
	return gulp.src('./src/bsplay.less')
		.pipe(less())
		.pipe(cssmin())
		.pipe(gulp.dest('./build'))
	;
});

gulp.task('build:markup', function (){
	return gulp.src('./src/bsplay.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./build'))
	;
});

gulp.task('build:script', ['build:style', 'build:markup'], function (){
	var opts = { encoding: 'utf-8' };
	var vars = { '{{style}}': './' };
	var css  = fs.readFileSync('./build/bsplay.css',  opts);
	var html = fs.readFileSync('./build/bsplay.html', opts);
	var get = function (ext){
		return fs.readFileSync('./build/bplay.'+ext)
	}
	return gulp.src('./src/bsplay.js')
		.pipe(replace(/INJECT\.(html|css)/g, function (inject){
			console.log('inject', inject, path.extname(inject));
			return fs.readFileSync(
				'./build/bsplay'+path.extname(inject)
			, { encoding: 'utf-8' }
			).replace(/'/g, "\\'");
		}))
		.pipe(gulp.dest('./build'))
	;
});
