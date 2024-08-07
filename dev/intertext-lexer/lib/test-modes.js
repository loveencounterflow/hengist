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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: 'dq1[',
          pattern: /(?<!")"(?!")/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '.]',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
            $key: 'plain:text',
            value: 'helo'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            $key: 'plain:text',
            value: 'helo '
          },
          {
            $key: 'plain:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'world'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            $key: 'plain:text',
            value: 'helo '
          },
          {
            $key: 'plain:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'everyone'
          },
          {
            $key: 'dq1:nl',
            value: '\n'
          },
          {
            $key: 'dq1:text',
            value: 'out there'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'plain:text',
            value: '!'
          },
          {
            $key: 'plain:nl',
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
//       result.push GUY.props.pick_with_fallback token, null, '$key', 'value'
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
            result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value'));
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '[dq1',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '].',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
            $key: 'plain:text',
            value: 'helo'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            $key: 'plain:text',
            value: 'helo '
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'world'
          },
          {
            $key: 'plain:dq1',
            value: '"'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            $key: 'plain:text',
            value: 'helo '
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'everyone'
          },
          {
            $key: 'dq1:nl',
            value: '\n'
          },
          {
            $key: 'dq1:text',
            value: 'out there'
          },
          {
            $key: 'plain:dq1',
            value: '"'
          },
          {
            $key: 'plain:text',
            value: '!'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        '"one""two"',
        [
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'one'
          },
          {
            $key: 'plain:dq1',
            value: '"'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'two'
          },
          {
            $key: 'plain:dq1',
            value: '"'
          },
          {
            $key: 'plain:nl',
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
            result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value'));
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '[dq1',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '.]',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
            $key: 'plain:text',
            value: 'helo'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            $key: 'plain:text',
            value: 'helo '
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'world'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            $key: 'plain:text',
            value: 'helo '
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'everyone'
          },
          {
            $key: 'dq1:nl',
            value: '\n'
          },
          {
            $key: 'dq1:text',
            value: 'out there'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'plain:text',
            value: '!'
          },
          {
            $key: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        '"one""two"',
        [
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'one'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'dq1:text',
            value: 'two'
          },
          {
            $key: 'dq1:dq1',
            value: '"'
          },
          {
            $key: 'plain:nl',
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
            result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value'));
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
  this.singular_jumps = async function(T, done) {
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq2',
          jump: '[dqstr]',
          pattern: /(?<!")""(?!")/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '[dqstr',
          pattern: /(?<!")"(?!")/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dqstr';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'dq1',
          jump: '.]',
          pattern: /"/u,
          reserved: '"'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
            $key: 'plain:text',
            value: 'helo',
            data: null
          },
          {
            $key: 'plain:nl',
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
            $key: 'plain:text',
            value: 'helo ',
            data: null
          },
          {
            $key: 'dqstr:$border',
            value: '',
            data: {
              prv: 'plain',
              nxt: 'dqstr'
            }
          },
          {
            $key: 'dqstr:dq1',
            value: '"',
            data: null
          },
          {
            $key: 'dqstr:text',
            value: 'world',
            data: null
          },
          {
            $key: 'dqstr:dq1',
            value: '"',
            data: null
          },
          {
            $key: 'plain:$border',
            value: '',
            data: {
              prv: 'dqstr',
              nxt: 'plain'
            }
          },
          {
            $key: 'plain:nl',
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
            $key: 'plain:text',
            value: 'abc ',
            data: null
          },
          {
            $key: 'plain:$border',
            value: '',
            data: {
              prv: 'plain',
              nxt: 'dqstr'
            }
          },
          {
            $key: 'dqstr:dq2',
            value: '""',
            data: null
          },
          {
            $key: 'plain:$border',
            value: '',
            data: {
              prv: 'dqstr',
              nxt: 'plain'
            }
          },
          {
            $key: 'plain:text',
            value: ' xyz',
            data: null
          },
          {
            $key: 'plain:nl',
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
            result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value', 'data'));
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
  this.singular_jumps_move_forward_correctly = async function(T, done) {
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'c_lsr',
          jump: '[tag]',
          pattern: '</>',
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lpb',
          jump: '[tag',
          pattern: '<',
          reserved: '<'
        });
        lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
        return lexer.add_reserved_lexeme({
          mode,
          lxid: '$forbidden',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lbp',
          jump: null,
          pattern: '<',
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'rbp',
          jump: null,
          pattern: '>',
          reserved: '>'
        });
        lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
        return lexer.add_reserved_lexeme({
          mode,
          lxid: '$forbidden',
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
            $key: 'plain:text',
            value: 'helo',
            data: null
          }
        ],
        null
      ],
      [
        'abc</>def<what>',
        [
          {
            $key: 'plain:text',
            value: 'abc',
            data: null
          },
          {
            $key: 'plain:$border',
            value: '',
            data: {
              prv: 'plain',
              nxt: 'tag'
            }
          },
          {
            $key: 'tag:c_lsr',
            value: '</>',
            data: null
          },
          {
            $key: 'plain:$border',
            value: '',
            data: {
              prv: 'tag',
              nxt: 'plain'
            }
          },
          {
            $key: 'plain:text',
            value: 'def',
            data: null
          },
          {
            $key: 'tag:$border',
            value: '',
            data: {
              prv: 'plain',
              nxt: 'tag'
            }
          },
          {
            $key: 'tag:lpb',
            value: '<',
            data: null
          },
          {
            $key: 'tag:text',
            value: 'what',
            data: null
          },
          {
            $key: 'tag:rbp',
            value: '>',
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
            result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value', 'data'));
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lpb',
          jump: '[tag',
          pattern: /</u,
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'rpb',
          jump: '.]',
          pattern: />/u,
          reserved: '>'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lpb',
          jump: '[tag',
          pattern: /</u,
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'rpb',
          jump: '.]',
          pattern: />/u,
          reserved: '>'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
            $key: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            $key: 'plain:nl',
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
            $key: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            $key: 'tag:$border',
            value: '|',
            x1: 4,
            x2: 4
          },
          {
            $key: 'tag:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            $key: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            $key: 'tag:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            $key: 'plain:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            $key: 'plain:nl',
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
            $key: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            $key: 'tag:$border',
            value: '|',
            x1: 4,
            x2: 4
          },
          {
            $key: 'tag:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            $key: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            $key: 'tag:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            $key: 'plain:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            $key: 'tag:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            $key: 'tag:lpb',
            value: '<',
            x1: 8,
            x2: 9
          },
          {
            $key: 'tag:text',
            value: 't2',
            x1: 9,
            x2: 11
          },
          {
            $key: 'tag:rpb',
            value: '>',
            x1: 11,
            x2: 12
          },
          {
            $key: 'plain:$border',
            value: '|',
            x1: 12,
            x2: 12
          },
          {
            $key: 'plain:nl',
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
            $key: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            $key: 'tag:$border',
            value: '|',
            x1: 4,
            x2: 4
          },
          {
            $key: 'tag:lpb',
            value: '<',
            x1: 4,
            x2: 5
          },
          {
            $key: 'tag:text',
            value: 't1',
            x1: 5,
            x2: 7
          },
          {
            $key: 'tag:rpb',
            value: '>',
            x1: 7,
            x2: 8
          },
          {
            $key: 'plain:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            $key: 'tag:$border',
            value: '|',
            x1: 8,
            x2: 8
          },
          {
            $key: 'tag:lpb',
            value: '<',
            x1: 8,
            x2: 9
          },
          {
            $key: 'tag:text',
            value: 't2',
            x1: 9,
            x2: 11
          },
          {
            $key: 'tag:nl',
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
        result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value', 'x1', 'x2'));
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
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lpb',
          jump: 'tag[',
          pattern: /</u,
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
          concat: true
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          lxid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'rpb',
          jump: '].',
          pattern: />/u,
          reserved: '>'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'nl',
          jump: null,
          pattern: /$/u,
          value: '\n'
        });
        return lexer.add_catchall_lexeme({
          mode,
          lxid: 'text',
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
            $key: 'plain:text',
            value: 'helo',
            x1: 0,
            x2: 4
          },
          {
            $key: 'plain:nl',
            value: '\n',
            x1: 4,
            x2: 4
          }
        ],
        null
      ]
    ];
//.........................................................................................................
// [ 'helo<t1>', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:$border', value: '|', x1: 5, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'plain:$border', value: '|', x1: 7, x2: 7 }, { $key: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:nl', value: '\n', x1: 8, x2: 8 } ], null ]
// [ 'helo<t1><t2>', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:$border', value: '|', x1: 5, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'plain:$border', value: '|', x1: 7, x2: 7 }, { $key: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:lpb', value: '<', x1: 8, x2: 9 }, { $key: 'tag:$border', value: '|', x1: 9, x2: 9 }, { $key: 'tag:text', value: 't2', x1: 9, x2: 11 }, { $key: 'plain:$border', value: '|', x1: 11, x2: 11 }, { $key: 'plain:rpb', value: '>', x1: 11, x2: 12 }, { $key: 'plain:nl', value: '\n', x1: 12, x2: 12 } ], null ]
// [ 'helo<t1><t2', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:$border', value: '|', x1: 5, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'plain:$border', value: '|', x1: 7, x2: 7 }, { $key: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:lpb', value: '<', x1: 8, x2: 9 }, { $key: 'tag:$border', value: '|', x1: 9, x2: 9 }, { $key: 'tag:text', value: 't2', x1: 9, x2: 11 }, { $key: 'tag:nl', value: '\n', x1: 11, x2: 11 } ], null ]
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
        result.push(GUY.props.pick_with_fallback(token, null, '$key', 'value', 'x1', 'x2'));
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
      H.norm_tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, tokens);
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
    ({DATOM} = require('../../../apps/datom'));
    ({new_datom} = DATOM);
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
          return token.$key = `${token.mode}:text`;
        });
        return {token};
      };
      //.......................................................................................................
      lexer.add_lexeme({
        mode: 'plain',
        lxid: 'escchr',
        jump: null,
        pattern: /\\(?<chr>.)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        lxid: 'star1',
        jump: null,
        pattern: /(?<!\*)\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        lxid: 'codespan',
        jump: enter_codespan,
        pattern: /(?<!`)`+(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        lxid: 'other',
        jump: null,
        pattern: /[^*`\\]+/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        lxid: 'codespan',
        jump: exit_codespan,
        pattern: /(?<!`)`+(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        lxid: 'text',
        jump: null,
        pattern: /(?:\\`|[^`])+/u
      });
      //.......................................................................................................
      return lexer;
    };
    //.........................................................................................................
    $parse_md_codespan = function() {
      return function(d, send) {
        switch (d.$key) {
          case 'plain:codespan':
            send(stamp(d));
            send(new_datom('html:tag', {
              value: '<code>'
            }));
            break;
          case 'literal:codespan':
            send(stamp(d));
            send(new_datom('html:tag', {
              value: '</code>'
            }));
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
          p.push(function(source, send) {
            var e, ref, results;
            ref = md_lexer.walk(source);
            results = [];
            for (e of ref) {
              results.push(send(e));
            }
            return results;
          });
          p.push(H.$parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(probe);
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

  //===========================================================================================================
  // JUMP FUNCTIONS
  //-----------------------------------------------------------------------------------------------------------
  this.jump_function_return_values = function(T, done) {
    var Interlex, lex, new_lexer;
    ({Interlex} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(enter_marks) {
      var lexer;
      lexer = new Interlex({
        dotall: false
      });
      (() => {
        var mode;
        mode = 'p';
        lexer.add_lexeme({
          mode,
          lxid: 'L',
          jump: enter_marks,
          pattern: /\[/u
        });
        return lexer.add_lexeme({
          mode,
          lxid: 'P',
          jump: null,
          pattern: /[^\[\\]+/u
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'm';
        lexer.add_lexeme({
          mode,
          lxid: 'R',
          jump: '.]',
          pattern: /\]/u,
          reserved: ']'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'G',
          jump: null,
          pattern: /[U01234]/u
        });
        return lexer.add_reserved_lexeme({
          mode,
          lxid: 'forbidden',
          concat: true
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    lex = function(lexer, probe) {
      var R, ref, token;
      R = [];
      ref = lexer.walk(probe);
      for (token of ref) {
        R.push(`${token.$key}${rpr(token.value)}`);
      }
      return R.join('|');
    };
    //.........................................................................................................
    if (T != null) {
      T.eq(lex(new_lexer('[m'), "[32] what?"), "m:L'['|m:G'3'|m:G'2'|m:R']'|p:P' what?'");
    }
    if (T != null) {
      T.eq(lex(new_lexer('[m]'), "[32] what?"), "m:L'['|p:P'32] what?'");
    }
    if (T != null) {
      T.eq(lex(new_lexer(null), "[32] what?"), "p:L'['|p:P'32] what?'");
    }
    if (T != null) {
      T.eq(lex(new_lexer(function() {
        return '[m';
      }), "[32] what?"), "m:L'['|m:G'3'|m:G'2'|m:R']'|p:P' what?'");
    }
    if (T != null) {
      T.eq(lex(new_lexer(function() {
        return '[m]';
      }), "[32] what?"), "m:L'['|p:P'32] what?'");
    }
    if (T != null) {
      T.eq(lex(new_lexer(function() {
        return null;
      }), "[32] what?"), "p:L'['|p:P'32] what?'");
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.jump_property_value = function(T, done) {
    var Interlex, lex, new_lexer;
    ({Interlex} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(enter_marks) {
      var lexer;
      lexer = new Interlex({
        dotall: false
      });
      (() => {
        var mode;
        mode = 'p';
        lexer.add_lexeme({
          mode,
          lxid: 'L',
          jump: enter_marks,
          pattern: /\[/u
        });
        return lexer.add_lexeme({
          mode,
          lxid: 'P',
          jump: null,
          pattern: /[^\[\\]+/u
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'm';
        lexer.add_lexeme({
          mode,
          lxid: 'R',
          jump: '.]',
          pattern: /\]/u,
          reserved: ']'
        });
        lexer.add_lexeme({
          mode,
          lxid: 'G',
          jump: null,
          pattern: /[U01234]/u
        });
        return lexer.add_reserved_lexeme({
          mode,
          lxid: 'forbidden',
          concat: true
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    lex = function(lexer, probe) {
      var R, jump, ref, token;
      R = [];
      ref = lexer.walk(probe);
      for (token of ref) {
        jump = token.jump != null ? rpr(token.jump) : '-';
        R.push(`${token.$key}${jump}`);
      }
      return R.join('|');
    };
    //.........................................................................................................
    help('Ω___1', rpr(lex(new_lexer('[m'), "[32] what?")));
    help('Ω___2', rpr(lex(new_lexer('[m]'), "[32] what?")));
    help('Ω___3', rpr(lex(new_lexer(null), "[32] what?")));
    help('Ω___4', rpr(lex(new_lexer(function() {
      return '[m';
    }), "[32] what?")));
    help('Ω___5', rpr(lex(new_lexer(function() {
      return '[m]';
    }), "[32] what?")));
    help('Ω___6', rpr(lex(new_lexer(function() {
      return null;
    }), "[32] what?")));
    //.........................................................................................................
    if (T != null) {
      T.eq(lex(new_lexer('[m'), "[32] what?"), "m:L'm'|m:G-|m:G-|m:R'p'|p:P-");
    }
    if (T != null) {
      T.eq(lex(new_lexer('[m]'), "[32] what?"), "m:L'p'|p:P-");
    }
    if (T != null) {
      T.eq(lex(new_lexer(null), "[32] what?"), "p:L-|p:P-");
    }
    if (T != null) {
      T.eq(lex(new_lexer(function() {
        return '[m';
      }), "[32] what?"), "m:L'm'|m:G-|m:G-|m:R'p'|p:P-");
    }
    if (T != null) {
      T.eq(lex(new_lexer(function() {
        return '[m]';
      }), "[32] what?"), "m:L'p'|p:P-");
    }
    if (T != null) {
      T.eq(lex(new_lexer(function() {
        return null;
      }), "[32] what?"), "p:L-|p:P-");
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
      // @jump_function_return_values()
      // test @jump_function_return_values
      this.jump_property_value();
      return test(this.jump_property_value);
    })();
  }

  // test @markup_with_variable_length
// test @auto_inserted_border_posts_exclusive
// @singular_jumps()
// test @singular_jumps
// test @new_syntax_for_in_and_exclusive_jumps_1
// @new_syntax_for_in_and_exclusive_jumps_2()
// test @new_syntax_for_in_and_exclusive_jumps_2

}).call(this);

//# sourceMappingURL=test-modes.js.map