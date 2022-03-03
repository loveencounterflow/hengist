
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'



#-----------------------------------------------------------------------------------------------------------
@[ "Mirage HTML: Basic functionality" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage'
  db        = new DBay()
  mrg       = new Mrg { db, }
  prefix    = 'mrg'
  probes_and_matchers = []
  dsk       = 'b'
  mrg.register_dsk { dsk, url: 'live:', }
  # debug '^435^1, mrg.append_text { dsk, trk: 1, text: """<title id=c1 x="Q"></title>""", }
  # debug '^435^2, mrg.append_text { dsk, trk: 1, text: """<title id=c2 x='Q'></title>""", }
  # debug '^435^3, mrg.append_text { dsk, trk: 1, text: """<title id=c3 x='"Q"'></title>""", }
  # debug '^435^4, mrg.append_text { dsk, trk: 1, text: """<title id=c4 x="'Q'"></title>""", }
  mrg.append_text { dsk, trk: 1, text: """<div id=c1 x="Q"></div>""", }
  mrg.append_text { dsk, trk: 1, text: '', }
  mrg.append_text { dsk, trk: 1, text: """<div id=c2 x="Q">Some Text</div>""", }
  H.tabulate "#{prefix}_rwnmirror",                   db SQL"select * from #{prefix}_rwnmirror;"
  H.tabulate "#{prefix}_parlnrs0",                    db SQL"select * from #{prefix}_parlnrs0;"
  H.tabulate "#{prefix}_parlnrs",                     db SQL"select * from #{prefix}_parlnrs;"
  H.tabulate "#{prefix}_pars0",                       db SQL"select * from #{prefix}_pars0;"
  H.tabulate "#{prefix}_pars",                        db SQL"select * from #{prefix}_pars;"
  H.tabulate "#{prefix}_mirror",                      db SQL"select * from #{prefix}_mirror;"
  H.tabulate "#{prefix}_raw_mirror",                  db SQL"select * from #{prefix}_raw_mirror;"
  H.tabulate "#{prefix}_parmirror",                   db SQL"select * from #{prefix}_parmirror;"
  # H.tabulate "#{prefix}_next_free_oln",               db SQL"select * from #{prefix}_next_free_oln;"
  # H.tabulate "#{prefix}_datasources",                 db SQL"select * from #{prefix}_datasources;"

  # mrg.html.parse_dsk { dsk, }
  # H.tabulate "#{prefix}_mirror",              db SQL"select * from #{prefix}_mirror;"
  # H.tabulate "#{prefix}_html_mirror",         db SQL"select * from #{prefix}_html_mirror;"
  # H.tabulate "#{prefix}_html_tags_and_html",  db SQL"select * from #{prefix}_html_tags_and_html;"
  # result = db.all_first_values SQL"""
  #   select
  #       v
  #     from #{prefix}_html_mirror as m
  #     join #{prefix}_html_atrs as a using ( atrid )
  #     where true
  #       and ( m.typ = '<' )
  #       and ( m.tag = 'title' )
  #       and ( a.k   = 'x' )
  #     order by m.dsk, m.oln, m.trk, m.pce;"""
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "Mirage HTML: quotes in attribute values" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage'
  db        = new DBay()
  mrg       = new Mrg { db, }
  prefix    = 'mrg'
  probes_and_matchers = []
  dsk       = 'quotedattributes'
  mrg.register_dsk { dsk, url: 'live:', }
  # debug '^435^5, mrg.append_text { dsk, trk: 1, text: """<title id=c1 x="Q"></title>""", }
  # debug '^435^6, mrg.append_text { dsk, trk: 1, text: """<title id=c2 x='Q'></title>""", }
  # debug '^435^7, mrg.append_text { dsk, trk: 1, text: """<title id=c3 x='"Q"'></title>""", }
  # debug '^435^8, mrg.append_text { dsk, trk: 1, text: """<title id=c4 x="'Q'"></title>""", }
  text = """
    <title id=c1 x="Q"></title>

    <title id=c2 x='Q'></title>

    <title id=c3 x='"Q"'></title>

    <title id=c4 x="'Q'"></title>"""
  mrg.append_text { dsk, trk: 1, text, }
  mrg.html.parse_dsk { dsk, }
  H.tabulate "#{prefix}_mirror",              db SQL"select * from #{prefix}_mirror;"
  H.tabulate "#{prefix}_html_mirror",         db SQL"select * from #{prefix}_html_mirror;"
  H.tabulate "#{prefix}_html_tags_and_html",  db SQL"select * from #{prefix}_html_tags_and_html;"
  result = db.all_first_values SQL"""
    select
        v
      from #{prefix}_html_mirror as m
      join #{prefix}_html_atrs as a using ( atrid )
      where true
        and ( m.typ = '<' )
        and ( m.tag = 'title' )
        and ( a.k   = 'x' )
      order by m.dsk, m.oln, m.trk, m.pce;"""
  T?.eq result, [ 'Q', 'Q', '"Q"', "'Q'" ]
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     url    = mrg._url_from_path probe
  #     path   = mrg._path_from_url url
  #     # urge { probe, url, path, }
  #     resolve [ url, path, ]
  return done?()


#-----------------------------------------------------------------------------------------------------------
@[ "Mirage HTML: tag syntax variants" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage'
  { HDML  } = require '../../../apps/hdml'
  db        = new DBay()
  mrg       = new Mrg { db, }
  { lets
    thaw }  = guy.lft
  # #.........................................................................................................
  # debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\' ).text
  # debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\\\' ).text
  # debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\&amp;' ).text
  # return done?()
  #.........................................................................................................
  text_from_token = ( token ) ->
    { $key
      name
      type
      text } = token
    name ?= 'MISSING'
    return switch $key
      when '^text'  then text
      when '^error' then  ( HDML.create_tag '<', 'error', { token.attrs..., message: token.message } ) \
                        + ( token.text ? '' ) \
                        + ( HDML.create_tag '>', 'error' )
      when '<tag'   then HDML.create_tag '<', name, token.atrs
      when '^tag'   then HDML.create_tag '^', name, token.atrs
      when '>tag'   then HDML.create_tag '>', name
      else throw new Error "unknown $key #{rpr $key}"
  #.........................................................................................................
  probes_and_matchers = [
    # [ '<py/ling3/',         null, ]
    [ '<title>My Page</title>',     '<title>|My Page|</title>', ]
    [ '<title/My\\/Your Page/>',    '<title>|My/Your Page|</title>|>', ]
    [ '<title>My Page</>', "<title>|My Page|</title>|<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;&gt;&#39; &lt;--'>></error>", ]
    [ '<title/My Page/>',           '<title>|My Page|</title>|>', ]
    [ '<title/My/Your Page/>',      '<title>|My|</title>|Your Page/>', ]
    [ '<title/My\npage/',           '<title>|My\npage|</title>', ]
    [ '<title k=v j=w/My Page/',    "<title k='v' j='w'>|My Page|</title>", ]
    [ '<title/<b>My</b> Page/',     "<title>|<error message='bare active characters'><b>My<</error>|</title>|b> Page/", ]
    [ '<title//',                   '<title>|</title>', ]
    [ '<title/>',                   '<title/>', ]
    [ '<title/My Page/',            '<title>|My Page|</title>', ]
    [ '<title#c1.x/My Page/',       '<title>|My Page|</title>', ]
    [ '\\<title/>',                 '&lt;title/>', ]
    [ '&amp;',                      '&amp;', ]
    [ '\\&amp;',                    '&amp;amp;', ]
    [ 'foo\\bar',                   'foobar', ]
    [ 'foo\\\\bar',                 'foo\\bar', ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # help '^435-12^', rpr probe
      parts = []
      for d in mrg.html.HTMLISH.parse probe
        parts.push text_from_token d
        d = thaw d
        delete d.$
        delete d.$vnr
        # urge '^435-13^', d
      result = parts.join '|'
      # info '^435-14^', rpr result
      resolve result
      return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_xncr_matching = ->
  #===========================================================================================================
  # PATTERNS
  #-----------------------------------------------------------------------------------------------------------
  # G: grouped
  # O: optional
  xncr          = {}
  xncr.nameG    = ( ///     (?<name>      [a-z][a-z0-9]* )       /// ).source
  xncr.nameOG   = ( /// (?: (?<csg>   (?: [a-z][a-z0-9]* ) ) | ) /// ).source
  xncr.hexG     = ( /// (?:     x  (?<hex> [a-fA-F0-9]+ )      ) /// ).source
  xncr.decG     = ( ///            (?<dec> [      0-9]+ )        /// ).source
  xncr.matcher  = /// & #{xncr.nameG} ; | & #{xncr.nameOG} \# (?: #{xncr.hexG} | #{xncr.decG} ) ; ///g
  #...........................................................................................................
  probes = [
    '&'
    '&;'
    'foo &bar; baz'
    '&bar;'
    '&#123;'
    'foo &#123; bar'
    'foo &xy#x123; bar &baz;'
    ]
  for probe in probes
    for match from probe.matchAll xncr.matcher
      groups = { match.groups..., }
      delete groups[ key ] for key, value of groups when not value?
      debug '^334-5^', ( rpr probe ), groups
  #...........................................................................................................
  return null


############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "altering mirrored source lines causes error" ]
  # @[ "altering mirrored source lines causes error" ]()
  # @[ "Mirage HTML: quotes in attribute values" ]()
  # @[ "Mirage HTML: Basic functionality" ]()
  test @[ "Mirage HTML: tag syntax variants" ]
  # demo_xncr_matching()



