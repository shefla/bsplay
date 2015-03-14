var fs      = require('fs');
var path    = require('path');
var gulp    = require('gulp');
var shell   = require('gulp-shell');
var less    = require('gulp-less');
var cssmin  = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');
var server  = require('gulp-webserver');

gulp.task('server', function (){
	gulp.watch('./src/bsplay.*', ['build:script']);
	return gulp.src('.').pipe(server({
		open:       'http://localhost/test/index.html'
	, port:       80
	, livereload: true
	}));
});

gulp.task('build', ['build:jquery', 'build:script']);

gulp.task('build:jquery', shell.task('npm run build', {
	cwd: path.join(__dirname, 'jquery')
}));

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
	return gulp.src('./src/bsplay.js')
		.pipe(replace(/INJECT\.(html|css)/g, function (inject){
			return fs.readFileSync(
				'./build/bsplay'+path.extname(inject)
			, { encoding: 'utf-8' }
			).replace(/'/g, "\\'");
		}))
		.pipe(gulp.dest('./build'))
	;
});
