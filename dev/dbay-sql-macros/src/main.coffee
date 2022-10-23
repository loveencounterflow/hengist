
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
  log
  reverse }               = GUY.trm
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
@dbay_macros_function = ( T, done ) ->
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
@dbay_macros_find_arguments = ( T, done ) ->
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
  db.declare SQL"""@程( @a, @b ) = ( @a * @b );"""
  db.declare SQL"""@程_2( @a, @b ) = ( @a * @b );"""
  db.declare SQL"""@mul( @a, @b ) = ( @a * @b );"""
  db.declare SQL"""@frob( @a, @b ) = ( @add( @a * @b, @mul( @a, @b ) ) );"""
  #.........................................................................................................
  do ->
    probe   = SQL"""select @add( @mul( @add( 1, 2 ), 3 ), @add( 4, @mul( 5, 6 ) ) ) as p;"""
    matcher = SQL"""select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;"""
    result  = db.resolve probe
    help '^5345^', rpr result
    T?.eq result, matcher
  #.........................................................................................................
  do ->
    probe   = SQL"""select @add( @程( @add( 1, 2 ), 3 ), @add( 4, @程( 5, 6 ) ) ) as p;"""
    matcher = SQL"""select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;"""
    result  = db.resolve probe
    help '^5345^', rpr result
    T?.eq result, matcher
  #.........................................................................................................
  do ->
    probe   = SQL"""select @add( @程_2( @add( 1, 2 ), 3 ), @add( 4, @程_2( 5, 6 ) ) ) as p;"""
    matcher = SQL"""select ( ( ( 1 + 2 ) * 3 ) + ( 4 + ( 5 * 6 ) ) ) as p;"""
    result  = db.resolve probe
    help '^5345^', rpr result
    T?.eq result, matcher
  #.........................................................................................................
  do ->
    probe   = SQL"""select @frob( 1, 2 ) as q;"""
    matcher = SQL"""select ( ( 1 * 2 + ( 1 * 2 ) ) ) as q;"""
    result  = db.resolve probe
    help '^5345^', rpr result
    T?.eq result, matcher
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_works_without_any_declarations = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  m                 = new DBay_sqlx()
  probe             = SQL"""select 42 as answer;"""
  help '^12-1^', rpr result  = m.resolve probe
  T?.eq probe, SQL"""select 42 as answer;"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_checks_for_leftovers = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  m                 = new DBay_sqlx()
  probe             = SQL"""
    select
      @strange_thing()      as c1,
      @secret_power( 3, 2 ) as c2,
      @strange_thing        as c3;"""
  debug '^79-1^', try m.resolve probe catch e then warn reverse e.message
  T?.throws /found unresolved macros @secret_power, @strange_thing/, -> m.resolve probe
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_use_case_virtual_types = ( T, done ) ->
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  { DBay      }     = require '../../../apps/dbay'
  m                 = new DBay_sqlx()
  ### NOTE using a 'generic' DB connection w/out implicit macro handling ###
  db                = new DBay { macros: false, }
  #.........................................................................................................
  m.declare SQL"""@id( @name )    = @name text    check ( @name regexp '^[a-z]{3}-[0-9]{2}' )"""
  m.declare SQL"""@month( @name ) = @name integer check ( @name between 1 and 12 )"""
  debug '^14-1^', d for _, d of m._declarations
  db ->
    sql = m.resolve SQL"""
      create table bookings (
        @id( "booking_id" ),
        @month( "booking_period" )
        );"""
    T?.eq sql, SQL"""
      create table bookings (
        "booking_id" text    check ( "booking_id" regexp '^[a-z]{3}-[0-9]{2}' ),
        "booking_period" integer check ( "booking_period" between 1 and 12 )
        );"""
    urge '^34-1^', sql
    # db sql
    db.rollback_transaction()
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_declarations_undone_on_rollback_or_not = ( T, done ) ->
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  { DBay      }     = require '../../../apps/dbay'
  m                 = new DBay_sqlx()
  ### NOTE using a 'generic' DB connection w/out implicit macro handling ###
  db                = new DBay { macros: false, }
  #.........................................................................................................
  m.declare SQL"""@declared_without_tx = whatever;"""
  T?.eq ( key for key of m._declarations ), [ '@declared_without_tx', ]
  db ->
    m.declare SQL"""@declared_within_tx = whatever;"""
    T?.eq ( key for key of m._declarations ), [ '@declared_without_tx', '@declared_within_tx', ]
    db.rollback_transaction()
    return null
  ### current behavior: ###
  T?.eq ( key for key of m._declarations ), [ '@declared_without_tx', '@declared_within_tx', ]
  ### possible future behavior: ###
  # T?.eq ( key for  of m._declarations ), [ '@declared_without_tx', ]
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @dbay_macros_use_case_virtual_types()
  # test @dbay_macros_use_case_virtual_types
  @dbay_macros_parameter_name_clashes()
  # test @dbay_macros_parameter_name_clashes
  # @dbay_macros_checks_for_leftovers()
  # test @dbay_macros_checks_for_leftovers
  test @
  # @dbay_sql_lexer()
  # @dbay_macros_find_arguments()
  # test @dbay_macros_find_arguments
  # @dbay_macros_function()
  # test @dbay_macros_function


