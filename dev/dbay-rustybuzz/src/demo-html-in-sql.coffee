
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/DEMO-HDML'
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
{ HDML }                  = require '../../../apps/hdml'


#-----------------------------------------------------------------------------------------------------------
banner = ( title ) -> echo CND.reverse CND.steel to_width ( ' ' + title + ' ' ), 50



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_datamill = ( cfg ) ->
  db              = new DBay { path: '/dev/shm/demo-datamill.sqlite', }
  db.create_stdlib()
  db SQL"""
    drop view  if exists tags_and_html;
    drop table if exists atrs;
    drop table if exists mirror;
    drop table if exists atrids;
    drop table if exists datasources;"""
  db SQL"""
    create table atrids ( atrid integer not null primary key );"""
  db SQL"""
    create table atrs (
        atrid integer not null references atrids,
        k     text not null,
        v     text not null,
      primary key ( atrid, k ) );"""
  db SQL"""
    create table mirror (
        dsk   text    not null references datasources,
        tid   integer not null primary key,
        sgl   text    not null,      -- sigil, one of `<`, `>`, `^`
        tag   text    not null,      -- use '$text' for text nodes
        atrid integer references atrids,
        text  text );"""
  db SQL"""
    create table datasources (
        dsk     text not null,
        url     text not null,
        digest  text default null,
      primary key ( dsk ) );"""
      # -- create table #{prefix}_datasources (
  db SQL"""
    create view tags_and_html as select distinct
        t.tid                                                     as tid,
        t.sgl                                                     as sgl,
        t.tag                                                     as tag,
        t.atrid                                                   as atrid,
        case t.tag when '$text' then t.text
        else xxx_create_tag( t.sgl, t.tag, a.k, a.v ) over w end  as xxx
      from
        mirror as t
        left join atrs as a using ( atrid )
      where true
        and ( t.dsk = std_getv( 'dsk' ) )
      window w as (
        partition by t.tid
        order by a.k
        rows between unbounded preceding and unbounded following )
      order by tid;"""
  #.........................................................................................................
  _insert_atrid       = db.prepare_insert { into: 'atrids',       returning: '*', exclude: [ 'atrid', ], }
  _insert_content     = db.prepare_insert { into: 'mirror',       returning: '*', exclude: [ 'tid', ], }
  _insert_atr         = db.prepare_insert { into: 'atrs',         returning: null, }
  _insert_datasource  = db.prepare_insert { into: 'datasources',  returning: '*', }
  #.........................................................................................................
  db.create_window_function
    name:           'xxx_array_agg'
    varargs:        false
    deterministic:  true
    start:          null
    step:           ( total, k, v ) ->
      if k?
        total      ?= {}
        total[ k ]  = v
      return total
    inverse:        ( total, dropped ) -> return null unless total?; delete total[ k ]; total
    result:         ( total ) -> return '' unless total?; JSON.stringify total
  #.........................................................................................................
  db.create_window_function
    name:           'xxx_create_tag'
    varargs:        false
    deterministic:  true
    start:          null
    step:           ( Σ, sgl, tag, k, v ) ->
      Σ            ?= { sgl, tag, atrs: {}, }
      Σ.atrs[ k ]   = v if k?
      return Σ
    inverse:        ( Σ, dropped ) -> return null unless Σ?; delete Σ.atrs[ k ]; Σ
    result:         ( Σ ) -> return '' unless Σ?; HDML.create_tag Σ.sgl, Σ.tag, Σ.atrs
  #.........................................................................................................
  _append_tag = ( dsk, sgl, tag, atrs = null, text = null ) ->
    atrid = null
    if text?
      validate.null atrs
    else if atrs?
      validate.null text
      { atrid } = db.first_row _insert_atrid
      for k, v of atrs
        v = rpr v unless isa.text v
        _insert_atr.run { atrid, k, v, }
    urge db.first_row _insert_content, { dsk, sgl, tag, atrid, text, }
    return null
  #.........................................................................................................
  dsk = 'demo'
  _insert_datasource.run { dsk, url: 'ram:', digest: null, }
  _append_tag dsk, '^', 'path', { id: 'c1', d: 'M100,100L200,200', }
  _append_tag dsk, '<', 'div', { id: 'c1', class: 'foo bar', }
  _append_tag dsk, '^', '$text', null, "helo"
  _append_tag dsk, '>', 'div'
  _append_tag dsk, '^', 'mrg:loc#baselines'
  #.........................................................................................................
  db.setv 'dsk', 'demo'
  banner "datasources";     console.table db.all_rows SQL"select * from datasources;"
  banner "mirror";          console.table db.all_rows SQL"select * from mirror;"
  banner "atrs";            console.table db.all_rows SQL"select * from atrs;"
  banner "std_variables()"; console.table db.all_rows SQL"select * from std_variables();"
  banner "tags_and_html";   console.table db.all_rows SQL"select * from tags_and_html;"
  return null



############################################################################################################
if require.main is module then do =>
  @demo_datamill()
  # @demo_html_generation()




