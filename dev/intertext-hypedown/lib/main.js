(function() {
  'use strict';
  var $, $parse_md_codespan, $parse_md_star, DATOM, GUY, H, Interlex, Markdown_lexemes, PATH, Pipeline, SQL, Standard_lexemes, _Lexemes, add_star1, after, alert, compose, debug, demo, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, new_hypedown_lexer, new_hypedown_parser, new_token, plain, praise, rpr, show_lexer_as_table, stamp, test, transforms, type_of, types, urge, validate, validate_list_of, walk_lines, warn, whisper;

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

  ({Pipeline, $, transforms} = require('../../../apps/moonriver'));

  ({Interlex, compose} = require('../../../apps/intertext-lexer'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show_lexer_as_table = function(title, lexer) {
    var entry, lexeme, lexemes, mode, ref1, ref2, tid;
    lexemes = [];
    ref1 = lexer.registry;
    for (mode in ref1) {
      entry = ref1[mode];
      ref2 = entry.lexemes;
      for (tid in ref2) {
        lexeme = ref2[tid];
        lexemes.push(lexeme);
      }
    }
    H.tabulate(title, lexemes);
    return null;
  };

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

  //===========================================================================================================

  //===========================================================================================================
  _Lexemes = class _Lexemes {
    /*
    * lexemes declared as *static* members (i.e. as class attributes) will be compiled
    * lexemes declared as *instance* members will be left as-is
    * use prefix
      `@lx_*` for string, regex, or object
      `@lxs_*` for list of objects
      `@get_lx_*()` for function that returns an object
      `@get_lxs_*()` for function that returns list of objects
    * TID (the lexeme's name) will default to the part after the prefix

    ```coffee
    class ClassWithStaticMethod
      @staticProperty: 'someValue'
      @staticMethod: () ->
        return 'static method has been called.'
    ```

    ```js
    class ClassWithStaticMethod {
      static staticProperty = 'someValue';
      static staticMethod() {
        return 'static method has been called.'; } }
    ```

     */
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var k, lexeme_keys, ref1, v;
      GUY.props.hide(this, 'types', (require('../../../apps/intertext-lexer/lib/types')).get_base_types());
      /* TAINT must separate `cfg` items for the instance from defaults for the lexeme */
      this.cfg = {
        mode: 'std',
        ...cfg
      };
      this._lexeme_default = {...this.types.registry.ilx_add_lexeme_cfg.default};
      lexeme_keys = new Set(Object.keys(this._lexeme_default));
      ref1 = this.cfg;
      for (k in ref1) {
        v = ref1[k];
        if (lexeme_keys.has(k)) {
          this._lexeme_default[k] = v;
        }
      }
      this._compile_lexemes();
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_list_of_lexemes(tid, list_of_lexemes) {
      var idx, lexeme;
      return (function() {
        var i, len, results;
        results = [];
        for (idx = i = 0, len = list_of_lexemes.length; i < len; idx = ++i) {
          lexeme = list_of_lexemes[idx];
          results.push(this._compile_lexeme(`${tid}_${idx + 1}`, lexeme));
        }
        return results;
      }).call(this);
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_lexeme(tid, lexeme) {
      if (this.types.isa.ilx_pattern(lexeme)) {
        lexeme = {
          tid,
          pattern: lexeme
        };
      }
      if (this.types.isa.object(lexeme)) {
        lexeme = {...this._lexeme_default, ...lexeme};
      }
      this.types.validate.ilx_add_lexeme_cfg(lexeme);
      return lexeme;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_lexemes() {
      var error, get, i, is_function, len, lexeme, lx_type, match, number, ref1, tid, xtid;
      ref1 = Object.getOwnPropertyNames(this.constructor);
      for (i = 0, len = ref1.length; i < len; i++) {
        xtid = ref1[i];
        if ((match = xtid.match(/^(?<get>get_|)(?<number>lxs?_)(?<tid>.+)$/)) == null) {
          continue;
        }
        ({get, number, tid} = match.groups);
        is_function = get !== '';
        number = number === 'lx_' ? 'singular' : 'plural';
        lexeme = this.constructor[xtid];
        lx_type = this.types.type_of(lexeme);
        urge('^324^', {xtid, tid, number, lexeme});
        try {
          if (is_function) {
            null;
          } else {
            if (number === 'singular') {
              if (lx_type === 'list') {
                throw new Error(`^238947^ must use prefix 'lxs_' for list of lexemes; got ${rpr(xtid)}`);
              }
              lexeme = this._compile_lexeme(tid, lexeme);
            } else {
              lexeme = this._compile_list_of_lexemes(tid, lexeme);
            }
          }
        } catch (error1) {
          error = error1;
          if (error.constructor.name !== 'Intertype_validation_error') {
            throw error;
          }
          // error.message
          throw error;
        }
        debug('^2124^', lexeme);
      }
      // #.....................................................................................................
      // switch type = @types.type_of lexeme
      //   when 'object' then @[ tid ] = { @cfg..., lexeme..., }
      //   when 'list'   then @[ tid ] = ( { @cfg..., lx..., } for lx in lexeme )
      //   #...................................................................................................
      //   when 'function'
      //     lexeme = lexeme.call @
      //     switch subtype = type_of lexeme
      //       when 'object' then  @[ tid ] = lexeme ### NOTE lexemes returned by functions should be complete ###
      //       when 'list'   then  @[ tid ] = lexeme ### NOTE lexemes returned by functions should be complete ###
      //       else throw new Error "^849687388^ expected an object or a list of objects, found a #{type}"
      //   #...................................................................................................
      //   else throw new Error "^849687349^ expected an object or a function, found a #{type}"
      return null;
    }

  };

  Standard_lexemes = (function() {
    //===========================================================================================================
    class Standard_lexemes extends _Lexemes {};

    //---------------------------------------------------------------------------------------------------------
    Standard_lexemes.lx_backslash_escape = {
      tid: 'escchr',
      jump: null,
      pattern: /\\(?<chr>.)/u
    };

    Standard_lexemes.lx_catchall = {
      tid: 'other',
      jump: null,
      pattern: /[^*`\\]+/u
    };

    Standard_lexemes.lx_foo = 'foo';

    Standard_lexemes.lx_bar = /bar/;

    Standard_lexemes.lxs_something = ['foo', /bar/, 'baz'];

    return Standard_lexemes;

  }).call(this);

  //===========================================================================================================
  Markdown_lexemes = class Markdown_lexemes extends _Lexemes {
    //---------------------------------------------------------------------------------------------------------
    /* TAINT handle CFG format which in this case includes `codespan_mode` */
    constructor(cfg) {
      super({
        codespan_mode: 'codespan',
        ...cfg
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    static get_lxs_variable_codespan(cfg) {
      var backtick_count, entry_handler, exit_handler;
      backtick_count = null;
      //.......................................................................................................
      entry_handler = ({token, match, lexer}) => {
        backtick_count = token.value.length;
        return this.cfg.codespan_mode;
      };
      //.......................................................................................................
      exit_handler = function({token, match, lexer}) {
        if (token.value.length === backtick_count) {
          backtick_count = null;
          return '^';
        }
        token = lets(token, function(token) {
          token.tid = 'text';
          return token.mk = `${token.mode}:text`;
        });
        return {token};
      };
      //.......................................................................................................
      info('^3532^', this.cfg);
      return [
        {
          mode: this.cfg.mode,
          tid: 'codespan',
          jump: entry_handler,
          pattern: /(?<!`)`+(?!`)/u
        },
        {
          mode: this.cfg.codespan_mode,
          tid: 'codespan',
          jump: exit_handler,
          pattern: /(?<!`)`+(?!`)/u
        },
        {
          mode: this.cfg.codespan_mode,
          tid: 'text',
          jump: null,
          pattern: /(?:\\`|[^`])+/u
        }
      ];
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  add_star1 = function(lexer, base_mode) {
    lexer.add_lexeme({
      mode: base_mode,
      tid: 'star1',
      jump: null,
      pattern: /(?<!\*)\*(?!\*)/u
    });
    return null;
  };

  //===========================================================================================================
  new_hypedown_lexer = function(mode = 'plain') {
    var lexer, standard_lexemes;
    lexer = new Interlex({
      dotall: false
    });
    standard_lexemes = new Standard_lexemes();
    process.exit(111);
    // debug '^99-2^', standard_lexemes.backslash_escape
    // markdown_lexemes = new Markdown_lexemes()
    // debug '^99-4^', markdown_lexemes.variable_codespan
    // add_backslash_escape    lexer, 'base'
    // add_star1               lexer, 'base'
    // add_variable_codespans  lexer, 'base', 'codespan'
    // add_catchall            lexer, 'base'
    return lexer;
  };

  //===========================================================================================================
  $parse_md_codespan = function(outer_mode, enter_tid, inner_mode, exit_tid) {
    /* TAINT use CFG pattern */
    /* TAINT use API for `mode:key` IDs */
    var enter_mk, exit_mk;
    enter_mk = `${outer_mode}:${enter_tid}`;
    exit_mk = `${inner_mode}:${exit_tid}`;
    return function(d, send) {
      switch (d.mk) {
        case enter_mk:
          send(stamp(d));
          send(new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
          break;
        case exit_mk:
          send(stamp(d));
          send(new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
          break;
        default:
          send(d);
      }
      return null;
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  $parse_md_star = function(star1_tid) {
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
        case star1_tid:
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

  //=========================================================================================================
  new_hypedown_parser = function() {
    var lexer, p;
    lexer = new_hypedown_lexer('md');
    show_lexer_as_table("toy MD lexer", lexer);
    p = new Pipeline();
    p.push(function(d, send) {
      var e, ref1, results;
      if (d.tid !== 'p') {
        return send(d);
      }
      ref1 = lexer.walk(d.value);
      results = [];
      for (e of ref1) {
        results.push(send(e));
      }
      return results;
    });
    p.push($parse_md_star('star1'));
    p.push($parse_md_codespan('base', 'codespan', 'codespan', 'codespan'));
    p.lexer = lexer;
    return p;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var d, error, i, len, matcher, p, probe, probes_and_matchers, result, result_rpr;
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null], ['*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      p = new_hypedown_parser();
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
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map