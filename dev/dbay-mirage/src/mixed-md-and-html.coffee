
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

#-----------------------------------------------------------------------------------------------------------
@demo_transcribe_markdown_to_html = ( cfg ) ->
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  mr            = new Moonriver()
  ###
    *   (?<c1>[^*]+) ** (?<c2>[^*]+) ** *
    *   (?<c1>[^*]+) ** (?<c2>[^*]+) **   (?<c3>[^*]+) *
    **  (?<c1>[^*]+) *  (?<c2>[^*]+) * **
    **  (?<c1>[^*]+) *  (?<c2>[^*]+) *    (?<c3>[^*]+) **
    **  (?<c1>[^*]+) *  (?<c2>[^*]+) *    (?<c3>[^*]+) *  (?<c3>[^*]+) * **
    * ** (?<c1>[^*]+) ** *
    ** * (?<c1>[^*]+) *  **
    * ** (?<c1>[^*]+) ** (?<c2>[^*]+) *
    ** * (?<c1>[^*]+) *  (?<c2>[^*]+) **
  # mr.push do =>
  #   return ( d, send ) =>
  #     for match from d.matchAll /(?<!\*)\*(?<content>[^*]+)\*(?!\*)/g
  #       debug '^387^', match.index, rpr match.groups.content
  #     send d
  ###
  mr.push [
    "**a**"
    "*a*"
    "A paragraph as a *demonstration* of what **can** be done."
    "Another *piece* with *several* emphases."
    "Another ***piece* with *several*** nested emphases."
    "a [fancy](http://fan.cy) link"
    "a [*fancy*](http://fan.cy) link"
    "wanna **`code` some**?"
    ]
  mr.push $show = ( d ) -> info '^344^', d
  #---------------------------------------------------------------------------------------------------------
  mr.push do =>
    md = ( require 'markdown-it' ) 'zero'
    md.enable 'emphasis'
    # md.enable 'autolink'
    md.enable 'backticks'
    # md.enable 'entity'
    # md.enable 'escape'
    # md.enable 'html_inline'
    # md.enable 'image'
    md.enable 'link'
    # md.enable 'newline'
    # md.enable 'text'
    # md.enable 'balance_pairs'
    # md.enable 'text_collapse'
    return ( d, send ) =>
      send md.renderInline d
  #---------------------------------------------------------------------------------------------------------
  mr.push $show = ( d ) -> urge '^344^', d
  mr.drive()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_tunneling_all_htmlish = ( cfg ) ->
  TIMETUNNEL                = require 'timetunnel'
  _tunnel = ( text ) ->
    ### TAINT do not reconstruct tunnel for each call ###
    # guards    = 'äöüßp'
    # guards    = '①②③④⑤'
    guards    = '¥₽₨฿₮'
    intalph   = '0123456789'
    tnl       = new TIMETUNNEL.Timetunnel { guards, intalph, }
    tnl.add_tunnel /// ( < [^>]*? > ) ///sgu
    # tnl.add_tunnel TIMETUNNEL.tunnels.keep_backslash
    # tnl.add_tunnel TIMETUNNEL.tunnels.remove_backslash
    text      = tnl.hide text
    return { text, reveal: ( tnl.reveal.bind tnl ), }
  urge rpr ( _tunnel "helo world"                                 ).text
  urge rpr ( _tunnel "helo <b>world</b>"                          ).text
  urge rpr ( _tunnel "helo <a href='https://foo.com'>world</a>"   ).text
  urge rpr ( _tunnel "helo <span foo='<surprise>'>world</span>"   ).text
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_mixed_md_and_html = ( cfg ) ->
  { DBay }        = require '../../../apps/dbay'
  { Mrg }         = require '../../../apps/dbay-mirage'
  prefix          = 'mrg'
  path            = PATH.join DBay.C.autolocation, 'demo-html-parsing.sqlite'
  db              = new DBay { path, recreate: true, }
  mrg             = new Mrg { db, prefix, }
  db.create_stdlib()
  #.........................................................................................................
  dsk             = 'md'; path = 'dbay-rustybuzz/mixed-md-and-html.html'
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



############################################################################################################
if require.main is module then do =>
  # @demo_mixed_md_and_html()
  # @demo_tunneling_all_htmlish()
  @demo_transcribe_markdown_to_html()
