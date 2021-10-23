
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/TESTS/BASIC'
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


#-----------------------------------------------------------------------------------------------------------
@[ "DRB foobar" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  { Tbl, }            = require '../../../apps/icql-dba-tabulate'
  path                = PATH.resolve DBay.C.autolocation, 'drb.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay()
  drb                 = new Drb { path, db, temporary: true, }
  dtab                = new Tbl { db, }
  schema              = drb.cfg.schema
  #.........................................................................................................
  db =>
    echo dtab._tabulate db SQL"select type, name from #{schema}.sqlite_schema;"
    echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( 'outlines' );"
  #.........................................................................................................
  #.........................................................................................................
  db =>
    echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( 'fontnicks' );"
    echo dtab._tabulate db SQL"select * from #{schema}.outlines order by fontnick, gid;"
    echo dtab._tabulate db SQL"select * from #{schema}.fontnicks order by fontnick;"
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB no shared state in WASM module" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  fontnick            = 'gi'
  gid                 = 74
  font_idx            = 0
  #.........................................................................................................
  ### Establish that trying to retrieve an outline with an unused `font_idx` throws an error: ###
  do =>
    db                  = new DBay()
    drb                 = new Drb { db, temporary: true, }
    try
      urge '^290^', outline = JSON.parse drb.RBW.glyph_to_svg_pathdata font_idx, gid
    catch error
      { name, message, } = error
      warn { name, message, }
    T?.fail "^5568347-1^ failed to throw an error" unless error?
  #.........................................................................................................
  ### Establish that after associating `font_idx` with a loaded font, outline retrieval does work: ###
  do =>
    db                  = new DBay()
    drb                 = new Drb { db, temporary: true, }
    drb.load_font { fontnick, }
    urge '^290^', outline = JSON.parse drb.RBW.glyph_to_svg_pathdata font_idx, gid
  #.........................................................................................................
  do =>
    db                  = new DBay()
    drb                 = new Drb { db, temporary: true, }
    ### we do not call `drb.load_font { fontnick, }` ###
    try
      urge '^290^', outline = JSON.parse drb.RBW.glyph_to_svg_pathdata font_idx, gid
    catch error
      { name, message, } = error
      warn { name, message, }
    T?.fail "^5568347-2^ failed to throw an error" unless error?
  #.........................................................................................................
  return done?()


#-----------------------------------------------------------------------------------------------------------
@[ "___________ DRB path compression" ] = ( T, done ) ->
  SVGO = require 'svgo'
  probe   = 'M 759 -105 Q 787 -105 844 -57 Q 844 -34 835 -34 Q 803 -34 680 -37 Q 558 -40 541 -40 Q 427 -40 271 -20 L 136 3 Q 131 3 126 3 Q 122 4 119 4 Q 78 4 55 -31 Q 55 -40 63 -40 L 288 -57 L 288 -69 Q 288 -102 285 -147 Q 281 -192 277 -237 Q 272 -282 271 -296 Q 264 -378 221 -454 L 221 -456 Q 221 -474 235 -474 Q 245 -474 264 -465 Q 282 -457 289 -451 L 384 -535 Q 433 -581 452 -624 L 452 -629 Q 452 -646 457 -652 Q 462 -657 472 -657 Q 488 -657 531 -649 Q 574 -642 580 -636 Q 590 -627 590 -610 Q 555 -595 449 -524 Q 343 -454 308 -438 Q 315 -428 315 -395 Q 315 -383 314 -368 Q 313 -354 313 -351 Q 420 -357 626 -410 Q 647 -415 660 -415 Q 697 -415 718 -393 Q 718 -367 592 -348 L 536 -338 Q 571 -316 576 -293 L 534 -80 Q 539 -79 552 -79 Q 591 -79 667 -92 Q 742 -105 759 -105 Z M 316 -318 Q 316 -292 320 -237 Q 323 -182 328 -125 Q 333 -69 333 -63 Q 482 -74 490 -74 Q 490 -86 497 -154 Q 503 -222 503 -243 Q 503 -295 490 -329 L 380 -311 Q 374 -310 362 -310 Q 337 -310 316 -318 Z'
  matcher = 'M759-105q28 0 85 48 0 23-9 23-32 0-155-3-122-3-139-3-114 0-270 20L136 3h-10q-4 1-7 1-41 0-64-35 0-9 8-9l225-17v-12q0-33-3-78l-8-90q-5-45-6-59-7-82-50-158v-2q0-18 14-18 10 0 29 9 18 8 25 14l95-84q49-46 68-89v-5q0-17 5-23 5-5 15-5 16 0 59 8 43 7 49 13 10 9 10 26-35 15-141 86-106 70-141 86 7 10 7 43 0 12-1 27-1 14-1 17 107-6 313-59 21-5 34-5 37 0 58 22 0 26-126 45l-56 10q35 22 40 45L534-80q5 1 18 1 39 0 115-13 75-13 92-13ZM316-318q0 26 4 81 3 55 8 112 5 56 5 62 149-11 157-11 0-12 7-80 6-68 6-89 0-52-13-86l-110 18q-6 1-18 1-25 0-46-8Z'
  #.........................................................................................................
  optimize = ( svg_path ) ->
    svg                       = """<svg><path d='#{svg_path}'/></svg>"""
    { data: svg_optimized, }  = SVGO.optimize svg
    return svg_optimized.replace /^.*d="([^"]+)".*$/, '$1'
  #.........................................................................................................
  R = probe
  R = R.replace /([0-9])\x20([^0-9])/g, '$1$2'
  R = R.replace /([^0-9])\x20([0-9])/g, '$1$2'
  result  = R
  debug '^280^', probe
  debug '^280^', result
  debug '^280^', optimize result
  debug '^280^', result is matcher
  #.........................................................................................................
  return done?()




############################################################################################################
if require.main is module then do =>
  test @
  # @[ "DRB foobar" ]()
  # test @[ "DRB no shared state in WASM module" ]
  # @[ "DRB path compression" ]()


