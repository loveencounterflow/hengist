(function() {
  'use strict';
  var BM, CND, DATA, FS, FSP, PATH, alert, badge, data_cache, debug, echo, gcfg, help, info, isa, jr, log, resolve_path, rpr, show_result, test, try_to_remove_file, types, urge, validate, warn, whisper;

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

  FSP = require('fs/promises');

  DATA = require('../../../lib/data-providers-nocache');

  test = require('guy-test');

  ({jr} = CND);

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  types = new (require('intertype')).Intertype();

  ({isa, validate} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  gcfg = {
    verbose: false,
    echo: false
  };

  //-----------------------------------------------------------------------------------------------------------
  resolve_path = function(path) {
    return PATH.resolve(PATH.join(__dirname, '../../../', path));
  };

  //-----------------------------------------------------------------------------------------------------------
  try_to_remove_file = function(path) {
    var error;
    try {
      FS.unlinkSync(path);
    } catch (error1) {
      error = error1;
      if (error.code === 'ENOENT') {
        return;
      }
      throw error;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.is_new = function(x) {
    var R;
    R = !this.is_new.cache.has(x);
    this.is_new.cache.set(x, true);
    return R;
  };

  this.is_new.cache = new Map();

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
    var DATOM, texts;
    if (data_cache != null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    DATOM = require('../../../apps/datom');
    //.........................................................................................................
    texts = DATA.get_words(cfg.word_count);
    //.........................................................................................................
    data_cache = {texts};
    data_cache = DATOM.freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._btsql3 = function(cfg) {
    return new Promise(async(resolve) => {
      var Db, count, db_cfg, db_target_path, db_template_path, db_work_path, defaults;
      // data          = @get_data cfg
      count = 0;
      Db = require('better-sqlite3');
      defaults = {
        pragmas: [],
        size: 'small'
      };
      cfg = {...defaults, ...cfg};
      db_work_path = cfg.db.work[cfg.mode].replaceAll('${0}', cfg.ref);
      validate.nonempty_text(cfg.ref);
      db_template_path = cfg.db.templates[cfg.size].replaceAll('${0}', cfg.ref);
      db_target_path = cfg.db.target[cfg.size].replaceAll('${0}', cfg.ref);
      validate.nonempty_text(db_template_path);
      validate.nonempty_text(db_target_path);
      db_cfg = null;
      if (gcfg.verbose) {
        help("^44433^ template  DB:", db_template_path);
        help("^44433^ work      DB:", db_work_path);
        help("^44433^ target    DB:", db_target_path);
      }
      try_to_remove_file(db_target_path);
      if (db_work_path !== ':memory:') {
        try_to_remove_file(db_work_path);
      }
      await FSP.copyFile(db_template_path, db_target_path);
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => { // ^777854^
          var _icql, db, error, fle_schema, ref, ref1, work_schema;
          _icql = {...(require('../../../apps/icql'))._local_methods};
          //=======================================================================================================
          db = new Db(db_target_path, db_cfg);
          debug('^644-1^', CND.truth(this.is_new(Db)));
          debug('^644-2^', CND.truth(this.is_new(db)));
          debug('^644-3^', CND.truth(this.is_new(_icql)));
          debug('^644-4^', CND.truth(this.is_new(defaults)));
          debug('^47785^', db);
          _icql.settings = {
            echo: (ref = gcfg.echo) != null ? ref : false,
            verbose: (ref1 = gcfg.verbose) != null ? ref1 : false
          };
          _icql.db = db;
          fle_schema = 'main';
          work_schema = 'x';
          _icql.attach(db_work_path, work_schema);
          try {
            _icql.copy_schema(fle_schema, work_schema);
          } catch (error1) {
            error = error1;
            warn('^68683^', db);
            if (error.code !== 'SQLITE_ERROR') {
              throw error;
            }
            warn('^68683^', CND.reverse(error.message));
          }
          info('^338373^', {
            size: cfg.size,
            db_template_path,
            db_target_path
          });
          _icql.close();
          return resolve(1);
        });
      });
      // resolve count
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.btsql3_mem_small = (cfg) => {
    return this._btsql3({
      ...cfg,
      ref: 'small',
      mode: 'mem',
      size: 'small'
    });
  };

  this.btsql3_mem_big = (cfg) => {
    return this._btsql3({
      ...cfg,
      ref: 'big',
      mode: 'mem',
      size: 'big'
    });
  };

  this.btsql3_fle_small = (cfg) => {
    return this._btsql3({
      ...cfg,
      ref: 'small',
      mode: 'fle',
      size: 'small'
    });
  };

  this.btsql3_fle_big = (cfg) => {
    return this._btsql3({
      ...cfg,
      ref: 'big',
      mode: 'fle',
      size: 'big'
    });
  };

  // @btsql3_mem_thrds    = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'threads = 4;', ] }

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    gcfg.verbose = true;
    gcfg.verbose = false;
    bench = BM.new_benchmarks();
    cfg = {
      db: {
        templates: {
          small: resolve_path('assets/icql/small-datamill.db'),
          big: resolve_path('assets/icql/Chinook_Sqlite_AutoIncrementPKs.db')
        },
        target: {
          small: resolve_path('data/icql/copy-schemas-benchmarks-${0}.db'),
          big: resolve_path('data/icql/copy-schemas-benchmarks-${0}.db')
        },
        work: {
          mem: ':memory:',
          fle: 'data/icql/copy-schemas-work-${0}.db'
        }
      }
    };
    repetitions = 1;
    // 'btsql3_mem_big'
    // 'btsql3_mem_small'
    test_names = ['btsql3_fle_big', 'btsql3_fle_small'];
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

//# sourceMappingURL=copy-schemas.js.map