(function() {
  'use strict';
  var DBay, GUY, PATH, SQL, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, isa, log, plain, praise, r, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DBAY-SQL-LEXER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  // X                         = require '../../../lib/helpers'
  r = String.raw;

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sql_lexer = async function(T, done) {
    var error, i, j, k, len, len1, lexer, matcher, probe, probes_and_matchers, ref, show;
    lexer = require('../../../apps/dbay-sql-lexer');
    ref = (GUY.props.keys(lexer)).sort();
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      info(k);
    }
    //.........................................................................................................
    show = function(sql, tokens) {
      info(rpr(sql));
      echo(dtab._tabulate(tokens));
      return null;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        SQL`select * from my_table`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'star',
            text: '*',
            idx: 7
          },
          {
            type: 'from',
            text: 'from',
            idx: 9
          },
          {
            type: 'identifier',
            text: 'my_table',
            idx: 14
          }
        ],
        null
      ],
      [
        SQL`select a from my_table`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'identifier',
            text: 'a',
            idx: 7
          },
          {
            type: 'from',
            text: 'from',
            idx: 9
          },
          {
            type: 'identifier',
            text: 'my_table',
            idx: 14
          }
        ],
        null
      ],
      [
        SQL`select 阿 from my_table`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'identifier',
            text: '阿',
            idx: 7
          },
          {
            type: 'from',
            text: 'from',
            idx: 9
          },
          {
            type: 'identifier',
            text: 'my_table',
            idx: 14
          }
        ],
        null
      ],
      [
        SQL`select '阿' as c$`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'string',
            text: '阿',
            idx: 7
          },
          {
            type: 'as',
            text: 'as',
            idx: 11
          },
          {
            type: 'identifier',
            text: 'c$',
            idx: 14
          }
        ],
        null
      ],
      [
        SQL`42`,
        [
          {
            type: 'number',
            text: '42',
            idx: 0
          }
        ],
        null
      ],
      [
        SQL`( 'text', 'another''text', 42 )`,
        [
          {
            type: 'left_paren',
            text: '(',
            idx: 0
          },
          {
            type: 'string',
            text: 'text',
            idx: 2
          },
          {
            type: 'comma',
            text: ',',
            idx: 8
          },
          {
            type: 'string',
            text: "another'text",
            idx: 10
          },
          {
            type: 'comma',
            text: ',',
            idx: 25
          },
          {
            type: 'number',
            text: '42',
            idx: 27
          },
          {
            type: 'right_paren',
            text: ')',
            idx: 30
          }
        ],
        null
      ],
      [
        SQL`( 'text', @f( 1, 2, 3 ), 42 )`,
        [
          {
            type: 'left_paren',
            text: '(',
            idx: 0
          },
          {
            type: 'string',
            text: 'text',
            idx: 2
          },
          {
            type: 'comma',
            text: ',',
            idx: 8
          },
          {
            type: 'unknown',
            text: '@',
            idx: 10
          },
          {
            type: 'identifier',
            text: 'f',
            idx: 11
          },
          {
            type: 'left_paren',
            text: '(',
            idx: 12
          },
          {
            type: 'number',
            text: '1',
            idx: 14
          },
          {
            type: 'comma',
            text: ',',
            idx: 15
          },
          {
            type: 'number',
            text: '2',
            idx: 17
          },
          {
            type: 'comma',
            text: ',',
            idx: 18
          },
          {
            type: 'number',
            text: '3',
            idx: 20
          },
          {
            type: 'right_paren',
            text: ')',
            idx: 22
          },
          {
            type: 'comma',
            text: ',',
            idx: 23
          },
          {
            type: 'number',
            text: '42',
            idx: 25
          },
          {
            type: 'right_paren',
            text: ')',
            idx: 28
          }
        ],
        null
      ],
      [
        SQL`SELECT 42 as c;`,
        [
          {
            type: 'select',
            text: 'SELECT',
            idx: 0
          },
          {
            type: 'number',
            text: '42',
            idx: 7
          },
          {
            type: 'as',
            text: 'as',
            idx: 10
          },
          {
            type: 'identifier',
            text: 'c',
            idx: 13
          },
          {
            type: 'semicolon',
            text: ';',
            idx: 14
          }
        ],
        null
      ],
      [
        SQL`select 'helo', 'world''';`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'string',
            text: 'helo',
            idx: 7
          },
          {
            type: 'comma',
            text: ',',
            idx: 13
          },
          {
            type: 'string',
            text: "world'",
            idx: 15
          },
          {
            type: 'semicolon',
            text: ';',
            idx: 24
          }
        ],
        null
      ],
      [
        SQL`select 'helo', 'world'''`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'string',
            text: 'helo',
            idx: 7
          },
          {
            type: 'comma',
            text: ',',
            idx: 13
          },
          {
            type: 'string',
            text: "world'",
            idx: 15
          }
        ],
        null
      ],
      [
        SQL`this is any text $%§'§`,
        [
          {
            type: 'identifier',
            text: 'this',
            idx: 0
          },
          {
            type: 'operator',
            text: 'is',
            idx: 5
          },
          {
            type: 'sub_select_op',
            text: 'any',
            idx: 8
          },
          {
            type: 'identifier',
            text: 'text',
            idx: 12
          },
          {
            type: 'unknown',
            text: '$',
            idx: 17
          },
          {
            type: 'unknown',
            text: '%',
            idx: 18
          },
          {
            type: 'unknown',
            text: '§',
            idx: 19
          },
          {
            type: 'unknown',
            text: "'",
            idx: 20
          },
          {
            type: 'unknown',
            text: '§',
            idx: 21
          }
        ],
        null
      ],
      [
        SQL`'a' "b" [c] \`d\` {e}`,
        [
          {
            type: 'string',
            text: 'a',
            idx: 0
          },
          {
            type: 'quoted_identifier',
            text: 'b',
            idx: 4
          },
          {
            type: 'unknown',
            text: '[',
            idx: 8
          },
          {
            type: 'identifier',
            text: 'c',
            idx: 9
          },
          {
            type: 'unknown',
            text: ']',
            idx: 10
          },
          {
            type: 'identifier',
            text: 'd',
            idx: 12
          },
          {
            type: 'unknown',
            text: '{',
            idx: 16
          },
          {
            type: 'identifier',
            text: 'e',
            idx: 17
          },
          {
            type: 'unknown',
            text: '}',
            idx: 18
          }
        ],
        null
      ],
      [
        SQL`select * from t where t.a between 0 and 1;`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'star',
            text: '*',
            idx: 7
          },
          {
            type: 'from',
            text: 'from',
            idx: 9
          },
          {
            type: 'identifier',
            text: 't',
            idx: 14
          },
          {
            type: 'where',
            text: 'where',
            idx: 16
          },
          {
            type: 'identifier',
            text: 't',
            idx: 22
          },
          {
            type: 'dot',
            text: '.',
            idx: 23
          },
          {
            type: 'identifier',
            text: 'a',
            idx: 24
          },
          {
            type: 'between',
            text: 'between',
            idx: 26
          },
          {
            type: 'number',
            text: '0',
            idx: 34
          },
          {
            type: 'conditional',
            text: 'and',
            idx: 36
          },
          {
            type: 'number',
            text: '1',
            idx: 40
          },
          {
            type: 'semicolon',
            text: ';',
            idx: 41
          }
        ],
        null
      ],
      [
        SQL`select * from t where t.a not between 0 and 1;`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'star',
            text: '*',
            idx: 7
          },
          {
            type: 'from',
            text: 'from',
            idx: 9
          },
          {
            type: 'identifier',
            text: 't',
            idx: 14
          },
          {
            type: 'where',
            text: 'where',
            idx: 16
          },
          {
            type: 'identifier',
            text: 't',
            idx: 22
          },
          {
            type: 'dot',
            text: '.',
            idx: 23
          },
          {
            type: 'identifier',
            text: 'a',
            idx: 24
          },
          {
            type: 'not',
            text: 'not',
            idx: 26
          },
          {
            type: 'between',
            text: 'between',
            idx: 30
          },
          {
            type: 'number',
            text: '0',
            idx: 38
          },
          {
            type: 'conditional',
            text: 'and',
            idx: 40
          },
          {
            type: 'number',
            text: '1',
            idx: 44
          },
          {
            type: 'semicolon',
            text: ';',
            idx: 45
          }
        ],
        null
      ],
      [
        SQL`select * from t where t.a not      between 0 and 1;`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'star',
            text: '*',
            idx: 7
          },
          {
            type: 'from',
            text: 'from',
            idx: 9
          },
          {
            type: 'identifier',
            text: 't',
            idx: 14
          },
          {
            type: 'where',
            text: 'where',
            idx: 16
          },
          {
            type: 'identifier',
            text: 't',
            idx: 22
          },
          {
            type: 'dot',
            text: '.',
            idx: 23
          },
          {
            type: 'identifier',
            text: 'a',
            idx: 24
          },
          {
            type: 'not',
            text: 'not',
            idx: 26
          },
          {
            type: 'between',
            text: 'between',
            idx: 35
          },
          {
            type: 'number',
            text: '0',
            idx: 43
          },
          {
            type: 'conditional',
            text: 'and',
            idx: 45
          },
          {
            type: 'number',
            text: '1',
            idx: 49
          },
          {
            type: 'semicolon',
            text: ';',
            idx: 50
          }
        ],
        null
      ],
      [
        SQL`a not in ( 'a', 'b', )`,
        [
          {
            type: 'identifier',
            text: 'a',
            idx: 0
          },
          {
            type: 'not',
            text: 'not',
            idx: 2
          },
          {
            type: 'sub_select_op',
            text: 'in',
            idx: 6
          },
          {
            type: 'left_paren',
            text: '(',
            idx: 9
          },
          {
            type: 'string',
            text: 'a',
            idx: 11
          },
          {
            type: 'comma',
            text: ',',
            idx: 14
          },
          {
            type: 'string',
            text: 'b',
            idx: 16
          },
          {
            type: 'comma',
            text: ',',
            idx: 19
          },
          {
            type: 'right_paren',
            text: ')',
            idx: 21
          }
        ],
        null
      ],
      [
        SQL`select avg( x )`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'identifier',
            text: 'avg',
            idx: 7
          },
          {
            type: 'left_paren',
            text: '(',
            idx: 10
          },
          {
            type: 'identifier',
            text: 'x',
            idx: 12
          },
          {
            type: 'right_paren',
            text: ')',
            idx: 14
          }
        ],
        null
      ],
      [
        SQL`select f( x )`,
        [
          {
            type: 'select',
            text: 'select',
            idx: 0
          },
          {
            type: 'identifier',
            text: 'f',
            idx: 7
          },
          {
            type: 'left_paren',
            text: '(',
            idx: 8
          },
          {
            type: 'identifier',
            text: 'x',
            idx: 10
          },
          {
            type: 'right_paren',
            text: ')',
            idx: 12
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (j = 0, len1 = probes_and_matchers.length; j < len1; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = lexer.tokenize(probe);
          show(probe, result);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // @dbay_sql_lexer()
// @dbay_sqlx_find_arguments()
// test @dbay_sqlx_find_arguments
// @dbay_sqlx_function()
// test @dbay_sqlx_function

}).call(this);

//# sourceMappingURL=basic.tests.js.map