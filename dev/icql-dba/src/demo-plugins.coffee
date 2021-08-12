
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/DEMO/PLUGINS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
{ Dba }                   = require H.icql_dba_path


#===========================================================================================================
class Dba_plugins

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    { dba }   = cfg
    throw new Error "must provide `dba: new Dba()` instance" unless dba?
    @dba = dba
    delete cfg.dba
    return undefined

#===========================================================================================================
class Dbsquares extends Dba_plugins

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    super cfg
    defaults  = { first: 0, last: 10, step: 1, prefix: 'sq_', dba: null, }
    @cfg      = { defaults..., cfg..., }
    @_create_sql_functions?()
    @_create_db_structure?()
    @_compile_sql?()
    @_populate?()
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _create_db_structure: ->
    { prefix } = @cfg
    @dba.execute SQL"""
      create table if not exists #{prefix}squares (
        n     integer not null unique primary key,
        p     integer not null,
        p1    integer generated always as ( #{prefix}square_plus_one( n ) ) virtual not null unique );
      create unique index if not exists #{prefix}squares_p1_idx on #{prefix}squares ( p1 );
      """
    return null

  #---------------------------------------------------------------------------------------------------------
  _create_sql_functions: ->
    { prefix } = @cfg
    @dba.create_function name: prefix + 'square_plus_one', call: ( n ) => n ** 2 + 1
    return null

  #---------------------------------------------------------------------------------------------------------
  _populate: ->
    { prefix } = @cfg
    for n in [ @cfg.first .. @cfg.last ] by @cfg.step
      p = n ** 2
      @dba.run SQL"insert into #{prefix}squares ( n, p ) values ( $n, $p );", { n, p, }
    return null


#===========================================================================================================
class Dba_user

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    @dba  = new Dba { ram: true, }
    @cfg  =
      prefix:     'usr_'
    @dbsq = new Dbsquares { dba: @dba, prefix: @cfg.prefix, }
    return undefined

  #---------------------------------------------------------------------------------------------------------
  show_squares: ->
    for row from @dba.query SQL"select * from #{@cfg.prefix}squares order by n;"
      info '^887^', row


############################################################################################################
if module is require.main then do =>
  dbu = new Dba_user()
  dbu.show_squares()


