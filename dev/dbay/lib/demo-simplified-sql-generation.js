(function() {
  'use strict';
  var CND, DBay, DBay2, FS, GUY, H, PATH, SQL, Sql, Sql2, badge, debug, echo, equals, freeze, help, info, isa, lets, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE/DEMO';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  GUY = require('../../../apps/guy');

  // { HDML }                  = require '../../../apps/hdml'
  H = require('../../../lib/helpers');

  ({lets, freeze} = GUY.lft);

  ({to_width} = require('to-width'));

  ({DBay} = require('../../../apps/dbay'));

  ({Sql} = require('../../../apps/dbay/lib/sql'));

  Sql2 = class Sql2 extends Sql {};

  DBay2 = class DBay2 extends DBay {
    //---------------------------------------------------------------------------------------------------------
    constructor(...P) {
      super(...P);
      this.sql = new Sql2();
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    get_primary_keys(cfg) {
      var R, i, len, row, schema;
      ({schema} = this.cfg);
      R = this.all_rows(SQL`select 
    -- pk                          as nr,
    $table                      as "table",
    name                        as field, 
    lower( type )               as type,
    not "notnull"               as nullable
  from ${schema}.pragma_table_info( $table )
  where true 
    and ( pk > 0 )
  order by pk;`, cfg);
      for (i = 0, len = R.length; i < len; i++) {
        row = R[i];
        row.nullable = !!row.nullable;
      }
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    get_foreign_keys(cfg) {
      var R, schema;
      ({schema} = this.cfg);
      R = this.all_rows(SQL`select 
    $table                      as from_table,
    "from"                      as from_field,
    "table"                     as to_table,
    coalesce( "to", "from" )    as to_field
  from ${schema}.pragma_foreign_key_list( $table )
  order by seq;`, cfg);
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    _get_foreign_key_by_from_fields(cfg) {
      var R, ref, row, schema;
      ({schema} = this.cfg);
      R = {};
      ref = this.query(SQL`select 
    "from"                      as from_field,
    "table"                     as to_table,
    coalesce( "to", "from" )    as to_field
  from ${schema}.pragma_foreign_key_list( $table );`, cfg);
      for (row of ref) {
        R[row.from_field] = {
          table: row.to_table,
          field: row.to_field
        };
      }
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    _get_primary_key_clause(cfg) {
      var I, pk, pk_names, pks;
      ({I} = this.sql);
      pks = this.get_primary_keys(cfg);
      pk_names = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = pks.length; i < len; i++) {
          pk = pks[i];
          results.push(I(pk.field));
        }
        return results;
      })()).join(', ');
      return SQL`primary key ( ${pk_names} )`;
    }

    //---------------------------------------------------------------------------------------------------------
    _get_foreign_key_clauses(cfg) {
      var I, R, field, from_field, ref, table;
      ({I} = this.sql);
      R = {};
      ref = this._get_foreign_key_by_from_fields(cfg);
      for (from_field in ref) {
        ({table, field} = ref[from_field]);
        R[from_field] = `references ${I(table)} ( ${I(field)} )`;
      }
      return R;
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_simplified_sql_generation = function(cfg) {
    var Mrg, db, mrg;
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay2();
    mrg = new Mrg({db});
    //.........................................................................................................
    db(SQL`create table a ( 
    foo float,
    bar float,
    baz float unique,
    nr integer,
  primary key ( nr ) );
create table b ( 
    idx integer not null, 
    name text unique, 
  primary key ( idx ), 
  foreign key ( idx ) references a ( nr ) );
create table c (
    x integer primary key references a ( nr ),
    y text references b ( name ), 
    z float references a ( baz ) );`);
    //.........................................................................................................
    // H.tabulate 'sqlite_schema', db SQL"select * from sqlite_schema;"
    H.tabulate("pragma_table_list()", db(SQL`select * from pragma_table_list();`));
    H.tabulate("pragma_table_info( 'mrg_mirror' )", db(SQL`select * from pragma_table_info( 'mrg_mirror' );`));
    H.tabulate("pragma_foreign_key_list( 'mrg_mirror' )", db(SQL`select * from pragma_foreign_key_list( 'mrg_mirror' );`));
    H.tabulate("pragma_table_info( 'mrg_raw_mirror' )", db(SQL`select * from pragma_table_info( 'mrg_raw_mirror' );`));
    H.tabulate("pragma_foreign_key_list( 'mrg_raw_mirror' )", db(SQL`select * from pragma_foreign_key_list( 'mrg_raw_mirror' );`));
    H.tabulate("db.get_primary_keys { table: 'mrg_raw_mirror', }", db.get_primary_keys({
      table: 'mrg_raw_mirror'
    }));
    H.tabulate("pragma_table_info( 'a' )", db(SQL`select * from pragma_table_info( 'a' );`));
    H.tabulate("pragma_foreign_key_list( 'a' )", db(SQL`select * from pragma_foreign_key_list( 'a' );`));
    H.tabulate("pragma_table_info( 'b' )", db(SQL`select * from pragma_table_info( 'b' );`));
    H.tabulate("pragma_foreign_key_list( 'b' )", db(SQL`select * from pragma_foreign_key_list( 'b' );`));
    H.tabulate("db.get_primary_keys { table: 'b', }", db.get_primary_keys({
      table: 'b'
    }));
    H.tabulate("db.get_foreign_keys { table: 'b', }", db.get_foreign_keys({
      table: 'b'
    }));
    H.tabulate("db.get_foreign_keys { table: 'mrg_raw_mirror', }", db.get_foreign_keys({
      table: 'mrg_raw_mirror'
    }));
    urge('^546^', db._get_primary_key_clause({
      table: 'mrg_raw_mirror'
    }));
    urge('^546^', db._get_foreign_key_clauses({
      table: 'mrg_raw_mirror'
    }));
    urge('^546^', db._get_primary_key_clause({
      table: 'a'
    }));
    urge('^546^', db._get_primary_key_clause({
      table: 'b'
    }));
    urge('^546^', db._get_foreign_key_clauses({
      table: 'b'
    }));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_simplified_sql_generation();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-simplified-sql-generation.js.map