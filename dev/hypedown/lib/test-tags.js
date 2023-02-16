(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, new_parser, new_tag_lexer, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/TAGS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('../../../lib/helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //-----------------------------------------------------------------------------------------------------------
  new_tag_lexer = function() {
    var Interlex, lexer, new_escchr_descriptor, new_nl_descriptor;
    ({Interlex} = require('../../../apps/intertext-lexer'));
    lexer = new Interlex({
      linewise: true,
      catchall_concat: true,
      reserved_concat: true
    });
    // lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    //.......................................................................................................
    new_escchr_descriptor = function(mode) {
      var create;
      create = function(token) {
        var ref;
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
    //.......................................................................................................
    new_nl_descriptor = function(mode) {
      /* TAINT consider to force value by setting it in descriptor (needs interlex update) */
      var create;
      create = function(token) {
        token.value = '\n';
        return token;
      };
      return {
        mode,
        tid: 'nl',
        pattern: /$/u,
        create
      };
    };
    (() => {      //.......................................................................................................
      var mode;
      mode = 'plain';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'ltbang',
        jump: 'comment',
        pattern: /<!--/u,
        reserved: '<'
      });
      lexer.add_lexeme({
        mode,
        tid: 'lt',
        jump: 'tag',
        pattern: /</u,
        reserved: '<'
      });
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'ws',
        jump: null,
        pattern: /\s+/u
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
    (() => {      //.......................................................................................................
      var mode;
      mode = 'tag';
      lexer.add_lexeme(new_nl_descriptor(mode));
      // lexer.add_lexeme { mode,  tid: 'tagtext',   jump: null,       pattern: ( /[^\/>]+/u ), }
      lexer.add_lexeme({
        mode,
        tid: 'dq',
        jump: 'tag:dq',
        pattern: /"/u,
        reserved: '"'
      });
      lexer.add_lexeme({
        mode,
        tid: 'sq',
        jump: 'tag:sq',
        pattern: /'/u,
        reserved: "'"
      });
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'slashgt',
        jump: '^',
        pattern: /\/>/u,
        reserved: ['>', '/']
      });
      lexer.add_lexeme({
        mode,
        tid: 'slash',
        jump: '^',
        pattern: /\//u,
        reserved: '/'
      });
      lexer.add_lexeme({
        mode,
        tid: 'gt',
        jump: '^',
        pattern: />/u,
        reserved: '>'
      });
      lexer.add_catchall_lexeme({
        mode,
        tid: 'text'
      });
      return lexer.add_reserved_lexeme({
        mode,
        tid: 'forbidden'
      });
    })();
    (() => {      //.......................................................................................................
      var mode;
      mode = 'tag:dq';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'dq',
        jump: '^',
        pattern: /"/u,
        reserved: '"'
      });
      return lexer.add_catchall_lexeme({
        mode,
        tid: 'text'
      });
    })();
    (() => {      //.......................................................................................................
      var mode;
      mode = 'tag:sq';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'sq',
        jump: '^',
        pattern: /'/u,
        reserved: "'"
      });
      return lexer.add_catchall_lexeme({
        mode,
        tid: 'text'
      });
    })();
    (() => {      //.......................................................................................................
      var mode;
      mode = 'comment';
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'eoc',
        jump: '^',
        pattern: /-->/u,
        reserved: '--'
      });
      lexer.add_catchall_lexeme({
        mode,
        tid: 'text'
      });
      return lexer.add_reserved_lexeme({
        mode,
        tid: 'forbidden'
      });
    })();
    return lexer;
  };

  //-----------------------------------------------------------------------------------------------------------
  new_parser = function(lexer) {
    var $_hd_token_from_paragate_token, $parse_htmlish_tag, $tokenize, Pipeline, _HTMLISH, htmlish_sym, p, transforms;
    ({Pipeline, transforms} = require('../../../apps/moonriver'));
    _HTMLISH = (require('paragate/lib/htmlish.grammar')).new_grammar({
      bare: true
    });
    htmlish_sym = Symbol('htmlish');
    //.........................................................................................................
    $tokenize = function(parser) {
      var tokenize;
      return tokenize = function(line, send) {
        var ref, token;
        this.types.validate.text(line);
        ref = parser.lexer.walk(line);
        for (token of ref) {
          send(token);
        }
        return null;
      };
    };
    //.........................................................................................................
    $_hd_token_from_paragate_token = function() {
      var _hd_token_from_paragate_token;
      return _hd_token_from_paragate_token = function(d, send) {
        var e, first, last;
        if (d[htmlish_sym] == null) {
          return send(d);
        }
        first = d.$collector.at(0);
        last = d.$collector.at(-1);
        delete d.$collector;
        H.tabulate("htmlish", [d]);
        e = {
          mode: 'tag',
          tid: d.type,
          mk: `tag:${d.type}`,
          jump: null,
          value: d.$source,
          /* TAINT must give first_lnr, last_lnr */
          lnr: first.lnr,
          start: first.start,
          stop: last.stop,
          x: {
            atrs: d.atrs,
            id: d.id
          },
          source: null,
          $key: '^tag'
        };
        return send(e);
      };
      return null;
    };
    //.........................................................................................................
    $parse_htmlish_tag = function() {
      var collector, parse_htmlish_tag, sp, within_tag;
      collector = [];
      within_tag = false;
      sp = new Pipeline();
      sp.push(transforms.$window({
        min: 0,
        max: +1,
        empty: null
      }));
      sp.push(parse_htmlish_tag = function([d, nxt], send) {
        var $collector, $source, e, htmlish, i, len, x;
        //.....................................................................................................
        if (within_tag) {
          collector.push(d);
          // debug '^parse_htmlish_tag@1^', d
          if (d.jump === 'plain'/* TAINT magic number */) {
            within_tag = false;
            $source = ((function() {
              var results;
              results = [];
              for (e of collector) {
                results.push(e.value);
              }
              return results;
            })()).join('');
            $collector = [...collector];
            while (collector.length > 0) {
              send(stamp(collector.shift()));
            }
            htmlish = _HTMLISH.parse($source);
            for (i = 0, len = htmlish.length; i < len; i++) {
              x = htmlish[i];
              // H.tabulate '^78^', htmlish
              // debug '^78^', rpr $source
              info('^78^', x);
            }
            if (htmlish.length !== 1) {
              /* TAINT use API to create token */
              // throw new Error "^34345^ expected single token, got #{rpr htmlish}"
              return send({
                mode: 'tag',
                tid: '$error'
              });
            }
            [htmlish] = GUY.lft.thaw(htmlish);
            htmlish[htmlish_sym] = true;
            htmlish.$collector = $collector;
            htmlish.$source = $source;
            send(htmlish);
          }
          return null;
        } else {
          if (!(nxt != null ? nxt.mk.startsWith('tag:') : void 0)) {
            //.....................................................................................................
            return send(d);
          }
          within_tag = true;
          collector.push(d);
        }
        //.....................................................................................................
        return null;
      });
      sp.push($_hd_token_from_paragate_token());
      return sp;
    };
    //.........................................................................................................
    p = new Pipeline();
    p.lexer = lexer;
    p.push($tokenize(p));
    p.push($parse_htmlish_tag());
    // p.push show = ( d ) -> urge '^parser@1^', d
    debug('^43^', p);
    return p;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tags_1 = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    //.........................................................................................................
    probes_and_matchers = [
      [
        'foo <!-- comment --> bar',
        [
          {
            mk: 'plain:other',
            value: 'foo '
          },
          {
            mk: 'plain:ltbang',
            value: '<!--'
          },
          {
            mk: 'comment:text',
            value: ' comment '
          },
          {
            mk: 'comment:eoc',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:other',
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
        'foo <!-- comment \n --> bar',
        [
          {
            mk: 'plain:other',
            value: 'foo '
          },
          {
            mk: 'plain:ltbang',
            value: '<!--'
          },
          {
            mk: 'comment:text',
            value: ' comment'
          },
          {
            mk: 'comment:nl',
            value: ''
          },
          {
            mk: 'comment:text',
            value: ' '
          },
          {
            mk: 'comment:eoc',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:other',
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
            mk: 'plain:other',
            value: 'foo '
          },
          {
            mk: 'plain:ltbang',
            value: '<!--'
          },
          {
            mk: 'comment:text',
            value: ' comment '
          },
          {
            mk: 'comment:escchr',
            value: '\\',
            x: {
              chr: '\n'
            }
          },
          {
            mk: 'comment:nl',
            value: ''
          },
          {
            mk: 'comment:text',
            value: ' '
          },
          {
            mk: 'comment:eoc',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:other',
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
        'abc<div#c1 foo=bar>xyz',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo=bar'
          },
          {
            mk: 'tag:gt',
            value: '>'
          },
          {
            mk: 'plain:other',
            value: 'xyz'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo=bar/>xyz',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo=bar'
          },
          {
            mk: 'tag:slashgt',
            value: '/>'
          },
          {
            mk: 'plain:other',
            value: 'xyz'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo=bar/xyz/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo=bar'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:other',
            value: 'xyz/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo="bar>xyz"/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: 'bar>xyz'
          },
          {
            mk: 'tag:dq:dq',
            value: '"'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo="bar/>xyz"/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/>xyz'
          },
          {
            mk: 'tag:dq:dq',
            value: '"'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo="bar/xyz"/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:dq:dq',
            value: '"'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        "abc<div#c1 foo='bar>xyz'/",
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:sq:text',
            value: 'bar>xyz'
          },
          {
            mk: 'tag:sq:sq',
            value: "'"
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        "abc<div#c1 foo='bar/>xyz'/",
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:sq:text',
            value: 'bar/>xyz'
          },
          {
            mk: 'tag:sq:sq',
            value: "'"
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        "abc<div#c1 foo='bar/xyz'/",
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:sq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:sq:sq',
            value: "'"
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        `abc<div#c1 foo="bar>xyz'/`,
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: "bar>xyz'/"
          },
          {
            mk: 'tag:dq:nl',
            value: ''
          }
        ],
        null
      ],
      [
        `abc<div#c1 foo="bar/>xyz'/`,
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: "bar/>xyz'/"
          },
          {
            mk: 'tag:dq:nl',
            value: ''
          }
        ],
        null
      ],
      [
        `abc<div#c1 foo="bar/xyz'/`,
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: "bar/xyz'/"
          },
          {
            mk: 'tag:dq:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo="bar>xyz\\"/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: 'bar>xyz'
          },
          {
            mk: 'tag:dq:escchr',
            value: '\\"',
            x: {
              chr: '"'
            }
          },
          {
            mk: 'tag:dq:text',
            value: '/'
          },
          {
            mk: 'tag:dq:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo="bar/>xyz\\"/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/>xyz'
          },
          {
            mk: 'tag:dq:escchr',
            value: '\\"',
            x: {
              chr: '"'
            }
          },
          {
            mk: 'tag:dq:text',
            value: '/'
          },
          {
            mk: 'tag:dq:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'abc<div#c1 foo="bar/xyz\\"/',
        [
          {
            mk: 'plain:other',
            value: 'abc'
          },
          {
            mk: 'plain:lt',
            value: '<'
          },
          {
            mk: 'tag:text',
            value: 'div#c1 foo='
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:dq:escchr',
            value: '\\"',
            x: {
              chr: '"'
            }
          },
          {
            mk: 'tag:dq:text',
            value: '/'
          },
          {
            mk: 'tag:dq:nl',
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
          lexer = new_tag_lexer();
          result = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            d = GUY.props.omit_nullish(GUY.props.pick_with_fallback(token, null, 'mk', 'value', 'x'));
            result.push(d);
          }
          H.tabulate(rpr(probe), result);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tags_2 = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    //.........................................................................................................
    probes_and_matchers = [['abc<div#c1 foo=bar/xyz/', null, null], ['abc<div#c1\nfoo=bar/xyz/', null, null], ['abc<div#c1 foo=bar>xyz/', null, null], ['abc<div#c1\nfoo=bar>xyz/', null, null], ['abc<div#c1 foo=bar/>xyz/', null, null], ['abc<div#c1\nfoo=bar/>xyz/', null, null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, line, parser, ref, ref1, result, token;
          lexer = new_tag_lexer();
          parser = new_parser(lexer);
          result = [];
          ref = GUY.str.walk_lines(probe);
          for (line of ref) {
            parser.send(line);
            ref1 = parser.walk();
            for (token of ref1) {
              // token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
              result.push(token);
            }
          }
          H.tabulate(rpr(probe), result);
          // resolve result
          return resolve(null);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @parse_codespans_and_single_star
      // test @parse_md_stars_markup
      // test @tags_1
      return test(this.tags_2);
    })();
  }

}).call(this);

//# sourceMappingURL=test-tags.js.map