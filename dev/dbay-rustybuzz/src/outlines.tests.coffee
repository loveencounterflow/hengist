
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/OUTLINES/BASIC'
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
@[ "DRB get_cgid_map()" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  # path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  chrs                = "affirm無字"
  matcher             = new Map [ [ 66, 'a', ], [ 1536, 'ffi', ], [ 83, 'r', ], [ 78, 'm', ], ]
  #.........................................................................................................
  do =>
    db          = new DBay()
    drb         = new Drb { db, temporary: true, }
    fontnick    = 'gi'
    drb.prepare_font { fontnick, }
    debug '^33234^', result = drb.get_cgid_map { fontnick, chrs, }
    result.delete null
    T?.eq ( type_of result ), 'map'
    T?.eq result, matcher
  #.........................................................................................................
  do =>
    db          = new DBay()
    drb         = new Drb { db, temporary: true, }
    fontnick    = 'gi'
    drb.prepare_font { fontnick, }
    T?.throws /not a valid dbr_get_cgid_map_cfg/, => drb.get_cgid_map { fontnick, cids: [ 42, ], }
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB insert_outlines()" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  { Tbl, }            = require '../../../apps/icql-dba-tabulate'
  # path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  chrs                = "'ab-c'."
  matcher             = new Map [ [ 116, 85 ], [ 104, 73 ], [ 101, 70 ], [ 114, 83 ], [ 39, 8 ], [ 115, 84 ], [ 32, 1 ], [ 117, 86 ], [ 98, 67 ], ]
  #.........................................................................................................
  do =>
    db          = new DBay()
    dtab        = new Tbl { db, }
    drb         = new Drb { db, temporary: true, }
    fontnick    = 'gi'
    drb.prepare_font { fontnick, }
    drb.insert_outlines { fontnick, chrs, }
    result      = db.all_rows SQL"select * from drb.outlines order by chrs;"
    for row in result
      { pd_blob, } = guy.obj.pluck_with_fallback row, null, 'pd_blob'
      T?.eq ( type_of pd_blob ), 'buffer'
      if row.text is '.'
        T?.eq row, {
          fontnick: 'gi',
          gid:      15,
          sid:      'o15gi',
          chrs:     '.',
          x:        25,
          y:        -101,
          x1:       135,
          y1:       14,
          pd:       'M90-101C54-101 25-72 25-36C25-10 44 14 70 14C106 14 135-15 135-51C135-77 116-101 90-101Z' }
    # T?.eq ( type_of result ), 'map'
    # T?.eq result, matcher
    echo dtab._tabulate db SQL"""
      select
          fontnick,
          gid,
          sid,
          chrs,
          x,
          y,
          x1,
          y1,
          substr( pd, 0, 10 ) as "(pd)"
        from drb.outlines
        order by chrs;"""
  #.........................................................................................................
  # cgid_map            = drb.get_cgid_map { fontnick, chrs, }
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB RBW arrange() returns coordinates acc to font upem" ] = ( T, done ) ->
  # T?.halt_on_error()
  use_linked_RBW      = true
  globalThis.info     = info
  RBW                 = require '../../../apps/rustybuzz-wasm/pkg'
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  result              = {}
  #.........................................................................................................
  for set_id, doc in [ '3a', '3b', ]
    db                  = new DBay()
    if use_linked_RBW
      debug '^4445^', CND.reverse " using linked RBW "
      drb                 = new Drb { db, temporary: true, RBW, }
      T?.ok drb.RBW is RBW
    else
      drb                 = new Drb { db, temporary: true, }
    do =>
      { chrs
        cids
        cgid_map
        text
        fontnick
        fspath          } = H.settings_from_set_id set_id
      #.....................................................................................................
      drb.register_fontnick { fontnick, fspath, }
      drb.prepare_font      { fontnick, }
      drb.insert_outlines   { fontnick, cgid_map, cids, chrs, }
      result[ fontnick ] = ( drb.arrange { fontnick, text, doc, par: 1, trk: 1, } )[ 0 ]
      delete result[ fontnick ].id
  #.........................................................................................................
  T?.eq result, {
    djvsi: {
      doc:    0,
      par:    1,
      trk:    1,
      sgi:    1,
      osgi:   null,
      gid:    68,
      b1:     0,
      b2:     1,
      x:      0,
      y:      0,
      dx:     596,
      dy:     0,
      x1:     596,
      chrs:   'a',
      sid:    'o68djvsi',
      nobr:   0,
      br:     null, },
    eg8i:  {
      doc:    1,
      par:    1,
      trk:    1,
      sgi:    1,
      osgi:   null,
      gid:    66,
      b1:     0,
      b2:     1,
      x:      0,
      y:      0,
      dx:     492,
      dy:     0,
      x1:     492,
      chrs:   'a',
      sid:    'o66eg8i',
      nobr:   0,
      br:     null, } }
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB RBW arrange() honors missing outlines" ] = ( T, done ) ->
  # T?.halt_on_error()
  globalThis.info     = info
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  db                  = new DBay()
  drb                 = new Drb { db, temporary: true, }
  set_id              = 'small-eg8i'
  text                = "買ne 來ca"
  { specials }        = Drb.C
  #.........................................................................................................
  { chrs
    cids
    cgid_map
    fontnick
    fspath          } = H.settings_from_set_id set_id
  #.....................................................................................................
  matcher = [
    { gid: 0,  b1: 0,  b2: 3,  x: 0,    y: 0, dx: 1000, dy: 0, chrs: '買', sid: 'o0eg8i' }
    { gid: 79, b1: 3,  b2: 4,  x: 1000, y: 0, dx: 508,  dy: 0, chrs: 'n', sid: 'o79eg8i' }
    { gid: 70, b1: 4,  b2: 5,  x: 1508, y: 0, dx: 367,  dy: 0, chrs: 'e', sid: 'o70eg8i' }
    { gid: 1,  b1: 5,  b2: 6,  x: 1875, y: 0, dx: 243,  dy: 0, chrs: ' ', sid: 'o1eg8i', br: 'spc' }
    { gid: 0,  b1: 6,  b2: 9,  x: 2118, y: 0, dx: 1000, dy: 0, chrs: '來', sid: 'o0eg8i' }
    { gid: 68, b1: 9,  b2: 10, x: 3118, y: 0, dx: 359,  dy: 0, chrs: 'c', sid: 'o68eg8i' }
    { gid: 66, b1: 10, b2: 11, x: 3477, y: 0, dx: 492,  dy: 0, chrs: 'a', sid: 'o66eg8i' }
    ]
  #.....................................................................................................
  drb.register_fontnick { fontnick, fspath, }
  drb.prepare_font      { fontnick, }
  drb.insert_outlines   { fontnick, cgid_map, cids, chrs, }
  result = drb.arrange { fontnick, text, doc: 1, par: 1, trk: 1, }
  # result = result[ 1 ... result.length - 1 ]
  urge '^45958^', ad.chrs, ad.sid, ad for ad in result
  for ad, idx in result
    help '^33443^', ad
    urge '^33443^', matcher[ idx ]
    keys = Object.keys matcher[ idx ]
    for key of ad
      delete ad[ key ] unless key in keys
    if equals ad, matcher[ idx ]
      T.ok true
      help '^45958^', ad.chrs, ad.sid, ad
    else
      warn '^45958^', ad.chrs, ad.sid, ad
      warn '^45958^', ad.chrs, ad.sid, CND.reverse matcher[ idx ]
      T.ok false
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "___ DRB hyphens in many fonts behave unsurprisingly" ] = ( T, done ) ->
  ### Less of a test but more of a routine to ensure that our naïve assumption that the hyphen in 'all
  fonts' behaves such that we can always replace the outlines for `x&shy;` with those for `x-` and just add
  the hyphen's length. ###
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  db                  = new DBay()
  drb                 = new Drb { db, temporary: true, }
  # { specials }        = Drb.C
  letters             = Array.from """
    abcdefghijklmnopqrstuvwxyz
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    0123456789
    ,.-;:_–—#'+*`´^°!"§$%&/()=?""".replace /\s+/g, ''
  # debug '^3098^', letters
  # debug '^3098^', H.fontnicks_and_paths
  #.........................................................................................................
  for fontnick, fspath of H.fontnicks_and_paths
    drb.register_fontnick { fontnick, fspath, }
    drb.prepare_font      { fontnick, }
    hyphen_dx = ( drb.arrange { fontnick, text: '-', } )[ 0 ].dx
    info '^3441^', { fontnick, hyphen_dx, }
    for letter in letters
      ads_s = drb.arrange { fontnick, text: "#{letter}\xad", }
      ads_h = drb.arrange { fontnick, text: "#{letter}-",    }
      s_dx  = ads_s[ 1 ].x + hyphen_dx
      h_dx  = ads_h[ 1 ].x + ads_h[ 1 ].dx
      T?.eq s_dx, h_dx
      if s_dx isnt h_dx
        info { fontnick, letter, }
        debug '^68402^', ad for ad in ads_s
        urge  '^68402^', ad for ad in ads_h
  return done?()




############################################################################################################
if require.main is module then do =>
  # test @
  # @[ "DRB foobar" ]()
  # test @[ "DRB no shared state in WASM module" ]
  # @[ "DRB path compression" ]()
  # test @[ "DRB can pass in custom RBW" ]
  # @[ "DRB get_cgid_map()" ]()
  # @[ "DRB insert_outlines()" ]()
  @[ "DRB RBW arrange() returns coordinates acc to font upem" ]()
  # test @[ "DRB RBW arrange() honors missing outlines" ]
  # test @[ "DRB insert_outlines()" ]
  # test @[ "DRB hyphens in many fonts behave unsurprisingly" ]


