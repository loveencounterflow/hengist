
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/CONSTRUCTION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
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
guy                       = require '../../../apps/guy'
X                         = require '../../../lib/helpers'

#-----------------------------------------------------------------------------------------------------------
@dbay_sqlx_function = ( T, done ) ->
  # T?.halt_on_error()
  E                 = require '../../../apps/dbay/lib/errors'
  { DBay }          = require H.dbay_path
  { SQL  }          = DBay
  { DBay }          = require H.dbay_path
  db                = new DBay()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  #.........................................................................................................
  class E.DBay_sqlx_error            extends E.DBay_error
    constructor: ( ref, message )     -> super ref, message
  #.........................................................................................................
  db.definitions = {}
  db.declare = ( sqlx ) ->
    @types.validate.nonempty_text sqlx
    #.......................................................................................................
    name_re                 = /^(?<name>@[^\s^(]+)/y
    unless ( match = sqlx.match name_re )?
      throw new E.DBay_sqlx_error '^dbay/sqlx@1^', "syntax error in #{rpr sqlx}"
    { name, }               = match.groups
    #.......................................................................................................
    parameters_re           = /\(\s*(?<parameters>[^)]*?)\s*\)\s*=\s*/y
    parameters_re.lastIndex = name_re.lastIndex
    unless ( match = sqlx.match parameters_re )?
      throw new E.DBay_sqlx_error '^dbay/sqlx@2^', "syntax error in #{rpr sqlx}"
    { parameters, }         = match.groups
    parameters              = parameters.split /\s*,\s*/
    body                    = sqlx[ parameters_re.lastIndex ... ].replace /\s*;\s*$/, ''
    @definitions[ name ]    = { name, parameters, body, }
    #.......................................................................................................
    return null
  #.........................................................................................................
  db.resolve = ( sqlx ) ->
    @types.validate.nonempty_text sqlx
    return sqlx.replace /(?<name>@[^\s^(]+)\(\s*(?<values>[^)]*?)\s*\)/g, ( P..., groups ) =>
      debug '^3534^', P
      debug '^3534^', groups
      { name, values, } = groups
      values            = values.split /\s*,\s*/
      unless ( definition = @definitions[ name ] )?
        throw new E.DBay_sqlx_error '^dbay/sqlx@3^', "unknown name #{rpr name}"
      debug { name, values, definition, }
      unless ( call_arity = values.length ) is ( definition_arity = definition.parameters.length )
        throw new E.DBay_sqlx_error '^dbay/sqlx@4^', "expected #{definition_arity} arguments, got #{call_arity}"
      #.....................................................................................................
      R = definition.body
      for parameter, idx in definition.parameters
        value = values[ idx ]
        R = R.replace ///#{parameter}///g, value
        debug rpr R
      return R
  #.........................................................................................................
  db ->
    db.declare SQL"""@secret_power( @a, @b ) = power( @a, @b ) / @b;"""
    sqlx  = SQL"""select @secret_power( 3, 2 );"""
    sql   = db.resolve sqlx
    help rpr sqlx
    info rpr sql
    echo dtab._tabulate db db.resolve sql
    # db SQL"""
    #   create table xy (
    #     n   integer not null primary key,
    #     nx  integer not null );"""
    # insert_into_xy = db.prepare_insert { into: 'xy', exclude: [ 'a', ], }
    # db insert_into_xy, { b: 'one', c: 1, }
    # db insert_into_xy, { b: 'two', c: 1, }
    # db insert_into_xy, { b: 'three', c: 1, }
    # db insert_into_xy, { b: 'four', c: 1, }
    # T?.eq ( db.all_rows SQL"select * from xy order by a;" ), [ { a: 1, b: 'one', c: 1 }, { a: 2, b: 'two', c: 1 }, { a: 3, b: 'three', c: 1 }, { a: 4, b: 'four', c: 1 } ]
    # db SQL"rollback;"
  #.........................................................................................................
  done?()




############################################################################################################
if require.main is module then do =>
  # test @
  @dbay_sqlx_function()
  # test @dbay_sqlx_function

