(function() {
  'use strict';
  var ASCIISORTER, Asciisorter, CND, GRAMMAR, INTERTEXT, XXXX_LEXER_MODES, _match_catchall_with_function, alert, asciisorter, assign, badge, dd, debug, echo, freeze, help, info, isa, jr, lets, log, match_catchall, match_ucletter, new_ref, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/GRAMMARS/ASCIISORTER';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  ({assign, jr} = CND);

  // CHVTN                     = require 'chevrotain'
  ({lets, freeze} = (new (require('datom')).Datom({
    dirty: false
  })).export());

  types = require('../../../../apps/paragate/lib/types');

  ({isa, type_of, validate} = types);

  GRAMMAR = require('../../../../apps/paragate/lib/grammar');

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  //-----------------------------------------------------------------------------------------------------------
  new_ref = function(this_ref, prv_ref) {
    /* TAINT implement as optional functionality of `DATOM.new_datom()` */
    return (this_ref + prv_ref).replace(/\^+/g, '^');
  };

  //-----------------------------------------------------------------------------------------------------------
  dd = function(d, ref = null) {
    var k, ref1;
    if ((ref != null ? ref.$ : void 0) != null) {
      /* TAINT implement as optional functionality of `DATOM.new_datom()` */
      // debug '^3334^', ( rpr d ), ( rpr ref.$ ), ( rpr new_ref d, ref ) if ref?
      d.$ = new_ref(d.$, ref.$);
    }
    for (k in d) {
      if ((ref1 = d[k]) === (void 0) || ref1 === null || ref1 === '') {
        delete d[k];
      }
    }
    return d;
  };

  //-----------------------------------------------------------------------------------------------------------
  /* A function to perform matches; a matcher function may, but doesn't have to use regexes; if it does,
  it can use features not currently supported by Chevrotain (e.g. Unicode flag). Observe that in order to
  avoid generating a new string for each character tested, we prefer to use the 'sticky flag' (`/.../y`)
  and set `lastIndex`. It is probably a good idea to define patterns outside of matcher functions for better
  performance. */
  match_ucletter = function(text, start) {
    var match, pattern;
    pattern = /[A-Z]+/y;
    pattern.lastIndex = start;
    if ((match = text.match(pattern)) != null) {
      return [match[0]];
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  _match_catchall_with_function = function(matcher, text, start, last_idx) {
    var i, idx, ref1, ref2;
    last_idx = Math.min(text.length, last_idx);
    for (idx = i = ref1 = start, ref2 = last_idx; (ref1 <= ref2 ? i < ref2 : i > ref2); idx = ref1 <= ref2 ? ++i : --i) {
      if ((matcher(text, idx)) != null) {
        return idx;
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  match_catchall = function(text, start) {
    /*

    xxx Assuming this token matcher has been put last, try all other token matchers for all positions starting
    from the current, recording their matching index. From all indexes, find the smallest index, if any, and
    return the text (wrapped in a list) between the current index and that minimal matching index, or else
    `null`.

    Optimizations:
      * need only consider smallest index,
      * so no need to build list of results,
      * and no need for function matchers to be called after current best result.

     */
    var _, idx/* stop here b/c this matcher must come last or act as if so */, match, matcher, my_matcher, nearest, ref1, type;
    nearest = +2e308;
    ref1 = XXXX_LEXER_MODES.basic_mode;
    //.........................................................................................................
    for (_ in ref1) {
      ({
        match: matcher
      } = ref1[_]);
      if (matcher === match_catchall) {
        break;
      }
      idx = null;
      //.......................................................................................................
      switch (type = type_of(matcher)) {
        //.....................................................................................................
        case 'regex':
          my_matcher = new RegExp(matcher, 'g');
          my_matcher.lastIndex = start;
          if ((match = my_matcher.exec(text)) == null) {
            continue;
          }
          idx = match.index;
          break;
        //.....................................................................................................
        case 'function':
          idx = _match_catchall_with_function(matcher, text, start, nearest);
          break;
        default:
          throw new Error(`^47478^ unknown matcher type ${rpr(type)}`);
      }
      //.......................................................................................................
      if ((idx != null) && idx < nearest) {
        nearest = idx;
      }
    }
    //.........................................................................................................
    return [text.slice(start, nearest)];
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this./* using `Infinity` for upper bound is OK */lexer_modes = XXXX_LEXER_MODES = {
    //.........................................................................................................
    basic_mode: {
      T_lcletters: {
        match: /[a-z]+/
      },
      // custom patterns should explicitly specify the line_breaks property
      T_ucletters: {
        match: match_ucletter,
        line_breaks: false
      },
      /* match by function; used for advanced matching */T_newline: {
        match: /\n/
      },
      T_digits: {
        match: /[0-8]+/
      },
      // lbrace:           { match: /[(\[{]+/,       }
      // rbrace:           { match: /[)\]}]+/,       }
      // quote:            { match: /['"]+/,         }
      T_sign: {
        match: /[-+]/
      },
      T_punctuation: {
        match: /[=,.;:!?]+/
      },
      T_spaces: {
        match: /\s+/
      },
      T_catchalls: {
        match: match_catchall,
        line_breaks: false
      }
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  /* Minimal summarizer that could be generated where missing: */
  this.summarize = function(t, grammar) {
    // debug '^33442^', rpr grammar.settings
    this.RULE('document', () => {
      return this.MANY(() => {
        return this.OR([
          {
            ALT: () => {
              return this.SUBRULE(this.P_alphanumeric);
            }
          },
          {
            ALT: () => {
              return this.SUBRULE(this.P_number);
            }
          },
          {
            ALT: () => {
              return this.CONSUME(t.T_lcletters);
            }
          },
          {
            ALT: () => {
              return this.CONSUME(t.T_ucletters);
            }
          },
          {
            ALT: () => {
              return this.CONSUME(t.T_newline);
            }
          },
          {
            // { ALT: => @CONSUME t.T_digits         }
            // { ALT: => @CONSUME t.lbrace           }
            // { ALT: => @CONSUME t.rbrace           }
            // { ALT: => @CONSUME t.quote            }
            ALT: () => {
              return this.CONSUME(t.T_punctuation);
            }
          },
          {
            ALT: () => {
              return this.CONSUME(t.T_spaces);
            }
          },
          {
            ALT: () => {
              return this.CONSUME(t.T_sign);
            }
          },
          {
            ALT: () => {
              return this.CONSUME(t.T_catchalls);
            }
          }
        ]);
      });
    });
    this.RULE('P_alphanumeric', () => {
      this.OR([
        {
          ALT: () => {
            return this.CONSUME(t.T_lcletters);
          }
        },
        {
          ALT: () => {
            return this.CONSUME(t.T_ucletters);
          }
        }
      ]);
      return this.CONSUME(t.T_digits);
    });
    return this.RULE('P_number', () => {
      this.OPTION(() => {
        return this.CONSUME(t.T_sign);
      });
      return this.CONSUME(t.T_digits);
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.linearize = function*(source, tree, level = 0) {
    var $key, $vnr, _, i, len, ref1, start, stop, subtree, text, token_name, type, ukid, ukids, x;
    if (tree == null) {
      return null;
    }
    ({
      //.........................................................................................................
      name: token_name,
      $key,
      start,
      stop,
      text,
      $vnr
    } = tree);
    //.........................................................................................................
    if ($key === '^token') {
      switch (token_name) {
        case 'T_lcletters':
          yield dd({
            $key: '^text',
            type: 'lower',
            start,
            stop,
            text,
            $vnr,
            $: '^α1^'
          }, tree);
          break;
        case 'T_ucletters':
          yield dd({
            $key: '^text',
            type: 'upper',
            start,
            stop,
            text,
            $vnr,
            $: '^α2^'
          }, tree);
          break;
        case 'T_digits':
          yield dd({
            $key: '^number',
            start,
            stop,
            text,
            $vnr,
            $: '^α2^'
          }, tree);
          break;
        case 'T_catchalls':
          yield dd({
            $key: '^text',
            type: 'other',
            start,
            stop,
            text,
            $vnr,
            $: '^α3^'
          }, tree);
          break;
        default:
          yield dd({
            $key: '^unknown',
            text,
            start,
            stop,
            $value: tree,
            $vnr,
            $: '^α4^'
          }, tree);
      }
      return null;
    }
    if ($key !== '^document' && $key !== '^node') {
      throw new Error(`^445^ unknown $key ${rpr($key)}`);
    }
    //.........................................................................................................
    ({ukids} = tree);
/* NOTE we assume that unique kids exist and that values are stored in source order */
    for (_ in ukids) {
      ukid = ukids[_];
      $vnr = ukid.$vnr;
      break;
    }
    //.........................................................................................................
    if ($key === '^document') {
      yield dd({
        $key: '<document',
        start: 0,
        stop: 0,
        source,
        errors: tree.errors,
        $vnr: [-2e308],
        $: '^α5^'
      });
      ref1 = tree.kids;
      for (i = 0, len = ref1.length; i < len; i++) {
        subtree = ref1[i];
        yield* this.linearize(source, subtree, level + 1);
      }
      x = text.length;
      yield dd({
        $key: '>document',
        start: x,
        stop: x,
        $vnr: [2e308],
        $: '^α6^'
      });
      return null;
    }
    //.........................................................................................................
    switch (token_name) {
      //.......................................................................................................
      case 'P_alphanumeric':
        $key = '^alphanumeric';
        if (tree.ukids.T_lcletters != null) {
          type = 'lower';
        } else if (tree.ukids.T_ucletters != null) {
          type = 'upper';
        }
        yield dd({
          $key,
          type,
          text,
          start,
          stop,
          $vnr,
          $: '^α7^'
        });
        break;
      //.......................................................................................................
      case 'P_number':
        $key = '^number';
        type = (function() {
          var ref2, ref3, ref4;
          switch ((ref2 = (ref3 = tree.ukids) != null ? (ref4 = ref3.T_sign) != null ? ref4.text : void 0 : void 0) != null ? ref2 : '+') {
            case '+':
              return 'positive';
            case '-':
              return 'negative';
          }
        })();
        yield dd({
          $key,
          type,
          text,
          start,
          stop,
          type,
          $vnr,
          $: '^α7^'
        });
        break;
      default:
        //.......................................................................................................
        yield dd({
          $key: '^unknown',
          text,
          start,
          stop,
          $value: tree,
          $vnr,
          $: '^α8^'
        });
    }
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  ASCIISORTER = this;

  Asciisorter = class Asciisorter extends GRAMMAR.Grammar {
    constructor(settings = null) {
      var name;
      settings = assign({
        use_summarize: true
      }, settings);
      name = settings.use_summarize ? 'asciisorter' : 'asciiautosumm';
      super(name, ASCIISORTER, settings);
      if (!this.settings.use_summarize) {
        delete this.linearize;
        delete this.summarize;
        this.parser = this._new_parser(name);
      }
      return this;
    }

  };

  asciisorter = new Asciisorter();

  module.exports = {asciisorter, Asciisorter};

}).call(this);

//# sourceMappingURL=asciisorter.grammar.js.map