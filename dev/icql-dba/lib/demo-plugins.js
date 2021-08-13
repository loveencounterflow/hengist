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
    populate_db() {
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
      this.dbsq1 = new Dbsquares({
        dba: this.dba,
        prefix: this.cfg.prefix + 'sq1_',
        first: 10,
        last: 15
      });
      this.dbsq2 = new Dbsquares({
        dba: this.dba,
        prefix: this.cfg.prefix + 'sq2_',
        first: 20,
        last: 25
      });
      this.dbsq1.populate_db();
      this.dbsq2.populate_db();
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    list_relations() {
      var ref, row;
      ref = this.dba.query(SQL`select
  name,
  type
from sqlite_schema
where type in ( 'table', 'view' )
order by name;`);
      for (row of ref) {
        urge('^556^', row);
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    show_squares() {
      var ref, ref1, row;
      ref = this.dba.query(SQL`select * from ${this.cfg.prefix}sq1_squares order by n;`);
      for (row of ref) {
        info('^887^', row);
      }
      whisper('--------------------');
      ref1 = this.dba.query(SQL`select * from ${this.cfg.prefix}sq2_squares order by n;`);
      for (row of ref1) {
        info('^887^', row);
      }
      return null;
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var dbu;
      dbu = new Dba_user();
      dbu.show_squares();
      return dbu.list_relations();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-plugins.js.map