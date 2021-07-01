
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
# test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
# on_process_exit           = require 'exit-hook'
# sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
{ SQL, I, L, X, }         = new ( require '../../../apps/icql-dba/lib/sql' ).Sql
jr                        = JSON.stringify
PATH                      = require 'path'
FS                        = require 'fs'



#-----------------------------------------------------------------------------------------------------------
@insert_arithmetic_edges = ( gdb, nr_max ) ->
  for nr in [ 1 .. nr_max ]
    gdb.insert_node { id: "node#{nr}", nr, text: "<#{nr}>", }
  for nr_1 in [ 1 .. nr_max ]
    for nr_2 in [ 1 .. nr_max ]
      id_1 = "node#{nr_1}"
      id_2 = "node#{nr_2}"
      if ( nr_1 isnt 1 ) and ( nr_1 isnt nr_2 ) and ( ( value = nr_2 / nr_1 ) is ( nr_2 // nr_1 ) )
        gdb.insert_edge id_1, id_2, { type: 'is_divider_of', a: nr_1, b: nr_2, value, }
      # if ( nr_2 isnt 1 ) and ( nr_1 isnt nr_2 ) and ( ( value = nr_1 / nr_2 ) is ( nr_1 // nr_2 ) )
        gdb.insert_edge id_2, id_1, { type: 'is_divided_by', a: nr_2, b: nr_1, value, }
  return null

#-----------------------------------------------------------------------------------------------------------
@insert_kanji_edges = ( gdb ) ->
  gdb.insert_node { id: '或', }
  gdb.insert_node { id: '國', }
  gdb.insert_node { id: '口', }
  gdb.insert_node { id: '域', }
  gdb.insert_edge '口', '或', 'is_part_of'
  gdb.insert_edge '或', '口', 'contains'
  gdb.insert_edge '或', '域', 'is_part_of'
  gdb.insert_edge '或', '國', 'is_part_of'
  gdb.insert_edge '國', '或', 'contains'
  return null

#-----------------------------------------------------------------------------------------------------------
@show_graph = ( gdb ) ->
  whisper '-'.repeat 108
  for node from gdb.dba.query SQL"select * from nodes order by id;"
    urge '^3343^', node
  edge_count = 0
  for edge from gdb.dba.query SQL"select * from edges order by source, target;"
    edge_count++
    urge '^3343^', edge
  return null

#-----------------------------------------------------------------------------------------------------------
@get_node_ids = ( gdb ) -> ( d.id for d from gdb.dba.query SQL"select id from nodes order by id;" )
@get_edge_ids = ( gdb ) -> ( [ d.source, d.target, ] for d from gdb.dba.list gdb.dba.query SQL"select source, target from edges order by source, target;")

#-----------------------------------------------------------------------------------------------------------
@reinitialize_db = ( gdb ) ->
  ### TAINT implement `clear-schema()` ###
  gdb.dba.pragma SQL"foreign_keys = off;"
  gdb.dba.execute SQL"drop index if exists id_idx"
  gdb.dba.execute SQL"drop index if exists source_idx"
  gdb.dba.execute SQL"drop index if exists phrase_ref_hollerith_index"
  # gdb.dba.execute SQL"drop index if exists sqlite_autoindex_nodes_1"
  gdb.dba.execute SQL"drop index if exists target_idx"
  gdb.dba.execute SQL"drop table if exists edges"
  gdb.dba.execute SQL"drop table if exists nodes"
  gdb.dba.execute SQL"drop table if exists edges_g;"
  gdb.dba.pragma SQL"foreign_keys = on;"
  gdb.init_db()
  return null

#-----------------------------------------------------------------------------------------------------------
@try_to_remove_file = ( path ) ->
  try FS.unlinkSync path catch error
    return if error.code is 'ENOENT'
    throw error
  return null
