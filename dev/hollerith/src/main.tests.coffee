

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HOLLERITH/TESTS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
# #...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   type_of }               = types
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  defaults
  validate }              = types.export()
hollerith_path            = '../../../apps/hollerith'


#-----------------------------------------------------------------------------------------------------------
test_basics = ( T, VNR ) ->
  T.eq ( d = VNR.create()                  ), [ 0, ]
  T.eq ( d = VNR.create       [ 4, 6, 5, ] ), [ 4, 6, 5, ]
  T.eq ( d = VNR.deepen       d            ), [ 4, 6, 5, 0, ]
  T.eq ( d = VNR.deepen       d, 42        ), [ 4, 6, 5, 0, 42, ]
  T.eq ( d = VNR.advance      d            ), [ 4, 6, 5, 0, 43, ]
  T.eq ( d = VNR.recede       d            ), [ 4, 6, 5, 0, 42, ]
  T.ok ( VNR.create   d ) isnt d
  T.ok ( VNR.deepen   d ) isnt d
  T.ok ( VNR.advance  d ) isnt d
  T.ok ( VNR.recede   d ) isnt d
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HLR basics" ] = ( T, done ) ->
  { Hollerith } = require hollerith_path
  test_basics T, new Hollerith { validate: true, }
  test_basics T, new Hollerith { validate: false, }
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HLR encode Infinity" ] = ( T, done ) ->
  Hollerith = ( require hollerith_path ).Hollerith
  HLR       = ( require hollerith_path ).HOLLERITH
  debug '^28974^', Hollerith.C.u32_nr_max
  debug '^28974^', Hollerith.C.u32_nr_min
  debug '^28974^', HLR.encode [ +Infinity, ]
  debug '^28974^', HLR.encode [ -Infinity, ]
  T?.eq ( HLR._encode_u32 [ +Infinity, ] ), Buffer.from 'ffffffff80000000800000008000000080000000', 'hex'
  T?.eq ( HLR._encode_u32 [ -Infinity, ] ), Buffer.from '0000000080000000800000008000000080000000', 'hex'
  T?.eq ( HLR._encode_bcd [ +Infinity, ] ), '+zzzz,+...0,+...0,+...0,+...0'
  T?.eq ( HLR._encode_bcd [ -Infinity, ] ), '!zzzz,+...0,+...0,+...0,+...0'
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HLR sort 2" ] = ( T, done ) ->
  matchers = [
    [ [ 1, 0, -1 ], [ 1 ], [ 1, 0 ], [ 1, 0, 1 ], [ 2, -1 ], [ 2 ], [ 2, 0 ], [ 2, 1 ] ]
    [ [ 2 ],    [ 2, 0 ], ]
    [ [ Infinity, -1, ], [ Infinity, ], [ Infinity, 1, ], ]
    [ [ Infinity, -1, ], [ Infinity, 0, ], [ Infinity, 1, ], ]
    [ [ 1, ], ]
    [ [ 1, ], [ 2, ] ]
    ]
  HLR       = ( require hollerith_path ).HOLLERITH
  for matcher in matchers
    probe   = [ matcher..., ]
    await T.perform probe, true, null, -> return new Promise ( resolve, reject ) ->
      # probe   = CND.shuffle probe
      result  = HLR.sort probe
      T.ok probe isnt matcher
      T.ok probe isnt result
      T.eq result, matcher
      #.....................................................................................................
      # debug '^31312^', ( HLR._encode_u32 p for p in probe )
      # debug '^31312^', ( HLR._encode_u32 m for m in matcher)
      #.....................................................................................................
      # debug '^334^', rpr result
      resolve true
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HLR sort 3" ] = ( T, done ) ->
  HLR       = ( require hollerith_path ).HOLLERITH
  BCD       = new ( require hollerith_path ).Hollerith { format: 'bcd', }
  #.........................................................................................................
  cmp_bcd = ( a, b ) ->
    return  0 if a == b
    return +1 if a > b
    return -1
  #.........................................................................................................
  info CND.grey   'cmp        ', "----------------------"
  info CND.steel  'cmp        ', "[ 1, ],     [ 1, -1, ]", HLR.cmp    [ 1, ],     [ 1, -1, ]
  info CND.steel  'cmp        ', "[ 1, ],     [ 1,  0, ]", HLR.cmp    [ 1, ],     [ 1,  0, ]
  info CND.steel  'cmp        ', "[ 1, ],     [ 1, +1, ]", HLR.cmp    [ 1, ],     [ 1, +1, ]
  info CND.steel  'cmp        ', "----------------------"
  info CND.steel  'cmp        ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp    [ 1, 0, ],  [ 1, -1, ]
  info CND.steel  'cmp        ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp    [ 1, 0, ],  [ 1,  0, ]
  info CND.steel  'cmp        ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp    [ 1, 0, ],  [ 1, +1, ]
  #.........................................................................................................
  info CND.grey   'cmp_blobs  ', "----------------------"
  info CND.steel  'cmp_blobs  ', "[ 1, ],     [ 1, -1, ]", HLR.cmp ( HLR.encode [ 1, ] ),    ( HLR.encode [ 1, -1, ] )
  info CND.steel  'cmp_blobs  ', "[ 1, ],     [ 1,  0, ]", HLR.cmp ( HLR.encode [ 1, ] ),    ( HLR.encode [ 1,  0, ] )
  info CND.steel  'cmp_blobs  ', "[ 1, ],     [ 1, +1, ]", HLR.cmp ( HLR.encode [ 1, ] ),    ( HLR.encode [ 1, +1, ] )
  info CND.steel  'cmp_blobs  ', "----------------------"
  info CND.steel  'cmp_blobs  ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp ( HLR.encode [ 1, 0, ] ), ( HLR.encode [ 1, -1, ] )
  info CND.steel  'cmp_blobs  ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp ( HLR.encode [ 1, 0, ] ), ( HLR.encode [ 1,  0, ] )
  info CND.steel  'cmp_blobs  ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp ( HLR.encode [ 1, 0, ] ), ( HLR.encode [ 1, +1, ] )
  #.........................................................................................................
  info CND.grey   'cmp bcd    ', "----------------------"
  info CND.steel  'cmp bcd    ', "[ 1, ],     [ 1, -1, ]", cmp_bcd ( BCD.encode [ 1, ] ),    ( BCD.encode [ 1, -1, ] )
  info CND.steel  'cmp bcd    ', "[ 1, ],     [ 1,  0, ]", cmp_bcd ( BCD.encode [ 1, ] ),    ( BCD.encode [ 1,  0, ] )
  info CND.steel  'cmp bcd    ', "[ 1, ],     [ 1, +1, ]", cmp_bcd ( BCD.encode [ 1, ] ),    ( BCD.encode [ 1, +1, ] )
  info CND.steel  'cmp bcd    ', "----------------------"
  info CND.steel  'cmp bcd    ', "[ 1, 0, ],  [ 1, -1, ]", cmp_bcd ( BCD.encode [ 1, 0, ] ), ( BCD.encode [ 1, -1, ] )
  info CND.steel  'cmp bcd    ', "[ 1, 0, ],  [ 1,  0, ]", cmp_bcd ( BCD.encode [ 1, 0, ] ), ( BCD.encode [ 1,  0, ] )
  info CND.steel  'cmp bcd    ', "[ 1, 0, ],  [ 1, +1, ]", cmp_bcd ( BCD.encode [ 1, 0, ] ), ( BCD.encode [ 1, +1, ] )
  #.........................................................................................................
  probes_and_matchers = [
    [ [ [ 1, ],     [ 1, -1, ], ],  +1, ]
    [ [ [ 1, ],     [ 1,  0, ], ],  0, ]
    [ [ [ 1, ],     [ 1, +1, ], ],  -1, ]
    [ [ [ 1, 0, ],  [ 1, -1, ], ],  +1, ]
    [ [ [ 1, 0, ],  [ 1,  0, ], ],  0, ]
    [ [ [ 1, 0, ],  [ 1, +1, ], ],  -1, ]
    ]
  #.........................................................................................................
  compare = ( description, a, b, a_blob, b_blob, r1, r2 ) ->
    return null if equals r1, r2
    warn "^34234^ when comparing"
    warn description
    warn "using"
    warn a
    warn b
    warn a_blob
    warn b_blob
    warn "r1", r1
    warn "r1", r2
    warn "didn't test equal"
    T?.fail "comparison failed"
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    await T.perform probe, matcher, null, -> return new Promise ( resolve, reject ) ->
      [ a, b, ] = probe
      a_blob    = HLR.encode a
      b_blob    = HLR.encode b
      result_1  = HLR.cmp       a, b
      result_1r = HLR.cmp       b, a
      result_2  = HLR.cmp_blobs a_blob, b_blob
      result_2r = HLR.cmp_blobs b_blob, a_blob
      compare "result_1,  -result_1r", a, b, a_blob, b_blob, result_1,  -result_1r
      compare "result_2,  -result_2r", a, b, a_blob, b_blob, result_2,  -result_2r
      compare "result_1,   result_2 ", a, b, a_blob, b_blob, result_1,   result_2
      compare "result_1r,  result_2r", a, b, a_blob, b_blob, result_1r,  result_2r
      # T.eq result, matcher
      # debug '^334^', { a, b, result_1, result_1r, result_2, result_2r, }
      resolve result_1
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "test for stable sort" ] = ( T, done ) ->
  n         = 1e4
  m         = Math.floor n / 3
  ds        = ( [ nr, ( CND.random_integer -m, +m ) ] for nr in [ 1 .. n ])
  ds.sort ( a, b ) -> a[ 1 ] - b[ 1 ]
  prv_r     = -Infinity
  prv_nr    = -Infinity
  is_stable = true
  for [ nr, r, ] in ds
    if r is prv_r
      is_stable = is_stable and nr > prv_nr
    prv_r   = r
    prv_nr  = nr
  T.ok is_stable
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "HLR._first_nonzero_is_negative()" ] = ( T, done ) ->
  HLR = ( require hollerith_path ).HOLLERITH
  #.........................................................................................................
  probes_and_matchers = [
    [[ [3,4,0,0,],        2, ], false, ]
    [[ [3,4,0,-1,],       2, ], true, ]
    [[ [3,4,0,-1,0,0,],   2, ], true, ]
    [[ [3,4,0,1,-1,0,0,], 2, ], false, ]
    [[ [3,4,0,1,-1,0,0,], 0, ], false, ]
    [[ [3,4,0,0,],        3, ], false, ]
    [[ [3,4,0,0,],        4, ], false, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ list, first_idx, ] = probe
      resolve HLR._first_nonzero_is_negative list, first_idx
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HLR class and instance attributes" ] = ( T, done ) ->
  Hollerith = ( require hollerith_path ).Hollerith
  HLR       = ( require hollerith_path ).HOLLERITH
  debug Hollerith.cfg
  debug HLR.cfg
  debug Hollerith.C
  C         = { Hollerith.C... }
  defaults  = Hollerith.C.defaults
  delete C.defaults
  T?.eq C, {
    u32_sign_delta:   2147483648
    u32_width:        4
    u32_nr_min:       -2147483648
    u32_nr_max:       2147483647
    bcd_dpe:          4
    bcd_base:         36
    bcd_plus:         '+'
    bcd_minus:        '!'
    bcd_padder:       '.'
    bcd_nr_max:       1679615
    bcd_nr_min: -1679615 }
  T?.eq defaults, { hlr_constructor_cfg: { vnr_width: 5, validate: false, format: 'u32' } }
  done()
  return null



############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "HLR encode Infinity" ]
  # test @[ "HLR class and instance attributes" ]
  # test @[ "HLR basics" ]
  # test @[ "HLR sort 2" ]
  # test @[ "HLR sort 3" ]
  # test @[ "test for stable sort 2" ]




