(function() {
  'use strict';
  var CND, PATH, badge, debug, echo, help, info, rpr, test, urge, warn, whisper;

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
    var ICQLDBA, d, dba, i, id, j, len, ref;
    // T.halt_on_error()
    ICQLDBA = require('../../../../apps/icql/dba');
    dba = new ICQLDBA.Dba();
    //.........................................................................................................
    // Create tables, indexes:
    dba.execute("create table main.k1 ( id integer primary key, fk_k2 integer unique references k2 ( id ) );");
    dba.execute("create table main.k2 ( id integer primary key, fk_k1 integer unique references k1 ( id ) );");
    ref = dba.list_objects();
    //.........................................................................................................
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
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
    for (id = j = 1; j <= 9; id = ++j) {
      dba.execute(`insert into main.k1 values ( ${id}, ${id} );`);
      dba.execute(`insert into main.k2 values ( ${id}, ${id} );`);
    }
    dba.set_foreign_key_state(true);
    T.eq(dba.get_foreign_key_state(), true);
    //.........................................................................................................
    T.eq((function() {
      var k, len1, ref1, results;
      ref1 = dba.list_objects();
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        d = ref1[k];
        results.push(d.name);
      }
      return results;
    })(), ['sqlite_autoindex_k1_1', 'sqlite_autoindex_k2_1', 'k1', 'k2']);
    T.eq(dba.all_rows(dba.query("select * from k1 join k2 on ( k1.fk_k2 = k2.id );")), [
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
      var k, len1, ref1, results;
      ref1 = dba.list_objects();
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        d = ref1[k];
        results.push(d.name);
      }
      return results;
    })(), []);
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @
    // test @[ "DBA: as_sql" ]
    // test @[ "DBA: interpolate" ]
    test(this["DBA: clear()"]);
  }

  // test @[ "toposort with schema" ]
// @[ "toposort with schema" ]()

}).call(this);

//# sourceMappingURL=icql-dba-basics.js.map