(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, resolve_path, rpr, show_result, test, try_to_remove_file, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'IN-MEMORY-SQL/READING-WRITING-MEMORY-FILE-DB';

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

  //-----------------------------------------------------------------------------------------------------------
  resolve_path = function(path) {
    return PATH.resolve(PATH.join(__dirname, '../../../', path));
  };

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
    var DATOM, texts;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    DATOM = require('../../../apps/datom');
    //.........................................................................................................
    texts = DATA.get_words(cfg.word_count);
    //.........................................................................................................
    data_cache = {texts};
    data_cache = DATOM.freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // backup_to_memory = =>
  //   ### TAINT should escape command line strings ###
  //   CP            = require 'child_process'
  //   sql_path      = cfg.readsql[ sql_key ]
  //   db_path       = cfg.db[ sql_key ]
  //   pragmas       = 'PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;'
  //   resolve readsql_clipipe_fn = => new Promise ( resolve ) =>
  //     try_to_remove_file db_path
  //     CP.execSync "( echo '#{pragmas}' ; cat #{sql_path} ) | sqlite3 #{db_path}"
  //     resolve ( FS.statSync sql_path ).size
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this._readsql_clipipe = function(cfg, sql_key) {
    return new Promise((resolve) => {
      /* TAINT should escape command line strings */
      var CP, db_path, pragmas, readsql_clipipe_fn, sql_path;
      CP = require('child_process');
      sql_path = cfg.readsql[sql_key];
      db_path = cfg.db[sql_key];
      pragmas = 'PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;';
      resolve(readsql_clipipe_fn = () => {
        return new Promise((resolve) => {
          try_to_remove_file(db_path);
          CP.execSync(`( echo '${pragmas}' ; cat ${sql_path} ) | sqlite3 ${db_path}`);
          return resolve((FS.statSync(sql_path)).size);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._readsql_bsqlt3 = function(cfg, sql_key, fsmode) {
    return new Promise((resolve) => {
      var Db, FSP, db, db_cfg, readsql_bsqlt3, sql_path;
      Db = require('better-sqlite3');
      db_cfg = null;
      db = new Db(':memory:', db_cfg);
      sql_path = cfg.readsql[sql_key];
      FSP = require('fs/promises');
      resolve(readsql_bsqlt3 = () => {
        return new Promise(async(resolve) => {
          var sql;
          db.pragma('journal_mode = OFF;');
          db.pragma('synchronous = OFF;');
          switch (fsmode) {
            case 'sync':
              sql = FS.readFileSync(sql_path, {
                encoding: 'utf-8'
              });
              db.exec(sql);
              return resolve(sql.length);
            case 'promise':
              sql = (await FSP.readFile(sql_path, {
                encoding: 'utf-8'
              }));
              db.exec(sql);
              return resolve(sql.length);
            case 'callback':
              FS.readFile(sql_path, {
                encoding: 'utf-8'
              }, (error, sql) => {
                if (error != null) {
                  throw error;
                }
                db.exec(sql);
                return resolve(sql.length);
              });
              return;
          }
          throw new Error(`^_readsql_bsqlt3@5587^ unknown fsmode ${rpr(fsmode)}`);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._writesql_clipipe = function(cfg, sql_key) {
    return new Promise((resolve) => {
      /* TAINT should escape command line strings */
      var CP, db_path, readsql_clipipe_fn, sql_path;
      CP = require('child_process');
      sql_path = cfg.writesql[sql_key];
      db_path = cfg.db[sql_key];
      resolve(readsql_clipipe_fn = () => {
        return new Promise((resolve) => {
          CP.execSync(`sqlite3 ${db_path} -cmd '.dump' > ${sql_path}`);
          return resolve((FS.statSync(sql_path)).size);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.readsql_clipipe_small = (cfg) => {
    return this._readsql_clipipe(cfg, 'small');
  };

  this.readsql_clipipe_big = (cfg) => {
    return this._readsql_clipipe(cfg, 'big');
  };

  this.readsql_bsqlt3_small_promise = (cfg) => {
    return this._readsql_bsqlt3(cfg, 'small', 'promise');
  };

  this.readsql_bsqlt3_big_promise = (cfg) => {
    return this._readsql_bsqlt3(cfg, 'big', 'promise');
  };

  this.readsql_bsqlt3_small_sync = (cfg) => {
    return this._readsql_bsqlt3(cfg, 'small', 'sync');
  };

  this.readsql_bsqlt3_big_sync = (cfg) => {
    return this._readsql_bsqlt3(cfg, 'big', 'sync');
  };

  this.readsql_bsqlt3_small_callback = (cfg) => {
    return this._readsql_bsqlt3(cfg, 'small', 'callback');
  };

  this.readsql_bsqlt3_big_callback = (cfg) => {
    return this._readsql_bsqlt3(cfg, 'big', 'callback');
  };

  this.writesql_clipipe_small = (cfg) => {
    return this._writesql_clipipe(cfg, 'small');
  };

  this.writesql_clipipe_big = (cfg) => {
    return this._writesql_clipipe(cfg, 'big');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var bench, cfg, repetitions, run_phase, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    cfg = {
      db: {
        small: resolve_path('data/icql/small-datamill.db'),
        big: resolve_path('data/icql/Chinook_Sqlite_AutoIncrementPKs.db')
      },
      readsql: {
        small: resolve_path('assets/icql/small-datamill.sql'),
        big: resolve_path('assets/icql/Chinook_Sqlite_AutoIncrementPKs.sql')
      },
      writesql: {
        small: resolve_path('data/icql/small-datamill.sql'),
        big: resolve_path('data/icql/Chinook_Sqlite_AutoIncrementPKs.sql')
      }
    };
    // use: 'small'
    // use: [ 'big', 'small', ]
    // use: 'bignp'
    repetitions = 3;
    //.........................................................................................................
    run_phase = async(test_names) => {
      var _, i, j, len, ref, ref1, test_name;
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
      BM.show_totals(bench);
      return null;
    };
    //.........................................................................................................
    test_names = ['readsql_clipipe_small', 'readsql_clipipe_big'];
    await run_phase(test_names);
    //.........................................................................................................
    test_names = ['readsql_bsqlt3_small_promise', 'readsql_bsqlt3_big_promise', 'readsql_bsqlt3_small_sync', 'readsql_bsqlt3_big_sync', 'readsql_bsqlt3_small_callback', 'readsql_bsqlt3_big_callback'];
    await run_phase(test_names);
    // #.........................................................................................................
    // test_names    = [
    //   'writesql_clipipe_small'
    //   'writesql_clipipe_big'
    //   ]
    // await run_phase test_names
    //.........................................................................................................
    // await run_phase [ 'readsql_bsqlt3_small_promise', ]
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      var xxx;
      await this.run_benchmarks();
      xxx = function() {
        var Db, db, db_cfg, i, j, n;
        Db = require('better-sqlite3');
        db_cfg = null;
        db = new Db('/tmp/foo.db', db_cfg);
        db.exec("drop table if exists x;");
        db.exec("create table x ( n integer );");
        for (n = i = 1; i <= 10; n = ++i) {
          db.exec(`insert into x ( n ) values ( ${n} );`);
        }
        // db.exec "vacuum into '/tmp/foo2.db';"
        db.exec("vacuum into ':memory:';");
        for (n = j = 11; j <= 20; n = ++j) {
          db.exec(`insert into x ( n ) values ( ${n} );`);
        }
        debug('^333344^', db.memory = true);
        debug('^333344^', db.memory);
        return null;
      };
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=reading-writing-memory-file-db.benchmarks.js.map