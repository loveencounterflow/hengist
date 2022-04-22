
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
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
TIME                      = 0
#-----------------------------------------------------------------------------------------------------------
time = ( label, f ) ->
  t0    = Date.now()
  console.time label
  R     = f()
  console.timeEnd label
  TIME  = ( Date.now() - t0 ) / 1000
  return R

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_datamill = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
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
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 2, pce: 1, txt: """something""", }
  mrg.deactivate { dsk, oln: 2, trk: 2, }
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 3, pce: 1, txt: """<div>""", }
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 3, pce: 2, txt: """inserted content""", }
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 3, pce: 3, txt: """</div>""", }
  #.........................................................................................................
  db.setv 'dsk', dsk
  H.tabulate 'mrg_datasources', db SQL"select * from mrg_datasources;"
  H.tabulate 'mrg_mirror',      db SQL"select * from mrg_mirror order by dsk, oln, trk, pce;"
  H.tabulate 'mrg_lines',       db SQL"select * from mrg_lines  order by dsk, oln;"
  H.banner "lines of #{dsk}"
  urge '^474^', oln, rpr txt for { oln, txt, } from mrg.walk_line_rows { dsk, }
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_paragraphs_etc = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
  prefix          = 'mrg'
  db              = new DBay()
  mrg             = new Mrg { db, prefix, }
  db.create_stdlib()
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/htmlish-tags.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  #.........................................................................................................
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 2, pce: 1, txt: """something""", }
  mrg.deactivate { dsk, oln: 2, trk: 2, }
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 3, pce: 1, txt: """<div>""", }
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 3, pce: 2, txt: """inserted content""", }
  db mrg.sql.insert_trk_line, { dsk, oln: 2, trk: 3, pce: 3, txt: """</div>""", }
  try
    db.setv 'allow_change_on_mirror', 1
    # mrg.deactivate { dsk, oln: 10, trk: 1, }
  finally
    db.setv 'allow_change_on_mirror', 0
  db mrg.sql.insert_trk_line, { dsk, oln: 11, trk: 2, pce: 1, txt: '', }
  db mrg.sql.insert_trk_line, { dsk, oln: 11, trk: 2, pce: 2, txt: """generated paragraph""", }
  db mrg.sql.insert_trk_line, { dsk, oln: 11, trk: 2, pce: 3, txt: '', }
  #.........................................................................................................
  H.tabulate "#{prefix}_mirror",        db SQL"select * from #{prefix}_mirror           order by dsk, oln, trk, pce;"
  # H.tabulate "#{prefix}_mirror (act)",  db SQL"select * from #{prefix}_mirror where act order by dsk, oln, trk, pce;"
  H.tabulate "#{prefix}_rwnmirror",     db SQL"select * from #{prefix}_rwnmirror;"
  H.tabulate "#{prefix}_parlnrs0",      db SQL"select * from #{prefix}_parlnrs0;"
  H.tabulate "#{prefix}_parlnrs",       db SQL"select * from #{prefix}_parlnrs;"
  H.tabulate "#{prefix}_parmirror",     db SQL"select * from #{prefix}_parmirror;"
  # H.tabulate "#{prefix}_datasources",   db SQL"select * from #{prefix}_datasources;"
  # H.tabulate "mrg.walk_line_rows()",  mrg.walk_line_rows { dsk, }
  H.tabulate "mrg.walk_par_rows()",   mrg.walk_par_rows { dsk, }
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
normalize_tokens = ( tokens ) ->
  keys = [
    '$vnr'
    '$key'
    'type'
    'prefix'
    'name'
    'id'
    'class'
    'atrs'
    'start'
    'stop'
    'text'
    '$'
    'code'      ### { $key: '^error', } ###
    # 'chvtname'  ### { $key: '^error', } ###
    # 'origin'    ### { $key: '^error', } ###
    'message'   ### { $key: '^error', } ###
    ]
  R = []
  for token in tokens
    d = {}
    d[ key ]  = ( token[ key ] ? null ) for key in keys
    # d.$key    = ( CND.reverse CND.red d.$key ) if d.$key is '^error'
    d.message = ( to_width d.message, 20 ) if d.message?
    R.push d
  return freeze R

#-----------------------------------------------------------------------------------------------------------
show_query_plan = ->
  H.tabulate "query plan", db SQL"explain query plan select * from #{prefix}_wspars;"
  rows    = []
  counts  = {}
  for row from db SQL"explain query plan select * from #{prefix}_wspars;"
    continue unless /^(SCAN (?!SUBQUERY)|SEARCH)/.test row.detail
    key =  row.detail.replace /^(\S+).*$/, '$1'
    counts[ key ] = ( counts[ key ] ? 0 ) + 1
    # continue unless /^(SCAN|SEARCH)/.test row.detail
    rows.push row
  rows.sort ( a, b ) =>
    return +1 if a.detail > b.detail
    return -1 if a.detail < b.detail
    return  0
  H.tabulate "query plan", rows
  urge '^44873^', counts
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_html_parsing = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
  prefix          = 'mrg'
  path            = PATH.join DBay.C.autolocation, 'demo-html-parsing.sqlite'
  db              = new DBay { path, recreate: true, }
  mrg             = new Mrg { db, prefix, }
  db.create_stdlib()
  # dsk       = 'demo'
  # mrg.register_dsk { dsk, url: 'live:', }
  # dsk       = 'twcm'; path = 'dbay-rustybuzz/htmlish-tags.html'
  dsk       = 'ne'; path = 'dbay-rustybuzz/no-errors.html'
  # dsk       = 'ne'; path = 'list-of-egyptian-hieroglyphs.html'
  # dsk       = 'pre'; path = 'python-regexes.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  db.setv 'dsk', dsk
  db.setv 'trk', 1
  time 'register_dsk',        => mrg.register_dsk { dsk, path, }
  time 'refresh_datasource',  => mrg.refresh_datasource { dsk, }
  time 'html.parse_dsk',      => mrg.html.parse_dsk { dsk, }
  # console.log '---------------------------------'; return null
  # time 'get_par_rows',        => mrg.get_par_rows { dsk, }
  # txt = FS.readFileSync path, { encoding: 'utf-8', }; time 'mrg.html.HTMLISH.parse', => mrg.html.HTMLISH.parse txt
  # H.tabulate "#{prefix}_raw_mirror limit 25",       db SQL"select * from #{prefix}_raw_mirror limit 25;"
  # H.tabulate "_#{prefix}_ws_linecounts limit 25",       db SQL"select * from _#{prefix}_ws_linecounts limit 25;"
  # H.tabulate "#{prefix}_paragraphs limit 25",       db SQL"select * from #{prefix}_paragraphs limit 25;"
  #.........................................................................................................
  { L, I, } = db.sql
  timings   = []
  for { name, } from db SQL"""
    with v1 as ( select row_number() over () as nr, name, type from sqlite_schema )
    select name from v1 where type in ( 'table', 'view' ) order by nr;"""
    sql   = SQL"select count(*) as count from #{I name};"
    count = time name, -> db.single_value sql
    dt    = TIME.toFixed 3
    timings.push { name, count, dt, }
  H.tabulate "timings", timings
  #.........................................................................................................
  # H.tabulate "#{prefix}_datasources",         db SQL"select * from #{prefix}_datasources;"
  # H.tabulate "std_variables()",               db SQL"select * from std_variables();"
  H.tabulate "#{prefix}_raw_mirror",          db SQL"select * from #{prefix}_raw_mirror;"
  # H.tabulate "#{prefix}_html_atrs",           db SQL"select * from #{prefix}_html_atrs;"
  H.tabulate "#{prefix}_html_tags_and_html",  db SQL"select * from #{prefix}_html_tags_and_html;"
  H.tabulate "#{prefix}_html_mirror",         db SQL"select * from #{prefix}_html_mirror;"
  H.tabulate "#{prefix}_html_tags",           db SQL"select * from #{prefix}_html_tags;"
  H.banner "render_dsk";                      echo mrg.html.render_dsk { dsk, }
  urge '^3243^', "DB file at #{db.cfg.path}"
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_recover_original_text = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
  prefix          = 'mrg'
  path            = PATH.join DBay.C.autolocation, 'demo-html-parsing.sqlite'
  db              = new DBay { path, recreate: true, }
  mrg             = new Mrg { db, prefix, }
  db.create_stdlib()
  #.........................................................................................................
  dsk             = 'lb'; path = 'dbay-rustybuzz/literal-blocks.html'
  # dsk       = 'ne'; path = 'list-of-egyptian-hieroglyphs.html'
  # dsk       = 'pre'; path = 'python-regexes.html'
  path            = PATH.resolve PATH.join __dirname, '../../../assets', path
  db.setv 'dsk', dsk
  db.setv 'trk', 1
  time 'register_dsk',        => mrg.register_dsk       { dsk, path, }
  time 'refresh_datasource',  => mrg.refresh_datasource { dsk, }
  time 'html.parse_dsk',      => mrg.html.parse_dsk     { dsk, }
  #.........................................................................................................
  H.tabulate "tags",         db SQL"""
      select
          *
        from #{prefix}_html_tags
        where ( syntax != 'html' ) or ( is_empty );"""
  # H.tabulate "#{prefix}_datasources",         db SQL"select * from #{prefix}_datasources;"
  # H.tabulate "std_variables()",               db SQL"select * from std_variables();"
  # H.tabulate "#{prefix}_html_atrs",           db SQL"select * from #{prefix}_html_atrs;"
  H.tabulate "#{prefix}_html_syntaxes",       db SQL"select * from #{prefix}_html_syntaxes;"
  H.tabulate "#{prefix}_html_tags_and_html",  db SQL"select * from #{prefix}_html_tags_and_html;"
  H.tabulate "#{prefix}_html_mirror",         db SQL"select * from #{prefix}_html_mirror;"
  # H.tabulate "#{prefix}_raw_mirror",          db SQL"select * from #{prefix}_raw_mirror;"
  # H.tabulate "#{prefix}_html_tags",           db SQL"select * from #{prefix}_html_tags;"
  H.banner "render_dsk";                      echo mrg.html.render_dsk { dsk, }
  urge '^3243^', "DB file at #{db.cfg.path}"
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_parse_markdownish = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
  prefix          = 'mrg'
  path            = PATH.join DBay.C.autolocation, 'demo-html-parsing.sqlite'
  db              = new DBay { path, recreate: true, }
  mrg             = new Mrg { db, prefix, }
  db.create_stdlib()
  #.........................................................................................................
  dsk             = 'mk'; path = 'dbay-rustybuzz/markdownish-1.md'
  # dsk       = 'ne'; path = 'list-of-egyptian-hieroglyphs.html'
  # dsk       = 'pre'; path = 'python-regexes.html'
  path            = PATH.resolve PATH.join __dirname, '../../../assets', path
  db.setv 'dsk', dsk
  db.setv 'trk', 1
  time 'register_dsk',        => mrg.register_dsk       { dsk, path, }
  time 'refresh_datasource',  => mrg.refresh_datasource { dsk, }
  time 'html.parse_dsk',      => mrg.html.parse_dsk     { dsk, }
  #.........................................................................................................
  H.tabulate "tags",         db SQL"""
      select
          *
        from #{prefix}_html_tags      as tags
        join #{prefix}_html_syntaxes  as syntaxes using ( syntax )
        where ( tags.syntax != 'html' ) or ( tags.is_empty );"""
  # H.tabulate "#{prefix}_datasources",         db SQL"select * from #{prefix}_datasources;"
  # H.tabulate "std_variables()",               db SQL"select * from std_variables();"
  # H.tabulate "#{prefix}_html_atrs",           db SQL"select * from #{prefix}_html_atrs;"
  H.tabulate "#{prefix}_html_fences",         db SQL"select * from #{prefix}_html_fences;"
  H.tabulate "#{prefix}_html_fence_matches",  db SQL"""
    select
        *
      from #{prefix}_html_fence_matches
      order by dsk, oln, trk, pce;"""
  # H.tabulate "#{prefix}_html_fence_matches",  db SQL"""
  #   select
  #       *
  #     from #{prefix}_html_fence_matches as r1
  #     join #{prefix}_html_fence_matches as r2
  #     order by dsk, oln, trk, pce;"""
  H.tabulate "#{prefix}_raw_mirror",  db SQL"""
    select
        *
      from #{prefix}_raw_mirror
      left join #{prefix}_html_fence_matches using ( dsk, oln, trk, pce )
      order by dsk, oln, trk, pce;"""
  # H.tabulate "#{prefix}_html_tags_and_html",  db SQL"select * from #{prefix}_html_tags_and_html;"
  H.tabulate "#{prefix}_html_mirror",         db SQL"select * from #{prefix}_html_mirror;"
  # H.tabulate "#{prefix}_raw_mirror",          db SQL"select * from #{prefix}_raw_mirror;"
  # H.tabulate "#{prefix}_html_tags",           db SQL"select * from #{prefix}_html_tags;"
  # H.banner "render_dsk";                      echo mrg.html.render_dsk { dsk, }
  urge '^3243^', "DB file at #{db.cfg.path}"
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_parse_single_tag = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
  prefix          = 'mrg'
  path            = PATH.join DBay.C.autolocation, 'demo-html-parsing.sqlite'
  db              = new DBay { path, recreate: true, }
  mrg             = new Mrg { db, prefix, }
  db.create_stdlib()
  PARAGATE        = require '../../../apps/paragate'
  CAT             = require 'multimix/lib/cataloguing'
  #.........................................................................................................
  # for key from CAT.walk_all_keys_of PARAGATE.HTML.grammar.lexer
  #   debug '^372^', key
  # debug PARAGATE.HTML.grammar.lexer.match '<foo>'
  txt     = '<code>foobar</code>'
  tokens  = mrg.html.HTMLISH.parse txt, mrg.html._get_tag_catalog()
  debug '^876^', d for d in tokens
  # find = ( x, pattern ) ->
  #   for name from walk x, pattern, []
  # walk = ( x, pattern, stack ) ->
  # #.........................................................................................................
  # urge '^438^', k for k of PARAGATE.HTML
  # debug '^438^', k for k of PARAGATE.HTML.grammar
  # urge '^438^', k for k of PARAGATE.HTML.grammar.lexer
  # debug '^438^', k for k of PARAGATE.HTML.grammar.parser
  #.........................................................................................................
  return null



############################################################################################################
if require.main is module then do =>
  # @demo_html_generation()
  # @demo_datamill()
  # @demo_paragraphs_etc()
  # @demo_html_parsing()
  # @demo_recover_original_text()
  @demo_parse_markdownish()
  @demo_parse_single_tag()








