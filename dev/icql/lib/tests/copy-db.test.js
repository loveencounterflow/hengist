(function() {
  'use strict';
  var CND, FSP, H, LFT, PATH, badge, chance, debug, echo, get_cfg, help, info, inspect, is_new, isa, jr, rpr, test, to_width, types, urge, validate, validate_list_of, warn, whisper;

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
  test = require('../../../../apps/guy-test');

  jr = JSON.stringify;

  ({inspect} = require('util'));

  //...........................................................................................................
  PATH = require('path');

  FSP = require('fs/promises');

  H = require('./helpers');

  LFT = require('letsfreezethat');

  chance = new (require('chance'))();

  types = new (require('intertype')).Intertype();

  ({isa, validate, validate_list_of} = types.export());

  ({to_width} = require('to-width'));

  //-----------------------------------------------------------------------------------------------------------
  is_new = function(x) {
    var R;
    R = !is_new.cache.has(x);
    is_new.cache.set(x, true);
    return R;
  };

  is_new.cache = new Map();

  //-----------------------------------------------------------------------------------------------------------
  get_cfg = function() {
    var R;
    R = {
      // word_count: 10_000
      word_count: 10,
      db: {
        templates: {
          small: H.resolve_path('assets/icql/small-datamill.db'),
          big: H.resolve_path('assets/icql/Chinook_Sqlite_AutoIncrementPKs.db')
        },
        target: {
          small: H.resolve_path('data/icql/icql-copy-db-{ref}-{size}.db'),
          big: H.resolve_path('data/icql/icql-copy-db-{ref}-{size}.db')
        },
        work: {
          mem: ':memory:',
          fle: 'data/icql/copy-schemas-work-{ref}-{size}.db'
        },
        temp: {
          small: H.resolve_path('data/icql/icql-copy-db-{ref}-{size}-temp.db'),
          big: H.resolve_path('data/icql/icql-copy-db-{ref}-{size}-temp.db')
        },
        old: {
          small: H.resolve_path('data/icql/icql-copy-db-{ref}-{size}-old.db'),
          big: H.resolve_path('data/icql/icql-copy-db-{ref}-{size}-old.db')
        }
      },
      pragma_sets: {
        //.....................................................................................................
        /* thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 */
        fle: ['page_size = 4096', 'cache_size = 16384', 'temp_store = MEMORY', 'journal_mode = WAL', 'locking_mode = EXCLUSIVE', 'synchronous = OFF'],
        //.....................................................................................................
        mem: [],
        bare: []
      }
    };
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["reuse memory DB"] = function(T, done) {
    var ICQL, db, doit, settings;
    ICQL = require('../../../../apps/icql');
    settings = H.get_icql_settings(true);
    settings.echo = true;
    db = null;
    doit = function() {
      var schema, schema_x;
      db = ICQL.bind(settings);
      schema = 'd2';
      schema_x = db.$.as_identifier(schema);
      db.$.attach(':memory:', schema);
      db.$.execute(`create table ${schema_x}.x ( id integer primary key );`);
      return db.$.execute(`insert into ${schema_x}.x values ( 123 );`);
    };
    // db.$.close()
    //.........................................................................................................
    doit();
    doit();
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["mirror DB to memory"] = function(T, done) {
    var ICQL, _, db, df1, df2, dt1, dt2, field_name, field_name_x, from_schema, get_name, i, id, j, k, len, length, n, names, pool, settings, table_name, table_name_x, to_schema;
    T.halt_on_error();
    ICQL = require('../../../../apps/icql');
    settings = H.get_icql_settings(true);
    debug('^78445^', settings);
    // H.try_to_remove_file settings.db_path
    // return done()
    settings.echo = true;
    db = ICQL.bind(settings);
    from_schema = 'main';
    to_schema = 'd2';
    pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[] äöü壽';
    length = 10;
    get_name = function() {
      return chance.string({pool, length});
    };
    names = (function() {
      var i, results;
      results = [];
      for (_ = i = 1; i <= 10; _ = ++i) {
        results.push([get_name(), get_name()]);
      }
      return results;
    })();
    //.........................................................................................................
    db.create_tables_with_foreign_key();
    db.populate_tables_with_foreign_key();
    db.$.execute("create view main.x as select * from t2 order by key desc;");
    /* NOTE following line tests whether inline comments are filtered out */
    db.$.execute("create /* foo */ table main.[K1] ( id integer primary key, fk_k2 integer references [k2] ( id ) );");
    db.$.execute("create table main.[k2] ( id integer primary key, fk_k1 integer references [K1] ( id ) );");
    db.$.pragma("foreign_keys = off;");
    for (id = i = 1; i <= 9; id = ++i) {
      db.$.execute(`insert into main.[K1] values ( ${id}, ${id} );`);
      db.$.execute(`insert into main.[k2] values ( ${id}, ${id} );`);
    }
    db.$.pragma("foreign_keys = on;");
//.........................................................................................................
    for (j = 0, len = names.length; j < len; j++) {
      [table_name, field_name] = names[j];
      table_name_x = db.$.as_identifier(table_name);
      field_name_x = db.$.as_identifier(field_name);
      db.$.execute(`create table ${table_name_x} ( ${field_name_x} text );`);
      for (n = k = 1; k <= 3; n = ++k) {
        db.$.execute(`insert into ${table_name_x} values ( ? );`, get_name());
      }
    }
    //.........................................................................................................
    db.$.attach(':memory:', to_schema);
    db.$.copy_schema(from_schema, to_schema);
    //.........................................................................................................
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
      // db.$.query "xxx"
      // throw new Error '^intentional-error@348374^'
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["use API to do CRUD in memory (raw)"] = async function(T, done) {
    var ICQL, db_old_path, db_target_path, db_temp_path, db_template_path, db_work_path, fle_schema, icql_cfg, matcher, part_1_scaffold_db_files, part_2_crud, part_3_reread_db, pragmas, probe, test_cfg, word_count, work_schema;
    ICQL = require('../../../../apps/icql');
    if (T != null) {
      T.halt_on_error();
    }
    //.........................................................................................................
    word_count = 10;
    probe = (H.get_data({word_count})).texts;
    matcher = [...probe].sort();
    icql_cfg = H.get_icql_settings(true);
    icql_cfg.echo = true;
    icql_cfg.echo = false;
    test_cfg = get_cfg();
    test_cfg.mode = 'mem';
    // test_cfg.size     = 'big'
    test_cfg.size = 'small';
    test_cfg.ref = 'crud-in-mem';
    test_cfg.pragmas = 'fle';
    pragmas = null;
    db_work_path = null;
    db_template_path = null;
    db_target_path = null;
    db_temp_path = null;
    db_old_path = null;
    fle_schema = 'main';
    work_schema = 'x';
    //.........................................................................................................
    part_1_scaffold_db_files = async function() {
      //.......................................................................................................
      pragmas = test_cfg.pragma_sets[test_cfg.pragmas];
      validate_list_of.nonempty_text(pragmas);
      //.......................................................................................................
      validate.nonempty_text(test_cfg.ref);
      db_work_path = H.interpolate(test_cfg.db.work[test_cfg.mode], test_cfg);
      db_template_path = H.interpolate(test_cfg.db.templates[test_cfg.size], test_cfg);
      db_target_path = H.interpolate(test_cfg.db.target[test_cfg.size], test_cfg);
      db_temp_path = H.interpolate(test_cfg.db.temp[test_cfg.size], test_cfg);
      db_old_path = H.interpolate(test_cfg.db.old[test_cfg.size], test_cfg);
      //.......................................................................................................
      validate.nonempty_text(db_template_path);
      validate.nonempty_text(db_target_path);
      validate.nonempty_text(db_temp_path);
      //.......................................................................................................
      // if gcfg.verbose
      help("^43-300^ template  DB:", db_template_path);
      help("^43-301^ work      DB:", db_work_path);
      help("^43-302^ target    DB:", db_target_path);
      help("^43-303^ temp      DB:", db_temp_path);
      H.try_to_remove_file(db_target_path);
      H.try_to_remove_file(db_temp_path);
      if (db_work_path !== ':memory:') {
        H.try_to_remove_file(db_work_path);
      }
      await FSP.copyFile(db_template_path, db_target_path);
      return null;
    };
    //.........................................................................................................
    part_2_crud = async function() {
      var db, i, insert, j, k, len, len1, len2, nr, object, ref, ref1, result, retrieve, row, schema, text, work_schema_x;
      db = ICQL.bind(icql_cfg);
      work_schema_x = db.$.as_identifier(work_schema);
      //.......................................................................................................
      // Attach and populate memory DB:
      db.$.attach(db_work_path, work_schema);
      db.$.copy_schema(fle_schema, work_schema);
      //.......................................................................................................
      // Create new table:
      db.$.execute(`drop table if exists ${work_schema_x}.test;`);
      db.$.execute(`create table ${work_schema_x}.test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
      //.......................................................................................................
      // Insert data into new table:
      insert = db.$.prepare(`insert into ${work_schema_x}.test ( nr, text ) values ( ?, ? );`);
      nr = 0;
      for (i = 0, len = probe.length; i < len; i++) {
        text = probe[i];
        nr++;
        insert.run([nr, text]);
      }
      //.......................................................................................................
      // Read data to ensure it was written:
      retrieve = db.$.prepare(`select * from ${work_schema_x}.test order by text;`);
      result = (function() {
        var ref, results;
        ref = retrieve.iterate();
        results = [];
        for (row of ref) {
          results.push(row.text);
        }
        return results;
      })();
      if (T != null) {
        T.eq(result, matcher);
      }
      //.......................................................................................................
      debug('^76667^', db.$.list_schema_names());
      ref = db.$.list_schema_names();
      for (j = 0, len1 = ref.length; j < len1; j++) {
        schema = ref[j];
        info(`schema ${rpr(schema)}`);
        ref1 = db.$.list_objects(schema);
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          object = ref1[k];
          urge(' ', object.name, to_width(rpr(object.sql), 50));
        }
      }
      //.......................................................................................................
      // Export data, swap DB file to get additions into new DB at old path:
      db.$.execute(`vacuum ${work_schema_x} into ${db.$.as_sql(db_temp_path)};`);
      db.$.close();
      help(`^43-304^ removing ${db_old_path}`);
      H.try_to_remove_file(db_old_path);
      help(`^43-305^ renaming ${db_target_path} -> ${db_old_path}`);
      await FSP.rename(db_target_path, db_old_path);
      help(`^43-306^ renaming ${db_temp_path} -> ${db_target_path}`);
      await FSP.rename(db_temp_path, db_target_path);
      return null;
    };
    //.........................................................................................................
    part_3_reread_db = function() {
      var db, fle_schema_x, result, retrieve, row;
      //.......................................................................................................
      // Re-open DB:
      icql_cfg = LFT._deep_copy(icql_cfg);
      // icql_cfg.db_path  = db_temp_path
      icql_cfg.db_path = db_target_path;
      db = ICQL.bind(icql_cfg);
      fle_schema_x = db.$.as_identifier(fle_schema);
      //.......................................................................................................
      // Re-read data:
      retrieve = db.$.prepare(`select * from ${fle_schema_x}.test order by text;`);
      result = (function() {
        var ref, results;
        ref = retrieve.iterate();
        results = [];
        for (row of ref) {
          results.push(row.text);
        }
        return results;
      })();
      debug('^40598^', result);
      return null;
    };
    //.........................................................................................................
    await part_1_scaffold_db_files();
    if (done != null) {
      // await part_2_crud()
      // await part_3_reread_db()
      return done();
    }
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @
    // test @[ "reuse memory DB" ]
    // test @[ "mirror DB to memory" ]
    test(this["use API to do CRUD in memory (raw)"]);
  }

  // @[ "use API to do CRUD in memory (raw)" ]()
// @[ "mirror DB to memory" ]()

}).call(this);

//# sourceMappingURL=copy-db.test.js.map