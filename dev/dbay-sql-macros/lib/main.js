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
    var DBay_sqlx, m;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    urge('^87-1^', m.cfg);
    if (T != null) {
      T.eq(m.cfg.prefix, '@');
    }
    if (T != null) {
      T.eq(type_of(m.cfg.name_re), 'regex');
    }
    if (T != null) {
      T.eq(type_of(m.cfg._bare_name_re), 'regex');
    }
    if (T != null) {
      T.eq(type_of(m.cfg._name_paren_re), 'regex');
    }
    if (T != null) {
      T.eq(type_of(m.cfg._global_name_re), 'regex');
    }
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
      try {
        if (error != null) {
          return T != null ? T.throws(error, function() {
            var e;
            try {
              return m.resolve(probe);
            } catch (error1) {
              e = error1;
              warn(ref, reverse(e.message));
              throw e;
            }
          }) : void 0;
        } else {
          result = m.resolve(probe);
          help(ref, rpr(probe));
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
      m.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 ) as x;`;
      sql = SQL`select power( 3, 2 ) / 2 as x;`;
      return _test('^t#1^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@hoax( @a ) = @a || '@a' || @a;`);
      sqlx = SQL`select @hoax( 'x' ) as hoax;`;
      sql = SQL`select 'x' || ''x'' || 'x' as hoax;`;
      return _test('^t#2^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sql, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@hoax( @a ) = @a || '\\@a' || @a;`);
      sqlx = SQL`select @hoax( 'x' ) as hoax;`;
      sql = SQL`select 'x' || '@a' || 'x' as hoax;`;
      return _test('^t#3^', m, sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var m, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@secret_power( @a, @b ) = @power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 ) as x;`;
      return _test('^t#4^', m, sqlx, null, /xxx/);
    })();
    (function() {      //.........................................................................................................
      var m, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@power( @a, @b ) = ( @a ** @b );`);
      m.declare(SQL`@secret_power( @a, @b ) = ( @power( @a, @b ) / @b );`);
      sqlx = SQL`select @secret_power( @power( 1, 2 ), 3 ) as x;`;
      return _test('^t#4^', m, sqlx, SQL`select ( ( ( 1 ** 2 ) / 2 ) ** 3 / 3 ) as x;`);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_function = function(T, done) {
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
  this.dbay_macros_find_arguments = function(T, done) {
    var DBay_sqlx, _test, db;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    db = new DBay_sqlx();
    _test = function(probe, matcher) {
      var result;
      result = db._find_arguments(probe);
      help('^43-1^', probe);
      urge('^43-1^', result);
      return T != null ? T.eq(result, matcher) : void 0;
    };
    _test(SQL`( 3, 2 )`, ['3', '2']);
    _test(SQL`( 3, f( 2, 4 ) )`, ['3', 'f( 2, 4 )']);
    _test(SQL`( 3, f( 2, @g( 4, 5, 6 ) ) )`, ['3', 'f( 2, @g( 4, 5, 6 ) )']);
    _test(SQL`( 3, 2, "strange,name" )`, ['3', '2', '"strange,name"']);
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
    var DBay_sqlx, m, probe, result;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    m = new DBay_sqlx();
    probe = SQL`select 42 as answer;`;
    help('^12-1^', rpr(result = m.resolve(probe)));
    if (T != null) {
      T.eq(result, SQL`select 42 as answer;`);
    }
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
      return T != null ? T.throws(/unknown macro '@strange_thing'/, function() {
        return m.resolve(probe);
      }) : void 0;
    })();
    (function() {      //.........................................................................................................
      var e, m, sqlx;
      m = new DBay_sqlx();
      m.declare(SQL`@secret_power( @a, @b ) = @power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 ) as x;`;
      debug('^79-1^', (function() {
        try {
          return m.resolve(sqlx);
        } catch (error1) {
          e = error1;
          return warn(reverse(e.message));
        }
      })());
      return T != null ? T.throws(/unknown macro '@power'/, function() {
        return m.resolve(probe);
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_dont_allow_name_reuse_or_recursive_usage = function(T, done) {
    var DBay_sqlx;
    // T?.halt_on_error()
    ({DBay_sqlx} = require('../../../apps/dbay-sql-macros'));
    (function() {
      var e, m;
      m = new DBay_sqlx();
      try {
        m.declare(SQL`@foo_1( @foo_1 ) = whatever;`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      try {
        return m.declare(SQL`@foo_2( @a, @a ) = whatever;`);
      } catch (error1) {
        e = error1;
        return warn(reverse(e.message));
      }
    })();
    (function() {      // T?.throws /found unresolved macros @secret_power, @strange_thing/, -> m.resolve probe
      var e, m;
      m = new DBay_sqlx();
      try {
        m.declare(SQL`@a( @b ) = (a @b );`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      try {
        m.declare(SQL`@b( @a ) = (b @b );`);
      } catch (error1) {
        e = error1;
        warn(reverse(e.message));
      }
      urge('^80-1^', m.resolve("@a( 'b' )"));
      urge('^80-1^', m.resolve("@b( 'a' )"));
      urge('^80-1^', m.resolve("@a( @b( 'a' ) )"));
      return urge('^80-1^', m.resolve("@b( @a( 'b' ) )"));
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
    m.declare(SQL`@declared_without_tx = whatever;`);
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
      m.declare(SQL`@declared_within_tx = whatever;`);
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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @dbay_macros_use_case_virtual_types()
      // test @dbay_macros_use_case_virtual_types
      // @dbay_macros_find_arguments()
      // test @dbay_macros_find_arguments
      // test @dbay_macros_works_without_any_declarations
      return test(this.dbay_macros_regexen);
    })();
  }

  // @dbay_macros_simple_resolution()
// test @dbay_macros_simple_resolution
// @dbay_macros_function()
// test @dbay_macros_function
// @dbay_macros_checks_for_leftovers()
// test @dbay_macros_checks_for_leftovers
// test @

}).call(this);

//# sourceMappingURL=main.js.map