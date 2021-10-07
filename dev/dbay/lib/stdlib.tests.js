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
        part: ''
      },
      {
        part: 'foo'
      },
      {
        part: 'bar'
      },
      {
        part: 'baz'
      }
    ]);
    test_and_show(SQL`select * from std_str_split( '/foo/bar/baz', '/', true ) as x;`, [
      {
        part: 'foo'
      },
      {
        part: 'bar'
      },
      {
        part: 'baz'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '[aeiou]' ) as x;`, [
      {
        part: ''
      },
      {
        part: 'n'
      },
      {
        part: 'n'
      },
      {
        part: 'm'
      },
      {
        part: ''
      },
      {
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '[aeiou]', 'i', true ) as x;`, [
      {
        part: 'n'
      },
      {
        part: 'n'
      },
      {
        part: 'm'
      },
      {
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '[aeiou]', '', true ) as x;`, [
      {
        part: 'n'
      },
      {
        part: 'n'
      },
      {
        part: 'm'
      },
      {
        part: 's'
      }
    ]);
    // test_and_show ( SQL"select * from std_str_split_re( 'unanimous', '[aeiou]', null, true ) as x;" ), [ { part: 'n' }, { part: 'n' }, { part: 'm' }, { part: 's' } ]
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '([AEIOU])', 'i' ) as x;`, [
      {
        part: ''
      },
      {
        part: 'u'
      },
      {
        part: 'n'
      },
      {
        part: 'a'
      },
      {
        part: 'n'
      },
      {
        part: 'i'
      },
      {
        part: 'm'
      },
      {
        part: 'o'
      },
      {
        part: ''
      },
      {
        part: 'u'
      },
      {
        part: 's'
      }
    ]);
    test_and_show(SQL`select * from std_str_split_re( 'unanimous', '([AEIOU])', 'i', true ) as x;`, [
      {
        part: 'u'
      },
      {
        part: 'n'
      },
      {
        part: 'a'
      },
      {
        part: 'n'
      },
      {
        part: 'i'
      },
      {
        part: 'm'
      },
      {
        part: 'o'
      },
      {
        part: 'u'
      },
      {
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
          word: 'some'
        },
        {
          entry: 'some nice words',
          word: 'nice'
        },
        {
          entry: 'some nice words',
          word: 'words'
        },
        {
          entry: 'can help a lot',
          word: 'can'
        },
        {
          entry: 'can help a lot',
          word: 'help'
        },
        {
          entry: 'can help a lot',
          word: 'a'
        },
        {
          entry: 'can help a lot',
          word: 'lot'
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this, {
        timeout: 10e3
      });
    })();
  }

  // @[ "DBAY stdlib functions" ]()
// @[ "DBAY std_str_split_re()" ]()

}).call(this);

//# sourceMappingURL=stdlib.tests.js.map