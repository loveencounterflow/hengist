(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/OUTLINE-PREPROC'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  H = require('./helpers');

  //===========================================================================================================
  // START AND STOP TOKENS
  //-----------------------------------------------------------------------------------------------------------
  this.outline_preprocessor_instantiation = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        null,
        {
          blank_line_count: 2,
          indent_module: 2
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var parser;
          parser = new tools.outline._Preparser(probe);
          return resolve(parser.cfg);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.outline_preprocessor_basic = async function(T, done) {
    var Interlex, Transformer, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    ({Transformer} = require('../../../apps/moonriver'));
    //.........................................................................................................
    probes_and_matchers = [['', 'N', null], ['helo', "0'helo',N", null], ['abc\ndef', "0'abc',N,0'def',N", null], ['abc\ndef\n\n', "0'abc',N,0'def',N,N,N", null], ['abc\ndef\n\n\nxyz', "0'abc',N,0'def',N,N,N,0'xyz',N", null], ['abc\n def\n\n\nxyz', "0'abc',N,1'def',N,N,N,0'xyz',N", null], ['abc\n  def\n\n\nxyz', "0'abc',N,2'def',N,N,N,0'xyz',N", null], ['abc\n   def\n\n\nxyz', "0'abc',N,3'def',N,N,N,0'xyz',N", null], ['abc\n    def\n\n\nxyz', "0'abc',N,4'def',N,N,N,0'xyz',N", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, parser, ref, result, tokens;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          // echo '^97-1^', '————————————————————————————'
          result = [];
          tokens = [];
          parser = tools.outliner.$010_lexing.as_pipeline();
          parser.send(probe);
          ref = parser.walk_and_stop(probe);
          for (d of ref) {
            tokens.push(d);
            switch (d.tid) {
              case 'nl':
                result.push('N');
                break;
              case 'material':
                result.push(`${d.data.spc_count}${rpr(d.data.material)}`);
            }
          }
          result = result.join(',');
          // debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
          H.tabulate(`${rpr(probe)}`, tokens);
          // echo [ probe, result, error, ]
          return resolve(result);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.outline_blank_line_consolidation = async function(T, done) {
    var Interlex, Transformer, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    ({Transformer} = require('../../../apps/moonriver'));
    //.........................................................................................................
    probes_and_matchers = [['', 'N1', null], ['helo', "0'helo',N1", null], ['abc\ndef', "0'abc',N1,0'def',N1", null], ['abc\ndef\n\n', "0'abc',N1,0'def',N3", null], ['abc\ndef\n\n\nxyz', "0'abc',N1,0'def',N3,0'xyz',N1", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, parser, ref, result, tokens;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          // echo '^97-1^', '————————————————————————————'
          result = [];
          tokens = [];
          parser = tools.outliner.$020_consolidate.as_pipeline();
          parser.send(probe);
          ref = parser.walk_and_stop(probe);
          for (d of ref) {
            tokens.push(d);
            switch (d.tid) {
              case 'nls':
                result.push(`N${d.data.count}`);
                break;
              case 'material':
                result.push(`${d.data.spc_count}${rpr(d.data.material)}`);
            }
          }
          result = result.join(',');
          // debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
          // H.tabulate "#{rpr probe}", tokens
          // echo [ probe, result, error, ]
          return resolve(result);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.outline_structure = async function(T, done) {
    var Interlex, Transformer, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    ({Transformer} = require('../../../apps/moonriver'));
    //.........................................................................................................
    probes_and_matchers = [['', 'null>0,0N1,0>null', null], ['helo', "null>0,0'helo',0N1,0>null", null], ['abc\ndef', "null>0,0'abc',0N1,0'def',0N1,0>null", null], ['abc\ndef\n\n', "null>0,0'abc',0N1,0'def',0N3,0>null", null], ['abc\ndef\n\n\nxyz', "null>0,0'abc',0N1,0'def',0N3,0'xyz',0N1,0>null", null], ['abc\ndef\n\n\n  xyz\n  !', "null>0,0'abc',0N1,0'def',0N3,0>2,2'xyz',2N1,2'!',2N1,2>null", null], ['abc\ndef\n\n\n  xyz\n\n\n', "null>0,0'abc',0N1,0'def',0N3,0>2,2'xyz',2N4,2>null", null], ['abc\ndef\n  xyz\n\n\n', "null>0,0'abc',0N1,0'def',0N1,0>2,2'xyz',2N4,2>null", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, parser, ref, result, tokens;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          // echo '^97-1^', '————————————————————————————'
          result = [];
          tokens = [];
          parser = tools.outliner.$030_structure.as_pipeline();
          parser.send(probe);
          ref = parser.walk_and_stop(probe);
          for (d of ref) {
            tokens.push(d);
            switch (d.tid) {
              case 'nl':
              case 'nls':
                result.push(`${d.data.spc_count}N${d.data.nl_count}`);
                break;
              case 'material':
                result.push(`${d.data.spc_count}${rpr(d.data.material)}`);
                break;
              case 'dentchg':
                result.push(`${d.data.from}>${rpr(d.data.to)}`);
            }
          }
          result = result.join(',');
          // debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
          // H.norm_tabulate "#{rpr probe}", tokens
          // echo [ probe, result, error, ]
          return resolve(result);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.outline_blocks = async function(T, done) {
    var Interlex, Transformer, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    ({Transformer} = require('../../../apps/moonriver'));
    //.........................................................................................................
    probes_and_matchers = [['', '0>0,0N1,0>0', null], ['\n', '0>0,0N1,0>0', null], ['\n\n', '0>0,0N1,0>0', null], ['helo', "0>0,0'helo',0N1,0>0", null], ['abc\ndef', "0>0,0'abc',0N1,0'def',0N1,0>0", null], ['abc\ndef\n\n', "0>0,0'abc',0N1,0'def',0N3,0>0", null], ['abc\ndef\n\n\nxyz', "0>0,0'abc',0N1,0'def',0N3,0'xyz',0N1,0>0", null], ['abc\ndef\n\n\n  xyz\n  !', "0>0,0'abc',0N1,0'def',0N3,0>2,2'xyz',2N1,2'!',2N1,2>0", null], ['abc\ndef\n\n\n  xyz\n\n\n', "0>0,0'abc',0N1,0'def',0N3,0>2,2'xyz',2N4,2>0", null], ['abc\ndef\n  xyz\n\n\n', "0>0,0'abc',0N1,0'def',0N1,0>2,2'xyz',2N4,2>0", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, parser, ref, result, tokens;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          // echo '^97-1^', '————————————————————————————'
          result = [];
          tokens = [];
          parser = tools.outliner.$040_blocks.as_pipeline();
          parser.send(probe);
          ref = parser.walk_and_stop(probe);
          for (d of ref) {
            tokens.push(d);
            switch (d.tid) {
              case 'nl':
              case 'nls':
                result.push(`${d.data.spc_count}N${d.data.nl_count}`);
                break;
              case 'material':
                result.push(`${d.data.spc_count}${rpr(d.data.material)}`);
                break;
              case 'dentchg':
                result.push(`${d.data.from}>${rpr(d.data.to)}`);
                break;
              case 'block:start':
                result.push(`${d.data.spc_count}【`);
                break;
              case 'block:stop':
                result.push(`${d.data.spc_count}】`);
            }
          }
          result = result.join(',');
          // debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
          H.norm_tabulate(`${rpr(probe)}`, tokens);
          // echo [ probe, result, error, ]
          return resolve(result);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @outline_preprocessor_instantiation()
      // @outline_preprocessor_basic()
      // test @outline_preprocessor_basic
      // test @outline_blank_line_consolidation
      // test @outline_structure
      return test(this.outline_blocks);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-outline-preprocessor.js.map