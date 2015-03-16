var path       = require('path');
var gulp       = require('gulp');
var shell      = require('gulp-shell');
var less       = require('gulp-less');
var cssmin     = require('gulp-minify-css');
var htmlmin    = require('gulp-htmlmin');
var replace    = require('gulp-replace');
var inject     = require('gulp-inject');
var server     = require('gulp-webserver');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('server', function (){
	gulp.watch('./src/bsplay.*', ['build:script']);
	return gulp.src('.').pipe(server({
		open:       'http://localhost/test/index.html'
	, port:       80
	, livereload: true
	}));
});

gulp.task('bundle:script', function (){
	return browserify('./src/bsplay.js')
		.ignore('bootstrap')
		.ignore('jquery')
		.bundle()
		.pipe(source('bsplay.bundle.js'))
		.pipe(gulp.dest('./build'))
	;
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
		.pipe(inject(gulp.src(['./build/bsplay.css', './build/bsplay.html']), {
			starttag: function (_, ext){
				return ext === 'css' ? '/* inject:css */' : '<!-- inject:html -->';
			}
		, endtag:function (_, ext){
				return ext === 'css' ? '/* endinject */' : '<!-- endinject -->';
			}
		, transform: function (path, file){
				return file.contents.toString('utf-8').replace(/'/g, "\\'");
			}
		}))
		.pipe(gulp.dest('./build'))
	;
});
