const del = require("del");
const gulp = require("gulp");
const gulpTslint = require("gulp-tslint");
const runSequence = require("run-sequence");
const tslint = require("tslint");
const typescript = require("gulp-typescript");

gulp.task("compile", () => {
    const project = typescript.createProject("src/tsconfig.json");
    return project.src()
        .pipe(project())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("tslint", () => {
    const program = tslint.Linter.createProgram("./src/tsconfig.json");
    return gulp.src("src/**/*.ts")
        .pipe(gulpTslint({ program: program, formatter: "verbose" }))
        .pipe(gulpTslint.report())
});

gulp.task("clean", () => {
    return del(["dist"]);
});

gulp.task("default", (cb) => {
    runSequence("compile", "tslint", cb);
});
