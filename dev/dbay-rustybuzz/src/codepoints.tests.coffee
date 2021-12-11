
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/CODEPOINTS/BASIC'
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
{ width_of
  to_width }              = require 'to-width'

#-----------------------------------------------------------------------------------------------------------
@[ "DRB get_assigned_unicode_chrs()" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  # path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  #.........................................................................................................
  do =>
    db          = new DBay()
    drb         = new Drb { db, temporary: true, }
    result      = drb.get_assigned_unicode_chrs()
    result_txt  = result.join ''
    debug '^98402^', to_width result_txt, 1500
    widths      = {}
    for chr in result
      width = width_of chr
      ( widths[ width ] ?= [] ).push chr
    for width, chrs of widths
      chrs = chrs.join ''
      debug '^98402^', width, to_width chrs, 150
    ### as of NodeJS v16.9.1 with  Unicode 13 (?) ###
    T?.ok result.length >= 143_439
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB arrange() uses correct GIDs for specials" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  db                  = new DBay()
  drb                 = new Drb { db, temporary: true, }
  text                = "買ne 來ca"
  { specials        } = Drb.C
  { schema          } = drb.cfg
  #.........................................................................................................
  fontnick            = 'gr'
  text                = "abc&wbr;x&shy;y&nl;z u近Ϣk"
  text                = drb.prepare_text { text, }
  doc                 = 1
  par                 = 1
  #.....................................................................................................
  matcher = [
    { trk: 1, b1: 0,  chrs: 'a',        fontnick: 'gr', gid: 66, nobr: 0, br: null }
    { trk: 1, b1: 1,  chrs: 'b',        fontnick: 'gr', gid: 67, nobr: 0, br: null }
    { trk: 1, b1: 2,  chrs: 'c',        fontnick: 'gr', gid: 68, nobr: 0, br: null }
    { trk: 1, b1: 3,  chrs: '\u{200b}', fontnick: 'gr', gid: -5, nobr: 1, br: 'wbr' }
    { trk: 1, b1: 6,  chrs: 'x',        fontnick: 'gr', gid: 89, nobr: 1, br: null }
    { trk: 1, b1: 7,  chrs: '\u{00ad}', fontnick: 'gr', gid: -6, nobr: 0, br: 'shy' }
    { trk: 1, b1: 9,  chrs: 'y',        fontnick: 'gr', gid: 90, nobr: 0, br: null }
    { trk: 1, b1: 10, chrs: '\n',       fontnick: 'gr', gid: -7, nobr: 0, br: 'nl' }
    { trk: 1, b1: 11, chrs: 'z',        fontnick: 'gr', gid: 91, nobr: 0, br: null }
    { trk: 1, b1: 12, chrs: ' ',        fontnick: 'gr', gid: -4, nobr: 0, br: 'spc' }
    { trk: 1, b1: 13, chrs: 'u',        fontnick: 'gr', gid: 86, nobr: 0, br: null }
    { trk: 1, b1: 14, chrs: '\u{200b}', fontnick: 'gr', gid: -5, nobr: 0, br: 'wbr' }
    { trk: 1, b1: 17, chrs: '近',        fontnick: 'gr', gid: -2, nobr: 0, br: null }
    { trk: 1, b1: 20, chrs: '\u{200b}', fontnick: 'gr', gid: -5, nobr: 0, br: 'wbr' }
    { trk: 1, b1: 23, chrs: 'Ϣ',        fontnick: 'gr', gid: -1, nobr: 0, br: null }
    { trk: 1, b1: 25, chrs: 'k',        fontnick: 'gr', gid: 76, nobr: 0, br: 'end' }
    { trk: 2, b1: 2,  chrs: 'c',        fontnick: 'gr', gid: 68, nobr: 0, br: null }
    { trk: 2, b1: 3,  chrs: '\u{200b}', fontnick: 'gr', gid: -5, nobr: 0, br: 'wbr' }
    { trk: 2, b1: 6,  chrs: 'x',        fontnick: 'gr', gid: 89, nobr: 0, br: null }
    { trk: 3, b1: 7,  chrs: '-',        fontnick: 'gr', gid: 14, nobr: 0, br: 'hhy' }
    { trk: 4, b1: 14, chrs: '\u{200b}', fontnick: 'gr', gid: -5, nobr: 0, br: 'wbr' }
    { trk: 5, b1: 20, chrs: '\u{200b}', fontnick: 'gr', gid: -5, nobr: 0, br: 'wbr' }
    ]
  #.....................................................................................................
  # drb.register_fontnick { fontnick, }
  drb.prepare_font      { fontnick, }
  drb.arrange           { fontnick, text, doc, par, }
  #.....................................................................................................
  console.table db.all_rows SQL"select * from #{schema}.ads order by trk, b1;"
  result  = db.all_rows SQL"select * from #{schema}.ads order by trk, b1;"
  keys    = new Set Object.keys matcher[ 0 ]
  for ad in result
    for key of ad
      delete ad[ key ] unless keys.has key
  T?.eq result, matcher
  #.....................................................................................................
  return done?()

############################################################################################################
if require.main is module then do =>
  # test @
  test @[ "DRB arrange() uses correct GIDs for specials" ]


