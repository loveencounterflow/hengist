(function() {
  'use strict';
  var BM, CND, DATA, FS, HOLLERITH, HOLLERITH_CODEC, HOLLERITH_CODEC_TNG, Hollerith, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, rpr, test, urge, warn, whisper;

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

  HOLLERITH_CODEC = require('../../../apps/hollerith-codec');

  HOLLERITH_CODEC_TNG = require('../../../apps/hollerith-codec/lib/tng');

  //===========================================================================================================
  // IMPLEMENTATIONS (TO BE MOVED TO HOLLERITH-CODEC)
  //-----------------------------------------------------------------------------------------------------------
  Hollerith = class Hollerith {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      this.sign_delta = 0x80000000/* used to lift negative numbers to non-negative */
      this.u32_width = 4/* bytes per element */
      this.vnr_width = 5/* maximum elements in VNR vector */
      this.nr_min = -0x80000000/* smallest possible VNR element */
      this.nr_max = +0x7fffffff/* largest possible VNR element */
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    encode_tng(vnr) {
      var R, i, idx, offset/* TAINT pre-compute constant */, ref, ref1, ref2;
      if (!((0 < (ref = vnr.length) && ref <= this.vnr_width))) {
        throw new Error(`^44798^ expected VNR to be between 1 and ${this.vnr_width} elements long, got length ${vnr.length}`);
      }
      R = Buffer.alloc(this.vnr_width * this.u32_width, 0x00);
      offset = -this.u32_width;
      for (idx = i = 0, ref1 = this.vnr_width; (0 <= ref1 ? i < ref1 : i > ref1); idx = 0 <= ref1 ? ++i : --i) {
        R.writeUInt32BE(((ref2 = vnr[idx]) != null ? ref2 : 0) + this.sign_delta, (offset += this.u32_width));
      }
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    encode_bcd(vnr) {
      var R, base, dpe, i, idx, minus, nr, padder, plus, ref, ref1, sign, vnr_width;
      vnr_width = 5/* maximum elements in VNR vector */
      dpe = 4/* digits per element */
      base = 36;
      plus = '+';
      minus = '!';
      padder = '.';
      R = [];
      for (idx = i = 0, ref = vnr_width; (0 <= ref ? i < ref : i > ref); idx = 0 <= ref ? ++i : --i) {
        nr = (ref1 = vnr[idx]) != null ? ref1 : 0;
        sign = nr >= 0 ? plus : minus;
        R.push(sign + ((Math.abs(nr)).toString(base)).padStart(dpe, padder));
      }
      R = R.join(',');
      return R;
    }

  };

  //===========================================================================================================
  HOLLERITH = new Hollerith();

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var DATOM, i, integer_lists, len, list_length, list_lengths;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    DATOM = require('../../../apps/datom');
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
    data_cache = DATOM.freeze(data_cache);
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
            x = HOLLERITH_CODEC.encode(integer_list);
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
            x = HOLLERITH.encode_tng(integer_list);
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
            x = HOLLERITH.encode_bcd([integer_list]);
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
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    cfg = {
      list_count: 3e5,
      list_length_min: 1,
      list_length_max: HOLLERITH.vnr_width
    };
    repetitions = 5;
    test_names = ['hollerith_classic', 'hollerith_tng', 'hollerith_bcd'];
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

//# sourceMappingURL=hollerith-tng.benchmarks.js.map