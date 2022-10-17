
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
  validate
  validate_list_of }      = types.export()
# X                         = require '../../../lib/helpers'
r                         = String.raw
new_xregex                = require 'xregexp'
E                         = require '../../../apps/dbay/lib/errors'
equals                    = ( require 'util' ).isDeepStrictEqual


#===========================================================================================================
class DBay_sqlx extends ( require H.dbay_path ).DBay

  #---------------------------------------------------------------------------------------------------------
  constructor: ( P... ) ->
    super P...
    GUY.props.hide @, '_sqlx_declarations', {}
    GUY.props.hide @, '_sqlx_cmd_re',       null
    return undefined

  #---------------------------------------------------------------------------------------------------------
  declare: ( sqlx ) ->
    @types.validate.nonempty_text sqlx
    parameters_re           = null
    #.......................................................................................................
    name_re                 = /^(?<name>@[^\s^(]+)/y
    unless ( match = sqlx.match name_re )?
      throw new E.DBay_sqlx_error '^dbay/sqlx@1^', "syntax error in #{rpr sqlx}"
    { name, }               = match.groups
    #.......................................................................................................
    if sqlx[ name_re.lastIndex ] is '('
      parameters_re           = /\(\s*(?<parameters>[^)]*?)\s*\)\s*=\s*/y
      parameters_re.lastIndex = name_re.lastIndex
      unless ( match = sqlx.match parameters_re )?
        throw new E.DBay_sqlx_error '^dbay/sqlx@2^', "syntax error in #{rpr sqlx}"
      { parameters, }         = match.groups
      parameters              = parameters.split /\s*,\s*/
      parameters              = [] if equals parameters, [ '', ]
    else
      ### extension for declaration, call w/out parentheses left for later ###
      # throw new E.DBay_sqlx_error '^dbay/sqlx@3^', "syntax error: parentheses are obligatory but missing in #{rpr sqlx}"
      parameters              = []
    #.......................................................................................................
    current_idx                 = parameters_re?.lastIndex ? name_re.lastIndex
    body                        = sqlx[ current_idx ... ].replace /\s*;\s*$/, ''
    arity                       = parameters.length
    @_sqlx_declare { name, parameters, arity, body, }
  #.......................................................................................................
    return null

  #---------------------------------------------------------------------------------------------------------
  _sqlx_get_cmd_re: ->
    return R if ( R = @_sqlx_cmd_re )?
    names = ( Object.keys @_sqlx_declarations ).sort ( a, b ) ->
      a = ( Array.from a ).length
      b = ( Array.from b ).length
      return +1 if a > b
      return -1 if a < b
      return 0
    names = ( @_escape_literal_for_regex name for name in names ).join '|'
    return @_sqlx_cmd_re = /// (?<= \W | ^ ) (?<name> #{names} ) (?= \W | $ ) (?<tail> .* ) $ ///g

  #---------------------------------------------------------------------------------------------------------
  ### thx to https://stackoverflow.com/a/6969486/7568091 and
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping ###
  _escape_literal_for_regex: ( literal ) -> literal.replace /[.*+?^${}()|[\]\\]/g, '\\$&'

  #---------------------------------------------------------------------------------------------------------
  _sqlx_declare: ( cfg ) ->
    if @_sqlx_declarations[ cfg.name ]?
      throw new E.DBay_sqlx_error '^dbay/sqlx@2^', "can not re-declare #{rpr cfg.name}"
    @_sqlx_cmd_re                   = null
    @_sqlx_declarations[ cfg.name ] = cfg
    return null

  #---------------------------------------------------------------------------------------------------------
  resolve: ( sqlx ) ->
    @types.validate.nonempty_text sqlx
    sql_before  = sqlx
    count       = 0
    #.......................................................................................................
    loop
      break if count++ > 10_000 ### NOTE to avoid deadlock, just in case ###
      sql_after = sql_before.replace @_sqlx_get_cmd_re(), ( _matches..., idx, _sqlx, groups ) =>
        # debug '^546^', rpr sqlx[ idx ... idx + groups.name.length ]
        { name
          tail  } = groups
        #.....................................................................................................
        unless ( declaration = @_sqlx_declarations[ name ] )?
          ### NOTE should never happen as we always re-compile pattern from declaration keys ###
          throw new E.DBay_sqlx_error '^dbay/sqlx@4^', "unknown name #{rpr name}"
        #.....................................................................................................
        if tail.startsWith '('
          matches = new_xregex.matchRecursive tail, '\\(', '\\)', '', \
            { escapeChar: '\\', unbalanced: 'skip-lazy', valueNames: [ 'outside', 'before', 'between', 'after', ], }
          [ before
            between
            after   ] = matches
          tail    = tail[ after.end ... ]
          values  = between.value.trim()
          values  = between.value.trim()
          ### TAINT this part to be done with lexer ###
          values  = values.split /\s*,\s*/
          values  = [] if equals values, [ '', ]
          ### ------------------------------------- ###
          call_arity = values.length
        else
          call_arity = 0
        #.....................................................................................................
        unless call_arity is declaration.arity
          throw new E.DBay_sqlx_error '^dbay/sqlx@5^', "expected #{declaration.arity} argument(s), got #{call_arity}"
        #.....................................................................................................
        R = declaration.body
        for parameter, idx in declaration.parameters
          value = values[ idx ]
          R = R.replace ///#{parameter}///g, value
        return R + tail
      break if sql_after is sql_before
      sql_before = sql_after
    #.......................................................................................................
    return sql_after

#-----------------------------------------------------------------------------------------------------------
@dbay_sqlx_function = ( T, done ) ->
  # T?.halt_on_error()
  { SQL  }          = DBay_sqlx
  db                = new DBay_sqlx()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  #.........................................................................................................
  class E.DBay_sqlx_error            extends E.DBay_error
    constructor: ( ref, message )     -> super ref, message
  #.........................................................................................................
  db ->
    db.declare SQL"""@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
    sqlx  = SQL"""select @secret_power( 3, 2 );"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    # echo dtab._tabulate db db.resolve sql
    T?.eq sql, SQL"""select power( 3, 2 ) / 2;"""
  #.........................................................................................................
  db ->
    db.declare SQL"""@max( @a, @b ) = case when @a > @b then @a else @b end;"""
    sqlx  = SQL"""select @max( 3, 2 ) as the_bigger_the_better;"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    # echo dtab._tabulate db db.resolve sql
    T?.eq sql, SQL"""select case when 3 > 2 then 3 else 2 end as the_bigger_the_better;"""
  #.........................................................................................................
  db ->
    db.declare SQL"""@concat( @first, @second ) = @first || @second;"""
    sqlx  = SQL"""select @concat( 'here', '\\)' );"""
    # debug '^87-5^', db._sqlx_get_cmd_re()
    # debug '^87-6^', [ ( sqlx.matchAll db._sqlx_get_cmd_re() )..., ]
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    # echo dtab._tabulate db db.resolve sql
    T?.eq sql, SQL"""select 'here' || '\\)';"""
  #.........................................................................................................
  db ->
    db.declare SQL"""@intnn() = integer not null;"""
    sqlx  = SQL"""
      create table numbers (
        n @intnn() primary key );"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    T?.eq sql, SQL"""
      create table numbers (
        n integer not null primary key );"""
  #.........................................................................................................
  db ->
    # db.declare SQL"""@intnn = integer not null;"""
    sqlx  = SQL"""
      create table numbers (
        n @intnn primary key );"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    T?.eq sql, SQL"""
      create table numbers (
        n integer not null primary key );"""
  #.........................................................................................................
  db ->
    sqlx  = SQL"""select @concat( 'a', 'b' ) as c1, @concat( 'c', 'd' ) as c2;"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    T?.eq sql, SQL"""select 'a' || 'b' as c1, 'c' || 'd' as c2;"""
  return done?() #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  #.........................................................................................................
  db ->
    sqlx  = SQL"""select @concat( 'a', @concat( 'c', 'd' ) );"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    T?.eq sql, SQL"""select 'a' || 'c' || 'd';"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_sql_lexer = ( T, done ) ->
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: null, }
  { SQL  }          = DBay_sqlx
  lexer             = require '../../../../dbay-sql-lexer'
  info k for k in ( GUY.props.keys lexer ).sort()
  show = ( sql ) ->
    info rpr sql
    try
      _tokens = lexer.tokenize sql
    catch error
      warn '^35345^', GUY.trm.reverse GUY.props.keys error
      warn '^35345^', GUY.trm.reverse error.message
      warn '^35345^', GUY.trm.reverse error.name
      return null
    tokens = []
    for [ type, text, start, stop, ] in _tokens
      tokens.push { type, text, start, stop, }
      # urge type, text, start, stop
    echo dtab._tabulate tokens
    return null
  show SQL"""select * from my_table"""
  show SQL"""42"""
  show SQL"""( 'text', 'another''text', 42 )"""
  show SQL"""( 'text', @f( 1, 2, 3 ), 42 )"""
  show SQL"""SELECT 42 as c;"""
  show SQL"""select 'helo', 'world''';"""
  show SQL"""select 'helo', 'world'''"""
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # test @
  # @dbay_sql_lexer()
  @dbay_sqlx_function()
  test @dbay_sqlx_function

