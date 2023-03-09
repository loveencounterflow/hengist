(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/TAGS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('./helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //-----------------------------------------------------------------------------------------------------------
  this.tags_1 = async function(T, done) {
    var Hypedown_lexer, error, i, len, matcher, probe, probes_and_matchers;
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
            mk: 'comment:$border',
            value: ''
          },
          {
            mk: 'comment:ltbang',
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
            mk: 'plain:$border',
            value: ''
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
            mk: 'comment:$border',
            value: ''
          },
          {
            mk: 'comment:ltbang',
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
            mk: 'plain:$border',
            value: ''
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
            mk: 'comment:$border',
            value: ''
          },
          {
            mk: 'comment:ltbang',
            value: '<!--'
          },
          {
            mk: 'comment:text',
            value: ' comment '
          },
          {
            mk: 'comment:escchr',
            value: '\\'
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
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'plain:$border',
            value: ''
          },
          {
            mk: 'plain:other',
            value: 'xyz'
          },
          {
            mk: 'plain:$border',
            value: ''
          },
          {
            mk: 'tag:c_s',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
          },
          {
            mk: 'tag:dq:text',
            value: 'bar>xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/>xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:dq',
            value: '"'
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:sq:$border',
            value: ''
          },
          {
            mk: 'tag:sq:text',
            value: 'bar>xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:sq:$border',
            value: ''
          },
          {
            mk: 'tag:sq:text',
            value: 'bar/>xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:sq:$border',
            value: ''
          },
          {
            mk: 'tag:sq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:slash',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:sq:$border',
            value: ''
          },
          {
            mk: 'tag:sq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:sq',
            value: "'"
          },
          {
            mk: 'tag:slashgt',
            value: '/>'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'plain:$border',
            value: ''
          },
          {
            mk: 'plain:other',
            value: 'xyz'
          },
          {
            mk: 'plain:$border',
            value: ''
          },
          {
            mk: 'tag:c_s',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'plain:$border',
            value: ''
          },
          {
            mk: 'plain:other',
            value: 'xyz'
          },
          {
            mk: 'plain:$border',
            value: ''
          },
          {
            mk: 'tag:c_s',
            value: '/'
          },
          {
            mk: 'plain:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
          },
          {
            mk: 'tag:dq:text',
            value: 'bar>xyz'
          },
          {
            mk: 'tag:dq:escchr',
            value: '\\"'
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/>xyz'
          },
          {
            mk: 'tag:dq:escchr',
            value: '\\"'
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
            mk: 'tag:$border',
            value: ''
          },
          {
            mk: 'tag:lt',
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
            mk: 'tag:dq:$border',
            value: ''
          },
          {
            mk: 'tag:dq:text',
            value: 'bar/xyz'
          },
          {
            mk: 'tag:dq:escchr',
            value: '\\"'
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
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, ref, result, token;
          // lexer   = new_tag_lexer()
          lexer = new Hypedown_lexer();
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
    var Hypedown_parser, error, i, len, matcher, probe, probes_and_matchers;
    //.........................................................................................................
    // [ 'abc', "plain:nl'',plain:nl'',html:parbreak'',html:text'<p>',plain:other'abc',html:text'abc',plain:nl'\\n',html:text'\\n'", null ]
    probes_and_matchers = [['abc<div>def</>xyz', "html:parbreak'',html:text'<p>',html:text'abc',tag:o_ltr'<div>',html:text'def',tag:c_lsr'</>',html:text'xyz',html:text'\\n'", null], ['abc<div/def/xyz', "html:parbreak'',html:text'<p>',html:text'abc',tag:o_lts'<div/',html:text'def',tag:c_s'/',html:text'xyz',html:text'\\n'", null], ['1<a/2<b/3<i>4</i>5/6/7', "html:parbreak'',html:text'<p>',html:text'1',tag:o_lts'<a/',html:text'2',tag:o_lts'<b/',html:text'3',tag:o_ltr'<i>',html:text'4',tag:c_lstr'</i>',html:text'5',tag:c_s'/',html:text'6',tag:c_s'/',html:text'7',html:text'\\n'", null], ['abc<div#c1 foo=bar/xyz/', "html:parbreak'',html:text'<p>',html:text'abc',tag:o_lts'<div#c1 foo=bar/',html:text'xyz',tag:c_s'/',html:text'\\n'", null]];
    //.........................................................................................................
    // [ 'abc<div\\>xyz', "html:parbreak'',html:text'<p>',html:text'abc'", null ]
    // [ 'abc<div/>xyz', "html:parbreak'',html:text'<p>',html:text'abc',tag:stag'<div/>',html:text'xyz',html:text'\\n'", null ]
    // [ 'abc<div/xyz', "html:parbreak'',html:text'<p>',html:text'abc',tag:ntag'<div/',html:text'xyz',html:text'\\n'", null ]
    // [ 'abc<div k=v/xyz', "html:parbreak'',html:text'<p>',html:text'abc',tag:ntag'<div k=v/',html:text'xyz',html:text'\\n'", null ]
    // [ 'abc<div k=v/def/xyz', "html:parbreak'',html:text'<p>',html:text'abc',tag:ntag'<div k=v/',html:text'def',html:text'xyz',html:text'\\n'", null ]

      // [ '1</i>2', "html:parbreak'',html:text'<p>',html:text'abc',raw-html:tag'<div>',html:text'xyz',html:text'\\n'", null ]
    // [ 'abc<div#c1\nfoo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slash'/',tag:ntag'<div#c1\\nfoo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    // [ 'abc<div#c1 foo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:gt'>',tag:otag'<div#c1 foo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    // [ 'abc<div#c1\nfoo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:gt'>',tag:otag'<div#c1\\nfoo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    // [ 'abc<div#c1 foo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slashgt'/>',tag:stag'<div#c1 foo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    // [ 'abc<div#c1\nfoo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slashgt'/>',tag:stag'<div#c1\\nfoo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    ({Hypedown_parser} = require('../../../apps/hypedown'));
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var line, parser, ref, ref1, result, result_rpr, t, text, token;
          parser = new Hypedown_parser();
          result = [];
          result_rpr = [];
          ref = GUY.str.walk_lines(probe);
          for (line of ref) {
            parser.send(line);
            ref1 = parser.walk();
            for (token of ref1) {
              // token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
              result.push(H.excerpt_token(token));
              if (!token.$stamped) {
                result_rpr.push(`${token.mk}${rpr(token.value)}`);
              }
            }
          }
          text = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              if (!t.$stamped) {
                results.push(t.value);
              }
            }
            return results;
          })()).join('|');
          // debug '^3534^', rpr text
          H.tabulate(rpr(probe), result);
          H.tabulate(rpr(probe), (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              if (!t.$stamped) {
                results.push(t);
              }
            }
            return results;
          })());
          return resolve(result_rpr.join(','));
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_closing_tags = async function(T, done) {
    var Hypedown_parser, error, i, len, matcher, probe, probes_and_matchers;
    //.........................................................................................................
    probes_and_matchers = [['1</i>2', "html:parbreak'',html:text'<p>',html:text'1',tag:c_lstr'</i>',html:text'2',html:text'\\n'", null]];
    //.........................................................................................................
    ({Hypedown_parser} = require('../../../apps/hypedown'));
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var line, parser, ref, ref1, result, result_rpr, t, text, token;
          parser = new Hypedown_parser();
          result = [];
          result_rpr = [];
          ref = GUY.str.walk_lines(probe);
          for (line of ref) {
            parser.send(line);
            ref1 = parser.walk();
            for (token of ref1) {
              if (!token.$stamped) {
                // token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
                result.push(H.excerpt_token(token));
              }
              if (!token.$stamped) {
                result_rpr.push(`${token.mk}${rpr(token.value)}`);
              }
            }
          }
          text = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              if (!t.$stamped) {
                results.push(t.value);
              }
            }
            return results;
          })()).join('|');
          debug('^3534^', rpr(text));
          H.tabulate(rpr(probe), result);
          H.tabulate(rpr(probe), (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              if (!t.$stamped) {
                results.push(t);
              }
            }
            return results;
          })());
          return resolve(result_rpr.join(','));
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @_tags_2_for_profiling = ( T, done ) ->
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [ 'abc<div#c1 foo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slash'/',tag:ntag'<div#c1 foo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
  //     [ 'abc<div#c1\nfoo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slash'/',tag:ntag'<div#c1\\nfoo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
  //     [ 'abc<div#c1 foo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:gt'>',tag:otag'<div#c1 foo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
  //     [ 'abc<div#c1\nfoo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:gt'>',tag:otag'<div#c1\\nfoo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
  //     [ 'abc<div#c1 foo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slashgt'/>',tag:stag'<div#c1 foo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
  //     [ 'abc<div#c1\nfoo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slashgt'/>',tag:stag'<div#c1\\nfoo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     lexer       = new_tag_lexer()
  //     parser      = new_parser lexer
  //     for _ in [ 1 .. 100 ]
  //     # for _ in [ 1 ]
  //       result      = []
  //       result_rpr  = []
  //       for line from GUY.str.walk_lines probe
  //         parser.send line
  //         for token from parser.walk()
  //           # token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
  //           result.push token
  //           result_rpr.push "#{token.mk}#{rpr token.value}"
  //       urge '^34-1^', Date.now(), result_rpr
  //       # H.tabulate ( rpr probe ), result
  //   #.........................................................................................................
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this.htmlish_tag_types = async function(T, done) {
    var _HTMLISH, error, i, len, matcher, probe, probes_and_matchers;
    _HTMLISH = (require('paragate/lib/htmlish.grammar')).new_grammar({
      bare: true
    });
    //.........................................................................................................
    probes_and_matchers = [['<a>', ["otag'<a>'{}"], null], ['<a b=c>', ["otag'<a b=c>'{ b: 'c' }"], null], ['<a b=c/>', ["stag'<a b=c/>'{ b: 'c' }"], null], ['<a b=c/', ["ntag'<a b=c/'{ b: 'c' }"], null], ['</a>', ["ctag'</a>'{}"], null], ['<br>', ["otag'<br>'{}"], null], ['<br/>', ["stag'<br/>'{}"], null], ['<i/', ["ntag'<i/'{}"], null], ['<i/>', ["stag'<i/>'{}"], null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, result_rpr, t;
          result = _HTMLISH.parse(probe);
          result_rpr = (function() {
            var j, len1, ref, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              results.push(`${t.type}${rpr(t.text)}${rpr((ref = t.atrs) != null ? ref : {})}`);
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
    var Hypedown_lexer, error, i, len, matcher, probe, probes_and_matchers;
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    probes_and_matchers = [['&amp', "plain:forbidden'&',plain:other'amp',plain:nl'\\n'", null], ['&amp what', "plain:forbidden'&',plain:other'amp what',plain:nl'\\n'", null], ['&amp\n', "plain:forbidden'&',plain:other'amp',plain:nl'\\n',plain:nl'\\n'", null], ['&amp;', "xncr:$border'',xncr:amp'&',xncr:name'amp',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['&amp\\;', "plain:forbidden'&',plain:other'amp',plain:escchr'\\\\;',plain:nl'\\n'", null], ['&amp;\n', "xncr:$border'',xncr:amp'&',xncr:name'amp',xncr:sc';',plain:$border'',plain:nl'\\n',plain:nl'\\n'", null], ['&xamp;', "xncr:$border'',xncr:amp'&',xncr:name'xamp',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['&123;', "xncr:$border'',xncr:amp'&',xncr:name'123',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['&x123;', "xncr:$border'',xncr:amp'&',xncr:name'x123',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['&#123;', "xncr:$border'',xncr:amp'&',xncr:dec'#123',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['&#x123;', "xncr:$border'',xncr:amp'&',xncr:hex'#x123',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['&jzr#123;', "xncr:$border'',xncr:amp'&',xncr:csg'jzr',xncr:dec'#123',xncr:sc';',plain:$border'',plain:nl'\\n'", null], ['some <b/&jzr#x123;&jzr#x124;/ text', "plain:other'some ',tag:$border'',tag:lt'<',tag:text'b',tag:slash'/',plain:$border'',xncr:$border'',xncr:amp'&',xncr:csg'jzr',xncr:hex'#x123',xncr:sc';',plain:$border'',xncr:$border'',xncr:amp'&',xncr:csg'jzr',xncr:hex'#x124',xncr:sc';',plain:$border'',plain:$border'',tag:c_s'/',plain:$border'',plain:ws' ',plain:other'text',plain:nl'\\n'", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, ref, result, result_rpr, t, token;
          lexer = new Hypedown_lexer();
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
              t = result[j];
              results.push(`${t.mk}${rpr(t.value)}`);
            }
            return results;
          })()).join(',');
          // result_rpr = ( "#{t.mk}#{rpr t.value}" for t in result when not t.$stamped ).join ','
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
      return test(this.tags_1);
    })();
  }

  // @tags_2()
// test @tags_2
// test @parse_closing_tags
// @_tags_2_for_profiling()
// test @htmlish_tag_types
// test @xncrs
// test @parse_codespans_and_single_star
// test @parse_md_stars_markup

}).call(this);

//# sourceMappingURL=test-tags.js.map