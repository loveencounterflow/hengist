
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/DEMO'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
#...........................................................................................................
# ( require 'mixa/lib/check-package-versions' ) require '../pinned-package-versions.json'
PATH                      = require 'path'
FS                        = require 'fs'
got                       = require 'got'
CHEERIO                   = require 'cheerio'
GUY                       = require '../../../apps/guy'
{ DBay, }                 = require '../../../apps/dbay'
{ SQL, }                  = DBay
{ Vogue,
  Vogue_scraper_ABC }     = require '../../../apps/dbay-vogue'
{ HDML, }                 = require '../../../apps/dbay-vogue/lib/hdml2'
H                         = require '../../../apps/dbay-vogue/lib/helpers'
glob                      = require 'glob'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  url       = 'https://ionicabizau.net'
  elements  =
    title:  ".header h1"
    desc:   ".header h2"
    avatar:
      selector: ".header img"
      attr:     "src"
  { data, response, } = await scrape_it url, elements
  info "Status Code: ${response.statusCode}"
  urge data
  return null

#-----------------------------------------------------------------------------------------------------------
demo_zvg_online_net = ->
  url       = 'https://www.zvg-online.net/1400/1101986118/ag_seite_001.php'
  elements  =
    # containers: '.container_vors a'
    containers:
      listItem: '.container_vors'
      data:
        listing:
          listItem: 'a'
  encoding  = 'latin1'
  #.........................................................................................................
  buffer    = await got url
  html      = buffer.rawBody.toString encoding
  d         = await scrape_it.scrapeHTML html, elements
  # info "Status Code: #{response.statusCode}"
  for container, idx in d.containers
    urge '^74443^', idx, rpr container.listing
    R = []
    for line in container.listing
      unless ( match = line.match /^(?<key>[^:]*):(?<value>.*)$/ )?
        help '^3453^', rpr line
        R.push { key: './.', value: line, }
        continue
      { key, value, } = match.groups
      key             = key.trim()
      value           = value.trim()
      R.push { key, value, }
    console.table R
  return null

#-----------------------------------------------------------------------------------------------------------
demo_zvg24_net = ->
  url       = 'https://www.zvg24.net/zwangsversteigerung/brandenburg'
  elements  =
    # containers: '.container_vors a'
    containers:
      listItem: 'article'
  #     data:
  #       listing:
  #         listItem: 'a'
  encoding  = 'utf8'
  #.........................................................................................................
  # buffer    = await got url
  # html      = buffer.rawBody.toString encoding
  buffer    = FS.readFileSync PATH.join __dirname, '../sample-data/www.zvg24.net_,_zwangsversteigerung_,_brandenburg.html'
  html      = buffer.toString encoding
  d         = await scrape_it.scrapeHTML html, elements
  # info "Status Code: #{response.statusCode}"
  for text, idx in d.containers
    lines = text.split /\s*\n\s*/
    # text = text.replace /\x20+/g, ' '
    # text = text.replace /\n\x20\n/g, '\n'
    # text = text.replace /\n+/g, '\n'
    # text = text.replace /Musterbild\n/g, ''
    lines = ( line for line in lines when line isnt 'Musterbild' )
    urge '^74443^', idx, rpr lines
    # urge '^74443^', idx, rpr container.replace /\n+/g, '\n'
    # R = []
    # for line in container.listing
    #   unless ( match = line.match /^(?<key>[^:]*):(?<value>.*)$/ )?
    #     help '^3453^', rpr line
    #     R.push { key: './.', value: line, }
    #     continue
    #   { key, value, } = match.groups
    #   key             = key.trim()
    #   value           = value.trim()
    #   R.push { key, value, }
    # console.table R
  return null

#===========================================================================================================
class Ebayde extends Vogue_scraper_ABC

  #---------------------------------------------------------------------------------------------------------
  scrape_html: ( html_or_buffer ) ->
    dsk         = 'ebayde'
    { sid, }    = @hub.vdb.new_session dsk
    insert_post = @hub.vdb.queries.insert_post
    seen        = @hub.vdb.db.dt_now()
    #.......................................................................................................
    html        = @_html_from_html_or_buffer html_or_buffer
    $           = CHEERIO.load html
    R           = []
    #.......................................................................................................
    for item in ( $ 'div.s-item__info' )
      item          = $ item
      item_details  = item.find 'div.s-item__details'
      item_title    = item.find 'h3.s-item__title'
      item_subtitle = item.find 'div.s-item__subtitle'
      item_price    = item.find 'span.s-item__price'
      # urge '^434554^', item_details.text()
      # info '^434554^', item_title.text()
      # info '^434554^', item_subtitle.text()
      # info '^434554^', item_price.text()
      item_url      = ( item.find 'a' ).attr 'href'
      item_url      = item_url.replace /^([^?]+)\?.*$/, '$1'
      item_id       = item_url.replace /^.*\/([^\/]+)$/, '$1'
      if item_id is '123456'
        warn "skipping invalid Item ID (123456)"
        continue
      # info '^434554^', item_url
      # info '^434554^', item_id
      pid           = "ebayde-#{item_id}"
      title         = item_title.text()
      subtitle      = item_subtitle.text()
      title         = title + " / #{subtitle}"
      #.....................................................................................................
      details = { title, item_url, }
      details = JSON.stringify details
      row     = @hub.vdb.new_post { sid, pid, details, }
    #.......................................................................................................
    # process.exit 111
    return null

  #---------------------------------------------------------------------------------------------------------
  html_from_details: ( row ) ->
    { dsk
      sid
      ts
      pid
      rank
      trend
      details } = row
    #.......................................................................................................
    trend       = JSON.parse trend
    details     = JSON.parse details
    dsk_html    = HDML.text dsk
    sid_html    = HDML.text "#{sid}"
    ts_html     = HDML.text ts
    id_html     = HDML.text pid
    rank_html   = HDML.text "#{rank}"
    trend_html  = HDML.text JSON.stringify trend
    title_html  = HDML.insert 'a', { href: details.item_url, }, HDML.text details.title
    #.......................................................................................................
    tds         = [
      HDML.insert 'td', dsk_html
      HDML.insert 'td', sid_html
      HDML.insert 'td', id_html
      HDML.insert 'td', ts_html
      HDML.insert 'td', rank_html
      HDML.insert 'td', @get_sparkline trend
      HDML.insert 'td', trend_html
      HDML.insert 'td', title_html
      ]
    #.......................................................................................................
    return HDML.insert 'tr', null, tds.join '\n'


#===========================================================================================================
class Hnrss extends Vogue_scraper_ABC

  #---------------------------------------------------------------------------------------------------------
  _remove_cdata: ( text ) -> text.replace /^<!\[CDATA\[(.*)\]\]>$/, '$1'

  #---------------------------------------------------------------------------------------------------------
  _article_url_from_description: ( description ) ->
    if ( match = description.match /Article URL:\s*(?<article_url>[^\s]+)/ )?
      return match.groups.article_url
    return null

  #---------------------------------------------------------------------------------------------------------
  scrape: ->
    url       = 'https://hnrss.org/newest?link=comments'
    encoding  = 'utf8'
    buffer    = await got url
    return @scrape_html buffer.rawBody

  #---------------------------------------------------------------------------------------------------------
  scrape_html: ( html_or_buffer ) ->
    dsk         = 'hn'
    { sid, }    = @hub.new_session dsk
    insert_post = @hub.vdb.queries.insert_post
    seen        = @hub.vdb.db.dt_now()
    #.......................................................................................................
    html        = @_html_from_html_or_buffer html_or_buffer
    #.......................................................................................................
    ### NOTE This is RSS XML, so `link` doesn't behave like HTML `link` and namespaces are not supported: ###
    ### TAINT Cheerio docs: "can select with XML Namespaces but due to the CSS specification, the colon (:)
     needs to be escaped for the selector to be valid" ###
    html        = html.replace /<dc:creator>/g,   '<creator>'
    html        = html.replace /<\/dc:creator>/g, '</creator>'
    html        = html.replace /<link>/g,         '<reserved-link>'
    html        = html.replace /<\/link>/g,       '</reserved-link>'
    #.......................................................................................................
    $           = CHEERIO.load html
    R           = []
    # debug types.type_of $ 'item'
    # debug ( $ 'item' ).html()
    # debug ( $ 'item' ).each
    # debug ( $ 'item' ).forEach
    #.......................................................................................................
    for item in ( $ 'item' )
      item            = $ item
      #.....................................................................................................
      title           = item.find 'title'
      title           = title.text()
      title           = @_remove_cdata title
      title           = title.trim()
      #.....................................................................................................
      discussion_url  = item.find 'reserved-link'
      discussion_url  = discussion_url.text()
      pid             = discussion_url.replace /^.*item\?id=([0-9]+)$/, 'hn-$1'
      #.....................................................................................................
      date            = item.find 'pubDate'
      date            = date.text()
      #.....................................................................................................
      creator         = item.find 'creator'
      creator         = creator.text()
      #.....................................................................................................
      description     = item.find 'description'
      description     = description.text()
      description     = @_remove_cdata description
      article_url     = @_article_url_from_description description
      #.....................................................................................................
      href    = null
      R.push { pid, title, date, creator, discussion_url, article_url, }
      ### TAINT avoid duplicate query ###
      details = { title, discussion_url, date, creator, description, }
      details = JSON.stringify details
      row     = @hub.new_post { sid, pid, details, }
    #.......................................................................................................
    # # H.tabulate "Hacker News", R
    # H.tabulate "Hacker News", @hub.db SQL"""select
    #     sid                     as sid,
    #     pid                      as pid,
    #     rank                    as rank,
    #     substring( details, 1, 100 )  as details
    #   from scr_posts
    #   where true
    #     -- and ( rank < 10 )
    #   order by sid, rank;"""
    return null

  #---------------------------------------------------------------------------------------------------------
  html_from_details: ( row ) ->
    { dsk
      sid
      ts
      pid
      rank
      trend
      details } = row
    #.......................................................................................................
    { title
      discussion_url
      article_url   } = details
    #.......................................................................................................
    trend       = JSON.parse trend
    details     = JSON.parse details
    dsk_html    = HDML.text dsk
    sid_html    = HDML.text "#{sid}"
    ts_html     = HDML.text ts
    id_html     = HDML.text pid
    rank_html   = HDML.text "#{rank}"
    trend_html  = HDML.text JSON.stringify trend
    title_html  = HDML.insert 'a', { href: details.discussion_url, }, HDML.text details.title
    #.......................................................................................................
    tds         = [
      HDML.insert 'td', dsk_html
      HDML.insert 'td', sid_html
      HDML.insert 'td', id_html
      HDML.insert 'td', ts_html
      HDML.insert 'td', rank_html
      HDML.insert 'td', @get_sparkline trend
      HDML.insert 'td', trend_html
      HDML.insert 'td', title_html
      ]
    #.......................................................................................................
    return HDML.insert 'tr', null, tds.join '\n'

#-----------------------------------------------------------------------------------------------------------
demo_hnrss = ->
  hnrss   = new Hnrss()
  hnrss.vogue.queries.insert_datasource.run { dsk: 'hn', url: 'http://nourl', }
  #.........................................................................................................
  glob_pattern  = PATH.join __dirname, '../../../assets/dbay-vogue/hnrss.org_,_newest.???.xml'
  for path in glob.sync glob_pattern
    await do =>
      buffer    = FS.readFileSync path
      await hnrss.scrape_html buffer
  #.........................................................................................................
  # H.tabulate "trends", hnrss.vogue.db SQL"""select * from _scr_trends order by pid;"""
  # H.tabulate "trends", hnrss.vogue.db SQL"""
  #   select
  #       dsk                                           as dsk,
  #       sid                                           as sid,
  #       pid                                           as pid,
  #       rank                                          as rank,
  #       trend                                         as trend,
  #       substring( details, 1, 30 )                   as details
  #     from scr_trends order by
  #       sid desc,
  #       rank;"""
  # H.tabulate "trends", hnrss.vogue.db SQL"""select * from scr_trends_html order by nr;"""
  #.........................................................................................................
  # demo_trends_as_table hnrss
  #.........................................................................................................
  return hnrss

#-----------------------------------------------------------------------------------------------------------
demo_ebayde = ->
  { Vogue
    Vogue_scraper_ABC
    Vogue_db      } = require '../../../apps/dbay-vogue'
  vogue             = new Vogue()
  ebayde            = new Ebayde()
  vogue.scrapers.add { dsk: 'ebayde', scraper: ebayde, }
  ### TAINT use API method, don't use query directly ###
  ### TAINT should be done by `vogue.scraper.add()` ###
  vogue.vdb.queries.insert_datasource.run { dsk: 'ebayde', url: 'http://nourl', }
  #.........................................................................................................
  glob_pattern  = PATH.join __dirname, '../../../assets/dbay-vogue/ebay-de-search-result-rucksack-????????-??????Z.html'
  for path in glob.sync glob_pattern
    await do =>
      buffer    = FS.readFileSync path
      await ebayde.scrape_html buffer
  #.........................................................................................................
  return vogue

#-----------------------------------------------------------------------------------------------------------
demo_serve_hnrss = ( cfg ) ->
  { Vogue_server, } = require '../../../apps/dbay-vogue/lib/vogue-server'
  hnrss         = await demo_hnrss()
  vogue_server  = new Vogue_server { client: hnrss, }
  debug '^445345-11^', vogue_server
  debug '^445345-12^', ( k for k of vogue_server )
  debug '^445345-13^', await vogue_server.start()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_serve_ebayde = ( cfg ) ->
  vogue         = await demo_ebayde()
  debug '^445345-16^', vogue.server.start()
  # setInterval ( -> info '^342349390^' ), 1000
  help '^445345-17^', "server started"
  return null





############################################################################################################
if module is require.main then do =>
  # await demo_zvg_online_net()
  # await demo_zvg24_net()
  # await demo_hnrss()
  # await demo_serve_hnrss()
  await demo_serve_ebayde()
  # view-source:https://www.skypack.dev/search?q=sqlite&p=1
  # await demo_oanda_com_jsdom()
  # f()




