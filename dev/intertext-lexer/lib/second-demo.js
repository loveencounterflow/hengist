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
    var after, before, center, i, left, len, lexer, match, mid, modes, n, old_last_idx, pattern, probe, probes, right, token, tokens;
    n = namedCapture;
    modes = {};
    lexer = new Interlex();
    (() => {      //.........................................................................................................
      var mode;
      mode = 'plain';
      lexer.add_lexeme(mode, 'escchr', /\\(?<chr>.)/u);
      lexer.add_lexeme(mode, 'plain', suffix('+', charSet.complement(/[<`\\]/u)));
      lexer.add_lexeme(mode, 'start_tag', /<(?<lslash>\/?)/u);
      lexer.add_lexeme(mode, 'E_backticks', /`+/);
      return lexer.add_lexeme(mode, 'other', /./u);
    })();
    (() => {      //.........................................................................................................
      var mode;
      mode = 'tag';
      lexer.add_lexeme(mode, 'escchr', /\\(?<chr>.)/u);
      lexer.add_lexeme(mode, 'stop_tag', sequence(notBehind('\\'), />/u));
      lexer.add_lexeme(mode, 'plain', suffix('+', charSet.complement(/[\\]/u)));
      return lexer.add_lexeme(mode, 'other', /./u);
    })();
    //.........................................................................................................
    lexer.finalize();
    //.........................................................................................................
    probes = ["helo <bold>`world`</bold>", "<x v=\\> z=42>", "<x v=\\> z=42\\>", "helo \\<bold>`world`</bold>"];
//.......................................................................................................
    for (i = 0, len = probes.length; i < len; i++) {
      probe = probes[i];
      lexer.reset();
      lexer.state.mode = 'plain'; // 'tag'
      lexer.state.stack = [];
      pattern = lexer.registry[lexer.state.mode].pattern;
      tokens = [];
      while (true) {
        //.......................................................................................................
        match = probe.match(pattern);
        if (match == null) {
          /* TAINT complain if not at end or issue error token */
          break;
        }
        if (pattern.lastIndex === lexer.state.prv_last_idx) {
          if (match != null) {
            warn('^31-2^', {...match.groups});
            warn('^31-3^', token = lexer._token_from_match(lexer.state.prv_last_idx, match, lexer.state.mode));
            center = token.stop;
            left = Math.max(0, center - 11);
            right = Math.min(probe.length, center + 11);
            before = probe.slice(left, center);
            after = probe.slice(center + 1, +right + 1 || 9e9);
            mid = probe[center];
            warn('^31-7^', {before, mid, after});
            warn('^31-9^', GUY.trm.reverse(`pattern ${rpr(token.key)} matched empty string; stopping`));
          } else {
            warn('^31-10^', GUY.trm.reverse("nothing matched; detected loop, stopping"));
          }
          break;
        }
        token = lexer._token_from_match(lexer.state.prv_last_idx, match, lexer.state.mode);
        tokens.push(token);
        // info '^31-11^', pattern.lastIndex, token
        //.....................................................................................................
        if (token.key.startsWith('start_')) {
          lexer.state.stack.push(lexer.state.mode);
          lexer.state.mode = token.key.replace('start_', '');
          old_last_idx = pattern.lastIndex;
          pattern = lexer.registry[lexer.state.mode].pattern;
          pattern.lastIndex = old_last_idx;
        //.....................................................................................................
        } else if (token.key.startsWith('stop_')) {
          // error if lexer.state.stack.length < 1
          lexer.state.mode = lexer.state.stack.pop();
          old_last_idx = pattern.lastIndex;
          pattern = lexer.registry[lexer.state.mode].pattern;
          pattern.lastIndex = old_last_idx;
        }
        if (token.key === 'nl') {
          //.....................................................................................................
          echo();
        }
        lexer.state.prv_last_idx = pattern.lastIndex;
      }
      H.tabulate(`tokens of ${rpr(probe)}`, tokens);
    }
    //.......................................................................................................
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

}).call(this);

//# sourceMappingURL=second-demo.js.map