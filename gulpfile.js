var path       = require('path');
var gulp       = require('gulp');
var shell      = require('gulp-shell');
var less       = require('gulp-less');
var cssmin     = require('gulp-minify-css');
var htmlmin    = require('gulp-htmlmin');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var replace    = require('gulp-replace');
var inject     = require('gulp-inject');
var server     = require('gulp-webserver');

gulp.task('server', function (){
	gulp.watch('./src/bsplay.*', ['dist']);
	return gulp.src('.').pipe(server({
		open:       'http://localhost/test/index.html'
	, port:       80
	, livereload: true
	}));
});

gulp.task('dist', ['dist:bundle'], function (){
	return gulp.src('./build/bsplay.js')
		.pipe(gulp.dest('./dist'))
		.pipe(uglify())
		.pipe(rename('bsplay.min.js'))
		.pipe(gulp.dest('./dist'))
	;
});

gulp.task('dist:bundle', ['build:script'],function (){
	return gulp.src('./build/bsplay.js')
		.pipe(inject(gulp.src([
			'./audiojs/audiojs/audio.min.js'
		, './bootstrap-slider/dist/bootstrap-slider.min.js'
		, './html5sortable/dist/html.sortable.min.js'
		]), {
			starttag: '// inject:bundle'
		, endtag: '(function'
		, transform: function (path, file){
				return file.contents.toString('utf-8'); 
			}
		}))
		.pipe(rename('bsplay.audio.js'))
		.pipe(gulp.dest('./dist/'))
		.pipe(uglify())
		.pipe(rename('bsplay.audio.min.js'))
		.pipe(gulp.dest('./dist/'))
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
				return ext === 'css' ? "css: '" : "markup: '";
			}
		, endtag: "'"
		, transform: function (path, file){
				return file.contents.toString('utf-8').replace(/'/g, "\\'");
			}
		}))
		.pipe(gulp.dest('./build'))
	;
});
