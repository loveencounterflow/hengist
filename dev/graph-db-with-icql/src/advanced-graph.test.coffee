
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
PATH                      = require 'path'
H                         = require './test-helpers'


#-----------------------------------------------------------------------------------------------------------
insert_formulas_and_components = ( gdb ) ->
  #.........................................................................................................
  glyphs_from_formula = ( formula ) -> Array.from formula
  walk_glyphs_from_formula = ( formula ) -> yield from glyphs_from_formula
  cfg =
    columns:  [ 'glyph', ]
    rows:     walk_glyphs_from_formula
  gdb.dba.sqlt.table 'glyphs_from_formula', cfg
  #.........................................................................................................
  gdb.dba.function 'echo', { deterministic: true, varargs: false, }, ( x ) ->
    urge CND.reverse '^344^', x
    return x
  #.........................................................................................................
  gdb.dba.function 'insert_glyph', { deterministic: true, varargs: false, }, ( glyph ) ->
    urge CND.reverse '^344^ inserting', glyph
    gdb.dba.run SQL"""
      insert into nodes ( body ) values ( '{ "id": "' ? '", "type": "glyph" }' )
        on conflict ( id ) do nothing;
        """, [ glyph, ]
    return null
  # #.........................................................................................................
  # sql = SQL"""
  #   create trigger insert_nodes_from_edge_source before insert on edges
  #     when not exists ( select 1 from nodes where id = new.source )
  #     begin
  #       select echo( '^562^ auto-inserting ' || new.source );
  #       insert into nodes ( body ) values ( '{ "id": "' || new.source || '" }' );
  #       end;"""
  # gdb.dba.execute sql
  # #.........................................................................................................
  # sql = SQL"""
  #   create trigger insert_nodes_from_edge_target before insert on edges
  #     when not exists ( select 1 from nodes where id = new.target )
  #     begin
  #       select echo( '^562^ auto-inserting ' || new.target );
  #       insert into nodes ( body ) values ( '{ "id": "' || new.target || '" }' );
  #       end;"""
  # gdb.dba.execute sql
  #.........................................................................................................
  registry          = {}
  registry[ '來' ]  = '{來|⿻木从}'
  registry[ '木' ]  = '{木|⿻十人}'
  registry[ '十' ]  = '{十|⿻一丨}'
  registry[ '人' ]  = '{人|⿰丿㇏}'
  # # registry[ '丶' ]  = '{丶|●}'
  # registry[ '弓' ]  = '{弓|⿱&jzr#xe139;㇉}'
  # registry[ '' ]  = '{|⿱𠃌一}'
  # registry[ '从' ]  = '{从|⿰人人}'
  # registry[ '幺' ]  = '{幺|⿰&jzr#xe10e;丶}'
  # registry[ '&jzr#xe10e;' ]  = '{&jzr#xe10e;|⿱𠃋𠃋}'
  # registry[ '𢆰' ]  = '{𢆰|⿱一幺}'
  # registry[ '𤣥' ]  = '{𤣥|⿱亠&jzr#xe10e;}'
  # registry[ '亠' ]  = '{亠|⿱丶一}'
  # registry[ '玄' ]  = '{玄|⿱亠幺|⿱丶𢆰|⿰𤣥丶}'
  # registry[ '㭹' ]  = '{㭹|⿰杛玄|⿰木弦}'
  # registry[ '杛' ]  = '{杛|⿰木弓}'
  # registry[ '弦' ]  = '{弦|⿰弓玄}'
  #.........................................................................................................
  for glyph, cformula of registry
    formulas = ( ( cformula.replace /[{}]/g, '' ).split '|' )[ 1 .. ]
    gdb.upsert_node { id: glyph, type: 'glyph', }
    for formula in formulas
      gdb.upsert_node { id: formula, type: 'formula', }
      gdb.insert_edge glyph, formula, { type: 'has_formula', }
      debug '^338^', glyphs_from_formula formula
      for component in glyphs_from_formula formula
        debug '^339^', { id: component, type: 'glyph', }
        gdb.upsert_node { id: component, type: 'glyph', }
        # gdb.insert_edge glyph, component, { type: 'has_component', }
  # debug '^334^', row for row from gdb.dba.query SQL"select * from glyphs_from_formula( '弦|⿰弓玄' );"
  # sql = SQL"""
  #   insert into edges ( source, target, properties )
  #     select
  #         insert_glyph( n.id )        as source,
  #         insert_glyph( g.glyph )     as target,
  #         '{ "type": "has_glyph" }'   as properties
  #       from
  #         nodes                       as n,
  #         glyphs_from_formula( n.id ) as g
  #       where json_extract( body, '$.type' ) is 'formula';"""
  # gdb.dba.execute sql
    # info '^8751^', row
    # for component in Array.from row.id
    #   gdb.upsert_node { id: component, type: 'glyph', }
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: deleting edges and nodes" ] = ( T, done ) ->
  # T.halt_on_error()
  { Graphdb } = require './graph-db'
  # path        = '/tmp/icql-graph.db'
  schema      = 'main'
  #.........................................................................................................
  do =>
    gdb         = new Graphdb { schema, ram: true, }
    H.insert_kanji_edges gdb
    info '^984^', H.get_node_ids gdb
    info '^984^', H.get_edge_ids gdb
    T.eq ( H.get_node_ids gdb ), [ '口', '國', '域', '或' ]
    T.eq ( H.get_edge_ids gdb ), [ [ '口', '或' ], [ '國', '或' ], [ '或', '口' ], [ '或', '國' ], [ '或', '域' ] ]
    H.show_graph gdb
    gdb.delete_edges '或', '國'
    H.show_graph gdb
    T.eq ( H.get_node_ids gdb ), [ '口', '國', '域', '或' ]
    T.eq ( H.get_edge_ids gdb ), [ [ '口', '或' ], [ '國', '或' ], [ '或', '口' ], [ '或', '域' ] ]
  #.........................................................................................................
  do =>
    gdb         = new Graphdb { schema, ram: true, }
    H.insert_kanji_edges gdb
    gdb.delete_edges '或'
    H.show_graph gdb
  # T.eq H.get_edge_ids(), [ [ '或', '國' ], [ '國', '或' ] ]
    # d = JSON.parse edge.properties
    # urge '^3343^', d.a, d.type, d.b
  # T.eq edge_count, 27
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: xxx" ] = ( T, done ) ->
  # T.halt_on_error()
  { Graphdb } = require './graph-db'
  # path        = '/tmp/icql-graph.db'
  schema      = 'main'
  #.........................................................................................................
  do =>
    gdb         = new Graphdb { schema, ram: true, }
    insert_formulas_and_components gdb
    H.show_graph gdb
  #.........................................................................................................
  done?()


############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  @[ "Graphdb: xxx" ]()
  # test @[ "Graphdb: deleting edges and nodes" ]
  # test @[ "Graphdb: insert_node()" ]
  # test @[ "Graphdb: insert_edge()" ]
  # @[ "Graphdb: insert_node()" ]()
  # test @[ "Graphdb: bfsvtab" ]
