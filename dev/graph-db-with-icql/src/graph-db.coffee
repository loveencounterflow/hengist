

#===========================================================================================================
class Graphdb

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    # super()
    return undefined

  #=========================================================================================================
  # SCHEMA
  #---------------------------------------------------------------------------------------------------------
  create_schema: () ->
    ### TAINT edges are modelled as uniquely given by `( node_id_a, node_id_b )` with arbitrary data
    attached, but could conceivably link two given nodes with any number of edges ###
    sql = SQL"""
      create table if not exists nodes (
          body json,
          id   text generated always as ( json_extract( body, '$.id' ) ) virtual not null unique
        );
      -- ...................................................................................................
      create table if not exists edges (
          source     text,
          target     text,
          properties json,
        foreign key( source ) references nodes( id ),
        foreign key( target ) references nodes( id )
        );
      -- ...................................................................................................
      create index if not exists id_idx on nodes(id);
      create index if not exists source_idx on edges(source);
      create index if not exists target_idx on edges(target);"""


  #=========================================================================================================
  # INSERT, UPDATE, DELETE
  #---------------------------------------------------------------------------------------------------------
  delete_edge: ( a, b ) ->
    sql = SQL"delete from edges where source = $a or target = $b"

  #---------------------------------------------------------------------------------------------------------
  delete_node: ( id ) ->
    sql = SQL"delete from nodes where id = $id"

  #---------------------------------------------------------------------------------------------------------
  insert_edge: ( source, target, properties ) ->
    sql = SQL"insert into edges ( source, target, properties ) values ( ?, ?, ? )"
    [ source, target, jr properties, ]

  #---------------------------------------------------------------------------------------------------------
  insert_node: ( body ) ->
    sql = SQL"insert into nodes ( body ) values ( ? )"
    [ jr body, ]

  #---------------------------------------------------------------------------------------------------------
  update_node: () ->
    sql = SQL"update nodes set body = json(?) where id = ?"

  #=========================================================================================================
  search_edges_inbound: () ->
    sql = SQL"select * from edges where source = ?"

  #---------------------------------------------------------------------------------------------------------
  search_edges_outbound: () ->
    sql = SQL"select * from edges where target = ?"


  #=========================================================================================================
  # SEARCH
  #---------------------------------------------------------------------------------------------------------
  search_edges: () ->
    sql = SQL"""
      select * from edges where source = ?
      union
      select * from edges where target = ?"""

  #---------------------------------------------------------------------------------------------------------
  search_node_by_id: () ->
    ### TAINT instead of 'json_extract(body, '$.id')', use virtual field(?) ###
    sql = SQL"select body from nodes where json_extract(body, '$.id') = ?"

  #---------------------------------------------------------------------------------------------------------
  search_node: () ->
    sql = SQL"select body from nodes where"


  #=========================================================================================================
  # TRAVERSE
  #---------------------------------------------------------------------------------------------------------
  traverse_inbound: () ->
    sql = SQL"""
      with recursive traverse(id) as (
        select ?
        union
        select source from edges join traverse on target = id
      ) select id from traverse;"""

  #---------------------------------------------------------------------------------------------------------
  traverse_outbound: () ->
    sql = SQL"""
      with recursive traverse(id) as (
        select ?
        union
        select target from edges join traverse on source = id
      ) select id from traverse;"""

  #---------------------------------------------------------------------------------------------------------
  traverse: () ->
    sql = SQL"""
      with recursive traverse(id) as (
        select ?
        union
        select source from edges join traverse on target = id
        union
        select target from edges join traverse on source = id
      ) select id from traverse;"""

  #---------------------------------------------------------------------------------------------------------
  traverse_with_bodies_inbound: () ->
      sql = SQL"""
      with recursive traverse(x, y, obj) as (
        select ?, ?, ?
        union
        select id, '()', body from nodes join traverse on id = x
        union
        select source, '<-', properties from edges join traverse on target = x
      ) select x, y, obj from traverse;"""

  #---------------------------------------------------------------------------------------------------------
  traverse_with_bodies_outbound: () ->
    sql = SQL"""
      with recursive traverse(x, y, obj) as (
        select ?, ?, ?
        union
        select id, '()', body from nodes join traverse on id = x
        union
        select target, '->', properties from edges join traverse on source = x
      ) select x, y, obj from traverse;"""

  #---------------------------------------------------------------------------------------------------------
  traverse_with_bodies: () ->
    sql = SQL"""
      with recursive traverse(x, y, obj) as (
        select ?, ?, ?
        union
        select id, '()', body from nodes join traverse on id = x
        union
        select source, '<-', properties from edges join traverse on target = x
        union
        select target, '->', properties from edges join traverse on source = x
      ) select x, y, obj from traverse;"""


