(function() {
  'use strict';
  var CND, FS, PATH, SMC, StackTracey, _demo_async, alert, badge, debug, demo, demo_async, demo_async_handler, demo_stacktracey, demo_synchronous_await, help, info, isa, read_file_sync, rpr, types, urge, validate, warn, whisper;

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

  SMC = require('source-map');

  StackTracey = require('stacktracey');

  types = new (require('intertype')).Intertype();

  ({isa, validate} = types);

  //-----------------------------------------------------------------------------------------------------------
  read_file_sync = function(path) {
    return FS.readFileSync(path, {
      encoding: 'utf-8'
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var SMR, bias1, bias2, c, code, column, d, error, i, j, k, line, location, map, path, ref, ref1, ref2;
    SMR = require('source-map-resolve');
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
    map.computeColumnSpans();
// debug '^2772^', map
    for (line = i = 1; i <= 120; line = ++i) {
      column = 3;
      bias1 = SMC.SourceMapConsumerLEAST_UPPER_BOUND;
      bias2 = SMC.SourceMapConsumerGREATEST_LOWER_BOUND;
      // urge '^7764^', { line, }, ( map.originalPositionFor { line, column: 3, bias: bias1, } ), ( map.originalPositionFor { line, column: 3, bias: bias2, } )
      location = map.originalPositionFor({
        line,
        column,
        bias: bias1
      });
      if (location.line == null) {
        // locations = map.originalPositionFor  { line, bias: bias1, }
        continue;
      }
      // generated_positions = map.allGeneratedPositionsFor { line: location.line, source: location.source, }
      // locations = map.allGeneratedPositionsFor location
      urge('^7764^', {line}, location);
      for (c = j = ref1 = column, ref2 = column + 10; (ref1 <= ref2 ? j <= ref2 : j >= ref2); c = ref1 <= ref2 ? ++j : --j) {
        location = map.originalPositionFor({
          line,
          column: c,
          bias: bias1
        });
        whisper(location);
      }
    }
    // for gp in generated_positions
    //   help '^7764^', ' ', gp
    //   # help '^7764^', ' ', map.originalPositionFor { line: gp.line, column: gp.column, }
    //   # urge '^7764^', ' ', map.originalPositionFor { line: gp.line, column: gp.lastColumn + 1, }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  _demo_async = async function() {
    var f, g, h;
    h = function(x) {
      return new Promise(function(resolve, reject) {
        var s;
        s = function() {
          var unreachable;
          if (x === 1) {
            throw new Error("^227-1^ x cannot be 1");
            unreachable = true;
          }
          if (x === 16) {
            return reject(new Error("^227-2^ x cannot be 16"));
          }
          return resolve(x ** 2);
        };
        return setTimeout(s, 250);
      });
    };
    g = function(x) {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(h(x ** 2));
        }), 250);
      });
    };
    f = function(x) {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(g(x ** 2));
        }), 250);
      });
    };
    // --enable-source-maps --stack-trace-limit=100
    urge((await f(3)));
    return urge((await f(2)));
  };

  // urge await f 1

  //-----------------------------------------------------------------------------------------------------------
  demo_async = async function() {
    var SourceMap, column, error, findSourceMap, frame, k, line, p1, p2, path, sourcemap, zbc, zbcolumn, zbl, zbline;
    ({findSourceMap, SourceMap} = require('module'));
    validate.function(findSourceMap);
    try {
      await _demo_async();
    } catch (error1) {
      error = error1;
      warn(error);
    }
    if (error != null) {
      demo_stacktracey(error);
      frame = (new StackTracey(error))[0];
      // { callee, calleeShort, file, fileRelative, fileShort, fileName, line, column, } = frame
      path = frame.file;
      // debug frames[ 0 ]
      // [ path, line, column, ] = frames[ 0 ]
      debug('^334^', findSourceMap); //(path[, error])
      debug('^334^', SourceMap); //(path[, error])
      debug('^334^', sourcemap = findSourceMap(path, error));
      debug('^334^', (function() {
        var results;
        results = [];
        for (k in sourcemap) {
          results.push(k);
        }
        return results;
      })());
      urge('^3736^', sourcemap.payload.file);
      // urge '^3736^', sourcemap.payload.version
      urge('^3736^', sourcemap.payload.sources);
      // urge '^3736^', sourcemap.payload.sourcesContent
      urge('^3736^', sourcemap.payload.names);
      // urge '^3736^', sourcemap.payload.mappings
      // urge '^3736^', sourcemap.payload.sourceRoot
      // for line in [ 1 .. 50 ]
      //   column = 0
      info('^767^', "frame:", frame);
      ({line, column} = frame);
      zbline = line - 1;
      zbcolumn = column - 1;
      p1 = sourcemap.findEntry(zbline, zbcolumn);
      info('^767^', {line, column, zbline, zbcolumn});
      info('^767^', p1);
      info('^767^', {
        generated: {
          line: p1.generatedLine + 1,
          column: p1.generatedColumn + 1
        },
        original: {
          line: p1.originalLine + 1,
          column: p1.originalColumn + 1
        }
      });
      zbl = zbline;
      zbc = zbcolumn;
      while (true) {
        zbc++;
        if (zbc - zbcolumn > 6) {
          break;
        }
        p2 = sourcemap.findEntry(zbl, zbc);
        urge('^930^', {
          line,
          column: zbc
        }, p2);
      }
      return;
      // continue if ( p1.originalLine is p2.originalLine ) and ( p1.originalColumn is p2.originalColumn )
      // break
      warn(error.message);
    }
    // throw error
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_stacktracey = function(error, handler) {
    var callee, calleeShort, column, file, fileName, fileRelative, fileShort, frame, frames, i, len, line;
    frames = new StackTracey(error); //.reverse()
    for (i = 0, len = frames.length; i < len; i++) {
      frame = frames[i];
      ({callee, calleeShort, file, fileRelative, fileShort, fileName, line, column} = frame);
      if (file === '' || file === (void 0)) {
        file = null;
      }
      if (callee === '' || callee === (void 0)) {
        callee = null;
      }
      if (file != null) {
        info('stacktracey', [file, line, column, callee]);
      } else {
        info('stacktracey', '——————————————————');
      }
    }
    // resolve_locations frames, handler
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_async_handler = function() {
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
  demo_synchronous_await = async function() {
    var f, g, h;
    f = function() {
      return new Promise(async function(resolve, reject) {
        return (await g());
      });
    };
    g = function() {
      return new Promise(async function(resolve, reject) {
        return (await h());
      });
    };
    h = function() {
      return new Promise(function(resolve, reject) {
        return reject(new Error("foobar"));
      });
    };
    return (await f());
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo()
      // await demo_async()
      return (await demo_synchronous_await());
    })();
  }

}).call(this);

//# sourceMappingURL=demo.js.map