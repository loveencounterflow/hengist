
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
    else
      ### extension for declaration, call w/out parentheses left for later ###
      throw new E.DBay_sqlx_error '^dbay/sqlx@3^', "syntax error: parentheses are obligatory but missing in #{rpr sqlx}"
      # parameters              = []
    #.......................................................................................................
    current_idx                 = parameters_re?.lastIndex ? name_re.lastIndex
    body                        = sqlx[ current_idx ... ].replace /\s*;\s*$/, ''
    @_sqlx_declare { name, parameters, body, }
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
    return @_sqlx_cmd_re = /// (?<= \W | ^ ) (?<name> #{names} ) (?= \W | $ ) ///g

  #---------------------------------------------------------------------------------------------------------
  ### thx to https://stackoverflow.com/a/6969486/7568091 and
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping ###
  _escape_literal_for_regex: ( literal ) -> literal.replace /[.*+?^${}()|[\]\\]/g, '\\$&'

  #---------------------------------------------------------------------------------------------------------
  _sqlx_declare: ( cfg ) ->
    @_sqlx_cmd_re                   = null
    @_sqlx_declarations[ cfg.name ] = cfg
    return null

  #---------------------------------------------------------------------------------------------------------
  resolve: ( sqlx ) ->
    @types.validate.nonempty_text sqlx
    return sqlx.replace /(?<name>@[^\s^(]+)\(\s*(?<values>[^)]*?)\s*\)/g, ( P..., groups ) =>
      { name, values, } = groups
      values            = values.split /\s*,\s*/
      unless ( definition = @_sqlx_declarations[ name ] )?
        throw new E.DBay_sqlx_error '^dbay/sqlx@4^', "unknown name #{rpr name}"
      unless ( call_arity = values.length ) is ( definition_arity = definition.parameters.length )
        throw new E.DBay_sqlx_error '^dbay/sqlx@5^', "expected #{definition_arity} arguments, got #{call_arity}"
      #.....................................................................................................
      R = definition.body
      for parameter, idx in definition.parameters
        value = values[ idx ]
        R = R.replace ///#{parameter}///g, value
      return R


#-----------------------------------------------------------------------------------------------------------
@dbay_sqlx_function = ( T, done ) ->
  # T?.halt_on_error()
  E                 = require '../../../apps/dbay/lib/errors'
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
    echo dtab._tabulate db db.resolve sql
  #.........................................................................................................
  db ->
    db.declare SQL"""@max( @a, @b ) = case when @a > @b then @a else @b end;"""
    sqlx  = SQL"""select @max( 3, 2 ) as the_bigger_the_better;"""
    debug '^87-1^', db._sqlx_get_cmd_re()
    debug '^87-1^', [ ( sqlx.matchAll db._sqlx_get_cmd_re() )..., ]
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    echo dtab._tabulate db db.resolve sql
  #.........................................................................................................
  db ->
    db.declare SQL"""@intnn() = integer not null;"""
    sqlx  = SQL"""
      create table numbers (
        n @intnn() primary key );"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
  # #.........................................................................................................
  # db ->
  #   db.declare SQL"""@intnn = integer not null;"""
  #   sqlx  = SQL"""
  #     create table numbers (
  #       n @intnn primary key );"""
  #   sql   = db.resolve sqlx
  #   help rpr sqlx
  #   info rpr sql
  #.........................................................................................................
  done?()




############################################################################################################
if require.main is module then do =>
  # test @
  @dbay_sqlx_function()
  # test @dbay_sqlx_function

