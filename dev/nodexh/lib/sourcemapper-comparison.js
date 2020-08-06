(function() {
  'use strict';
  var CAT, CND, CSM, FS, PATH, SMR, SOURCEMAP, StackTracey, alert, badge, debug, echo, f, g, get_error_callsites, get_source, get_stacktracey, help, info, load_source_map, log, rpr, show_stacktracey, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'nodexh';

  log = CND.get_logger('plain', badge);

  debug = CND.get_logger('debug', badge);

  info = CND.get_logger('info', badge);

  warn = CND.get_logger('warn', badge);

  alert = CND.get_logger('alert', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  // stackman                  = ( require 'stackman' )()
  get_error_callsites = require('error-callsites');

  load_source_map = (require('util')).promisify(require('load-source-map'));

  FS = require('fs');

  PATH = require('path');

  //...........................................................................................................
  CSM = require('convert-source-map');

  SMR = require('source-map-resolve');

  SOURCEMAP = require('source-map');

  get_source = require('get-source');

  StackTracey = require('stacktracey');

  types = new (require('intertype')).Intertype();

  CAT = require('multimix/lib/cataloguing');

  // debug ( k for k of get_source )

  // file      = get_source __filename
  // for line in [ 1 .. 20 ]
  //   target    = file.resolve { line, column: 1, }
  //   debug ( k for k of target )
  //   debug target.sourceFile.path
  //   debug target.sourceFile.error
  //   debug target.error
  //   info "#{target.path} #{target.line}:#{target.column}"
  // # info target.sourceFile
  // # info target.sourceLine

  // source    = FS.readFileSync __filename, { encoding: 'utf-8', }
  // x         = CSM.fromMapFileSource( source, __dirname )
  // debug ( k for k of x.sourcemap )
  // debug ( k for k of SOURCEMAP )
  // smc       = new SOURCEMAP.SourceMapConsumer x.sourcemap
  // debug ( k for k of smc )
  // # debug CAT.all_keys_of smc
  get_stacktracey = function(error) {
    var R, d, i, idx, ref, s, stack;
    stack = (new StackTracey(error)).withSources();
    stack = stack.clean();
    R = [];
    for (idx = i = ref = stack.items.length - 1; i >= 0; idx = i += -1) {
      d = stack.items[idx];
      // debug '^2798^', ( k for k of d )
      s = {
        // target_path:    d.file
        relpath: d.fileRelative, // fileShort
        native: d.native,
        // is_nodejs:      d.native
        is_other: d.thirdParty,
        line: d.line,
        column: d.column,
        source: d.sourceLine
      };
      // for k in [ 'sourceLine', 'native', 'file', 'line', 'column', 'calleeShort', 'fileRelative', 'fileShort', 'fileName', 'thirdParty', 'name',]
      //   debug k, rpr d[ k ]
      R.push(s);
    }
    // info '\n' + stack.asTable()
    return R;
  };

  show_stacktracey = function(error) {
    var d, i, len, ref;
    ref = get_stacktracey(error);
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      echo(d);
    }
    return null;
  };

  f = function(x) {
    return new Promise((resolve, reject) => {
      return setImmediate((function() {
        return reject(new Error("ooops"));
      }));
    });
  };

  g = async function() {
    return (await f(108));
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var error;
      try {
        return (await g());
      } catch (error1) {
        error = error1;
        return show_stacktracey(error);
      }
    })();
  }

}).call(this);

//# sourceMappingURL=sourcemapper-comparison.js.map