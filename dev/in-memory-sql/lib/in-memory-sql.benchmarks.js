(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, rpr, show_result, test, urge, warn, whisper;

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
    var DATOM, font, texts;
    if (data_cache != null) {
      return data_cache;
    }
    DATOM = require('../../../apps/datom');
    //.........................................................................................................
    texts = DATA.get_text_lines(cfg);
    font = {
      path: 'EBGaramond12-Italic.otf',
      /* TAINT use single type/format for features */
      features: 'liga,clig,dlig,hlig',
      features_obj: {
        liga: true,
        clig: true,
        dlig: true,
        hlig: true
      }
    };
    font.path = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts', font.path));
    //.........................................................................................................
    data_cache = {texts, font};
    data_cache = DATOM.freeze(data_cache);
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pgmem = function(cfg) {
    return new Promise((resolve) => {
      var count, db;
      db = (require('pg-mem')).newDb();
      // HB.ensure_harfbuzz_version() ### NOTE: optional diagnostic ###
      // data          = @get_data cfg
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var sql;
          sql = `create table foo ( n integer not null );
insert into foo values ( 1 ), ( 2 ), ( 3 ), ( 4 ), ( 5 ), ( 6 ), ( 7 ), ( 8 );`;
          debug('^22233^', db.public.none(sql));
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, n, ref, ref1, repetitions, test_name, test_names;
    // gcfg.verbose  = true
    bench = BM.new_benchmarks();
    n = 10;
    gcfg.verbose = n === 1;
    cfg = {
      line_count: n,
      word_count: n
    };
    repetitions = 2;
    test_names = ['pgmem'];
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

//# sourceMappingURL=in-memory-sql.benchmarks.js.map