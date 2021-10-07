(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, freeze, gcfg, help, info, jr, log, rpr, test, urge, warn, whisper;

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

  ({freeze} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  this.intertext_splitlines = function(cfg) {
    return new Promise((resolve) => {
      var SL;
      SL = require('intertext-splitlines');
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var buffer, bytes_read, count, ctx, fd, line, path, ref, ref1;
          count = 0;
          ctx = SL.new_context({
            splitter: '\n',
            decode: true,
            skip_empty_last: true,
            keep_newlines: true
          });
          path = cfg.paths[cfg.size];
          fd = FS.openSync(path);
          while (true) {
            buffer = Buffer.alloc(cfg.chunk_size);
            bytes_read = FS.readSync(fd, buffer);
            if (bytes_read === 0) {
              break;
            }
            if (bytes_read < cfg.chunk_size) {
              buffer = buffer.slice(0, bytes_read);
            }
            ref = SL.walk_lines(ctx, buffer);
            for (line of ref) {
              count++;
              if (cfg.show) {
                debug('^888-1^', {count, line});
              }
            }
          }
          ref1 = SL.flush(ctx);
          for (line of ref1) {
            count++;
            if (cfg.show) {
              debug('^888-2^', {count, line});
            }
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._n_readlines = function(cfg) {
    return new Promise((resolve) => {
      var Readlines;
      if (cfg.use_patched) {
        Readlines = require('../../../apps/guy/dependencies/n-readlines-patched');
      } else {
        Readlines = require('n-readlines');
      }
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, line, path, readlines, readlines_cfg;
          count = 0;
          path = cfg.paths[cfg.size];
          readlines_cfg = {
            readChunk: cfg.chunk_size,
            newLineCharacter: '\n' // nl
          };
          readlines = new Readlines(path, readlines_cfg);
          while ((line = readlines.next()) !== false) {
            count++;
            line = line.toString('utf-8');
            if (cfg.show) {
              debug('^888-1^', {count, line});
            }
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  this.n_readlines = function(cfg) {
    return this._n_readlines({
      ...cfg,
      use_patched: false
    });
  };

  this.n_readlines_patched = function(cfg) {
    return this._n_readlines({
      ...cfg,
      use_patched: true
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_fs_walk_lines = function(cfg) {
    return new Promise((resolve) => {
      var walk_lines;
      ({walk_lines} = (require('../../../apps/guy')).fs);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, line, path, ref;
          count = 0;
          path = cfg.paths[cfg.size];
          ref = walk_lines(path);
          for (line of ref) {
            count++;
            if (cfg.show) {
              debug('^888-1^', {count, line});
            }
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
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    cfg = {
      // size:         'small'
      size: 'big1',
      // chunk_size:   100
      // chunk_size:   1 * 1024
      chunk_size: 4 * 1024/* optimum */,
      // chunk_size:   8 * 1024
      // chunk_size:   16 * 1024
      // chunk_size:   64 * 1024
      paths: {
        small: PATH.resolve(PATH.join(__dirname, '../../../assets/a-few-words.txt')),
        big1: '/usr/share/dict/american-english'
      }
    };
    cfg.show = cfg.size === 'small';
    repetitions = 5;
    test_names = ['n_readlines', 'n_readlines_patched', 'intertext_splitlines', 'guy_fs_walk_lines'];
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

//# sourceMappingURL=readlines.benchmarks.js.map