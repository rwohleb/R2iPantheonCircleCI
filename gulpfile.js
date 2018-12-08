var gulp = require('gulp');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
//var autoprefixer = require('gulp-autoprefixer');
//var pxtorem = require('gulp-pxtorem');
var postcss = require('gulp-postcss');
var scssParser = require('postcss-scss');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

// Stylelint config rules
var stylelintConfig = {
  "rules": {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "function-comma-space-after": "always",
    "function-url-quotes": "always",
    "media-feature-colon-space-after": "always",
    "media-feature-colon-space-before": "never",
    "media-feature-name-no-vendor-prefix": true,
    "max-empty-lines": 5,
    "number-leading-zero": "never",
    "number-no-trailing-zeros": true,
    "property-no-vendor-prefix": true,
    //"declaration-block-no-duplicate-properties": true,
    "declaration-block-single-line-max-declarations": 0,
    "declaration-block-trailing-semicolon": "always",
    "selector-list-comma-space-before": "never",
    "selector-list-comma-newline-after": "always-multi-line",
    "string-quotes": "double",
    "value-no-vendor-prefix": true,
    "max-nesting-depth": 5
  }
}

var ext_js_files = [
  'node_modules/bootstrap/dist/js/bootstrap.js',
  'node_modules/popper.js/dist/umd/popper.js',
  'node_modules/waypoints/lib/jquery.waypoints.js',
  'node_modules/jquery-query-object/jquery.query-object.js'
];

gulp.task('css', ['iconfont'], function() {
  var plugins = [
    require('postcss-pxtorem')({
      propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*position*', 'margin*', 'padding*', 'left', 'top', 'right', 'bottom', 'width', 'height', 'transform']
    }),
    require('autoprefixer')({
      grid: true
    }),
    process.env.NODE_ENV === 'production' ? require('cssnano')({}) : false,
  ];

  return gulp.src(['web/themes/custom/THEME/src/css/*.?(s)css', '!web/themes/custom/THEME/src/css/_*.?(s)css'])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(plugins.filter(el => el !== false), {parser: scssParser}))
    //.pipe(sourcemaps.write())
    //.pipe(pxtorem())
    .pipe(debug({title: 'css:'}))
    .pipe(gulp.dest('web/themes/custom/THEME/css'));
});

gulp.task('cssadmin', function() {
  var plugins = [
    require('autoprefixer')({
      grid: true
    }),
    process.env.NODE_ENV === 'production' ? require('cssnano')({}) : false,
  ];

  return gulp.src(['web/themes/custom/THEME_admin/src/css/*.?(s)css', '!web/themes/custom/THEME_admin/src/css/_*.?(s)css'])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(plugins.filter(el => el !== false), {parser: scssParser}))
    //.pipe(sourcemaps.write())
    //.pipe(pxtorem())
    .pipe(debug({title: 'css:'}))
    .pipe(gulp.dest('web/themes/custom/THEME_admin/css'));
});

gulp.task('css:lint', function() {
  var plugins = [
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({
      clearReportedMessages: true,
      throwError: true
    }),
  ];

  return gulp.src(['web/themes/custom/THEME/src/css/**/*.?(s)css', '!web/themes/custom/THEME/src/css/base/_THEME_icons.scss'])
    .pipe(postcss(plugins.filter(el => el !== false), {parser: scssParser}));
});

gulp.task('cssadmin:lint', function() {
  var plugins = [
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({
      clearReportedMessages: true,
      throwError: true
    }),
  ];

  return gulp.src(['web/themes/custom/THEME_admin/src/css/**/*.?(s)css'])
    .pipe(postcss(plugins.filter(el => el !== false), {parser: scssParser}));
});

gulp.task('css:watchlint', function() {
  var plugins = [
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({
      clearReportedMessages: true,
    }),
  ];

  return gulp.src(['web/themes/custom/THEME/src/css/**/*.?(s)css',
                   '!web/themes/custom/THEME/src/css/base/_icons.scss',
                   '!web/themes/custom/THEME/src/css/base/_THEME_icons.scss'])
    .pipe(postcss(plugins.filter(el => el !== false), {parser: scssParser}));
});

gulp.task('cssadmin:watchlint', function() {
  var plugins = [
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({
      clearReportedMessages: true,
    }),
  ];

  return gulp.src(['web/themes/custom/THEME_admin/src/css/**/*.?(s)css'])
    .pipe(postcss(plugins.filter(el => el !== false), {parser: scssParser}));
});

// Watch css/scss files and rebuild on change.
gulp.task('css:watch', ['css:watchlint', 'css'], function() {
  gulp.watch(['web/themes/custom/THEME/src/css/**/*.?(s)css'], ['css:watchlint', 'css']);
});

// Watch css/scss files and rebuild on change.
gulp.task('cssadmin:watch', ['cssadmin:watchlint', 'cssadmin'], function() {
  gulp.watch(['web/themes/custom/THEME_admin/src/css/**/*.?(s)css'], ['cssadmin:watchlint', 'cssadmin']);
});

gulp.task('iconfont', function(){
  gulp.src('web/themes/custom/THEME/src/icons/**/*.svg')
    .pipe(iconfontCss({
      fontName: 'THEME_icons',
      targetPath: '../src/css/base/_THEME_icons.scss',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: 'THEME_icons',
      normalize:true,
      fontHeight: 1001
    }))
    .pipe(debug({title: 'iconfont:'}))
    .pipe(gulp.dest('web/themes/custom/THEME/fonts'));
});

gulp.task('fontawesome', function(){
  gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(debug({title: 'fontawesome:'}))
    .pipe(gulp.dest('web/themes/custom/THEME/fonts'));
});

gulp.task('iconfont:watch', ['iconfont'], function() {
  gulp.watch('web/themes/custom/THEME/src/icons/**/*.svg', ['iconfont']);
});

gulp.task('images', function () {
  gulp.src('web/themes/custom/THEME/src/images/**/*\.@(png|gif|jpg|jpeg|svg)')
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false},
          ]
        })
      ]))
      .pipe(debug({title: 'images:'}))
      .pipe(gulp.dest('web/themes/custom/THEME/images'));
});

gulp.task('images:watch', ['images'], function() {
  gulp.watch(['web/themes/custom/THEME/src/images/**/*\.@(png|gif|jpg|jpeg|svg)'], ['images']);
});

gulp.task('js', function() {
  gulp.src(ext_js_files)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(debug({title: 'js:'}))
    .pipe(gulp.dest('web/themes/custom/THEME/js'));
  gulp.src(['web/themes/custom/THEME/src/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(debug({title: 'js:'}))
    .pipe(gulp.dest('web/themes/custom/THEME/js'));
});

gulp.task('js:watch', ['js'], function() {
  gulp.watch(['web/themes/custom/THEME/src/js/**/*.js'], ['js']);
});

gulp.task('js:lint', function() {
});

gulp.task('watch', ['css:watch', 'js:watch', 'images:watch'], function() {
});

//gulp.task('lint', ['css:lint', 'cssadmin:lint', 'js:lint'], function() {
gulp.task('lint', function() {
});

//gulp.task('build', ['css', 'cssadmin', 'js', 'images', 'fontawesome'], function() {
gulp.task('build', function() {
});

gulp.task('default', ['lint', 'build'], function() {
})
