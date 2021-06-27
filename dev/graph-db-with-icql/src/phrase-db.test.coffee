
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
  gdb.dba.execute SQL"insert into predicates ( p, is_transitive ) values ( 'isa',       false );"
  gdb.dba.execute SQL"insert into predicates ( p, is_transitive ) values ( 'contains',  true );"
  #.........................................................................................................
  nr      = 0
  containments = [
    '或口'
    '或戈'
    '蟈虫'
    '戈弋丿'
    '弋丶'
    '蟈國'
    '國或'
    '口丨'
    '口一' ]
  #.........................................................................................................
  glyphs  = new Set()
  for containment in containments
    [ glyph, component, ] = Array.from containment
    glyphs.add glyph
    glyphs.add component
  glyphs  = Array.from glyphs
  #.........................................................................................................
  insert_phrase = SQL"""
    insert into phrases ( s, p, o, nr, ref )
      values ( ?, 'isa', 'glyph', ?, ? );"""
  #.........................................................................................................
  insert_containment = SQL"""
    insert into phrases ( s, p, o, nr, ref )
      values ( ?, 'contains', ?, ?, ? );"""
  #.........................................................................................................
  for glyph in glyphs
    nr++
    ref = jr [ nr, ]
    gdb.dba.run insert_phrase, [ glyph, nr, ref, ]
  #.........................................................................................................
  for containment in containments
    nr++
    ref = jr [ nr, ]
    [ glyph, component, ] = Array.from containment
    gdb.dba.run insert_containment, [ glyph, component, nr, ref, ]
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
show_predicates_table = ( gdb ) ->
  console.table gdb.dba.list gdb.dba.query SQL"""select * from predicates;"""

#-----------------------------------------------------------------------------------------------------------
show_phrases_table = ( gdb ) ->
  console.table gdb.dba.list gdb.dba.query SQL"""
    select s, p, o, a, nr, ref, lck from phrases
      order by s, _ref;"""

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
_get_containment_formula = ( row ) -> "#{row.s}∋#{row.o}"

#-----------------------------------------------------------------------------------------------------------
show_phrases_with_derivation = ( gdb ) ->
  for d from gdb.dba.query SQL"""select * from phrases order by s, p, _ref;"""
    continue unless d.p is 'contains'
    derivation = ''
    if ( jp d.ref ).length > 1
      derivation = d.ref.replace /[0-9]+/g, ( $0 ) =>
        nr          = jp $0
        sub_phrase  = gdb.dba.first_row gdb.dba.query SQL"select * from phrases where nr = ?;", [ nr, ]
        return _get_containment_formula sub_phrase
      derivation = derivation.replace /\[/g, '( '
      derivation = derivation.replace /\]/g, ' )'
      derivation = derivation.replace /,/g, ' ∧ '
      derivation = '⇐ ' + derivation
    info ( _get_containment_formula d ), derivation
  return null

#-----------------------------------------------------------------------------------------------------------
derive_phrases = ( gdb ) ->
  gdb.dba.execute SQL"""update phrases set lck = true;"""
  max_nr = gdb.dba.first_value gdb.dba.query SQL"select max( nr ) from phrases;"
  { changes, } = gdb.dba.run SQL"""
    insert into phrases ( s, p, o, a, nr, ref )
      select -- distinct
          p1.s                                                  as s,
          p2.p                                                  as p,
          p2.o                                                  as o,
          p2.a                                                  as a,
          -- max( p1.nr ) + 1                                      as nr,
          row_number() over () + $max_nr                        as nr,
          -- row_number() over ()                                  as nr,
          concat_refs( p1.ref, p2.ref )                         as ref
        from phrases    as p1
        join predicates as pr on ( ( p1.p = pr.p ) and pr.is_transitive )
        join phrases    as p2 on ( p2.lck and ( p1.p = p2.p ) and ( p1.o = p2.s ) )
        where p1.lck
        on conflict do nothing;
      """, { max_nr, }
  # gdb.dba.run SQL"update phrases set nr = nr + ? where not lck;", [ max_nr, ]
  return changes


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: phrase DB" ] = ( T, done ) ->
  T?.halt_on_error()
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
    show_phrases_table gdb
    #.......................................................................................................
    lap_count++
    break if lap_count > 10
    derivative_count  = derive_phrases gdb
    phrase_count      = gdb.dba.first_value gdb.dba.query SQL"""select count(*) from phrases;"""
    whisper '-'.repeat 108
    info '^587^', { lap_count, derivative_count, phrase_count, }
    break if derivative_count is 0
  #.........................................................................................................
  show_phrases_with_derivation gdb
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "Graphdb: phrase DB" ]
  @[ "Graphdb: phrase DB" ]()

