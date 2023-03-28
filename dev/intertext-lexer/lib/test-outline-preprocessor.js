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
          parser = new tools.Outline_preprocessor(probe);
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
    var Interlex, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    probes_and_matchers = [['helo', "0'helo'", null], ['abc\ndef', "0'abc',0'def'", null], ['abc\ndef\n\n', "0'abc',0'def',N,N", null], ['abc\ndef\n\n\nxyz', "0'abc',0'def',N,N,0'xyz'", null]];
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
          parser = new tools.Outline_preprocessor();
          ref = parser.walk(probe);
          for (d of ref) {
            tokens.push(d);
            switch (d.tid) {
              case 'blank':
                result.push('N');
                break;
              case 'material':
                result.push(`${d.data.level}${rpr(d.value)}`);
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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-outline-preprocessor.js.map