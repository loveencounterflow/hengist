
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
{ Tbl, }                  = require '../../../apps/icql-dba-tabulate'
dtab                      = new Tbl { dba: null, }
# { SQL  }          = DBay_sqlx
sql_lexer                 = require '../../../../dbay-sql-lexer'


#===========================================================================================================
class E.DBay_sqlx_error            extends E.DBay_error
  constructor: ( ref, message )     -> super ref, message


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
        #...................................................................................................
        unless ( declaration = @_sqlx_declarations[ name ] )?
          ### NOTE should never happen as we always re-compile pattern from declaration keys ###
          throw new E.DBay_sqlx_error '^dbay/sqlx@4^', "unknown name #{rpr name}"
        #...................................................................................................
        if tail.startsWith '('
          matches     = new_xregex.matchRecursive tail, '\\(', '\\)', '', \
            { escapeChar: '\\', unbalanced: 'skip-lazy', valueNames: [ 'outside', 'before', 'between', 'after', ], }
          [ before
            between
            after   ] = matches
          tail        = tail[ after.end ... ]
          values      = @_find_arguments between.value
          call_arity  = values.length
        else
          call_arity  = 0
        #...................................................................................................
        unless call_arity is declaration.arity
          throw new E.DBay_sqlx_error '^dbay/sqlx@5^', "expected #{declaration.arity} argument(s), got #{call_arity}"
        #...................................................................................................
        R = declaration.body
        for parameter, idx in declaration.parameters
          value = values[ idx ]
          R = R.replace ///#{parameter}///g, value
          debug '^43-1^', rpr R + tail
        return R + tail
      break if sql_after is sql_before
      sql_before = sql_after
    #.......................................................................................................
    return sql_after

  #---------------------------------------------------------------------------------------------------------
  _find_arguments: ( sqlx ) ->
    sqlx    = sqlx.trim()
    tokens  = []
    R       = []
    #.......................................................................................................
    _tokens = sql_lexer.tokenize sqlx
    for [ type, text, lnr, offset, ] in _tokens
      tokens.push { type, text, lnr, offset, }
    #.......................................................................................................
    # echo dtab._tabulate tokens
    level       = 0
    comma_idxs  = [ { start: null, stop: 0, }, ]
    for token in tokens
      switch token.type
        when 'LEFT_PAREN'
          # info "bracket #{rpr token} (#{level})"
          level++
        when 'RIGHT_PAREN'
          level--
          # info "bracket #{rpr token} (#{level})"
        when 'COMMA'
          # info "comma #{rpr token} (#{level})"
          if level is 0
            comma_idxs.push { start: token.offset, stop: token.offset + token.text.length, }
        else
          null
          # warn "skipping #{rpr token}"
    comma_idxs.push { start: sqlx.length, stop: null, }
    #.......................................................................................................
    for idx in [ 1 ... comma_idxs.length ]
      start = comma_idxs[ idx - 1 ].stop
      stop  = comma_idxs[ idx     ].start
      R.push sqlx[ start ... stop ].trim()
    #.......................................................................................................
    R = [] if equals R, [ '', ]
    return R

#-----------------------------------------------------------------------------------------------------------
@dbay_sqlx_function = ( T, done ) ->
  # T?.halt_on_error()
  { SQL  }          = DBay_sqlx
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
      T?.eq "ERROR", error.message
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
  { SQL  }  = DBay_sqlx
  db        = new DBay_sqlx()
  _test     = ( probe, matcher ) ->
    result = db._find_arguments probe
    help '^43-1^', probe
    urge '^43-1^', result
    T?.eq result, matcher
  _test SQL""" 3, 2 """,                      [ '3', '2', ]
  _test SQL""" 3, f( 2, 4 ) """,              [ '3', 'f( 2, 4 )' ]
  _test SQL""" 3, f( 2, @g( 4, 5, 6 ) ) """,  [ '3', 'f( 2, @g( 4, 5, 6 ) )' ]
  _test SQL""" 3, 2, "strange,name" """,      [ '3', '2', '"strange,name"' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_sql_lexer = ( T, done ) ->
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
  @dbay_sqlx_find_arguments()
  test @dbay_sqlx_find_arguments
  # @dbay_sqlx_function()
  # test @dbay_sqlx_function


