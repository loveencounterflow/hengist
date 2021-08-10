
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA-TAGS/TESTS'
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
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()
# { to_width }              = require 'to-width'
on_process_exit           = require 'exit-hook'
sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse
dbv_path                  = '../../../apps/icql-dba-vars'
{ lets
  freeze }                = require 'letsfreezethat'
def                       = Object.defineProperty



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@[ "getting and setting single values" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'v1', true,              ],  true, ]
    [ [ 'v2', false,             ],  false, ]
    [ [ 'v3', null,              ],  null, ]
    [ [ 'v4', 42,                ],  42, ]
    [ [ 'v5', '42',              ],  '42', ]
    [ [ 'v6', { bar: '42'},      ],  { bar: '42'}, ]
    [ [ 'v7', [ 1, 2, 108, ],    ],  [ 1, 2, 108, ], ]
    ]
  { Dbv, }    = require dbv_path
  dbv         = new Dbv()
  { dba, }    = dbv
  debug '4476^', dbv
  debug '4476^', ( k for k of dbv )
  console.table dba.list dba.query SQL"select * from v_variables;"
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ key, value, ] = probe
      dbv.set key, value
      result = dbv.get key
      resolve result
  console.table dba.list dba.query SQL"select * from v_variables;"
  #.........................................................................................................
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @[ "getting and setting multiple values" ] = ( T, done ) ->
#   T?.halt_on_error()
#   #.........................................................................................................
#   probes_and_matchers = [
#     [ [ 'v7', [ 1, 2, 108, ],    ],  [ 1, 2, 108, ], ]
#     ]
#   { Dbv, }    = require dbv_path
#   dbv         = new Dbv()
#   { dba, }    = dbv
#   debug '4476^', dbv
#   debug '4476^', ( k for k of dbv )
#   console.table dba.list dba.query SQL"select * from v_variables;"
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
#       [ key, value, ] = probe
#       dbv.set key, value
#       result = dbv.get key
#       resolve result
#   console.table dba.list dba.query SQL"select * from v_variables;"
#   console.table dba.list dba.query SQL"""
#     with v1 as ( select
#         value
#       from v_variables
#       where key = 'v7')
#     select * from v1, json_each( v1.value );"""
#   # console.table dba.list dba.query SQL"select * from v_get_many( 'v7' );"
#   #.........................................................................................................
#   done?()




############################################################################################################
if module is require.main then do =>
  # info '^3443^', JSON.parse '"helo w&#x6f;rld"'
  test @, { timeout: 10e3, }
  # test @[ "DBA: tags must be declared" ]

