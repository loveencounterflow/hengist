(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, inspect, jr, rpr, test, urge, warn, whisper, xrpr, xrpr2;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL/TESTS/MAIN';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  ({inspect} = require('util'));

  xrpr = function(x) {
    return inspect(x, {
      colors: true,
      breakLength: 2e308,
      maxArrayLength: 2e308,
      depth: 2e308
    });
  };

  xrpr2 = function(x) {
    return inspect(x, {
      colors: true,
      breakLength: 20,
      maxArrayLength: 2e308,
      depth: 2e308
    });
  };

  //...........................................................................................................
  PATH = require('path');

  H = require('./helpers');

  //-----------------------------------------------------------------------------------------------------------
  this["_mirror DB to memory"] = function(T, done) {
    var ICQL, db, df1, df2, dt1, dt2, from_schema, settings, to_schema;
    ICQL = require('../../../../apps/icql');
    settings = H.get_icql_settings(true);
    settings.echo = true;
    db = ICQL.bind(settings);
    from_schema = 'main';
    to_schema = 'd2';
    db.create_tables_with_foreign_key();
    db.populate_tables_with_foreign_key();
    db.$.attach(':memory:', to_schema);
    db.$.copy_schema(from_schema, to_schema);
    df1 = db.$.all_rows(db.$.query(`select * from ${db.$.as_identifier(from_schema)}.t1 order by key;`));
    df2 = db.$.all_rows(db.$.query(`select * from ${db.$.as_identifier(from_schema)}.t2 order by id;`));
    dt1 = db.$.all_rows(db.$.query(`select * from ${db.$.as_identifier(to_schema)}.t1 order by key;`));
    dt2 = db.$.all_rows(db.$.query(`select * from ${db.$.as_identifier(to_schema)}.t2 order by id;`));
    T.eq(df1, dt1);
    T.eq(df2, dt2);
    if (done != null) {
      // rows              = db.$.all_rows db.select_from_tables_with_foreign_key()
      // debug '^3485^', rows
      // T.eq db.$.get_toposort(), []
      // db.$.clear()
      // T.eq db.$.get_toposort(), []
      // db.drop_tables_with_foreign_key()
      return done();
    }
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @
    test(this["_mirror DB to memory"]);
  }

  // @[ "_mirror DB to memory" ]()

}).call(this);

//# sourceMappingURL=copy-db.test.js.map