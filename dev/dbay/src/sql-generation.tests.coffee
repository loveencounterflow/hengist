
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/SQL-GENERATION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
r                         = String.raw


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY Sqlgen isa.dbay_create_insert_cfg()" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  probes_and_matchers = [
    [ {}, null, /violates '@isa.dbay_name x.into'/, ]
    [ { into: 'foobar', }, true, ]
    [ { schema: 'blah', into: 'foobar', }, true, ]
    [ { into: 'foobar', fields: [ 'a', 'b', ], }, true, ]
    [ { into: 'foobar', exclude: [ 'a', 'b', ], }, true, ]
    [ { into: 'foobar', exclude: [ 'a', 'b', ], on_conflict: SQL"do nothing", }, true, ]
    [ { into: 'foobar', fields: [ 'a', 'b', ], exclude: [ 'a', 'b', ], }, null, /violates 'either x.fields or x.exclude may be a nonempty list of nonempty_texts'/, ]
    [ { into: 'foobar', fields: [], }, null, /violates 'either x.fields or x.exclude may be a nonempty list of nonempty_texts'/, ]
    [ { into: 'foobar', exclude: [], }, null, /violates 'either x.fields or x.exclude may be a nonempty list of nonempty_texts'/, ]
    [ { into: 'foobar', exclude: 'c', }, null, /violates 'either x.fields or x.exclude may be a nonempty list of nonempty_texts'/, ]
    [ { into: 'foobar', on_conflict: 42, }, null, /violates/, ]
    [ { into: 'foobar', on_conflict: { update: true, }, }, true, ]
    [ { into: 'foobar', on_conflict: { update: [ 'b', ], }, }, null, /violates/, ]
    ]
  #.........................................................................................................
  # debug intersection_of [ 1, 2, 3, ], [ 'a', 3, 1, ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      cfg     = probe
      cfg     = ( cfg = { DBay.C.defaults.dbay_create_insert_cfg..., cfg..., } )
      result  = db.types.validate.dbay_create_insert_cfg cfg
      resolve result
      return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY Sqlgen create_insert() 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  T?.throws /object 'main.cities' does not exist/, => db._get_field_names 'main', 'cities'
  #.........................................................................................................
  db ->
    T?.throws /syntax error/, -> db SQL"create table xy ();"
  #.........................................................................................................
  db ->
    db SQL"""create table xy (
      id      integer primary key,
      next_id integer generated always as ( id + 1 ) );"""
    sql = db.create_insert { into: 'xy', }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."xy" ( "id" ) values ( $id );'
    db SQL"rollback;"
  #.........................................................................................................
  db ->
    db SQL"""
      create table xy (
        a   integer not null primary key,
        b   text not null,
        c   boolean not null );"""
    sql = db.create_insert { into: 'xy', }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."xy" ( "a", "b", "c" ) values ( $a, $b, $c );'
    db SQL"rollback;"
  #.........................................................................................................
  db ->
    # from https://www.sqlite.org/gencol.html
    db SQL"""
      create table t1(
         a integer primary key,
         b integer,
         c text,
         d integer generated always as (a*abs(b)) virtual,
         e text generated always as (substr(c,b,b+1)) stored );"""
    #.......................................................................................................
    sql = db.create_insert { into: 't1', }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."t1" ( "a", "b", "c" ) values ( $a, $b, $c );'
    #.......................................................................................................
    sql = db.create_insert { into: 't1', fields: [ 'b', 'c', ], }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."t1" ( "b", "c" ) values ( $b, $c );'
    #.......................................................................................................
    sql = db.create_insert { into: 't1', exclude: [ 'a', ], }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."t1" ( "b", "c" ) values ( $b, $c );'
    #.......................................................................................................
    sql = db.create_insert { into: 't1', exclude: [ 'a', ], on_conflict: "do nothing", }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."t1" ( "b", "c" ) values ( $b, $c ) on conflict do nothing;'
    #.......................................................................................................
    sql = db.create_insert { into: 't1', exclude: [ 'a', ], on_conflict: { update: true, }, }
    urge '^4498^', rpr sql
    T?.eq sql, 'insert into "main"."t1" ( "b", "c" ) values ( $b, $c ) on conflict do update set "b" = excluded."b", "c" = excluded."c";'
    #.......................................................................................................
    echo dtab._tabulate db SQL"select * from pragma_table_info( 't1' );"
    echo dtab._tabulate db SQL"select * from pragma_table_xinfo( 't1' );"
    db SQL"rollback;"
  #.........................................................................................................
  db ->
    db SQL"""
      create table cities (
        id      integer not null primary key,
        name    text    not null,
        country text    not null )
      """
    sql = db.create_insert { schema, into: 'cities', }
    T?.eq sql, """insert into "main"."cities" ( "id", "name", "country" ) values ( $id, $name, $country );"""
    # echo dtab._tabulate db SQL"select type, name from sqlite_schema;"
    # echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( $name );", { name: 'cities', }
    # debug '^33443^', db._get_fields { schema, name: 'cities', }
    # echo dtab._tabulate ( row for _, row of db._get_fields { schema, name: 'cities', } )
    db SQL"rollback;"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY Sqlgen create_insert() 2" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  db ->
    db SQL"""
      create table xy (
        a   integer not null primary key,
        b   text not null,
        c   boolean not null );"""
    urge '^4498^', db.create_insert { into: 'xy', }
    urge '^4498^', db.create_insert { into: 'xy', fields: [ 'b', 'c', ] }
    urge '^4498^', db.create_insert { into: 'xy', exclude: [ 'a', ], }
    insert_into_xy = db.prepare_insert { into: 'xy', exclude: [ 'a', ], }
    insert_into_xy.run { b: 'one', c: 1, }
    insert_into_xy.run { b: 'two', c: 1, }
    insert_into_xy.run { b: 'three', c: 1, }
    insert_into_xy.run { b: 'four', c: 1, }
    echo dtab._tabulate db SQL"select * from xy order by a;"
    T?.eq ( db.all_rows SQL"select * from xy order by a;" ), [ { a: 1, b: 'one', c: 1 }, { a: 2, b: 'two', c: 1 }, { a: 3, b: 'three', c: 1 }, { a: 4, b: 'four', c: 1 } ]
    db SQL"rollback;"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY Sqlgen create_insert() without known table" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  db ->
    T?.throws /object 'main.xy' does not exist/, => db.create_insert { into: 'xy', }
    T?.throws /object 'main.xy' does not exist/, => db.create_insert { into: 'xy', exclude: [ 'a', ], }
    T?.eq ( db.create_insert { into: 'xy', fields: [ 'b', 'c', ] } ), 'insert into "main"."xy" ( "b", "c" ) values ( $b, $c );'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY Sqlgen on_conflict 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  db SQL"""
    create table xy (
      a   integer not null primary key,
      b   text not null,
      c   integer not null );"""
  #.........................................................................................................
  db ->
    insert_into_xy_sql = db.create_insert { into: 'xy', on_conflict: SQL"do nothing", }
    urge '^4400^', rpr insert_into_xy_sql
    T?.eq insert_into_xy_sql, 'insert into "main"."xy" ( "a", "b", "c" ) values ( $a, $b, $c ) on conflict do nothing;'
    db insert_into_xy_sql, { a: 1, b: 'one', c: 1, }
    db insert_into_xy_sql, { a: 1, b: 'two', c: 2, }
    db insert_into_xy_sql, { a: 1, b: 'three', c: 3, }
    db insert_into_xy_sql, { a: 1, b: 'four', c: 4, }
    echo dtab._tabulate db SQL"select * from xy order by a;"
    T?.eq ( db.all_rows SQL"select * from xy order by a;" ), [ { a: 1, b: 'one', c: 1 } ]
    db SQL"rollback;"
  #.........................................................................................................
  db ->
    insert_into_xy_sql = db.create_insert { into: 'xy', on_conflict: { update: true, }, }
    urge '^4400^', rpr insert_into_xy_sql
    T?.eq insert_into_xy_sql, 'insert into "main"."xy" ( "a", "b", "c" ) values ( $a, $b, $c ) on conflict do update set "a" = excluded."a", "b" = excluded."b", "c" = excluded."c";'
    db insert_into_xy_sql, { a: 1, b: 'one', c: 1, }
    db insert_into_xy_sql, { a: 1, b: 'two', c: 2, }
    db insert_into_xy_sql, { a: 1, b: 'three', c: 3, }
    db insert_into_xy_sql, { a: 1, b: 'four', c: 4, }
    echo dtab._tabulate db SQL"select * from xy order by a;"
    T?.eq ( db.all_rows SQL"select * from xy order by a;" ), [ { a: 1, b: 'four', c: 4 } ]
    db SQL"rollback;"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY Sqlgen create_insert() with returning clause" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  db SQL"""
    create table xy (
      a   integer not null primary key,
      b   text not null,
      c   text generated always as ( '+' || b || '+' ) );"""
  #.........................................................................................................
  db ->
    insert_into_xy_sql = db.create_insert { into: 'xy', on_conflict: SQL"do nothing", returning: '*', }
    urge '^4400^', rpr insert_into_xy_sql
    T?.eq insert_into_xy_sql, 'insert into "main"."xy" ( "a", "b" ) values ( $a, $b ) on conflict do nothing returning *;'
    urge '^4400^', db.single_row insert_into_xy_sql, { a: 1, b: 'any', }
    urge '^4400^', db.single_row insert_into_xy_sql, { a: 2, b: 'duh', }
    urge '^4400^', db.single_row insert_into_xy_sql, { a: 3, b: 'foo', }
    echo dtab._tabulate db SQL"select * from xy;"
    db SQL"rollback;"
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBAY Sqlgen create_insert() without known table" ]
  # @[ "_DBAY Sqlgen demo" ]()
  # test @[ "DBAY Sqlgen create_insert() 2" ]
  # test @[ "DBAY Sqlgen isa.dbay_create_insert_cfg()" ]
  # test @[ "DBAY Sqlgen on_conflict 2" ]
  @[ "DBAY Sqlgen create_insert() with returning clause" ]()






