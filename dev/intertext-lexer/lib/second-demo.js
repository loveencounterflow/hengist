(function() {
  'use strict';
  var GUY, H, Interlex, alert, atomic, bound, capture, charSet, copy_regex, debug, demo_htmlish, dotAll, dotall, echo, either, equals, flags, help, info, inspect, log, lookAhead, lookBehind, maybe, namedCapture, noBound, notAhead, notBehind, plain, praise, ref, rpr, sequence, sticky, suffix, to_width, truth, unicode, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DEMO-COMPOSE-REGEXP'));

  ({rpr, inspect, echo, log} = GUY.trm);

  truth = GUY.trm.truth.bind(GUY.trm);

  //...........................................................................................................
  ({equals, copy_regex} = GUY.samesame);

  ({to_width} = require('to-width'));

  //...........................................................................................................
  ({atomic, bound, capture, charSet, either, flags, lookAhead, lookBehind, maybe, namedCapture, noBound, notAhead, notBehind, ref, sequence, suffix} = require('compose-regexp-commonjs'));

  H = require('../../../lib/helpers');

  ({Interlex} = require('../../../apps/intertext-lexer'));

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
    var i, idx, j, len, len1, lexer, modes, n, probe, probes, token, tokens;
    n = namedCapture;
    modes = {};
    lexer = new Interlex();
    (() => {      //.........................................................................................................
      /* NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens */
      var mode;
      mode = 'plain';
      lexer.add_lexeme(mode, 'escchr', /\\(?<chr>.)/u);
      lexer.add_lexeme(mode, 'text', suffix('+', charSet.complement(/[<`\\?]/u)));
      lexer.add_lexeme(mode, 'gosub_tag', /<(?<lslash>\/?)/u);
      return lexer.add_lexeme(mode, 'E_backticks', /`+/);
    })();
    (() => {      // lexer.add_lexeme mode, 'other',        /./u
      //.........................................................................................................
      var mode;
      mode = 'tag';
      lexer.add_lexeme(mode, 'escchr', /\\(?<chr>.)/u);
      lexer.add_lexeme(mode, 'return', />/u);
      // lexer.add_lexeme mode, 'return',     either ( sequence ( notBehind '\\' ), />/u ), ( /^>/u )
      lexer.add_lexeme(mode, 'text', suffix('+', charSet.complement(/[>\\]/u)));
      return lexer.add_lexeme(mode, 'other', /./u);
    })();
    //.........................................................................................................
    lexer.finalize();
    //.........................................................................................................
    // "helo <bold>`world`</bold>"
    // "<x v=\\> z=42>"
    probes = ["<x v=\\> z=42\\>"];
//.......................................................................................................
// "a <b"
// "what? error?"
// "d <"
// "<c"
// "<"
// ""
// "helo \\<bold>`world`</bold>"
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

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_1()
      // demo_flags()
      return demo_htmlish();
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