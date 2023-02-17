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
    //.........................................................................................................
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
    //.........................................................................................................
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
    (() => {      //.........................................................................................................
      var mode;
      mode = 'plain';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'amp',
        jump: 'xncr',
        pattern: /&(?=[^\s\\]+;)/,
        reserved: '&' // only match if ahead of (no ws, no bslash) + semicolon
      });
      lexer.add_lexeme({
        mode,
        tid: 'slash',
        jump: null,
        pattern: '/',
        reserved: '/'
      });
      lexer.add_lexeme({
        mode,
        tid: 'ltbang',
        jump: 'comment',
        pattern: '<!--',
        reserved: '<'
      });
      lexer.add_lexeme({
        mode,
        tid: 'lt',
        jump: 'tag',
        pattern: '<',
        reserved: '<'
      });
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
    (() => {      //.........................................................................................................
      var mode;
      mode = 'xncr';
      // lexer.add_lexeme new_escchr_descriptor  mode
      // lexer.add_lexeme new_nl_descriptor      mode
      lexer.add_lexeme({
        mode,
        tid: 'csg',
        jump: null,
        pattern: /(?<=&)[^\s;#\\]+(?=#)/u // character set sigil (non-standard)
      });
      lexer.add_lexeme({
        mode,
        tid: 'name',
        jump: null,
        pattern: /(?<=&)[^\s;#\\]+(?=;)/u // name of named entity
      });
      lexer.add_lexeme({
        mode,
        tid: 'dec',
        jump: null,
        pattern: /#(?<nr>[0-9]+)(?=;)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'hex',
        jump: null,
        pattern: /#(?:x|X)(?<nr>[0-9a-fA-F]+)(?=;)/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'sc',
        jump: '^',
        pattern: /;/u
      });
      return lexer.add_lexeme({
        mode,
        tid: '$error',
        jump: '^',
        pattern: /.|$/u
      });
    })();
    (() => {      //.........................................................................................................
      var mode;
      mode = 'tag';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      // lexer.add_lexeme { mode,  tid: 'tagtext',   jump: null,       pattern: ( /[^\/>]+/u ), }
      lexer.add_lexeme({
        mode,
        tid: 'dq',
        jump: 'tag:dq',
        pattern: '"',
        reserved: '"'
      });
      lexer.add_lexeme({
        mode,
        tid: 'sq',
        jump: 'tag:sq',
        pattern: "'",
        reserved: "'"
      });
      lexer.add_lexeme({
        mode,
        tid: 'slashgt',
        jump: '^',
        pattern: '/>',
        reserved: ['>', '/']
      });
      lexer.add_lexeme({
        mode,
        tid: 'slash',
        jump: '^',
        pattern: '/',
        reserved: '/'
      });
      lexer.add_lexeme({
        mode,
        tid: 'gt',
        jump: '^',
        pattern: '>',
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
    (() => {      //.........................................................................................................
      var mode;
      mode = 'tag:dq';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'dq',
        jump: '^',
        pattern: '"',
        reserved: '"'
      });
      return lexer.add_catchall_lexeme({
        mode,
        tid: 'text'
      });
    })();
    (() => {      //.........................................................................................................
      var mode;
      mode = 'tag:sq';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'sq',
        jump: '^',
        pattern: "'",
        reserved: "'"
      });
      return lexer.add_catchall_lexeme({
        mode,
        tid: 'text'
      });
    })();
    (() => {      //.........................................................................................................
      var mode;
      mode = 'comment';
      lexer.add_lexeme(new_escchr_descriptor(mode));
      lexer.add_lexeme(new_nl_descriptor(mode));
      lexer.add_lexeme({
        mode,
        tid: 'eoc',
        jump: '^',
        pattern: '-->',
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
        var e, first, last, tag_types;
        if (d[htmlish_sym] == null) {
          return send(d);
        }
        first = d.$collector.at(0);
        last = d.$collector.at(-1);
        // delete d.$collector; H.tabulate "htmlish", [ d, ]
        //.....................................................................................................

        // * otag      opening tag, `<a>`
        // * ctag      closing tag, `</a>` or `</>`

        // * ntag      opening tag of `<i/italic/`
        // * nctag     closing slash of `<i/italic/`

        // * stag      self-closing tag, `<br/>`

        tag_types = {
          otag: {
            open: true,
            close: false
          },
          ctag: {
            open: false,
            close: true
          },
          ntag: {
            open: true,
            close: false
          },
          nctag: {
            open: false,
            close: true
          },
          stag: {
            open: true,
            close: true
          }
        };
        //.....................................................................................................
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
        var $collector, $source, e, htmlish;
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
            // H.tabulate '^78^', htmlish
            // debug '^78^', rpr $source
            // info '^78^', x for x in htmlish
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
    // debug '^43^', p
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: 'xyz'
          },
          {
            mk: 'plain:slash',
            value: '/'
          },
          {
            mk: 'plain:nl',
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
          }
        ],
        null
      ],
      [
        "abc<div#c1 foo='bar/xyz'/>",
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
            mk: 'tag:slashgt',
            value: '/>'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'abc<i/>xyz/>',
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
            value: 'i'
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
            mk: 'plain:slash',
            value: '/'
          },
          {
            mk: 'plain:other',
            value: '>'
          },
          {
            mk: 'plain:nl',
            value: '\n'
          }
        ],
        null
      ],
      [
        'abc<i/xyz/>',
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
            value: 'i'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:other',
            value: 'xyz'
          },
          {
            mk: 'plain:slash',
            value: '/'
          },
          {
            mk: 'plain:other',
            value: '>'
          },
          {
            mk: 'plain:nl',
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
            value: '\n'
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
          // H.tabulate ( rpr probe ), result
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
    probes_and_matchers = [['abc<div#c1 foo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slash'/',tag:ntag'<div#c1 foo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null], ['abc<div#c1\nfoo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slash'/',tag:ntag'<div#c1\\nfoo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null], ['abc<div#c1 foo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:gt'>',tag:otag'<div#c1 foo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null], ['abc<div#c1\nfoo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:gt'>',tag:otag'<div#c1\\nfoo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null], ['abc<div#c1 foo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slashgt'/>',tag:stag'<div#c1 foo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null], ['abc<div#c1\nfoo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slashgt'/>',tag:stag'<div#c1\\nfoo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, line, parser, ref, ref1, result, result_rpr, token;
          lexer = new_tag_lexer();
          parser = new_parser(lexer);
          result = [];
          result_rpr = [];
          ref = GUY.str.walk_lines(probe);
          for (line of ref) {
            parser.send(line);
            ref1 = parser.walk();
            for (token of ref1) {
              // token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
              result.push(token);
              result_rpr.push(`${token.mk}${rpr(token.value)}`);
            }
          }
          // H.tabulate ( rpr probe ), result
          return resolve(result_rpr.join(','));
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.htmlish_tag_types = async function(T, done) {
    var _HTMLISH, error, i, len, matcher, probe, probes_and_matchers;
    _HTMLISH = (require('paragate/lib/htmlish.grammar')).new_grammar({
      bare: true
    });
    //.........................................................................................................
    probes_and_matchers = [['<a>', ["otag'<a>'"], null], ['<a b=c>', ["otag'<a b=c>'"], null], ['<a b=c/>', ["stag'<a b=c/>'"], null], ['<a b=c/', ["ntag'<a b=c/'"], null], ['</a>', ["ctag'</a>'"], null], ['<br>', ["otag'<br>'"], null], ['<br/>', ["stag'<br/>'"], null], ['<i/italic/', ["ntag'<i/'", "undefined'italic'", "nctag'/'"], null], ['<i>italic</>', ["otag'<i>'", "undefined'italic'", "ctag'</>'", "undefined'>'"], null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, result_rpr, token;
          result = _HTMLISH.parse(probe);
          result_rpr = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              token = result[j];
              results.push(`${token.type}${rpr(token.text)}`);
            }
            return results;
          })();
          // H.tabulate ( rpr probe ), result
          return resolve(result_rpr);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.xncrs = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [['&amp', "plain:forbidden'&',plain:other'amp',plain:nl'\\n'", null], ['&amp what', "plain:forbidden'&',plain:other'amp what',plain:nl'\\n'", null], ['&amp\n', "plain:forbidden'&',plain:other'amp',plain:nl'\\n',plain:nl'\\n'", null], ['&amp;', "plain:amp'&',xncr:name'amp',xncr:sc';',plain:nl'\\n'", null], ['&amp\\;', "plain:forbidden'&',plain:other'amp',plain:escchr'\\\\;',plain:nl'\\n'", null], ['&amp;\n', "plain:amp'&',xncr:name'amp',xncr:sc';',plain:nl'\\n',plain:nl'\\n'", null], ['&xamp;', "plain:amp'&',xncr:name'xamp',xncr:sc';',plain:nl'\\n'", null], ['&123;', "plain:amp'&',xncr:name'123',xncr:sc';',plain:nl'\\n'", null], ['&x123;', "plain:amp'&',xncr:name'x123',xncr:sc';',plain:nl'\\n'", null], ['&#123;', "plain:amp'&',xncr:dec'#123',xncr:sc';',plain:nl'\\n'", null], ['&#x123;', "plain:amp'&',xncr:hex'#x123',xncr:sc';',plain:nl'\\n'", null], ['&jzr#123;', "plain:amp'&',xncr:csg'jzr',xncr:dec'#123',xncr:sc';',plain:nl'\\n'", null], ['&jzr#x123;', "plain:amp'&',xncr:csg'jzr',xncr:hex'#x123',xncr:sc';',plain:nl'\\n'", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, ref, result, result_rpr, token;
          lexer = new_tag_lexer();
          result = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            result.push(token);
          }
          // H.tabulate ( rpr probe ), result
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              token = result[j];
              results.push(`${token.mk}${rpr(token.value)}`);
            }
            return results;
          })()).join(',');
          // info '^94-1^', result_rpr
          return resolve(result_rpr);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @tags_1
      // test @tags_2
      // test @htmlish_tag_types
      return test(this.xncrs);
    })();
  }

  // test @parse_codespans_and_single_star
// test @parse_md_stars_markup

}).call(this);

//# sourceMappingURL=test-tags.js.map