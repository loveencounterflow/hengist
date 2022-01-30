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
    var schema;
    db.create_stdlib();
    schema = 'main';
    // -- tl.ncol           as tl_ncol,
    // -- tl.wr             as tl_wr, -- without rowid
    // -- tl.strict         as tl_strict,
    db(SQL`-- ### NOTE this is a best-effort approach to recover the correct ordering for DDL statements
-- from the data provided by SQLite. It is not quite clear whether the ordering in
-- \`sqlite_schema\` can be relied upon and whether it is safe to assume that adding \`row_number()\`
-- to the query will not accidentally change the ordering in absence of an \`order by\` clause.
-- To attain a modicum of reliability the filtering has been separated from the raw numbering
-- to keep that aspect from juggling around rows.
drop view if exists ${schema}.dbay_relation_nrs;
create view ${schema}.dbay_relation_nrs as with v1 as ( select
    row_number() over ()                                        as table_nr,
    type                                                        as type,
    name                                                        as table_name
  from ${schema}.sqlite_schema )
select
    row_number() over ()                                        as table_nr,
    type                                                        as type,
    ${db.sql.L(schema)}                                          as schema,
    table_name                                                  as table_name
  from v1
  where true
    and ( type in ( 'table', 'view' ) )
    and ( table_name not like 'sqlite_%' )
    and ( table_name not like 'dbay_%' )
  order by table_nr;`);
    db(SQL`drop view if exists ${schema}.dbay_unique_fields;
create view ${schema}.dbay_unique_fields as select
    tl.schema                                                   as schema,
    tl.name                                                     as table_name,
    ii.name                                                     as field_name,
    il.seq                                                      as index_idx,
    il.name                                                     as index_name
  from ${schema}.pragma_table_list() as tl
  join ${schema}.pragma_index_list( tl.name ) as il on ( true )
  join ${schema}.pragma_index_info( il.name ) as ii on ( true )
  where true
    and ( il.origin = 'u' )
    and ( il."unique" )
  ;`);
    db(SQL`drop view if exists ${schema}.dbay_fields_1;
create view ${schema}.dbay_fields_1 as select
    tl.schema                                                   as schema,
    rn.table_nr                                                 as table_nr,
    ti.cid                                                      as field_nr,
    tl.name                                                     as table_name,
    tl.type                                                     as table_type,
    ti.name                                                     as field_name,
    case ti.type when '' then 'any' else lower( ti.type ) end   as field_type,
    not ti."notnull"                                            as nullable,
    ti.dflt_value                                               as fallback,
    case ti.pk when 0 then null else ti.pk end                  as pk_nr,
    ti.hidden                                                   as hidden
  from ${schema}.pragma_table_list() as tl
  join ${schema}.pragma_table_xinfo( tl.name ) as ti on ( true )
  join ${schema}.dbay_relation_nrs as rn on ( tl.schema = rn.schema and tl.name = rn.table_name )
  where true
    and ( tl.name not like 'sqlite_%' )
    and ( tl.name not like 'dbay_%' )
  order by schema, table_nr, field_nr;`);
    db(SQL`drop view if exists ${schema}.dbay_fields;
create view ${schema}.dbay_fields as select
    fd.*,
    case when uf.field_name is null then 0 else 1 end           as is_unique
  from ${schema}.dbay_fields_1 as fd
  left join ${schema}.dbay_unique_fields as uf using ( schema, table_name, field_name )
  order by schema, table_nr, field_nr;`);
    db(SQL`drop view if exists ${schema}.dbay_foreign_key_clauses_1;
create view ${schema}.dbay_foreign_key_clauses_1 as select
    fk.id                                                       as fk_id,
    fk.seq                                                      as fk_idx,
    tl.schema                                                   as schema,
    tl.name                                                     as from_table_name,
    fk."from"                                                   as from_field_name,
    fk."table"                                                  as to_table_name,
    fk."to"                                                     as to_field_name
  from ${schema}.pragma_table_list() as tl
  join ${schema}.pragma_foreign_key_list( tl.name ) as fk
  where true
    and ( tl.name not like 'sqlite_%' )
    and ( tl.name not like 'dbay_%' )
  order by schema, from_table_name, fk_id, fk_idx;`);
    db(SQL`drop view if exists ${schema}.dbay_foreign_key_clauses_2;
create view ${schema}.dbay_foreign_key_clauses_2 as select distinct
    fk_id                                                       as fk_id,
    schema                                                      as schema,
    from_table_name                                             as from_table_name,
    group_concat( std_sql_i( from_field_name ), ', ' ) over w   as from_field_names,
    to_table_name                                               as to_table_name,
    group_concat( std_sql_i(   to_field_name ), ', ' ) over w   as to_field_names
  from ${schema}.dbay_foreign_key_clauses_1
  window w as (
    partition by schema, from_table_name, fk_id
    order by fk_idx
    rows between unbounded preceding and unbounded following )
  order by schema, from_table_name, fk_id, fk_idx;`);
    db(SQL`drop view if exists ${schema}.dbay_foreign_key_clauses;
create view ${schema}.dbay_foreign_key_clauses as select distinct
    schema                                                      as schema,
    from_table_name                                             as table_name,
    group_concat(
      'foreign key ( ' || from_field_names || ' ) references '
        || std_sql_i( to_table_name )
        || ' ( ' || to_field_names || ' )',
        ',' || char( 10 ) ) over w                              as fk_clauses
  from ${schema}.dbay_foreign_key_clauses_2
  window w as (
    partition by schema, from_table_name
    order by fk_id desc
    rows between unbounded preceding and unbounded following )
  order by schema, from_table_name, fk_id;`);
    db(SQL`drop view if exists ${schema}.dbay_primary_key_clauses_1;
create view ${schema}.dbay_primary_key_clauses_1 as select distinct
    schema                                                      as schema,
    table_name                                                  as table_name,
    group_concat( std_sql_i( field_name ), ', ' ) over w        as field_names
  from ${schema}.dbay_fields
  where pk_nr is not null
  window w as (
    partition by schema, table_name
    order by pk_nr
    rows between unbounded preceding and unbounded following )
  order by schema, table_name;`);
    db(SQL`drop view if exists ${schema}.dbay_primary_key_clauses;
create view ${schema}.dbay_primary_key_clauses as select distinct
    schema                                                      as schema,
    table_name                                                  as table_name,
    group_concat(
      'primary key ( ' || field_names || ' )' ) over w          as pk_clause
  from ${schema}.dbay_primary_key_clauses_1
  window w as (
    partition by schema, table_name
    rows between unbounded preceding and unbounded following )
  order by schema, table_name
;`);
    db(SQL`drop view if exists ${schema}.dbay_field_clauses_1;
create view ${schema}.dbay_field_clauses_1 as select
    schema                                                          as schema,
    table_nr                                                        as table_nr,
    field_nr                                                        as field_nr,
    table_name                                                      as table_name,
    field_name                                                      as field_name,
    std_sql_i( field_name ) || ' ' || field_type                    as fc_name_type,
    case when not nullable         then ' not null'             else '' end  as fc_null,
    case when is_unique            then ' unique'               else '' end  as fc_unique,
    case when fallback is not null then ' default ' || fallback else '' end  as fc_default
  from ${schema}.dbay_fields
  order by schema, table_nr, field_nr;`);
    db(SQL`drop view if exists ${schema}.dbay_field_clauses;
create view ${schema}.dbay_field_clauses as select
    schema                                                          as schema,
    table_nr                                                        as table_nr,
    field_nr                                                        as field_nr,
    table_name                                                      as table_name,
    field_name                                                      as field_name,
    fc_name_type || fc_null || fc_unique || fc_default              as field_clause
  from ${schema}.dbay_field_clauses_1
  order by schema, table_nr, field_nr;`);
    db(SQL`drop view if exists ${schema}.dbay_create_table_clauses;
create view ${schema}.dbay_create_table_clauses as select
    table_nr                                                          as table_nr,
    schema                                                            as schema,
    table_name                                                        as table_name,
    'create table ' || std_sql_i( table_name ) || ' (' || char( 10 )  as ctc_start,
    ' );'                                                             as ctc_end
  from ${schema}.dbay_relation_nrs;`);
    // db SQL"""
    //   drop view if exists #{schema}.dbay_create_table_statements;
    //   create view #{schema}.dbay_create_table_statements as select
    //       rn.nr                                                           as nr,
    //       rn.schema                                                       as schema,
    //       rn.table_name                                                   as table_name,
    //     from #{schema}.dbay_relation_nrs as rn
    //     join #{schema}.dbay_field_clauses as fc
    //   ;"""
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
    xnr   integer  not null unique,
    name  text     not null unique,
  primary key ( xnr, name ) );
create table b (
    xnr    integer  not null,
    name  text     not null,
  foreign key ( xnr, name ) references a ( xnr, name ) );`);
      trycatch('^578-1^', db, SQL`insert into a ( xnr, name ) values ( 1, 'one' );`);
      trycatch('^578-2^', db, SQL`insert into a ( xnr, name ) values ( 2, 'two' );`);
      trycatch('^578-3^', db, SQL`insert into b ( xnr, name ) values ( 1, 'one' );`);
      trycatch('^578-4^', db, SQL`insert into b ( xnr, name ) values ( 2, 'two' );`);
      trycatch('^578-5^', db, SQL`insert into b ( xnr, name ) values ( 1, 'two' );`);
      H.tabulate("select * from a;", db(SQL`select * from a;`));
      H.tabulate("select * from b;", db(SQL`select * from b;`));
      // H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
      H.tabulate("dbay_fields", db(SQL`select * from dbay_fields;`));
      // H.tabulate "dbay_foreign_key_clauses_1", db SQL"select * from dbay_foreign_key_clauses_1;"
      // H.tabulate "dbay_foreign_key_clauses_2", db SQL"select * from dbay_foreign_key_clauses_2;"
      H.tabulate("dbay_foreign_key_clauses", db(SQL`select * from dbay_foreign_key_clauses;`));
      H.tabulate("dbay_primary_key_clauses", db(SQL`select * from dbay_primary_key_clauses;`));
      // H.tabulate "dbay_field_clauses_1", db SQL"select * from dbay_field_clauses_1;"
      H.tabulate("dbay_unique_fields", db(SQL`select * from dbay_unique_fields;`));
      return H.tabulate("dbay_field_clauses", db(SQL`select * from dbay_field_clauses;`));
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
    xnr   integer  not null unique,
    name  text     not null unique,
  primary key ( xnr, name ) );
create table b (
    xnr   integer  not null,
    name  text     not null,
  foreign key ( xnr    ) references a ( xnr   ),
  foreign key ( name  ) references a ( name ) );`);
      // db "pragma foreign_keys = false;"
      // H.tabulate "select * from pragma_foreign_key_check();", db SQL"select * from pragma_foreign_key_check();"
      trycatch('^578-7^', db, SQL`insert into a ( xnr, name ) values ( 1, 'one' );`);
      trycatch('^578-8^', db, SQL`insert into a ( xnr, name ) values ( 2, 'two' );`);
      trycatch('^578-9^', db, SQL`insert into b ( xnr, name ) values ( 1, 'one' );`);
      trycatch('^578-10^', db, SQL`insert into b ( xnr, name ) values ( 2, 'two' );`);
      trycatch('^578-11^', db, SQL`insert into b ( xnr, name ) values ( 1, 'two' );`);
      H.tabulate("select * from a;", db(SQL`select * from a;`));
      H.tabulate("select * from b;", db(SQL`select * from b;`));
      // H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
      H.tabulate("dbay_fields", db(SQL`select * from dbay_fields;`));
      // H.tabulate "dbay_foreign_key_clauses_1", db SQL"select * from dbay_foreign_key_clauses_1;"
      // H.tabulate "dbay_foreign_key_clauses_2", db SQL"select * from dbay_foreign_key_clauses_2;"
      H.tabulate("dbay_foreign_key_clauses", db(SQL`select * from dbay_foreign_key_clauses;`));
      H.tabulate("dbay_primary_key_clauses", db(SQL`select * from dbay_primary_key_clauses;`));
      // H.tabulate "dbay_field_clauses_1", db SQL"select * from dbay_field_clauses_1;"
      H.tabulate("dbay_unique_fields", db(SQL`select * from dbay_unique_fields;`));
      return H.tabulate("dbay_field_clauses", db(SQL`select * from dbay_field_clauses;`));
    })();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_simplified_sql_generation = function(cfg) {
    var Mrg, db;
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = add_views(new DBay({
      path: '/tmp/foobar.sqlite'
    }));
    // mrg             = new Mrg { db, }
    urge('################################');
    //.........................................................................................................
    db(SQL`pragma foreign_keys = false;
drop table if exists a;
drop table if exists b;
drop table if exists c;
drop table if exists b2;
drop view if exists ab;
pragma foreign_keys = true;
create table a (
    xnr integer,
    foo float,
    bar float default 42,
    baz float unique,
    this,
    that any,
    stealth integer hidden,
    x421 integer generated always as ( 42 ) virtual,
    x422 integer generated always as ( 42 ) stored,
    x423 integer generated always as ( 42 ) stored,
  primary key ( xnr ) );
create unique index athisthat on a ( this, that );
create table b (
    idx integer not null,
    name text unique,
  primary key ( idx, name ),
  -- foreign key ( idx ) references a ( xnr ),
  foreign key ( idx, name ) references a ( xnr, baz ) );
create table b2 (
    idx integer not null,
    name text unique,
  primary key ( idx, name ),
  foreign key ( idx ) references a ( xnr ),
  foreign key ( name ) references a ( baz ) );
create table c (
    x integer primary key references a ( xnr ),
    y text default 'whatever' references b ( name ),
    z float references a ( baz ) );
create view ab as select
    3 * 4 as twelve,
    x421,
    xnr
  from a
  order by x421;`);
    //.........................................................................................................
    // H.tabulate 'sqlite_schema', db SQL"select type, name, tbl_name from sqlite_schema;"
    // H.tabulate "pragma_table_info( 'a' )", db SQL"select * from pragma_table_info( 'a' );"
    // # H.tabulate "pragma_index_list( 'a' )", db SQL"select * from pragma_index_list( 'a' );"
    // H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
    // H.tabulate "pragma_foreign_key_list( 'c' )", db SQL"select * from pragma_foreign_key_list( 'c' );"
    // H.tabulate "pragma_table_info( 'b' )", db SQL"select * from pragma_table_info( 'b' );"
    // H.tabulate "pragma_table_info( 'c' )", db SQL"select * from pragma_table_info( 'c' );"
    // H.tabulate "pragma_index_list( 'a' )", db SQL"select * from pragma_index_list( 'a' );"
    // H.tabulate "pragma_index_list( 'c' )", db SQL"select * from pragma_index_list( 'c' );"
    // H.tabulate "pragma_index_info( 'athisthat' )", db SQL"select * from pragma_index_info( 'athisthat' );"
    // H.tabulate "dbay_foreign_key_clauses_1", db SQL"select * from dbay_foreign_key_clauses_1;"
    // H.tabulate "dbay_foreign_key_clauses_2", db SQL"select * from dbay_foreign_key_clauses_2;"
    // H.tabulate "pragma_index_list( 'b2' )", db SQL"select * from pragma_index_list( 'b2' );"
    // H.tabulate "pragma_index_info( 'sqlite_autoindex_b2_2' )", db SQL"select * from pragma_index_info( 'sqlite_autoindex_b2_2' );"
    // H.tabulate "pragma_index_xinfo( 'sqlite_autoindex_b2_2' )", db SQL"select * from pragma_index_xinfo( 'sqlite_autoindex_b2_2' );"
    // H.tabulate "dbay_unique_fields", db SQL"select * from dbay_unique_fields;"
    // H.tabulate "dbay_fields", db SQL"select * from dbay_fields;"
    // H.tabulate "pragma_table_list()", db SQL"select * from pragma_table_list();"
    // H.tabulate "pragma_table_xinfo( 'a' )", db SQL"select * from pragma_table_xinfo( 'a' );"
    H.tabulate("select * from dbay_relation_nrs;", db(SQL`select * from dbay_relation_nrs;`));
    H.tabulate("dbay_field_clauses", db(SQL`select * from dbay_field_clauses;`));
    H.tabulate("dbay_foreign_key_clauses", db(SQL`select * from dbay_foreign_key_clauses;`));
    H.tabulate("dbay_primary_key_clauses", db(SQL`select * from dbay_primary_key_clauses;`));
    H.tabulate("dbay_create_table_clauses", db(SQL`select * from dbay_create_table_clauses;`));
    H.tabulate("dbay_create_table_statements", db(SQL`select * from dbay_create_table_statements;`));
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