(function() {
  /*

  **Note** 'FRP' here is 'Functional *Relational* Programming' whereas it's most often used for 'Functional
  *Reactive* Programming' these days, so maybe better call it **FunRelPro** or something like that.

  > In FRP all *essential state* takes the form of relations, and the *essential logic* is expressed using
  > relational algebra extended with (pure) user defined functions.—

  > https://softwareengineering.stackexchange.com/a/170566/281585

  [*A Relational Database Machine Based on Functional Programming Concepts* by Yasushi KIYOKI, Kazuhiko KATO
  and Takashi MASUDA, University of Tsukuba, ca.
  1985—1995](https://thelackthereof.org/docs/library/cs/database/KIYOKI,%20Yasushi%20et%20al:%20A%20Relational%20Database%20Machine%20Based%20on%20Functional%20Programming%20Concepts.pdf)

   */
  'use strict';
  var CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, rpr, show_result, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'FRP';

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

  ({jr} = CND);

  data_cache = null;

  gcfg = {
    verbose: false
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

  //-----------------------------------------------------------------------------------------------------------
  this.demo_frp = function(cfg) {
    return new Promise((resolve) => {
      var Db, ICQL, RBW, d, data, db, db_cfg, i, icql_cfg, icql_path, insert, len, nr, ref, ref1, result, retrieve, text;
      RBW = require('../../../apps/rustybuzz-wasm/demo-nodejs-using-wasm');
      Db = require('better-sqlite3');
      // db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
      db_cfg = null;
      db = new Db(cfg.db_path, db_cfg);
      data = this.get_data({
        word_count: 10
      });
      //.........................................................................................................
      icql_path = PATH.resolve(PATH.join(__dirname, '../demo-frp.icql'));
      ICQL = require('../../../apps/icql');
      icql_cfg = {
        connector: Db,
        db_path: ':memory:',
        icql_path: icql_path
      };
      db = ICQL.bind(icql_cfg);
      // debug '^3334^', db.sql
      // info k, v for k, v of db.sql
      db.create_table_test();
      ref = db.sqlite_index_infos();
      for (d of ref) {
        debug('^3334^', d);
      }
      db.insert_text({
        nr: 42,
        text: "a good number"
      });
      //.........................................................................................................
      // db.unsafeMode true
      // db.pragma 'cache_size = 32000'
      db.$.db.pragma('synchronous = OFF'); // makes file-based DBs much faster
      db.$.db.loadExtension(PATH.resolve(PATH.join(__dirname, '../json1.so')));
      //.........................................................................................................
      insert = db.$.db.prepare(`insert into test ( nr, text ) values ( ?, ? );`);
      retrieve = db.$.db.prepare(`select * from test order by text;`);
      //.........................................................................................................
      nr = 0;
      ref1 = data.texts;
      for (i = 0, len = ref1.length; i < len; i++) {
        text = ref1[i];
        nr++;
        insert.run([nr, text]);
      }
      result = retrieve.all();
      show_result('bettersqlite3', result);
      // if do_backup
      //   await db.backup "/tmp/hengist-in-memory-sql.benchmarks.backup-#{Date.now()}.db"
      db.$.db.close();
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.bettersqlite3_memory = (cfg) => {
    return this._bettersqlite3(cfg, ':memory:');
  };

  this.bettersqlite3_backup = (cfg) => {
    return this._bettersqlite3(cfg, ':memory:', true);
  };

  this.bettersqlite3_file = (cfg) => {
    return this._bettersqlite3(cfg, '/tmp/hengist-in-memory-sql.benchmarks.db');
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      var cfg;
      cfg = {
        db_path: ':memory:'
      };
      return (await this.demo_frp(cfg));
    })();
  }

}).call(this);

//# sourceMappingURL=demo-frp.js.map