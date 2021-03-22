(function() {
  'use strict';
  var CND, DATA, DATOM, FS, FSP, PATH, badge, debug, echo, help, info, isa, rpr, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL/TESTS/HELPERS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  // #...........................................................................................................
  // test                      = require 'guy-test'
  // jr                        = JSON.stringify
  // { inspect, }              = require 'util'
  // xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
  // xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  FSP = require('fs/promises');

  types = new (require('intertype')).Intertype();

  ({isa, validate, validate_list_of} = types.export());

  DATA = require('../../../../lib/data-providers-nocache');

  DATOM = require('datom');

  //-----------------------------------------------------------------------------------------------------------
  types.declare('interpolatable_value', function(x) {
    if (this.isa.text(x)) {
      return true;
    }
    if (this.isa.float(x)) {
      return true;
    }
    if (this.isa.boolean(x)) {
      return true;
    }
    return false;
  });

  //-----------------------------------------------------------------------------------------------------------
  this.get_icql_settings = function(remove_db = false) {
    var R, error;
    R = {};
    R.connector = require('better-sqlite3');
    R.db_path = '/tmp/icql.db';
    R.icql_path = PATH.resolve(PATH.join(__dirname, '../../../../assets/icql/test.icql'));
    if (remove_db) {
      try {
        (require('fs')).unlinkSync(R.db_path);
      } catch (error1) {
        error = error1;
        if (!(error.code === 'ENOENT')) {
          throw error;
        }
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.try_to_remove_file = function(path) {
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
  this.resolve_path = function(path) {
    return PATH.resolve(PATH.join(__dirname, '../../../../', path));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.copy_over = async function(from_path, to_path) {
    if (to_path !== ':memory:' && to_path !== '') {
      this.try_to_remove_file(to_path);
    }
    await FSP.copyFile(from_path, to_path);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.interpolate = function(template, namespace) {
    var R, match, name, pattern, value;
    validate.text(template);
    validate.object(namespace);
    R = template;
    for (name in namespace) {
      value = namespace[name];
      if (!((R.indexOf((pattern = `{${name}}`))) > -1)) {
        continue;
      }
      validate.interpolatable_value(value);
      R = R.replaceAll(pattern, value);
    }
    if ((match = R.match(/(?<!\\)\{/))) {
      throw new Error(`unresolved curly bracket in template ${rpr(template)}`);
    }
    R = R.replaceAll('\\{', '{');
    R = R.replaceAll('\\}', '}');
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    var data_cache, texts;
    if (typeof data_cache !== "undefined" && data_cache !== null) {
      return data_cache;
    }
    whisper("retrieving test data...");
    //.........................................................................................................
    texts = DATA.get_words(cfg.word_count);
    //.........................................................................................................
    data_cache = {texts};
    data_cache = DATOM.freeze(data_cache);
    whisper("...done");
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_cfg = function() {
    var R;
    R = {
      // word_count: 10_000
      word_count: 10,
      db: {
        templates: {
          small: this.resolve_path('assets/icql/small-datamill.db'),
          big: this.resolve_path('assets/icql/Chinook_Sqlite_AutoIncrementPKs.db')
        },
        target: {
          small: this.resolve_path('data/icql/icql-{ref}-{size}.db'),
          big: this.resolve_path('data/icql/icql-{ref}-{size}.db')
        },
        work: {
          mem: ':memory:',
          fle: this.resolve_path('data/icql/icql-{ref}-{size}.db')
        },
        temp: {
          small: this.resolve_path('data/icql/icql-{ref}-{size}-temp.db'),
          big: this.resolve_path('data/icql/icql-{ref}-{size}-temp.db')
        },
        old: {
          small: this.resolve_path('data/icql/icql-{ref}-{size}-old.db'),
          big: this.resolve_path('data/icql/icql-{ref}-{size}-old.db')
        }
      },
      pragma_sets: {
        //.....................................................................................................
        /* thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 */
        fle: ['page_size = 4096', 'cache_size = 16384', 'temp_store = MEMORY', 'journal_mode = WAL', 'locking_mode = EXCLUSIVE', 'synchronous = OFF'],
        //.....................................................................................................
        mem: [],
        bare: []
      }
    };
    return R;
  };

}).call(this);

//# sourceMappingURL=helpers.js.map