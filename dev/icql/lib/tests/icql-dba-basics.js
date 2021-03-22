(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
    ICQLDBA = require('../../../../apps/icql/dba');
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
    ICQLDBA = require('../../../../apps/icql/dba');
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
    ICQLDBA = require('../../../../apps/icql/dba');
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
    var ICQLDBA, d, dba, i, id, ref;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql/dba');
    dba = new ICQLDBA.Dba();
    //.........................................................................................................
    // Create tables, indexes:
    dba.execute("create table main.k1 ( id integer primary key, fk_k2 integer unique references k2 ( id ) );");
    dba.execute("create table main.k2 ( id integer primary key, fk_k1 integer unique references k1 ( id ) );");
    ref = dba.walk_objects();
    //.........................................................................................................
    for (d of ref) {
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
      var ref1, results;
      ref1 = dba.walk_objects();
      results = [];
      for (d of ref1) {
        results.push(d.name);
      }
      return results;
    })());
    T.eq((function() {
      var ref1, results;
      ref1 = dba.walk_objects();
      results = [];
      for (d of ref1) {
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
      var ref1, results;
      ref1 = dba.walk_objects();
      results = [];
      for (d of ref1) {
        results.push(d.name);
      }
      return results;
    })(), []);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open from DB file"] = function(T, done) {
    var ICQLDBA, d, db_template_path, db_work_path, dba, ignore, objects, path, s, test_cfg;
    T.halt_on_error();
    ICQLDBA = require('../../../../apps/icql/dba');
    test_cfg = H.get_cfg();
    test_cfg.size = 'small';
    test_cfg.mode = 'fle';
    test_cfg.ref = 'dba-open-from-file';
    test_cfg.pragmas = 'fle';
    db_template_path = H.interpolate(test_cfg.db.templates[test_cfg.size], test_cfg);
    db_work_path = H.interpolate(test_cfg.db.work[test_cfg.mode], test_cfg);
    path = db_work_path;
    help("^77-300^ db_template_path:  ", db_template_path);
    help("^77-300^ db_work_path:      ", db_work_path);
    H.copy_over(db_template_path, db_work_path);
    dba = new ICQLDBA.Dba({path});
    //.........................................................................................................
    T.eq(type_of((s = dba.walk_objects())), 'statementiterator');
    ignore = [...s];
    debug(ignore);
    objects = (function() {
      var ref, results;
      ref = dba.walk_objects({
        schema: 'main'
      });
      results = [];
      for (d of ref) {
        results.push(`${d.type}:${d.name}`);
      }
      return results;
    })();
    T.eq(objects, ['index:sqlite_autoindex_keys_1', 'index:sqlite_autoindex_realms_1', 'index:sqlite_autoindex_sources_1', 'table:keys', 'table:main', 'table:realms', 'table:sources', 'view:dest_changes_backward', 'view:dest_changes_forward']);
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    test(this);
  }

  // test @[ "DBA: as_sql" ]
// test @[ "DBA: interpolate" ]
// test @[ "DBA: clear()" ]
// test @[ "toposort with schema" ]
// @[ "toposort with schema" ]()

}).call(this);

//# sourceMappingURL=icql-dba-basics.js.map