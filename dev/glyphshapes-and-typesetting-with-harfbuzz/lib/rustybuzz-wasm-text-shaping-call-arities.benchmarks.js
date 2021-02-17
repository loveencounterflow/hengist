(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, rpr, show_result, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES';

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

  //...........................................................................................................
  gcfg = {
    batchsizes: {
      singlebatch: null,
      smallbatch: null,
      mediumbatch: null,
      bigbatch: null
    },
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
    whisper("^3373^ fetching data...");
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
    whisper("^3373^ ...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._rustybuzz_wasm_shaping = function(cfg, format, batchsize_name) {
    return new Promise((resolve) => {
      var RBW, avg_batchsize, batch, batches, batchsize, batchsizes, count, data, font, font_bytes, font_bytes_hex, i, len, word, words;
      batchsize = gcfg.batchsizes[batchsize_name];
      if (batchsize == null) {
        throw new Error(`^34347^ unknown batchsize_name ${rpr(batchsize_name)}`);
      }
      RBW = require('../../../apps/rustybuzz-wasm/pkg');
      data = this.get_data(cfg);
      count = 0;
      ({font} = data);
      batches = [];
      words = (data.texts.join(' ')).split(/\s+/);
      batch = null;
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        if (batch == null) {
          batches.push(batch = []);
        }
        batch.push(word);
        if (batch.length >= batchsize) {
          batch = null;
        }
      }
      batchsizes = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = batches.length; j < len1; j++) {
          batch = batches[j];
          results.push(batch.length);
        }
        return results;
      })();
      avg_batchsize = (batchsizes.reduce((a, b) => {
        return a + b;
      })) / batchsizes.length;
      info(`average batchsize is ${avg_batchsize}`);
      batches = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = batches.length; j < len1; j++) {
          batch = batches[j];
          results.push([batch.length, batch.join(' ')]);
        }
        return results;
      })();
      //.........................................................................................................
      if (!RBW.has_font_bytes()) {
        whisper(`^44766^ sending ${font.path} to rustybuzz-wasm...`);
        font_bytes = FS.readFileSync(font.path);
        font_bytes_hex = font_bytes.toString('hex');
        RBW.set_font_bytes(font_bytes_hex);
        whisper("^44766^ done");
      }
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var j, len1, result, text, word_count;
          for (j = 0, len1 = batches.length; j < len1; j++) {
            [word_count, text] = batches[j];
            result = RBW.shape_text({format, text});
            if (gcfg.verbose) {
              show_result('rustybuzz_wasm_shaping', result);
            }
            count += word_count/* NOTE counting texts ("slabs", although they're words in this case) */
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.rustybuzz_wasm_json_shaping_bigbatch = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'json', 'bigbatch');
  };

  this.rustybuzz_wasm_json_shaping_mediumbatch = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'json', 'mediumbatch');
  };

  this.rustybuzz_wasm_json_shaping_smallbatch = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'json', 'smallbatch');
  };

  this.rustybuzz_wasm_json_shaping_singlebatch = function(cfg) {
    return this._rustybuzz_wasm_shaping(cfg, 'json', 'singlebatch');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, n, ref, ref1, repetitions, test_name, test_names;
    // gcfg.verbose  = true
    bench = BM.new_benchmarks();
    n = 100;
    // n             = 1
    gcfg.verbose = n === 1;
    gcfg.batchsizes.singlebatch = 1;
    gcfg.batchsizes.smallbatch = Math.floor(n / 10);
    gcfg.batchsizes.mediumbatch = Math.floor(n / 2);
    gcfg.batchsizes.bigbatch = n;
    cfg = {
      line_count: n,
      word_count: n
    };
    // debug '^889^', gcfg
    repetitions = 2;
    test_names = ['rustybuzz_wasm_json_shaping_bigbatch', 'rustybuzz_wasm_json_shaping_smallbatch', 'rustybuzz_wasm_json_shaping_mediumbatch', 'rustybuzz_wasm_json_shaping_singlebatch'];
    if (global.gc != null) {
      // 'rustybuzz_wasm_short_shaping'
      // 'rustybuzz_wasm_rusty_shaping'
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

  /*

```
 ~/jzr/rustybuzz-wasm  master !5  ~/jzr/nodexh/bin/nodexh ~/jzr/hengist/dev/glyphshapes-and-typesetting-with-harfbuzz/lib/rustybuzz-wasm-text-shaping-call-arities.benchmarks.js
00:00 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ------------------------------------------------------------------------------------------------------------
00:00 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^3373^ fetching data...
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^3373^ ...done
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 10
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^44766^ sending /home/flow/jzr/hengist/assets/jizura-fonts/EBGaramond12-Italic.otf to rustybuzz-wasm...
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^44766^ done
rustybuzz_wasm_json_shaping_smallbatch     0.753 s          10,000 items          13,285⏶Hz          75,271⏷nspc
00:05 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 1
rustybuzz_wasm_json_shaping_singlebatch    3.876 s          10,000 items           2,580⏶Hz         387,570⏷nspc
00:09 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 100
rustybuzz_wasm_json_shaping_bigbatch       0.381 s          10,000 items          26,263⏶Hz          38,076⏷nspc
00:09 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 50
rustybuzz_wasm_json_shaping_mediumbatch    0.397 s          10,000 items          25,193⏶Hz          39,693⏷nspc
00:10 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ------------------------------------------------------------------------------------------------------------
00:10 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 50
rustybuzz_wasm_json_shaping_mediumbatch    0.398 s          10,000 items          25,103⏶Hz          39,835⏷nspc
00:10 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 10
rustybuzz_wasm_json_shaping_smallbatch     0.704 s          10,000 items          14,199⏶Hz          70,428⏷nspc
00:11 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 1
rustybuzz_wasm_json_shaping_singlebatch    3.774 s          10,000 items           2,650⏶Hz         377,372⏷nspc
00:15 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 100
rustybuzz_wasm_json_shaping_bigbatch       0.378 s          10,000 items          26,441⏶Hz          37,820⏷nspc
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_bigbatch              26,352 Hz   100.0 % │████████████▌│
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_mediumbatch           25,148 Hz    95.4 % │███████████▉ │
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_smallbatch            13,742 Hz    52.1 % │██████▌      │
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_singlebatch            2,615 Hz     9.9 % │█▎           │
```

 * Verdicts

* text shaping is 10 times as fast when quering hundreds of words at a time as opposed to a single word at a time

 */

}).call(this);

//# sourceMappingURL=rustybuzz-wasm-text-shaping-call-arities.benchmarks.js.map