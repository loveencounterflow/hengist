(function() {
  'use strict';
  var BM, DATA, GUY, alert, data_cache, debug, echo, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  //...........................................................................................................
  DATA = require('../../../lib/data-providers-nocache');

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var integers;
    if (data_cache != null) {
      return data_cache;
    }
    //.........................................................................................................
    integers = DATA.get_integers(cfg.item_count, -1e6, +1e6);
    //.........................................................................................................
    data_cache = {integers};
    data_cache = GUY.lft.freeze(data_cache);
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.compute = function(a, b) {
    return (a + b) * b / a;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.plain_sync = function(cfg) {
    return new Promise((resolve) => {
      var integers;
      ({integers} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var c, count, i, integer, len, sum;
          count = 0;
          sum = 0;
          for (i = 0, len = integers.length; i < len; i++) {
            integer = integers[i];
            c = this.compute(12345, integer);
            sum += c;
            count++;
          }
          if (cfg.show) {
            info('^543^', {sum});
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.plain_await = function(cfg) {
    return new Promise((resolve) => {
      var integers;
      ({integers} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise(async(resolve) => {
          var c, count, i, integer, len, sum;
          count = 0;
          sum = 0;
          for (i = 0, len = integers.length; i < len; i++) {
            integer = integers[i];
            c = (await this.compute(12345, integer));
            sum += c;
            count++;
          }
          if (cfg.show) {
            info('^543^', {sum});
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    cfg = {
      item_count: 1e7
    };
    cfg.show = cfg.item_count < 100;
    repetitions = 5;
    test_names = ['plain_sync', 'plain_await'];
    data_cache = null;
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      whisper('-'.repeat(108));
      ref1 = (require('cnd')).shuffle(test_names);
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

}).call(this);

//# sourceMappingURL=benchmark-await-sync-vs-plain-sync.js.map