(function() {
  var pattern, readline, rl;

  readline = require('readline');

  pattern = new RegExp(require('./pattern'));

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    var escaped;
    // process.stdout.write( `line: ${line}\n` )
    escaped = line.replace(/([\ue000-\uefff])/g, '$1 ');
    return process.stdout.write(escaped + '\n');
  });

}).call(this);
