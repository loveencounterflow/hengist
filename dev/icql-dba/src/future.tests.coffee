
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/BASICS'
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
# { to_width }              = require 'to-width'



#-----------------------------------------------------------------------------------------------------------
@[ "DBA: open()" ] = ( T, done ) ->
  # T.halt_on_error()
  { Dba } = require '../../../apps/icql-dba'
  dba     = new Dba()
  schemas = {}
  #.........................................................................................................
  T.eq dba.sqlt.name,           ''
  T.eq dba.sqlt.open,           true
  T.eq dba.sqlt.inTransaction,  false
  T.eq dba.sqlt.readonly,       false
  T.eq dba.sqlt.memory,         true
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open', }
    schema            = 'dm1'
    schemas[ schema ] = { path: work_path, }
    urge '^344-1^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok H.types.isa.datamill_db_lookalike { dba, schema, }
  #.........................................................................................................
  await do =>
    ### Possible to attach same file for Continuous Peristency DB multiple times ###
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open', reuse: true, }
    schema            = 'dm2'
    schema_i          = dba.as_identifier schema
    schemas[ schema ] = { path: work_path, }
    urge '^344-1^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok H.types.isa.datamill_db_lookalike { dba, schema, }
    dba.execute "create table dm1.extra ( id integer );"
    dba.execute "insert into dm1.extra values ( 1 ), ( 2 ), ( 3 );"
    info dba.list dba.query "select * from dm1.extra order by id;"
    help ( d.name for d from ( dba.walk_objects { schema: 'dm1', } ) )
    help ( d.name for d from ( dba.walk_objects { schema: 'dm2', } ) )
    T.ok 'extra' in ( d.name for d from ( dba.walk_objects { schema: 'dm1', } ) )
    T.ok 'extra' in ( d.name for d from ( dba.walk_objects { schema: 'dm2', } ) )
    T.eq ( dba.list dba.query "select * from dm1.extra order by id;" ), [ { id: 1, }, { id: 2, }, { id: 3, }, ]
    T.eq ( dba.list dba.query "select * from dm2.extra order by id;" ), [ { id: 1, }, { id: 2, }, { id: 3, }, ]
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open', }
    schema            = 'dm1'
    # schemas[ schema ] = { path: work_path, }
    urge '^344-2^', { template_path, work_path, schema, }
    T.throws /schema 'dm1' already exists/, => dba.open { path: work_path, schema, }
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'big', ref: 'F-open', }
    schema            = 'chinook'
    schemas[ schema ] = { path: work_path, }
    urge '^344-3^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok not H.types.isa.datamill_db_lookalike { dba, schema, }
    T.ok H.types.isa.chinook_db_lookalike { dba, schema, }
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'micro', ref: 'F-open', }
    schema            = 'micro'
    schemas[ schema ] = { path: work_path, }
    urge '^344-3^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok not H.types.isa.datamill_db_lookalike { dba, schema, }
    T.ok H.types.isa.micro_db_lookalike { dba, schema, }
  #.........................................................................................................
  T.eq dba._schemas, schemas
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: open() RAM DB" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba } = require '../../../apps/icql-dba'
  dba     = new Dba()
  schemas = {}
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open-2', }
    schema            = 'ramdb'
    schemas[ schema ] = { path: work_path, }
    urge '^344-3^', { template_path, work_path, schema, ram: true, }
    dba.open { path: work_path, schema, ram: true, }
    T.ok H.types.isa.datamill_db_lookalike { dba, schema, }
    help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
    info d for d from dba.query "select * from pragma_database_list order by seq;"
    db_path           = dba.first_value dba.query "select file from pragma_database_list where name = ?;", [ schema, ]
    T.eq db_path, ''
    T.ok
    # info '^43451^', ( rpr k ), dba.sqlt[ k ] for k of dba.sqlt
  #.........................................................................................................
  info '^35345^', dba._schemas
  T.eq dba._schemas, schemas
  #.........................................................................................................
  done()


############################################################################################################
unless module.parent?
  test @
  # test @[ "DBA: open()" ]
  # test @[ "DBA: open() RAM DB" ]

