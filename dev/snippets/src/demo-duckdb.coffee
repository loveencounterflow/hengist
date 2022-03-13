
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DUCKDB/DEMO'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
TIME                      = 0
#-----------------------------------------------------------------------------------------------------------
time = ( label, f ) ->
  t0    = Date.now()
  console.time label
  R     = f()
  console.timeEnd label
  TIME  = ( Date.now() - t0 ) / 1000
  return R

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_duckdb = ( cfg ) ->
  # { DBay }        = require '../../../apps/dbay'
  # { Mrg }         = require '../../../apps/dbay-mirage'
  # db              = new DBay()
  # mrg             = new Mrg { db, }
  # db.create_stdlib()
  # dsk       = 'twcm'
  # path      = 'dbay-rustybuzz/template-with-content-markers.html'
  # path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  { Database } = require 'duckdb'
  debug '^352^', new Database ':memory:'
  return null


############################################################################################################
if module is require.main then do =>
  @demo_duckdb()


