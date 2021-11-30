
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/PREPARATION'
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
@[ "DRB get_fontmetrics()" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  RBW                 = null
  # RBW                 = require '../../../apps/rustybuzz-wasm/pkg'
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  # { Tbl, }            = require '../../../apps/icql-dba-tabulate'
  # path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  matcher             =
    fontnick:           'gi'
    ascender:           -710
    capital_height:     -664
    descender:          290
    scale:              1
    units_per_em:       1000
    x_height:           -400
    angle:              -17
  #.........................................................................................................
  db          = new DBay()
  # dtab        = new Tbl { db, }
  drb         = new Drb { db, RBW, temporary: true, }
  fontnick    = 'gi'
  drb.prepare_font { fontnick, }
  fm          = drb.get_fontmetrics { fontnick, }
  urge '^6464^', fm
  T?.eq fm, matcher
  #.........................................................................................................
  # cgid_map            = drb.get_cgid_map { fontnick, chrs, }
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB get_fontmetrics() throws Dbr_unknown_or_unprepared_fontnick" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  #.........................................................................................................
  db          = new DBay()
  drb         = new Drb { db, }
  fontnick    = 'xxx'
  error       = null
  try
    fm          = drb.get_fontmetrics { fontnick, }
  catch error
    T.eq ( type_of error ), 'dbr_unknown_or_unprepared_fontnick'
  T?.ok error?
  #.........................................................................................................
  return done?()




############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "DRB get_fontmetrics()" ]
  # @[ "DRB foobar" ]()
  # test @[ "DRB no shared state in WASM module" ]
  # @[ "DRB path compression" ]()
  # test @[ "DRB can pass in custom RBW" ]
  # @[ "DRB get_cgid_map()" ]()
  # @[ "DRB insert_outlines()" ]()
  # test @[ "DRB RBW arrange() returns coordinates acc to font upem" ]
  # test @[ "DRB RBW arrange() honors missing outlines" ]
  # test @[ "DRB get_fontmetrics()" ]
  # test @[ "DRB insert_outlines()" ]
  # test @[ "DRB hyphens in many fonts behave unsurprisingly" ]


