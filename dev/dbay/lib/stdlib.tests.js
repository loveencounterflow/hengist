(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY stdlib functions"] = function(T, done) {
    var Dbay, db;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    //.........................................................................................................
    db = new Dbay();
    db.create_stdlib();
    //.........................................................................................................
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_str_reverse( 'abc一無所有𫠣' ) as x;`), [
        {
          x: '𫠣有所無一cba'
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select std_str_join( '-', '1', '1', '1', '1', '1', '1'  ) as x;`), [
        {
          "x": '1-1-1-1-1-1'
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from std_str_split_first( 'foo/bar/baz', '/' ) as x;`), [
        {
          prefix: 'foo',
          suffix: 'bar/baz'
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from std_generate_series( 1, 3, 1 ) as x;`), [
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
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from std_re_matches( 'abcdefghijklmnopqrstuvqxyz', '[aeiou](..)' ) as x;`), [
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

}).call(this);

//# sourceMappingURL=stdlib.tests.js.map