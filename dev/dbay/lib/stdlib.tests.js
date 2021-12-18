(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, r, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/STDLIB';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  r = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY stdlib functions"] = function(T, done) {
    var DBay, db, test_and_show;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    //.........................................................................................................
    db = new DBay();
    db.create_stdlib();
    //.........................................................................................................
    test_and_show = (probe, matcher) => {
      var result;
      urge('^341-1', probe);
      info('^341-2', result = db.all_rows(probe));
      if (T != null) {
        T.eq(result, matcher);
      }
      return null;
    };
    //.........................................................................................................
    test_and_show(SQL`select std_str_reverse( 'abc一無所有𫠣' ) as x;`, [
      {
        x: '𫠣有所無一cba'
      }
    ]);
    test_and_show(SQL`select std_str_join( '-', '1', '1', '1', '1', '1', '1'  ) as x;`, [
      {
        "x": '1-1-1-1-1-1'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_first( 'foo/bar/baz', '/' ) as x;`, [
      {
        prefix: 'foo',
        suffix: 'bar/baz'
      }
    ]);
    test_and_show(SQL`select * from std_str_split( '/foo/bar/baz', '/' ) as x;`, [
      {
        lnr: 1,
        rnr: 4,
        part: ''
      },
      {
        lnr: 2,
        rnr: 3,
        part: 'foo'
      },
      {
        lnr: 3,
        rnr: 2,
        part: 'bar'
      },
      {
        lnr: 4,
        rnr: 1,
        part: 'baz'
      }
    ]);
    test_and_show(SQL`select * from std_str_split( '/foo/bar/baz', '/', true ) as x;`, [
      {
        lnr: 1,
        rnr: 3,
        part: 'foo'
      },
      {
        lnr: 2,
        rnr: 2,
        part: 'bar'
      },
      {
        lnr: 3,
        rnr: 1,
        part: 'baz'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '[aeiou]' ) as x;`, [
      {
        lnr: 1,
        rnr: 6,
        part: ''
      },
      {
        lnr: 2,
        rnr: 5,
        part: 'n'
      },
      {
        lnr: 3,
        rnr: 4,
        part: 'n'
      },
      {
        lnr: 4,
        rnr: 3,
        part: 'm'
      },
      {
        lnr: 5,
        rnr: 2,
        part: ''
      },
      {
        lnr: 6,
        rnr: 1,
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '[aeiou]', 'i', true ) as x;`, [
      {
        lnr: 1,
        rnr: 4,
        part: 'n'
      },
      {
        lnr: 2,
        rnr: 3,
        part: 'n'
      },
      {
        lnr: 3,
        rnr: 2,
        part: 'm'
      },
      {
        lnr: 4,
        rnr: 1,
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '[aeiou]', '', true ) as x;`, [
      {
        lnr: 1,
        rnr: 4,
        part: 'n'
      },
      {
        lnr: 2,
        rnr: 3,
        part: 'n'
      },
      {
        lnr: 3,
        rnr: 2,
        part: 'm'
      },
      {
        lnr: 4,
        rnr: 1,
        part: 's'
      }
    ]);
    // test_and_show ( SQL"select * from std_str_split_re( 'unanimous', '[aeiou]', null, true ) as x;" ), [ { part: 'n' }, { part: 'n' }, { part: 'm' }, { part: 's' } ]
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '([AEIOU])', 'i' ) as x;`, [
      {
        lnr: 1,
        rnr: 11,
        part: ''
      },
      {
        lnr: 2,
        rnr: 10,
        part: 'u'
      },
      {
        lnr: 3,
        rnr: 9,
        part: 'n'
      },
      {
        lnr: 4,
        rnr: 8,
        part: 'a'
      },
      {
        lnr: 5,
        rnr: 7,
        part: 'n'
      },
      {
        lnr: 6,
        rnr: 6,
        part: 'i'
      },
      {
        lnr: 7,
        rnr: 5,
        part: 'm'
      },
      {
        lnr: 8,
        rnr: 4,
        part: 'o'
      },
      {
        lnr: 9,
        rnr: 3,
        part: ''
      },
      {
        lnr: 10,
        rnr: 2,
        part: 'u'
      },
      {
        lnr: 11,
        rnr: 1,
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '([AEIOU])', 'i', true ) as x;`, [
      {
        lnr: 1,
        rnr: 9,
        part: 'u'
      },
      {
        lnr: 2,
        rnr: 8,
        part: 'n'
      },
      {
        lnr: 3,
        rnr: 7,
        part: 'a'
      },
      {
        lnr: 4,
        rnr: 6,
        part: 'n'
      },
      {
        lnr: 5,
        rnr: 5,
        part: 'i'
      },
      {
        lnr: 6,
        rnr: 4,
        part: 'm'
      },
      {
        lnr: 7,
        rnr: 3,
        part: 'o'
      },
      {
        lnr: 8,
        rnr: 2,
        part: 'u'
      },
      {
        lnr: 9,
        rnr: 1,
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_generate_series( 1, 3, 1 ) as x;`, [
      {
        value: 1
      },
      {
        value: 2
      },
      {
        value: 3
      }
    ]);
    test_and_show(SQL`select * from std_re_matches( 'abcdefghijklmnopqrstuvqxyz', '[aeiou](..)' ) as x;`, [
      {
        match: 'abc',
        capture: 'bc'
      },
      {
        match: 'efg',
        capture: 'fg'
      },
      {
        match: 'ijk',
        capture: 'jk'
      },
      {
        match: 'opq',
        capture: 'pq'
      },
      {
        match: 'uvq',
        capture: 'vq'
      }
    ]);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY std_str_split_re()"] = function(T, done) {
    var DBay, db, i, len, ref, result, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    //.........................................................................................................
    db = new DBay();
    db.create_stdlib();
    //.........................................................................................................
    db(SQL`create table entries ( entry text not null );`);
    db(SQL`insert into entries values ( 'some nice words' );`);
    db(SQL`insert into entries values ( 'can help a lot' );`);
    ref = result = db.all_rows(SQL`select
    r1.entry  as entry,
    r2.lnr    as lnr,
    r2.rnr    as rnr,
    r2.part   as word
  from
    entries as r1,
    std_str_split_re( r1.entry, '\s' ) as r2;`);
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      // info word for word from db.first_values SQL"""
      info(row);
    }
    if (T != null) {
      T.eq(result, [
        {
          entry: 'some nice words',
          lnr: 1,
          rnr: 3,
          word: 'some'
        },
        {
          entry: 'some nice words',
          lnr: 2,
          rnr: 2,
          word: 'nice'
        },
        {
          entry: 'some nice words',
          lnr: 3,
          rnr: 1,
          word: 'words'
        },
        {
          entry: 'can help a lot',
          lnr: 1,
          rnr: 4,
          word: 'can'
        },
        {
          entry: 'can help a lot',
          lnr: 2,
          rnr: 3,
          word: 'help'
        },
        {
          entry: 'can help a lot',
          lnr: 3,
          rnr: 2,
          word: 'a'
        },
        {
          entry: 'can help a lot',
          lnr: 4,
          rnr: 1,
          word: 'lot'
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY std_getv()"] = function(T, done) {
    var DBay, Tbl, db, dtab;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    //.........................................................................................................
    db = new DBay();
    db.create_stdlib();
    dtab = new Tbl({db});
    (() => {      //.........................................................................................................
      var error;
      error = null;
      try {
        db.all_rows(SQL`select std_getv( 'city' ) as city;`);
      } catch (error1) {
        error = error1;
        warn(CND.reverse(error.message));
        if (T != null) {
          T.ok((error.message.match(/unknown variable 'city'/)) != null);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    //.........................................................................................................
    db.setv('city', 'Hamburg');
    db.setv('x', 20);
    db.setv('n', 123.4567890123456789);
    db.setv('foo', 'bar');
    db.setv('baz', true);
    db.setv('sqrt2', Math.sqrt(2));
    if (T != null) {
      T.eq(db.variables.city, 'Hamburg');
    }
    //.........................................................................................................
    echo(rpr(db.all_rows(SQL`select std_getv( 'city' ) as city;`)));
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_getv( 'city' )  as city;`), [
        {
          city: 'Hamburg'
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_getv( 'x' )     as x;`), [
        {
          x: 20
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_getv( 'n' )     as n;`), [
        {
          n: 123.4567890123456789
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_getv( 'foo' )   as foo;`), [
        {
          foo: 'bar'
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_getv( 'baz' )   as baz;`), [
        {
          baz: 1
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_getv( 'sqrt2' ) as sqrt2;`), [
        {
          sqrt2: Math.sqrt(2)
        }
      ]);
    }
    echo(dtab._tabulate(db(SQL`select * from std_variables order by name;`)));
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      // @[ "DBAY std_getv()" ]()
      return test(this["DBAY std_getv()"]);
    })();
  }

  // @[ "DBAY stdlib functions" ]()
// @[ "DBAY std_str_split_re()" ]()

}).call(this);

//# sourceMappingURL=stdlib.tests.js.map