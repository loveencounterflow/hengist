(function() {
  'use strict';
  var GUY, H, Lexer, alert, atomic, bound, capture, charSet, copy_regex, debug, demo_1, demo_flags, demo_htmlish, dotAll, dotall, echo, either, equals, flags, help, info, inspect, log, lookAhead, lookBehind, maybe, namedCapture, noBound, notAhead, notBehind, plain, praise, ref, rpr, sequence, sticky, suffix, to_width, truth, unicode, urge, warn, whisper;

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

  //===========================================================================================================
  Lexer = class Lexer {
    //---------------------------------------------------------------------------------------------------------
    _token_from_match(prv_last_idx, match, mode = null) {
      var R, key, ref1, value, x;
      x = null;
      R = {mode};
      ref1 = match.groups;
      for (key in ref1) {
        value = ref1[key];
        if (value == null) {
          continue;
        }
        if (key.startsWith('$')) {
          R.key = key.slice(1);
          R.mk = mode != null ? `${mode}:${R.key}` : R.key;
          R.value = value;
        } else {
          (x != null ? x : x = {})[key] = value === '' ? null : value;
        }
      }
      R.start = prv_last_idx;
      R.stop = prv_last_idx + match[0].length;
      R.x = x;
      return R;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var lexemes, lexer, match, n, pattern, prv_last_idx, source, token;
    lexemes = [];
    n = namedCapture;
    //.........................................................................................................
    lexemes.push(n('$escchr', /\\(?<chr>.)/u));
    lexemes.push(n('$backslash', '\\'));
    lexemes.push(n('$backtick1', notBehind('`'), '`', notAhead('`')));
    lexemes.push(n('$backtick3', notBehind('`'), '```', notAhead('`')));
    lexemes.push(n('$E_backticks', /`+/));
    lexemes.push(n('$digits', /\d+/));
    lexemes.push(n('$tag', /<[^>]+>/));
    lexemes.push(n('$nl', /\n/u));
    //.........................................................................................................
    lexemes.push(n('$ws', /[\u{000b}-\u{000d}\u{2000}-\u{200a}\u{0009}\u{0020}\u{0085}\u{00a0}\u{2028}\u{2029}\u{202f}\u{205f}\u{3000}]+/u));
    lexemes.push(n('$letters', /\p{L}+/u));
    lexemes.push(n('$other', /./u));
    lexemes.push(n('$other_digits', /[0-9]+/));
    //.........................................................................................................
    pattern = sticky(unicode(dotall(either(...lexemes))));
    source = `foo \`bar\` <i>1234\\</i>\n\\
foo \`\`bar\`\`
foo \`\`\`bar\`\`\`
\\\`\x20\x20
\\`;
    lexer = new Lexer();
    prv_last_idx = 0;
    info('^30-33^', 0);
    while ((match = source.match(pattern)) != null) {
      if (pattern.lastIndex === prv_last_idx) {
        warn('^30-33^', GUY.trm.reverse("detected loop, stopping"));
        break;
      }
      token = lexer._token_from_match(prv_last_idx, match);
      info('^30-33^', pattern.lastIndex, token);
      if (token.key === 'nl') {
        echo();
      }
      prv_last_idx = pattern.lastIndex;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_flags = function() {
    var error;
    info('^19-1^', unicode(dotall(/a/)));
    info('^19-2^', dotall(unicode(/a/)));
    info('^19-3^', flags.add('u', /a/));
    try {
      info('^19-4^', flags.add('u', /./));
    } catch (error1) {
      error = error1;
      warn(GUY.trm.reverse(error.message));
    }
    try {
      info('^19-5^', unicode(/./));
    } catch (error1) {
      error = error1;
      warn(GUY.trm.reverse(error.message));
    }
    info('^19-6^', copy_regex(/./, {
      unicode: true
    }));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_htmlish = function() {
    /* TAINT uses code units, should use codepoints */
    var add_lexeme, after, before, center, i, left, len, lexer, match, mid, mode, modes, n, old_last_idx, pattern, probe, probes, prv_last_idx, right, stack, token, tokens;
    n = namedCapture;
    modes = {};
    //.........................................................................................................
    add_lexeme = function(lexemes, mode, name, pattern) {
      help('^31-1^', to_width(`${mode}:${name}`, 20), GUY.trm.white(pattern));
      lexemes.push(n(`$${name}`, pattern));
      return null;
    };
    (() => {      //.........................................................................................................
      var lexemes, mode;
      lexemes = [];
      mode = 'plain';
      add_lexeme(lexemes, mode, 'escchr', /\\(?<chr>.)/u);
      add_lexeme(lexemes, mode, 'plain', suffix('+', charSet.complement(/[<`\\]/u)));
      add_lexeme(lexemes, mode, 'start_tag', sequence(notBehind('\\'), /<(?<lslash>\/?)/u));
      add_lexeme(lexemes, mode, 'E_backticks', /`+/);
      add_lexeme(lexemes, mode, 'other', /./u);
      return modes[mode] = sticky(unicode(dotall(either(...lexemes))));
    })();
    (() => {      //.........................................................................................................
      var lexemes, mode;
      lexemes = [];
      mode = 'tag';
      add_lexeme(lexemes, mode, 'stop_tag', sequence(notBehind('\\'), />/u));
      add_lexeme(lexemes, mode, 'plain', suffix('+', charSet.complement(/>/u)));
      add_lexeme(lexemes, mode, 'other', /./u);
      return modes[mode] = sticky(unicode(dotall(either(...lexemes))));
    })();
    //.........................................................................................................
    probes = ["helo <bold>`world`</bold>", "helo \\<bold>`world`</bold>"];
//.......................................................................................................
    for (i = 0, len = probes.length; i < len; i++) {
      probe = probes[i];
      lexer = new Lexer();
      prv_last_idx = 0;
      mode = 'plain'; // 'tag'
      stack = [];
      pattern = modes[mode];
      tokens = [];
      while (true) {
        //.......................................................................................................
        match = probe.match(pattern);
        if (match == null) {
          /* TAINT complain if not at end or issue error token */
          break;
        }
        if (pattern.lastIndex === prv_last_idx) {
          if (match != null) {
            warn('^31-2^', {...match.groups});
            warn('^31-3^', token = lexer._token_from_match(prv_last_idx, match, mode));
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
        token = lexer._token_from_match(prv_last_idx, match, mode);
        tokens.push(token);
        // info '^31-11^', pattern.lastIndex, token
        //.....................................................................................................
        if (token.key.startsWith('start_')) {
          stack.push(mode);
          mode = token.key.replace('start_', '');
          old_last_idx = pattern.lastIndex;
          pattern = modes[mode];
          pattern.lastIndex = old_last_idx;
        //.....................................................................................................
        } else if (token.key.startsWith('stop_')) {
          // error if stack.length < 1
          mode = stack.pop();
          old_last_idx = pattern.lastIndex;
          pattern = modes[mode];
          pattern.lastIndex = old_last_idx;
        }
        if (token.key === 'nl') {
          //.....................................................................................................
          echo();
        }
        prv_last_idx = pattern.lastIndex;
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

//# sourceMappingURL=demo-compose-regexp.js.map