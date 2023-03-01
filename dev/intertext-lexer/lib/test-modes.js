(function() {
  'use strict';
  var GUY, H, alert, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/MODES'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('./helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.new_syntax_for_in_and_exclusive_jumps_1 = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        split: 'lines'
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: 'dq1[',
          pattern: /(?<!")"(?!")/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          tid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '.]',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          tid: 'text',
          concat: true
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'helo',
        [
          {
            mk: 'plain:text',
            value: 'helo'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            mk: 'plain:text',
            value: 'helo '
          },
          {
            mk: 'plain:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'world'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            mk: 'plain:text',
            value: 'helo '
          },
          {
            mk: 'plain:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'everyone'
          },
          {
            mk: 'dq1:nl',
            value: '\n'
          },
          {
            mk: 'dq1:text',
            value: 'out there'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'plain:text',
            value: '!'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ]
    ];
//.........................................................................................................
// for [ probe, matcher, error, ] in probes_and_matchers
//     lexer       = new_lexer()
//     # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
//     result      = []
//     for token from lexer.walk probe
//       result.push GUY.props.pick_with_fallback token, null, 'mk', 'value'
//     result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
//     H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, ref, result, result_rpr, token;
          lexer = new_lexer();
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          result = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value'));
          }
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              d = result[j];
              if (!d.$stamped) {
                results.push(d.value);
              }
            }
            return results;
          })()).join('');
          // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
          //.....................................................................................................
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
  this.new_syntax_for_in_and_exclusive_jumps_2 = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        split: 'lines'
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '[dq1',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          tid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '].',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          tid: 'text',
          concat: true
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'helo',
        [
          {
            mk: 'plain:text',
            value: 'helo'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            mk: 'plain:text',
            value: 'helo '
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'world'
          },
          {
            mk: 'plain:dq1',
            value: '"'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            mk: 'plain:text',
            value: 'helo '
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'everyone'
          },
          {
            mk: 'dq1:nl',
            value: '\n'
          },
          {
            mk: 'dq1:text',
            value: 'out there'
          },
          {
            mk: 'plain:dq1',
            value: '"'
          },
          {
            mk: 'plain:text',
            value: '!'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        '"one""two"',
        [
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'one'
          },
          {
            mk: 'plain:dq1',
            value: '"'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'two'
          },
          {
            mk: 'plain:dq1',
            value: '"'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, ref, result, result_rpr, token, tokens;
          lexer = new_lexer();
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          result = [];
          tokens = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            tokens.push(token);
            result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value'));
          }
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              d = result[j];
              if (!d.$stamped) {
                results.push(d.value);
              }
            }
            return results;
          })()).join('');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, tokens);
          //.....................................................................................................
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
  this.new_syntax_for_in_and_exclusive_jumps_3 = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        split: 'lines'
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '[dq1',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          tid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '.]',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          tid: 'text',
          concat: true
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'helo',
        [
          {
            mk: 'plain:text',
            value: 'helo'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            mk: 'plain:text',
            value: 'helo '
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'world'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            mk: 'plain:text',
            value: 'helo '
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'everyone'
          },
          {
            mk: 'dq1:nl',
            value: '\n'
          },
          {
            mk: 'dq1:text',
            value: 'out there'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'plain:text',
            value: '!'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        '"one""two"',
        [
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'one'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'dq1:text',
            value: 'two'
          },
          {
            mk: 'dq1:dq1',
            value: '"'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, ref, result, result_rpr, token, tokens;
          lexer = new_lexer();
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          result = [];
          tokens = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            tokens.push(token);
            result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value'));
          }
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              d = result[j];
              if (!d.$stamped) {
                results.push(d.value);
              }
            }
            return results;
          })()).join('');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, tokens);
          //.....................................................................................................
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

//# sourceMappingURL=test-modes.js.map