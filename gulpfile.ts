import * as del from 'del';
import * as gulp from 'gulp';
import * as sourceMaps from 'gulp-sourcemaps';
import * as tsc from 'gulp-typescript';
// import * as gulpMocha from 'gulp-mocha';
// import * as runSequence from 'run-sequence';
const alias = require('gulp-ts-alias');

/**
* Remove dist directory.
*/
gulp.task("clean", (done) => {
    return del(["dist"], done);
});


/**
* Copy start script.
*/
gulp.task("copy", () => {
    return gulp.src(["src/**", "!src/**/*.+(ts|json)"])
        .pipe(gulp.dest("dist/"));
});


/**
* Build the server.
*/
gulp.task("build:server", () => {
    const project = tsc.createProject("tsconfig.json");
   
    const result = gulp.src("src/**/*.ts")
        .pipe(alias({ configuration: project.config }))
        .pipe(sourceMaps.init())
        .pipe(project());
    return result.js
        // .pipe(sourceMaps.write("dist", { addComment: true }))
        .pipe(gulp.dest("dist"));
});
 
/**
* Build the project.
*/
gulp.task("dev:build",gulp.series('build:server','copy', (done) => {
    done()
}));

/**
* Build the project.
*/
gulp.task("default",gulp.series('clean', 'build:server','copy', (done) => {
    done()
    // gulp.watch('src/**/*.ts', gulp.series('build:server'));

    // runSequence("clean", "copy", "build:express", "test:express");
}));