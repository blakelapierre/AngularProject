import child_process from 'child_process';
import events from 'events';

const browserify = require('browserify'),
      gulp = require('gulp'),
      minimist = require('minimist'),
      source = require('vinyl-source-stream');

const {
  babel,
  cached,
  clean,
  concat,
  jshint,
  pipe,
  print,
  run,
  sequence,
  sourcemaps,
  tasks,
  traceur,
  uglify
} = require('gulp-load-plugins')();

const args = minimist(process.argv.slice(2));

const result = tasks(gulp, require);
if (typeof result === 'string') console.log(result);

const p = name => print(file => console.log(name, file));

addTasks({
  'default': [['build']],

  // Ideally we wouldn't need to use an Array/list here, but that makes the addTasks function more complicated
  'build':   [sequence('clean', 'transpile')],

  'package': [['uglify'], () => console.log(`App written to ${paths.package}/app.js !`)],

  'run':     [() => run(`node ${paths.dist}/index.js ${args.args || ''}`).exec()],
  'test':    [() => run(`node ${paths.dist}/tests/index.js ${args.args || ''}`).exec()],

  'watch':   [['transpile'], () => gulp.watch(paths.script, ['transpile'])],

  'dev':     [['start_dev'], project => gulp.watch(paths.scripts, ['start_dev'])],
  'dev:test':[['start_dev:test'], project => gulp.watch(paths.scripts, ['start_dev:test'])]
});

function addTasks(t)
{
  for (let name in t) gulp.task.apply(gulp, [name, ...t[name]]);
}

//gulp.task('default', ['build']);

//gulp.task('build', sequence('clean', 'transpile'));
//gulp.task('package', ['uglify'], () => console.log(`App written to ${paths.package}/app.js !`));

//gulp.task('run', () => run(`node ${paths.dist}/index.js ${args.args || ''}`).exec());
//gulp.task('test', () => run(`node ${paths.dist}/tests/index.js ${args.args || ''}`).exec());

// gulp.task('watch', ['transpile'], () => gulp.watch(paths.script, ['transpile']));
// gulp.task('dev', ['start_dev'], project => gulp.watch(paths.scripts, ['start_dev']));
// gulp.task('dev:test', ['start_dev:test'], project => gulp.watch(paths.scripts, ['start_dev:test']));

gulp.task('transpile', ['jshint'],
  () => pipe([
    gulp.src(paths.scripts)
    ,cached('transpile')
    ,p('transpile')
    // ,sourcemaps.init()
    ,babel({plugins:['transform-es2015-modules-commonjs'], presets:[]})
    // // ,traceur({modules: 'inline', asyncGenerators: true, forOn: true, asyncFunctions: true})
    // ,sourcemaps.write('.')
    ,gulp.dest(paths.dist)
  ])
  .on('error', function(e) { console.log(e); }));


gulp.task('start_dev', ['transpile', 'copy', 'terminate'], launchAndWatch('index.js'));
gulp.task('start_dev:test', ['transpile', 'copy', 'terminate'], launchAndWatch('tests/index.js'));

let devChild = {process: undefined};
function launchAndWatch(file) {
  return () => {
    console.log({cwd: `${process.cwd()}/${paths.dist}`});
    const p = devChild.process = child_process.fork(`${file}`, {cwd: `${process.cwd()}/${paths.dist}`});

    devChild.doneFn = () => {
      const {emitter} = devChild;
      if (emitter) emitter.emit('end');
    };

    p.on('error', error => console.log('error', JSON.stringify(error)));

    p.on('exit', (code, signal) => {
      devChild.process = undefined;
      if (devChild.terminateFn) devChild.terminateFn();
    });

    devChild.emitter = new events.EventEmitter();

    return devChild.emitter;
  };
}

gulp.task('terminate',
  done => {
    const {process, doneFn} = devChild;

    if (process) {
      devChild.terminateFn = () => {
        console.log('terminated');
        done();
      };
      doneFn();
      process.kill();
    }
    else done();
  });

gulp.task('copy',
  () => pipe([
    gulp.src(paths.others)
    ,p('copy')
    ,gulp.dest(paths.dist)
  ]));

gulp.task('uglify', ['bundle'],
  () => pipe([
    gulp.src([`./${paths.package}/app.js`])
    ,p('uglify')
    ,uglify()
    ,gulp.dest(paths.package)
  ]));

gulp.task('bundle', ['transpile'],
  () => pipe([
    browserify({
      entries: [`./${paths.dist}/index.js`],
      builtins: false,
      detectGlobals: false
    }).bundle()
    ,source('app.js')
    ,p('bundle')
    ,gulp.dest(paths.package)
  ]));

gulp.task('jshint',
  () => pipe([
    gulp.src(paths.scripts)
    ,cached('jshint')
    ,p('jshint')
    ,jshint()
    ,jshint.reporter('jshint-stylish')
    ,jshint.reporter('fail')
  ]));

gulp.task('clean',
  () => pipe([
    gulp.src(paths.dist, {read: false})
    ,clean()
  ]));
const paths = {
  scripts: [`src/**/*.js`],
  others: [`src/**/*`, `!src/**/*.js`],
  dist: `.dist`,
  package: `.package`
};
