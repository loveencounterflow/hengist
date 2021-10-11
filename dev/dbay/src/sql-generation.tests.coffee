
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/SQL-GENERATION'
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
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
r                         = String.raw

get_Sqlgen = ->
  { DBay, } = require H.dbay_path
  types     = require PATH.join H.dbay_path, 'lib/types'

  #-----------------------------------------------------------------------------------------------------------
  types.declare 'dbay_create_insert_cfg', tests:
    "@isa.object x":                                ( x ) -> @isa.object x
    "@isa.dbay_usr_schema x.schema":                ( x ) -> @isa.dbay_usr_schema x.schema
    "@isa.dbay_name x.name":                        ( x ) -> @isa.dbay_name x.name
    "?@isa_list_of.nonempty_text x.exclude":        ( x ) -> true unless x.exclude?; @isa_list_of.nonempty_text x.exclude
    "?@isa_list_of.nonempty_text x.include":        ( x ) -> true unless x.include?; @isa_list_of.nonempty_text x.include
    "x.exclude, x.include may not appear together": ( x ) -> ( not x.exclude? ) or ( not x.include? )
    "x.on_conflict in [ 'nothing', 'sql', ]":       ( x ) -> x.on_conflict in [ 'nothing', 'sql', ]
    "@isa_list_of.nonempty_text x.fields":          ( x ) -> @isa_list_of.nonempty_text x.fields

  # #-----------------------------------------------------------------------------------------------------------
  # types.declare 'dbay_fields_of_cfg', tests:
  #   "@isa.object x":                          ( x ) -> @isa.object x
  #   # "@isa.ic_schema x.schema":                ( x ) -> @isa.ic_schema x.schema
  #   # "@isa.nonempty_text x.name":              ( x ) -> @isa_optional.ic_name x.name


  #===========================================================================================================
  class Sqlgen extends DBay

    #---------------------------------------------------------------------------------------------------------
    # C

    #---------------------------------------------------------------------------------------------------------
    constructor: ( cfg ) ->
      super cfg
      return undefined

    #---------------------------------------------------------------------------------------------------------
    prepare_insert: ( cfg ) -> @prepare @create_insert cfg
    create_insert: ( cfg ) ->
      @types.validate.dbay_create_insert_cfg ( cfg = { @constructor.C.defaults.dbay_create_insert_cfg..., cfg..., } )
      { L, I, V, }  = @sql
      R             = []
      R.push "insert into #{I cfg.schema}.#{I cfg.table}"
      return R.join ' '

    #---------------------------------------------------------------------------------------------------------
    _get_fields: ( schema, name ) ->
      # @types.validate.dbay_fields_of_cfg ( cfg = { @constructor.C.defaults.dbay_fields_of_cfg..., cfg..., } )
      { name, schema, } = cfg
      schema_i          = @sql.I schema
      R                 = {}
      for d from @query SQL"select * from #{schema_i}.pragma_table_info( $name );", { name, }
        # { cid: 0, name: 'id', type: 'integer', notnull: 1, dflt_value: null, pk: 1 }
        type = if d.type is '' then null else d.type
        R[ d.name ] = {
          idx:      d.cid
          type:     type
          name:     d.name
          optional: !d.notnull
          default:  d.dflt_value
          is_pk:    !!d.pk }
      return R

  return Sqlgen

#-----------------------------------------------------------------------------------------------------------
@[ "_DBAY Sqlgen demo" ] = ( T, done ) ->
  # T?.halt_on_error()
  # { DBay }          = require H.dbay_path
  # db                = new DBay()
  Sqlgen            = get_Sqlgen()
  db                = new Sqlgen()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  db ->
    db SQL"""
      create table cities (
        id      integer not null primary key,
        name    text    not null,
        country text    not null )
      """
    debug '^334^', db.create_insert { schema, table: 'cities', }
    echo dtab._tabulate db SQL"select type, name from sqlite_schema;"
    echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( $name );", { name: 'cities', }
    debug '^33443^', db._get_fields { schema, name: 'cities', }
    echo dtab._tabulate ( row for _, row of db._get_fields { schema, name: 'cities', } )
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  @[ "_DBAY Sqlgen demo" ]()







