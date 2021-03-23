(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, isa, rpr, show_schemas_and_objects, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../../apps/guy-test');

  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: as_sql"] = async function(T, done) {
    var ICQLDBA, dba, error, i, len, matcher, probe, probes_and_matchers;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    dba = new ICQLDBA.Dba();
    probes_and_matchers = [[true, '1'], [false, '0'], [42, '42'], ['text', "'text'"], ["text with 'quotes'", "'text with ''quotes'''"], [[1, 2, 3], "'[1,2,3]'"], [[], "'[]'"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(dba.as_sql(probe));
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: interpolate"] = async function(T, done) {
    var ICQLDBA, dba, error, i, len, matcher, probe, probes_and_matchers;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    dba = new ICQLDBA.Dba();
    probes_and_matchers = [
      [
        [
          "foo, $bar, baz",
          {
            bar: 42
          }
        ],
        "foo, 42, baz"
      ],
      [
        [
          "select * from t where d = $d;",
          {
            bar: 42
          }
        ],
        null,
        "unable to express 'undefined' as SQL literal"
      ],
      [
        [
          "select * from t where d = $d;",
          {
            d: true
          }
        ],
        "select * from t where d = 1;"
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var Q, sql;
          [sql, Q] = probe;
          return resolve(dba.interpolate(sql, Q));
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: toposort is removed"] = function(T, done) {
    var ICQLDBA, dba;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    dba = new ICQLDBA.Dba();
    T.eq(dba.get_toposort, void 0);
    /* removed b/c stops working when tables refer to each other cyclical fashion:
     dba.execute "create table main.k1 ( id integer primary key, fk_k2 integer references k2 ( id ) );"
     dba.execute "create table main.k2 ( id integer primary key, fk_k1 integer references k1 ( id ) );"
     debug '^568^', dba.get_toposort()
     * => "Error: detected cycle involving node 'K1'"
      */
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: clear()"] = function(T, done) {
    var ICQLDBA, d, dba, i, id, ref1;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    dba = new ICQLDBA.Dba();
    //.........................................................................................................
    // Create tables, indexes:
    dba.execute("create table main.k1 ( id integer primary key, fk_k2 integer unique references k2 ( id ) );");
    dba.execute("create table main.k2 ( id integer primary key, fk_k1 integer unique references k1 ( id ) );");
    ref1 = dba.walk_objects();
    //.........................................................................................................
    for (d of ref1) {
      info("^557-300^", {
        type: d.type,
        name: d.name
      });
    }
    //.........................................................................................................
    // Insert rows:
    T.eq(dba.get_foreign_key_state(), true);
    dba.set_foreign_key_state(false);
    T.eq(dba.get_foreign_key_state(), false);
    for (id = i = 1; i <= 9; id = ++i) {
      dba.execute(`insert into main.k1 values ( ${id}, ${id} );`);
      dba.execute(`insert into main.k2 values ( ${id}, ${id} );`);
    }
    dba.set_foreign_key_state(true);
    T.eq(dba.get_foreign_key_state(), true);
    //.........................................................................................................
    debug('^544734^', (function() {
      var ref2, results;
      ref2 = dba.walk_objects();
      results = [];
      for (d of ref2) {
        results.push(d.name);
      }
      return results;
    })());
    T.eq((function() {
      var ref2, results;
      ref2 = dba.walk_objects();
      results = [];
      for (d of ref2) {
        results.push(d.name);
      }
      return results;
    })(), ['sqlite_autoindex_k1_1', 'sqlite_autoindex_k2_1', 'k1', 'k2']);
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
    //.........................................................................................................
    dba.clear();
    T.eq((function() {
      var ref2, results;
      ref2 = dba.walk_objects();
      results = [];
      for (d of ref2) {
        results.push(d.name);
      }
      return results;
    })(), []);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open from DB file"] = async function(T, done) {
    var ICQLDBA, cfg, d, dba, ignore, objects, path, s;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    cfg = H.get_cfg();
    cfg.size = 'small';
    cfg.mode = 'fle';
    cfg.ref = 'dba-open-from-file';
    cfg.pragmas = 'fle';
    cfg.db_template_path = H.interpolate(cfg.db.templates[cfg.size], cfg);
    cfg.db_work_path = H.interpolate(cfg.db.work[cfg.mode], cfg);
    path = cfg.db_work_path;
    help("^77-300^ cfg.db_template_path:  ", cfg.db_template_path);
    help("^77-300^ cfg.db_work_path:      ", cfg.db_work_path);
    await H.copy_over(cfg.db_template_path, cfg.db_work_path);
    dba = new ICQLDBA.Dba({path});
    //.........................................................................................................
    T.eq(type_of((s = dba.walk_objects())), 'statementiterator');
    ignore = [...s];
    objects = (function() {
      var ref1, results;
      ref1 = dba.walk_objects({
        schema: 'main'
      });
      results = [];
      for (d of ref1) {
        results.push(`${d.type}:${d.name}`);
      }
      return results;
    })();
    T.eq(objects, ['index:sqlite_autoindex_keys_1', 'index:sqlite_autoindex_realms_1', 'index:sqlite_autoindex_sources_1', 'table:keys', 'table:main', 'table:realms', 'table:sources', 'view:dest_changes_backward', 'view:dest_changes_forward']);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["_DBA: copy file DB to memory"] = async function(T, done) {
    var ICQLDBA, cfg, d, dba, path, ref1;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    cfg = H.get_cfg();
    cfg.size = 'small';
    cfg.mode = 'fle';
    cfg.ref = 'dba-open-from-file';
    cfg.pragmas = 'fle';
    cfg.db_template_path = H.interpolate(cfg.db.templates[cfg.size], cfg);
    cfg.db_work_path = H.interpolate(cfg.db.work[cfg.mode], cfg);
    path = cfg.db_work_path;
    await H.copy_over(cfg.db_template_path, cfg.db_work_path);
    cfg.mem_schema = 'x';
    info(JSON.stringify(cfg, null, '  '));
    dba = new ICQLDBA.Dba({
      path,
      echo: true,
      debug: true
    });
    //.........................................................................................................
    debug('^300^', cfg);
    debug('^301^', dba.get_schemas());
    dba.attach({
      path: ':memory:',
      schema: cfg.mem_schema
    });
    debug('^302^', dba.get_schemas());
    ref1 = dba.walk_objects();
    for (d of ref1) {
      debug('^303^', `${d.type}:${d.name}`);
    }
    dba.copy_schema({
      to_schema: cfg.mem_schema
    });
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  show_schemas_and_objects = function(ref, dba) {
    var count, d, ref1, schema;
    for (schema in dba.get_schemas()) {
      urge(`${ref} schema: ${schema}`);
      count = 0;
      ref1 = dba.walk_objects({schema});
      for (d of ref1) {
        count++;
        info(`${ref}    ${schema}/${d.type}:${d.name}`);
      }
      if (count === 0) {
        whisper(`${ref}    (empty)`);
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: copy file DB to memory"] = async function(T, done) {
    var ICQLDBA, cfg, count, d, dba, dba_cfg, i, len, obj_name_x, result, schema_x, sql, to_schema_objects;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql-dba');
    //.........................................................................................................
    cfg = {
      pragmas: ['page_size = 4096', 'cache_size = 16384', 'temp_store = MEMORY', 'journal_mode = WAL', 'locking_mode = EXCLUSIVE', 'synchronous = OFF'],
      db_template_path: H.resolve_path('assets/icql/small-datamill.db'),
      db_work_path: H.resolve_path('data/icql/icql-dba-copy-schema.db'),
      mem_schema: 'x'
    };
    //.........................................................................................................
    help('^3387^', "cfg.db_template_path: ", cfg.db_template_path);
    help('^3387^', "cfg.db_work_path:     ", cfg.db_work_path);
    await H.copy_over(cfg.db_template_path, cfg.db_work_path);
    //.........................................................................................................
    dba_cfg = {
      path: cfg.db_work_path
    };
    // dba_cfg               = { path: cfg.db_work_path, echo: true, debug: true, }
    dba = new ICQLDBA.Dba(dba_cfg);
    //.........................................................................................................
    dba.attach({
      path: ':memory:',
      schema: cfg.mem_schema
    });
    show_schemas_and_objects('^754-2^', dba);
    dba.copy_schema({
      from_schema: 'main',
      to_schema: cfg.mem_schema
    });
    show_schemas_and_objects('^754-3^', dba);
    //.........................................................................................................
    to_schema_objects = dba.list(dba.walk_objects({
      schema: cfg.mem_schema
    }));
    schema_x = dba.as_identifier(cfg.mem_schema);
    result = {};
    for (i = 0, len = to_schema_objects.length; i < len; i++) {
      d = to_schema_objects[i];
      obj_name_x = dba.as_identifier(d.name);
      switch (d.type) {
        case 'index':
          result[d.name] = 'index';
          break;
        case 'table':
        case 'view':
          sql = `select count(*) from ${schema_x}.${obj_name_x};`;
          count = dba.single_value(dba.query(sql));
          debug(d.name, count);
          result[d.name] = `${d.type}|${count}`;
          break;
        default:
          throw new Error(`^45687^ unknown DB object type ${rpr(d.type)}`);
      }
    }
    debug('^448978^', result);
    T.eq(result, {
      sqlite_autoindex_keys_1: 'index',
      sqlite_autoindex_realms_1: 'index',
      sqlite_autoindex_sources_1: 'index',
      keys: 'table|15',
      main: 'table|327',
      realms: 'table|2',
      sources: 'table|1',
      dest_changes_backward: 'view|320',
      dest_changes_forward: 'view|320'
    });
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    test(this);
  }

  // test @[ "DBA: copy file DB to memory" ]
// test @[ "DBA: as_sql" ]
// test @[ "DBA: interpolate" ]
// test @[ "DBA: clear()" ]
// test @[ "toposort with schema" ]
// @[ "toposort with schema" ]()

}).call(this);

//# sourceMappingURL=icql-dba-basics.js.map