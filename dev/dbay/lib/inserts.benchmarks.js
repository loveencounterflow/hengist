(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, SQL, alert, badge, data_cache, debug, echo, freeze, gcfg, help, info, jr, log, paths, pragmas, rpr, show_result, test, try_to_remove_file, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'IN-MEMORY-SQL';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  DATA = require('../../../lib/data-providers-nocache');

  test = require('guy-test');

  ({jr} = CND);

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  gcfg = {
    verbose: false
  };

  ({freeze} = require('letsfreezethat'));

  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  paths = {
    fle: '/tmp/hengist-in-memory-sql.benchmarks.db',
    fle_jmdel: '/tmp/hengist-in-memory-sql.jmdel.benchmarks.db',
    fle_jmtrunc: '/tmp/hengist-in-memory-sql.jmtrunc.benchmarks.db',
    fle_jmpers: '/tmp/hengist-in-memory-sql.jmpers.benchmarks.db',
    fle_jmmem: '/tmp/hengist-in-memory-sql.jmmem.benchmarks.db',
    fle_jmwal: '/tmp/hengist-in-memory-sql.jmwal.benchmarks.db',
    fle_jmoff: '/tmp/hengist-in-memory-sql.jmoff.benchmarks.db',
    fle_mmap: '/tmp/hengist-in-memory-sql.mmap.benchmarks.db',
    fle_tmpm: '/tmp/hengist-in-memory-sql.tmpm.benchmarks.db',
    fle_pgsze: '/tmp/hengist-in-memory-sql.tmpm.benchmarks.db',
    fle_thrds: '/tmp/hengist-in-memory-sql.thrds.benchmarks.db',
    fle_qtforum1: '/tmp/hengist-in-memory-sql.qtforum1.benchmarks.db',
    fle_qtforum2: '/tmp/hengist-in-memory-sql.qtforum2.benchmarks.db'
  };

  //-----------------------------------------------------------------------------------------------------------
  pragmas = {
    //.........................................................................................................
    /* thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 */
    qtforum1: ['page_size = 4096', 'cache_size = 16384', 'temp_store = MEMORY', 'journal_mode = OFF', 'locking_mode = EXCLUSIVE', 'synchronous = OFF'],
    qtforum2: ['page_size = 4096', 'cache_size = 16384', 'temp_store = MEMORY', 'journal_mode = WAL', 'locking_mode = EXCLUSIVE', 'synchronous = OFF']
  };

  //.........................................................................................................

  //-----------------------------------------------------------------------------------------------------------
  try_to_remove_file = function(path) {
    var error;
    try {
      FS.unlinkSync(path);
    } catch (error1) {
      error = error1;
      if (error.code === 'ENOENT') {
        return;
      }
      throw error;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_result = function(name, result) {
    info('-----------------------------------------------');
    urge(name);
    whisper(result);
    info('-----------------------------------------------');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var texts;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    // DATOM = require '../../../apps/datom'
    //.........................................................................................................
    texts = DATA.get_words(cfg.word_count);
    //.........................................................................................................
    data_cache = {texts};
    data_cache = freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pgmem = function(cfg) {
    return new Promise((resolve) => {
      var PGM, count, data, db, table;
      db = (require('pg-mem')).newDb();
      PGM = require('pg-mem');
      data = this.get_data(cfg);
      count = 0;
      //.........................................................................................................
      /* PGM data types:
       array, bigint, bool, box, bytea, circlecitext, date, decimal, float, inet, integer, interval, json,
       jsonb, line, lseg, null, path, point, polygon, record, regclass, regtype, text, time, timestamp,
       timestampz, uuid */
      // generate_series = ( first_n, last_n ) => 42
      // generate_series_des = {
      //   name:             'generate_series',
      //   args:             [ PGM.DataType.integer, PGM.DataType.integer, ],
      //   returns:          PGM.DataType.integer,
      //   implementation:   generate_series, }
      // db.public.registerFunction generate_series
      // debug db.public.many """select * from generate_series( 1, 10 ) as n;"""
      //.........................................................................................................
      db.public.none(`create table test(
  id    integer generated by default as identity primary key,
  nr    integer not null,
  text  text );`);
      table = db.public.getTable('test');
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var i, len, nr, ref, result, text;
          if (cfg.use_transaction) {
            db.public.none("begin;");
          }
          nr = 0;
          ref = data.texts;
          for (i = 0, len = ref.length; i < len; i++) {
            text = ref[i];
            nr++;
            table.insert({nr, text});
          }
          if (cfg.use_transaction) {
            db.public.none("commit;");
          }
          result = db.public.many(`select * from test order by text;`);
          count += result.length;
          if (gcfg.verbose) {
            show_result('pgmem', result);
          }
          // db.close()
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pgmem_tx = (cfg) => {
    return this.pgmem({
      ...cfg,
      use_transaction: true
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.bsqlt_membacked = function(cfg, use_membacked = true) {
    return new Promise((resolve) => {
      var Db, populate_file;
      Db = require('better-sqlite3');
      // db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
      //.........................................................................................................
      (populate_file = () => {
        var count, data, db_cfg, db_path, filedb, i, insert, len, nr, ref, retrieve, text;
        db_cfg = null;
        db_path = "/tmp/hengist-in-memory-sql.benchmarks.membacked.db";
        filedb = new Db(db_path, db_cfg);
        data = this.get_data(cfg);
        count = 0;
        //.........................................................................................................
        // filedb.unsafeMode true
        // filedb.pragma 'cache_size = 32000'
        filedb.pragma('synchronous = OFF'); // makes file-based DBs much faster
        //.........................................................................................................
        filedb.exec(`drop table if exists test;`);
        filedb.exec(`create table test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
        // debug '^22233^', filedb.exec """insert into test ( nr, text ) values ( 1, '2' );"""
        insert = filedb.prepare(`insert into test ( nr, text ) values ( ?, ? );`);
        retrieve = filedb.prepare(`select * from test order by text;`);
        nr = 0;
        ref = data.texts;
        for (i = 0, len = ref.length; i < len; i++) {
          text = ref[i];
          nr++;
          insert.run([nr, text]);
        }
        filedb.backup(':memory:');
        return null;
      })();
      //.........................................................................................................
      resolve(() => {
        return new Promise(async(resolve) => {
          var result;
          result = retrieve.all();
          count += result.length;
          if (gcfg.verbose) {
            show_result('bettersqlite3', result);
          }
          if (do_backup) {
            await db.backup(':memory:');
          }
          db.close();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._btsql3 = function(cfg) {
    return new Promise((resolve) => {
      var Db, count, data, db, db_cfg, defaults, i, insert, len, pragma, ref, retrieve;
      Db = require('better-sqlite3');
      // db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
      defaults = {
        do_backup: false,
        pragmas: []
      };
      cfg = {...defaults, ...cfg};
      db_cfg = null;
      if (cfg.db_path !== ':memory:') {
        try_to_remove_file(cfg.db_path);
      }
      db = new Db(cfg.db_path, db_cfg);
      data = this.get_data(cfg);
      count = 0;
      //.........................................................................................................
      // db.unsafeMode true
      // db.pragma 'cache_size = 32000'
      db.pragma('synchronous = OFF'); // makes file-based DBs much faster
      ref = cfg.pragmas;
      for (i = 0, len = ref.length; i < len; i++) {
        pragma = ref[i];
        db.pragma(pragma);
      }
      //.........................................................................................................
      // db.exec """drop table if exists test;"""
      db.exec(`create table test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
      // debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
      insert = db.prepare(`insert into test ( nr, text ) values ( ?, ? );`);
      retrieve = db.prepare(`select * from test order by text;`);
      retrieve.raw(true);
      //.........................................................................................................
      resolve(() => {
        return new Promise(async(resolve) => {
          var j, len1, nr, ref1, result, text;
          nr = 0;
          if (cfg.use_transaction) {
            db.exec("begin transaction;");
          }
          ref1 = data.texts;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            text = ref1[j];
            nr++;
            insert.run([nr, text]);
          }
          if (cfg.use_transaction) {
            db.exec("commit;");
          }
          result = retrieve.all();
          count += result.length;
          if (gcfg.verbose) {
            show_result('bettersqlite3', result);
          }
          if (cfg.do_backup) {
            await db.backup(`/tmp/hengist-in-memory-sql.benchmarks.backup-${Date.now()}.db`);
          }
          db.close();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.bsqlt_mem = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:'
    });
  };

  this.bsqlt_mem_tx = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:',
      use_transaction: true
    });
  };

  this.bsqlt_mem_tx_jmwal = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:',
      use_transaction: true,
      pragmas: ['journal_mode = WAL;']
    });
  };

  this.bsqlt_mem_thrds = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:',
      pragmas: ['threads = 4;']
    });
  };

  this.bsqlt_mem_jmoff = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:',
      pragmas: ['journal_mode = OFF;']
    });
  };

  this.bsqlt_mem_jmwal = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:',
      pragmas: ['journal_mode = WAL;']
    });
  };

  this.bsqlt_mem_backup = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: ':memory:',
      do_backup: true
    });
  };

  //...........................................................................................................
  this.bsqlt_fle = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle
    });
  };

  this.bsqlt_fle_tx = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle,
      use_transaction: true
    });
  };

  this.bsqlt_fle_tx_jmwal = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle,
      use_transaction: true,
      pragmas: ['journal_mode = WAL;']
    });
  };

  this.bsqlt_fle_jmdel = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_jmdel,
      pragmas: ['journal_mode = DELETE;']
    });
  };

  this.bsqlt_fle_jmtrunc = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_jmtrunc,
      pragmas: ['journal_mode = TRUNCATE;']
    });
  };

  this.bsqlt_fle_jmpers = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_jmpers,
      pragmas: ['journal_mode = PERSIST;']
    });
  };

  this.bsqlt_fle_jmmem = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_jmmem,
      pragmas: ['journal_mode = MEMORY;']
    });
  };

  this.bsqlt_fle_jmwal = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_jmwal,
      pragmas: ['journal_mode = WAL;']
    });
  };

  this.bsqlt_fle_jmoff = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_jmoff,
      pragmas: ['journal_mode = OFF;']
    });
  };

  this.bsqlt_fle_mmap = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_mmap,
      pragmas: ['mmap_size = 30000000000;']
    });
  };

  this.bsqlt_fle_tmpm = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_tmpm,
      pragmas: ['temp_store = MEMORY;']
    });
  };

  this.bsqlt_fle_pgsze = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_pgsze,
      pragmas: ['page_size = 32768;']
    });
  };

  this.bsqlt_fle_thrds = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_thrds,
      pragmas: ['threads = 4;']
    });
  };

  this.bsqlt_fle_qtforum1 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_qtforum1,
      pragmas: pragmas.qtforum1
    });
  };

  this.bsqlt_fle_qtforum2 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: paths.fle_qtforum2,
      pragmas: pragmas.qtforum2
    });
  };

  //...........................................................................................................
  this.bsqlt_tmpfs = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db'
    });
  };

  this.bsqlt_tmpfs_qtforum2 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: pragmas.qtforum2
    });
  };

  this.bsqlt_tmpfs_tx = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      use_transaction: true
    });
  };

  this.bsqlt_tmpfs_tx_jmwal = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      use_transaction: true,
      pragmas: ['journal_mode = WAL;']
    });
  };

  this.bsqlt_tmpfs_jmoff = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: ['journal_mode = OFF;']
    });
  };

  this.bsqlt_tmpfs_jmwal = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: ['journal_mode = WAL;']
    });
  };

  this.bsqlt_tmpfs_jmoff32 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: ['journal_mode = OFF;', 'page_size = 32768;', 'cache_size = 32768;']
    });
  };

  this.bsqlt_tmpfs_jmwal32 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: ['journal_mode = WAL;', 'page_size = 32768;', 'cache_size = 32768;']
    });
  };

  this.bsqlt_tmpfs_jmwal_mm0 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: ['journal_mode = WAL;', 'mmap_size = 0;']
    });
  };

  this.bsqlt_tmpfs_jmwal32_mm0 = (cfg) => {
    return this._btsql3({
      ...cfg,
      db_path: '/dev/shm/ram.db',
      pragmas: ['journal_mode = WAL;', 'page_size = 32768;', 'cache_size = 32768;', 'mmap_size = 0;']
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.bsqlt_mem_noprepare = function(cfg) {
    return new Promise((resolve) => {
      var Db, count, data, db, db_cfg;
      Db = require('better-sqlite3');
      // db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
      db_cfg = null;
      db = new Db(':memory:', db_cfg);
      data = this.get_data(cfg);
      count = 0;
      //.........................................................................................................
      // db.unsafeMode true
      // db.pragma 'cache_size = 32000'
      db.pragma('synchronous = OFF'); // makes file-based DBs much faster
      //.........................................................................................................
      db.exec(`drop table if exists test;`);
      db.exec(`create table test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var i, insert, len, nr, ref, result, retrieve, text;
          nr = 0;
          ref = data.texts;
          for (i = 0, len = ref.length; i < len; i++) {
            text = ref[i];
            nr++;
            insert = db.prepare(`insert into test ( nr, text ) values ( ?, ? );`);
            insert.run([nr, text]);
          }
          retrieve = db.prepare(`select * from test order by text;`);
          result = retrieve.all();
          count += result.length;
          if (gcfg.verbose) {
            show_result('bettersqlite3', result);
          }
          db.close();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._bsqlt_memory_icql = function(cfg, icql_version) {
    return new Promise((resolve) => {
      var Db, ICQL, count, data, db, icql_cfg, icql_path;
      Db = require('better-sqlite3');
      icql_path = PATH.resolve(PATH.join(__dirname, '../demo-frp.icql'));
      ICQL = require((function() {
        switch (icql_version) {
          case 'icql_latest':
            return '../../../apps/icql';
          case 'icql515':
            return 'icql515';
          default:
            throw new Error(`^45458^ unknown icql_version: ${rpr(icql_version)}`);
        }
      })());
      icql_cfg = {
        connector: Db,
        db_path: ':memory:',
        icql_path: icql_path
      };
      db = ICQL.bind(icql_cfg);
      db.create_table_text();
      data = this.get_data(cfg);
      count = 0;
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var i, len, line, linenr, ref, result;
          linenr = 0;
          ref = data.texts;
          for (i = 0, len = ref.length; i < len; i++) {
            line = ref[i];
            linenr++;
            db.insert_line({linenr, line});
          }
          result = db.$.all_rows(db.get_all_texts());
          count += result.length;
          if (gcfg.verbose) {
            show_result('bsqlt_memory_icql', result);
          }
          db.$.db.close();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.bsqlt_mem_icql515 = function(cfg) {
    return this._bsqlt_memory_icql(cfg, 'icql515');
  };

  this.bsqlt_mem_icql_latest = function(cfg) {
    return this._bsqlt_memory_icql(cfg, 'icql_latest');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.sqljs = function(cfg) {
    return new Promise(async(resolve) => {
      var DB/* NOTE this is the default import */, count, data, db, initSqlJs, insert, retrieve;
      // initSqlJs            = require 'sql.js/dist/sql-asm-debug.js'
      // initSqlJs            = require 'sql.js/dist/sql-asm-memory-growth.js'
      // initSqlJs            = require 'sql.js/dist/sql-asm.js'
      // initSqlJs            = require 'sql.js/dist/sql-wasm-debug.js'
      initSqlJs = require('sql.js/dist/sql-wasm.js');
      DB = (await initSqlJs());
      // debug ( k for k of require 'sql.js')
      // debug ( k for k of DB)
      // debug DB
      // debug ( k for k of DB.default)
      // debug ( k for k of DB.default.default)
      db = new DB.Database();
      data = this.get_data(cfg);
      count = 0;
      //.........................................................................................................
      db.run(`create table test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
      // debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
      insert = db.prepare(`insert into test ( nr, text ) values ( ?, ? );`);
      retrieve = db.prepare(`select * from test order by text;`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var i, len, nr, ref, result, text;
          if (cfg.use_transaction) {
            db.run("begin transaction;");
          }
          nr = 0;
          ref = data.texts;
          for (i = 0, len = ref.length; i < len; i++) {
            text = ref[i];
            nr++;
            /* TAINT use prepared statement */
            // db.run """insert into test ( nr, text ) values ( ?, ? );""", [ nr, text, ]
            insert.bind([nr, text]);
            while (insert.step()) {
              insert.get();
            }
          }
          if (cfg.use_transaction) {
            db.run("commit;");
          }
          // debug (k for k of retrieve)
          // retrieve.bind(); result = []; result.push retrieve.getAsObject()  while retrieve.step()
          result = [];
          db.each(`select * from test order by text;`, [], function(row) {
            return result.push(row);
          });
          // retrieve.bind(); result = []; result.push retrieve.get()          while retrieve.step()
          count += result.length;
          if (gcfg.verbose) {
            show_result('sqljs', result);
          }
          db.close();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.sqljs_tx = function(cfg) {
    return this.sqljs({
      ...cfg,
      use_transaction: true
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.porsagerpostgres_tx = function(cfg) {
    return new Promise(async(resolve) => {
      var count, data, postgres, sql;
      postgres = require('postgres');
      sql = postgres('postgres://interplot@localhost:5432/interplot');
      count = 0;
      data = this.get_data(cfg);
      //.........................................................................................................
      // await sql"""begin transaction;"""
      await sql`drop table if exists test cascade;`;
      await sql`create table test(
  id    integer generated by default as identity primary key,
  nr    integer not null,
  text  text );`;
      //.........................................................................................................
      resolve(() => {
        return new Promise(async(resolve) => {
          var nr, result;
          // { rows }     = await sql"select * from MIRAGE.mirror order by dsk, dsnr, linenr limit 10;"
          nr = 0;
          await sql.begin(async(sql) => {
            var i, len, ref, results, text;
            ref = data.texts;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              text = ref[i];
              nr++;
              results.push((await sql`insert into test ( nr, text ) values ( ${nr}, ${text} );`));
            }
            return results;
          });
          result = (await sql`select * from test order by text;`);
          if (gcfg.verbose) {
            show_result('bettersqlite3', result);
          }
          count += result.length;
          await sql.end({
            timeout: 0
          });
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.briancpg_tx = function(cfg) {
    return new Promise(async(resolve) => {
      var count, data, db, db_cfg, pool;
      db_cfg = {
        database: 'interplot',
        user: 'interplot',
        port: 5432
      };
      pool = new (require('pg')).Pool(db_cfg);
      db = (await pool.connect());
      count = 0;
      data = this.get_data(cfg);
      //.........................................................................................................
      // await sql"""begin transaction;"""
      await db.query(`drop table if exists test cascade;`);
      await db.query(`create table test(
  id    integer generated by default as identity primary key,
  nr    integer not null,
  text  text );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise(async(resolve) => {
          var i, len, nr, q, ref, result, text;
          await db.query("truncate table test;");
          try {
            await db.query('begin');
            q = {
              text: `insert into test ( nr, text ) values ( $1, $2 );`,
              rowMode: 'array'/* TAINT does not seem to work */,
              values: [0, '']
            };
            nr = 0;
            ref = data.texts;
            for (i = 0, len = ref.length; i < len; i++) {
              text = ref[i];
              nr++;
              q.values = [nr, text];
              await db.query(q);
            }
            result = (await db.query(`select * from test order by text;`));
            await db.query('commit');
            if (gcfg.verbose) {
              show_result('briancpg_tx', result.rows);
            }
            count += result.rows.length;
            await resolve(count);
          } finally {
            db.release();
            pool.end();
          }
          return resolve(1);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._dbay_prep1 = function(cfg) {
    return new Promise((resolve) => {
      var Dbay, count, data, db, db_cfg, defaults, i, insert, len, pragma, ref, ref1, retrieve;
      ({Dbay} = require('../../../apps/dbay'));
      defaults = {};
      cfg = {...defaults, ...cfg};
      db_cfg = {
        path: cfg.db_path
      };
      try_to_remove_file(cfg.db_path);
      db = new Dbay(db_cfg);
      data = this.get_data(cfg);
      count = 0;
      ref1 = (ref = cfg.pragmas) != null ? ref : [];
      for (i = 0, len = ref1.length; i < len; i++) {
        pragma = ref1[i];
        //.........................................................................................................
        // db.pragma 'synchronous = OFF' # makes file-based DBs much faster
        db.pragma(pragma);
      }
      //.........................................................................................................
      // db.exec """drop table if exists test;"""
      db(SQL`create table test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
      // debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
      insert = db.prepare(SQL`insert into test ( nr, text ) values ( ?, ? );`);
      retrieve = db.prepare(SQL`select * from test order by text;`);
      retrieve.raw(true);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var j, len1, nr, ref2, result, text;
          nr = 0;
          if (cfg.use_transaction) {
            db.execute("begin transaction;");
          }
          ref2 = data.texts;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            text = ref2[j];
            nr++;
            insert.run([nr, text]);
          }
          if (cfg.use_transaction) {
            db.execute("commit;");
          }
          result = retrieve.all();
          count += result.length;
          if (gcfg.verbose) {
            show_result('_dbay_prep1', result);
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._dbay_naive = function(cfg) {
    return new Promise((resolve) => {
      var Dbay, count, data, db, db_cfg, defaults, i, len, pragma, ref, ref1;
      ({Dbay} = require('../../../apps/dbay'));
      defaults = {};
      cfg = {...defaults, ...cfg};
      db_cfg = {
        path: cfg.db_path
      };
      try_to_remove_file(cfg.db_path);
      db = new Dbay(db_cfg);
      data = this.get_data(cfg);
      count = 0;
      ref1 = (ref = cfg.pragmas) != null ? ref : [];
      for (i = 0, len = ref1.length; i < len; i++) {
        pragma = ref1[i];
        //.........................................................................................................
        // db.pragma 'synchronous = OFF' # makes file-based DBs much faster
        db.pragma(pragma);
      }
      //.........................................................................................................
      // db.exec """drop table if exists test;"""
      db(SQL`create table test(
  id    integer primary key,
  nr    integer not null,
  text  text );`);
      // debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var j, len1, nr, ref2, result, text;
          nr = 0;
          if (cfg.use_transaction) {
            db.execute("begin transaction;");
          }
          ref2 = data.texts;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            text = ref2[j];
            nr++;
            db(SQL`insert into test ( nr, text ) values ( ?, ? );`, [nr, text]);
          }
          if (cfg.use_transaction) {
            db.execute("commit;");
          }
          result = db(SQL`select * from test order by text;`);
          result = [...result];
          count += result.length;
          if (gcfg.verbose) {
            show_result('_dbay_naive', result);
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_tmpfs_prep_tx1 = (cfg) => {
    return this._dbay_prep1({
      ...cfg,
      db_path: '/dev/shm/dbay.db',
      use_transaction: true
    });
  };

  this.dbay_naive_tx1 = (cfg) => {
    return this._dbay_naive({
      ...cfg,
      db_path: '/dev/shm/dbay.db',
      use_transaction: true
    });
  };

  this.dbay_naive_tx0 = (cfg) => {
    return this._dbay_naive({
      ...cfg,
      db_path: '/dev/shm/dbay.db',
      use_transaction: false
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    cfg = {
      word_count: 10000
    };
    repetitions = 5;
    test_names = [
      'bsqlt_mem',
      'bsqlt_mem_tx',
      'bsqlt_mem_tx_jmwal',
      // 'bsqlt_mem_jmoff'
      'bsqlt_mem_jmwal',
      // 'bsqlt_mem_icql_latest'
      // 'bsqlt_mem_icql515'
      // 'bsqlt_mem_backup'
      // 'bsqlt_mem_noprepare'
      'bsqlt_mem_thrds',
      // 'bsqlt_fle'
      // 'bsqlt_fle_mmap'
      // 'bsqlt_fle_tmpm'
      // 'bsqlt_fle_thrds'
      // 'bsqlt_fle_pgsze'
      'bsqlt_fle_jmwal',
      // 'bsqlt_fle_jmdel'
      // 'bsqlt_fle_jmtrunc' ### NOTE does not produce correct DB file ###
      // 'bsqlt_fle_jmpers'  ### NOTE does not produce correct DB file ###
      // 'bsqlt_fle_jmmem'
      // 'bsqlt_fle_jmoff'
      // 'bsqlt_fle_qtforum1'
      'bsqlt_fle_qtforum2',
      'bsqlt_fle_tx',
      'bsqlt_fle_tx_jmwal',
      'bsqlt_tmpfs_tx',
      'bsqlt_tmpfs_tx_jmwal',
      'bsqlt_tmpfs',
      // 'bsqlt_tmpfs_jmoff'
      'bsqlt_tmpfs_jmwal',
      'bsqlt_tmpfs_qtforum2',
      // 'bsqlt_tmpfs_jmoff32'
      // 'bsqlt_tmpfs_jmwal32'
      // 'bsqlt_tmpfs_jmwal_mm0'
      // 'bsqlt_tmpfs_jmwal32_mm0'
      'pgmem',
      'pgmem_tx',
      'sqljs',
      'sqljs_tx',
      'porsagerpostgres_tx',
      'briancpg_tx',
      'dbay_tmpfs_prep_tx1',
      'dbay_naive_tx1',
      'dbay_naive_tx0'
    ];
    if (global.gc != null) {
      global.gc();
    }
    data_cache = null;
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      whisper('-'.repeat(108));
      ref1 = CND.shuffle(test_names);
      for (j = 0, len = ref1.length; j < len; j++) {
        test_name = ref1[j];
        if (global.gc != null) {
          global.gc();
        }
        await BM.benchmark(bench, cfg, false, this, test_name);
      }
    }
    return BM.show_totals(bench);
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await this.run_benchmarks());
    })();
  }

}).call(this);

//# sourceMappingURL=inserts.benchmarks.js.map