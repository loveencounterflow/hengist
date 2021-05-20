(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/BASICS';

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

  // { to_width }              = require 'to-width'

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open()"] = async function(T, done) {
    var Dba, dba, schemas;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    dba = new Dba();
    schemas = {};
    //.........................................................................................................
    T.eq(dba.sqlt.name, '');
    T.eq(dba.sqlt.open, true);
    T.eq(dba.sqlt.inTransaction, false);
    T.eq(dba.sqlt.readonly, false);
    T.eq(dba.sqlt.memory, true);
    await (async() => {      //.........................................................................................................
      var schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open'
      })));
      schema = 'dm1';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-1^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      return T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
    })();
    await (async() => {      //.........................................................................................................
      /* Possible to attach same file for Continuous Peristency DB multiple times */
      var d, schema, schema_i, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open',
        reuse: true
      })));
      schema = 'dm2';
      schema_i = dba.as_identifier(schema);
      schemas[schema] = {
        path: work_path
      };
      urge('^344-1^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      dba.execute("create table dm1.extra ( id integer );");
      dba.execute("insert into dm1.extra values ( 1 ), ( 2 ), ( 3 );");
      info(dba.list(dba.query("select * from dm1.extra order by id;")));
      help((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm1'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })());
      help((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm2'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })());
      T.ok(indexOf.call((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm1'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })(), 'extra') >= 0);
      T.ok(indexOf.call((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm2'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })(), 'extra') >= 0);
      T.eq(dba.list(dba.query("select * from dm1.extra order by id;")), [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]);
      T.eq(dba.list(dba.query("select * from dm2.extra order by id;")), [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]);
      return T.ok(!dba.is_ram_db({schema}));
    })();
    await (async() => {      //.........................................................................................................
      var error, schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open'
      })));
      schema = 'dm1';
      // schemas[ schema ] = { path: work_path, }
      urge('^344-2^', {template_path, work_path, schema});
      try {
        dba.open({
          path: work_path,
          schema
        });
      } catch (error1) {
        error = error1;
        warn('^3234^', error);
        warn('^3234^', error.message);
      }
      T.throws(/schema 'dm1' already exists/, () => {
        return dba.open({
          path: work_path,
          schema
        });
      });
      return T.ok(!dba.is_ram_db({schema}));
    })();
    await (async() => {      //.........................................................................................................
      var schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'big',
        ref: 'F-open'
      })));
      schema = 'chinook';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-3^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      T.ok(!H.types.isa.datamill_db_lookalike({dba, schema}));
      T.ok(H.types.isa.chinook_db_lookalike({dba, schema}));
      return T.ok(!dba.is_ram_db({schema}));
    })();
    await (async() => {      //.........................................................................................................
      var schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'micro',
        ref: 'F-open'
      })));
      schema = 'micro';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-3^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      T.ok(!H.types.isa.datamill_db_lookalike({dba, schema}));
      T.ok(H.types.isa.micro_db_lookalike({dba, schema}));
      return T.ok(!dba.is_ram_db({schema}));
    })();
    //.........................................................................................................
    T.eq(dba._schemas, schemas);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() RAM DB"] = async function(T, done) {
    var Dba, dba, schemas;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    dba = new Dba();
    schemas = {};
    await (async() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var db_path, schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open-2'
      })));
      schema = 'ramdb';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-3^', {
        template_path,
        work_path,
        schema,
        ram: true
      });
      dba.open({
        path: work_path,
        schema,
        ram: true
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
      // info d for d from dba.query "select * from pragma_database_list order by seq;"
      db_path = dba.first_value(dba.query("select file from pragma_database_list where name = ?;", [schema]));
      T.eq(db_path, '');
      return T.ok(dba.is_ram_db({schema}));
    })();
    await (() => {      //.........................................................................................................
      /* Opening an empty RAM DB */
      var db_path, ram, schema;
      schema = 'r2';
      ram = true;
      schemas[schema] = {
        path: null
      };
      dba.open({schema, ram});
      // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
      // info d for d from dba.query "select * from pragma_database_list order by seq;"
      db_path = dba.first_value(dba.query("select file from pragma_database_list where name = ?;", [schema]));
      T.eq(db_path, '');
      return T.ok(dba.is_ram_db({schema}));
    })();
    await (() => {      //.........................................................................................................
      // dba.is_ram_db { schema: 'nosuchschema', }
      return T.throws(/\(Dba_schema_unknown\) schema 'nosuchschema' does not exist/, () => {
        return dba.is_ram_db({
          schema: 'nosuchschema'
        });
      });
    })();
    //.........................................................................................................
    info('^35345^', dba._schemas);
    T.eq(dba._schemas, schemas);
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    test(this);
  }

  // test @[ "DBA: open()" ]
// test @[ "DBA: open() RAM DB" ]

}).call(this);

//# sourceMappingURL=future.tests.js.map