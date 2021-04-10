(function() {
  'use strict';
  var CND, FS, PATH, alert, badge, debug, help, info, provide, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'NODEXH/TESTS';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  FS = require('fs');

  PATH = require('path');

  test = require('guy-test');

  // { lets
  //   freeze }                = require 'letsfreezethat'

  //###########################################################################################################
  provide = function() {
    var SourceMap, StackTracey, findSourceMap, isa, type_of, types, validate;
    types = new (require('intertype')).Intertype();
    ({isa, type_of, validate} = types);
    StackTracey = require('stacktracey');
    ({findSourceMap, SourceMap} = require('module'));
    if (!isa.function(findSourceMap)) {
      /* TAINT consider to fall back to stacktraces w/o sourcemaps */
      throw new Error("^33637^ must run node with `--enable-source-maps`");
    }
    //-----------------------------------------------------------------------------------------------------------
    this.Frame = class Frame extends Object {};
    this.Location = class Location extends Object {};
    //-----------------------------------------------------------------------------------------------------------
    this._reformat_stacktracey_frame = function(frame) {
      var R;
      R = new this.Frame();
      // debug '^554^', typeof R
      // debug '^554^', type_of R
      // debug '^554^', isa.frame R
      R.name = frame.callee;
      R.path = frame.file;
      R.line_nr = frame.line;
      R.column_nr = frame.column;
      R.line_idx = frame.line - 1;
      R.column_idx = frame.column - 1;
      return Object.freeze(R);
    };
    //-----------------------------------------------------------------------------------------------------------
    this.frames_from_error = function(error) {
      var d, i, len, ref, results;
      ref = new StackTracey(error);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        results.push(this._reformat_stacktracey_frame(d));
      }
      return results;
    };
    //-----------------------------------------------------------------------------------------------------------
    this.new_sourcemap = function(frame, error) {
      /* TAINT wrap return value for type safety? */
      validate.frame(frame);
      /* TAINT superficial class name check */      validate.nonempty_text(frame.path);
      return findSourceMap(frame.path, error);
    };
    //-----------------------------------------------------------------------------------------------------------
    this.map_frame = function(sourcemap, frame) {
      var R/* TAINT superficial class name check */;
      validate.sourcemap(sourcemap);
      /* TAINT superficial class name check */      validate.frame(frame);
      R = this._map_frame(sourcemap, frame.path, frame.line_nr, frame.column_nr);
      Object.freeze(R.original);
      Object.freeze(R.generated);
      Object.freeze(R);
      return R;
    };
    //-----------------------------------------------------------------------------------------------------------
    return this._map_frame = function(sourcemap, path, line_nr, column_nr) {
      var R, p;
      p = sourcemap.findEntry(line_nr - 1, column_nr - 1);
      R = new this.Location();
      R.original = {};
      R.generated = {};
      R.original.line_nr = p.originalLine + 1;
      R.original.column_nr = p.originalColumn + 1;
      R.original.line_idx = p.originalLine;
      R.original.column_idx = p.originalColumn;
      R.original.path = p.originalSource;
      R.generated.line_nr = p.generatedLine + 1;
      R.generated.column_nr = p.generatedColumn + 1;
      R.generated.line_idx = p.generatedLine;
      R.generated.column_idx = p.generatedColumn;
      R.generated.path = path;
      return R;
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this["basics"] = function(T, done) {
    var MODULE, NODEXH, error, frame, frames, isa, p1, sourcemap, type_of, types, validate;
    types = new (require('intertype')).Intertype();
    ({isa, type_of, validate} = types);
    // SMR                       = require 'source-map-resolve'
    // SMC                       = require 'source-map'
    provide.apply(NODEXH = {});
    //.........................................................................................................
    MODULE = require('./assets-file1');
    T.eq(MODULE.my_function(42), 1764);
    try {
      MODULE.my_function('helo');
    } catch (error1) {
      error = error1;
      // debug '^787^', error
      frames = NODEXH.frames_from_error(error);
      frame = frames[0];
      T.ok(Object.isFrozen(frame));
      T.eq(type_of(frame), 'frame');
      debug('^558^', frame);
      T.eq(frame.name, 'Object.my_function');
      T.ok(frame.path.endsWith('/assets-file1.js'));
      T.eq(frame.line_nr, 20);
      T.eq(frame.column_nr, 13);
      T.eq(frame.line_idx, 19);
      T.eq(frame.column_idx, 12);
      sourcemap = NODEXH.new_sourcemap(frame, error);
      p1 = NODEXH.map_frame(sourcemap, frame);
      debug('^5029^', JSON.stringify(p1, null, '  '));
      T.ok(Object.isFrozen(p1.original));
      T.ok(Object.isFrozen(p1.generated));
      T.ok(Object.isFrozen(p1));
      T.eq(type_of(p1), 'location');
      T.eq(p1.original.line_nr, 17);
      T.eq(p1.original.column_nr, 11);
      T.eq(p1.original.line_idx, 16);
      T.eq(p1.original.column_idx, 10);
      T.eq(p1.original.path.endsWith('/nodexh/src/assets-file1.coffee'));
      T.eq(p1.generated.line_nr, 20);
      T.eq(p1.generated.column_nr, 13);
      T.eq(p1.generated.line_idx, 19);
      T.eq(p1.generated.column_idx, 12);
      T.eq(p1.generated.path.endsWith('/nodexh/lib/assets-file1.js'));
    }
    if (error == null) {
      T.fail("^776^ expected error, got none");
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["find segments"] = function(T, done) {
    var NODEXH, column_nr, error, frame, frames, i, isa, j, line_nr, p1, p2, ref, sourcemap, type_of, types, validate;
    types = new (require('intertype')).Intertype();
    ({isa, type_of, validate} = types);
    // SMR                       = require 'source-map-resolve'
    // SMC                       = require 'source-map'
    provide.apply(NODEXH = {});
    try {
      //.........................................................................................................
      require('./assets-file2');
    } catch (error1) {
      error = error1;
      warn(error);
      frames = NODEXH.frames_from_error(error);
      frame = frames[0];
      urge('^336^', frame);
      sourcemap = NODEXH.new_sourcemap(frame, error);
      p1 = NODEXH.map_frame(sourcemap, frame);
      urge('^336^', p1);
      for (line_nr = i = 1, ref = p1.generated.line_nr; (1 <= ref ? i <= ref : i >= ref); line_nr = 1 <= ref ? ++i : --i) {
        for (column_nr = j = 1; j <= 10; column_nr = ++j) {
          p2 = NODEXH._map_frame(sourcemap, frame.path, line_nr, column_nr);
          // whisper '^77762^', line_nr, column_nr, p2.original
          debug('^77762^', {line_nr, column_nr}, '->', {
            line_nr: p2.original.line_nr,
            column_nr: p2.original.column_nr
          });
        }
      }
    }
    if (error == null) {
      T.fail("^776^ expected error, got none");
    }
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["retrieve source code"] = function(T, done) {
    /* TAINT can re-use sourcemap from same file */
    /* TAINT how to deal with unmapped sources? */
    var MODULE, NODEXH, error, frame, frames, i, isa, len, location, sourcemap, type_of, types, validate;
    types = new (require('intertype')).Intertype();
    ({isa, type_of, validate} = types);
    // SMR                       = require 'source-map-resolve'
    // SMC                       = require 'source-map'
    provide.apply(NODEXH = {});
    //.........................................................................................................
    MODULE = require('./assets-file1');
    T.eq(MODULE.my_function(42), 1764);
    try {
      MODULE.my_function('helo');
    } catch (error1) {
      error = error1;
      error.stack = error.stack.replace(/\n.*guy-test[\s\S]*/, '');
      help(error.stack);
      error.stack = (error.stack + '\n').replace(/\n\s*->\s+[^\n]+\n/g, '\n');
      warn(error);
      frames = NODEXH.frames_from_error(error);
      for (i = 0, len = frames.length; i < len; i++) {
        frame = frames[i];
        sourcemap = NODEXH.new_sourcemap(frame, error);
        location = NODEXH.map_frame(sourcemap, frame);
        urge('^336^', frame, location);
      }
    }
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=tests.js.map