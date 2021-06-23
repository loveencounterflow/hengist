
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
jp                        = JSON.parse
PATH                      = require 'path'
H                         = require './test-helpers'


#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: create" ] = ( T, done ) ->
  # T.halt_on_error()
  { Graphdb } = require './graph-db'
  path        = '/tmp/icql-graph.db'
  schema      = 'main'
  gdb         = new Graphdb { ram: true, schema, }
  #.........................................................................................................
  T.eq ( d.name for d from gdb.dba.walk_objects { schema, } ).sort(), [ 'edges', 'id_idx', 'nodes', 'source_idx', 'sqlite_autoindex_edges_1', 'sqlite_autoindex_nodes_1', 'target_idx' ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: insert_node()" ] = ( T, done ) ->
  # T.halt_on_error()
  { Graphdb } = require './graph-db'
  path        = '/tmp/icql-graph.db'
  schema      = 'main'
  gdb         = new Graphdb { ram: true, schema, }
  #.........................................................................................................
  # gdb.dba.run SQL"insert into nodes ( body ) values ( ? )", [ ( jr { id: '123', } ), ]
  for nr in [ 1 .. 10 ]
    gdb.insert_node { id: "node#{nr}", nr, text: "<#{nr}>", }
  result = gdb.dba.list gdb.dba.query SQL"select * from #{I schema}.nodes order by id;"
  result = ( [ d.id, ( jp d.body ).text, ] for d from result )
  urge result
  T.eq result, [ [ 'node1', '<1>' ], [ 'node10', '<10>' ], [ 'node2', '<2>' ], [ 'node3', '<3>' ], [ 'node4', '<4>' ], [ 'node5', '<5>' ], [ 'node6', '<6>' ], [ 'node7', '<7>' ], [ 'node8', '<8>' ], [ 'node9', '<9>' ] ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: insert_edge()" ] = ( T, done ) ->
  # T.halt_on_error()
  { Graphdb } = require './graph-db'
  # path        = '/tmp/icql-graph.db'
  schema      = 'main'
  gdb         = new Graphdb { schema, ram: true, }
  nr_max      = 20
  #.........................................................................................................
  # gdb.dba.run SQL"insert into nodes ( body ) values ( ? )", [ ( jr { id: '123', } ), ]
  H.insert_arithmetic_edges gdb, nr_max
  urge '^3343^', node for node from gdb.dba.query SQL"select * from nodes order by id;"
  edge_count = 0
  for edge from gdb.dba.query SQL"select * from edges order by source, target;"
    edge_count++
    d = jp edge.properties
    urge '^3343^', d.a, d.type, d.b
  T.eq edge_count, 54
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: {update, upsert, upmerge} {node, edge} atrs" ] = ( T, done ) ->
  # T.halt_on_error()
  { Graphdb }   = require './graph-db'
  # path          = '/tmp/icql-graph.db'
  schema        = 'main'
  gdb           = new Graphdb { schema, ram: true, }
  nr_max        = 20
  get_node_atr  = ( id ) -> jp gdb.dba.first_value gdb.dba.query SQL"select * from nodes where id = ?;", [ id, ]
  get_edge      = ( s, t ) -> gdb.dba.first_row gdb.dba.query SQL"select * from edges where source = ? and target = ?;", [ s, t, ]
  get_edge_atr  = ( s, t ) -> jp ( get_edge s, t ).properties
  show_nodes    = -> urge '^44554^', gdb.dba.list gdb.dba.query SQL"select * from nodes;"
  show_edges    = -> urge '^44554^', gdb.dba.list gdb.dba.query SQL"select * from edges;"
  #.........................................................................................................
  gdb.insert_node { id: '1', en: 'one', zh: '一', };  show_nodes(); T.eq ( get_node_atr '1' ), { id: '1', en: 'one', zh: '一', }
  gdb.upsert_node { id: '1', fr: 'un', };             show_nodes(); T.eq ( get_node_atr '1' ), { id: '1', fr: 'un', }
  gdb.upmerge_node { id: '1', de: 'eins', };          show_nodes(); T.eq ( get_node_atr '1' ), { id: '1', de: 'eins', fr: 'un', }
  #.........................................................................................................
  gdb.insert_node { id: '2', en: 'two', zh: '二', };  show_nodes(); T.eq ( get_node_atr '2' ), { id: '2', en: 'two', zh: '二', }
  gdb.update_node { id: '2', fr: 'deux', };           show_nodes(); T.eq ( get_node_atr '2' ), { id: '2', fr: 'deux', }
  gdb.upmerge_node { id: '2', de: 'zwei', };          show_nodes(); T.eq ( get_node_atr '2' ), { id: '2', de: 'zwei', fr: 'deux', }
  #.........................................................................................................
  gdb.upsert_node { id: '3', fr: 'trois', };          show_nodes(); T.eq ( get_node_atr '3' ), { id: '3', fr: 'trois', }
  #.........................................................................................................
  gdb.insert_edge '1', '3', { d: '13', };  show_edges(); T.eq ( get_edge_atr '1', '3' ), { d: '13', }
  gdb.update_edge '1', '3', { e: '13', };  show_edges(); T.eq ( get_edge_atr '1', '3' ), { e: '13', }
  gdb.upsert_edge '1', '2', { e: '12', };  show_edges(); T.eq ( get_edge_atr '1', '2' ), { e: '12', }
  gdb.upmerge_edge '1', '2', { d: '12', }; show_edges(); T.eq ( get_edge_atr '1', '2' ), { e: '12', d: '12', }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "___ Graphdb: bfsvtab" ] = ( T, done ) ->
  ### https://github.com/abetlen/sqlite3-bfsvtab-ext ###
  # T.halt_on_error()
  { Graphdb } = require './graph-db'
  path        = '/tmp/icql-graph.db'
  schema      = 'main'
  gdb         = new Graphdb { path, schema, }
  nr_max      = 20
  #.........................................................................................................
  H.reinitialize_db gdb
  #.........................................................................................................
  gdb.dba.load_extension PATH.resolve PATH.join __dirname, '../bfsvtab.so'
  H.insert_arithmetic_edges gdb, nr_max
  gdb.dba.execute SQL"create table edges_g ( source integer, target integer );"
  edges = [ ( gdb.dba.query SQL"select * from edges;" )..., ]
  for edge from edges
    debug '^197^', edge
    source = parseInt ( edge.source.replace 'node', '' ), 10
    target = parseInt ( edge.target.replace 'node', '' ), 10
    gdb.dba.run SQL"insert into edges_g ( source, target ) values ( ?, ? );", [ source, target, ]
  debug '^509^', edge for edge from gdb.dba.query SQL"select * from edges_g order by source, target;"
  #.........................................................................................................
  sql = SQL"""
    select
        -- b.root            as source,
        -- b.id              as target,
        n2.body           as source_node,
        b.distance        as distance,
        b.shortest_path   as shortest_path,
        -- b.parent          as parent,
        n1.body           as target_node
      from bfsvtab as b
      left join nodes as n1 on ( n1.id = 'node' || b.id )
      left join nodes as n2 on ( n2.id = 'node' || b.root )
      where true
        and tablename  = 'edges_g'
        and fromcolumn = 'source'
        and tocolumn   = 'target'
        and root       = ?
        -- and id         = 4;
      order by distance
    """
  for source in [ 1 .. 20 ]
    whisper '^665^', '-'.repeat 108
    for row from gdb.dba.query sql, [ source, ]
      row.source_node = jp row.source_node
      row.target_node = jp row.target_node
      info '^665^', "#{row.source_node.text} #{row.shortest_path} #{row.target_node.text}"
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }
  # test @[ "Graphdb: {update, upsert, upmerge} {node, edge} atrs" ]
  # test @[ "Graphdb: deleting edges and nodes" ]
  # test @[ "Graphdb: insert_node()" ]
  # test @[ "Graphdb: insert_edge()" ]
  # @[ "Graphdb: insert_node()" ]()
  # test @[ "Graphdb: bfsvtab" ]
