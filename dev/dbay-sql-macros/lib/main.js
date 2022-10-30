(function() {
  'use strict';
  var GUY, PATH, SQL, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, isa, log, plain, praise, reverse, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DBAY-SQL-MACROS/tests'));

  ({rpr, inspect, echo, log, reverse} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  ({SQL} = (require('../../../apps/guy')).str);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_regexen = function(T, done) {
    var DBay_sqlx, m, regexes, rx_for_any_name, rx_for_bare_name, rx_for_parameter_a, rx_for_paren_name, rx_for_start_paren_name, sqlx;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    regexes = require('../../../apps/dbay-sql-macros/lib/regexes');
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.strict.allowed.head), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.strict.allowed.tail), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.strict.forbidden.head), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.strict.forbidden.tail), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.strict.forbidden.paren), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.practical.allowed.head), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.practical.allowed.tail), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.practical.forbidden.head), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.practical.forbidden.tail), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.rx.chrs.practical.forbidden.paren), 'regex');
    }
    if (T != null) {
      T.eq(type_of(regexes.get_rx_for_any_name), 'function');
    }
    if (T != null) {
      T.eq(type_of(regexes.get_rx_for_bare_name), 'function');
    }
    if (T != null) {
      T.eq(type_of(regexes.get_rx_for_paren_name), 'function');
    }
    if (T != null) {
      T.eq(type_of(regexes.get_rx_for_start_paren_name), 'function');
    }
    if (T != null) {
      T.eq(type_of(rx_for_any_name = regexes.get_rx_for_any_name(m.cfg)), 'regex');
    }
    if (T != null) {
      T.eq(type_of(rx_for_bare_name = regexes.get_rx_for_bare_name(m.cfg)), 'regex');
    }
    if (T != null) {
      T.eq(type_of(rx_for_paren_name = regexes.get_rx_for_paren_name(m.cfg)), 'regex');
    }
    if (T != null) {
      T.eq(type_of(rx_for_start_paren_name = regexes.get_rx_for_start_paren_name(m.cfg)), 'regex');
    }
    if (T != null) {
      T.eq(type_of(rx_for_parameter_a = regexes.get_rx_for_parameter(m.cfg, '@a')), 'regex');
    }
    sqlx = "22@foo @bar( baz @what's @that( @辻 oops @程　たたみ() @blah";
    (function() {      //.........................................................................................................
      var i, len, match, result;
      whisper('^49-1^', rx_for_any_name);
      result = (function() {
        var ref1, results;
        ref1 = sqlx.matchAll(rx_for_any_name);
        results = [];
        for (match of ref1) {
          results.push({
            index: match.index,
            name: match[0]
          });
        }
        return results;
      })();
      urge('^49-2^', result);
      for (i = 0, len = result.length; i < len; i++) {
        match = result[i];
        info('^49-3^', match);
      }
      return T != null ? T.eq(result, [
        {
          index: 2,
          name: '@foo'
        },
        {
          index: 7,
          name: '@bar'
        },
        {
          index: 17,
          name: '@what'
        },
        {
          index: 25,
          name: '@that'
        },
        {
          index: 32,
          name: '@辻'
        },
        {
          index: 40,
          name: '@程　たたみ'
        },
        {
          index: 49,
          name: '@blah'
        }
      ]) : void 0;
    })();
    (function() {      //.........................................................................................................
      var i, len, match, result;
      whisper('^49-4^', rx_for_bare_name);
      result = (function() {
        var ref1, results;
        ref1 = sqlx.matchAll(rx_for_bare_name);
        results = [];
        for (match of ref1) {
          results.push({
            index: match.index,
            name: match[0]
          });
        }
        return results;
      })();
      urge('^49-5^', result);
      for (i = 0, len = result.length; i < len; i++) {
        match = result[i];
        info('^49-6^', match);
      }
      return T != null ? T.eq(result, [
        {
          index: 2,
          name: '@foo'
        },
        {
          index: 17,
          name: '@what'
        },
        {
          index: 32,
          name: '@辻'
        },
        {
          index: 49,
          name: '@blah'
        }
      ]) : void 0;
    })();
    (function() {      //.........................................................................................................
      var i, len, match, result;
      whisper('^49-7^', rx_for_parameter_a);
      result = (function() {
        var ref1, results;
        ref1 = "foo@a bar".matchAll(rx_for_parameter_a);
        results = [];
        for (match of ref1) {
          results.push({
            index: match.index,
            name: match[0]
          });
        }
        return results;
      })();
      urge('^49-8^', result);
      for (i = 0, len = result.length; i < len; i++) {
        match = result[i];
        info('^49-9^', match);
      }
      return T != null ? T.eq(result, [
        {
          index: 3,
          name: '@a'
        }
      ]) : void 0;
    })();
    (function() {      //.........................................................................................................
      var i, len, match, result;
      whisper('^49-10^', rx_for_parameter_a);
      result = (function() {
        var ref1, results;
        ref1 = "foo@a%bar".matchAll(rx_for_parameter_a);
        results = [];
        for (match of ref1) {
          results.push({
            index: match.index,
            name: match[0]
          });
        }
        return results;
      })();
      urge('^49-11^', result);
      for (i = 0, len = result.length; i < len; i++) {
        match = result[i];
        info('^49-12^', match);
      }
      return T != null ? T.eq(result, [
        {
          index: 3,
          name: '@a'
        }
      ]) : void 0;
    })();
    (function() {      //.........................................................................................................
      var i, len, match, result;
      whisper('^49-13^', rx_for_paren_name);
      result = (function() {
        var ref1, results;
        ref1 = sqlx.matchAll(rx_for_paren_name);
        results = [];
        for (match of ref1) {
          results.push({
            index: match.index,
            name: match[0]
          });
        }
        return results;
      })();
      urge('^49-14^', result);
      for (i = 0, len = result.length; i < len; i++) {
        match = result[i];
        info('^49-15^', match);
      }
      return T != null ? T.eq(result, [
        {
          index: 7,
          name: '@bar'
        },
        {
          index: 25,
          name: '@that'
        },
        {
          index: 40,
          name: '@程　たたみ'
        }
      ]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_declarations = function(T, done) {
    var DBay_sqlx;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    (function() {      //.........................................................................................................
      var k, m, ref1, ref2;
      m = new DBay_sqlx();
      m.declare(`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
      if (T != null) {
        T.eq((function() {
          var results;
          results = [];
          for (k in m._declarations) {
            results.push(k);
          }
          return results;
        })(), ['@secret_power']);
      }
      if (T != null) {
        T.eq((ref1 = m._declarations['@secret_power']) != null ? ref1.body : void 0, `power( @a, @b ) / @b`);
      }
      return T != null ? T.eq((ref2 = m._declarations['@secret_power']) != null ? ref2.parameters : void 0, ['@a', '@b']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_simple_resolution = function(T, done) {
    var DBay_sqlx, _test;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    //.........................................................................................................
    _test = function(ref, m, probe, matcher, error) {
      var result;
      help(ref, rpr(probe));
      try {
        if (error != null) {
          if (T != null) {
            T.throws(error, function() {
              var e, result;
              try {
                return result = m.resolve(probe);
              } catch (error1) {
                e = error1;
                warn(ref, reverse(e.message));
                throw e;
              }
            });
          }
          return warn(ref, rpr(result));
        } else {
          result = m.resolve(probe);
          if (result === matcher) {
            info(ref, rpr(result));
          } else {
            warn(ref, rpr(result));
          }
          return T != null ? T.eq(result, matcher) : void 0;
        }
      } catch (error1) {
        error = error1;
        return T != null ? T.eq(`ERROR ${ref}`, `${error.message}\n${rpr(probe)}`) : void 0;
      }
    };
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@power( @a, @b ) = ( /* power */ @a ** @b );`);
      sqlx = SQL`select @power( 3, 2 ) as x;`;
      sql = SQL`select ( /* power */ 3 ** 2 ) as x;`;
      return _test('^t#1^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 ) as x;`;
      sql = SQL`select power( 3, 2 ) / 2 as x;`;
      return _test('^t#2^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@hoax( @a ) = @a || '@a' || @a;`);
      sqlx = SQL`select @hoax( 'x' ) as hoax;`;
      sql = SQL`select 'x' || ''x'' || 'x' as hoax;`;
      return _test('^t#3^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@hoax( @a ) = @a || '%@a' || @a;`);
      sqlx = SQL`select %@hoax( 'x' ) as hoax;`;
      sql = SQL`select @hoax( 'x' ) as hoax;`;
      return _test('^t#4^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@hoax( @a ) = @a || '%@a' || @a;`);
      sqlx = SQL`select @hoax( 'x' ) as hoax;`;
      sql = SQL`select 'x' || '@a' || 'x' as hoax;`;
      return _test('^t#4^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx({
        escape: '\\'
      });
      m.declare(SQL`@hoax( @a ) = @a || '\\@a' || @a;`);
      sqlx = SQL`select @hoax( 'x' ) as hoax;`;
      sql = SQL`select 'x' || '@a' || 'x' as hoax;`;
      return _test('^t#4^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@secret_power( @a, @b ) = @power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 ) as x;`;
      return _test('^t#5^', m, sqlx, null, /unknown macro '@power'/);
    })();
    (function() {      //.........................................................................................................
      var m, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@add(     @a, @b ) = /*\\add*/( @a + @b );`);
      m.declare(SQL`@power(   @a, @b ) = /*\\power*/( @a ** @b );`);
      m.declare(SQL`@secret(  @a, @b ) = /*\\secret*/( @power( @a, @b ) / @b );`);
      sqlx = SQL`select @secret( @add( 1, 2 ), 3 ) as x;`;
      // _test '^t#6^', m, sqlx, SQL"""select /*@secret*/( /*@power*/( /*@add*/( 1 + 2 ) ** 3 ) / 3 ) as x;"""
      return m.resolve(sqlx);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_more_resolutions = function(T, done) {
    var DBay_sqlx, _test, db;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
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
  this.dbay_macros_find_arguments = function(T, done) {
    var DBay_sqlx, _test, db;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    db = new DBay_sqlx();
    _test = function(probe, matcher) {
      var result;
      result = db._find_arguments(probe);
      // help '^43-1^', probe
      urge('^43-1^', result);
      return T != null ? T.eq(result, matcher) : void 0;
    };
    _test(SQL`( 3, 2 )`, {
      values: ['3', '2'],
      stop_idx: 8
    });
    _test(SQL`( 3, f( 2, 4 ) )`, {
      values: ['3', 'f( 2, 4 )'],
      stop_idx: 16
    });
    _test(SQL`( 3, f( 2, @g( 4, 5, 6 ) ) )`, {
      values: ['3', 'f( 2, @g( 4, 5, 6 ) )'],
      stop_idx: 28
    });
    _test(SQL`( 3, 2, "strange,name" )`, {
      values: ['3', '2', '"strange,name"'],
      stop_idx: 24
    });
    _test(SQL`(           )`, {
      values: [],
      stop_idx: 13
    });
    _test(SQL`()`, {
      values: [],
      stop_idx: 2
    });
    _test(SQL`( @power( 1, 2 ), 3 ) as x;`, {
      values: ['@power( 1, 2 )', '3'],
      stop_idx: 21
    });
    _test(SQL`( @power( 1, @f( 2, 3, @g( 4 ) ) ), 5 ) as x;`, {
      values: ['@power( 1, @f( 2, 3, @g( 4 ) ) )', '5'],
      stop_idx: 39
    });
    _test(SQL`( /*@add*/( 1 + 2 ), 3 ) / 3 )`, {
      values: ['/*@add*/( 1 + 2 )', '3'],
      stop_idx: 24
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_parameter_name_clashes = function(T, done) {
    var DBay_sqlx, db;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    db = new DBay_sqlx();
    //.........................................................................................................
    db.declare(SQL`@add( @a, @b ) = ( @a + @b );`);
    db.declare(SQL`@程( @a, @b ) = ( @a * @b );`);
    db.declare(SQL`@程_2( @a, @b ) = ( @a * @b );`);
    db.declare(SQL`@mul( @a, @b ) = ( @a * @b );`);
    db.declare(SQL`@frob( @a, @b ) = ( @add( @a * @b, @mul( @a, @b ) ) );`);
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @add( @mul( @add( 1, 2 ), 3 ), @add( 4, @mul( 5, 6 ) ) ) as p;`;
      matcher = SQL`select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;`;
      result = db.resolve(probe);
      help('^5345^', rpr(result));
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @add( @程( @add( 1, 2 ), 3 ), @add( 4, @程( 5, 6 ) ) ) as p;`;
      matcher = SQL`select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;`;
      result = db.resolve(probe);
      help('^5345^', rpr(result));
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @add( @程_2( @add( 1, 2 ), 3 ), @add( 4, @程_2( 5, 6 ) ) ) as p;`;
      matcher = SQL`select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;`;
      result = db.resolve(probe);
      help('^5345^', rpr(result));
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @frob( 1, 2 ) as q;`;
      matcher = SQL`select ( ( 1 * 2 + ( 1 * 2 ) ) ) as q;`;
      result = db.resolve(probe);
      help('^5345^', rpr(result));
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_works_without_any_declarations = function(T, done) {
    var DBay_sqlx, m;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    (function() {      //.........................................................................................................
      var probe, result;
      probe = SQL`select 42 as answer;`;
      help('^12-1^', rpr(result = m.resolve(probe)));
      return T != null ? T.eq(result, SQL`select 42 as answer;`) : void 0;
    })();
    (function() {      //.........................................................................................................
      var probe, result;
      probe = SQL`select
42
as
answer;`;
      help('^12-1^', rpr(result = m.resolve(probe)));
      return T != null ? T.eq(result, SQL`select
42
as
answer;`) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_works_without_any_matching_declarations = function(T, done) {
    var DBay_sqlx, m;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    m.declare(SQL`@add( @a, @b ) = ( @a + @b );`);
    (function() {      //.........................................................................................................
      var probe, result;
      probe = SQL`select 42 as answer;`;
      help('^12-1^', rpr(result = m.resolve(probe)));
      return T != null ? T.eq(result, SQL`select 42 as answer;`) : void 0;
    })();
    (function() {      //.........................................................................................................
      var probe, result;
      probe = SQL`select
42
as
answer;`;
      help('^12-1^', rpr(result = m.resolve(probe)));
      return T != null ? T.eq(result, SQL`select
42
as
answer;`) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_checks_for_leftovers = function(T, done) {
    var DBay_sqlx;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    (function() {      //.........................................................................................................
      var e, m, probe;
      m = new DBay_sqlx();
      probe = SQL`select
  @strange_thing()      as c1,
  @secret_power( 3, 2 ) as c2,
  @strange_thing        as c3;`;
      debug('^79-1^', (function() {
        try {
          return m.resolve(probe);
        } catch (error1) {
          e = error1;
          return warn(reverse(e.message));
        }
      })());
      try {
        m.resolve(probe);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return T != null ? T.throws(/unknown macro '@strange_thing'/, function() {
        return m.resolve(probe);
      }) : void 0;
    })();
    (function() {      //.........................................................................................................
      var e, m, probe;
      m = new DBay_sqlx();
      m.declare(SQL`@secret_power( @a, @b ) = @power( @a, @b ) / @b;`);
      probe = SQL`select @secret_power( 3, 2 ) as x;`;
      debug('^79-1^', (function() {
        try {
          return m.resolve(probe);
        } catch (error1) {
          e = error1;
          return warn(reverse(e.message));
        }
      })());
      try {
        m.resolve(probe);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return T != null ? T.throws(/unknown macro '@power'/, function() {
        return m.resolve(probe);
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_dont_allow_undeclared_parameters = function(T, done) {
    var DBay_sqlx, probe;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    probe = SQL`@macro( @parameter ) = ( @parameter * @undeclared + @invented );`;
    (function() {      //.........................................................................................................
      var e, m;
      m = new DBay_sqlx();
      try {
        m.declare(probe);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var m;
      m = new DBay_sqlx();
      if (T != null) {
        T.throws(/unknown parameters '@undeclared', '@invented'/, function() {
          return m.declare(probe);
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_dont_allow_reduplicated_parameters = function(T, done) {
    var DBay_sqlx, probe;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    probe = SQL`@macro( @a, @parameter, @a, @parameter, @b ) = whatever;`;
    (function() {      //.........................................................................................................
      var e, m;
      m = new DBay_sqlx();
      try {
        m.declare(probe);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var m;
      m = new DBay_sqlx();
      if (T != null) {
        T.throws(/duplicate parameters '@a', '@parameter'/, function() {
          return m.declare(probe);
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_dont_allow_unprefixed_parameters = function(T, done) {
    var DBay_sqlx, probe;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    probe = SQL`@macro( @a, naked, @b ) = whatever;`;
    (function() {      //.........................................................................................................
      var e, m;
      m = new DBay_sqlx();
      try {
        m.declare(probe);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var m;
      m = new DBay_sqlx();
      if (T != null) {
        T.throws(/syntax error in parameters of declaration/, function() {
          return m.declare(probe);
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_allow_name_reuse_between_macros_and_parameters = function(T, done) {
    var DBay_sqlx;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    (function() {
      var e, m, result;
      m = new DBay_sqlx();
      try {
        m.declare(SQL`@foo_1( @foo_1 ) = ( @foo_1 * @foo_1 );`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      result = m.resolve(SQL`select @foo_1( 42 );`);
      urge('^80-1^', rpr(result));
      return T != null ? T.eq(result, SQL`select ( 42 * 42 );`) : void 0;
    })();
    (function() {
      var e, m;
      m = new DBay_sqlx();
      try {
        m.declare(SQL`@a( @b ) = (a @b );`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      try {
        m.declare(SQL`@b( @a ) = (b @a );`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      if (T != null) {
        T.eq(m.resolve("@a( 'b' )"), SQL`(a 'b' )`);
      }
      if (T != null) {
        T.eq(m.resolve("@b( 'a' )"), SQL`(b 'a' )`);
      }
      if (T != null) {
        T.eq(m.resolve("@a( @b( 'a' ) )"), SQL`(a (b 'a' ) )`);
      }
      return T != null ? T.eq(m.resolve("@b( @a( 'b' ) )"), SQL`(b (a 'b' ) )`) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_dont_allow_circular_references = function(T, done) {
    var DBay_sqlx;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    (function() {      //.........................................................................................................
      var e, m, probe;
      probe = SQL`@recursive( @x ) = ( @recursive( @x ) + @recursive( @x ) );`;
      m = new DBay_sqlx();
      try {
        m.declare(probe);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return T != null ? T.throws(/detected circular references/, function() {
        return m.declare(probe);
      }) : void 0;
    })();
    (function() {      //.........................................................................................................
      var e, m;
      m = new DBay_sqlx();
      m.declare(SQL`@f( @x ) = ( @g( @x ) + @h( @x ) );`);
      m.declare(SQL`@g( @x ) = sin( @x );`);
      m.declare(SQL`@h( @x ) = cos( @x ) / @k( @x );`);
      help('^5345^', rpr((require('ltsort')).group(m._topograph)));
      try {
        m.declare(SQL`@k( @x ) = @f( @x ) * @g( @x );`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      return T != null ? T.throws(/detected circular references/, function() {
        return m.declare(SQL`@k( @x ) = @f( @x ) * @g( @x );`);
      }) : void 0;
    })();
    (function() {      //.........................................................................................................
      var m, matcher, probe, result;
      m = new DBay_sqlx();
      m.declare(SQL`@add( @a, @b ) = ( @a + @b );`);
      m.declare(SQL`@mul( @a, @b ) = ( @a * @b );`);
      probe = SQL`select @add( @mul( @add( 1, 2 ), 3 ), @add( 4, @mul( 5, 6 ) ) ) as p;`;
      matcher = SQL`select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;`;
      result = m.resolve(probe);
      help('^5345^', rpr(result));
      if (T != null) {
        T.eq(result, matcher);
      }
      return help('^5345^', rpr((require('ltsort')).group(m._topograph)));
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_use_case_virtual_types = function(T, done) {
    /* NOTE using a 'generic' DB connection w/out implicit macro handling */
    var DBay, DBay_sqlx, db, m;
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    ({DBay} = require('../../../apps/dbay'));
    m = new DBay_sqlx();
    db = new DBay({
      macros: false
    });
    //.........................................................................................................
    m.declare(SQL`@id( @name )    = @name text    check ( @name regexp '^[a-z]{3}-[0-9]{2}' )`);
    m.declare(SQL`@month( @name ) = @name integer check ( @name between 1 and 12 )`);
    // debug '^14-1^', d for _, d of m._declarations
    db(function() {
      var sql;
      sql = m.resolve(SQL`create table bookings (
  @id( "booking_id" ),
  @month( "booking_period" )
  );`);
      if (T != null) {
        T.eq(sql, SQL`create table bookings (
  "booking_id" text    check ( "booking_id" regexp '^[a-z]{3}-[0-9]{2}' ),
  "booking_period" integer check ( "booking_period" between 1 and 12 )
  );`);
      }
      urge('^34-1^', sql);
      // db sql
      db.rollback_transaction();
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_declarations_undone_on_rollback_or_not = function(T, done) {
    /* NOTE using a 'generic' DB connection w/out implicit macro handling */
    var DBay, DBay_sqlx, db, key, m;
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    ({DBay} = require('../../../apps/dbay'));
    m = new DBay_sqlx();
    db = new DBay({
      macros: false
    });
    //.........................................................................................................
    m.declare(SQL`@declared_without_tx() = whatever;`);
    if (T != null) {
      T.eq((function() {
        var results;
        results = [];
        for (key in m._declarations) {
          results.push(key);
        }
        return results;
      })(), ['@declared_without_tx']);
    }
    db(function() {
      m.declare(SQL`@declared_within_tx() = whatever;`);
      if (T != null) {
        T.eq((function() {
          var results;
          results = [];
          for (key in m._declarations) {
            results.push(key);
          }
          return results;
        })(), ['@declared_without_tx', '@declared_within_tx']);
      }
      db.rollback_transaction();
      return null;
    });
    /* current behavior: */
    if (T != null) {
      T.eq((function() {
        var results;
        results = [];
        for (key in m._declarations) {
          results.push(key);
        }
        return results;
      })(), ['@declared_without_tx', '@declared_within_tx']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._dbay_macros_demo_legal_chrs_in_identifiers = function(T, done) {
    var DBay, db;
    ({DBay} = require('../../../apps/dbay'));
    db = new DBay();
    //.........................................................................................................
    db(function() {
      var chr, cid, cid_hex, error, i, name, row, rows;
      for (cid = i = 0x0000; i <= 65535; cid = ++i) {
        cid_hex = '0x' + (cid.toString(16)).padStart(4, '0');
        chr = String.fromCodePoint(cid);
        name = `${chr}x`;
        try {
          // name  = "x#{chr}x"
          rows = (function() {
            var ref1, results;
            ref1 = db(SQL`select 42 as ${name};`);
            results = [];
            for (row of ref1) {
              results.push(row);
            }
            return results;
          })();
        } catch (error1) {
          // debug '^434^', cid_hex, rows[ 0 ]
          error = error1;
          warn(cid_hex, GUY.trm.reverse(error.message));
        }
      }
      return debug('^645^', cid_hex);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_use_escape_as_terminator = function(T, done) {
    var DBay_sqlx, m;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    m.declare(SQL`@mymacro( @a ) = FOO@a%BAR;`);
    m.declare(SQL`@othermacro( @a ) = FOO@a%%BAR;`);
    (function() {      //.........................................................................................................
      var result, sqlx;
      sqlx = "@mymacro( value_of_a )";
      result = m.resolve(sqlx);
      urge('^50-8^', result);
      return T != null ? T.eq(result, "FOOvalue_of_aBAR") : void 0;
    })();
    (function() {      //.........................................................................................................
      var result, sqlx;
      sqlx = "@othermacro( value_of_a )";
      result = m.resolve(sqlx);
      urge('^50-8^', result);
      return T != null ? T.eq(result, "FOOvalue_of_a%BAR") : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbm_replace_escape = function(T, done) {
    var DBay_sqlx, m, sqlx;
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    sqlx = SQL`foo %bar() baz 0% 1%% 1%%% 2%%%% 2%%%%% 3%%%%%% 3%%%%%%% 4%%%%%%%%`;
    if (T != null) {
      T.eq(m.resolve(sqlx), "foo bar() baz 0 1% 1% 2%% 2%% 3%%% 3%%% 4%%%%");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @dbay_macros_use_case_virtual_types()
      // test @dbay_macros_use_case_virtual_types
      // @dbay_macros_find_arguments()
      // test @dbay_macros_find_arguments
      // test @dbay_macros_works_without_any_declarations
      // @_dbay_macros_demo_legal_chrs_in_identifiers()
      // @dbay_macros_regexen()
      // test @dbay_macros_regexen
      // test @dbay_macros_declarations
      // @dbay_macros_simple_resolution()
      // test @dbay_macros_simple_resolution
      // @dbay_macros_more_resolutions()
      // test @dbay_macros_more_resolutions
      // @dbay_macros_checks_for_leftovers()
      // test @dbay_macros_checks_for_leftovers
      // @dbay_use_escape_as_terminator()
      // test @dbay_use_escape_as_terminator
      // @dbay_macros_dont_allow_circular_references()
      // test @dbay_macros_dont_allow_circular_references
      // @dbay_macros_dont_allow_undeclared_parameters()
      // test @dbay_macros_dont_allow_undeclared_parameters
      // @dbay_macros_dont_allow_reduplicated_parameters()
      // test @dbay_macros_dont_allow_reduplicated_parameters
      // @dbay_macros_dont_allow_unprefixed_parameters()
      // test @dbay_macros_dont_allow_unprefixed_parameters
      // @dbay_macros_declarations_undone_on_rollback_or_not()
      // test @dbay_macros_declarations_undone_on_rollback_or_not
      // @dbm_replace_escape()
      // test @dbm_replace_escape
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map