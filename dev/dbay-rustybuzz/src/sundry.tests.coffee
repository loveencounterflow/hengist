
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
reveal                    = ( text ) ->
  return text.replace /[^\x20-\x7f]/ug, ( $0 ) -> "&#x#{($0.codePointAt 0).toString 16};"


#-----------------------------------------------------------------------------------------------------------
@[ "DRB RBW prepare_text()" ] = ( T, done ) ->
  probes_and_matchers = [
    [ [ null, true, 'extraordinary',              ], 'ex&#xad;tra&#xad;or&#xad;di&#xad;nary',       ]
    [ [ null, true, 'extra-ordinary',             ], 'ex&#xad;tra-&#x200b;or&#xad;di&#xad;nary',    ]
    [ [ null, true, 'extra&shy;ordinary',         ], 'ex&#xad;tra&#xad;or&#xad;di&#xad;nary',       ]
    [ [ null, true, 'extra\n\nordinary',          ], 'ex&#xad;tra or&#xad;di&#xad;nary',            ]
    [ [ null, true, '  xxx  ',                    ], 'xxx',                                         ]
    [ [ null, true, '&nbsp;xxx  ',                ], '&#xa0;xxx',                                   ]
    [ [ null, true, '&nbsp;xxx\n\n\n',            ], '&#xa0;xxx',                                   ]
    [ [ null, true, 'xxx&nl;',                    ], 'xxx&#xa;',                                    ]
    [ [ null, true, 'first &nl;\n  second'        ], 'first&#xa;sec&#xad;ond',                      ]
    [ [ null, true, 'first &nl;&nl; &nl;  second' ], 'first &#xa;&#xa;&#xa;sec&#xad;ond',           ]
    ]
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  db                  = new DBay()
  drb                 = new Drb { db, temporary: true, }
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      # [ cfg, do_reveal, text, ]  = probe
      cfg                   = probe[ 0 ]
      do_reveal             = probe[ 1 ]
      text                  = probe[ 2 ]
      result                = drb.prepare_text { cfg..., text, }
      result                = H.reveal result if do_reveal
      # T?.eq result, matcher
      resolve result
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB RBW decode_ncrs()" ] = ( T, done ) ->
  probes_and_matchers = [
    [ [ false, '&#x5443;&#x4e00;',  ],            '呃一', ]
    [ [ true,  '&wbr;',             ],            '&#x200b;', ]
    [ [ true,  '&shy;',             ],            '&#xad;', ]
    [ [ true,  '&nl;',              ],            '&#xa;', ]
    ]
  #.........................................................................................................
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  db                  = new DBay()
  drb                 = new Drb { db, temporary: true, }
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      # [ do_reveal, text, ]  = probe
      do_reveal             = probe[ 0 ]
      text                  = probe[ 1 ]
      result                = drb._decode_entities text
      result                = reveal result if do_reveal
      # T?.eq result, matcher
      resolve result
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DRB RBW finds UAX#14 breakpoints" ] = ( T, done ) ->
  # T?.halt_on_error()
  ### TAINT make this a DRB method ###
  _prepare_text = ( text ) ->
    ITXT = require 'intertext'
    R = text
    R = R.replace /\n/g, ' '
    R = R.replace /\x20{2,}/g, ' '
    R = ITXT.HYPH.hyphenate R
    R = R.replace /&shy;/g, '\xad'
    R = R.replace /&wbr;/g, '\u200b'
    # debug '^9865^', ITXT.HYPH.reveal_hyphens R, '|'; process.exit 1
    return R
  ### TAINT make this a DRB method ###
  _escape_syms              = ( text ) ->
    R = text
    R = R.replace /\xad/g,   '&shy;'
    R = R.replace /\u200b/g, '&wbr;'
    return R
  reveal              = ( text ) ->
    return text.replace /[^\x20-\x7f]/ug, ( $0 ) -> "&#x#{($0.codePointAt 0).toString 16};"
  matcher             = 'con&#xad;fir&#xad;ma&#xad;tion/&#x200b;bias pro&#xad;duc&#xad;tion a&#x200b;b this&#x200b;&#x2014;&#x200b;or that'
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  db                  = new DBay()
  drb                 = new Drb { db, temporary: true, }
  #.........................................................................................................
  text                = 'confirmation/bias production a&wbr;&wbr;b this—or that'
  text                = _prepare_text text
  text_bfr            = Buffer.from text
  bris                = JSON.parse drb.RBW.find_line_break_positions text
  for bri, idx in bris
    break unless ( nxt_bri = bris[ idx + 1 ] )?
    part = text_bfr[ bri ... nxt_bri ].toString 'utf-8'
    part = _escape_syms part
    urge '^3409^', { bri, nxt_bri, }, rpr part
  parts = ( ( text_bfr[ bri ... bris[ idx + 1 ] ? Infinity ].toString 'utf-8' ) for bri, idx in bris )
  echo rpr new_text = parts.join drb.constructor.C.specials.wbr.chrs
  new_text  = new_text.replace /\xad\u200b/g, drb.constructor.C.specials.shy.chrs
  new_text  = new_text.replace /\x20\u200b/g,   '\x20'
  new_text  = new_text.replace /\u200b{2,}/g, drb.constructor.C.specials.wbr.chrs
  new_text  = new_text.replace /\u200b$/g, ''
  echo rpr reveal new_text
  T?.eq matcher, reveal new_text
  #.........................................................................................................
  RBW                 = require '../../../apps/rustybuzz-wasm/pkg'
  debug '^7098^', rpr RBW.decode_ncrs '&#x5443;&#x4e00;'
  # for name, matcher of require '../../../assets/html-character-entity-names'
  #   entity = "&#{name};"
  #   info '^5557^', entity, rpr matcher unless equals entity, matcher
  #   # T?.eq ( RBW.decode_ncrs entity ), matcher
  #.........................................................................................................
  return done?()





############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "DRB RBW prepare_text()" ]
  # test @[ "DRB RBW decode_ncrs()" ]
  test @[ "DRB RBW finds UAX#14 breakpoints" ]
