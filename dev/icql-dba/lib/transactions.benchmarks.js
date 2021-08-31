(function() {
  'use strict';
  var BM, CND, DATA, FS, H, PATH, SQL, alert, badge, data_cache, debug, echo, freeze, help, info, jr, lets, log, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TRANSACTIONS/BENCHMARKS';

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

  H = require('./helpers');

  DATA = require('../../../lib/data-providers-nocache');

  ({jr} = CND);

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  ({lets, freeze} = require('letsfreezethat'));

  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var texts;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    //.........................................................................................................
    texts = DATA.get_words(cfg.list_length);
    //.........................................................................................................
    data_cache = {texts};
    data_cache = freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tx0_idx0_insert_adhoc = function(cfg) {
    return new Promise((resolve) => {
      var Dba, dba, schema, texts;
      ({texts} = this.get_data(cfg));
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      schema = 'main';
      dba.open({
        schema,
        ram: true
      });
      dba.execute(SQL`create table texts (
  id    integer not null primary key,
  word  text not null );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, len, word;
          count = 0;
          if (cfg.show) {
            debug('^3888^', texts);
          }
          for (i = 0, len = texts.length; i < len; i++) {
            word = texts[i];
            dba.run(SQL`insert into texts ( word ) values ( $word )`, {word});
          }
          count += texts.length;
          if (cfg.show) {
            debug('^3888^', dba.list(dba.query(SQL`select * from texts;`)));
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tx1_idx0_insert_adhoc = function(cfg) {
    return new Promise((resolve) => {
      var Dba, dba, schema, texts;
      ({texts} = this.get_data(cfg));
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      schema = 'main';
      dba.open({
        schema,
        ram: true
      });
      dba.execute(SQL`create table texts (
  id    integer not null primary key,
  word  text not null );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, len, word;
          count = 0;
          if (cfg.show) {
            debug('^3888^', texts);
          }
          dba.execute(SQL`begin transaction;`);
          for (i = 0, len = texts.length; i < len; i++) {
            word = texts[i];
            dba.run(SQL`insert into texts ( word ) values ( $word )`, {word});
          }
          dba.execute(SQL`commit;`);
          count += texts.length;
          if (cfg.show) {
            debug('^3888^', dba.list(dba.query(SQL`select * from texts;`)));
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tx1_idx0_insert_prep = function(cfg) {
    return new Promise((resolve) => {
      var Dba, dba, schema, texts;
      ({texts} = this.get_data(cfg));
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      schema = 'main';
      dba.open({
        schema,
        ram: true
      });
      dba.execute(SQL`create table texts (
  id    integer not null primary key,
  word  text not null );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, insert, len, word;
          count = 0;
          if (cfg.show) {
            debug('^3888^', texts);
          }
          dba.execute(SQL`begin transaction;`);
          insert = dba.prepare(SQL`insert into texts ( word ) values ( $word )`);
          for (i = 0, len = texts.length; i < len; i++) {
            word = texts[i];
            insert.run({word});
          }
          dba.execute(SQL`commit;`);
          count += texts.length;
          if (cfg.show) {
            debug('^3888^', dba.list(dba.query(SQL`select * from texts;`)));
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tx1_idx_before_insert_prep = function(cfg) {
    return new Promise((resolve) => {
      var Dba, dba, schema, texts;
      ({texts} = this.get_data(cfg));
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      schema = 'main';
      dba.open({
        schema,
        ram: true
      });
      dba.execute(SQL`create table texts (
  id    integer not null primary key,
  word  text not null );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, insert, len, word;
          count = 0;
          if (cfg.show) {
            debug('^3888^', texts);
          }
          dba.execute(SQL`begin transaction;`);
          dba.execute(SQL`create index texts_word_idx on texts ( word );`);
          insert = dba.prepare(SQL`insert into texts ( word ) values ( $word )`);
          for (i = 0, len = texts.length; i < len; i++) {
            word = texts[i];
            insert.run({word});
          }
          dba.execute(SQL`commit;`);
          count += texts.length;
          if (cfg.show) {
            debug('^3888^', dba.list(dba.query(SQL`select * from texts;`)));
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tx1_idx_after_insert_prep = function(cfg) {
    return new Promise((resolve) => {
      var Dba, dba, schema, texts;
      ({texts} = this.get_data(cfg));
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      schema = 'main';
      dba.open({
        schema,
        ram: true
      });
      dba.execute(SQL`create table texts (
  id    integer not null primary key,
  word  text not null );`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, insert, len, word;
          count = 0;
          if (cfg.show) {
            debug('^3888^', texts);
          }
          dba.execute(SQL`begin transaction;`);
          insert = dba.prepare(SQL`insert into texts ( word ) values ( $word )`);
          for (i = 0, len = texts.length; i < len; i++) {
            word = texts[i];
            insert.run({word});
          }
          dba.execute(SQL`create index texts_word_idx on texts ( word );`);
          dba.execute(SQL`commit;`);
          count += texts.length;
          if (cfg.show) {
            debug('^3888^', dba.list(dba.query(SQL`select * from texts;`)));
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tx0_idx0_insert_prep = function(cfg) {
    return new Promise((resolve) => {
      var Dba, dba, insert, schema, texts;
      ({texts} = this.get_data(cfg));
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      schema = 'main';
      dba.open({
        schema,
        ram: true
      });
      dba.execute(SQL`create table texts (
  id    integer not null primary key,
  word  text not null );`);
      insert = dba.prepare(SQL`insert into texts ( word ) values ( $word )`);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, len, word;
          count = 0;
          if (cfg.show) {
            debug('^3888^', texts);
          }
          for (i = 0, len = texts.length; i < len; i++) {
            word = texts[i];
            insert.run({word});
          }
          count += texts.length;
          if (cfg.show) {
            debug('^3888^', dba.list(dba.query(SQL`select * from texts;`)));
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, mode, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    mode = 'functional_test';
    mode = 'medium';
    mode = 'standard';
    switch (mode) {
      case 'standard':
        cfg = {
          list_length: 3e5
        };
        repetitions = 5;
        break;
      case 'medium':
        cfg = {
          list_length: 3e4
        };
        repetitions = 3;
        break;
      case 'functional_test':
        cfg = {
          list_length: 3
        };
        repetitions = 1;
    }
    cfg.show = cfg.list_length < 10;
    test_names = ['tx0_idx0_insert_adhoc', 'tx0_idx0_insert_prep', 'tx1_idx0_insert_adhoc', 'tx1_idx0_insert_prep', 'tx1_idx_before_insert_prep', 'tx1_idx_after_insert_prep'];
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      whisper('-'.repeat(108));
      ref1 = CND.shuffle(test_names);
      for (j = 0, len = ref1.length; j < len; j++) {
        test_name = ref1[j];
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

  /*

Results

tx1_idx0_insert_prep         4.411 s  300,000 items  68,013⏶Hz  14,703⏷nspc
tx1_idx_after_insert_prep    5.009 s  300,000 items  59,896⏶Hz  16,696⏷nspc
tx1_idx_before_insert_prep   6.234 s  300,000 items  48,124⏶Hz  20,779⏷nspc
tx1_idx0_insert_adhoc        6.309 s  300,000 items  47,551⏶Hz  21,030⏷nspc
tx0_idx0_insert_prep        13.103 s  300,000 items  22,895⏶Hz  43,678⏷nspc
tx0_idx0_insert_adhoc       14.953 s  300,000 items  20,063⏶Hz  49,844⏷nspc

tx1_idx0_insert_prep                                  67,061 Hz ≙ 1 ÷ 1.0  100.0 % │████████████▌│
tx1_idx_after_insert_prep                             60,210 Hz ≙ 1 ÷ 1.1   89.8 % │███████████▎ │
tx1_idx0_insert_adhoc                                 47,615 Hz ≙ 1 ÷ 1.4   71.0 % │████████▉    │
tx1_idx_before_insert_prep                            47,574 Hz ≙ 1 ÷ 1.4   70.9 % │████████▉    │
tx0_idx0_insert_prep                                  22,877 Hz ≙ 1 ÷ 2.9   34.1 % │████▎        │
tx0_idx0_insert_adhoc                                 20,173 Hz ≙ 1 ÷ 3.3   30.1 % │███▊         │

*/

}).call(this);

//# sourceMappingURL=transactions.benchmarks.js.map