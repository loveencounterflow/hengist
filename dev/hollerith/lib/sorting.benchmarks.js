(function() {
  'use strict';
  var BM, CND, DATA, FS, HOLLERITH, Hollerith, PATH, alert, badge, data_cache, debug, defaults, echo, freeze, gcfg, help, info, isa, jr, lets, log, rpr, test, type_of, types, urge, validate, warn, whisper;

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

  types = new (require('intertype')).Intertype();

  ({isa, type_of, defaults, validate} = types.export());

  ({lets, freeze} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  ({HOLLERITH, Hollerith} = require('../../../apps/hollerith'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var i, integer_lists, len, list_length, list_lengths;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    integer_lists = [];
    list_lengths = DATA.get_integers(cfg.list_count, cfg.list_length_min, cfg.list_length_max);
//.........................................................................................................
    for (i = 0, len = list_lengths.length; i < len; i++) {
      list_length = list_lengths[i];
      // integer_lists.push DATA.get_integers list_length, HOLLERITH.nr_min, HOLLERITH.nr_max
      integer_lists.push(DATA.get_integers(list_length, -100, +100));
    }
    //.........................................................................................................
    data_cache = {integer_lists};
    data_cache = freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this._hollerith2 = function(cfg, hlr) {
    return new Promise((resolve) => {
      var HLR, integer_lists;
      ({integer_lists} = this.get_data(cfg));
      HLR = new Hollerith(hlr);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, x;
          count = 0;
          x = HLR.sort(integer_lists);
          if (cfg.show) {
            whisper('^234-3^', integer_lists);
            urge('^234-3^', x);
          }
          count += integer_lists.length;
          return resolve(count);
        });
      });
      return null;
    });
  };

  this.hollerith2_nv_sort = function(cfg) {
    return this._hollerith2(cfg, {
      validate: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.hollerith2_nv_cmp2 = function(cfg) {
    return new Promise((resolve) => {
      var HLR, integer_lists;
      ({integer_lists} = this.get_data(cfg));
      HLR = new Hollerith({
        validate: false
      });
      integer_lists = [...integer_lists];
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, x;
          count = 0;
          x = integer_lists.sort(HLR.cmp2);
          if (cfg.show) {
            whisper('^234-3^', integer_lists);
            urge('^234-3^', x);
          }
          count += integer_lists.length;
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.hollerith2_nv_bcd = function(cfg) {
    return new Promise((resolve) => {
      var HLR, d, integer_lists, integer_lists_bcd;
      ({integer_lists} = this.get_data(cfg));
      HLR = new Hollerith({
        validate: false,
        format: 'bcd'
      });
      integer_lists_bcd = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = integer_lists.length; i < len; i++) {
          d = integer_lists[i];
          results.push(HLR.encode(d));
        }
        return results;
      })();
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, x;
          count = 0;
          x = integer_lists_bcd.sort();
          if (cfg.show) {
            whisper('^234-3^', integer_lists);
            urge('^234-3^', x);
          }
          count += integer_lists.length;
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.hollerith2_nv_u32 = function(cfg) {
    return new Promise((resolve) => {
      var HLR, d, integer_lists, integer_lists_bcd;
      ({integer_lists} = this.get_data(cfg));
      HLR = new Hollerith({
        validate: false,
        format: 'u32'
      });
      integer_lists_bcd = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = integer_lists.length; i < len; i++) {
          d = integer_lists[i];
          results.push(HLR.encode(d));
        }
        return results;
      })();
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, x;
          count = 0;
          x = integer_lists_bcd.sort(HLR.cmp_blobs);
          if (cfg.show) {
            whisper('^234-3^', integer_lists);
            urge('^234-3^', x);
          }
          count += integer_lists.length;
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, list_length_max, mode, ref, ref1, repetitions, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    mode = 'medium';
    mode = 'functional_test';
    mode = 'standard';
    list_length_max = Hollerith.C.defaults.hlr_constructor_cfg.vnr_width;
    switch (mode) {
      case 'standard':
        cfg = {
          list_count: 3e5,
          list_length_min: 1,
          list_length_max
        };
        repetitions = 5;
        break;
      case 'medium':
        cfg = {
          list_count: 3e4,
          list_length_min: 1,
          list_length_max
        };
        repetitions = 3;
        break;
      case 'functional_test':
        cfg = {
          list_count: 3,
          list_length_min: 1,
          list_length_max
        };
        repetitions = 1;
    }
    cfg.show = cfg.list_count < 10;
    test_names = ['hollerith2_nv_cmp2', 'hollerith2_nv_sort', 'hollerith2_nv_bcd', 'hollerith2_nv_u32'];
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

  // debug '^787^', type_of CHARWISE.encode 'helo world'
// debug '^787^', type_of CHARWISE.encode [ 4, 5, 6, ]
// debug '^787^', rpr CHARWISE.buffer
// debug '^787^', type_of BYTEWISE.encode 'helo world'
// debug '^787^', type_of BYTEWISE.encode [ 4, 5, 6, ]

}).call(this);

//# sourceMappingURL=sorting.benchmarks.js.map