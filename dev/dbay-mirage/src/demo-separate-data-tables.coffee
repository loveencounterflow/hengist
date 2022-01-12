
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE/DEMO'
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
guy                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_datamill = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage/lib/main2'
  db              = new DBay()
  mrg             = new Mrg { db, }
  db.create_stdlib()
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/template-with-content-markers.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  db.setv 'allow_change_on_mirror', 1
  db mrg.sql.insert_lnpart, { dsk, lnr: 2, trk: 2, pce: 1, txt: """something""", }
  mrg.deactivate { dsk, lnr: 2, trk: 2, }
  db mrg.sql.insert_lnpart, { dsk, lnr: 2, trk: 3, pce: 1, txt: """<div>""", }
  db mrg.sql.insert_lnpart, { dsk, lnr: 2, trk: 3, pce: 2, txt: """inserted content""", }
  db mrg.sql.insert_lnpart, { dsk, lnr: 2, trk: 3, pce: 3, txt: """</div>""", }
  #.........................................................................................................
  db.setv 'dsk', dsk
  H.tabulate 'mrg_datasources', db SQL"select * from mrg_datasources;"
  H.tabulate 'mrg_mirror',      db SQL"select * from mrg_mirror order by dsk, lnr, trk, pce;"
  H.tabulate 'mrg_lines',       db SQL"select * from mrg_lines  order by dsk, lnr;"
  H.banner "lines of #{dsk}"
  urge '^474^', lnr, rpr txt for { lnr, txt, } from mrg.walk_line_rows { dsk, }
  return null



############################################################################################################
if require.main is module then do =>
  @demo_datamill()
  # @demo_html_generation()




