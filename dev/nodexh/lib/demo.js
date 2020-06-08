(function() {
  'use strict';
  var CND, FS, PATH, SMC, SMR, alert, badge, debug, demo, demo_async, demo_sourcemaps, help, info, read_file_sync, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'NODEXH/DEMO';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  FS = require('fs');

  PATH = require('path');

  SMR = require('source-map-resolve');

  SMC = require('source-map');

  //-----------------------------------------------------------------------------------------------------------
  read_file_sync = function(path) {
    return FS.readFileSync(path, {
      encoding: 'utf-8'
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var bias1, bias2, code, d, error, i, k, line, location, map, path, ref;
    error = new Error("^hengist/nodexh@4458^ simulated error");
    path = __filename;
    code = read_file_sync(path);
    ref = PATH.dirname(path);
    debug({path, ref});
    try {
      d = SMR.resolveSync(code, path, read_file_sync);
    } catch (error1) {
      error = error1;
      // if error.code is 'ENOENT'
      //   warn "^4487^ file not found: #{rpr }"
      warn(error.code, error.name);
      throw error;
    }
    info('^330^', 'd.sourcesResolved:', d.sourcesResolved);
    info('^330^', 'd.sourcesContent:', d.sourcesContent);
    info('^330^', 'd.map:', (function() {
      var results;
      results = [];
      for (k in d.map) {
        results.push(k);
      }
      return results;
    })());
    info('^330^', 'd.map:', d.map);
    info('^330^', 'd.url:', d.url);
    info('^330^', 'd.sourcesRelativeTo:', d.sourcesRelativeTo);
    info('^330^', 'd.sourceMappingURL:', d.sourceMappingURL);
    debug((function() {
      var results;
      results = [];
      for (k in SMC) {
        results.push(k);
      }
      return results;
    })());
    // d.map.sourcesContent = d.sourcesContent
    map = new SMC.SourceMapConsumer(d.map);
// map = await new SMC.SourceMapConsumer d.map
// debug '^2772^', map
    for (line = i = 1; i <= 120; line = ++i) {
      bias1 = SMC.SourceMapConsumerLEAST_UPPER_BOUND;
      bias2 = SMC.SourceMapConsumerGREATEST_LOWER_BOUND;
      // urge '^7764^', { line, }, ( map.originalPositionFor { line, column: 3, bias: bias1, } ), ( map.originalPositionFor { line, column: 3, bias: bias2, } )
      location = map.originalPositionFor({
        line,
        column: 3,
        bias: bias1
      });
      if (location.line == null) {
        continue;
      }
      urge('^7764^', {line}, location);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_async = function() {
    var exit_handler;
    exit_handler = function(error) {
      setImmediate(function() {
        setTimeout((function() {
          return urge('later');
        }), 500);
        return debug('^33443^', error);
      });
      return null;
    };
    process.on('uncaughtExceptionMonitor', exit_handler);
    process.on('unhandledRejection', exit_handler);
    throw new Error("^4476^ an error");
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_sourcemaps = function() {
    
  var fs = require('fs');
  var smc = require('source-map');

  var stack = "TypeError: undefined is not a function\r\nat h/min/min.js?1404839824760:9:23048";
  stack = stack.split(/\r\n/g);
  var error = stack.shift(); // First line is the actual error

  var errors = [];
  var file = null;
  /* thx to https://stackoverflow.com/a/24638082/7568091 */
  ;
    debug('^778^', stack);
    return 
  stack.forEach(function(line){
      var _trace = line.split('/').pop();
      var trace = {};
      trace.filename = _trace.split('?').shift();
      _trace = _trace.split(':');
      trace.line = parseInt(_trace[1], 10);
      trace.column = parseInt(_trace[2], 10);
      errors.push(trace);

      if(!file)
          file = trace.filename.split('.').shift();

      trace.filename = __dirname + '/../min/' + trace.filename;
  });

  // This does not account for multiple files in stack trace right now
  var map = fs.readFileSync(__dirname + '/../src/' + file + '.js.map');
  map = JSON.parse(map);
  var sm = new smc.SourceMapConsumer(map);
  console.log(sm.originalPositionFor(errors[0]));
  ;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo());
    })();
  }

  // await demo_async()
// await demo_sourcemaps()

}).call(this);

//# sourceMappingURL=demo.js.map