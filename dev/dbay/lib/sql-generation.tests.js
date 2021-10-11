(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, get_Sqlgen, help, info, isa, r, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/SQL-GENERATION';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  r = String.raw;

  get_Sqlgen = function() {
    var DBay, Sqlgen;
    ({DBay} = require(H.dbay_path));
    types = require(PATH.join(H.dbay_path, 'lib/types'));
    //-----------------------------------------------------------------------------------------------------------
    types.declare('dbay_create_insert_cfg', {
      tests: {
        "@isa.object x": function(x) {
          return this.isa.object(x);
        },
        "@isa.dbay_usr_schema x.schema": function(x) {
          return this.isa.dbay_usr_schema(x.schema);
        },
        "@isa.dbay_name x.name": function(x) {
          return this.isa.dbay_name(x.name);
        },
        "?@isa_list_of.nonempty_text x.exclude": function(x) {
          if (x.exclude == null) {
            true;
          }
          return this.isa_list_of.nonempty_text(x.exclude);
        },
        "?@isa_list_of.nonempty_text x.include": function(x) {
          if (x.include == null) {
            true;
          }
          return this.isa_list_of.nonempty_text(x.include);
        },
        "x.exclude, x.include may not appear together": function(x) {
          return (x.exclude == null) || (x.include == null);
        },
        "x.on_conflict in [ 'nothing', 'sql', ]": function(x) {
          var ref;
          return (ref = x.on_conflict) === 'nothing' || ref === 'sql';
        },
        "@isa_list_of.nonempty_text x.fields": function(x) {
          return this.isa_list_of.nonempty_text(x.fields);
        }
      }
    });
    // #-----------------------------------------------------------------------------------------------------------
    // types.declare 'dbay_fields_of_cfg', tests:
    //   "@isa.object x":                          ( x ) -> @isa.object x
    //   # "@isa.ic_schema x.schema":                ( x ) -> @isa.ic_schema x.schema
    //   # "@isa.nonempty_text x.name":              ( x ) -> @isa_optional.ic_name x.name

      //===========================================================================================================
    Sqlgen = class Sqlgen extends DBay {
      //---------------------------------------------------------------------------------------------------------
      // C

        //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        super(cfg);
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      prepare_insert(cfg) {
        return this.prepare(this.create_insert(cfg));
      }

      create_insert(cfg) {
        var I, L, R, V;
        this.types.validate.dbay_create_insert_cfg((cfg = {...this.constructor.C.defaults.dbay_create_insert_cfg, ...cfg}));
        ({L, I, V} = this.sql);
        R = [];
        R.push(`insert into ${I(cfg.schema)}.${I(cfg.table)}`);
        return R.join(' ');
      }

      //---------------------------------------------------------------------------------------------------------
      _get_fields(schema, name) {
        var R, d, ref, schema_i, type;
        // @types.validate.dbay_fields_of_cfg ( cfg = { @constructor.C.defaults.dbay_fields_of_cfg..., cfg..., } )
        ({name, schema} = cfg);
        schema_i = this.sql.I(schema);
        R = {};
        ref = this.query(SQL`select * from ${schema_i}.pragma_table_info( $name );`, {name});
        for (d of ref) {
          // { cid: 0, name: 'id', type: 'integer', notnull: 1, dflt_value: null, pk: 1 }
          type = d.type === '' ? null : d.type;
          R[d.name] = {
            idx: d.cid,
            type: type,
            name: d.name,
            optional: !d.notnull,
            default: d.dflt_value,
            is_pk: !!d.pk
          };
        }
        return R;
      }

    };
    return Sqlgen;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["_DBAY Sqlgen demo"] = function(T, done) {
    var Sqlgen, Tbl, db, dtab, schema;
    // T?.halt_on_error()
    // { DBay }          = require H.dbay_path
    // db                = new DBay()
    Sqlgen = get_Sqlgen();
    db = new Sqlgen();
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({
      dba: db
    });
    schema = 'main';
    //.........................................................................................................
    db(function() {
      var _, row;
      db(SQL`create table cities (
  id      integer not null primary key,
  name    text    not null,
  country text    not null )`);
      debug('^334^', db.create_insert({
        schema,
        table: 'cities'
      }));
      echo(dtab._tabulate(db(SQL`select type, name from sqlite_schema;`)));
      echo(dtab._tabulate(db(SQL`select * from ${schema}.pragma_table_info( $name );`, {
        name: 'cities'
      })));
      debug('^33443^', db._get_fields({
        schema,
        name: 'cities'
      }));
      return echo(dtab._tabulate((function() {
        var ref, results;
        ref = db._get_fields({
          schema,
          name: 'cities'
        });
        results = [];
        for (_ in ref) {
          row = ref[_];
          results.push(row);
        }
        return results;
      })()));
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      return this["_DBAY Sqlgen demo"]();
    })();
  }

}).call(this);

//# sourceMappingURL=sql-generation.tests.js.map