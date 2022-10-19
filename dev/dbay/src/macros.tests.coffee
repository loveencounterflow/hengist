
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
@dbay_macros_methods = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  { SQL  }          = DBay
  db                = new DBay()
  #.........................................................................................................
  T?.eq ( type_of db.macros?.declare ), 'function'
  T?.eq ( type_of db.macros?.resolve ), 'function'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_assert_basic_functionality = ( T, done ) ->
  ### NOTE this test is a shortened version of the more extensive tests to be found at
  https://github.com/loveencounterflow/hengist/tree/master/dev/dbay-sql-macros/src; it's only here to
  assert that `declare()` and `resolve()` behave in roughly the expted ways. ###
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  { SQL  }          = DBay
  db                = new DBay()
  #.........................................................................................................
  _test = ( probe, matcher ) ->
    try
      sqlx  = probe
      sql   = db.macros.resolve sqlx
      help rpr sqlx
      info rpr sql
      T?.eq sql, matcher
    catch error
      T?.eq "ERROR", "#{error.message}\n#{rpr probe}"
  #.........................................................................................................
  db.macros.declare SQL"""@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
  do ->
    sqlx  = SQL"""select @secret_power( 3, 2 );"""
    sql   = SQL"""select power( 3, 2 ) / 2;"""
    _test sqlx, sql
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_implicit_expansion = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  { SQL  }          = DBay
  db                = new DBay { macros: true, }
  #.........................................................................................................
  db.macros.declare SQL"""@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
  #.........................................................................................................
  do ->
    probe   = SQL"""select @secret_power( 3, 2 ) as p;"""
    matcher = [ { p: 4.5 } ]
    result  = db.all_rows probe
    T?.eq result, matcher
  #.........................................................................................................
  do ->
    probe   = SQL"""select @secret_power( 3, 2 ) as p;"""
    matcher = [ 4.5, ]
    result  = db.all_first_values probe
    T?.eq result, matcher
  #.........................................................................................................
  do ->
    probe   = SQL"""select @secret_power( 3, 2 ) as p;"""
    matcher = [ { p: 4.5 } ]
    result  = db probe
    result  = [ result..., ]
    T?.eq result, matcher
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # @dbay_macros_methods()
  # test @dbay_macros_methods
  # @dbay_macros_implicit_expansion()
  test @



