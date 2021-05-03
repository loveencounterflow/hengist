(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, resolve_path, rpr, show_result, test, try_to_remove_file, urge, walk_batches, walk_lines, walk_statements, warn, whisper;

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
  walk_statements = function*(sql_path) {
    /* Given a path, iterate over SQL statements which are signalled by semicolons (`;`) that appear outside
     of literals and comments (and the end of input). */
    /* thx to https://stackabuse.com/reading-a-file-line-by-line-in-node-js/ */
    /* thx to https://github.com/nacholibre/node-readlines */
    var cfg, collector, cur_idx, flush, i, len, line, readlines, ref, stream, token, tokenize;
    readlines = new (require('n-readlines'))(sql_path);
    //.........................................................................................................
    cfg = {
      regExp: require('mysql-tokenizer/lib/regexp-sql92')
    };
    tokenize = (require('mysql-tokenizer'))(cfg);
    collector = null;
    stream = FS.createReadStream(sql_path);
    //.........................................................................................................
    flush = function() {
      var R;
      R = collector.join('');
      collector = null;
      return R;
    };
    //.........................................................................................................
    while ((line = readlines.next()) !== false) {
      ref = tokenize(line + '\n');
      for (cur_idx = i = 0, len = ref.length; i < len; cur_idx = ++i) {
        token = ref[cur_idx];
        if (token === ';') {
          (collector != null ? collector : collector = []).push(token);
          yield flush();
          continue;
        }
        // if token.startsWith '--'
        //   continue
        (collector != null ? collector : collector = []).push(token);
      }
    }
    if (collector != null) {
      yield flush();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  walk_lines = function*(sql_path) {
    /* This method iterates over lines instead of tokenizing and re-collecting them into statement-sized
     chunks; it exists so we can compare its performance with that of `walk_statements()` to get an idea how
     much the SQL tokenizer is contributing. */
    var line, readlines;
    readlines = new (require('n-readlines'))(sql_path);
    //.........................................................................................................
    while ((line = readlines.next()) !== false) {
      yield line;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  walk_batches = function*(iterator, batch_size = 1) {
    /* Given an iterator and a batch size, iterate over lists of values yielded by the iterator. */
    var batch, d;
    batch = null;
    for (d of iterator) {
      (batch != null ? batch : batch = []).push(d);
      if (batch.length >= batch_size) {
        yield batch;
        batch = null;
      }
    }
    if (batch != null) {
      yield batch;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._parse_sql_stream_msqlt = (cfg, sql_key) => {
    return new Promise((resolve) => {
      var Db, batch_size, count, db, db_cfg, parse_sql, sql_path;
      sql_path = cfg.readsql[sql_key];
      batch_size = 100;
      count = 0;
      Db = require('better-sqlite3');
      db_cfg = null;
      db = new Db(':memory:', db_cfg);
      return resolve(parse_sql = () => {
        return new Promise((resolve) => {
          var compound_statement, ref, statements;
          ref = walk_batches(walk_statements(sql_path), batch_size);
          for (statements of ref) {
            compound_statement = statements.join('');
            count += compound_statement.length;
            db.exec(compound_statement);
          }
          return resolve(count);
        });
      });
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._parse_sql_stream_msqlt_nodb = (cfg, sql_key) => {
    return new Promise((resolve) => {
      var batch_size, count, parse_sql, sql_path;
      sql_path = cfg.readsql[sql_key];
      batch_size = 100;
      count = 0;
      return resolve(parse_sql = () => {
        return new Promise((resolve) => {
          var compound_statement, ref, statements;
          ref = walk_batches(walk_statements(sql_path), batch_size);
          for (statements of ref) {
            compound_statement = statements.join('');
            count += compound_statement.length;
          }
          // info '^4844^', '\n' + statements.join ''
          return resolve(count);
        });
      });
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._read_lines_nodb = (cfg, sql_key) => {
    return new Promise((resolve) => {
      var batch_size, count, parse_sql, sql_path;
      sql_path = cfg.readsql[sql_key];
      batch_size = 3;
      count = 0;
      return resolve(parse_sql = () => {
        return new Promise((resolve) => {
          var chunks, compound_chunk, ref;
          ref = walk_batches(walk_lines(sql_path), batch_size);
          for (chunks of ref) {
            compound_chunk = chunks.join('');
            count += compound_chunk.length;
          }
          // info '^4844^', '\n' + statements.join ''
          return resolve(count);
        });
      });
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

  //...........................................................................................................
  this.writesql_clipipe_small = (cfg) => {
    return this._writesql_clipipe(cfg, 'small');
  };

  this.writesql_clipipe_big = (cfg) => {
    return this._writesql_clipipe(cfg, 'big');
  };

  //...........................................................................................................
  this.parse_sql_mysqlt_tiny = (cfg) => {
    return this._parse_sql_stream_msqlt(cfg, 'tiny');
  };

  this.parse_sql_mysqlt_small = (cfg) => {
    return this._parse_sql_stream_msqlt(cfg, 'small');
  };

  this.parse_sql_mysqlt_big = (cfg) => {
    return this._parse_sql_stream_msqlt(cfg, 'big');
  };

  this.parse_sql_mysqlt_nodb_tiny = (cfg) => {
    return this._parse_sql_stream_msqlt_nodb(cfg, 'tiny');
  };

  this.parse_sql_mysqlt_nodb_small = (cfg) => {
    return this._parse_sql_stream_msqlt_nodb(cfg, 'small');
  };

  this.parse_sql_mysqlt_nodb_big = (cfg) => {
    return this._parse_sql_stream_msqlt_nodb(cfg, 'big');
  };

  this.read_lines_nodb_tiny = (cfg) => {
    return this._read_lines_nodb(cfg, 'tiny');
  };

  this.read_lines_nodb_small = (cfg) => {
    return this._read_lines_nodb(cfg, 'small');
  };

  this.read_lines_nodb_big = (cfg) => {
    return this._read_lines_nodb(cfg, 'big');
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
        tiny: resolve_path('assets/icql/tiny-datamill.sql'),
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
    // #.........................................................................................................
    // test_names    = [
    //   'readsql_clipipe_small'
    //   'readsql_clipipe_big'
    //   ]
    // await run_phase test_names
    //.........................................................................................................
    test_names = ['readsql_bsqlt3_big_sync'];
    // 'readsql_bsqlt3_big_promise'
    // 'readsql_bsqlt3_big_callback'
    // 'readsql_bsqlt3_small_promise'
    // 'readsql_bsqlt3_small_sync'
    // 'readsql_bsqlt3_small_callback'
    await run_phase(test_names);
    // #.........................................................................................................
    // test_names    = [
    //   'writesql_clipipe_small'
    //   'writesql_clipipe_big'
    //   ]
    // await run_phase test_names
    //.........................................................................................................
    test_names = [
      // 'parse_sql_mysqlt_tiny'
      // 'parse_sql_mysqlt_small'
      'parse_sql_mysqlt_big',
      // 'parse_sql_mysqlt_nodb_tiny'
      // 'parse_sql_mysqlt_nodb_small'
      'parse_sql_mysqlt_nodb_big',
      // 'read_lines_nodb_tiny'
      // 'read_lines_nodb_small'
      'read_lines_nodb_big'
    ];
    await run_phase(test_names);
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