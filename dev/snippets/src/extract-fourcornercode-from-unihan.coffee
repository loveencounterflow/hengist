
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/NG'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate
  validate_optional }     = types


#===========================================================================================================
class Segment

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    @input  = []
    @output = []
    return undefined

############################################################################################################
if module is require.main then do =>
  PATH = require 'node:path'
  #.........................................................................................................
  path = PATH.resolve PATH.join __dirname, '../../../../../io/mingkwai-rack/jzrds/unicode.org-ucd-v14.0/Unihan_DictionaryLikeData.txt'
  count = 0
  entries = []
  for line from GUY.fs.walk_lines path
    # result.push line
    [ ucid_text, cat, value, ] = line.split '\t'
    continue unless cat is 'kFourCornerCode'
    continue unless value?
    count++
    codes = value.split /\s+/
    cid_hex = ucid_text[ 2 .. ]
    cid     = parseInt cid_hex, 16
    chr     = String.fromCodePoint cid
    for code in codes
      # debug { count, cid_hex, chr, code, }
      entries.push [ code, chr, ]
  entries.sort ( a, b ) ->
    return +1 if a[ 0 ] > b[ 0 ]
    return -1 if a[ 0 ] < b[ 0 ]
    return null
  # info entry for entry in entries
  chrs    = ( e[ 1 ] for e in entries ).join ''
  probes  = Array.from '厂厃厄厅历厇厈厉厊压厌厍厎厏厐厑厒厓厔厕厖厗厘厙厚厛厜厝厞原'
  for probe in probes
    continue unless ( match = chrs.match ///^.*(.{0}#{probe}.{25}).*///u )?
    help match[ 1 ]
  return null



