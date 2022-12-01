
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
@dbay_shadow_db = ( T, done ) ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  #.........................................................................................................
  my_path = '/tmp/helo.db'
  db      = new DBay { path: my_path, }
  db ->
    if ( db.all_rows SQL"select name from sqlite_schema where name = 'numbers';" ).length is 0
      db SQL"""create table numbers (
        n   integer not null primary key,
        sqr integer );"""
    #.......................................................................................................
    insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
    db insert_number, { n, sqr: null, } for n in [ 0 .. 10 ]
  #.........................................................................................................
  # H.tabulate "numbers", db SQL"""select * from numbers order by n;"""
  select_numbers = db.prepare SQL"select * from numbers order by n;"
  T?.eq ( db.all_rows SQL"select * from numbers order by n;" ), [ { n: 0, sqr: null }, { n: 1, sqr: null }, { n: 2, sqr: null }, { n: 3, sqr: null }, { n: 4, sqr: null }, { n: 5, sqr: null }, { n: 6, sqr: null }, { n: 7, sqr: null }, { n: 8, sqr: null }, { n: 9, sqr: null }, { n: 10, sqr: null } ]
  #.........................................................................................................
  db = db.with_shadow read_db = db, ({ db: write_db, }) ->
    db.pragma SQL"journal_mode = wal;"
    db ->
      insert_number = write_db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
      for d from read_db select_numbers
        write_db insert_number, { n, sqr: n ** 2, } for n in [ 0 .. 10 ]
      return null
    return null
  #.........................................................................................................
  T?.eq ( db.all_rows SQL"select * from numbers order by n;" ), [ { n: 0, sqr: 0 }, { n: 1, sqr: 1 }, { n: 2, sqr: 4 }, { n: 3, sqr: 9 }, { n: 4, sqr: 16 }, { n: 5, sqr: 25 }, { n: 6, sqr: 36 }, { n: 7, sqr: 49 }, { n: 8, sqr: 64 }, { n: 9, sqr: 81 }, { n: 10, sqr: 100 } ]
  # H.tabulate "numbers", db SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @dbay_macros_methods()
  # test @dbay_macros_methods
  # @dbay_macros_implicit_expansion()
  test @



