

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
{ inspect }               = require 'util'
rpr = ( P... ) ->
  return ( \
    ( inspect x, { depth: Infinity, maxArrayLength: Infinity, breakLength: Infinity, compact: true, } ) \
      for x in P ).join ' '
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
    await T.perform probe, matcher, null, -> return new Promise ( resolve, reject ) ->
      result  = HLR.sort probe
      T.ok probe isnt matcher
      T.ok probe isnt result
      T.eq result, matcher
      # debug '^334^', rpr result
      resolve result
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HLR sort 3" ] = ( T, done ) ->
  HLR       = ( require hollerith_path ).HOLLERITH
  # info CND.blue   'cmp_total    ', "[ 1, ],     [ 1, -1, ]", VNR.cmp_total   [ 1, ],     [ 1, -1, ]
  # info CND.blue   'cmp_total    ', "[ 1, ],     [ 1,  0, ]", VNR.cmp_total   [ 1, ],     [ 1,  0, ]
  # info CND.blue   'cmp_total    ', "[ 1, ],     [ 1, +1, ]", VNR.cmp_total   [ 1, ],     [ 1, +1, ]
  # info CND.blue   'cmp_total    ', "----------------------"
  # info CND.blue   'cmp_total    ', "[ 1, 0, ],  [ 1, -1, ]", VNR.cmp_total   [ 1, 0, ],  [ 1, -1, ]
  # info CND.blue   'cmp_total    ', "[ 1, 0, ],  [ 1,  0, ]", VNR.cmp_total   [ 1, 0, ],  [ 1,  0, ]
  # info CND.blue   'cmp_total    ', "[ 1, 0, ],  [ 1, +1, ]", VNR.cmp_total   [ 1, 0, ],  [ 1, +1, ]
  # info()
  # info CND.lime   'cmp_partial  ', "[ 1, ],     [ 1, -1, ]", VNR.cmp_partial [ 1, ],     [ 1, -1, ]
  # info CND.lime   'cmp_partial  ', "[ 1, ],     [ 1,  0, ]", VNR.cmp_partial [ 1, ],     [ 1,  0, ]
  # info CND.lime   'cmp_partial  ', "[ 1, ],     [ 1, +1, ]", VNR.cmp_partial [ 1, ],     [ 1, +1, ]
  # info CND.lime   'cmp_partial  ', "----------------------"
  # info CND.lime   'cmp_partial  ', "[ 1, 0, ],  [ 1, -1, ]", VNR.cmp_partial [ 1, 0, ],  [ 1, -1, ]
  # info CND.lime   'cmp_partial  ', "[ 1, 0, ],  [ 1,  0, ]", VNR.cmp_partial [ 1, 0, ],  [ 1,  0, ]
  # info CND.lime   'cmp_partial  ', "[ 1, 0, ],  [ 1, +1, ]", VNR.cmp_partial [ 1, 0, ],  [ 1, +1, ]
  # info()
  info CND.steel  'cmp_fair     ', "[ 1, ],     [ 1, -1, ]", HLR.cmp    [ 1, ],     [ 1, -1, ]
  info CND.steel  'cmp_fair     ', "[ 1, ],     [ 1,  0, ]", HLR.cmp    [ 1, ],     [ 1,  0, ]
  info CND.steel  'cmp_fair     ', "[ 1, ],     [ 1, +1, ]", HLR.cmp    [ 1, ],     [ 1, +1, ]
  info CND.steel  'cmp_fair     ', "----------------------"
  info CND.steel  'cmp_fair     ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp    [ 1, 0, ],  [ 1, -1, ]
  info CND.steel  'cmp_fair     ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp    [ 1, 0, ],  [ 1,  0, ]
  info CND.steel  'cmp_fair     ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp    [ 1, 0, ],  [ 1, +1, ]
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "test for stable sort 2" ] = ( T, done ) ->
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
  T?.eq C, { sign_delta: 2147483648, u32_width: 4, nr_min: -2147483648, nr_max: 2147483647, }
  T?.eq defaults, { hlr_constructor_cfg: { vnr_width: 5, validate: true } }
  done()
  return null



############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "HLR._first_nonzero_is_negative()" ]
  # test @[ "HLR class and instance attributes" ]
  # test @[ "HLR basics" ]
  # test @[ "HLR sort 2" ]
  # test @[ "HLR sort 3" ]
  # test @[ "test for stable sort 2" ]




