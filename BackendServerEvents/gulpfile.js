var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins();

var testFolder = './test';

//run all test using mocha
gulp.task('runTests',function(){
return gulp.src(testFolder + '/*.js')
	.pipe(plugins.mocha());
});