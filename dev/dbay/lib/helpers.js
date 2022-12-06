(function() {
  'use strict';
  var CND, DATA, DATOM, Dba, FS, FSP, H, PATH, badge, dba_types, debug, echo, equals, help, info, isa, rpr, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

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

  this.types = new (require('intertype')).Intertype();

  ({isa, validate, validate_list_of, equals} = this.types.export());

  DATA = require('../../../lib/data-providers-nocache');

  DATOM = require('datom');

  H = this;

  (() => {    //-----------------------------------------------------------------------------------------------------------
    var message;
    if (indexOf.call(process.argv, '--dbay-use-installed') >= 0) {
      H.dbay_use_installed = true;
      H.dbay_path = 'dbay';
      message = "using installed version of dbay";
    } else {
      H.dbay_use_installed = false;
      H.dbay_path = '../../../apps/dbay';
      message = "using linked dbay";
    }
    debug('^3337^', CND.reverse(message));
    process.on('exit', function() {
      return debug('^3337^', CND.reverse(message));
    });
    return null;
  })();

  //-----------------------------------------------------------------------------------------------------------
  ({Dba} = require(H.dbay_path));

  dba_types = require(H.dbay_path + '/lib/types');

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('interpolatable_value', function(x) {
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
  this.types.declare('procure_db_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.nonempty_text x.ref": function(x) {
        return this.isa.nonempty_text(x.ref);
      },
      "@isa.nonempty_text x.size": function(x) {
        return this.isa.nonempty_text(x.size);
      },
      "@isa.boolean x.reuse": function(x) {
        return this.isa.boolean(x.reuse);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('looks_like_db_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "dba_types.isa.dba x.dba": function(x) {
        return dba_types.isa.dba(x.dba);
      },
      "dba_types.isa.ic_schema x.schema": function(x) {
        return dba_types.isa.ic_schema(x.schema);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('datamill_db_lookalike', function(cfg) {
    var dba, error, schema, schema_i;
    this.validate.looks_like_db_cfg(cfg);
    ({dba, schema} = cfg);
    schema_i = dba.sql.I(schema);
    try {
      if ((dba.first_value(dba.query(`select count(*) from ${schema_i}.main;`))) !== 327) {
        return false;
      }
    } catch (error1) {
      // debug '^35354^', dba.list dba.query "select * from #{schema_i}.main order by vnr_blob limit 3;"
      error = error1;
      if (error.code !== 'SQLITE_ERROR') {
        throw error;
      }
      return false;
    }
    return true;
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('chinook_db_lookalike', function(cfg) {
    var db_objects, dba, error, schema, schema_i;
    this.validate.looks_like_db_cfg(cfg);
    ({dba, schema} = cfg);
    schema_i = dba.sql.I(schema);
    try {
      db_objects = dba.list(dba.query(`select type, name from ${schema_i}.sqlite_schema where true or type is 'table' order by name;`));
      info(db_objects);
      if (!equals(db_objects, [
        {
          type: 'table',
          name: 'Album'
        },
        {
          type: 'table',
          name: 'Artist'
        },
        {
          type: 'table',
          name: 'Customer'
        },
        {
          type: 'table',
          name: 'Employee'
        },
        {
          type: 'table',
          name: 'Genre'
        },
        {
          type: 'index',
          name: 'IFK_AlbumArtistId'
        },
        {
          type: 'index',
          name: 'IFK_CustomerSupportRepId'
        },
        {
          type: 'index',
          name: 'IFK_EmployeeReportsTo'
        },
        {
          type: 'index',
          name: 'IFK_InvoiceCustomerId'
        },
        {
          type: 'index',
          name: 'IFK_InvoiceLineInvoiceId'
        },
        {
          type: 'index',
          name: 'IFK_InvoiceLineTrackId'
        },
        {
          type: 'index',
          name: 'IFK_PlaylistTrackTrackId'
        },
        {
          type: 'index',
          name: 'IFK_TrackAlbumId'
        },
        {
          type: 'index',
          name: 'IFK_TrackGenreId'
        },
        {
          type: 'index',
          name: 'IFK_TrackMediaTypeId'
        },
        {
          type: 'table',
          name: 'Invoice'
        },
        {
          type: 'table',
          name: 'InvoiceLine'
        },
        {
          type: 'table',
          name: 'MediaType'
        },
        {
          type: 'table',
          name: 'Playlist'
        },
        {
          type: 'table',
          name: 'PlaylistTrack'
        },
        {
          type: 'table',
          name: 'Track'
        },
        {
          type: 'index',
          name: 'sqlite_autoindex_PlaylistTrack_1'
        },
        {
          type: 'table',
          name: 'sqlite_sequence'
        }
      ])) {
        return false;
      }
    } catch (error1) {
      error = error1;
      if (error.code !== 'SQLITE_ERROR') {
        throw error;
      }
      return false;
    }
    return true;
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('micro_db_lookalike', function(cfg) {
    var db_objects, dba, error, schema, schema_i;
    this.validate.looks_like_db_cfg(cfg);
    ({dba, schema} = cfg);
    schema_i = dba.sql.I(schema);
    try {
      db_objects = dba.list(dba.query(`select type, name from ${schema_i}.sqlite_schema order by name;`));
      info(db_objects);
      if (!equals(db_objects, [
        {
          type: 'table',
          name: 'main'
        }
      ])) {
        return false;
      }
    } catch (error1) {
      error = error1;
      if (error.code !== 'SQLITE_ERROR') {
        throw error;
      }
      return false;
    }
    return true;
  });

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.file_exists = function(path) {
    var error, stat;
    try {
      (stat = FS.statSync(path));
    } catch (error1) {
      error = error1;
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
    if (stat.isFile()) {
      return true;
    }
    throw new Error(`^434534^ not a file: ${rpr(path)}\n${rpr(stat)}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.ensure_file_exists = function(path) {
    if (!this.file_exists(path)) {
      throw new Error(`^434534^ not a file: ${rpr(path)}`);
    }
    return null;
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
    return PATH.resolve(PATH.join(__dirname, '../../../', path));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.copy_over = async function(from_path, to_path) {
    if (to_path !== ':memory:' && to_path !== '') {
      this.try_to_remove_file(`${to_path}-wal`);
      this.try_to_remove_file(`${to_path}-journal`);
      this.try_to_remove_file(`${to_path}-shm`);
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
      sql: {
        small: this.resolve_path('assets/icql/small-datamill.sql'),
        big: this.resolve_path('assets/icql/Chinook_Sqlite_AutoIncrementPKs.sql')
      },
      csv: {
        small: this.resolve_path('assets/icql/chineselexicaldatabase2.1.small.txt'),
        holes: this.resolve_path('assets/icql/ncrglyphwbf-with-holes.csv')
      },
      tsv: {
        micro: this.resolve_path('assets/icql/ncrglyphwbf.tsv'),
        holes: this.resolve_path('assets/icql/ncrglyphwbf-with-holes.tsv')
      },
      db: {
        templates: {
          nnt: this.resolve_path('assets/icql/numbersandtexts.db'),
          micro: this.resolve_path('assets/icql/micro.db'),
          small: this.resolve_path('assets/icql/small-datamill.db'),
          big: this.resolve_path('assets/icql/Chinook_Sqlite_AutoIncrementPKs.db')
        },
        target: {
          small: this.resolve_path('data/dbay/dbay-{ref}-{size}.db'),
          big: this.resolve_path('data/dbay/dbay-{ref}-{size}.db')
        },
        work: {
          mem: ':memory:',
          fle: this.resolve_path('data/dbay/dbay-{ref}-{size}.db')
        },
        temp: {
          small: this.resolve_path('data/dbay/dbay-{ref}-{size}-temp.db'),
          big: this.resolve_path('data/dbay/dbay-{ref}-{size}-temp.db')
        },
        old: {
          small: this.resolve_path('data/dbay/dbay-{ref}-{size}-old.db'),
          big: this.resolve_path('data/dbay/dbay-{ref}-{size}-old.db')
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

  //-----------------------------------------------------------------------------------------------------------
  this.nonexistant_path_from_ref = function(ref) {
    var R;
    R = this.interpolate(this.get_cfg().db.work.fle, {
      ref,
      size: 'any'
    });
    this.try_to_remove_file(R);
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.procure_db = async function(cfg) {
    var template_path, work_path, xcfg;
    cfg = {
      reuse: false,
      ...cfg
    };
    validate.procure_db_cfg(cfg);
    xcfg = this.get_cfg();
    template_path = this.interpolate(xcfg.db.templates[cfg.size], cfg);
    this.ensure_file_exists(template_path);
    // work_path     = @interpolate xcfg.db.work[      cfg.mode ], cfg
    work_path = this.interpolate(xcfg.db.work.fle, cfg);
    if (!(cfg.reuse && this.file_exists(work_path))) {
      help(`^4341^ procuring DB ${work_path}`);
      await this.copy_over(template_path, work_path);
    } else {
      warn(`^4341^ skipping DB file creation (${work_path} already exists)`);
    }
    return {template_path, work_path};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.procure_file = async function(cfg) {
    var name, path, work_path;
    ({path, name} = cfg);
    this.ensure_file_exists(path);
    work_path = this.resolve_path(PATH.join('data/icql', name));
    await this.copy_over(path, work_path);
    return work_path;
  };

}).call(this);

//# sourceMappingURL=helpers.js.map