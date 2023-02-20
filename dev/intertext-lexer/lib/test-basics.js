(function() {
  'use strict';
  var DATOM, GUY, H, H2, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/BASICS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  H2 = require('./helpers');

  after = (dts, f) => {
    return new Promise(function(resolve) {
      return setTimeout((function() {
        return resolve(f());
      }), dts * 1000);
    });
  };

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this.simple = async function(T, done) {
    var Interlex, error, i, len, lexer, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    if (T != null) {
      T.eq(lexer._metachr, '𝔛');
    }
    //.........................................................................................................
    probes_and_matchers = [[['xxx', /123/], /123/], [['xxx', /123/ug], /123/ug], [['xxx', /123/guy], /123/guy], [['xxx', /(?<a>x.)/gu], /(?<xxx𝔛a>x.)/gu], [['escchr', /\\(?<chr>.)/u], /\\(?<escchr𝔛chr>.)/u]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          //.....................................................................................................
          return resolve(lexer._rename_groups(...probe), matcher);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_strings_for_patterns = async function(T, done) {
    var Interlex, error, i, len, lexer, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    lexer.add_lexeme({
      mode: 'sql',
      tid: 'select',
      pattern: 'select'
    });
    lexer.add_lexeme({
      mode: 'sql',
      tid: 'from',
      pattern: 'from'
    });
    lexer.add_lexeme({
      mode: 'sql',
      tid: 'star',
      pattern: '*'
    });
    lexer.add_lexeme({
      mode: 'sql',
      tid: 'ws',
      pattern: /\s+/u
    });
    lexer.add_lexeme({
      mode: 'sql',
      tid: 'other',
      pattern: /\S+/u
    });
    //.........................................................................................................
    probes_and_matchers = [['select * from t;', "select:'select'|ws:' '|star:'*'|ws:' '|from:'from'|ws:' '|other:'t;'", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // do =>
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, result_rpr, t;
          //.....................................................................................................
          result = lexer.run(probe);
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              results.push(`${t.tid}:${rpr(t.value)}`);
            }
            return results;
          })()).join('|');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, result);
          return resolve(result_rpr);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_lexer_without_lexemes = async function(T, done) {
    var Interlex, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    probes_and_matchers = [['', "$eof:''", null], ['select * from t;', "$error:''", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // do =>
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, result, result_rpr, t;
          lexer = new Interlex({
            end_token: true
          });
          result = lexer.run(probe);
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              results.push(`${t.tid}:${rpr(t.value)}`);
            }
            return results;
          })()).join('|');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, result);
          return resolve(result_rpr);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cannot_return_from_initial_mode = async function(T, done) {
    var Interlex, error, get_lexer, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    get_lexer = function() {
      var lexer;
      lexer = new Interlex({
        end_token: true
      });
      lexer.add_lexeme({
        mode: 'base',
        tid: 'a',
        pattern: 'a'
      });
      lexer.add_lexeme({
        mode: 'base',
        tid: 'b',
        jump: 'up',
        pattern: 'b'
      });
      lexer.add_lexeme({
        mode: 'up',
        tid: 'c',
        pattern: 'c'
      });
      lexer.add_lexeme({
        mode: 'up',
        tid: 'd',
        jump: '^',
        pattern: 'd'
      });
      lexer.add_lexeme({
        mode: 'base',
        tid: 'e',
        jump: '^',
        pattern: 'e'
      });
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [['abc', "base:a:'a'|base:b:'b'|up:c:'c'|up:$eof:''", null], ['abcde', null, "unable to jump back from initial state"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // do =>
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, result, result_rpr, t;
          //.....................................................................................................
          lexer = get_lexer();
          result = lexer.run(probe);
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              results.push(`${t.mk}:${rpr(t.value)}`);
            }
            return results;
          })()).join('|');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, result);
          return resolve(result_rpr);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.lex_tags = async function(T, done) {
    var Interlex, c, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        end_token: true
      });
      (() => {
        /* NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens */
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'text',
          pattern: c.suffix('+', c.charSet.complement(/[<`\\?]/u))
        });
        lexer.add_lexeme({
          mode,
          tid: 'tag',
          jump: 'tag',
          pattern: /<(?<lslash>\/?)/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'E_backticks',
          pattern: /`+/
        });
      })();
      (() => {        // lexer.add_lexeme mode, 'other',        /./u
        //.........................................................................................................
        var mode;
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'end',
          jump: '^',
          pattern: />/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'text',
          pattern: c.suffix('+', c.charSet.complement(/[>\\]/u))
        });
        return lexer.add_lexeme({
          mode,
          tid: 'other',
          pattern: /./u
        });
      })();
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'helo <bold>`world`</bold>',
        [
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'helo ',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 5,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 5,
            lnr2: 0,
            x2: 6,
            x: {
              lslash: null
            },
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            lnr1: 0,
            x1: 6,
            lnr2: 0,
            x2: 10,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 10,
            lnr2: 0,
            x2: 11,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            lnr1: 0,
            x1: 11,
            lnr2: 0,
            x2: 12,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'world',
            lnr1: 0,
            x1: 12,
            lnr2: 0,
            x2: 17,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            lnr1: 0,
            x1: 17,
            lnr2: 0,
            x2: 18,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            lnr1: 0,
            x1: 18,
            lnr2: 0,
            x2: 20,
            x: {
              lslash: '/'
            },
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            lnr1: 0,
            x1: 20,
            lnr2: 0,
            x2: 24,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 24,
            lnr2: 0,
            x2: 25,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 25,
            lnr2: 0,
            x2: 25,
            x: null,
            source: 'helo <bold>`world`</bold>',
            '$key': '^plain'
          }
        ],
        null
      ],
      [
        '<x v=\\> z=42>',
        [
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 1,
            x: {
              lslash: null
            },
            source: '<x v=\\> z=42>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'x v=',
            lnr1: 0,
            x1: 1,
            lnr2: 0,
            x2: 5,
            x: null,
            source: '<x v=\\> z=42>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'escchr',
            mk: 'tag:escchr',
            jump: null,
            value: '\\>',
            lnr1: 0,
            x1: 5,
            lnr2: 0,
            x2: 7,
            x: {
              chr: '>'
            },
            source: '<x v=\\> z=42>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: ' z=42',
            lnr1: 0,
            x1: 7,
            lnr2: 0,
            x2: 12,
            x: null,
            source: '<x v=\\> z=42>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 12,
            lnr2: 0,
            x2: 13,
            x: null,
            source: '<x v=\\> z=42>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 13,
            lnr2: 0,
            x2: 13,
            x: null,
            source: '<x v=\\> z=42>',
            '$key': '^plain'
          }
        ],
        null
      ],
      [
        '<x v=\\> z=42\\>',
        [
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 1,
            x: {
              lslash: null
            },
            source: '<x v=\\> z=42\\>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'x v=',
            lnr1: 0,
            x1: 1,
            lnr2: 0,
            x2: 5,
            x: null,
            source: '<x v=\\> z=42\\>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'escchr',
            mk: 'tag:escchr',
            jump: null,
            value: '\\>',
            lnr1: 0,
            x1: 5,
            lnr2: 0,
            x2: 7,
            x: {
              chr: '>'
            },
            source: '<x v=\\> z=42\\>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: ' z=42',
            lnr1: 0,
            x1: 7,
            lnr2: 0,
            x2: 12,
            x: null,
            source: '<x v=\\> z=42\\>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'escchr',
            mk: 'tag:escchr',
            jump: null,
            value: '\\>',
            lnr1: 0,
            x1: 12,
            lnr2: 0,
            x2: 14,
            x: {
              chr: '>'
            },
            source: '<x v=\\> z=42\\>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 14,
            lnr2: 0,
            x2: 14,
            x: null,
            source: '<x v=\\> z=42\\>',
            '$key': '^tag'
          }
        ],
        null
      ],
      [
        'a <b',
        [
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'a ',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 2,
            x: null,
            source: 'a <b',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 2,
            lnr2: 0,
            x2: 3,
            x: {
              lslash: null
            },
            source: 'a <b',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            lnr1: 0,
            x1: 3,
            lnr2: 0,
            x2: 4,
            x: null,
            source: 'a <b',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 4,
            lnr2: 0,
            x2: 4,
            x: null,
            source: 'a <b',
            '$key': '^tag'
          }
        ],
        null
      ],
      [
        'what? error?',
        [
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'what',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 4,
            x: null,
            source: 'what? error?',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: '$error',
            mk: 'plain:$error',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 4,
            lnr2: 0,
            x2: 4,
            x: {
              code: 'nomatch'
            },
            source: 'what? error?',
            '$key': '^plain'
          }
        ],
        null
      ],
      [
        'd <',
        [
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'd ',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 2,
            x: null,
            source: 'd <',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 2,
            lnr2: 0,
            x2: 3,
            x: {
              lslash: null
            },
            source: 'd <',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 3,
            lnr2: 0,
            x2: 3,
            x: null,
            source: 'd <',
            '$key': '^tag'
          }
        ],
        null
      ],
      [
        '<c',
        [
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 1,
            x: {
              lslash: null
            },
            source: '<c',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'c',
            lnr1: 0,
            x1: 1,
            lnr2: 0,
            x2: 2,
            x: null,
            source: '<c',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 2,
            lnr2: 0,
            x2: 2,
            x: null,
            source: '<c',
            '$key': '^tag'
          }
        ],
        null
      ],
      [
        '<',
        [
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 1,
            x: {
              lslash: null
            },
            source: '<',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 1,
            lnr2: 0,
            x2: 1,
            x: null,
            source: '<',
            '$key': '^tag'
          }
        ],
        null
      ],
      [
        '',
        [
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ],
        null
      ],
      [
        'helo \\<bold>`world`</bold>',
        [
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'helo ',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 5,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'escchr',
            mk: 'plain:escchr',
            jump: null,
            value: '\\<',
            lnr1: 0,
            x1: 5,
            lnr2: 0,
            x2: 7,
            x: {
              chr: '<'
            },
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'bold>',
            lnr1: 0,
            x1: 7,
            lnr2: 0,
            x2: 12,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            lnr1: 0,
            x1: 12,
            lnr2: 0,
            x2: 13,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'world',
            lnr1: 0,
            x1: 13,
            lnr2: 0,
            x2: 18,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            lnr1: 0,
            x1: 18,
            lnr2: 0,
            x2: 19,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            lnr1: 0,
            x1: 19,
            lnr2: 0,
            x2: 21,
            x: {
              lslash: '/'
            },
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            lnr1: 0,
            x1: 21,
            lnr2: 0,
            x2: 25,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 25,
            lnr2: 0,
            x2: 26,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 26,
            lnr2: 0,
            x2: 26,
            x: null,
            source: 'helo \\<bold>`world`</bold>',
            '$key': '^plain'
          }
        ],
        null
      ],
      [
        '<b>helo \\<bold>`world`</bold></b>',
        [
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 1,
            x: {
              lslash: null
            },
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            lnr1: 0,
            x1: 1,
            lnr2: 0,
            x2: 2,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 2,
            lnr2: 0,
            x2: 3,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'helo ',
            lnr1: 0,
            x1: 3,
            lnr2: 0,
            x2: 8,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'escchr',
            mk: 'plain:escchr',
            jump: null,
            value: '\\<',
            lnr1: 0,
            x1: 8,
            lnr2: 0,
            x2: 10,
            x: {
              chr: '<'
            },
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'bold>',
            lnr1: 0,
            x1: 10,
            lnr2: 0,
            x2: 15,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            lnr1: 0,
            x1: 15,
            lnr2: 0,
            x2: 16,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'world',
            lnr1: 0,
            x1: 16,
            lnr2: 0,
            x2: 21,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            lnr1: 0,
            x1: 21,
            lnr2: 0,
            x2: 22,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            lnr1: 0,
            x1: 22,
            lnr2: 0,
            x2: 24,
            x: {
              lslash: '/'
            },
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            lnr1: 0,
            x1: 24,
            lnr2: 0,
            x2: 28,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 28,
            lnr2: 0,
            x2: 29,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            lnr1: 0,
            x1: 29,
            lnr2: 0,
            x2: 31,
            x: {
              lslash: '/'
            },
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            lnr1: 0,
            x1: 31,
            lnr2: 0,
            x2: 32,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 32,
            lnr2: 0,
            x2: 33,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 33,
            lnr2: 0,
            x2: 33,
            x: null,
            source: '<b>helo \\<bold>`world`</bold></b>',
            '$key': '^plain'
          }
        ],
        null
      ],
      [
        '<i><b></b></i>',
        [
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 0,
            lnr2: 0,
            x2: 1,
            x: {
              lslash: null
            },
            source: '<i><b></b></i>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'i',
            lnr1: 0,
            x1: 1,
            lnr2: 0,
            x2: 2,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 2,
            lnr2: 0,
            x2: 3,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            lnr1: 0,
            x1: 3,
            lnr2: 0,
            x2: 4,
            x: {
              lslash: null
            },
            source: '<i><b></b></i>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            lnr1: 0,
            x1: 4,
            lnr2: 0,
            x2: 5,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 5,
            lnr2: 0,
            x2: 6,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            lnr1: 0,
            x1: 6,
            lnr2: 0,
            x2: 8,
            x: {
              lslash: '/'
            },
            source: '<i><b></b></i>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            lnr1: 0,
            x1: 8,
            lnr2: 0,
            x2: 9,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 9,
            lnr2: 0,
            x2: 10,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            lnr1: 0,
            x1: 10,
            lnr2: 0,
            x2: 12,
            x: {
              lslash: '/'
            },
            source: '<i><b></b></i>',
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'i',
            lnr1: 0,
            x1: 12,
            lnr2: 0,
            x2: 13,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            lnr1: 0,
            x1: 13,
            lnr2: 0,
            x2: 14,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            lnr1: 0,
            x1: 14,
            lnr2: 0,
            x2: 14,
            x: null,
            source: '<i><b></b></i>',
            '$key': '^plain'
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
          var j, len1, lexer, result, token;
          lexer = new_lexer();
          result = lexer.run(probe);
          for (j = 0, len1 = result.length; j < len1; j++) {
            token = result[j];
            if (T != null) {
              T.eq(probe.slice(token.x1, token.x2), token.value);
            }
          }
          H.tabulate(rpr(probe), result);
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
  this.lex_tags_with_rpr = async function(T, done) {
    var Interlex, c, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        end_token: true
      });
      (() => {        //.........................................................................................................
        /* NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens */
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'text',
          pattern: c.suffix('+', c.charSet.complement(/[<`\\?]/u))
        });
        lexer.add_lexeme({
          mode,
          tid: 'tag',
          jump: 'tag',
          pattern: /<(?<lslash>\/?)/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'E_backticks',
          pattern: /`+/
        });
      })();
      (() => {        // lexer.add_lexeme mode, 'other',        /./u
        //.........................................................................................................
        var mode;
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'end',
          jump: '^',
          pattern: />/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'text',
          pattern: c.suffix('+', c.charSet.complement(/[>\\]/u))
        });
        return lexer.add_lexeme({
          mode,
          tid: 'other',
          pattern: /./u
        });
      })();
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [['helo <bold>`world`</bold>', "[plain:text,(0:0)(0:5),='helo '][plain:tag>tag,(0:5)(0:6),='<',lslash:null][tag:text,(0:6)(0:10),='bold'][tag:end>plain,(0:10)(0:11),='>'][plain:E_backticks,(0:11)(0:12),='`'][plain:text,(0:12)(0:17),='world'][plain:E_backticks,(0:17)(0:18),='`'][plain:tag>tag,(0:18)(0:20),='</',lslash:'/'][tag:text,(0:20)(0:24),='bold'][tag:end>plain,(0:24)(0:25),='>'][plain:$eof,(0:25)(0:25),='']", null], ['<x v=\\> z=42>', "[plain:tag>tag,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:5),='x v='][tag:escchr,(0:5)(0:7),='\\\\>',chr:'>'][tag:text,(0:7)(0:12),=' z=42'][tag:end>plain,(0:12)(0:13),='>'][plain:$eof,(0:13)(0:13),='']", null], ['<x v=\\> z=42\\>', "[plain:tag>tag,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:5),='x v='][tag:escchr,(0:5)(0:7),='\\\\>',chr:'>'][tag:text,(0:7)(0:12),=' z=42'][tag:escchr,(0:12)(0:14),='\\\\>',chr:'>'][tag:$eof,(0:14)(0:14),='']", null], ['a <b', "[plain:text,(0:0)(0:2),='a '][plain:tag>tag,(0:2)(0:3),='<',lslash:null][tag:text,(0:3)(0:4),='b'][tag:$eof,(0:4)(0:4),='']", null], ['what? error?', "[plain:text,(0:0)(0:4),='what'][plain:$error,(0:4)(0:4),='',code:'nomatch']", null], ['d <', "[plain:text,(0:0)(0:2),='d '][plain:tag>tag,(0:2)(0:3),='<',lslash:null][tag:$eof,(0:3)(0:3),='']", null], ['<c', "[plain:tag>tag,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:2),='c'][tag:$eof,(0:2)(0:2),='']", null], ['<', "[plain:tag>tag,(0:0)(0:1),='<',lslash:null][tag:$eof,(0:1)(0:1),='']", null], ['', "[plain:$eof,(0:0)(0:0),='']", null], ['helo \\<bold>`world`</bold>', "[plain:text,(0:0)(0:5),='helo '][plain:escchr,(0:5)(0:7),='\\\\<',chr:'<'][plain:text,(0:7)(0:12),='bold>'][plain:E_backticks,(0:12)(0:13),='`'][plain:text,(0:13)(0:18),='world'][plain:E_backticks,(0:18)(0:19),='`'][plain:tag>tag,(0:19)(0:21),='</',lslash:'/'][tag:text,(0:21)(0:25),='bold'][tag:end>plain,(0:25)(0:26),='>'][plain:$eof,(0:26)(0:26),='']", null], ['<b>helo \\<bold>`world`</bold></b>', "[plain:tag>tag,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:2),='b'][tag:end>plain,(0:2)(0:3),='>'][plain:text,(0:3)(0:8),='helo '][plain:escchr,(0:8)(0:10),='\\\\<',chr:'<'][plain:text,(0:10)(0:15),='bold>'][plain:E_backticks,(0:15)(0:16),='`'][plain:text,(0:16)(0:21),='world'][plain:E_backticks,(0:21)(0:22),='`'][plain:tag>tag,(0:22)(0:24),='</',lslash:'/'][tag:text,(0:24)(0:28),='bold'][tag:end>plain,(0:28)(0:29),='>'][plain:tag>tag,(0:29)(0:31),='</',lslash:'/'][tag:text,(0:31)(0:32),='b'][tag:end>plain,(0:32)(0:33),='>'][plain:$eof,(0:33)(0:33),='']", null], ['<i><b></b></i>', "[plain:tag>tag,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:2),='i'][tag:end>plain,(0:2)(0:3),='>'][plain:tag>tag,(0:3)(0:4),='<',lslash:null][tag:text,(0:4)(0:5),='b'][tag:end>plain,(0:5)(0:6),='>'][plain:tag>tag,(0:6)(0:8),='</',lslash:'/'][tag:text,(0:8)(0:9),='b'][tag:end>plain,(0:9)(0:10),='>'][plain:tag>tag,(0:10)(0:12),='</',lslash:'/'][tag:text,(0:12)(0:13),='i'][tag:end>plain,(0:13)(0:14),='>'][plain:$eof,(0:14)(0:14),='']", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, ref, result, token;
          lexer = new_lexer();
          result = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            result.push(token);
          }
          // H.tabulate ( rpr probe ), result
          return resolve(((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              token = result[j];
              results.push(lexer.rpr_token(token));
            }
            return results;
          })()).join(''));
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_md_stars_markup = async function(T, done) {
    var $, Interlex, Pipeline, compose, error, first, i, last, len, matcher, md_lexer, new_toy_md_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var lexer;
      lexer = new Interlex({
        dotall: false
      });
      //.........................................................................................................
      lexer.add_lexeme({
        mode,
        tid: 'escchr',
        pattern: /\\(?<chr>.)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'star1',
        pattern: /(?<!\*)\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'star2',
        pattern: /(?<!\*)\*\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'star3',
        pattern: /(?<!\*)\*\*\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'other',
        pattern: /[^*]+/u
      });
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ["**def**", "<b>def</b>"], ["***def***", "<b><i>def</i></b>"], ["**x*def*x**", "<b>x<i>def</i>x</b>"], ["*x**def**x*", "<i>x<b>def</b>x</i>"], ["***abc*def**", "<b><i>abc</i>def</b>"], ["***abc**def*", "<b><i>abc</i></b><i>def</i>"], ["*x***def**", "<i>x</i><b>def</b>"], ["**x***def*", "<b>x</b><i>def</i>"], ["*", "<i>"], ["**", "<b>"], ["***", "<b><i>"]];
    //.........................................................................................................
    md_lexer = new_toy_md_lexer('md');
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, j, len1, p, result, result_rpr;
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
          p.push(H2.$parse_md_stars());
          //.....................................................................................................
          p.send(H2.new_token('^æ19^', {
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
          for (j = 0, len1 = result.length; j < len1; j++) {
            d = result[j];
            urge('^08-1^', (Object.keys(d)).sort());
          }
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

  //-----------------------------------------------------------------------------------------------------------
  this.parse_string_literals = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        linewise: true
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: 'dq1',
          pattern: /(?<!")"(?!")/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'other',
          jump: null,
          pattern: /[^"]+/u
        });
      })();
      (() => {        //.........................................................................................................
        var mode;
        mode = 'dq1';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'text',
          jump: null,
          pattern: /[^"]+/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'dq1',
          jump: '^',
          pattern: /"/u
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
            mk: 'plain:other',
            value: 'helo'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'helo "world"',
        [
          {
            mk: 'plain:other',
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
            value: ''
          }
        ],
        null
      ],
      [
        'helo "everyone\nout there"!',
        [
          {
            mk: 'plain:other',
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
            value: ''
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
            mk: 'plain:other',
            value: '!'
          },
          {
            mk: 'plain:nl',
            value: ''
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
          var d, lexer, ref, result, result_rpr, token;
          lexer = new_lexer();
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
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)}`, result); // unless result_rpr is matcher
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
  this.parse_line_by_line = function(T, done) {
    var $, Interlex, Pipeline, compose, d, first, last, line, md_lexer, new_toy_md_lexer, new_toy_parser, parser, probe, ref, ref1, result, result_rpr, token, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    probe = `*the
first*
paragraph

the
**second** paragraph`;
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var lexer;
      lexer = new Interlex({
        dotall: false,
        end_token: false
      });
      //.........................................................................................................
      lexer.add_lexeme({
        mode,
        tid: 'escchr',
        pattern: /\\(?<chr>.)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'star1',
        pattern: /(?<!\*)\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'star2',
        pattern: /(?<!\*)\*\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'star3',
        pattern: /(?<!\*)\*\*\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'other',
        pattern: /[^*]+/u
      });
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    new_toy_parser = function(lexer) {
      var p;
      p = new Pipeline();
      p.push(function(d) {
        return urge('^79-1^', rpr(d));
      });
      p.push(function(d, send) {
        var e, ref, results;
        if (!isa.text(d)) {
          return send(d);
        }
        ref = lexer.walk(d);
        results = [];
        for (e of ref) {
          // send H2.new_token = ref: 'x1', token, mode, tid, name, value, x1, x2
          // send new_datom { }
          results.push(send(e));
        }
        return results;
      });
      p.push(H2.$parse_md_stars());
      return p;
    };
    //.........................................................................................................
    md_lexer = new_toy_md_lexer('md');
    parser = new_toy_parser(md_lexer);
    //.........................................................................................................
    result = [];
    ref = GUY.str.walk_lines(probe);
    for (line of ref) {
      parser.send(line);
      ref1 = parser.walk();
      for (d of ref1) {
        result.push(d);
        info('^79-10^', rpr(d));
      }
    }
    //.........................................................................................................
    H.tabulate("parse line by line", result);
    // debug '^79-11^', result_rpr = ( md_lexer.rpr_token token for token in result ).join ''
    result_rpr = ((function() {
      var i, len, ref2, results;
      results = [];
      for (i = 0, len = result.length; i < len; i++) {
        token = result[i];
        if ((ref2 = !token.$stamped) != null ? ref2 : false) {
          results.push(token.value);
        }
      }
      return results;
    })()).join('');
    debug('^79-11^', '\n' + result_rpr);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_nested_codespan = async function(T, done) {
    var $, $parse_md_codespan, Interlex, Pipeline, compose, error, first, i, last, len, matcher, md_lexer, new_toy_md_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var lexer;
      lexer = new Interlex({
        dotall: false
      });
      //.........................................................................................................
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
        jump: 'literal',
        pattern: /(?<!`)`(?!`)/u
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
        jump: '^',
        pattern: /(?<!`)`(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        tid: 'text',
        jump: null,
        pattern: /(?:\\`|[^`])+/u
      });
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* \\`*bar*\\` baz', '<i>foo</i> \\`<i>bar</i>\\` baz', null]];
    //.........................................................................................................
    $parse_md_codespan = function() {
      return function(d, send) {
        if (d.mk === 'plain:codespan') {
          send(stamp(d));
          return send(H2.new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
        }
        if (d.mk === 'literal:codespan') {
          send(stamp(d));
          return send(H2.new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
        }
        send(d);
        return null;
      };
    };
    //.........................................................................................................
    md_lexer = new_toy_md_lexer('md');
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_rpr;
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
          p.push(H2.$parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(H2.new_token('^æ19^', {
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

  //-----------------------------------------------------------------------------------------------------------
  this.markup_with_variable_length = async function(T, done) {
    var $, $parse_md_codespan, Interlex, Pipeline, compose, error, first, i, last, len, matcher, new_toy_md_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var backtick_count, jlcs, jpcs, lexer;
      lexer = new Interlex({
        dotall: false
      });
      backtick_count = null;
      //.......................................................................................................
      jpcs = function({token, match, lexer}) {
        // debug '^35-1^', match
        backtick_count = token.value.length;
        return 'literal';
      };
      //.......................................................................................................
      jlcs = function({token, match, lexer}) {
        // debug '^35-3^', match
        if (token.value.length === backtick_count) {
          backtick_count = null;
          return '^';
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
        jump: jpcs,
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
        jump: jlcs,
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
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null], ['*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null]];
    //.........................................................................................................
    $parse_md_codespan = function() {
      return function(d, send) {
        switch (d.mk) {
          case 'plain:codespan':
            send(stamp(d));
            send(H2.new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
            break;
          case 'literal:codespan':
            send(stamp(d));
            send(H2.new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
            break;
          default:
            send(d);
        }
        return null;
      };
    };
//.........................................................................................................
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
          p.push(H2.$parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(H2.new_token('^æ19^', {
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

  //-----------------------------------------------------------------------------------------------------------
  this.match_with_lookbehind = async function(T, done) {
    var Interlex, c, error, i, len, lexer, matcher, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    lexer = new Interlex({
      dotall: true
    });
    (() => {      //.........................................................................................................
      var mode;
      mode = 'plain';
      lexer.add_lexeme({
        mode,
        tid: 'b_after_a',
        pattern: /(?<=a)b/u
      });
      // lexer.add_lexeme { mode, tid: 'other_a',          pattern: ( /a/u                             ), }
      // lexer.add_lexeme { mode, tid: 'other_b',          pattern: ( /b/u                             ), }
      return lexer.add_lexeme({
        mode,
        tid: 'other',
        pattern: /((?<!a)b|[^b])+/u
      });
    })();
    //.........................................................................................................
    probes_and_matchers = [['foobar abracadabra', "[plain:other,(0:0)(0:8),='foobar a'][plain:b_after_a,(0:8)(0:9),='b'][plain:other,(0:9)(0:15),='racada'][plain:b_after_a,(0:15)(0:16),='b'][plain:other,(0:16)(0:18),='ra']", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, result_rpr, token;
          result = lexer.run(probe);
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              token = result[j];
              results.push(lexer.rpr_token(token));
            }
            return results;
          })()).join('');
          H.tabulate(`${probe} -> ${result_rpr} (${matcher})`, result);
          return resolve(result_rpr);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.match_start_of_line = async function(T, done) {
    var Interlex, c, error, i, len, lexer, matcher, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    lexer = new Interlex({
      dotall: true,
      end_token: true
    });
    (() => {      //.........................................................................................................
      var mode;
      mode = 'plain';
      lexer.add_lexeme({
        mode,
        tid: 'b_after_nl',
        pattern: /(?<=\n)b/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'b_first',
        pattern: /^b/u
      });
      return lexer.add_lexeme({
        mode,
        tid: 'other',
        pattern: /((?<!\n)b|[^b])+/u
      });
    })();
    //.........................................................................................................
    probes_and_matchers = [['foobar \nbracad\nbra', "[plain:other,(0:0)(0:8),='foobar \\n'][plain:b_after_nl,(0:8)(0:9),='b'][plain:other,(0:9)(0:15),='racad\\n'][plain:b_after_nl,(0:15)(0:16),='b'][plain:other,(0:16)(0:18),='ra'][plain:$eof,(0:18)(0:18),='']", null], ['b', "[plain:b_first,(0:0)(0:1),='b'][plain:$eof,(0:1)(0:1),='']", null], ['\nb', "[plain:other,(0:0)(0:1),='\\n'][plain:b_after_nl,(0:1)(0:2),='b'][plain:$eof,(0:2)(0:2),='']", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, result_rpr, token;
          result = lexer.run(probe);
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              token = result[j];
              results.push(lexer.rpr_token(token));
            }
            return results;
          })()).join('');
          // H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result
          return resolve(result_rpr);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.match_end_of_line = function(T, done) {
    var Interlex, c, lexer, line, matcher, probe, ref, ref1, result, result_rpr, token;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    (() => {      //.........................................................................................................
      var mode;
      mode = 'plain';
      lexer.add_lexeme({
        mode,
        tid: 'eol',
        pattern: /$/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'ws',
        pattern: /\s+/u
      });
      return lexer.add_lexeme({
        mode,
        tid: 'word',
        pattern: /\S+/u
      });
    })();
    //.........................................................................................................
    probe = `A line by line
lexing
probe\x20\x20\x20`;
    matcher = ["[plain:word,(0:0)(0:1),='A']", "[plain:ws,(0:1)(0:2),=' ']", "[plain:word,(0:2)(0:6),='line']", "[plain:ws,(0:6)(0:7),=' ']", "[plain:word,(0:7)(0:9),='by']", "[plain:ws,(0:9)(0:10),=' ']", "[plain:word,(0:10)(0:14),='line']", "[plain:eol,(0:14)(0:14),='']", "[plain:word,(0:0)(0:6),='lexing']", "[plain:eol,(0:6)(0:6),='']", "[plain:word,(0:0)(0:5),='probe']", "[plain:eol,(0:5)(0:5),='']"];
    //.........................................................................................................
    result = [];
    result_rpr = [];
    ref = GUY.str.walk_lines(probe);
    for (line of ref) {
      ref1 = lexer.walk(line);
      for (token of ref1) {
        result.push(token);
        result_rpr.push(lexer.rpr_token(token));
      }
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result_rpr, matcher);
    }
    H.tabulate(rpr(probe), result);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cannot_redeclare_lexeme = function(T, done) {
    var Interlex, c, lexer;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    lexer = new Interlex();
    if (T != null) {
      T.throws(/lexeme plain:eol already exists/, () => {
        var mode;
        // do =>
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'eol',
          pattern: /$/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'eol',
          pattern: /$/u
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.allow_value_and_empty_value = async function(T, done) {
    var Interlex, c, error, i, len, matcher, mode, new_lexer, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    mode = 'plain';
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          {
            mode,
            tid: 'eol',
            empty_value: '\n',
            pattern: /$/u
          },
          ''
        ],
        [
          {
            mk: 'plain:eol',
            value: '\n'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'eol',
            pattern: /$/u
          },
          ''
        ],
        [
          {
            mk: 'plain:eol',
            value: ''
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'eol',
            value: '\n',
            pattern: /$/u
          },
          ''
        ],
        [
          {
            mk: 'plain:eol',
            value: '\n'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: 'u',
            pattern: 'x'
          },
          'x'
        ],
        [
          {
            mk: 'plain:x',
            value: 'u'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: 'u',
            pattern: /x/u
          },
          'x'
        ],
        [
          {
            mk: 'plain:x',
            value: 'u'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: 'u',
            empty_value: '!!!',
            pattern: /x|/u
          },
          ''
        ],
        [
          {
            mk: 'plain:x',
            value: '!!!'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: 'u',
            empty_value: '!!!',
            pattern: /x/u
          },
          'x'
        ],
        [
          {
            mk: 'plain:x',
            value: 'u'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: 'u',
            pattern: /x|/u
          },
          'x'
        ],
        [
          {
            mk: 'plain:x',
            value: 'u'
          },
          {
            mk: 'plain:x',
            value: 'u'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: 'u',
            empty_value: '!!!',
            pattern: /x|/u
          },
          'x'
        ],
        [
          {
            mk: 'plain:x',
            value: 'u'
          },
          {
            mk: 'plain:x',
            value: '!!!'
          }
        ],
        null
      ],
      [
        [
          {
            mode,
            tid: 'x',
            value: (function() {
              return 'u';
            }),
            empty_value: (function() {
              return '!!!';
            }),
            pattern: /x|/u
          },
          'x'
        ],
        [
          {
            mk: 'plain:x',
            value: 'u'
          },
          {
            mk: 'plain:x',
            value: '!!!'
          }
        ],
        null
      ]
    ];
    //.........................................................................................................
    new_lexer = function() {
      var lexer;
      lexer = new Interlex();
      mode = 'plain';
      return lexer;
    };
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexeme, lexer, result, source, token;
          [lexeme, source] = probe;
          lexer = new_lexer();
          lexer.add_lexeme(lexeme);
          result = lexer.run(source);
          // H.tabulate ( rpr probe ), result
          result = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              token = result[j];
              results.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value'));
            }
            return results;
          })();
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
  this.use_create_for_custom_behavior = async function(T, done) {
    var Interlex, create_call_count, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex} = require('../../../apps/intertext-lexer'));
    create_call_count = 0;
    //.........................................................................................................
    new_lexer = function() {
      var lexer, new_escchr_descriptor;
      lexer = new Interlex({
        linewise: true,
        catchall_concat: true,
        reserved_concat: true
      });
      //.......................................................................................................
      new_escchr_descriptor = function(mode) {
        var create;
        create = function(token) {
          var ref;
          create_call_count++;
          if (((ref = token.x) != null ? ref.chr : void 0) == null) {
            token.x = {
              chr: '\n'
            };
          }
          return token;
        };
        return {
          mode,
          tid: 'escchr',
          pattern: /\\(?<chr>.|$)/u,
          reserved: '\\',
          create
        };
      };
      (() => {        //.......................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme(new_escchr_descriptor(mode));
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'ws',
          jump: null,
          pattern: /\s+/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'word',
          jump: null,
          pattern: /\S+/u
        });
        lexer.add_catchall_lexeme({
          mode,
          tid: 'other'
        });
        return lexer.add_reserved_lexeme({
          mode,
          tid: 'forbidden'
        });
      })();
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'foo <!-- comment --> bar',
        [
          {
            mk: 'plain:word',
            value: 'foo'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: '<!--'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'comment'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'bar'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'foo <!-- \\comment \n --> bar',
        [
          {
            mk: 'plain:word',
            value: 'foo'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: '<!--'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:escchr',
            value: '\\c',
            x: {
              chr: 'c'
            }
          },
          {
            mk: 'plain:word',
            value: 'omment'
          },
          {
            mk: 'plain:nl',
            value: ''
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'bar'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'foo <!-- comment \\\n --> bar',
        [
          {
            mk: 'plain:word',
            value: 'foo'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: '<!--'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'comment'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:escchr',
            value: '\\',
            x: {
              chr: '\n'
            }
          },
          {
            mk: 'plain:nl',
            value: ''
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'bar'
          },
          {
            mk: 'plain:nl',
            value: ''
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
          var d, lexer, ref, result, token;
          lexer = new_lexer();
          if (T != null) {
            T.eq(type_of(lexer.registry.plain.lexemes.escchr.create), 'function');
          }
          result = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            d = GUY.props.omit_nullish(GUY.props.pick_with_fallback(token, null, 'mk', 'value', 'x'));
            // debug '^432^', d if d.mk.endsWith ':escchr'
            result.push(d);
          }
          // H.tabulate ( rpr probe ), result
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(create_call_count, 2);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @parse_string_literals
      // test @use_create_for_custom_behavior
      // test @cannot_redeclare_lexeme
      // test @allow_value_and_empty_value
      // @using_strings_for_patterns()
      // test @using_strings_for_patterns
      // @cannot_return_from_initial_mode()
      // test @cannot_return_from_initial_mode
      // test @using_lexer_without_lexemes
      // test @lex_tags
      // test @lex_tags_with_rpr
      // @parse_line_by_line()
      // test @parse_line_by_line
      // @match_end_of_line()
      // test @match_end_of_line
      // test @parse_line_by_line
      // @parse_md_stars_markup()
      // test @parse_md_stars_markup
      // test @parse_nested_codespan
      // @markup_with_variable_length()
      // test @markup_with_variable_length
      // @_demo_markup_with_variable_length()
      // test @match_start_of_line
      return test(this.match_with_lookbehind);
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map