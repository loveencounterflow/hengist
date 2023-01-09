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
    /* TAINT uses code units, should use codepoints */
    var after, before, center, i, idx, j, left, len, len1, lexer, match, max_index, mid, modes, n, old_last_idx, pattern, probe, probes, right, token, tokens;
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
    probes = ["<x v=\\> z=42\\>", "a <b", "what? error?", "d <", "<c", "<", ""];
//.......................................................................................................
// "helo \\<bold>`world`</bold>"
    for (i = 0, len = probes.length; i < len; i++) {
      probe = probes[i];
      whisper('^31-1^', '————————————————————————————————————————————————————————————————————————');
      lexer.reset();
      pattern = lexer.registry[lexer.state.mode].pattern;
      tokens = [];
      max_index = probe.length - 1;
      while (true) {
        //.......................................................................................................
        if (lexer.state.prv_last_idx > max_index) {
          /* reached end */
          tokens.push({
            mode: lexer.state.mode,
            key: '$eof',
            mk: `${lexer.state.mode}:$eof`,
            value: '',
            start: max_index + 1,
            stop: max_index + 1,
            x: null
          });
          break;
        }
        match = probe.match(pattern);
        if (match == null) {
          /* TAINT complain if not at end or issue error token */
          tokens.push({
            mode: lexer.state.mode,
            key: '$error',
            mk: `${lexer.state.mode}:$error`,
            value: '',
            start: lexer.state.prv_last_idx,
            stop: lexer.state.prv_last_idx,
            x: {
              code: 'nomatch'
            }
          });
          break;
        }
        if (pattern.lastIndex === lexer.state.prv_last_idx) {
          if (match != null) {
            warn('^31-7^', {...match.groups});
            warn('^31-8^', token = lexer._token_from_match(lexer.state.prv_last_idx, match, lexer.state.mode));
            center = token.stop;
            left = Math.max(0, center - 11);
            right = Math.min(probe.length, center + 11);
            before = probe.slice(left, center);
            after = probe.slice(center + 1, +right + 1 || 9e9);
            mid = probe[center];
            warn('^31-9^', {before, mid, after});
            warn('^31-10^', GUY.trm.reverse(`pattern ${rpr(token.key)} matched empty string; stopping`));
          } else {
            warn('^31-11^', GUY.trm.reverse("nothing matched; detected loop, stopping"));
          }
          break;
        }
        token = lexer._token_from_match(lexer.state.prv_last_idx, match, lexer.state.mode);
        tokens.push(token);
        // info '^31-12^', pattern.lastIndex, token
        //.....................................................................................................
        if (token.key.startsWith('gosub_')) {
          lexer.state.stack.push(lexer.state.mode);
          lexer.state.mode = token.key.replace('gosub_', '');
          old_last_idx = pattern.lastIndex;
          pattern = lexer.registry[lexer.state.mode].pattern;
          pattern.lastIndex = old_last_idx;
        //.....................................................................................................
        } else if (token.key === 'return') {
          lexer.state.mode = lexer.state.stack.pop();
          old_last_idx = pattern.lastIndex;
          pattern = lexer.registry[lexer.state.mode].pattern;
          pattern.lastIndex = old_last_idx;
        }
        //.....................................................................................................
        lexer.state.prv_last_idx = pattern.lastIndex;
      }
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
      var i, idx, len, name, re, ref1, res, source;
      // demo_1()
      // demo_flags()
      // demo_htmlish()
      res = [/a(?<chr>.).*/u, /.*d(?<chr>.)/u];
// re_2 = /(?<a>a(?<a𝔛b>.)).*(?<d>d(?<d𝔛b>.))/u
      for (idx = i = 0, len = res.length; i < len; idx = ++i) {
        re = res[idx];
        name = `g${idx + 1}`;
        source = re.source.replace(/(?<!\\)\(\?<([^>]+)>/gu, `(?<${name}𝔛$1>`);
        source = `(?<${name}>${source})`;
        res[idx] = new RegExp(source, re.flags);
      }
      debug('^45-1^', res);
      debug('^45-1^', re = sequence(...res));
      return urge({...((ref1 = 'abcdef'.match(re)) != null ? ref1.groups : void 0)});
    })();
  }

}).call(this);

//# sourceMappingURL=second-demo.js.map