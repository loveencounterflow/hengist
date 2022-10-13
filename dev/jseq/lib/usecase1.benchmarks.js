(function() {
  'use strict';
  var BM, CND, DATA, FS, IMPLEMENTATIONS, PATH, _IMPLEMENTATIONS, alert, badge, data_cache, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'JSEQ';

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

  _IMPLEMENTATIONS = require('../../../apps/jseq/lib/implementations');

  IMPLEMENTATIONS = {};

  (() => {
    var i, k, key, len, match, nick, ref, value;
    ref = ((function() {
      var results;
      results = [];
      for (k in _IMPLEMENTATIONS) {
        results.push(k);
      }
      return results;
    })()).sort();
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      debug('^344534^', k);
    }
    for (key in _IMPLEMENTATIONS) {
      value = _IMPLEMENTATIONS[key];
      if ((match = key.match(/^(?<nick>[^:]+)/)) == null) {
        throw new Error(`^bm/jseq@245 unexpected key ${rpr(key)}`);
      }
      ({nick} = match.groups);
      IMPLEMENTATIONS[nick] = value;
    }
    return null;
  })();

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var copy, d, datom_pairs, datoms, e, i, idx, ref;
    ({
      _deep_copy: copy
    } = require('../../../apps/letsfreezethat'));
    if (data_cache != null) {
      return data_cache;
    }
    datoms = DATA.get_random_datoms(cfg.set_count * 2);
    datom_pairs = [];
//.........................................................................................................
    for (idx = i = 0, ref = datoms.length; i < ref; idx = i += +2) {
      d = datoms[idx];
      e = datoms[idx + 1];
      if (Math.random() > 0.5) {
        datom_pairs.push([d, e]);
        datom_pairs.push([d, copy(d)]);
      }
    }
    //.........................................................................................................
    data_cache = {datom_pairs};
    data_cache = (require('../../../apps/letsfreezethat')).freeze(data_cache);
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._benchmark_by_name = function(cfg, nick) {
    return new Promise((resolve) => {
      var datom_pairs, eq, ne, sublibrary;
      sublibrary = IMPLEMENTATIONS[nick];
      if (sublibrary == null) {
        throw new Error(`^bm/jseq@223 unknown sublibrary ${rpr(sublibrary)}`);
      }
      ({eq, ne} = sublibrary);
      // @types.validate.hengist_dataprv_cfg cfg
      ({datom_pairs} = this.get_data(cfg));
      resolve(() => {
        return new Promise((resolve) => {
          var count, d, e, i, is_equal, len;
          count = 0;
          for (i = 0, len = datom_pairs.length; i < len; i++) {
            [d, e] = datom_pairs[i];
            is_equal = eq(d, e);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  // @FDQ = ( cfg ) -> @_benchmark_by_name cfg, 'FDQ'
  // @FDE = ( cfg ) -> @_benchmark_by_name cfg, 'FDE'
  // @JKR = ( cfg ) -> @_benchmark_by_name cfg, 'JKR'
  // # @ADS = ( cfg ) -> @_benchmark_by_name cfg, 'ADS'
  // @NUI = ( cfg ) -> @_benchmark_by_name cfg, 'NUI'
  // @FEQ = ( cfg ) -> @_benchmark_by_name cfg, 'FEQ'
  this['*EQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, '*EQ');
  };

  this['*JV'] = function(cfg) {
    return this._benchmark_by_name(cfg, '*JV');
  };

  this['=='] = function(cfg) {
    return this._benchmark_by_name(cfg, '==');
  };

  this['==='] = function(cfg) {
    return this._benchmark_by_name(cfg, '===');
  };

  this['ADE'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'ADE');
  };

  this['ADS'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'ADS');
  };

  this['AEQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'AEQ');
  };

  this['APE'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'APE');
  };

  this['ASE'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'ASE');
  };

  this['CHA'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'CHA');
  };

  this['CND'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'CND');
  };

  this['DEQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'DEQ');
  };

  this['DQI'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'DQI');
  };

  this['EQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'EQ');
  };

  this['FDE'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'FDE');
  };

  this['FDQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'FDQ');
  };

  this['FEQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'FEQ');
  };

  this['ISE'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'ISE');
  };

  this['JDQ'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'JDQ');
  };

  this['JKR'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'JKR');
  };

  this['LDS'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'LDS');
  };

  this['NUI'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'NUI');
  };

  this['OIS'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'OIS');
  };

  this['UDS'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'UDS');
  };

  this['o23'] = function(cfg) {
    return this._benchmark_by_name(cfg, 'o23');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    cfg = {
      set_count: 5
    };
    cfg = {
      set_count: 1e4
    };
    cfg = {
      set_count: 1e5
    };
    repetitions = 3;
    test_names = [
      // 'FDQ'
      // 'FDE'
      // 'JKR'
      // # 'ADS'
      // 'NUI'
      // 'FEQ'
      '*EQ',
      '*JV',
      // '=='
      // '==='
      // 'ADE'
      // 'ADS'
      // 'AEQ'
      // 'APE'
      // 'ASE'
      'CHA',
      'CND',
      // 'DEQ'
      'DQI',
      'EQ',
      'FDE',
      'FDQ',
      'FEQ',
      // 'ISE'
      'JDQ',
      'JKR',
      'LDS',
      'NUI',
      // 'OIS'
      'UDS',
      'o23'
    ];
    if (global.gc != null) {
      global.gc();
    }
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      data_cache = null;
      if (global.gc != null) {
        global.gc();
      }
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

 ~/jzr/jseq  master !3  ~/jzr/nodexh/bin/nodexh ~/jzr/hengist/dev/jseq/lib/usecase1.benchmarks.js                                                         INT ✘  12s
00:00 JSEQ  ▶  ------------------------------------------------------------------------------------------------------------
JKR                                        0.766 s          99,812 items         130,373⏶Hz           7,670⏷nspc
FDQ                                        0.212 s          99,812 items         471,069⏶Hz           2,123⏷nspc
FDE                                        0.208 s          99,812 items         479,546⏶Hz           2,085⏷nspc
00:05 JSEQ  ▶  ------------------------------------------------------------------------------------------------------------
FDE                                        0.330 s         100,334 items         304,451⏶Hz           3,285⏷nspc
JKR                                        0.744 s         100,334 items         134,934⏶Hz           7,411⏷nspc
FDQ                                        0.214 s         100,334 items         469,278⏶Hz           2,131⏷nspc
00:10 JSEQ  ▶  ------------------------------------------------------------------------------------------------------------
JKR                                        0.833 s         100,168 items         120,311⏶Hz           8,312⏷nspc
FDQ                                        0.202 s         100,168 items         495,247⏶Hz           2,019⏷nspc
FDE                                        0.200 s         100,168 items         500,233⏶Hz           1,999⏷nspc
00:14 HENGIST/BENCHMARKS  ▶  FDQ                                              478,531 Hz   100.0 % │████████████▌│
00:14 HENGIST/BENCHMARKS  ▶  FDE                                              428,077 Hz    89.5 % │███████████▏ │
00:14 HENGIST/BENCHMARKS  ▶  JKR                                              128,539 Hz    26.9 % │███▍         │

*/

}).call(this);

//# sourceMappingURL=usecase1.benchmarks.js.map