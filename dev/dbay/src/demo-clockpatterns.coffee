
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
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
{ raw }                   = String


#-----------------------------------------------------------------------------------------------------------
tabulate = ( db, query ) -> H.tabulate query, db query


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_clockpatterns = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { SQL }         = DBay
  path            = '/tmp/clockpatterns.sqlite'
  db              = new DBay { path, }
  functions       = {}
  nbool           = ( bool ) ->
    return switch bool
      when true then 1
      when false then 0
      else throw new Error "^345^ expected a boolean, got a #{type_of bool}"
  db.create_stdlib()
  #---------------------------------------------------------------------------------------------------------
  db ->
    #.......................................................................................................
    db.create_function
      name:     'digits_from_time'
      call:     ( time ) -> JSON.stringify ( parseInt d, 10 for d in time when d isnt ':' )
    db.create_function
      name:     'call'
      call:     ( name, time, digits ) -> functions[ name ] time, ( JSON.parse digits )...
    #.......................................................................................................
    db SQL"""
      drop table if exists times;
      create table times (
        nr      integer not null primary key,
        time    text not null unique,
        digits  json not null generated always as ( digits_from_time( time ) ) virtual,
        check ( std_re_is_match( time, '^([01][0-9]|2[0-3]):[0-5][0-9]$' ) ) );"""
    #.......................................................................................................
    db SQL"""
      drop table if exists patterns;
        create table patterns (
        nr      integer not null primary key,
        name    text not null unique,
        pattern text unique,
        kind    text not null,
        check ( length( pattern ) > 0 ),
        check ( kind in ( 're', 'fn' ) ) );"""
    # insert_time.run { time: '24:30', }
    # insert_time.run { time: '25:10', }
  #---------------------------------------------------------------------------------------------------------
  db ->
    insert_time = db.prepare_insert { into: 'times', exclude: [ 'nr', ], returning: '*', }
    for hour in [ 0 .. 23 ]
      hour_str = hour.toString().padStart 2, '0'
      for minute in [ 0 .. 59 ]
        time = hour_str + ':' + minute.toString().padStart 2, '0'
        insert_time.run { time, }
  #---------------------------------------------------------------------------------------------------------
  db ->
    functions.asc     = ( time, d1, d2, d3, d4 ) -> nbool d1 < d2 < d3 < d4
    functions.inc4    = ( time, d1, d2, d3, d4 ) -> nbool d1 is d2 - 1 is d3 - 2 is d4 - 3
    functions.dec4    = ( time, d1, d2, d3, d4 ) -> nbool d1 is d2 + 1 is d3 + 2 is d4 + 3
    functions.dec3a   = ( time, d1, d2, d3, d4 ) -> nbool d1 is d2 + 1 is d3 + 2
    functions.dec3b   = ( time, d1, d2, d3, d4 ) -> nbool d2 is d3 + 1 is d4 + 2
    functions.inc3a   = ( time, d1, d2, d3, d4 ) -> nbool d1 is d2 - 1 is d3 - 2
    functions.inc3b   = ( time, d1, d2, d3, d4 ) -> nbool d2 is d3 - 1 is d4 - 2
    # functions.hism = ( time, d1, d2, d3, d4 ) -> nbool ( d1 is d2 - 1 is d3 - 2 ) or ( d2 is d3 - 1 is d4 - 2 )
    insert_pattern = db.prepare_insert { into: 'patterns', exclude: [ 'nr', ], returning: '*', }
    insert_pattern.run { kind: 're', name: 'all4', pattern: raw'(?<d>\d)\k<d>:\k<d>\k<d>', }
    insert_pattern.run { kind: 're', name: 'hism', pattern: raw'(?<dd>\d\d):\k<dd>', }
    # insert_pattern.run { kind: 'fn', pattern: 'asc',    }
    insert_pattern.run { kind: 'fn', name: 'inc4', pattern: null, }
    insert_pattern.run { kind: 'fn', name: 'dec4', pattern: null, }
    insert_pattern.run { kind: 'fn', name: 'dec3a', pattern: null, }
    insert_pattern.run { kind: 'fn', name: 'dec3b', pattern: null, }
    insert_pattern.run { kind: 'fn', name: 'inc3a', pattern: null, }
    insert_pattern.run { kind: 'fn', name: 'inc3b', pattern: null, }
  #.........................................................................................................
  tabulate db, SQL"select * from times limit 25 offset 123;"
  tabulate db, SQL"select * from patterns order by kind, name;"
  tabulate db, SQL"""
    -- with v1 as ( select * from times where time between '11:00' and '11:59' )
    with
      v1 as ( select * from times where time between '00:00' and '23:59' ),
      v2 as ( select count(*) as count from v1 )
    select
        row_number() over ( order by v1.time, p.nr )        as match_nr,
        v1.nr                                               as time_nr,
        p.nr                                                as pattern_nr,
        p.kind                                              as kind,
        p.name                                              as name,
        v2.count                                            as count,
        v1.digits                                           as digits,
        v1.time                                             as time
      from v1, v2, patterns as p
      where case p.kind
        when 're' then std_re_is_match( v1.time, pattern )
        when 'fn' then call( p.name, time, digits )
        else std_raise( 'unknown kind ' || quote( p.kind ) ) end
        ;"""
  return null

############################################################################################################
if require.main is module then do =>
  @demo_clockpatterns()




