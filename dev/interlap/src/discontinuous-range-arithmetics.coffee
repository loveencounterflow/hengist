
'use strict'

############################################################################################################
CND                       = require 'cnd'
badge                     = 'DISCONTINUOUS-RANGE-ARITHMETICS'
rpr                       = CND.rpr
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
hex                       = ( n ) -> ( n.toString 16 ).toUpperCase().padStart 4, '0'
DRange                    = require 'drange'
merge_ranges              = require 'merge-ranges'
#...........................................................................................................
@types                    = new ( require 'intertype' ).Intertype()
{ isa
  validate
  declare
  cast
  type_of }               = @types.export()
LFT                       = require 'letsfreezethat'
# { lets
#   freeze }                = LFT
freeze                    = Object.freeze
MAIN                      = @

#===========================================================================================================
# TYPES
#-----------------------------------------------------------------------------------------------------------
declare 'urange_instance',    ( x ) -> x instanceof Urange
declare 'interlap_instance',  ( x ) -> x instanceof Interlap

#-----------------------------------------------------------------------------------------------------------
declare 'urange_segment', tests:
  "must be a list":                                         ( x ) -> @isa.list x
  "length must be 2":                                       ( x ) -> x.length is 2
  "lo boundary must be an infnumber":                       ( x ) -> isa.infnumber x[ 0 ]
  "hi boundary must be an infnumber":                       ( x ) -> isa.infnumber x[ 1 ]
  "lo boundary must be less than or equal to hi boundary":  ( x ) -> x[ 0 ] <= x[ 1 ]


#===========================================================================================================
# OOP
#-----------------------------------------------------------------------------------------------------------
class Urange
  ### TAINT add type checking to avoid silent failure of e.g. `new DRange [ 1, 3, ]` ###

  #---------------------------------------------------------------------------------------------------------
  constructor: ( P... ) ->
    @d = new DRange()
    # @d = ( require 'letsfreezethat' ).freeze new DRange()
    for p in P
      if isa.urange_instance p
        @d.add p.d
      else
        validate.urange_segment p
        @d.add p...
    Object.defineProperty @, 'length', get: -> @d.length
    return @

  #---------------------------------------------------------------------------------------------------------
  union: ( other ) ->
    other = ( new Urange other ) unless isa.urange_instance other
    @d.add other.d
    return @

  #---------------------------------------------------------------------------------------------------------
  difference: ( other ) ->
    other = ( new Urange other ) unless isa.urange_instance other
    @d.subtract other.d
    return @

  #---------------------------------------------------------------------------------------------------------
  as_lists: -> ( [ r.low, r.high, ] for r in @d.ranges )

@Urange = Urange


#===========================================================================================================
# FUN
#-----------------------------------------------------------------------------------------------------------
class Segment extends Array

  #---------------------------------------------------------------------------------------------------------
  constructor: ( lohi ) ->
    validate.urange_segment lohi if lohi
    super lohi[ 0 ], lohi[ 1 ]
    Object.defineProperty @, 'size',  get: @_size_of
    Object.defineProperty @, 'lo',    get: -> @[ 0 ]
    Object.defineProperty @, 'hi',    get: -> @[ 1 ]
    return freeze @

  #---------------------------------------------------------------------------------------------------------
  _size_of:           -> @[ 1 ] - @[ 0 ] + 1
  # @from:    ( P...  ) -> new Segment P...
  @from:  -> throw new Error "^778^ `Segment.from()` is not implemented"

#-----------------------------------------------------------------------------------------------------------
class Interlap  extends Array

  #---------------------------------------------------------------------------------------------------------
  constructor: ( segments ) ->
    super()
    Object.defineProperty @, 'size',    get: @_size_of
    Object.defineProperty @, 'lo',      get: -> @first?[ 0      ] ? null
    Object.defineProperty @, 'hi',      get: -> @last?[  1      ] ? null
    Object.defineProperty @, 'first',   get: -> @[ 0            ] ? null
    Object.defineProperty @, 'last',    get: -> @[ @length - 1  ] ? null
    Object.defineProperty @, '_drange', get: -> drange
    #.......................................................................................................
    if segments instanceof DRange
      drange    = segments
    else if segments instanceof Interlap
      drange    = segments._drange
    else if Array.isArray segments
      drange    = new DRange()
      segments  = [ segments[ 0 ]..., ] if segments.length is 1 and isa.generator segments[ 0 ]
      for segment in segments
        validate.urange_segment segment unless segment instanceof Segment
        drange.add segment...
    else
      throw new Error "^445^ unable to instantiate from a #{type_of segments} (#{rpr segments})"
    #.......................................................................................................
    MAIN._apply_segments_from_drange @, drange
    return freeze @

  #---------------------------------------------------------------------------------------------------------
  _size_of:           -> @reduce ( ( sum, segment ) -> sum + segment.size ), 0
  @from:  -> throw new Error "^776^ `Interlap.from()` is not implemented"
  # @from:  -> ( P...  ) -> MAIN.interlap_from_segments P...
  # @from:    ( P...  ) -> new Interlap P...

# npm install @scotttrinh/number-ranges
# drange-immutable

#-----------------------------------------------------------------------------------------------------------
@Interlap   = Interlap
@Segment  = Segment

#-----------------------------------------------------------------------------------------------------------
@segment_from_lohi      = ( lo, hi      ) -> new Segment if hi? then [ lo, hi, ] else [ lo, ]
@interlap_from_segments   = ( segments... ) -> new Interlap segments

#-----------------------------------------------------------------------------------------------------------
@as_list = ( me ) ->
  switch ( type = type_of me )
    when 'segment'  then return [ me..., ]
    when 'interlap' then return ( [ s..., ] for s in me )
  throw new Error "^3445^ expected a segment or an interlap, got a #{type}"

#-----------------------------------------------------------------------------------------------------------
@union = ( me, others... ) ->
  me      = new Interlap me unless me instanceof Interlap
  drange  = me._drange
  drange  = drange.add segment... for segment in me
  for other in others
    if other instanceof Interlap
      drange = drange.add segment... for segment in other
    else
      other   = new Segment other unless other instanceof Segment
      drange  = drange.add other...
  return new Interlap drange

# #-----------------------------------------------------------------------------------------------------------
# @_drange_as_interlap  = ( drange ) ->
#   return freeze @_sort Interlap.from ( ( new Segment [ r.low, r.high, ] ) for r in drange.ranges )

#-----------------------------------------------------------------------------------------------------------
@_sort = ( interlap ) -> interlap.sort ( a, b ) ->
  ### NOTE correct but only the first two terms are ever needed ###
  return -1 if a[ 0 ] < b[ 0 ]
  return +1 if a[ 0 ] > b[ 0 ]
  ### could raise an internal error if we get here since the above two comparsions must always suffice ###
  return -1 if a[ 1 ] < b[ 1 ]
  return +1 if a[ 1 ] > b[ 1 ]
  return  0

#---------------------------------------------------------------------------------------------------------
@_apply_segments_from_drange = ( me, drange ) ->
  segments = MAIN._sort ( ( new Segment [ r.low, r.high, ] ) for r in drange.ranges )
  me.push segment for segment in segments ### TAINT use `splice()` ###
  return me




#===========================================================================================================
# OTHER
#-----------------------------------------------------------------------------------------------------------
@ranges_from_drange   = ( drange ) -> ( [ r.low, r.high, ] for r in drange.ranges )
@ranges_from_urange   = ( urange ) -> validate.urange_instance urange; return @ranges_from_drange urange.d
@numbers_from_drange  = ( drange ) -> ( ( drange.index i ) for i in [ 0 ... drange.length ] )
@numbers_from_urange  = ( urange ) -> validate.urange_instance urange; return @numbers_from_drange urange.d

#-----------------------------------------------------------------------------------------------------------
@demo_subtract_ranges_DRange = ->
  super_rng   = new DRange 1, 100
  blue_rng    = new DRange 13
  blue_rng    = blue_rng.add 8
  blue_rng    = blue_rng.add 60, 80 # [8, 13, 60-80]
  blue_rng    = blue_rng.add 81
  blue_rng    = blue_rng.add new DRange 27, 55
  help '^3332^', @ranges_from_drange blue_rng
  red_rng     = super_rng.clone().subtract blue_rng
  help '^556^', @ranges_from_drange red_rng
  help '^556^', red_rng.length
  info '^334^', @numbers_from_drange red_rng

#-----------------------------------------------------------------------------------------------------------
@demo_subtract_ranges_Urange = ->
  super_rng   = new Urange [ 1, 100, ]
  blue_rng    = new Urange [ 13, 13, ], [ 8, 8, ], ( new Urange [ 60, 80, ] )
  info ( CND.truth super_rng  instanceof Urange ), super_rng
  info ( CND.truth blue_rng   instanceof Urange ), blue_rng
  blue_rng    = blue_rng.union new Urange [ 81, 81, ]
  blue_rng    = blue_rng.union new Urange [ 27, 55, ]
  blue_rng    = blue_rng.union [ 27, 55, ]
  help '^3332^', @ranges_from_urange blue_rng
  red_rng     = ( new Urange super_rng )
  red_rng     = red_rng.difference blue_rng
  help '^556^', @ranges_from_urange red_rng
  help '^556^', red_rng.length
  info '^334^', @numbers_from_urange red_rng

#-----------------------------------------------------------------------------------------------------------
@demo_merge_ranges = ->
  ranges = [
    [ 10, 20, ]
    [ 15, 30, ]
    [ 30, 32, ]
    [ 42, 42, ]
    [ 88, 99, ]
    ]
  a = merge_ranges ranges
  b = @ranges_from_urange new Urange ranges...
  info 'merging:', a
  info 'merging:', b
  validate.true CND.equals a, b

# #-----------------------------------------------------------------------------------------------------------
# module.exports = { Urange, }

############################################################################################################
if module is require.main then do =>
  await @demo_subtract_ranges_DRange()
  await @demo_subtract_ranges_Urange()
  await @demo_merge_ranges()



