
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DBAY/sqlx'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
# X                         = require '../../../lib/helpers'
r                         = String.raw
new_xregex                = require 'xregexp'
E                         = require '../../../apps/dbay/lib/errors'
equals                    = ( require 'util' ).isDeepStrictEqual
{ Tbl, }                  = require '../../../apps/icql-dba-tabulate'
dtab                      = new Tbl { dba: null, }
sql_lexer                 = require '../../../apps/dbay-sql-lexer'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@dbay_virtual_concurrent_writes = ( T, done ) ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  #.........................................................................................................
  my_path = '/tmp/helo.db'
  db      = new DBay { path: my_path, }
  debug '^23-1^'
  db ->
    if ( db.all_rows SQL"select name from sqlite_schema where name = 'numbers';" ).length is 0
      db SQL"""create table numbers (
        n   integer not null primary key,
        sqr integer );"""
    #.......................................................................................................
    insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
    db insert_number, { n, sqr: null, } for n in [ 0 .. 10 ]
  #.........................................................................................................
  select_numbers  = db.prepare SQL"select * from numbers order by n;"
  insert_number   = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  T?.eq ( db.all_rows select_numbers ), [ { n: 0, sqr: null }, { n: 1, sqr: null }, { n: 2, sqr: null }, { n: 3, sqr: null }, { n: 4, sqr: null }, { n: 5, sqr: null }, { n: 6, sqr: null }, { n: 7, sqr: null }, { n: 8, sqr: null }, { n: 9, sqr: null }, { n: 10, sqr: null } ]
  #.........................................................................................................
  db.with_deferred_write ( write ) ->
    for d from db select_numbers
      write insert_number, { n: d.n, sqr: d.n ** 2, }
  #.........................................................................................................
  result = db.all_rows select_numbers
  T?.eq result, [ { n: 0, sqr: 0 }, { n: 1, sqr: 1 }, { n: 2, sqr: 4 }, { n: 3, sqr: 9 }, { n: 4, sqr: 16 }, { n: 5, sqr: 25 }, { n: 6, sqr: 36 }, { n: 7, sqr: 49 }, { n: 8, sqr: 64 }, { n: 9, sqr: 81 }, { n: 10, sqr: 100 } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_concurrency_with_explicitly_two_connections = ( T, done ) ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  dbr                 = new DBay()
  dbw                 = new DBay { path: dbr.cfg.path, }
  T?.eq dbr.get_journal_mode(), 'wal'
  T?.eq dbw.get_journal_mode(), 'wal'
  #.........................................................................................................
  dbr SQL"""create table numbers (
    n   integer not null primary key,
    sqr integer );"""
  insert_number = dbw.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  #.........................................................................................................
  dbr ->
    for n in [ 0 .. 4 ]
      dbr insert_number, { n, sqr: null, }
  #.........................................................................................................
  do ->
    result = dbr.all_rows SQL"""select * from numbers order by n;"""
    T?.eq result, [ { n: 0, sqr: null }, { n: 1, sqr: null }, { n: 2, sqr: null }, { n: 3, sqr: null }, { n: 4, sqr: null } ]
  #.........................................................................................................
  # dbr.with_transaction ->
  for d from dbr SQL"select * from numbers order by n;"
    d.sqr = d.n ** 2
    dbw insert_number, d
    d.n = d.n + 100
    d.sqr = d.n ** 2
    dbw insert_number, d
  #.........................................................................................................
  do ->
    result = dbr.all_rows SQL"""select * from numbers order by n;"""
    T?.eq result, [ { n: 0, sqr: 0 }, { n: 1, sqr: 1 }, { n: 2, sqr: 4 }, { n: 3, sqr: 9 }, { n: 4, sqr: 16 }, { n: 100, sqr: 10000 }, { n: 101, sqr: 10201 }, { n: 102, sqr: 10404 }, { n: 103, sqr: 10609 }, { n: 104, sqr: 10816 } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_concurrency_with_implicitly_two_connections = ( T, done ) ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  db                  = new DBay()
  T?.eq db.get_journal_mode(), 'wal'
  T?.eq db.get_journal_mode(), 'wal'
  #.........................................................................................................
  db SQL"""create table numbers (
    n   integer not null primary key,
    sqr integer );"""
  insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  #.........................................................................................................
  db ->
    for n in [ 0 .. 4 ]
      db insert_number, { n, sqr: null, }
  #.........................................................................................................
  do ->
    result = db.all_rows SQL"""select * from numbers order by n;"""
    T?.eq result, [ { n: 0, sqr: null }, { n: 1, sqr: null }, { n: 2, sqr: null }, { n: 3, sqr: null }, { n: 4, sqr: null } ]
  #.........................................................................................................
  # db.with_transaction ->
  for d from db SQL"select * from numbers order by n;"
    d.sqr = d.n ** 2
    db insert_number, d
    d.n = d.n + 100
    d.sqr = d.n ** 2
    db insert_number, d
  #.........................................................................................................
  do ->
    result = db.all_rows SQL"""select * from numbers order by n;"""
    T?.eq result, [ { n: 0, sqr: 0 }, { n: 1, sqr: 1 }, { n: 2, sqr: 4 }, { n: 3, sqr: 9 }, { n: 4, sqr: 16 }, { n: 100, sqr: 10000 }, { n: 101, sqr: 10201 }, { n: 102, sqr: 10404 }, { n: 103, sqr: 10609 }, { n: 104, sqr: 10816 } ]
  #.........................................................................................................
  done?()


#-----------------------------------------------------------------------------------------------------------
@dbay_concurrency_with_table_function = ( T, done ) ->
  # T.halt_on_error()
  { DBay }          = require H.dbay_path
  { SQL }           = DBay
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fn', }
  debug { template_path, work_path, }
  db                = new DBay { path: work_path, schema, }
  numbers           = db.all_first_values SQL"select n from nnt order by n;"
  console.table db.all_rows SQL"select * from nnt order by n;"
  #.........................................................................................................
  db.create_table_function
    name:         're_matches'
    columns:      [ 'match', 'capture', ]
    parameters:   [ 'text', 'pattern', ]
    rows: ( text, pattern ) ->
      regex = new RegExp pattern, 'g'
      while ( match = regex.exec text )?
        yield [ match[ 0 ], match[ 1 ], ]
      return null
  #.........................................................................................................
  do =>
    insert_number   = db.prepare_insert { into: 'nnt', }
    select_numbers  = SQL"""select n from nnt order by n;"""
    select_rows     = SQL"""
      select
          *
        from
          nnt,
          re_matches( t, '^.*(point).*$' ) as rx
        order by rx.match;"""
    #.......................................................................................................
    console.table db.all_rows select_rows
    T?.eq ( db.all_first_values select_numbers ), [ 0, 1, 1.5, 2, 2.3, 3, 3.1, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    #.......................................................................................................
    for d from db select_rows
      db insert_number, { d..., n: d.n + 100, }
    #.......................................................................................................
    console.table db.all_rows select_rows
    T?.eq ( db.all_first_values select_numbers ), [ 0, 1, 1.5, 2, 2.3, 3, 3.1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101.5, 102.3, 103.1 ]
    return null
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @dbay_virtual_concurrent_writes()
  # @dbay_concurrency_with_explicitly_two_connections()
  # test @dbay_concurrency_with_explicitly_two_connections
  # test @dbay_concurrency_with_implicitly_two_connections
  # @dbay_concurrency_with_table_function()
  test @dbay_concurrency_with_table_function
  # test @



