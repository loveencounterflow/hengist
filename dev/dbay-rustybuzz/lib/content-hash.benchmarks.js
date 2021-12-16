(function() {
  'use strict';
  var BM, CND, CP, CRYPTO, DATA, FS, GUY, PATH, XXH, XXHADD, alert, badge, data_cache, debug, echo, gcfg, help, info, jr, log, rpr, test, urge, walk_lines, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CONTENT-HASH-BENCHMARKS';

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

  GUY = require('guy');

  XXHADD = require('xxhash-addon');

  ({walk_lines} = (require('../../../apps/guy')).fs);

  CRYPTO = require('crypto');

  XXH = require('xxhashjs');

  CP = require('child_process');

  // #-----------------------------------------------------------------------------------------------------------
  // @get_data = ( cfg ) ->
  //   return data_cache if data_cache?
  //   whisper "retrieving test data..."
  //   # DATOM = require '../../../apps/datom'
  //   #.........................................................................................................
  //   buffer        = Buffer.from DATA.get_svg_pathdata cfg.path_count
  //   data_cache    = GUY.lft.freeze { buffer, }
  //   whisper "...done"
  //   return data_cache

  //-----------------------------------------------------------------------------------------------------------
  this._crypto = function(cfg) {
    return new Promise((resolve) => {
      var classname, clasz;
      ({classname} = cfg);
      // { buffer            } = @get_data cfg
      clasz = XXHADD[classname];
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, digest, hasher, line, ref;
          count = 0;
          hasher = CRYPTO.createHash(classname);
          ref = walk_lines(cfg.path, {
            decode: false
          });
          for (line of ref) {
            count += line.length;
            hasher.update(line);
          }
          digest = hasher.digest();
          if (cfg.show) {
            debug('^339^', digest.toString('hex'));
          }
          // hasher.reset();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._xxhadd = function(cfg) {
    return new Promise((resolve) => {
      var classname, clasz;
      ({classname} = cfg);
      // { buffer            } = @get_data cfg
      clasz = XXHADD[classname];
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, digest, hasher, line, ref;
          count = 0;
          hasher = new clasz();
          ref = walk_lines(cfg.path, {
            decode: false
          });
          for (line of ref) {
            count += line.length;
            hasher.update(line);
          }
          digest = hasher.digest();
          if (cfg.show) {
            debug('^339^', digest.toString('hex'));
          }
          // hasher.reset();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._xxh = function(cfg) {
    return new Promise((resolve) => {
      var classname, clasz;
      ({classname} = cfg);
      // { buffer            } = @get_data cfg
      clasz = XXH[classname];
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, digest, hasher, line, ref;
          count = 0;
          hasher = clasz();
          ref = walk_lines(cfg.path, {
            decode: false
          });
          for (line of ref) {
            count += line.length;
            hasher.update(line);
          }
          digest = hasher.digest();
          if (cfg.show) {
            debug('^339^', digest.toString(16));
          }
          // hasher.reset();
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._cp = function(cfg) {
    return new Promise((resolve) => {
      /*
      sha224sum
      sha256sum-mint
      sha512sum
      sha256sum
      sharesec
      sha1sum
      sha384sum
      shasum
      */
      var count;
      count = (FS.statSync(cfg.path)).size;
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var digest, options, result;
          // options = [ '-b', 'nonexistingfile', ]
          options = ['-b', cfg.path];
          result = CP.spawnSync(cfg.classname, options);
          if (result.status !== 0) {
            throw new Error(result.stderr.toString('utf-8'));
          }
          digest = result.stdout.toString('utf-8');
          if (cfg.show) {
            debug('^339^', digest);
          }
          // debug '^339^', 'stdout', rpr result.stdout
          // debug '^339^', 'stderr', rpr result.stderr
          // debug '^339^', 'status', rpr result.status
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.sha1 = (cfg) => {
    return this._crypto({
      ...cfg,
      classname: 'sha1'
    });
  };

  this.sha256 = (cfg) => {
    return this._crypto({
      ...cfg,
      classname: 'sha256'
    });
  };

  this.md5 = (cfg) => {
    return this._crypto({
      ...cfg,
      classname: 'md5'
    });
  };

  this.xxhadd_32 = (cfg) => {
    return this._xxhadd({
      ...cfg,
      classname: 'XXHash32'
    });
  };

  this.xxhadd_64 = (cfg) => {
    return this._xxhadd({
      ...cfg,
      classname: 'XXHash64'
    });
  };

  this.xxhadd_3 = (cfg) => {
    return this._xxhadd({
      ...cfg,
      classname: 'XXHash3'
    });
  };

  this.xxhadd_128 = (cfg) => {
    return this._xxhadd({
      ...cfg,
      classname: 'XXHash128'
    });
  };

  this.xxh32 = (cfg) => {
    return this._xxh({
      ...cfg,
      classname: 'h32'
    });
  };

  this.xxh64 = (cfg) => {
    return this._xxh({
      ...cfg,
      classname: 'h64'
    });
  };

  this.cp_sha1sum = (cfg) => {
    return this._cp({
      ...cfg,
      classname: 'sha1sum'
    });
  };

  this.cp_sha512sum = (cfg) => {
    return this._cp({
      ...cfg,
      classname: 'sha512sum'
    });
  };

  this.cp_sha256sum = (cfg) => {
    return this._cp({
      ...cfg,
      classname: 'sha256sum'
    });
  };

  this.cp_sha224sum = (cfg) => {
    return this._cp({
      ...cfg,
      classname: 'sha224sum'
    });
  };

  this.cp_md5sum = (cfg) => {
    return this._cp({
      ...cfg,
      classname: 'md5sum'
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_fs_walk_lines = function(cfg) {
    return new Promise((resolve) => {
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count, line, ref;
          count = 0;
          ref = walk_lines(cfg.path, {
            decode: false
          });
          for (line of ref) {
            count += line.length;
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
    var _, bench, cfg, i, j, len, path, ref, ref1, repetitions, show, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    path = 'larry-wall-on-regexes.html';
    show = false;
    path = 'short-proposal.mkts.md';
    show = true;
    path = 'svg-pathdata.txt';
    show = false;
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    //.........................................................................................................
    cfg = {path, show};
    repetitions = 3;
    test_names = [
      'sha1',
      'sha256',
      'md5',
      // 'xxhadd_32'
      // 'xxhadd_64'
      // 'xxhadd_3'
      'xxhadd_128',
      'cp_sha512sum',
      'cp_sha256sum',
      'cp_sha1sum',
      'cp_sha224sum',
      'cp_md5sum',
      'guy_fs_walk_lines'
    ];
    if (global.gc != null) {
      // 'xxh32'
      // 'xxh64'
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

//# sourceMappingURL=content-hash.benchmarks.js.map