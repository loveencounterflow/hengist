(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, isa, rpr, show_schemas_and_objects, test, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

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

  ({to_width} = require('to-width'));

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() 2"] = async function(T, done) {
    var Dba, cfg, template_path_1, template_path_2, work_path_1, work_path_2, work_path_3;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    //.........................................................................................................
    cfg = H.get_cfg();
    cfg.ref = 'multicon';
    //.........................................................................................................
    cfg.size = 'small';
    cfg.mode = 'fle';
    template_path_1 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_1 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_1:  ", work_path_1);
    //.........................................................................................................
    cfg.size = 'big';
    cfg.mode = 'fle';
    template_path_2 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_2 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_2:  ", work_path_2);
    //.........................................................................................................
    cfg.size = 'new';
    cfg.mode = 'fle';
    work_path_3 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_3:  ", work_path_3);
    await (async() => {      //.........................................................................................................
      var d, dba, path, schema;
      path = work_path_1;
      schema = 's1';
      await H.copy_over(template_path_1, path);
      dba = new Dba();
      dba.open({path, schema});
      T.eq(dba.get_schemas(), {
        main: '',
        s1: path
      });
      T.eq(dba.is_empty({
        schema: 'main'
      }), true);
      T.eq(dba.is_empty({
        schema: 's1'
      }), false);
      return T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward']);
    })();
    await (async() => {      //.........................................................................................................
      var d, dba, path, schema;
      path = work_path_1;
      schema = 'foo';
      await H.copy_over(template_path_1, path);
      dba = new Dba();
      dba.open({path, schema});
      help('^298789^', dba.get_schemas());
      T.eq(dba.get_schemas(), {
        main: '',
        [schema]: path
      });
      T.eq(dba.is_empty({
        schema: 'main'
      }, true));
      T.eq(dba.is_empty({schema}, false));
      return T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward']);
    })();
    await (async() => {      //.........................................................................................................
      var d, dba, k, schema_1, schema_2;
      schema_1 = 'datamill';
      schema_2 = 'chinook';
      await H.copy_over(template_path_1, work_path_1);
      await H.copy_over(template_path_2, work_path_2);
      dba = new Dba({
        path: work_path_1,
        schema: schema_1
      });
      debug('^567^', dba);
      debug('^567^', (function() {
        var results;
        results = [];
        for (k in dba) {
          results.push(k);
        }
        return results;
      })());
      debug('^567^', dba.open({
        path: work_path_2,
        schema: schema_2
      }));
      help('^58733^', dba.get_schemas());
      // T.eq dba.get_schemas(), { main: '', [schema]: path, }
      T.eq(dba.is_empty({
        schema: 'main'
      }, true));
      T.eq(dba.is_empty({
        schema: schema_1
      }, false));
      T.eq(dba.is_empty({
        schema: schema_2
      }, false));
      return T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({
          schema: schema_1
        });
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward']);
    })();
    await (async() => {      //.........................................................................................................
      /* use `Dba.open()` without arguments, get empty RAM DB in schema `main` */
      var d, dba, i, n, schema_1, schema_2, schema_3;
      schema_1 = 'datamill';
      schema_2 = 'chinook';
      schema_3 = 'new';
      await H.copy_over(template_path_1, work_path_1);
      await H.copy_over(template_path_2, work_path_2);
      await H.try_to_remove_file(work_path_3);
      dba = new Dba();
      dba.open({
        path: work_path_1,
        schema: schema_1
      });
      dba.open({
        path: work_path_2,
        schema: schema_2
      });
      dba.open({
        path: work_path_3,
        schema: schema_3
      });
      help('^58733^', dba.get_schemas());
      // T.eq dba.get_schemas(), { main: '', [schema]: path, }
      T.eq(dba.is_empty({
        schema: 'main'
      }, true));
      T.eq(dba.is_empty({
        schema: schema_1
      }, false));
      T.eq(dba.is_empty({
        schema: schema_2
      }, false));
      T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({
          schema: schema_1
        });
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward']);
      dba.execute("create table new.t ( id integer );");
      for (n = i = 1; i <= 9; n = ++i) {
        dba.execute(`insert into new.t values ( ${n} );`);
      }
      return T.eq(dba.list(dba.first_values(dba.query("select * from new.t;"))), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    })();
    await (() => {      //.........................................................................................................
      /* test whether data from previous test was persisted */
      var dba, schema_3;
      schema_3 = 'new';
      dba = new Dba();
      dba.open({
        path: work_path_3,
        schema: schema_3
      });
      return T.eq(dba.list(dba.first_values(dba.query("select * from new.t;"))), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: _list_temp_schema_numbers()"] = async function(T, done) {
    var Dba, cfg;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    //.........................................................................................................
    cfg = H.get_cfg();
    cfg.ref = 'foo';
    await (() => {      //.........................................................................................................
      var after_free_schema, before_free_schema, dba, detach_schemas, error, i, j, len, n, path, prefix, results, schema;
      dba = new Dba();
      path = '';
      prefix = dba.cfg._temp_prefix;
      detach_schemas = [];
      error = null;
      // debug '^4962^', dba._list_temp_schema_numbers()
      // debug '^4962^', dba._max_temp_schema_number()
      T.eq(dba._list_temp_schema_numbers(), []);
      T.eq(dba._max_temp_schema_number(), 0);
      try {
        for (n = i = 1; i <= 11; n = ++i) {
          schema = `${prefix}${n}`;
          before_free_schema = `${prefix}${n}`;
          after_free_schema = `${prefix}${n + 1}`;
          if (modulo(n, 2) === 0) {
            detach_schemas.unshift(schema);
          }
          T.eq(dba._get_free_temp_schema(), before_free_schema);
          dba._attach({schema, path});
          // debug '^4962^', dba._list_temp_schema_numbers()
          // debug '^4962^', dba._max_temp_schema_number()
          T.eq(dba._get_free_temp_schema(), after_free_schema);
          T.eq(dba._list_temp_schema_numbers(), (function() {
            var results = [];
            for (var j = 1; 1 <= n ? j <= n : j >= n; 1 <= n ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this));
          T.eq(dba._max_temp_schema_number(), n);
        }
      } catch (error1) {
        error = error1;
        if (!/too many attached databases/.test(error.message)) {
          throw error;
        }
        T.ok(true);
      }
      if (error == null) {
        T.fail("expected error (too many attached DBs), got none");
      }
      results = [];
      for (j = 0, len = detach_schemas.length; j < len; j++) {
        schema = detach_schemas[j];
        dba._detach({schema});
        // debug '^4962^', dba._list_temp_schema_numbers()
        results.push(T.eq(dba._max_temp_schema_number(), 9));
      }
      return results;
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import { format: 'db', }"] = async function(T, done) {
    var Dba, cfg, template_path_1, work_path_1;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    //.........................................................................................................
    cfg = H.get_cfg();
    cfg.ref = 'multicon';
    //.........................................................................................................
    cfg.size = 'small';
    cfg.mode = 'fle';
    template_path_1 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_1 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    await (async() => {      // help "^77-300^ work_path_1:  ", work_path_1
      //.........................................................................................................
      var d, dba, path, schema;
      path = work_path_1;
      schema = 's1';
      await H.copy_over(template_path_1, path);
      dba = new Dba();
      dba.import({path, schema});
      dba.list_schemas();
      T.eq(dba.get_schemas(), {
        main: '',
        s1: ''
      });
      T.eq(dba.is_empty({
        schema: 'main'
      }), true);
      T.eq(dba.is_empty({
        schema: 's1'
      }), false);
      T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward']);
      // for name in [ 'keys', 'main', 'realms', 'sources', ]
      //   debug '^34534^', dba.list dba.query "select * from #{name}"
      return T.eq(dba.list(dba.query("select * from realms;")), [
        {
          realm: 'input'
        },
        {
          realm: 'html'
        }
      ]);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___ DBA: import { format: 'sql', }"] = async function(T, done) {
    var Dba, cfg;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    cfg = H.get_cfg();
    await (() => {      //.........................................................................................................
      var dba, path, schema;
      path = cfg.sql.small;
      schema = 'datamill';
      dba = new Dba();
      // debug '^44474^', dba.execute ".mode columns"
      dba.import({path, schema});
      return debug('^44474^', dba.list_schemas());
    })();
    // T.eq dba.get_schemas(), { main: '', s1: '', }
    // T.eq ( dba.is_empty { schema: 'main', } ), true
    // T.eq ( dba.is_empty { schema: 's1', } ), false
    // T.eq ( d.name for d from dba.walk_objects { schema, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
    // # for name in [ 'keys', 'main', 'realms', 'sources', ]
    // #   debug '^34534^', dba.list dba.query "select * from #{name}"
    // T.eq ( dba.list dba.query "select * from realms;" ), [ { realm: 'input' }, { realm: 'html' }, ]
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: _walk_all_objects()"] = async function(T, done) {
    var Dba, cfg, objects_matcher, template_path_1, template_path_2, work_path_1, work_path_2;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    //.........................................................................................................
    cfg = H.get_cfg();
    cfg.ref = 'icqldba_schema';
    //.........................................................................................................
    cfg.size = 'small';
    cfg.mode = 'fle';
    template_path_1 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_1 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_1:  ", work_path_1);
    //.........................................................................................................
    cfg.size = 'big';
    cfg.mode = 'fle';
    template_path_2 = H.interpolate(cfg.db.templates[cfg.size], cfg);
    work_path_2 = H.interpolate(cfg.db.work[cfg.mode], cfg);
    help("^77-300^ work_path_2:  ", work_path_2);
    objects_matcher = [
      {
        seq: 1,
        schema: 'temp',
        name: 'temp1',
        type: 'table'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'sqlite_autoindex_keys_1',
        type: 'index'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'sqlite_autoindex_realms_1',
        type: 'index'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'sqlite_autoindex_sources_1',
        type: 'index'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'keys',
        type: 'table'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'main',
        type: 'table'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'realms',
        type: 'table'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'sources',
        type: 'table'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'dest_changes_backward',
        type: 'view'
      },
      {
        seq: 2,
        schema: 'd1',
        name: 'dest_changes_forward',
        type: 'view'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_AlbumArtistId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_CustomerSupportRepId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_EmployeeReportsTo',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_InvoiceCustomerId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_InvoiceLineInvoiceId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_InvoiceLineTrackId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_PlaylistTrackTrackId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_TrackAlbumId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_TrackGenreId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'IFK_TrackMediaTypeId',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'sqlite_autoindex_PlaylistTrack_1',
        type: 'index'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Album',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Artist',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Customer',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Employee',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Genre',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Invoice',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'InvoiceLine',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'MediaType',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Playlist',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'PlaylistTrack',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'Track',
        type: 'table'
      },
      {
        seq: 3,
        schema: 'd2',
        name: 'sqlite_sequence',
        type: 'table'
      }
    ];
    await (async() => {      // #.........................................................................................................
      // await do =>
      //   await H.copy_over template_path_1, work_path_1
      //   await H.copy_over template_path_2, work_path_2
      //   dba     = Dba.open { path: work_path_1, schema: 'd1', }
      //   dba.open { path: work_path_2, schema: 'd2', }
      //   dba.execute "create temporary table temp1 ( id integer primary key, name text );"
      //   debug '^44433^', dba.get_schemas()
      //   result = []
      //   for row from dba.walk_objects()
      //     row.sql = to_width row.sql, 20
      //     delete row.sql
      //     result.push row
      //   T.eq result, objects_matcher
      //   # debug '^33443^', result
      //.........................................................................................................
      var dba, ref1, result, row;
      await H.copy_over(template_path_1, work_path_1);
      await H.copy_over(template_path_2, work_path_2);
      dba = new Dba();
      dba.open({
        path: work_path_1,
        schema: 'd1'
      });
      dba.open({
        path: work_path_2,
        schema: 'd2'
      });
      dba.execute("create temporary table temp1 ( id integer primary key, name text );");
      debug('^44433^', dba.get_schemas());
      result = [];
      ref1 = dba.walk_objects();
      for (row of ref1) {
        row.sql = to_width(row.sql, 20);
        info('^44433^', row);
        delete row.sql;
        result.push(row);
      }
      return T.eq(result, objects_matcher);
    })();
    // debug '^33443^', result
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: as_sql"] = async function(T, done) {
    var ICQLDBA, dba, error, i, len, matcher, probe, probes_and_matchers;
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
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
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
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
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
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
  this["DBA: open from DB file"] = async function(T, done) {
    var ICQLDBA, cfg, d, dba, ignore, objects, path, s;
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
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
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
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
    dba._attach({
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
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
    //.........................................................................................................
    cfg = {
      pragmas: ['page_size = 4096', 'cache_size = 16384', 'temp_store = MEMORY', 'journal_mode = WAL', 'locking_mode = EXCLUSIVE', 'synchronous = OFF'],
      template_path: H.resolve_path('assets/icql/small-datamill.db'),
      work_path: H.resolve_path('data/icql/icql-dba-copy-schema.db'),
      // mem_schema:       'x'
      // mem_path:         ':memory:'
      // { schema: 'main', path: ( H.resolve_path 'data/icql/icql-dba-copy-schema.db' ), }
      // { schema: 'q',    path: ':memory:', }
      schemas: {
        main: H.resolve_path('data/icql/icql-dba-copy-schema.db'),
        q: ':memory:'
      },
      mem_schema: 'q'
    };
    //.........................................................................................................
    help('^754-1^', "cfg.mem_schema:    ", cfg.mem_schema);
    help('^754-2^', "cfg.template_path: ", cfg.template_path);
    help('^754-3^', "cfg.work_path:     ", cfg.work_path);
    await H.copy_over(cfg.template_path, cfg.work_path);
    //.........................................................................................................
    dba_cfg = {
      path: ':memory:'
    };
    // dba_cfg               = { path: cfg.work_path, echo: true, debug: true, }
    dba = new ICQLDBA.Dba(dba_cfg);
    //.........................................................................................................
    info('^754-4^', {
      path: cfg.work_path,
      schema: cfg.mem_schema
    });
    dba._attach({
      path: cfg.work_path,
      schema: cfg.mem_schema
    });
    show_schemas_and_objects('^754-5^', dba);
    dba.copy_schema({
      from_schema: cfg.mem_schema,
      to_schema: 'main'
    });
    show_schemas_and_objects('^754-6^', dba);
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
          debug('^33432^', {
            name: d.name,
            count
          });
          result[d.name] = `${d.type}|${count}`;
          break;
        default:
          throw new Error(`^45687^ unknown DB object type ${rpr(d.type)}`);
      }
    }
    // debug '^448978^', result
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

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: in-memory DB API"] = function(T, done) {
    var Dba, ICQLDBA;
    // T.halt_on_error()
    ICQLDBA = require(H.icql_dba_path);
    ({isa, validate} = ICQLDBA.types.export());
    //-----------------------------------------------------------------------------------------------------------
    Dba = class Dba extends ICQLDBA.Dba {
      //---------------------------------------------------------------------------------------------------------
      copy_db(cfg) {
        var from_path, from_schema, to_path, to_schema;
        from_path = pick(cfg, 'from_path', null);
        from_schema = pick(cfg, 'from_schema', 'file');
        to_path = pick(cfg, 'to_path', null);
        to_schema = pick(cfg, 'to_schema', 'file');
        // validate.icqldba_file_path
        // validate.icqldba_db_path
        validate.icqldba_path(from_path);
        validate.icqldba_path(to_path);
        this._copy_db(from_path, from_schema, to_path, to_schema);
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      _copy_db(from_path, from_schema, to_path, to_schema) {
        this._attach({
          path: from_path,
          schema: from_schema
        });
        this.copy_schema({from_schema, to_schema});
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      move_db(cfg) {
        var from_path, from_schema, to_path, to_schema;
        from_path = pick(cfg, 'from_path', null);
        from_schema = pick(cfg, 'from_schema', 'file');
        to_path = pick(cfg, 'to_path', null);
        to_schema = pick(cfg, 'to_schema', 'file');
        validate.icqldba_path(from_path);
        validate.icqldba_path(to_path);
        this._copy_db(from_path, from_schema, to_path, to_schema);
        this._detach({
          schema: from_schema
        });
        return null;
      }

    };
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "DBA: copy file DB to memory" ]
// test @[ "DBA: open()" ]
// test @[ "DBA: _walk_all_objects()" ]
// test @[ "DBA: import { format: 'db', }" ]
// test @[ "DBA: import { format: 'sql', }" ]
// test @[ "DBA: _list_temp_schema_numbers()" ]
// @[ "DBA: open()" ]()
// test @[ "DBA: in-memory DB API" ]
// test @[ "DBA: as_sql" ]
// test @[ "DBA: interpolate" ]
// test @[ "toposort with schema" ]
// @[ "toposort with schema" ]()

}).call(this);

//# sourceMappingURL=_unused-tests.js.map