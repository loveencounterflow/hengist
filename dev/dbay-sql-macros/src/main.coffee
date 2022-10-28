
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
  whisper }               = GUY.trm.get_loggers 'DBAY-SQL-MACROS/tests'
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
@dbay_macros_regexen = ( T, done ) ->
  # T?.halt_on_error()
  regexes = require '../../../apps/dbay-sql-macros/lib/regexes'
  T?.eq ( type_of regexes.rx.chrs.strict.allowed.head                               ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.strict.allowed.tail                               ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.strict.forbidden.head                             ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.strict.forbidden.tail                             ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.strict.forbidden.paren                            ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.practical.allowed.head                            ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.practical.allowed.tail                            ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.practical.forbidden.head                          ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.practical.forbidden.tail                          ), 'regex'
  T?.eq ( type_of regexes.rx.chrs.practical.forbidden.paren                         ), 'regex'
  T?.eq ( type_of regexes.get_rx_for_any_name                                       ), 'function'
  T?.eq ( type_of regexes.get_rx_for_bare_name                                      ), 'function'
  T?.eq ( type_of regexes.get_rx_for_paren_name                                     ), 'function'
  T?.eq ( type_of regexes.get_rx_for_start_paren_name                               ), 'function'
  T?.eq ( type_of rx_for_any_name         = regexes.get_rx_for_any_name()           ), 'regex'
  T?.eq ( type_of rx_for_bare_name        = regexes.get_rx_for_bare_name()          ), 'regex'
  T?.eq ( type_of rx_for_paren_name       = regexes.get_rx_for_paren_name()         ), 'regex'
  T?.eq ( type_of rx_for_start_paren_name = regexes.get_rx_for_start_paren_name()   ), 'regex'
  T?.eq ( type_of rx_for_parameter_a      = regexes.get_rx_for_parameter 'practical', '|', '@a' ), 'regex'
  sqlx  = "22@foo @bar( baz @what's @that( @辻 oops @程　たたみ() @blah"
  #.........................................................................................................
  do ->
    whisper '^49-1^', rx_for_any_name
    result = ( { index: match.index, name: match[ 0 ], } for match from sqlx.matchAll rx_for_any_name   )
    urge '^49-2^', result
    info '^49-3^', match for match in result
    T?.eq result, [ { index: 2, name: '@foo' }, { index: 7, name: '@bar' }, { index: 17, name: '@what' }, { index: 25, name: '@that' }, { index: 32, name: '@辻' }, { index: 40, name: '@程　たたみ' }, { index: 49, name: '@blah' } ]
  #.........................................................................................................
  do ->
    whisper '^49-4^', rx_for_bare_name
    result = ( { index: match.index, name: match[ 0 ], } for match from sqlx.matchAll rx_for_bare_name   )
    urge '^49-5^', result
    info '^49-6^', match for match in result
    T?.eq result, [ { index: 2, name: '@foo' }, { index: 17, name: '@what' }, { index: 32, name: '@辻' }, { index: 49, name: '@blah' } ]
  #.........................................................................................................
  do ->
    whisper '^49-7^', rx_for_parameter_a
    result = ( { index: match.index, name: match[ 0 ], } for match from "foo@a bar".matchAll rx_for_parameter_a   )
    urge '^49-8^', result
    info '^49-9^', match for match in result
    T?.eq result, [ { index: 3, name: '@a' } ]
  #.........................................................................................................
  do ->
    whisper '^49-10^', rx_for_parameter_a
    result = ( { index: match.index, name: match[ 0 ], } for match from "foo@a|bar".matchAll rx_for_parameter_a   )
    urge '^49-11^', result
    info '^49-12^', match for match in result
    T?.eq result, [ { index: 3, name: '@a|' } ]
  #.........................................................................................................
  do ->
    whisper '^49-13^', rx_for_paren_name
    result = ( { index: match.index, name: match[ 0 ], } for match from sqlx.matchAll rx_for_paren_name   )
    urge '^49-14^', result
    info '^49-15^', match for match in result
    T?.eq result, [ { index: 7, name: '@bar' }, { index: 25, name: '@that' }, { index: 40, name: '@程　たたみ' } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_declarations = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare """@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
    T?.eq ( k for k of m._declarations ),                 [ '@secret_power', ]
    T?.eq m._declarations[ '@secret_power' ]?.body,       """power( @a, @b ) / @b"""
    T?.eq m._declarations[ '@secret_power' ]?.parameters, [ '@a', '@b' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_simple_resolution = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  #.........................................................................................................
  _test = ( ref, m, probe, matcher, error ) ->
    help ref, rpr probe
    try
      if error?
        T?.throws error, -> try result = m.resolve probe catch e then warn ref, reverse e.message; throw e
        warn ref, rpr result
      else
        result = m.resolve probe
        if result is matcher then ( info ref, rpr result ) else ( warn ref, rpr result )
        T?.eq result, matcher
    catch error
      T?.eq "ERROR #{ref}", "#{error.message}\n#{rpr probe}"
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare SQL"""@power( @a, @b ) = ( /* power */ @a ** @b );"""
    sqlx  = SQL"""select @power( 3, 2 ) as x;"""
    sql   = SQL"""select ( /* power */ 3 ** 2 ) as x;"""
    _test '^t#1^', m, sqlx, sql
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare SQL"""@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
    sqlx  = SQL"""select @secret_power( 3, 2 ) as x;"""
    sql   = SQL"""select power( 3, 2 ) / 2 as x;"""
    _test '^t#2^', m, sqlx, sql
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare SQL"""@hoax( @a ) = @a || '@a' || @a;"""
    sqlx  = SQL"""select @hoax( 'x' ) as hoax;"""
    sql   = SQL"""select 'x' || ''x'' || 'x' as hoax;"""
    _test '^t#3^', m, sqlx, sql
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare SQL"""@hoax( @a ) = @a || '\\@a' || @a;"""
    sqlx  = SQL"""select @hoax( 'x' ) as hoax;"""
    sql   = SQL"""select 'x' || '@a' || 'x' as hoax;"""
    _test '^t#4^', m, sqlx, sql
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare SQL"""@secret_power( @a, @b ) = @power( @a, @b ) / @b;"""
    sqlx  = SQL"""select @secret_power( 3, 2 ) as x;"""
    _test '^t#5^', m, sqlx, null, /unknown macro '@power'/
  #.........................................................................................................
  do ->
    m     = new DBay_sqlx()
    m.declare SQL"""@add(     @a, @b ) = /*\\@add*/( @a + @b );"""
    m.declare SQL"""@power(   @a, @b ) = /*\\@power*/( @a ** @b );"""
    m.declare SQL"""@secret(  @a, @b ) = /*\\@secret*/( @power( @a, @b ) / @b );"""
    sqlx  = SQL"""select @secret( @add( 1, 2 ), 3 ) as x;"""
    # _test '^t#6^', m, sqlx, SQL"""select /*@secret*/( /*@power*/( /*@add*/( 1 + 2 ) ** 3 ) / 3 ) as x;"""
    m.resolve sqlx
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_more_resolutions = ( T, done ) ->
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
    # help '^43-1^', probe
    urge '^43-1^', result
    T?.eq result, matcher
  _test SQL"""( 3, 2 )""",                                      { values: [ '3', '2' ], stop_idx: 8 }
  _test SQL"""( 3, f( 2, 4 ) )""",                              { values: [ '3', 'f( 2, 4 )' ], stop_idx: 16 }
  _test SQL"""( 3, f( 2, @g( 4, 5, 6 ) ) )""",                  { values: [ '3', 'f( 2, @g( 4, 5, 6 ) )' ], stop_idx: 28 }
  _test SQL"""( 3, 2, "strange,name" )""",                      { values: [ '3', '2', '"strange,name"' ], stop_idx: 24 }
  _test SQL"""(           )""",                                 { values: [], stop_idx: 13 }
  _test SQL"""()""",                                            { values: [], stop_idx: 2 }
  _test SQL"""( @power( 1, 2 ), 3 ) as x;""",                   { values: [ '@power( 1, 2 )', '3' ], stop_idx: 21 }
  _test SQL"""( @power( 1, @f( 2, 3, @g( 4 ) ) ), 5 ) as x;""", { values: [ '@power( 1, @f( 2, 3, @g( 4 ) ) )', '5' ], stop_idx: 39 }
  _test SQL"""( /*@add*/( 1 + 2 ), 3 ) / 3 )""",                { values: [ '/*@add*/( 1 + 2 )', '3' ], stop_idx: 24 }
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
  #.........................................................................................................
  do ->
    probe             = SQL"""select 42 as answer;"""
    help '^12-1^', rpr result  = m.resolve probe
    T?.eq result, SQL"""select 42 as answer;"""
  #.........................................................................................................
  do ->
    probe             = SQL"""
      select
      42
      as
      answer;"""
    help '^12-1^', rpr result  = m.resolve probe
    T?.eq result, SQL"""
      select
      42
      as
      answer;"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_works_without_any_matching_declarations = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  m                 = new DBay_sqlx()
  m.declare SQL"""@add( @a, @b ) = ( @a + @b );"""
  #.........................................................................................................
  do ->
    probe             = SQL"""select 42 as answer;"""
    help '^12-1^', rpr result  = m.resolve probe
    T?.eq result, SQL"""select 42 as answer;"""
  #.........................................................................................................
  do ->
    probe             = SQL"""
      select
      42
      as
      answer;"""
    help '^12-1^', rpr result  = m.resolve probe
    T?.eq result, SQL"""
      select
      42
      as
      answer;"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_checks_for_leftovers = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  #.........................................................................................................
  do ->
    m                 = new DBay_sqlx()
    probe             = SQL"""
      select
        @strange_thing()      as c1,
        @secret_power( 3, 2 ) as c2,
        @strange_thing        as c3;"""
    debug '^79-1^', try m.resolve probe catch e then warn reverse e.message
    try m.resolve probe catch e then warn reverse e.message
    T?.throws /unknown macro '@strange_thing'/, -> m.resolve probe
  #.........................................................................................................
  do ->
    m                 = new DBay_sqlx()
    m.declare SQL"""@secret_power( @a, @b ) = @power( @a, @b ) / @b;"""
    probe  = SQL"""select @secret_power( 3, 2 ) as x;"""
    debug '^79-1^', try m.resolve probe catch e then warn reverse e.message
    try m.resolve probe catch e then warn reverse e.message
    T?.throws /unknown macro '@power'/, -> m.resolve probe
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_macros_dont_allow_name_reuse_or_recursive_usage = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  do ->
    m = new DBay_sqlx()
    try m.declare SQL"""@foo_1( @foo_1 ) = whatever;""" catch e then warn reverse e.message
    try m.declare SQL"""@foo_2( @a, @a ) = whatever;""" catch e then warn reverse e.message
  # T?.throws /found unresolved macros @secret_power, @strange_thing/, -> m.resolve probe
  do ->
    m = new DBay_sqlx()
    try m.declare SQL"""@a( @b ) = (a @b );""" catch e then warn reverse e.message
    try m.declare SQL"""@b( @a ) = (b @b );""" catch e then warn reverse e.message
    urge '^80-1^', m.resolve "@a( 'b' )"
    urge '^80-1^', m.resolve "@b( 'a' )"
    urge '^80-1^', m.resolve "@a( @b( 'a' ) )"
    urge '^80-1^', m.resolve "@b( @a( 'b' ) )"
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
  # debug '^14-1^', d for _, d of m._declarations
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
  m.declare SQL"""@declared_without_tx() = whatever;"""
  T?.eq ( key for key of m._declarations ), [ '@declared_without_tx', ]
  db ->
    m.declare SQL"""@declared_within_tx() = whatever;"""
    T?.eq ( key for key of m._declarations ), [ '@declared_without_tx', '@declared_within_tx', ]
    db.rollback_transaction()
    return null
  ### current behavior: ###
  T?.eq ( key for key of m._declarations ), [ '@declared_without_tx', '@declared_within_tx', ]
  ### possible future behavior: ###
  # T?.eq ( key for  of m._declarations ), [ '@declared_without_tx', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_dbay_macros_demo_legal_chrs_in_identifiers = ( T, done ) ->
  { DBay      }     = require '../../../apps/dbay'
  db                = new DBay()
  #.........................................................................................................
  db ->
    for cid in [ 0x0000 .. 0xffff ]
      cid_hex = '0x' + ( cid.toString 16 ).padStart 4, '0'
      chr   = String.fromCodePoint cid
      name  = "#{chr}x"
      # name  = "x#{chr}x"
      try
        rows = ( row for row from db SQL"""select 42 as #{name};""" )
        # debug '^434^', cid_hex, rows[ 0 ]
      catch error
        warn cid_hex, GUY.trm.reverse error.message
    debug '^645^', cid_hex
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_vanishing_terminator = ( T, done ) ->
  # T?.halt_on_error()
  { DBay_sqlx }     = require '../../../apps/dbay-sql-macros'
  m                 = new DBay_sqlx()
  m.declare SQL"""@mymacro( @a ) = FOO@a|BAR;"""
  #.........................................................................................................
  do ->
    sqlx              = "@mymacro( value_of_a )"
    result            = m.resolve sqlx
    urge '^50-8^', result
    T?.eq result, "FOOvalue_of_aBAR"
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @dbay_macros_use_case_virtual_types()
  # test @dbay_macros_use_case_virtual_types
  # @dbay_macros_find_arguments()
  # test @dbay_macros_find_arguments
  # test @dbay_macros_works_without_any_declarations
  # @_dbay_macros_demo_legal_chrs_in_identifiers()
  # @dbay_macros_regexen()
  # test @dbay_macros_regexen
  # test @dbay_macros_declarations
  # @dbay_macros_simple_resolution()
  # test @dbay_macros_simple_resolution
  # @dbay_macros_more_resolutions()
  # test @dbay_macros_more_resolutions
  # @dbay_macros_checks_for_leftovers()
  # test @dbay_macros_checks_for_leftovers
  # @_dbay_macros_demo_boundaries()
  # @dbay_vanishing_terminator()
  # test @dbay_vanishing_terminator
  test @


