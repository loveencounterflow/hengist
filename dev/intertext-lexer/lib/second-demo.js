(function() {
  'use strict';
  var GUY, H, Interlex, alert, atomic, bound, capture, charSet, compose, copy_regex, debug, demo_htmlish, demo_htmlish_with_paragraphs, demo_paragraphs, dotAll, dotall, echo, either, equals, flags, help, info, inspect, log, lookAhead, lookBehind, maybe, namedCapture, new_md_paragraph_lexer, new_toy_md_lexer, noBound, notAhead, notBehind, plain, praise, ref, rpr, sequence, sticky, suffix, to_width, truth, unicode, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DEMO-COMPOSE-REGEXP'));

  ({rpr, inspect, echo, log} = GUY.trm);

  truth = GUY.trm.truth.bind(GUY.trm);

  //...........................................................................................................
  ({equals, copy_regex} = GUY.samesame);

  ({to_width} = require('to-width'));

  //...........................................................................................................
  H = require('../../../lib/helpers');

  ({Interlex, compose} = require('../../../apps/intertext-lexer'));

  ({atomic, bound, capture, charSet, either, flags, lookAhead, lookBehind, maybe, namedCapture, noBound, notAhead, notBehind, ref, sequence, suffix} = compose);

  //-----------------------------------------------------------------------------------------------------------
  unicode = function(x) {
    if (x instanceof RegExp) {
      return copy_regex(x, {
        unicode: true
      });
    } else {
      return flags.add('u', x);
    }
  };

  sticky = function(x) {
    if (x instanceof RegExp) {
      return copy_regex(x, {
        sticky: true
      });
    } else {
      return flags.add('y', x);
    }
  };

  dotall = function(x) {
    if (x instanceof RegExp) {
      return copy_regex(x, {
        dotAll: true
      });
    } else {
      return flags.add('s', x);
    }
  };

  dotAll = dotall;

  //-----------------------------------------------------------------------------------------------------------
  demo_htmlish = function() {
    var i, idx, j, len, len1, lexer, probe, probes, token, tokens;
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
        pattern: suffix('+', charSet.complement(/[<`\\?]/u))
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
        pattern: suffix('+', charSet.complement(/[>\\]/u))
      });
      return lexer.add_lexeme({
        mode,
        tid: 'other',
        pattern: /./u
      });
    })();
    //.........................................................................................................
    probes = ["helo <bold>`world`</bold>", "<x v=\\> z=42>", "<x v=\\> z=42\\>", "a <b", "what? error?", "d <", "<c", "<", "", "helo \\<bold>`world`</bold>", "<b>helo \\<bold>`world`</bold></b>", "<i><b></b></i>"];
//.......................................................................................................
    for (i = 0, len = probes.length; i < len; i++) {
      probe = probes[i];
      whisper('^31-1^', '————————————————————————————————————————————————————————————————————————');
      tokens = lexer.run(probe);
//.......................................................................................................
      for (idx = j = 0, len1 = tokens.length; j < len1; idx = ++j) {
        token = tokens[idx];
        if (token.key !== '$error') {
          continue;
        }
        token.key = GUY.trm.red(token.key);
      }
      H.tabulate(`tokens of ${rpr(probe)}`, tokens);
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
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

  //-----------------------------------------------------------------------------------------------------------
  new_md_paragraph_lexer = function(mode = 'plain') {
    var lexer, lws, lws_pattern;
    lexer = new Interlex({
      dotall: true
    });
    //.........................................................................................................
    lws_pattern = /[\u{2000}-\u{200a}\u{0009}\u{000b}-\u{000d}\u{0020}\u{0085}\u{00a0}\u{2028}\u{2029}\u{202f}\u{205f}\u{3000}]/u;
    lws = lws_pattern.source;
    lexer.add_lexeme({
      mode,
      tid: 'nleot',
      pattern: /(?<!\\)\n$/u // not preceded by backslash // newline, then EOT
    });
    lexer.add_lexeme({
      mode,
      tid: 'escnl',
      pattern: /\\\n/u // newline preced by backslash
    });
    lexer.add_lexeme({
      mode,
      tid: 'nls',
      pattern: RegExp(`(?:${lws // any linear whitespace
// newline not preceded by backslash
// any linear whitespace
// two or more
}*(?<!\\\\)\\n${lws}*){2,}`, "u")
    });
    lexer.add_lexeme({
      mode,
      tid: 'p',
      pattern: RegExp(`(?:\\\\\\n|.)+?(?=\\n${lws // one or more of escaped newline or any, non-greedy
// preceding...
//   two or more newlines
//   or newline at EOT
//   or EOT
}*\\n|\\n$|$)`, "u")
    });
    return lexer;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_paragraphs = function() {
    var $, Pipeline, first, last, md_lexer, p, p_lexer, probe, state, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    probe = `first glorious
paragraph

\x20\x20
**second *slightly*** longer
paragraph
of text

foo\\
bar

***a*b**

**a*b***

***ab***

x\\

y
`;
    urge('^59-3^', rpr(probe));
    p_lexer = new_md_paragraph_lexer('p');
    md_lexer = new_toy_md_lexer('md');
    H.tabulate("paragraphs", p_lexer.run(probe));
    //.........................................................................................................
    state = {
      within_star1: false,
      within_star2: false,
      start_of_star1: null,
      start_of_star2: null
    };
    p = new Pipeline();
    p.push([probe]);
    p.push(function(source, send) {
      var d, ref1, results;
      ref1 = p_lexer.walk(source);
      results = [];
      for (d of ref1) {
        results.push(send(d));
      }
      return results;
    });
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
    p.push((function() {
      return function(d, send) {
        if (d.tid !== 'star1') {
          return send(d);
        }
        if (state.within_star1) {
          send({
            tid: 'html',
            value: '</i>' // TAINT not a standard datom ###
          });
          state.within_star1 = false;
          return state.start_of_star1 = null;
        } else {
          send({
            tid: 'html',
            value: '<i>' // TAINT not a standard datom ###
          });
          state.within_star1 = true;
          return state.start_of_star1 = d.start;
        }
      };
    })());
    p.push((function() {
      return function(d, send) {
        if (d.tid !== 'star2') {
          return send(d);
        }
        if (state.within_star2) {
          send({
            tid: 'html',
            value: '</b>' // TAINT not a standard datom ###
          });
          state.within_star2 = false;
          return state.start_of_star2 = null;
        } else {
          send({
            tid: 'html',
            value: '<b>' // TAINT not a standard datom ###
          });
          state.within_star2 = true;
          return state.start_of_star2 = d.start;
        }
      };
    })());
    p.push((function() {
      return function(d, send) {
        if (d.tid !== 'star3') {
          return send(d);
        }
        if (state.within_star1) {
          if (state.within_star2) {
            if (state.start_of_star1 <= state.start_of_star2) {
              send({
                tid: 'html',
                value: '</b>' // TAINT not a standard datom ###
              });
              send({
                tid: 'html',
                value: '</i>' // TAINT not a standard datom ###
              });
            } else {
              send({
                tid: 'html',
                value: '</i>' // TAINT not a standard datom ###
              });
              send({
                tid: 'html',
                value: '</b>' // TAINT not a standard datom ###
              });
            }
            state.within_star1 = false;
            state.start_of_star1 = null;
            state.within_star2 = false;
            return state.start_of_star2 = null;
          }
        } else {
          send({
            tid: 'html',
            value: '<xxxxxxxxx>' // TAINT not a standard datom ###
          });
          return state.within_star2 = true;
        }
      };
    })());
    H.tabulate("md", p.run());
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_htmlish_with_paragraphs = function() {};

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_1()
      // demo_flags()
      // demo_htmlish()
      return demo_paragraphs();
    })();
  }

  // res = [
//   /a(?<chr>.).*/u
//   /.*d(?<chr>.)/u
//   ]
// # re_2 = /(?<a>a(?<a𝔛b>.)).*(?<d>d(?<d𝔛b>.))/u
// for re, idx in res
//   name = "g#{idx + 1}"
//   source = re.source.replace /(?<!\\)\(\?<([^>]+)>/gu, "(?<#{name}𝔛$1>"
//   source = "(?<#{name}>#{source})"
//   res[ idx ] = new RegExp source, re.flags
// debug '^45-1^', res
// debug '^45-1^', re = sequence res...
// urge { ( 'abcdef'.match re )?.groups..., }

}).call(this);

//# sourceMappingURL=second-demo.js.map