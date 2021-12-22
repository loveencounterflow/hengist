
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/DEMO-MIRAGE'
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
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'
{ DBay }                  = require H.dbay_path
{ Drb }                   = require H.drb_path
# { Mrg }                   = require PATH.join H.drb_path, 'lib/_mirage'
{ width_of
  to_width }              = require 'to-width'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_mirage = ( cfg ) ->
  db              = new DBay { path: '/dev/shm/demo-mirage-1.sqlite', }
  drb             = new Drb { db, rebuild: true, }
  # mrg             = new Mrg { db, }
  dsk             = 'tmpl'
  path            = 'assets/dbay-rustybuzz/demo-typeset-sample-page.template.html'
  path            = PATH.resolve PATH.join __dirname, '../../../', path
  drb.mrg.register_dsk { dsk, path, }
  drb.mrg.refresh_datasource { dsk, }
  console.table db.all_rows SQL"select * from mrg_datasources;"
  console.table db.all_rows SQL"select * from mrg_mirror where lnr between 153 and 160 order by lnr;"
  return null


############################################################################################################
if require.main is module then do =>
  @demo_mirage()


