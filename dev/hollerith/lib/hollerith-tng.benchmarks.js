(function() {
  'use strict';
  var BM, BYTEWISE/* https://github.com/dominictarr/charwise */, CHARWISE, CND, DATA, FS, HCODECLEGACY, HCODECLEGACY_TNG, PATH, alert, badge, data_cache, debug, defaults, echo, freeze, gcfg, help, info, isa, jr, lets/* https://github.com/deanlandolt/bytewise */, log, rpr, test, type_of, types, urge, validate, warn, whisper;

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

  HCODECLEGACY = require('../../../apps/hollerith-codec-legacy');

  HCODECLEGACY_TNG = (require('../../../apps/hollerith-codec-legacy/lib/tng')).HOLLERITH_CODEC;

  types = new (require('intertype')).Intertype();

  ({isa, type_of, defaults, validate} = types.export());

  CHARWISE = require('charwise');

  BYTEWISE = require('bytewise');

  ({lets, freeze} = require('letsfreezethat'));

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
  this.hollerith_classic = function(cfg) {
    return new Promise((resolve) => {
      var integer_lists;
      ({integer_lists} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, integer_list, len, x;
          count = 0;
          for (i = 0, len = integer_lists.length; i < len; i++) {
            integer_list = integer_lists[i];
            x = HCODECLEGACY.encode(integer_list);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.hollerith_tng = function(cfg) {
    return new Promise((resolve) => {
      var integer_lists;
      ({integer_lists} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, integer_list, len, x;
          count = 0;
          for (i = 0, len = integer_lists.length; i < len; i++) {
            integer_list = integer_lists[i];
            x = HCODECLEGACY_TNG.encode(integer_list);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.hollerith_bcd = function(cfg) {
    return new Promise((resolve) => {
      var integer_lists;
      ({integer_lists} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, integer_list, len, x;
          count = 0;
          for (i = 0, len = integer_lists.length; i < len; i++) {
            integer_list = integer_lists[i];
            x = HCODECLEGACY_TNG._encode_bcd([integer_list]);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.bytewise = function(cfg) {
    return new Promise((resolve) => {
      var integer_lists;
      ({integer_lists} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, integer_list, len, x;
          count = 0;
          for (i = 0, len = integer_lists.length; i < len; i++) {
            integer_list = integer_lists[i];
            x = BYTEWISE.encode([integer_list]);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.charwise = function(cfg) {
    return new Promise((resolve) => {
      var integer_lists;
      ({integer_lists} = this.get_data(cfg));
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, i, integer_list, len, x;
          count = 0;
          for (i = 0, len = integer_lists.length; i < len; i++) {
            integer_list = integer_lists[i];
            x = CHARWISE.encode([integer_list]);
            count++;
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
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    mode = 'standard';
    mode = 'functional_test';
    mode = 'medium';
    switch (mode) {
      case 'standard':
        cfg = {
          list_count: 3e5,
          list_length_min: 1,
          list_length_max: HCODECLEGACY_TNG.vnr_width
        };
        repetitions = 5;
        break;
      case 'medium':
        cfg = {
          list_count: 1e3,
          list_length_min: 1,
          list_length_max: HCODECLEGACY_TNG.vnr_width
        };
        repetitions = 3;
        break;
      case 'functional_test':
        cfg = {
          list_count: 3,
          list_length_min: 1,
          list_length_max: HCODECLEGACY_TNG.vnr_width
        };
        repetitions = 1;
    }
    test_names = [/* add benchmarks for Hollerith v2 with and without validation */ 'hollerith_classic', 'hollerith_tng', 'hollerith_bcd', 'bytewise', 'charwise'];
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

//# sourceMappingURL=hollerith-tng.benchmarks.js.map