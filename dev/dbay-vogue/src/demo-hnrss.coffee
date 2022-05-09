
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
{ HDML, }                 = require '../../../apps/hdml'
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
      title_url     = item_url
      #.....................................................................................................
      details = { title, title_url, }
      details = JSON.stringify details
      row     = @hub.vdb.new_post { sid, pid, details, }
    #.......................................................................................................
    # process.exit 111
    return null


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
    { sid, }    = @hub.vdb.new_session dsk
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
      title_url       = discussion_url
      #.....................................................................................................
      href    = null
      ### TAINT avoid duplicate query ###
      details = { title, title_url, date, creator, description, }
      details = JSON.stringify details
      row     = @hub.vdb.new_post { sid, pid, details, }
    return null

#-----------------------------------------------------------------------------------------------------------
demo_hnrss = ->
  { Vogue
    Vogue_scraper_ABC
    Vogue_db      } = require '../../../apps/dbay-vogue'
  { DBay          } = require '../../../apps/dbay'
  path              = PATH.resolve PATH.join __dirname, '../../../dev-shm/dbay-vogue.db'
  trash_path        = PATH.resolve PATH.join __dirname, '../../../dev-shm/dbay-vogue.trashed.db'
  trash_sql_path    = PATH.resolve PATH.join __dirname, '../../../dev-shm/dbay-vogue.trashed.sql'
  db                = new DBay { path, }
  vdb               = new Vogue_db { db, }
  vogue             = new Vogue { vdb, }
  dsk               = 'hn'
  scraper           = new Hnrss()
  vogue.scrapers.add { dsk, scraper, }
  ### TAINT use API method, don't use query directly ###
  ### TAINT should be done by `vogue.scraper.add()` ###
  vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
  #.........................................................................................................
  glob_pattern  = PATH.join __dirname, '../../../assets/dbay-vogue/hnrss.org_,_newest.???.xml'
  for path in glob.sync glob_pattern
    await do =>
      buffer    = FS.readFileSync path
      await scraper.scrape_html buffer
  # H.tabulate "trends", db SQL"""select
  #     dsk,
  #     sid,
  #     ts,
  #     pid,
  #     rank,
  #     substring( trend,   1, 20 ) as trend,
  #     substring( details, 1, 20 ) as details
  #   from scr_trends;"""
  #.........................................................................................................
  # { Desql         } = require '../../../apps/desql'
  # desql             = new Desql()
  # desql.db          = db ### TAINT should be possible to just pass in DB ###
  # desql.create_trashlib()
  # desql.trash_to_sql { path: trash_sql_path, overwrite: true, }
  # desql.trash_to_sqlite { path: trash_path, overwrite: true, }
  # help '^4564^', "wrote trashed db to #{trash_path}"
  #.........................................................................................................
  return vogue

#-----------------------------------------------------------------------------------------------------------
demo_ebayde = ->
  { Vogue
    Vogue_scraper_ABC
    Vogue_db      } = require '../../../apps/dbay-vogue'
  dsk               = 'ebayde'
  vogue             = new Vogue()
  scraper           = new Ebayde()
  vogue.scrapers.add { dsk, scraper, }
  ### TAINT use API method, don't use query directly ###
  ### TAINT should be done by `vogue.scraper.add()` ###
  vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
  #.........................................................................................................
  glob_pattern  = PATH.join __dirname, '../../../assets/dbay-vogue/ebay-de-search-result-rucksack-????????-??????Z.html'
  for path in glob.sync glob_pattern
    await do =>
      buffer    = FS.readFileSync path
      await scraper.scrape_html buffer
  #.........................................................................................................
  return vogue

#-----------------------------------------------------------------------------------------------------------
demo_serve_hnrss = ( cfg ) ->
  vogue = await demo_hnrss()
  debug '^445345-16^', vogue.server.start()
  help '^445345-17^', "server started"
  return null

#-----------------------------------------------------------------------------------------------------------
demo_serve_ebayde = ( cfg ) ->
  vogue = await demo_ebayde()
  debug '^445345-16^', vogue.server.start()
  help '^445345-17^', "server started"
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_zvg_online_net()
  # await demo_zvg24_net()
  # await demo_hnrss()
  # await demo_serve_hnrss()
  await demo_serve_ebayde()




