(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

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

  //-----------------------------------------------------------------------------------------------------------
  this.in_and_exclusive_singular_jumps = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg = null) {
      var lexer;
      lexer = new Interlex({
        split: 'lines',
        ...cfg
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
          tid: 'dq2',
          jump: '[dqstr]',
          pattern: /(?<!")""(?!")/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '[dqstr',
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
        mode = 'dqstr';
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
            value: 'helo',
            data: null
          },
          {
            mk: 'plain:nl',
            value: '\n',
            data: null
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            mk: 'plain:text',
            value: 'helo ',
            data: null
          },
          {
            mk: 'dqstr:$border',
            value: '',
            data: {
              prv: 'plain',
              nxt: 'dqstr'
            }
          },
          {
            mk: 'dqstr:dq1',
            value: '"',
            data: null
          },
          {
            mk: 'dqstr:text',
            value: 'world',
            data: null
          },
          {
            mk: 'dqstr:dq1',
            value: '"',
            data: null
          },
          {
            mk: 'plain:$border',
            value: '',
            data: {
              prv: 'dqstr',
              nxt: 'plain'
            }
          },
          {
            mk: 'plain:nl',
            value: '\n',
            data: null
          }
        ],
        null
      ],
      [
        'abc "" xyz',
        [
          {
            mk: 'plain:text',
            value: 'abc ',
            data: null
          },
          {
            mk: 'plain:$border',
            value: '',
            data: {
              prv: 'plain',
              nxt: 'dqstr'
            }
          },
          {
            mk: 'dqstr:dq2',
            value: '""',
            data: null
          },
          {
            mk: 'plain:$border',
            value: '',
            data: {
              prv: 'dqstr',
              nxt: 'plain'
            }
          },
          {
            mk: 'plain:text',
            value: ' xyz',
            data: null
          },
          {
            mk: 'plain:nl',
            value: '\n',
            data: null
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
          lexer = new_lexer({
            border_tokens: true
          });
          if (T != null) {
            T.eq(lexer.cfg.border_tokens, true);
          }
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          result = [];
          tokens = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            tokens.push(token);
            result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value', 'data'));
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
          // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
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
  this.cannot_use_undeclared_mode = function(T, done) {
    var Interlex, compose, error, i, len, lexer, matcher, new_lexer, probe, probes_and_matchers;
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
          tid: 'lpb',
          jump: '[tag',
          pattern: /</u,
          reserved: '<'
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
          tid: 'rpb',
          jump: '.]',
          pattern: />/u,
          reserved: '>'
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
    probes_and_matchers = [['helo', null, 'xxxx']];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      error = null;
      lexer = new_lexer();
      // debug '^w342^', lexer.start()
      if (T != null) {
        T.throws(/no such mode/, function() {
          return lexer.start();
        });
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.auto_inserted_border_posts_inclusive = function(T, done) {
    var Interlex, compose, d, error, i, len, lexer, matcher, new_lexer, probe, probes_and_matchers, ref, result, result_rpr, token, tokens;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex({
        split: 'lines',
        ...cfg
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
          tid: 'lpb',
          jump: '[tag',
          pattern: /</u,
          reserved: '<'
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
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'rpb',
          jump: '.]',
          pattern: />/u,
          reserved: '>'
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
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'plain:nl',
            value: '\n',
            x1: 4,
            x2: 4
          }
        ],
        null
      ],
      [
        'helo<t1>',
        [
          {
            mk: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 4,
            x2: 4
          },
          {
            mk: 'tag:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            mk: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            mk: 'tag:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            mk: 'plain:nl',
            value: '\n',
            x1: 8,
            x2: 8
          }
        ],
        null
      ],
      [
        'helo<t1><t2>',
        [
          {
            mk: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 4,
            x2: 4
          },
          {
            mk: 'tag:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            mk: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            mk: 'tag:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            mk: 'tag:lpb',
            value: '<',
            x1: 8,
            x2: 9
          },
          {
            mk: 'tag:text',
            value: 't2',
            x1: 9,
            x2: 11
          },
          {
            mk: 'tag:rpb',
            value: '>',
            x1: 11,
            x2: 12
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 12,
            x2: 12
          },
          {
            mk: 'plain:nl',
            value: '\n',
            x1: 12,
            x2: 12
          }
        ],
        null
      ],
      [
        'helo<t1><t2',
        [
          {
            mk: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 4,
            x2: 4
          },
          {
            mk: 'tag:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            mk: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            mk: 'tag:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            mk: 'tag:lpb',
            value: '<',
            x1: 8,
            x2: 9
          },
          {
            mk: 'tag:text',
            value: 't2',
            x1: 9,
            x2: 11
          },
          {
            mk: 'tag:nl',
            value: '\n',
            x1: 11,
            x2: 11
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer = new_lexer({
        border_tokens: true,
        border_value: '|'
      });
      if (T != null) {
        T.eq(lexer.cfg.border_tokens, true);
      }
      if (T != null) {
        T.eq(lexer.cfg.border_value, '|');
      }
      // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result = [];
      tokens = [];
      ref = lexer.walk(probe);
      for (token of ref) {
        tokens.push(token);
        result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value', 'x1', 'x2'));
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
      echo([probe, result, error]);
      // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      //.....................................................................................................
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.auto_inserted_border_posts_exclusive = function(T, done) {
    var Interlex, compose, d, error, i, len, lexer, matcher, new_lexer, probe, probes_and_matchers, ref, result, result_rpr, token, tokens;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex({
        split: 'lines',
        ...cfg
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
          tid: 'lpb',
          jump: 'tag[',
          pattern: /</u,
          reserved: '<'
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
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'rpb',
          jump: '].',
          pattern: />/u,
          reserved: '>'
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
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'plain:nl',
            value: '\n',
            x1: 4,
            x2: 4
          }
        ],
        null
      ],
      [
        'helo<t1>',
        [
          {
            mk: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'plain:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 5,
            x2: 5
          },
          {
            mk: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 7,
            x2: 7
          },
          {
            mk: 'plain:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            mk: 'plain:nl',
            value: '\n',
            x1: 8,
            x2: 8
          }
        ],
        null
      ],
      [
        'helo<t1><t2>',
        [
          {
            mk: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'plain:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 5,
            x2: 5
          },
          {
            mk: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 7,
            x2: 7
          },
          {
            mk: 'plain:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            mk: 'plain:lpb',
            value: '<',
            x1: 8,
            x2: 9
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 9,
            x2: 9
          },
          {
            mk: 'tag:text',
            value: 't2',
            x1: 9,
            x2: 11
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 11,
            x2: 11
          },
          {
            mk: 'plain:rpb',
            value: '>',
            x1: 11,
            x2: 12
          },
          {
            mk: 'plain:nl',
            value: '\n',
            x1: 12,
            x2: 12
          }
        ],
        null
      ],
      [
        'helo<t1><t2',
        [
          {
            mk: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            mk: 'plain:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 5,
            x2: 5
          },
          {
            mk: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            mk: 'plain:$border',
            value: '|',
            x1: 7,
            x2: 7
          },
          {
            mk: 'plain:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            mk: 'plain:lpb',
            value: '<',
            x1: 8,
            x2: 9
          },
          {
            mk: 'tag:$border',
            value: '|',
            x1: 9,
            x2: 9
          },
          {
            mk: 'tag:text',
            value: 't2',
            x1: 9,
            x2: 11
          },
          {
            mk: 'tag:nl',
            value: '\n',
            x1: 11,
            x2: 11
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer = new_lexer({
        border_tokens: true,
        border_value: '|'
      });
      if (T != null) {
        T.eq(lexer.cfg.border_tokens, true);
      }
      if (T != null) {
        T.eq(lexer.cfg.border_value, '|');
      }
      // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result = [];
      tokens = [];
      ref = lexer.walk(probe);
      for (token of ref) {
        tokens.push(token);
        result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value', 'x1', 'x2'));
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
      echo([probe, result, error]);
      // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      //.....................................................................................................
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //===========================================================================================================
  // JUMP FUNCTIONS
  //-----------------------------------------------------------------------------------------------------------
  this.markup_with_variable_length = async function(T, done) {
    var $, $parse_md_codespan, Interlex, Pipeline, compose, error, first, i, last, len, matcher, new_toy_md_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var backtick_count, enter_codespan, exit_codespan, lexer;
      lexer = new Interlex({
        dotall: false
      });
      backtick_count = null;
      //.......................................................................................................
      enter_codespan = function({token, match, lexer}) {
        // debug '^35-1^', match
        backtick_count = token.value.length;
        return {
          jump: 'literal['
        };
      };
      //.......................................................................................................
      exit_codespan = function({token, match, lexer}) {
        // debug '^35-3^', match
        if (token.value.length === backtick_count) {
          backtick_count = null;
          return '.]';
        }
        token = lets(token, function(token) {
          token.tid = 'text';
          return token.mk = `${token.mode}:text`;
        });
        // debug '^345^', token
        return {token};
      };
      //.......................................................................................................
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'escchr',
        jump: null,
        pattern: /\\(?<chr>.)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'star1',
        jump: null,
        pattern: /(?<!\*)\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'codespan',
        jump: enter_codespan,
        pattern: /(?<!`)`+(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'other',
        jump: null,
        pattern: /[^*`\\]+/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        tid: 'codespan',
        jump: exit_codespan,
        pattern: /(?<!`)`+(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        tid: 'text',
        jump: null,
        pattern: /(?:\\`|[^`])+/u
      });
      //.......................................................................................................
      return lexer;
    };
    //.........................................................................................................
    $parse_md_codespan = function() {
      return function(d, send) {
        switch (d.mk) {
          case 'plain:codespan':
            send(stamp(d));
            send(H.new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
            break;
          case 'literal:codespan':
            send(stamp(d));
            send(H.new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
            break;
          default:
            send(d);
        }
        return null;
      };
    };
    //.........................................................................................................
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null], ['*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, md_lexer, p, result, result_rpr;
          md_lexer = new_toy_md_lexer('md');
          //.....................................................................................................
          p = new Pipeline();
          p.push(function(d, send) {
            var e, ref, results;
            if (d.tid !== 'p') {
              return send(d);
            }
            ref = md_lexer.walk(d.value);
            results = [];
            for (e of ref) {
              results.push(send(e));
            }
            return results;
          });
          p.push(H.$parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(H.new_token('^æ19^', {
            x1: 0,
            x2: probe.length
          }, 'plain', 'p', null, probe));
          result = p.run();
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
          // urge '^08-1^', ( Object.keys d ).sort() for d in result
          H.tabulate(`${probe} -> ${result_rpr} (${matcher})`, result); // unless result_rpr is matcher
          //.....................................................................................................
          return resolve(result_rpr);
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
      // test @
      // test @markup_with_variable_length
      // test @cannot_use_undeclared_mode
      // @auto_inserted_border_posts_inclusive()
      // @auto_inserted_border_posts_exclusive()
      // test @auto_inserted_border_posts_inclusive
      // test @auto_inserted_border_posts_exclusive
      // @in_and_exclusive_singular_jumps()
      return test(this.in_and_exclusive_singular_jumps);
    })();
  }

}).call(this);

//# sourceMappingURL=test-modes.js.map