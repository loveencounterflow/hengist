(function() {
  'use strict';
  var CND, Dba, Dba_plugins, Dba_user, Dbsquares, H, PATH, SQL, badge, debug, echo, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/DEMO/PLUGINS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  ({Dba} = require(H.icql_dba_path));

  //===========================================================================================================
  Dba_plugins = class Dba_plugins {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var dba;
      ({dba} = cfg);
      if (dba == null) {
        throw new Error("must provide `dba: new Dba()` instance");
      }
      this.dba = dba;
      delete cfg.dba;
      return void 0;
    }

  };

  //===========================================================================================================
  Dbsquares = class Dbsquares extends Dba_plugins {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var defaults;
      super(cfg);
      defaults = {
        first: 0,
        last: 10,
        step: 1,
        prefix: 'sq_',
        dba: null
      };
      this.cfg = {...defaults, ...cfg};
      if (typeof this._create_sql_functions === "function") {
        this._create_sql_functions();
      }
      if (typeof this._create_db_structure === "function") {
        this._create_db_structure();
      }
      if (typeof this._compile_sql === "function") {
        this._compile_sql();
      }
      if (typeof this._populate === "function") {
        this._populate();
      }
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _create_db_structure() {
      var prefix;
      ({prefix} = this.cfg);
      this.dba.execute(SQL`create table if not exists ${prefix}squares (
  n     integer not null unique primary key,
  p     integer not null,
  p1    integer generated always as ( ${prefix}square_plus_one( n ) ) virtual not null unique );
create unique index if not exists ${prefix}squares_p1_idx on ${prefix}squares ( p1 );`);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _create_sql_functions() {
      var prefix;
      ({prefix} = this.cfg);
      this.dba.create_function({
        name: prefix + 'square_plus_one',
        call: (n) => {
          return n ** 2 + 1;
        }
      });
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _populate() {
      var i, n, p, prefix, ref, ref1, ref2;
      ({prefix} = this.cfg);
      for (n = i = ref = this.cfg.first, ref1 = this.cfg.last, ref2 = this.cfg.step; ref2 !== 0 && (ref2 > 0 ? i <= ref1 : i >= ref1); n = i += ref2) {
        p = n ** 2;
        this.dba.run(SQL`insert into ${prefix}squares ( n, p ) values ( $n, $p );`, {n, p});
      }
      return null;
    }

  };

  //===========================================================================================================
  Dba_user = class Dba_user {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      this.dba = new Dba({
        ram: true
      });
      this.cfg = {
        prefix: 'usr_'
      };
      this.dbsq = new Dbsquares({
        dba: this.dba,
        prefix: this.cfg.prefix
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    show_squares() {
      var ref, results, row;
      ref = this.dba.query(SQL`select * from ${this.cfg.prefix}squares order by n;`);
      results = [];
      for (row of ref) {
        results.push(info('^887^', row));
      }
      return results;
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var dbu;
      dbu = new Dba_user();
      return dbu.show_squares();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-plugins.js.map