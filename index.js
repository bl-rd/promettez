var rollup = require('rollup');
var shell = require('shelljs');
var chalk = require('chalk');

console.log(chalk.bold.yellow('\nBuilding the dist directory for Promettez...'));

var builds = [];
rollup.rollup({
  entry: 'Promettez.js',
}).then(bundle => {

  bundle.write({
    format: 'cjs',
    dest: 'dist/promettez.cjs.js'
  }).then(() => {
    shell.exec('npm run compile:cjs && npm run compile:cjsmin');
  }).catch(reason => {
    console.error(reason);
  });

  bundle.write({
    format: 'es',
    dest: 'dist/promettez.es2015.js'
  }).catch(reason => {
    console.error(reason);
  });
}).catch(reason => {
  console.error(reason);
});

rollup.rollup({
  entry: 'main.js'
}).then(bundle => {
  bundle.write({
    format: 'es',
    dest: 'dist/promettez.js'
  }).then(() => {
    shell.exec("npm run compile && npm run compile:min");
  }).catch(reason => {
    console.error(reason);
  });
});
