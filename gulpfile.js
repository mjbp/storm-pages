var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    pkg = require('./package.json'),
    autoprefixer = require('gulp-autoprefixer'),
    header = require('gulp-header'),
    wrap = require('gulp-wrap-umd'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    wait = require('gulp-wait'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    rollup = require('gulp-rollup'),
	rollupNodeResolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require( 'babelify'),
    browserSync = require('browser-sync'),
    ghPages = require('gulp-gh-pages'),
    runSequence = require('run-sequence'),
    reload = browserSync.reload;

/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */\n'
].join('\n');

/* Wrapper to support es5 window and commonjs with same syntax */ 
var umdTemplate = ["(function(root, factory) {",
                    "   var mod = {",
                    "       exports: {}",
                    "   };",
                    "   if (typeof exports !== 'undefined'){",
                    "       mod.exports = exports",
                    "       factory(mod.exports)",
                    "       module.exports = mod.exports.default",
                    "   } else {",
                    "       factory(mod.exports);",
                    "       root.<%= namespace %> = mod.exports.default",
                    "   }\n",
                    "}(this, function(exports) {",
                    "   <%= contents %>;",
                    "}));\n"
                    ].join('\n');

/* Error notificaton*/
var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);

    this.emit('end');
};

var componentName = function(){
	return pkg.name.split('-').map(function(w){ return w.substr(0, 1).toUpperCase() + w.substr(1); }).join('');
};

const AUTOPREFIXER_BROWSERS = [
	'ie >= 9',
	'ie_mob >= 10',
	'ff >= 20',
	'chrome >= 4',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

/************************
 *  Task definitions 
 ************************/
gulp.task('js:es5', function() {
    return gulp.src('src/js/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel({
			presets: ['env']
		}))
        .pipe(wrap({
            namespace: componentName(),
            template: umdTemplate
        }))
        .pipe(header(banner, {pkg : pkg}))
  		.pipe(rename({suffix: '.standalone'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('js:es5-rollup', function() {
	return gulp.src('src/js/index.js')
        .pipe(rollup({
			allowRealFiles: true,
            input: 'src/js/index.js',
			format: 'es',
			plugins: [
				rollupNodeResolve(),
                commonjs()
			]
        }))
        .pipe(babel({
			presets: ['env']
		}))
        .pipe(wrap({
            template: umdTemplate
        }))
        .pipe(header(banner, {pkg : pkg}))
  		.pipe(rename({
            basename: pkg.name,
            suffix: '.standalone'
        }))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('js:es6', function() {
    gulp.src('src/js/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest('dist/js'));

    return gulp.src('./src/js/lib/*.js')
		.pipe(gulp.dest('./dist/js/lib/'));
});

gulp.task('js', ['js:es6', 'js:es5-rollup']);

gulp.task('copy:js', function() {
    return gulp.src('./src/js/**/*.js')
		.pipe(gulp.dest('./example/src/libs/component'));
});
gulp.task('copy:css', function() {
    return gulp.src('./dist/css/*.css')
		.pipe(gulp.dest('./example/css'));
});

gulp.task('copy', ['copy:js', 'copy:css']);

gulp.task('css', function(){
    return gulp.src('./src/scss/**/*.scss')
        .pipe(wait(500))
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('example:import', function(){
    return browserify({
            entries: './example/src/app.js',
            debug: true
        })
        .transform(babelify, {presets: ['env']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./example/js'));
});
gulp.task('example:async', function(){
    return gulp.src('./dist/*.standalone.js')
		.pipe(gulp.dest('./example/js/'));
});
gulp.task('example', ['example:import', 'example:async']);

gulp.task('server', ['js', 'css', 'copy', 'example'], function() {
    browserSync({
        notify: false,
        // https: true,
        server: ['example'],
        tunnel: false
    });

      gulp.watch(['src/**/*'], function(){
          runSequence('js', 'css', 'copy', 'example', reload);
      });
      gulp.watch(['example/**/*'], ['example', reload]);
      
});
 
gulp.task('deploy', ['example'], function() {
  return gulp.src('./example/**/*')
    .pipe(ghPages());
});


/************************
 *  Task API
 ************************/
gulp.task('default', ['server']);
gulp.task('serve', ['server']);
gulp.task('build', function() {
    runSequence('js', 'css', 'copy', 'example');
});