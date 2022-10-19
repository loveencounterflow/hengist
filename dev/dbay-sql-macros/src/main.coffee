
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
  whisper }               = GUY.trm.get_loggers 'DBAY-SQL-MACROS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
{ Tbl, }                  = require '../../../apps/icql-dba-tabulate'
dtab                      = new Tbl { dba: null, }
{ SQL  }                  = ( require '../../../apps/guy' ).str


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@dbay_sqlx_function = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  db                = new DBay_sqlx()
  #.........................................................................................................
  _test = ( probe, matcher ) ->
    try
      sqlx  = probe
      sql   = db.resolve sqlx
      help rpr sqlx
      info rpr sql
      T?.eq sql, matcher
    catch error
      T?.eq "ERROR", "#{error.message}\n#{rpr probe}"
  #.........................................................................................................
  db.declare SQL"""@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
  db.declare SQL"""@max( @a, @b ) = case when @a > @b then @a else @b end;"""
  db.declare SQL"""@concat( @first, @second ) = @first || @second;"""
  db.declare SQL"""@intnn() = integer not null;"""
  #.........................................................................................................
  do ->
    sqlx  = SQL"""select @secret_power( 3, 2 );"""
    sql   = SQL"""select power( 3, 2 ) / 2;"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""select @max( 3, 2 ) as the_bigger_the_better;"""
    sql   = SQL"""select case when 3 > 2 then 3 else 2 end as the_bigger_the_better;"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""select @concat( 'here', '\\)' );"""
    sql   = SQL"""select 'here' || '\\)';"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""
      create table numbers (
        n @intnn() primary key );"""
    sql   = SQL"""
      create table numbers (
        n integer not null primary key );"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""
      create table numbers (
        n @intnn primary key );"""
    sql   = SQL"""
      create table numbers (
        n integer not null primary key );"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""select @concat( 'a', 'b' ) as c1, @concat( 'c', 'd' ) as c2;"""
    sql   = SQL"""select 'a' || 'b' as c1, 'c' || 'd' as c2;"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""select @concat( 'a', @concat( 'c', 'd' ) );"""
    sql   = SQL"""select 'a' || 'c' || 'd';"""
    _test sqlx, sql
  #.........................................................................................................
  do ->
    sqlx  = SQL"""select @concat( ',', @concat( ',', ',' ) );"""
    sql   = SQL"""select ',' || ',' || ',';"""
    _test sqlx, sql
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_sqlx_find_arguments = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  db                = new DBay_sqlx()
  _test             = ( probe, matcher ) ->
    result = db._find_arguments probe
    help '^43-1^', probe
    urge '^43-1^', result
    T?.eq result, matcher
  _test SQL""" 3, 2 """,                      [ '3', '2', ]
  _test SQL""" 3, f( 2, 4 ) """,              [ '3', 'f( 2, 4 )' ]
  _test SQL""" 3, f( 2, @g( 4, 5, 6 ) ) """,  [ '3', 'f( 2, @g( 4, 5, 6 ) )' ]
  _test SQL""" 3, 2, "strange,name" """,      [ '3', '2', '"strange,name"' ]
  _test SQL"""           """,                 []
  done?()


#-----------------------------------------------------------------------------------------------------------
@dbay_macros_parameter_name_clashes = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  db                = new DBay_sqlx()
  #.........................................................................................................
  db.declare SQL"""@add( @a, @b ) = ( @a + @b );"""
  db.declare SQL"""@mul( @a, @b ) = ( @a * @b );"""
  db.declare SQL"""@frob( @a, @b ) = ( @add( @a * @b, @mul( @a, @b ) ) );"""
  #.........................................................................................................
  do ->
    probe   = SQL"""select @add( @mul( @add( 1, 2 ), 3 ), @add( 4, @mul( 5, 6 ) ) ) as p;"""
    matcher = 'select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;'
    result  = db.resolve probe
    debug '^5345^', rpr result
    T?.eq result, matcher
  #.........................................................................................................
  do ->
    probe   = SQL"""select @frob( 1, 2 ) as p;"""
    matcher = 'select ( ( ( 1 * 2 ) + ( 1 * 2 ) ) ) as p;'
    result  = db.resolve probe
    debug '^5345^', rpr result
    T?.eq result, matcher
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_recursive_expansion = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  db                = new DBay_sqlx()
  db                = new DBay { macros: true, }
  #.........................................................................................................
  db.declare SQL"""@add_2( @a ) = @a + @ @b ) / @b;"""
  #.........................................................................................................
  do ->
    probe   = SQL"""select @secret_power( 3, 2 ) as p;"""
    matcher = [ { p: 4.5 } ]
    result  = db.resolve probe
    T?.eq result, matcher
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  test @dbay_macros_parameter_name_clashes
  test @
  # @dbay_sql_lexer()
  # @dbay_sqlx_find_arguments()
  # test @dbay_sqlx_find_arguments
  # @dbay_sqlx_function()
  # test @dbay_sqlx_function


