(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/OPEN-CLOSE';

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

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY open() 1"] = function(T, done) {
    var DBay, DH, db, error, schema;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new DBay();
    schema = 'aux';
    db.open({schema});
    if (T != null) {
      T.eq(db._dbs.aux.temporary, true);
    }
    if (T != null) {
      T.eq((Object.keys(db._dbs)).length, 2);
    }
    try {
      db(function() {
        db(SQL`create table aux.squares ( n int not null primary key, square int not null );`);
        throw new Error('xxx');
      });
    } catch (error1) {
      error = error1;
      if (error.message !== 'xxx') {
        throw error;
      }
    }
    info(db.all_rows(SQL`select * from sqlite_schema;`));
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this["DBAY open() 1"]);
    })();
  }

}).call(this);

//# sourceMappingURL=open-close.tests.js.map