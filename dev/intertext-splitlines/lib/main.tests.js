(function() {
  'use strict';
  var CND, badge, debug, demo, echo, freeze, help, info, lets, rpr, test, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERTEXT-SPLITLINES/TESTS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // _strip_ansi               = require 'strip-ansi'
  types = new (require('intertype')).Intertype();

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  // resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

  //-----------------------------------------------------------------------------------------------------------
  this["SPLITLINES basic"] = async function(T, done) {
    var SL, error, i, input, len, matcher, probes_and_matchers;
    SL = require('../../../apps/intertext-splitlines');
    //.........................................................................................................
    probes_and_matchers = [['a short text', ['a short text'], null], ["some\nlines\nof text", ['some', 'lines', 'of text'], null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [input, matcher, error] = probes_and_matchers[i];
      await T.perform(input, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var ctx, probe, result;
          probe = Buffer.from(input);
          ctx = SL.new_context();
          result = [...(SL.walk_lines(ctx, probe))];
          result = [...result, ...(SL.flush(ctx))];
          return resolve(result);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SPLITLINES assemble longer input"] = function(T, done) {
    var SL, ctx, d, i, input, inputs, j, len, len1, result;
    inputs = ["helo", " there!\nHere ", "come\na few lines\n", "of text that are\nquite unevenly ", "spread over several\n", "buffers.\n"];
    inputs = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        d = inputs[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    SL = require('../../../apps/intertext-splitlines');
    //.........................................................................................................
    ctx = SL.new_context();
    result = [];
    for (i = 0, len = inputs.length; i < len; i++) {
      input = inputs[i];
      result = [...result, ...(SL.walk_lines(ctx, input))];
    }
    result = [...result, ...(SL.flush(ctx))];
    T.eq(result, ['helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.']);
    //.........................................................................................................
    ctx = SL.new_context({
      skip_empty_last: false
    });
    result = [];
    for (j = 0, len1 = inputs.length; j < len1; j++) {
      input = inputs[j];
      result = [...result, ...(SL.walk_lines(ctx, input))];
    }
    result = [...result, ...(SL.flush(ctx))];
    T.eq(result, ['helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.', '']);
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SPLITLINES.splitlines"] = function(T, done) {
    var SL, d, inputs, matcher;
    inputs = ["helo", " there!\nHere ", "come\na few lines\n", "of text that are\nquite unevenly ", "spread over several\n", "buffers.\n"];
    matcher = ['helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.'];
    inputs = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        d = inputs[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    SL = require('../../../apps/intertext-splitlines');
    T.eq(SL.splitlines(inputs), matcher);
    T.eq(SL.splitlines(...inputs), matcher);
    T.eq(SL.splitlines({}, ...inputs), matcher);
    T.eq(SL.splitlines(null, ...inputs), matcher);
    T.eq(SL.splitlines({
      skip_empty_last: false
    }, ...inputs), [...matcher, '']);
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SPLITLINES.splitlines can return buffers"] = function(T, done) {
    var SL, d, inputs, matcher;
    inputs = ["helo", " there!\nHere ", "come\na few lines\n", "of text that are\nquite unevenly ", "spread over several\n", "buffers.\n"];
    inputs = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        d = inputs[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    matcher = ['helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.'];
    matcher = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = matcher.length; i < len; i++) {
        d = matcher[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    SL = require('../../../apps/intertext-splitlines');
    T.eq(SL.splitlines({
      decode: false
    }, ...inputs), matcher);
    T.eq(SL.splitlines({
      decode: false,
      skip_empty_last: false
    }, ...inputs), [...matcher, Buffer.from('')]);
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SPLITLINES can keep line endings"] = function(T, done) {
    var SL, d, inputs, matcher, result;
    inputs = ["helo", " there!\nHere ", "come\na few lines\n", "of text that are\nquite unevenly ", "spread over several\n", "buffers.\n"];
    inputs = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        d = inputs[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    matcher = ['helo there!\n', 'Here come\n', 'a few lines\n', 'of text that are\n', 'quite unevenly spread over several\n', 'buffers.\n'];
    matcher = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = matcher.length; i < len; i++) {
        d = matcher[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    SL = require('../../../apps/intertext-splitlines');
    result = SL.splitlines({
      decode: false,
      keep_newlines: true
    }, ...inputs);
    help('^3334^', result);
    T.eq(result, matcher);
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var SL, ctx, d, i, input, inputs, len, line, ref, ref1;
    inputs = ["helo", " there!\nHere ", "come\na few lines\n", "of text that are\nquite unevenly ", "spread over several\n", "buffers."];
    inputs = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        d = inputs[i];
        results.push(Buffer.from(d));
      }
      return results;
    })();
    SL = require('../../../apps/intertext-splitlines');
    ctx = SL.new_context();
    for (i = 0, len = inputs.length; i < len; i++) {
      input = inputs[i];
      ref = SL.walk_lines(ctx, input);
      for (line of ref) {
        info(rpr(line));
      }
    }
    ref1 = SL.flush(ctx);
    for (line of ref1) {
      info(rpr(line));
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      demo();
      return test(this);
    })();
  }

  // test @[ "SPLITLINES basic" ]
// test @[ "SPLITLINES assemble longer input" ]

}).call(this);

//# sourceMappingURL=main.tests.js.map