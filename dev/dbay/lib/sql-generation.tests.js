(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, r, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/SQL-GENERATION';

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
  this["DBAY Sqlgen demo"] = function(T, done) {
    var DBay, Tbl, db, dtab, schema;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    db = new DBay();
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({
      dba: db
    });
    schema = 'main';
    //.........................................................................................................
    if (T != null) {
      T.throws(/object 'main.cities' does not exist/, () => {
        return db._get_field_names('main', 'cities');
      });
    }
    //.........................................................................................................
    db(function() {
      var sql;
      db(SQL`create table cities (
  id      integer not null primary key,
  name    text    not null,
  country text    not null )`);
      sql = db.create_insert({
        schema,
        into: 'cities'
      });
      return T != null ? T.eq(sql, `insert into "main"."cities" ( "id", "name", "country" ) values ( $id, $name, $country );`) : void 0;
    });
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

  // @[ "_DBAY Sqlgen demo" ]()

}).call(this);

//# sourceMappingURL=sql-generation.tests.js.map