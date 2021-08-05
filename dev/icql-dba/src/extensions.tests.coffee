

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
{ to_width }              = require 'to-width'
SQL                       = String.raw



#-----------------------------------------------------------------------------------------------------------
@[ "load_extension" ] = ( T, done ) ->
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  #---------------------------------------------------------------------------------------------------------
  do =>
    dba     = new Dba()
    cfg     = H.get_cfg()
    # dba.load_extension PATH.resolve PATH.join '/home/flow/jzr/hengist/dev/in-memory-sql/json1.so'
    # # dba.load_extension PATH.resolve PATH.join '/home/flow/3rd-party-repos/sqlite/ext/fts5/fts5'
    #.......................................................................................................
    info '^334-1^', dba.list dba.query """select json(' { "this" : "is", "a": [ "test" ] } ') as d;"""
    info '^334-1^', dba.list dba.query """select json_array(1,2,'3',4) as d;"""
    return null
  #---------------------------------------------------------------------------------------------------------
  done()
  return null


#-----------------------------------------------------------------------------------------------------------
@[ "DBA: sqlean vsv extension" ] = ( T, done ) ->
  ### see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md ###
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  dba               = new Dba()
  extension_path    = PATH.resolve PATH.join __dirname, '../../../assets/sqlite-extensions/vsv.so'
  csv_path          = H.get_cfg().csv.holes
  work_path         = await H.procure_file { path: csv_path, name: 'vsv-sample.csv', }
  # debug '^857^', { csv_path, work_path, }
  { I, L, V, }      = new ( require '../../../apps/icql-dba/lib/sql' ).Sql
  #.........................................................................................................
  await do =>
    dba.load_extension extension_path
    dba.run SQL"""
      create virtual table myvsv using vsv(
        filename  = #{L work_path},      -- the filename, passed to the Operating System
        -- data=STRING         -- alternative data
        -- schema=STRING       -- Alternate Schema to use
        -- columns=N           -- columns parsed from the VSV file
        -- header=BOOL         -- whether or not a header row is present
        -- skip=N              -- number of leading data rows to skip
        -- rsep=STRING         -- record separator
        -- fsep=STRING         -- field separator
        -- validatetext=BOOL   -- validate UTF-8 encoding of text fields
        -- affinity=AFFINITY   -- affinity to apply to each returned value
        nulls     = true                -- empty fields are returned as NULL
        );
      """ #, { csv_path, }
    for row from dba.query SQL"select * from myvsv;"
      info '^5554^', row
    # dba.execute SQL"insert into myvsv ( c0 ) values ( '1111' );"
  #.........................................................................................................
  done()


############################################################################################################
unless module.parent?
  # test @
  test @[ "load_extension" ]

