
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/TESTS/HTML-GENERATION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "DB as_html() 1" ] = ( T, done ) ->
  { Vogue
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  vogue                 = new Vogue()
  dsk                   = 'xx'
  class Xx_scraper extends Vogue_scraper_ABC
  scraper               = new Xx_scraper()
  vogue.scrapers.add { dsk, scraper, }
  ### TAINT use API method, don't use query directly ###
  ### TAINT should be done by `vogue.scraper.add()` ###
  vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
  session               = vogue.vdb.new_session dsk
  { sid, }              = session
  pid                   = 'xx-1'
  # title                 = "helo world"
  # title_url             = 'https://example.com/blog/1'
  # details               = { title, title_url, foo: 42, bar: 108, }
  details               = { foo: 42, bar: 108, }
  row                   = vogue.vdb.new_post { dsk, sid, pid, session, details, }
  result                = vogue.vdb.as_html { dsk, table: 'vogue_trends', }
  debug '^348^', result
  T?.ok ( result.indexOf "<table class='vogue'>"            ) > -1
  T?.ok ( result.indexOf "<th class='sid_min'>sid_min</th>" ) > -1
  T?.ok ( result.indexOf "<th class='sid_max'>sid_max</th>" ) > -1
  T?.ok ( result.indexOf "<th class='dsk'>dsk</th>"         ) > -1
  T?.ok ( result.indexOf "<th class='ts'>ts</th>"           ) > -1
  T?.ok ( result.indexOf "<th class='pid'>pid</th>"         ) > -1
  T?.ok ( result.indexOf """<td class='dsk'>xx</td>"""                                                                    ) > -1
  T?.ok ( result.indexOf """<td class='sid_min'>1</td>"""                                                                 ) > -1
  T?.ok ( result.indexOf """<td class='sid_max'>1</td>"""                                                                 ) > -1
  T?.ok ( result.indexOf """<td class='pid'>xx-1</td>"""                                                                  ) > -1
  T?.ok ( result.indexOf """<td class='rank'>1</td>"""                                                                    ) > -1
  T?.ok ( result.indexOf """<td class='raw_trend'>[{"dsk":"xx","pid":"xx-1","sid":1,"rank":1,"first":1,"last":1}]</td>""" ) > -1
  T?.ok ( result.indexOf """<td class='details'>{"foo":42,"bar":108}</td>"""                                              ) > -1
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DB as_html() 2" ] = ( T, done ) ->
  { Vogue
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  vogue                 = new Vogue()
  dsk                   = 'xx'
  class Xx_scraper extends Vogue_scraper_ABC
  scraper               = new Xx_scraper()
  vogue.scrapers.add { dsk, scraper, }
  ### TAINT use API method, don't use query directly ###
  ### TAINT should be done by `vogue.scraper.add()` ###
  vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
  session               = vogue.vdb.new_session dsk
  { sid, }              = session
  pid                   = 'xx-1'
  details               = { foo: 42, bar: 108, }
  row                   = vogue.vdb.new_post { dsk, sid, pid, session, details, }
  T?.eq row.sid, 1
  T?.eq row.pid, 'xx-1'
  cfg                   =
    table:      'vogue_trends'
    class:      'vogue_trends'
    undefined:  "N/A"
    fields:
      dsk:
        title: "DSK"
      sid_min:
        display: false
      sid_max:
        title: "SIDs"
        format:     ( value, { row, } ) => "#{row.sid_min}—#{row.sid_max}"
        outer_html: ( value, details ) =>
          help '^4535^', { value, details, }
          T?.eq value, "1—1"
          T?.eq details.raw_value, 1
          return "<td class=sids>#{value}</td>"
      details:
        inner_html: ( value, details ) =>
          return "<div>#{rpr details.raw_value}</div>"
      extra:
        title: "Extra"
        format: ( value, details ) => details.row_nr
      asboolean: true
  result                = vogue.vdb.as_html cfg
  help '^348^', result
  T?.ok ( result.indexOf "<th class='dsk'>DSK</th>" ) > -1
  T?.ok ( result.indexOf "<th class='extra'>Extra</th>" ) > -1
  T?.ok ( result.indexOf "<td class='extra'>1</td>" ) > -1
  T?.ok ( not result.indexOf "<th class='sid_min'>" ) > -1
  T?.ok ( not result.indexOf "<td class='sid_min'>" ) > -1
  T?.ok ( result.indexOf "<td class=sids>1—1</td>" ) > -1
  T?.ok ( result.indexOf "<td class='asboolean'>N/A</td>" ) > -1
  T?.ok ( result.indexOf """<td class='details'><div>'{"foo":42,"bar":108}'</div></td>""" ) > -1
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DB as_html() can use `query`" ] = ( T, done ) ->
  { Vogue
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  vogue                 = new Vogue()
  { SQL, }              = ( require '../../../apps/dbay' ).DBay
  #.........................................................................................................
  do =>
    class Xx_scraper extends Vogue_scraper_ABC
    dsk       = 'xx'
    scraper   = new Xx_scraper()
    vogue.scrapers.add { dsk, scraper, }
    vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
    session   = vogue.vdb.new_session dsk
    { sid, }  = session
    row       = vogue.vdb.new_post { dsk, sid, pid: 'xx-1', session, details: { foo: 41, }, }
    row       = vogue.vdb.new_post { dsk, sid, pid: 'xx-2', session, details: { foo: 42, }, }
    row       = vogue.vdb.new_post { dsk, sid, pid: 'xx-3', session, details: { foo: 43, }, }
    return null
  #.........................................................................................................
  do =>
    class Xx_scraper extends Vogue_scraper_ABC
    dsk       = 'yy'
    scraper   = new Xx_scraper()
    vogue.scrapers.add { dsk, scraper, }
    vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
    session   = vogue.vdb.new_session dsk
    { sid, }  = session
    row       = vogue.vdb.new_post { dsk, sid, pid: 'yy-1', session, details: { foo: 51, }, }
    row       = vogue.vdb.new_post { dsk, sid, pid: 'yy-2', session, details: { foo: 52, }, }
    row       = vogue.vdb.new_post { dsk, sid, pid: 'yy-3', session, details: { foo: 53, }, }
    return null
  #.........................................................................................................
  cfg =
    class:        'vogue trends xx'
    query:        SQL"""select * from vogue_trends where dsk = $dsk order by pid;"""
    parameters:   { dsk: 'xx', }
  result = vogue.vdb.as_html cfg
  debug '^348^', result
  T?.ok ( result.indexOf "<table class='vogue trends xx'>" ) > -1
  T?.ok ( result.indexOf "<th class='dsk'>dsk</th>" ) > -1
  T?.ok ( result.indexOf "<td class='pid'>xx-1</td>" ) > -1
  T?.ok ( result.indexOf "<td class='pid'>xx-2</td>" ) > -1
  T?.ok ( result.indexOf "<td class='pid'>xx-3</td>" ) > -1
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DB as_html() can use `rows`" ] = ( T, done ) ->
  { Vogue }             = require '../../../apps/dbay-vogue'
  vogue                 = new Vogue()
  #.........................................................................................................
  do =>
    cfg =
      rows:         []
      parameters:   { dsk: 'xx', }
    T?.throws /not a valid vogue_db_as_html_cfg/, => vogue.vdb.as_html cfg
    return null
  #.........................................................................................................
  do =>
    cfg =
      rows:         []
    result = vogue.vdb.as_html cfg
    help '^348^', result
    T?.eq result, "<table class='vogue'>\n</table>"
    return null
  #.........................................................................................................
  do =>
    cfg =
      rows:         []
      fields:
        a: true
        b: true
        c: true
    result = vogue.vdb.as_html cfg
    help '^348^', result
    T?.eq result, "<table class='vogue'>\n</table>"
    return null
  #.........................................................................................................
  # T?.ok ( result.indexOf "<table class='vogue trends xx'>" ) > -1
  # T?.ok ( result.indexOf "<th class='dsk'>dsk</th>" ) > -1
  # T?.ok ( result.indexOf "<td class='pid'>xx-1</td>" ) > -1
  # T?.ok ( result.indexOf "<td class='pid'>xx-2</td>" ) > -1
  # T?.ok ( result.indexOf "<td class='pid'>xx-3</td>" ) > -1
  return done?()


############################################################################################################
if module is require.main then do =>
  test @
  # test @[ "DB as_html() 2" ]
  # @[ "DB as_html() can use `query`" ]()
  # test @[ "DB as_html() 1" ]

