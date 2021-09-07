(function() {
  'use strict';
  var CND, DATA, H, PATH, SQL, badge, debug, echo, help, info, isa, jp, jr, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/FUTURE';

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
  on_process_exit = require('exit-hook');

  sleep = function(dts) {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  SQL = String.raw;

  jr = JSON.stringify;

  jp = JSON.parse;

  DATA = require('../../../lib/data-providers-nocache');

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: default schema is 'icql'"] = async function(T, done) {
    var Dba, dba;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dba} = require(H.icql_dba_path));
    dba = new Dba({
      debug: true,
      readonly: true
    });
    await (async() => {      //.........................................................................................................
      var template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open'
      })));
      dba.open({
        path: work_path,
        schema: 'main'
      });
      return dba.open({
        ram: true,
        schema: 'ram'
      });
    })();
    //.........................................................................................................
    debug('^878^', dba);
    debug('^878^', dba.sqlt);
    if (T != null) {
      T.eq(dba.sqlt.readonly, true);
    }
    debug('^878^', dba.list_schemas());
    debug('^878^', dba.list_schema_names());
    info('main', dba.list(dba.query(SQL`select name from main.sqlite_schema where type = 'table';`)));
    info('ram ', dba.list(dba.query(SQL`select name from ram.sqlite_schema where type = 'table';`)));
    // info 'dm1 ', dba.list dba.query SQL"select name from dm1.sqlite_schema where type = 'table';"
    //.........................................................................................................
    dba.execute(SQL`create table a1 ( n integer not null primary key );`);
    //.........................................................................................................
    urge('main', dba.list(dba.query(SQL`select name from main.sqlite_schema where type = 'table';`)));
    urge('ram ', dba.list(dba.query(SQL`select name from ram.sqlite_schema where type = 'table';`)));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open()"] = async function(T, done) {
    var Dba, dba, schemas;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dba} = require(H.icql_dba_path));
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
      schema_i = dba.sql.I(schema);
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
      // dba.open { path: work_path, schema, }
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
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
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
      T.eq(db_path, dba._path_of_schema(schema));
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

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() file DB in schema main"] = async function(T, done) {
    var Dba, schema, schemas, template_path, work_path;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schemas = {};
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'F-open-in-main'
    })));
    schema = 'main';
    await (() => {      //.........................................................................................................
      var d, db_path, dba, ref;
      urge('^344-3^', {template_path, work_path, schema});
      // dba     = new Dba()
      dba = new Dba();
      dba.open({
        path: work_path
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      ref = dba.query(SQL`select * from pragma_database_list order by seq;`);
      for (d of ref) {
        // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
        info(d);
      }
      db_path = dba.first_value(dba.query(SQL`select file from pragma_database_list where name = ?;`, [schema]));
      T.eq(db_path, work_path);
      T.eq(db_path, dba._path_of_schema(schema));
      T.ok(!dba.is_ram_db({schema}));
      info('^35345^', dba._schemas);
      dba.execute(SQL`create table main.x ( id int primary key ); insert into x ( id ) values ( 123 );`);
      return null;
    })();
    await (() => {      //.........................................................................................................
      var d, dba, i, len, ref;
      dba = new Dba();
      dba.open({
        path: work_path
      });
      info('^35345^', dba._schemas);
      ref = dba.list(dba.walk_objects({schema}));
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        info('^334^', `${d.type}:${d.schema}.${d.name}`);
      }
      T.eq(dba.list(dba.query(SQL`select * from main.x;`)), [
        {
          id: 123
        }
      ]);
      return debug('^3334^', dba);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() RAM DB from file in schema main"] = async function(T, done) {
    var Dba, schema, schemas, template_path, work_path;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schemas = {};
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'F-open-in-main'
    })));
    schema = 'main';
    await (() => {      //.........................................................................................................
      var d, db_path, dba, ref, ref1, ref2;
      /* Opening a RAM DB from file */
      urge('^344-3^', {template_path, work_path, schema});
      // dba     = new Dba()
      dba = new Dba();
      dba.open({
        path: work_path,
        ram: true
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      ref = dba.query(SQL`select * from pragma_database_list order by seq;`);
      for (d of ref) {
        // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
        info(d);
      }
      db_path = dba.first_value(dba.query(SQL`select file from pragma_database_list where name = ?;`, [schema]));
      T.eq(db_path, '');
      T.ok(dba.is_ram_db({schema}));
      db_path = dba.first_value(dba.query(SQL`select file from pragma_database_list where name = ?;`, [schema]));
      T.ok((ref1 = dba._schemas.main) != null ? (ref2 = ref1.path) != null ? ref2.endsWith('data/icql/icql-F-open-in-main-small.db') : void 0 : void 0);
      T.eq(dba.first_value(dba.query(SQL`select count(*) from main.main;`)), 327);
      return null;
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() many RAM DBs"] = function(T, done) {
    var Dba, SQLITE_MAX_ATTACHED, dba, i, j, nr, ref, ref1, schema, schema_i, sql;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    dba = new Dba();
    //.........................................................................................................
    SQLITE_MAX_ATTACHED = 125;
    for (nr = i = 1, ref = SQLITE_MAX_ATTACHED; (1 <= ref ? i <= ref : i >= ref); nr = 1 <= ref ? ++i : --i) {
      (() => {
        var idx, j, n, rnd, schema_i;
        schema = `s${nr}`;
        schema_i = dba.sql.I(schema);
        dba.open({
          schema,
          ram: true
        });
        dba.run(SQL`create table ${schema_i}.numbers (
  schema  text    not null,
  nr      integer not null,
  n       integer not null unique primary key,
  rnd     integer not null );`);
        for (idx = j = 0; j <= 5; idx = ++j) {
          n = idx + 1;
          rnd = nr * n;
          dba.run(SQL`insert into ${schema_i}.numbers ( schema, nr, n, rnd )
  values ( $schema, $nr, $n, $rnd );`, {schema, nr, n, rnd});
        }
        return null;
      })();
    }
    //.........................................................................................................
    sql = [];
    for (nr = j = 1, ref1 = SQLITE_MAX_ATTACHED; (1 <= ref1 ? j <= ref1 : j >= ref1); nr = 1 <= ref1 ? ++j : --j) {
      schema = `s${nr}`;
      schema_i = dba.sql.I(schema);
      sql.push(SQL`select * from ${schema_i}.numbers`);
    }
    sql = sql.join('\n' + SQL`union all `);
    sql += '\n' + SQL`order by nr, n;`;
    console.table(dba.list(dba.query(sql)));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() empty RAM DB in schema main"] = async function(T, done) {
    var Dba, schema;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    await (() => {      //.........................................................................................................
      /* Opening an empty RAM DB */
      var dba;
      dba = new Dba();
      dba.open({
        ram: true
      });
      T.eq(dba._schemas, {
        main: {
          path: null
        }
      });
      T.eq(dba.list(dba.walk_objects({schema})), []);
      dba.execute(SQL`create table main.x ( id int primary key ); insert into x ( id ) values ( 123 );`);
      info('^443^', dba.list(dba.walk_objects({schema})));
      T.eq(dba.list(dba.walk_objects({schema})), [
        {
          seq: 0,
          schema: 'main',
          name: 'sqlite_autoindex_x_1',
          type: 'index',
          sql: null
        },
        {
          seq: 0,
          schema: 'main',
          name: 'x',
          type: 'table',
          sql: 'CREATE TABLE x ( id int primary key )'
        }
      ]);
      return debug('^3334^', dba);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: clear()"] = function(T, done) {
    var ICQLDBA, d, dba, i, id, ref, schema;
    if (T != null) {
      T.halt_on_error();
    }
    ICQLDBA = require(H.icql_dba_path);
    dba = new ICQLDBA.Dba();
    schema = 'main';
    //.........................................................................................................
    // Create tables, indexes:
    dba.execute("create table main.k1 ( id integer primary key, fk_k2 integer unique references k2 ( id ) );");
    dba.execute("create table main.k2 ( id integer primary key, fk_k1 integer unique references k1 ( id ) );");
    ref = dba.walk_objects({schema});
    //.........................................................................................................
    for (d of ref) {
      info("^557-300^", {
        type: d.type,
        name: d.name
      });
    }
    //.........................................................................................................
    // Insert rows:
    if (T != null) {
      T.eq(dba.get_foreign_keys_state(), true);
    }
    dba.set_foreign_keys_state(false);
    if (T != null) {
      T.eq(dba.get_foreign_keys_state(), false);
    }
    for (id = i = 1; i <= 9; id = ++i) {
      dba.execute(`insert into main.k1 values ( ${id}, ${id} );`);
      dba.execute(`insert into main.k2 values ( ${id}, ${id} );`);
    }
    dba.set_foreign_keys_state(true);
    if (T != null) {
      T.eq(dba.get_foreign_keys_state(), true);
    }
    //.........................................................................................................
    debug('^544734^', (function() {
      var ref1, results;
      ref1 = dba.walk_objects({schema});
      results = [];
      for (d of ref1) {
        results.push(d.name);
      }
      return results;
    })());
    if (T != null) {
      T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_k1_1', 'sqlite_autoindex_k2_1', 'k1', 'k2']);
    }
    if (T != null) {
      T.eq(dba.list(dba.query("select * from k1 join k2 on ( k1.fk_k2 = k2.id );")), [
        {
          id: 1,
          fk_k2: 1,
          fk_k1: 1
        },
        {
          id: 2,
          fk_k2: 2,
          fk_k1: 2
        },
        {
          id: 3,
          fk_k2: 3,
          fk_k1: 3
        },
        {
          id: 4,
          fk_k2: 4,
          fk_k1: 4
        },
        {
          id: 5,
          fk_k2: 5,
          fk_k1: 5
        },
        {
          id: 6,
          fk_k2: 6,
          fk_k1: 6
        },
        {
          id: 7,
          fk_k2: 7,
          fk_k1: 7
        },
        {
          id: 8,
          fk_k2: 8,
          fk_k1: 8
        },
        {
          id: 9,
          fk_k2: 9,
          fk_k1: 9
        }
      ]);
    }
    //.........................................................................................................
    dba.clear({schema});
    if (T != null) {
      T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), []);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      return test(this["DBA: default schema is 'icql'"]);
    })();
  }

  // @[ "DBA: default schema is 'icql'" ]()

}).call(this);

//# sourceMappingURL=schemas.tests.js.map