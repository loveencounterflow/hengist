(function() {
  'use strict';
  var $parse_md_star, $parse_md_stars, DATOM, GUY, H, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, new_token, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  new_token = function(ref, token, mode, tid, name, value, start, stop, x = null, lexeme = null) {
    /* TAINT recreation of `Interlex::new_token()` */
    var jump, ref1;
    jump = (ref1 = lexeme != null ? lexeme.jump : void 0) != null ? ref1 : null;
    ({start, stop} = token);
    return new_datom(`^${mode}`, {
      mode,
      tid,
      mk: `${mode}:${tid}`,
      jump,
      name,
      value,
      start,
      stop,
      x,
      $: ref
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  $parse_md_star = function() {
    var enter, exit, start_of, within;
    //.........................................................................................................
    within = {
      one: false
    };
    start_of = {
      one: null
    };
    //.........................................................................................................
    enter = function(mode, start) {
      within[mode] = true;
      start_of[mode] = start;
      return null;
    };
    enter.one = function(start) {
      return enter('one', start);
    };
    //.........................................................................................................
    exit = function(mode) {
      within[mode] = false;
      start_of[mode] = null;
      return null;
    };
    exit.one = function() {
      return exit('one');
    };
    //.........................................................................................................
    return function(d, send) {
      switch (d.tid) {
        //.....................................................................................................
        case 'star1':
          send(stamp(d));
          if (within.one) {
            exit.one();
            send(new_token('^æ1^', d, 'html', 'tag', 'i', '</i>'));
          } else {
            enter.one(d.start);
            send(new_token('^æ2^', d, 'html', 'tag', 'i', '<i>'));
          }
          break;
        default:
          //.....................................................................................................
          send(d);
      }
      return null;
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  $parse_md_stars = function() {
    var enter, exit, parse_md_stars, start_of, within;
    within = {
      one: false,
      two: false
    };
    start_of = {
      one: null,
      two: null
    };
    //.........................................................................................................
    enter = function(mode, start) {
      within[mode] = true;
      start_of[mode] = start;
      return null;
    };
    enter.one = function(start) {
      return enter('one', start);
    };
    enter.two = function(start) {
      return enter('two', start);
    };
    //.........................................................................................................
    exit = function(mode) {
      within[mode] = false;
      start_of[mode] = null;
      return null;
    };
    exit.one = function() {
      return exit('one');
    };
    exit.two = function() {
      return exit('two');
    };
    //.........................................................................................................
    return parse_md_stars = function(d, send) {
      switch (d.tid) {
        //.....................................................................................................
        case 'star1':
          send(stamp(d));
          if (within.one) {
            exit.one();
            send(new_token('^æ1^', d, 'html', 'tag', 'i', '</i>'));
          } else {
            enter.one(d.start);
            send(new_token('^æ2^', d, 'html', 'tag', 'i', '<i>'));
          }
          break;
        //.....................................................................................................
        case 'star2':
          send(stamp(d));
          if (within.two) {
            if (within.one) {
              if (start_of.one > start_of.two) {
                exit.one();
                send(new_token('^æ3^', d, 'html', 'tag', 'i', '</i>'));
                exit.two();
                send(new_token('^æ4^', d, 'html', 'tag', 'b', '</b>'));
                enter.one(d.start);
                send(new_token('^æ5^', d, 'html', 'tag', 'i', '<i>'));
              } else {
                exit.two();
                send(new_token('^æ6^', d, 'html', 'tag', 'b', '</b>'));
              }
            } else {
              exit.two();
              send(new_token('^æ7^', d, 'html', 'tag', 'b', '</b>'));
            }
          } else {
            enter.two(d.start);
            send(new_token('^æ8^', d, 'html', 'tag', 'b', '<b>'));
          }
          break;
        //.....................................................................................................
        case 'star3':
          send(stamp(d));
          if (within.one) {
            if (within.two) {
              if (start_of.one > start_of.two) {
                exit.one();
                send(new_token('^æ9^', d, 'html', 'tag', 'i', '</i>'));
                exit.two();
                send(new_token('^æ10^', d, 'html', 'tag', 'b', '</b>'));
              } else {
                exit.two();
                send(new_token('^æ11^', d, 'html', 'tag', 'b', '</b>'));
                exit.one();
                send(new_token('^æ12^', d, 'html', 'tag', 'i', '</i>'));
              }
            } else {
              exit.one();
              send(new_token('^æ13^', d, 'html', 'tag', 'i', '</i>'));
              enter.two(d.start);
              send(new_token('^æ14^', d, 'html', 'tag', 'b', '<b>'));
            }
          } else {
            if (within.two) {
              exit.two();
              send(new_token('^æ15^', d, 'html', 'tag', 'b', '</b>'));
              enter.one(d.start);
              send(new_token('^æ16^', d, 'html', 'tag', 'i', '<i>'));
            } else {
              enter.two(d.start);
              send(new_token('^æ17^', d, 'html', 'tag', 'b', '<b>'));
              enter.one(d.start + 2);
              send(new_token('^æ18^', {
                start: d.start + 2,
                stop: d.stop
              }, 'html', 'tag', 'i', '<i>'));
            }
          }
          break;
        default:
          //.....................................................................................................
          send(d);
      }
      return null;
    };
  };

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
    probes_and_matchers = [['select * from t;', "select:'select'|ws:' '|star:'*'|ws:' '|from:'from'|ws:' '|other:'t;'|$eof:''", null]];
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
          lexer = new Interlex();
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
      lexer = new Interlex();
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
    var Interlex, c, error, i, len, lexer, matcher, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    (() => {      //.........................................................................................................
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
    (() => {      // lexer.add_lexeme mode, 'other',        /./u
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
            start: 0,
            stop: 5,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            start: 5,
            stop: 6,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            start: 6,
            stop: 10,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 10,
            stop: 11,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            start: 11,
            stop: 12,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'world',
            start: 12,
            stop: 17,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            start: 17,
            stop: 18,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            start: 18,
            stop: 20,
            x: {
              lslash: '/'
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            start: 20,
            stop: 24,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 24,
            stop: 25,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            start: 25,
            stop: 25,
            x: null,
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
            start: 0,
            stop: 1,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'x v=',
            start: 1,
            stop: 5,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'escchr',
            mk: 'tag:escchr',
            jump: null,
            value: '\\>',
            start: 5,
            stop: 7,
            x: {
              chr: '>'
            },
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: ' z=42',
            start: 7,
            stop: 12,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 12,
            stop: 13,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            start: 13,
            stop: 13,
            x: null,
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
            start: 0,
            stop: 1,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'x v=',
            start: 1,
            stop: 5,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'escchr',
            mk: 'tag:escchr',
            jump: null,
            value: '\\>',
            start: 5,
            stop: 7,
            x: {
              chr: '>'
            },
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: ' z=42',
            start: 7,
            stop: 12,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'escchr',
            mk: 'tag:escchr',
            jump: null,
            value: '\\>',
            start: 12,
            stop: 14,
            x: {
              chr: '>'
            },
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            start: 14,
            stop: 14,
            x: null,
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
            start: 0,
            stop: 2,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            start: 2,
            stop: 3,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            start: 3,
            stop: 4,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            start: 4,
            stop: 4,
            x: null,
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
            start: 0,
            stop: 4,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: '$error',
            mk: 'plain:$error',
            jump: null,
            value: '',
            start: 4,
            stop: 4,
            x: {
              code: 'nomatch'
            },
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
            start: 0,
            stop: 2,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            start: 2,
            stop: 3,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            start: 3,
            stop: 3,
            x: null,
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
            start: 0,
            stop: 1,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'c',
            start: 1,
            stop: 2,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            start: 2,
            stop: 2,
            x: null,
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
            start: 0,
            stop: 1,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: '$eof',
            mk: 'tag:$eof',
            jump: null,
            value: '',
            start: 1,
            stop: 1,
            x: null,
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
            start: 0,
            stop: 0,
            x: null,
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
            start: 0,
            stop: 5,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'escchr',
            mk: 'plain:escchr',
            jump: null,
            value: '\\<',
            start: 5,
            stop: 7,
            x: {
              chr: '<'
            },
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'bold>',
            start: 7,
            stop: 12,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            start: 12,
            stop: 13,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'world',
            start: 13,
            stop: 18,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            start: 18,
            stop: 19,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            start: 19,
            stop: 21,
            x: {
              lslash: '/'
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            start: 21,
            stop: 25,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 25,
            stop: 26,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            start: 26,
            stop: 26,
            x: null,
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
            start: 0,
            stop: 1,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            start: 1,
            stop: 2,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 2,
            stop: 3,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'helo ',
            start: 3,
            stop: 8,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'escchr',
            mk: 'plain:escchr',
            jump: null,
            value: '\\<',
            start: 8,
            stop: 10,
            x: {
              chr: '<'
            },
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'bold>',
            start: 10,
            stop: 15,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            start: 15,
            stop: 16,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'text',
            mk: 'plain:text',
            jump: null,
            value: 'world',
            start: 16,
            stop: 21,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'E_backticks',
            mk: 'plain:E_backticks',
            jump: null,
            value: '`',
            start: 21,
            stop: 22,
            x: null,
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            start: 22,
            stop: 24,
            x: {
              lslash: '/'
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'bold',
            start: 24,
            stop: 28,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 28,
            stop: 29,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            start: 29,
            stop: 31,
            x: {
              lslash: '/'
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            start: 31,
            stop: 32,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 32,
            stop: 33,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            start: 33,
            stop: 33,
            x: null,
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
            start: 0,
            stop: 1,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'i',
            start: 1,
            stop: 2,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 2,
            stop: 3,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '<',
            start: 3,
            stop: 4,
            x: {
              lslash: null
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            start: 4,
            stop: 5,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 5,
            stop: 6,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            start: 6,
            stop: 8,
            x: {
              lslash: '/'
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'b',
            start: 8,
            stop: 9,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 9,
            stop: 10,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: 'tag',
            mk: 'plain:tag',
            jump: 'tag',
            value: '</',
            start: 10,
            stop: 12,
            x: {
              lslash: '/'
            },
            '$key': '^plain'
          },
          {
            mode: 'tag',
            tid: 'text',
            mk: 'tag:text',
            jump: null,
            value: 'i',
            start: 12,
            stop: 13,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'tag',
            tid: 'end',
            mk: 'tag:end',
            jump: 'plain',
            value: '>',
            start: 13,
            stop: 14,
            x: null,
            '$key': '^tag'
          },
          {
            mode: 'plain',
            tid: '$eof',
            mk: 'plain:$eof',
            jump: null,
            value: '',
            start: 14,
            stop: 14,
            x: null,
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
          var result;
          result = lexer.run(probe);
          // H.tabulate ( rpr probe ), result
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
    var Interlex, c, error, i, len, lexer, matcher, probe, probes_and_matchers;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    (() => {      //.........................................................................................................
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
    (() => {      // lexer.add_lexeme mode, 'other',        /./u
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
    //.........................................................................................................
    probes_and_matchers = [['helo <bold>`world`</bold>', "[plain:text,(0:5),='helo '][plain:tag>tag,(5:6),='<',lslash:null][tag:text,(6:10),='bold'][tag:end>plain,(10:11),='>'][plain:E_backticks,(11:12),='`'][plain:text,(12:17),='world'][plain:E_backticks,(17:18),='`'][plain:tag>tag,(18:20),='</',lslash:'/'][tag:text,(20:24),='bold'][tag:end>plain,(24:25),='>'][plain:$eof,(25:25),='']", null], ['<x v=\\> z=42>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:5),='x v='][tag:escchr,(5:7),='\\\\>',chr:'>'][tag:text,(7:12),=' z=42'][tag:end>plain,(12:13),='>'][plain:$eof,(13:13),='']", null], ['<x v=\\> z=42\\>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:5),='x v='][tag:escchr,(5:7),='\\\\>',chr:'>'][tag:text,(7:12),=' z=42'][tag:escchr,(12:14),='\\\\>',chr:'>'][tag:$eof,(14:14),='']", null], ['a <b', "[plain:text,(0:2),='a '][plain:tag>tag,(2:3),='<',lslash:null][tag:text,(3:4),='b'][tag:$eof,(4:4),='']", null], ['what? error?', "[plain:text,(0:4),='what'][plain:$error,(4:4),='',code:'nomatch']", null], ['d <', "[plain:text,(0:2),='d '][plain:tag>tag,(2:3),='<',lslash:null][tag:$eof,(3:3),='']", null], ['<c', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:2),='c'][tag:$eof,(2:2),='']", null], ['<', "[plain:tag>tag,(0:1),='<',lslash:null][tag:$eof,(1:1),='']", null], ['', "[plain:$eof,(0:0),='']", null], ['helo \\<bold>`world`</bold>', "[plain:text,(0:5),='helo '][plain:escchr,(5:7),='\\\\<',chr:'<'][plain:text,(7:12),='bold>'][plain:E_backticks,(12:13),='`'][plain:text,(13:18),='world'][plain:E_backticks,(18:19),='`'][plain:tag>tag,(19:21),='</',lslash:'/'][tag:text,(21:25),='bold'][tag:end>plain,(25:26),='>'][plain:$eof,(26:26),='']", null], ['<b>helo \\<bold>`world`</bold></b>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:2),='b'][tag:end>plain,(2:3),='>'][plain:text,(3:8),='helo '][plain:escchr,(8:10),='\\\\<',chr:'<'][plain:text,(10:15),='bold>'][plain:E_backticks,(15:16),='`'][plain:text,(16:21),='world'][plain:E_backticks,(21:22),='`'][plain:tag>tag,(22:24),='</',lslash:'/'][tag:text,(24:28),='bold'][tag:end>plain,(28:29),='>'][plain:tag>tag,(29:31),='</',lslash:'/'][tag:text,(31:32),='b'][tag:end>plain,(32:33),='>'][plain:$eof,(33:33),='']", null], ['<i><b></b></i>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:2),='i'][tag:end>plain,(2:3),='>'][plain:tag>tag,(3:4),='<',lslash:null][tag:text,(4:5),='b'][tag:end>plain,(5:6),='>'][plain:tag>tag,(6:8),='</',lslash:'/'][tag:text,(8:9),='b'][tag:end>plain,(9:10),='>'][plain:tag>tag,(10:12),='</',lslash:'/'][tag:text,(12:13),='i'][tag:end>plain,(13:14),='>'][plain:$eof,(14:14),='']", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var token;
          return resolve(((function() {
            var ref1, results;
            ref1 = lexer.walk(probe);
            results = [];
            for (token of ref1) {
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
            var e, ref1, results;
            if (d.tid !== 'p') {
              return send(d);
            }
            ref1 = md_lexer.walk(d.value);
            results = [];
            for (e of ref1) {
              results.push(send(e));
            }
            return results;
          });
          p.push($parse_md_stars());
          //.....................................................................................................
          p.send(new_token('^æ19^', {
            start: 0,
            stop: probe.length
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
  this.parse_line_by_line = function(T, done) {
    var $, Interlex, Pipeline, compose, d, first, last, line, md_lexer, new_toy_md_lexer, new_toy_parser, parser, probe, ref1, ref2, result, result_rpr, token, transforms, walk_lines;
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
        var e, ref1, results;
        if (!isa.text(d)) {
          return send(d);
        }
        ref1 = lexer.walk(d);
        results = [];
        for (e of ref1) {
          // send new_token = ref: 'x1', token, mode, tid, name, value, start, stop
          // send new_datom { }
          results.push(send(e));
        }
        return results;
      });
      p.push($parse_md_stars());
      return p;
    };
    //.........................................................................................................
    /* TAINT use upcoming implementation in `guy` */
    walk_lines = function*(text, cfg) {
      var R, Y/* internal error */, last_position, match, pattern, template;
      validate.text(text);
      template = {
        keep_newlines: true
      };
      cfg = {...template, ...cfg};
      pattern = /.*?(\n|$)/suy;
      last_position = text.length - 1;
      while (true) {
        if (pattern.lastIndex > last_position) {
          break;
        }
        if ((match = text.match(pattern)) == null) {
          break;
        }
        Y = match[0];
        if (!cfg.keep_newlines) {
          Y = Y.slice(0, Y.length - 1);
        }
        yield Y;
      }
      R = walk_lines();
      R.reset = function() {
        return pattern.lastIndex = 0;
      };
      return R;
    };
    //.........................................................................................................
    md_lexer = new_toy_md_lexer('md');
    parser = new_toy_parser(md_lexer);
    //.........................................................................................................
    result = [];
    ref1 = walk_lines(probe);
    for (line of ref1) {
      parser.send(line);
      ref2 = parser.walk();
      for (d of ref2) {
        result.push(d);
        info('^79-10^', rpr(d));
      }
    }
    //.........................................................................................................
    H.tabulate("parse line by line", result);
    // debug '^79-11^', result_rpr = ( md_lexer.rpr_token token for token in result ).join ''
    result_rpr = ((function() {
      var i, len, ref3, results;
      results = [];
      for (i = 0, len = result.length; i < len; i++) {
        token = result[i];
        if ((ref3 = !token.$stamped) != null ? ref3 : false) {
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
          return send(new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
        }
        if (d.mk === 'literal:codespan') {
          send(stamp(d));
          return send(new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
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
            var e, ref1, results;
            if (d.tid !== 'p') {
              return send(d);
            }
            ref1 = md_lexer.walk(d.value);
            results = [];
            for (e of ref1) {
              results.push(send(e));
            }
            return results;
          });
          p.push($parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(new_token('^æ19^', {
            start: 0,
            stop: probe.length
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
    var $, $parse_md_codespan, Interlex, Pipeline, compose, error, first, i, last, len, matcher, md_lexer, new_toy_md_lexer, probe, probes_and_matchers, transforms;
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
            send(new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
            break;
          case 'literal:codespan':
            send(stamp(d));
            send(new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
            break;
          default:
            send(d);
        }
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
            var e, ref1, results;
            if (d.tid !== 'p') {
              return send(d);
            }
            ref1 = md_lexer.walk(d.value);
            results = [];
            for (e of ref1) {
              results.push(send(e));
            }
            return results;
          });
          p.push($parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(new_token('^æ19^', {
            start: 0,
            stop: probe.length
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
      // @using_strings_for_patterns()
      // test @using_strings_for_patterns
      // @cannot_return_from_initial_mode()
      // test @cannot_return_from_initial_mode
      // test @using_lexer_without_lexemes
      return test(this.lex_tags);
    })();
  }

  // test @lex_tags_with_rpr
// @parse_line_by_line()
// test @parse_line_by_line
// @parse_md_stars_markup()
// test @parse_md_stars_markup
// test @parse_nested_codespan
// @markup_with_variable_length()
// test @markup_with_variable_length
// @_demo_markup_with_variable_length()

}).call(this);

//# sourceMappingURL=test-basics.js.map