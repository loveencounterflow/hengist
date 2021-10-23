(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, freeze, gcfg, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAYRB/BENCHMARKS';

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

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var texts;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    // DATOM = require '../../../apps/datom'
    //.........................................................................................................
    texts = DATA.get_svg_pathdata(cfg.path_count);
    //.........................................................................................................
    data_cache = {texts};
    data_cache = freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._zlib = function(cfg, use_membacked = true) {
    return new Promise((resolve) => {
      var Db, populate_file;
      Db = require('better-sqlite3');
      // db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
      //.........................................................................................................
      (populate_file = () => {
        var count, data;
        data = this.get_data(cfg);
        return count = 0;
      })();
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  // @dbay_tmpfs_prep_tx1  = ( cfg ) => @_dbay_prep1 { cfg..., db_path: '/dev/shm/dbay.db', use_transaction: true, }

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    cfg = {
      path_count: 10
    };
    repetitions = 1;
    test_names = ['_zlib'];
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

//# sourceMappingURL=path-optimizers.benchmarks.js.map