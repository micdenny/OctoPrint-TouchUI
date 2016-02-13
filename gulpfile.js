var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var cssimport = require("gulp-cssimport");
var rename = require("gulp-rename");
var strip = require('gulp-strip-comments');
var trimlines = require('gulp-trimlines');
var removeEmptyLines = require('gulp-remove-empty-lines');
var concat = require('gulp-concat');

gulp.task('default', ['lessc', 'clean:hash', 'concat-less', 'concat-app-js', 'concat-libs-js', 'concat-knockout-js']);
gulp.task('less', ['lessc', 'clean:hash', 'concat-less']);
gulp.task('js', ['concat-app-js', 'concat-libs-js', 'concat-knockout-js']);

gulp.task('lessc', function () {
	return gulp.src('source/less/touchui.less')
		.pipe(less({compress: true}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});

gulp.task("concat-less", function() {
	return gulp.src('source/less/touchui.less')
		.pipe(cssimport({
			extensions: ["less"],
			matchPattern: "*.less"
		}))
		.pipe(strip())
		.pipe(rename("touchui.bundled.less"))
		.pipe(trimlines())
		.pipe(gulp.dest('octoprint_touchui/static/less/'));
});

gulp.task('clean:hash', function () {
	return del([
		'octoprint_touchui/static/css/hash.touchui',
	]);
});

gulp.task('concat-libs-js', function () {
	return gulp.src([
			'source/vendors/keyboard/dist/js/jquery.keyboard.min.js',
			'source/vendors/jquery-fullscreen/jquery.fullscreen-min.js',
			'source/vendors/iscroll/build/iscroll.js',
			'source/vendors/tinycolorpicker/lib/jquery.tinycolorpicker.min.js'
		])
		.pipe(concat('touchui.libraries.js'))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('concat-app-js', function () {
	return gulp.src([
			'!source/js/knockout.js',
			'source/js/constructor.js',
			'source/js/**/*.js',
			'source/js/**/**/*.js'
		])
		.pipe(concat('touchui.bundled.js'))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('concat-knockout-js', function () {
	return gulp.src([
			'source/js/knockout.js'
		])
		.pipe(rename("touchui.knockout.js"))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('watch', function () {
	gulp.watch(
		[
			'source/less/touchui.less',
			'source/less/**/*.less',
			'source/js/**/*.js',
			'source/js/*.js'
		],
		[
			'lessc',
			'clean:hash',
			'concat-less',
			'concat-app-js',
			'concat-libs-js',
			'concat-knockout-js'
		]
	);
});
