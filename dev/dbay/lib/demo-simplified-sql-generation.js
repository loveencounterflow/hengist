(function() {
  'use strict';
  var CND, DBay, FS, GUY, H, PATH, SQL, Sql, add_views, badge, debug, echo, equals, freeze, help, info, isa, lets, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  add_views = function(db) {
    db.create_stdlib();
    // -- tl.ncol           as tl_ncol,
    // -- tl.wr             as tl_wr, -- without rowid
    // -- tl.strict         as tl_strict,
    db(SQL`drop view if exists dbay_fields;
create view dbay_fields as select
    tl.schema                                                   as schema,
    tl.name                                                     as table_name,
    tl.type                                                     as table_type,
    ti.cid                                                      as field_nr,
    ti.name                                                     as field_name,
    case ti.type when '' then 'any' else lower( ti.type ) end   as field_type,
    not ti."notnull"                                            as nullable,
    ti.dflt_value                                               as fallback,
    case ti.pk when 0 then null else ti.pk end                  as pk_nr,
    ti.hidden                                                   as hidden
  from pragma_table_list() as tl
  join pragma_table_xinfo( tl.name ) as ti on ( true )
  where true
    and ( tl.name not like 'sqlite_%' )
    and ( tl.name not like 'dbay_%' )
    ;`);
    db(SQL`drop view if exists dbay_foreign_key_statements_1;
create view dbay_foreign_key_statements_1 as select
    fk.id                                                       as fk_id,
    fk.seq                                                      as fk_idx,
    tl.schema                                                   as schema,
    tl.name                                                     as from_table_name,
    fk."from"                                                   as from_field_name,
    fk."table"                                                  as to_table_name,
    fk."to"                                                     as to_field_name
  from pragma_table_list() as tl
  join pragma_foreign_key_list( tl.name ) as fk
  where true
    and ( tl.name not like 'sqlite_%' )
    and ( tl.name not like 'dbay_%' )
  order by schema, from_table_name, fk_id, fk_idx;`);
    db(SQL`drop view if exists dbay_foreign_key_statements_2;
create view dbay_foreign_key_statements_2 as select distinct
    fk_id                                                       as fk_id,
    schema                                                      as schema,
    from_table_name                                             as from_table_name,
    group_concat( std_sql_i( from_field_name ), ', ' ) over w   as from_field_names,
    to_table_name                                               as to_table_name,
    group_concat( std_sql_i(   to_field_name ), ', ' ) over w   as to_field_names
  from dbay_foreign_key_statements_1
  window w as (
    partition by schema, from_table_name, fk_id
    order by fk_idx
    rows between unbounded preceding and unbounded following )
  order by schema, from_table_name, fk_id, fk_idx;`);
    db(SQL`drop view if exists dbay_foreign_key_statements;
create view dbay_foreign_key_statements as select distinct
    schema                                                      as schema,
    from_table_name                                             as from_table_name,
    group_concat(
      'foreign key ( ' || from_field_names || ' ) references '
        || std_sql_i( to_table_name )
        || ' ( ' || to_field_names || ' )',
        ',' || char( 10 ) ) over w                              as fk_clauses
  from dbay_foreign_key_statements_2
  window w as (
    partition by schema, from_table_name
    order by fk_id
    rows between unbounded preceding and unbounded following )
  order by schema, from_table_name, fk_id;`);
    return db;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_two_kinds_of_foreign_keys = function(cfg) {
    var trycatch;
    trycatch = (ref, db, sql) => {
      var error;
      try {
        return db(sql);
      } catch (error1) {
        error = error1;
        return warn(ref, sql, CND.reverse(error.message));
      }
    };
    (() => {
      var db;
      urge('################################');
      db = add_views(new DBay({
        path: '/tmp/fk-demo-1.sqlite'
      }));
      db(SQL`pragma foreign_keys = false;
drop table if exists a;
drop table if exists b;
pragma foreign_keys = true;
create table a (
    nr    integer  not null unique,
    name  text     not null unique,
  primary key ( nr, name ) );
create table b (
    nr    integer  not null,
    name  text     not null,
  foreign key ( nr, name ) references a ( nr, name ) );`);
      trycatch('^578-1^', db, SQL`insert into a ( nr, name ) values ( 1, 'one' );`);
      trycatch('^578-2^', db, SQL`insert into a ( nr, name ) values ( 2, 'two' );`);
      trycatch('^578-3^', db, SQL`insert into b ( nr, name ) values ( 1, 'one' );`);
      trycatch('^578-4^', db, SQL`insert into b ( nr, name ) values ( 2, 'two' );`);
      trycatch('^578-5^', db, SQL`insert into b ( nr, name ) values ( 1, 'two' );`);
      H.tabulate("select * from a;", db(SQL`select * from a;`));
      H.tabulate("select * from b;", db(SQL`select * from b;`));
      // H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
      H.tabulate("dbay_fields", db(SQL`select * from dbay_fields;`));
      // H.tabulate "dbay_foreign_key_statements_1", db SQL"select * from dbay_foreign_key_statements_1;"
      // H.tabulate "dbay_foreign_key_statements_2", db SQL"select * from dbay_foreign_key_statements_2;"
      return H.tabulate("dbay_foreign_key_statements", db(SQL`select * from dbay_foreign_key_statements;`));
    })();
    (() => {
      var db;
      urge('################################');
      db = add_views(new DBay({
        path: '/tmp/fk-demo-2.sqlite'
      }));
      db(SQL`pragma foreign_keys = false;
drop table if exists a;
drop table if exists b;
pragma foreign_keys = true;
create table a (
    nr    integer  not null unique,
    name  text     not null unique,
  primary key ( nr, name ) );
create table b (
    nr    integer  not null,
    name  text     not null,
  foreign key ( nr    ) references a ( nr   ),
  foreign key ( name  ) references a ( name ) );`);
      // db "pragma foreign_keys = false;"
      // H.tabulate "select * from pragma_foreign_key_check();", db SQL"select * from pragma_foreign_key_check();"
      trycatch('^578-7^', db, SQL`insert into a ( nr, name ) values ( 1, 'one' );`);
      trycatch('^578-8^', db, SQL`insert into a ( nr, name ) values ( 2, 'two' );`);
      trycatch('^578-9^', db, SQL`insert into b ( nr, name ) values ( 1, 'one' );`);
      trycatch('^578-10^', db, SQL`insert into b ( nr, name ) values ( 2, 'two' );`);
      trycatch('^578-11^', db, SQL`insert into b ( nr, name ) values ( 1, 'two' );`);
      H.tabulate("select * from a;", db(SQL`select * from a;`));
      H.tabulate("select * from b;", db(SQL`select * from b;`));
      // H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
      H.tabulate("dbay_fields", db(SQL`select * from dbay_fields;`));
      // H.tabulate "dbay_foreign_key_statements_1", db SQL"select * from dbay_foreign_key_statements_1;"
      // H.tabulate "dbay_foreign_key_statements_2", db SQL"select * from dbay_foreign_key_statements_2;"
      return H.tabulate("dbay_foreign_key_statements", db(SQL`select * from dbay_foreign_key_statements;`));
    })();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_simplified_sql_generation = function(cfg) {
    var Mrg, db;
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = add_views(new DBay());
    // mrg             = new Mrg { db, }
    //.........................................................................................................
    db(SQL`create table a (
    nr integer,
    foo float,
    bar float,
    baz float unique,
    this,
    that any,
    stealth integer hidden,
    x421 integer generated always as ( 42 ) virtual,
    x422 integer generated always as ( 42 ) stored,
    x423 integer generated always as ( 42 ) stored,
  primary key ( nr ) );
create unique index athisthat on a ( this, that );
create table b (
    idx integer not null,
    name text unique,
  primary key ( idx, name ),
  -- foreign key ( idx ) references a ( nr ),
  foreign key ( idx, name ) references a ( nr, baz ) );
create table b2 (
    idx integer not null,
    name text unique,
  primary key ( idx, name ),
  foreign key ( idx ) references a ( nr ),
  foreign key ( name ) references a ( baz ) );
create table c (
    x integer primary key references a ( nr ),
    y text references b ( name ),
    z float references a ( baz ) );`);
    //.........................................................................................................
    // H.tabulate 'sqlite_schema', db SQL"select type, name, tbl_name from sqlite_schema;"
    // H.tabulate "pragma_table_list()", db SQL"select * from pragma_table_list();"
    // H.tabulate "pragma_table_info( 'a' )", db SQL"select * from pragma_table_info( 'a' );"
    // H.tabulate "pragma_table_xinfo( 'a' )", db SQL"select * from pragma_table_xinfo( 'a' );"
    // # H.tabulate "pragma_index_list( 'a' )", db SQL"select * from pragma_index_list( 'a' );"
    // H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
    // H.tabulate "pragma_foreign_key_list( 'b2' )", db SQL"select * from pragma_foreign_key_list( 'b2' );"
    // H.tabulate "pragma_foreign_key_list( 'c' )", db SQL"select * from pragma_foreign_key_list( 'c' );"
    // # # H.tabulate "pragma_table_info( 'b' )", db SQL"select * from pragma_table_info( 'b' );"
    // # # H.tabulate "pragma_table_info( 'c' )", db SQL"select * from pragma_table_info( 'c' );"
    // # # H.tabulate "pragma_index_list( 'a' )", db SQL"select * from pragma_index_list( 'a' );"
    // # # H.tabulate "pragma_index_list( 'c' )", db SQL"select * from pragma_index_list( 'c' );"
    // # # H.tabulate "pragma_index_info( 'athisthat' )", db SQL"select * from pragma_index_info( 'athisthat' );"
    H.tabulate("dbay_fields", db(SQL`select * from dbay_fields;`));
    // H.tabulate "dbay_foreign_key_statements_1", db SQL"select * from dbay_foreign_key_statements_1;"
    // H.tabulate "dbay_foreign_key_statements_2", db SQL"select * from dbay_foreign_key_statements_2;"
    H.tabulate("dbay_foreign_key_statements", db(SQL`select * from dbay_foreign_key_statements;`));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      this.demo_two_kinds_of_foreign_keys();
      return this.demo_simplified_sql_generation();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-simplified-sql-generation.js.map