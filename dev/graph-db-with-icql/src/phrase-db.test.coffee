
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
insert_kanji_phrases = ( gdb ) ->
  gdb.dba.execute SQL"""insert into predicates ( p, is_transitive ) values ( 'isa',       false );"""
  gdb.dba.execute SQL"""insert into predicates ( p, is_transitive ) values ( 'contains',  true );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '或', 'isa', 'glyph' );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '口', 'isa', 'glyph' );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '或', 'contains', '口' );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '或', 'contains', '戈' );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '國', 'contains', '或' );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '口', 'contains', '丨' );"""
  gdb.dba.execute SQL"""insert into phrases ( s, p, o ) values ( '口', 'contains', '一' );"""
  return null

#-----------------------------------------------------------------------------------------------------------
show_predicates_table = ( gdb ) ->
  console.table gdb.dba.list gdb.dba.query SQL"""select * from predicates;"""

#-----------------------------------------------------------------------------------------------------------
show_phrases_table = ( gdb ) ->
  console.table gdb.dba.list gdb.dba.query SQL"""select * from phrases;"""

#-----------------------------------------------------------------------------------------------------------
show_phrase = ( gdb, row ) ->
  if row.s?
    info '^982^', "#{row.s} #{row.p} #{row.o}"
  else if row.s2?
    info '^982^', "#{row.s1} #{row.p1} #{row.o1}, which #{row.p2} #{row.o2}"
  else
    info '^982^', "#{row.s1} #{row.p1} #{row.o1}"
  return null

#-----------------------------------------------------------------------------------------------------------
show_phrases_with_first_derivatives = ( gdb ) ->
  for d from gdb.dba.query SQL"""
    select distinct
        p1.s as s1,
        p1.p as p1,
        p1.o as o1,
        p2.s as s2,
        p2.p as p2,
        p2.o as o2
      from phrases as p1
      left join phrases as p2 on ( p1.o = p2.s );"""
    # debug '^767^', d
    show_phrase gdb, d
  return null

#-----------------------------------------------------------------------------------------------------------
copy_derivatives_to_phrases = ( gdb ) ->
  ### NOTE `where true` clause b/c of [parsing ambiguity](https://sqlite.org/lang_upsert.html) ###
  { changes, } = gdb.dba.run SQL"""
    insert into phrases as p1 ( s, p, o, a )
      /* ( */ select distinct s, p, o, a from derivatives as ir where true /* ) */
      on conflict do nothing;"""
  return changes

#-----------------------------------------------------------------------------------------------------------
derive_phrases = ( gdb ) ->
  gdb.dba.execute SQL"""delete from derivatives;"""
  { changes, } = gdb.dba.run SQL"""
    insert into derivatives as ir ( s, p, o, a )
      select distinct
          p1.s as s,
          p2.p as p,
          p2.o as o,
          p2.a as a
        from phrases    as p1
        join predicates as pr on ( ( p1.p = pr.p ) and pr.is_transitive )
        join phrases    as p2 on ( ( p1.p = p2.p ) and ( p1.o = p2.s ) )
        -- returning *;"""
  return changes


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: phrase DB" ] = ( T, done ) ->
  T.halt_on_error()
  { Graphdb }   = require './graph-db'
  # path          = '/tmp/icql-graph.db'
  schema        = 'main'
  gdb           = new Graphdb { schema, ram: true, }
  #.........................................................................................................
  insert_kanji_phrases  gdb
  whisper '-'.repeat 108; show_phrase gdb, d for d from gdb.dba.query SQL"""select * from phrases;"""
  whisper '-'.repeat 108; show_phrases_with_first_derivatives gdb
  show_predicates_table gdb
  #.........................................................................................................
  lap_count     = 0
  loop
    whisper '-'.repeat 108
    show_phrases_table gdb
    #.......................................................................................................
    lap_count++
    prv_row_count     = gdb.dba.first_value gdb.dba.query SQL"""select count(*) from phrases;"""
    derivative_count  = derive_phrases gdb
    new_phrase_count  = copy_derivatives_to_phrases gdb
    info '^587^', { prv_row_count, derivative_count, new_phrase_count, }
    break if new_phrase_count is 0
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  test @[ "Graphdb: phrase DB" ]
