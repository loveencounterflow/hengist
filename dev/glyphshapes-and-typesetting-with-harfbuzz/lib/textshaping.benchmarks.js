(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, rpr, show_result, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEXTSHAPING';

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
  this.harfbuzz_shaping = function(cfg) {
    return new Promise((resolve) => {
      var HB, count, data, font, texts;
      HB = require('../../../apps/glyphshapes-and-typesetting-with-harfbuzz');
      // HB.ensure_harfbuzz_version() ### NOTE: optional diagnostic ###
      data = this.get_data(cfg);
      count = 0;
      ({texts, font} = data);
      resolve(() => {
        return new Promise(async(resolve) => {
          var i, len, result, text;
          for (i = 0, len = texts.length; i < len; i++) {
            text = texts[i];
            result = (await HB.shape_text({text, font}));
            if (gcfg.verbose) {
              show_result('harfbuzz_shaping', result);
            }
            count += text.length/* NOTE counting approximate number of glyphs */
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.harfbuzzjs_shaping = function(cfg) {
    return new Promise((resolve) => {
      var HB, count, data, font, fs, texts;
      HB = require('../../../apps/glyphshapes-and-typesetting-with-harfbuzz/lib/demo-harfbuzzjs');
      // HB.ensure_harfbuzz_version() ### NOTE: optional diagnostic ###
      data = this.get_data(cfg);
      count = 0;
      ({texts, font} = data);
      fs = HB.new_fontshaper(font.path, font.features_obj);
      resolve(() => {
        return new Promise(async(resolve) => {
          var i, len, result, text;
          for (i = 0, len = texts.length; i < len; i++) {
            text = texts[i];
            result = (await HB.shape_text(fs, text));
            if (gcfg.verbose) {
              show_result('harfbuzzjs_shaping', result);
            }
            count += text.length/* NOTE counting approximate number of glyphs */
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.opentypejs_shaping = function(cfg) {
    return new Promise(async(resolve) => {
      var OT, count, data, font, otfont, texts;
      OT = require('../../../apps/glyphshapes-and-typesetting-with-harfbuzz/lib/demo-opentypejs');
      data = this.get_data(cfg);
      count = 0;
      ({texts, font} = data);
      otfont = (await OT.otfont_from_path(font.path)); //, font.features_obj
      resolve(() => {
        return new Promise((resolve) => {
          var i, len, result, text;
          for (i = 0, len = texts.length; i < len; i++) {
            text = texts[i];
            result = OT.shape_text(otfont, text);
            if (gcfg.verbose) {
              show_result('opentypejs_shaping', result);
            }
            count += text.length/* NOTE counting approximate number of glyphs */
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.fontkit_shaping = function(cfg) {
    return new Promise(async(resolve) => {
      var FK, count, data, fkfont, font, texts;
      FK = require('../../../apps/glyphshapes-and-typesetting-with-harfbuzz/lib/demo-fontkit');
      data = this.get_data(cfg);
      count = 0;
      ({texts, font} = data);
      fkfont = (await FK.fkfont_from_path(font.path)); //, font.features_obj
      resolve(() => {
        return new Promise((resolve) => {
          var i, len, result, text;
          for (i = 0, len = texts.length; i < len; i++) {
            text = texts[i];
            result = FK.shape_text(fkfont, text);
            if (gcfg.verbose) {
              show_result('fontkit_shaping', result);
            }
            count += text.length/* NOTE counting approximate number of glyphs */
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._rustybuzz_wasm_shaping = function(cfg, format) {
    return new Promise((resolve) => {
      var RBW, count, data, font, font_bytes, font_bytes_hex, texts;
      RBW = require('../../../apps/rustybuzz-wasm/pkg');
      data = this.get_data(cfg);
      count = 0;
      ({texts, font} = data);
      if (!RBW.has_font_bytes()) {
        whisper(`^44766^ sending ${font.path} to rustybuzz-wasm...`);
        font_bytes = FS.readFileSync(font.path);
        font_bytes_hex = font_bytes.toString('hex');
        RBW.set_font_bytes(font_bytes_hex);
        whisper("^44766^ done");
      }
      // format          = 'json'
      // format          = 'short'
      // format          = 'rusty'
      resolve(() => {
        return new Promise((resolve) => {
          var i, len, result, text;
          for (i = 0, len = texts.length; i < len; i++) {
            text = texts[i];
            result = RBW.shape_text({format, text});
            if (gcfg.verbose) {
              show_result('rustybuzz_wasm_shaping', result);
            }
            count += text.length/* NOTE counting approximate number of glyphs */
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.rustybuzz_wasm_json_shaping = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'json');
  };

  this.rustybuzz_wasm_short_shaping = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'short');
  };

  this.rustybuzz_wasm_rusty_shaping = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'rusty');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, n, ref, ref1, repetitions, test_name, test_names;
    // gcfg.verbose  = true
    bench = BM.new_benchmarks();
    n = 100;
    gcfg.verbose = n === 1;
    cfg = {
      line_count: n,
      word_count: n
    };
    repetitions = 2;
    test_names = ['harfbuzz_shaping', 'harfbuzzjs_shaping', 'opentypejs_shaping', 'fontkit_shaping', 'rustybuzz_wasm_json_shaping', 'rustybuzz_wasm_short_shaping', 'rustybuzz_wasm_rusty_shaping'];
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

//# sourceMappingURL=textshaping.benchmarks.js.map