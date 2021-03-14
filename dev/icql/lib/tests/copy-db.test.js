(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, inspect, jr, provide_copy_methods, rpr, test, urge, warn, whisper, xrpr, xrpr2;

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
  provide_copy_methods = function() {
    //-----------------------------------------------------------------------------------------------------------
    /* TAINT must escape path, schema */
    this.attach = function(me, path, schema) {
      debug('^334445^', `attach ${this.as_sql(path)} as [${schema}];`);
      return me.$.db.exec(`attach '${path}' as [${schema}];`);
    };
    //-----------------------------------------------------------------------------------------------------------
    this.copy_to_memory = function(me, schema) {
      var k;
      // debug '^3334^', ( k for k of me )
      // debug '^3334^', ( k for k of me.$.db )
      debug('^3334^', (function() {
        var results;
        results = [];
        for (k in me.$) {
          results.push(k);
        }
        return results;
      })());
      debug('^3334^', me.$.db.attach);
      this.attach(me, ':memory:', schema);
      urge('^64656^', me.$.get_toposort());
      // for table in
      me.$.db.exec(`create table ${schema}.a ( n integer );`);
      urge('^64656^', "get_toposort 'main'", me.$.get_toposort('main'));
      urge('^64656^', "get_toposort schema", me.$.get_toposort(schema));
      urge('^64656^', me.$.all_rows(me.$.catalog()));
      help('^64656^', me.$.all_rows(me.$.list_objects('main')));
      help('^64656^', me.$.all_rows(me.$.list_objects(schema)));
      urge('^64656^', me.$.all_rows(me.$.list_schemas()));
      info('^67888^', me.$.all_rows(me.$.query(`select * from ${schema}.a;`)));
      info('^67888^', me.$.all_rows(me.$.query(`select * from ${schema}.sqlite_schema;`)));
      // me.$.db.
      return null;
    };
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["_mirror DB to memory"] = function(T, done) {
    var ICQL, db, rows, settings;
    ICQL = require('../../../../apps/icql');
    settings = H.get_icql_settings(true);
    db = ICQL.bind(settings);
    //################################
    provide_copy_methods.apply(db.$);
    db.$.copy_to_memory(db, 'd2');
    //################################
    db.create_tables_with_foreign_key();
    db.populate_tables_with_foreign_key();
    rows = db.$.all_rows(db.select_from_tables_with_foreign_key());
    debug('^3485^', rows);
    // T.eq db.$.get_toposort(), []
    db.$.clear();
    if (done != null) {
      // T.eq db.$.get_toposort(), []
      // db.drop_tables_with_foreign_key()
      return done();
    }
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @
    // test @[ "_mirror DB to memory" ]
    this["_mirror DB to memory"]();
  }

}).call(this);

//# sourceMappingURL=copy-db.test.js.map