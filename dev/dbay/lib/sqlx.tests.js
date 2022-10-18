(function() {
  'use strict';
  var E, GUY, H, PATH, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, isa, log, new_xregex, plain, praise, r, rpr, sql_lexer, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DBAY/sqlx'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  // X                         = require '../../../lib/helpers'
  r = String.raw;

  new_xregex = require('xregexp');

  E = require('../../../apps/dbay/lib/errors');

  equals = (require('util')).isDeepStrictEqual;

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  sql_lexer = require('../../../apps/dbay-sql-lexer');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sqlx_function = function(T, done) {
    var DBay, SQL, _test, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay_sqlx();
    //.........................................................................................................
    _test = function(probe, matcher) {
      var error, sql, sqlx;
      try {
        sqlx = probe;
        sql = db.resolve(sqlx);
        help(rpr(sqlx));
        info(rpr(sql));
        return T != null ? T.eq(sql, matcher) : void 0;
      } catch (error1) {
        error = error1;
        return T != null ? T.eq("ERROR", `${error.message}\n${rpr(probe)}`) : void 0;
      }
    };
    //.........................................................................................................
    db.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
    db.declare(SQL`@max( @a, @b ) = case when @a > @b then @a else @b end;`);
    db.declare(SQL`@concat( @first, @second ) = @first || @second;`);
    db.declare(SQL`@intnn() = integer not null;`);
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @secret_power( 3, 2 );`;
      sql = SQL`select power( 3, 2 ) / 2;`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @max( 3, 2 ) as the_bigger_the_better;`;
      sql = SQL`select case when 3 > 2 then 3 else 2 end as the_bigger_the_better;`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( 'here', '\\)' );`;
      sql = SQL`select 'here' || '\\)';`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`create table numbers (
  n @intnn() primary key );`;
      sql = SQL`create table numbers (
  n integer not null primary key );`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`create table numbers (
  n @intnn primary key );`;
      sql = SQL`create table numbers (
  n integer not null primary key );`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( 'a', 'b' ) as c1, @concat( 'c', 'd' ) as c2;`;
      sql = SQL`select 'a' || 'b' as c1, 'c' || 'd' as c2;`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( 'a', @concat( 'c', 'd' ) );`;
      sql = SQL`select 'a' || 'c' || 'd';`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( ',', @concat( ',', ',' ) );`;
      sql = SQL`select ',' || ',' || ',';`;
      return _test(sqlx, sql);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sqlx_find_arguments = function(T, done) {
    var DBay, SQL, _test, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay_sqlx();
    _test = function(probe, matcher) {
      var result;
      result = db._find_arguments(probe);
      help('^43-1^', probe);
      urge('^43-1^', result);
      return T != null ? T.eq(result, matcher) : void 0;
    };
    _test(SQL` 3, 2 `, ['3', '2']);
    _test(SQL` 3, f( 2, 4 ) `, ['3', 'f( 2, 4 )']);
    _test(SQL` 3, f( 2, @g( 4, 5, 6 ) ) `, ['3', 'f( 2, @g( 4, 5, 6 ) )']);
    _test(SQL` 3, 2, "strange,name" `, ['3', '2', '"strange,name"']);
    _test(SQL`           `, []);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sql_lexer = async function(T, done) {
    var DBay, SQL, error, i, j, k, len, len1, lexer, matcher, probe, probes_and_matchers, ref, show;
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    lexer = require('../../../../dbay-sql-lexer');
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

//# sourceMappingURL=sqlx.tests.js.map