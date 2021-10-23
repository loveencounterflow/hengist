(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, SVGO, ZLIB, alert, badge, data_cache, debug, despace_svg_pathdata, echo, freeze, gcfg, help, info, jr, log, rpr, test, urge, warn, whisper;

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

  ZLIB = require('zlib');

  SVGO = require('svgo');

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var deflate_dict, svg_paths;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    // DATOM = require '../../../apps/datom'
    //.........................................................................................................
    svg_paths = DATA.get_svg_pathdata(cfg.path_count);
    //.........................................................................................................
    deflate_dict = Buffer.from("M 727 -397 Q 748 -397 794 -370 Q 840 -342 840 -322 Q 840 -315 832 -310 Q 824 -305 817 -305 L 784 -309 Q 697 -320 630 -320 Q 494 -320 285 -291 Q 282 -29M 811 -601 Q 811 -588 784 -588 Q 782 -588 757 -589 Q 731 -590 691 -591 Q 651 -593 613 -593 Q 549 -593 502 -588 L 461 -582");
    data_cache = {svg_paths, deflate_dict};
    data_cache = freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  despace_svg_pathdata = function(svg_pathda) {
    var R;
    R = svg_pathda;
    R = R.replace(/([0-9])\x20([^0-9])/g, '$1$2');
    R = R.replace(/([^0-9])\x20([0-9])/g, '$1$2');
    return R;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // despace_svg_pathdata_2 = ( svg_pathda ) ->
  //   return svg_pathda.replace /([0-9])\x20([^0-9])|([^0-9])\x20([0-9])/g, '$1$2$3$4'

  //-----------------------------------------------------------------------------------------------------------
  this.svgo = function(cfg) {
    return new Promise((resolve) => {
      var compressed_size, count, original_size, svg_paths;
      ({svg_paths} = this.get_data(cfg));
      original_size = 0;
      compressed_size = 0;
      count = 0;
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var compressed_size_txt, compressed_svg_path, i, len, original_size_txt, ratio, ratio_txt, svg, svg_optimized, svg_path;
          for (i = 0, len = svg_paths.length; i < len; i++) {
            svg_path = svg_paths[i];
            svg = `<svg><path d='${svg_path}'/></svg>`;
            ({
              data: svg_optimized
            } = SVGO.optimize(svg));
            compressed_svg_path = svg_optimized.replace(/^.*d="([^"]+)".*$/, '$1');
            original_size += svg_path.length;
            compressed_size += compressed_svg_path.length;
            count++;
            if (cfg.show) {
              debug('^3343^', svg_path);
              debug('^3343^', compressed_svg_path);
            }
          }
          original_size_txt = CND.format_number(original_size);
          compressed_size_txt = CND.format_number(compressed_size);
          ratio = compressed_size / original_size;
          ratio_txt = ratio.toFixed(3);
          debug('^23^', `original_size: ${original_size_txt}, compressed_size: ${compressed_size_txt}, ratio: ${ratio_txt}`);
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._despace = function(cfg) {
    return new Promise((resolve) => {
      var compressed_size, count, despace, original_size, svg_paths;
      ({svg_paths} = this.get_data(cfg));
      original_size = 0;
      compressed_size = 0;
      count = 0;
      despace = (function() {
        switch (cfg.method) {
          case 1:
            return despace = despace_svg_pathdata;
          case 2:
            return despace = despace_svg_pathdata_2;
          default:
            throw new Error(`^7409^ unknown method ${rpr(cfg.method)}`);
        }
      })();
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var compressed_size_txt, compressed_svg_path, i, len, original_size_txt, ratio, ratio_txt, svg_path;
          for (i = 0, len = svg_paths.length; i < len; i++) {
            svg_path = svg_paths[i];
            original_size += svg_path.length;
            compressed_svg_path = despace(svg_path);
            compressed_size += compressed_svg_path.length;
            count++;
            if (cfg.show) {
              debug('^3343^', svg_path);
              debug('^3343^', compressed_svg_path);
            }
          }
          original_size_txt = CND.format_number(original_size);
          compressed_size_txt = CND.format_number(compressed_size);
          ratio = compressed_size / original_size;
          ratio_txt = ratio.toFixed(3);
          debug('^23^', `original_size: ${original_size_txt}, compressed_size: ${compressed_size_txt}, ratio: ${ratio_txt}`);
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.despace_1 = (cfg) => {
    return this._despace({
      ...cfg,
      method: 1
    });
  };

  // @despace_2 = ( cfg ) => @_despace { cfg..., method: 2, }

  //-----------------------------------------------------------------------------------------------------------
  this._zlib = function(cfg) {
    return new Promise((resolve) => {
      var compress, compressed_size, count, decompress, decompression_count, deflate_dict, despace, original_size, ref, ref1, svg_paths, zlib_cfg;
      compress = (function() {
        switch (cfg.method) {
          case 'deflate':
            return ZLIB.deflateSync;
          case 'deflateraw':
            return ZLIB.deflateRawSync;
          case 'deflaterawdict':
            return ZLIB.deflateRawSync;
          case 'gzip':
            return ZLIB.gzipSync;
          case 'brotli':
            return ZLIB.brotliCompressSync;
          default:
            throw new Error(`^445488^ unknown method ${rpr(cfg.method)}`);
        }
      })();
      decompress = (function() {
        switch (cfg.method) {
          case 'deflate':
            return ZLIB.inflateSync;
          case 'deflateraw':
            return ZLIB.inflateRawSync;
          case 'deflaterawdict':
            return ZLIB.inflateRawSync;
          case 'gzip':
            return ZLIB.gunzipSync;
          case 'brotli':
            return ZLIB.brotliDecompressSync;
          default:
            throw new Error(`^445488^ unknown method ${rpr(cfg.method)}`);
        }
      })();
      //.........................................................................................................
      ({svg_paths, deflate_dict} = this.get_data(cfg));
      count = 0;
      decompression_count = 0;
      zlib_cfg = {};
      if (cfg.method === 'deflaterawdict') {
        zlib_cfg.dictionary = deflate_dict;
      }
      zlib_cfg.level = (ref = cfg.level) != null ? ref : -1;
      zlib_cfg.strategy = (ref1 = cfg.strategy) != null ? ref1 : ZLIB.constants.Z_DEFAULT_STRATEGY;
      original_size = 0;
      compressed_size = 0;
      if (cfg.despace) {
        despace = despace_svg_pathdata;
      } else {
        despace = function(x) {
          return x;
        };
      }
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var compressed_buffer, compressed_size_txt, decompressed_buffer, decompressed_size, i, len, original_buffer, original_size_txt, ratio, ratio_txt, svg_path;
          for (i = 0, len = svg_paths.length; i < len; i++) {
            svg_path = svg_paths[i];
            original_size += (Buffer.from(svg_path)).length;
            svg_path = despace(svg_path);
            original_buffer = Buffer.from(svg_path);
            compressed_buffer = compress(original_buffer, zlib_cfg);
            compressed_size += compressed_buffer.length;
            if (Math.random() < cfg.outline_usage_rate) {
              decompression_count++;
              decompressed_buffer = decompress(compressed_buffer);
              decompressed_size = decompressed_buffer.length;
              if (original_buffer.length !== decompressed_size) {
                warn("^3445^", {
                  decompressed_size,
                  original_size: original_buffer.length
                }, cfg);
              }
            }
            if (cfg.show) {
              debug('^4354^', original_buffer.toString().slice(0, 51));
              debug('^4354^', original_buffer.length, compressed_buffer.length);
            }
            count++;
          }
          original_size_txt = CND.format_number(original_size);
          compressed_size_txt = CND.format_number(compressed_size);
          ratio = compressed_size / original_size;
          ratio_txt = ratio.toFixed(3);
          debug('^23^', `original_size: ${original_size_txt}, compressed_size: ${compressed_size_txt}, ratio: ${ratio_txt}; decompression_count: ${decompression_count}`);
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.zlib_deflateraw_1 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 1,
      strategy: ZLIB.constants.Z_DEFAULT_STRATEGY
    });
  };

  this.zlib_deflateraw_1_hfm = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 1,
      strategy: ZLIB.constants.Z_HUFFMAN_ONLY,
      despace: false
    });
  };

  this.zlib_deflateraw_1_hfm_optim = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 1,
      strategy: ZLIB.constants.Z_HUFFMAN_ONLY,
      despace: true
    });
  };

  this.zlib_deflateraw_1_rle = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 1,
      strategy: ZLIB.constants.Z_RLE
    });
  };

  this.zlib_deflateraw_1_fixed = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 1,
      strategy: ZLIB.constants.Z_FIXED
    });
  };

  this.zlib_gzip_1 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip',
      'level': 1,
      strategy: ZLIB.constants.Z_DEFAULT_STRATEGY
    });
  };

  this.zlib_gzip_1_hfm = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip',
      'level': 1,
      strategy: ZLIB.constants.Z_HUFFMAN_ONLY
    });
  };

  this.zlib_gzip_1_rle = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip',
      'level': 1,
      strategy: ZLIB.constants.Z_RLE
    });
  };

  this.zlib_gzip_1_fixed = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip',
      'level': 1,
      strategy: ZLIB.constants.Z_FIXED
    });
  };

  this.zlib_deflate = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflate'
    });
  };

  this.zlib_deflate_1 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflate',
      'level': 1
    });
  };

  this.zlib_deflate_5 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflate',
      'level': 5
    });
  };

  this.zlib_deflate_9 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflate',
      'level': 9
    });
  };

  this.zlib_deflateraw = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw'
    });
  };

  this.zlib_deflateraw_5 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 5
    });
  };

  this.zlib_deflateraw_9 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflateraw',
      'level': 9
    });
  };

  this.zlib_deflaterawdict = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'deflaterawdict'
    });
  };

  this.zlib_gzip = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip'
    });
  };

  this.zlib_gzip_5 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip',
      'level': 5
    });
  };

  this.zlib_gzip_9 = (cfg) => {
    return this._zlib({
      ...cfg,
      method: 'gzip',
      'level': 9
    });
  };

  // @zlib_brotli          = ( cfg ) => @_zlib { cfg..., method: 'brotli',         }

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, ref2, ref3, ref4, repetitions, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    // cfg           = { path_count: 1_000, }
    cfg = {
      path_count: 10_000
    };
    // cfg           = { path_count: 3, }
    //.........................................................................................................
    /* outline_usage_rate controls how many of the compressed outlines will get decompressed, thereby
     reflecting the fact that as more and more (hundreds of thousand) outlines are stored, fewer and fewer will
     ever be used for typesetting. It is therefore a measure of how much more we value compression speed over
     decompression speed. */
    if ((0 < (ref = cfg.path_count) && ref < 1_000)) {
      cfg.outline_usage_rate = 1.00;
    } else if ((1_000 < (ref1 = cfg.path_count) && ref1 < 5_000)) {
      cfg.outline_usage_rate = 0.50;
    } else if ((5_000 < (ref2 = cfg.path_count) && ref2 < 10_000)) {
      cfg.outline_usage_rate = 0.25;
    } else {
      cfg.outline_usage_rate = 0.10;
    }
    //.........................................................................................................
    cfg.show = cfg.path_count < 10;
    repetitions = 5;
    test_names = ['zlib_deflateraw_1_hfm', 'zlib_gzip_1_hfm', 'zlib_deflateraw_1_rle', 'zlib_gzip_1_rle'];
    if (global.gc != null) {
      // 'zlib_deflateraw_1_hfm_optim'
      // # 'despace_1'
      // # # 'despace_2' ### not equivalent to despace_1 as it misses some spaces ###

      // 'zlib_deflateraw_1_fixed'
      // 'zlib_deflateraw_1'
      // 'zlib_gzip_1_fixed'
      // 'zlib_gzip_1'

      // # 'svgo'
      // 'zlib_deflate_1'
      // 'zlib_deflate'
      // 'zlib_deflate_5'
      // 'zlib_deflate_9'
      // 'zlib_deflateraw'
      // 'zlib_deflateraw_5'
      // 'zlib_deflateraw_9'
      // # 'zlib_deflaterawdict'
      // 'zlib_gzip'
      // 'zlib_gzip_5'
      // 'zlib_gzip_9'
      // # 'zlib_brotli'
      global.gc();
    }
    data_cache = null;
    for (_ = i = 1, ref3 = repetitions; (1 <= ref3 ? i <= ref3 : i >= ref3); _ = 1 <= ref3 ? ++i : --i) {
      whisper('-'.repeat(108));
      ref4 = CND.shuffle(test_names);
      for (j = 0, len = ref4.length; j < len; j++) {
        test_name = ref4[j];
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

  // debug '^233^', "Z_NO_COMPRESSION:       ", ZLIB.constants.Z_NO_COMPRESSION
// debug '^233^', "Z_BEST_SPEED:           ", ZLIB.constants.Z_BEST_SPEED
// debug '^233^', "Z_BEST_COMPRESSION:     ", ZLIB.constants.Z_BEST_COMPRESSION
// debug '^233^', "Z_DEFAULT_COMPRESSION:  ", ZLIB.constants.Z_DEFAULT_COMPRESSION
// debug '^233^', "Z_FILTERED:             ", ZLIB.constants.Z_FILTERED
// debug '^233^', "Z_HUFFMAN_ONLY:         ", ZLIB.constants.Z_HUFFMAN_ONLY
// debug '^233^', "Z_RLE:                  ", ZLIB.constants.Z_RLE
// debug '^233^', "Z_FIXED:                ", ZLIB.constants.Z_FIXED
// debug '^233^', "Z_DEFAULT_STRATEGY:     ", ZLIB.constants.Z_DEFAULT_STRATEGY
// pd                        = 'M839-18C839-31 832-31 812-31C754-31 754-39 754-48C754-48 754-56 758-71L893-612C901-644 909-652 972-652C993-652 1002-652 1002-670C1002-683 994-683 977-683L849-683C827-683 824-683 813-665L473-100L417-661C415-683 413-683 389-683L256-683C240-683 229-683 229-664C229-652 237-652 256-652C287-652 314-652 314-635C314-632 314-630 310-616L182-101C168-45 130-33 85-31C77-31 66-30 66-12C66-3 72 0 79 0C109 0 143-3 174-3C206-3 241 0 272 0C278 0 290 0 290-18C290-30 283-31 271-31C214-33 212-59 212-74C212-77 212-83 216-99L349-630L350-630L411-24C413-7 413 0 428 0C441 0 446-7 452-18L825-639L826-639L685-73C677-39 671-31 603-31C587-31 576-31 576-12C576 0 587 0 590 0C627 0 666-3 704-3C742-3 783 0 820 0C827 0 839 0 839-18Z'
// svg                       = """<svg><path d='#{pd}'/></svg>"""
// { data: svg_optimized, }  = SVGO.optimize svg
// pd_optimized              = svg_optimized.replace /^.*d="([^"]+)".*$/, '$1'
// debug '^746^', pd
// debug '^746^', pd_optimized
// debug '^746^', svg.length, svg_optimized.length, svg_optimized.length / svg.length

}).call(this);

//# sourceMappingURL=path-optimizers.benchmarks.js.map