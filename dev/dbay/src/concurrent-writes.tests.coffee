
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


############################################################################################################
if require.main is module then do =>
  @dbay_virtual_concurrent_writes()
  test @



