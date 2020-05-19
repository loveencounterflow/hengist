
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
types                     = require './types'
{ isa
  validate
  declare }               = types

#-----------------------------------------------------------------------------------------------------------
declare 'orange_instance',  ( x ) -> x instanceof Urange

#-----------------------------------------------------------------------------------------------------------
declare 'orange_birange', \
  ( x ) -> ( @isa.list x ) and ( x.length is 2 ) and ( isa.number x[ 0 ] ) and ( isa.number x[ 1 ] )


#-----------------------------------------------------------------------------------------------------------
class Urange
  ### TAINT add type checking to avoid silent failure of e.g. `new DRange [ 1, 3, ]` ###

  #---------------------------------------------------------------------------------------------------------
  constructor: ( P... ) ->
    @d = new DRange()
    # @d = ( require 'letsfreezethat' ).freeze new DRange()
    for p in P
      if isa.orange_instance p
        @d.add p.d
      else
        validate.orange_birange p
        @d.add p...
    Object.defineProperty @, 'length', get: -> @d.length
    return @

  #---------------------------------------------------------------------------------------------------------
  union: ( other ) ->
    other = ( new Urange other ) unless isa.orange_instance other
    @d.add other.d
    return @

  #---------------------------------------------------------------------------------------------------------
  difference: ( other ) ->
    other = ( new Urange other ) unless isa.orange_instance other
    @d.subtract other.d
    return @

  #---------------------------------------------------------------------------------------------------------
  as_lists: -> ( [ r.low, r.high, ] for r in @d.ranges )

#-----------------------------------------------------------------------------------------------------------
@ranges_from_drange   = ( drange ) -> ( [ r.low, r.high, ] for r in drange.ranges )
@ranges_from_orange   = ( urange ) -> validate.orange_instance urange; return @ranges_from_drange urange.d
@numbers_from_drange  = ( drange ) -> ( ( drange.index i ) for i in [ 0 ... drange.length ] )
@numbers_from_orange  = ( urange ) -> validate.orange_instance urange; return @numbers_from_drange urange.d

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
@demo_subtract_ranges_Orange = ->
  super_rng   = new Urange [ 1, 100, ]
  blue_rng    = new Urange [ 13, 13, ], [ 8, 8, ], ( new Urange [ 60, 80, ] )
  info ( CND.truth super_rng  instanceof Urange ), super_rng
  info ( CND.truth blue_rng   instanceof Urange ), blue_rng
  blue_rng    = blue_rng.union new Urange [ 81, 81, ]
  blue_rng    = blue_rng.union new Urange [ 27, 55, ]
  blue_rng    = blue_rng.union [ 27, 55, ]
  help '^3332^', @ranges_from_orange blue_rng
  red_rng     = ( new Urange super_rng )
  red_rng     = red_rng.difference blue_rng
  help '^556^', @ranges_from_orange red_rng
  help '^556^', red_rng.length
  info '^334^', @numbers_from_orange red_rng

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
  b = @ranges_from_orange new Urange ranges...
  info 'merging:', a
  info 'merging:', b
  validate.true CND.equals a, b

#-----------------------------------------------------------------------------------------------------------
module.exports = { Urange, }

############################################################################################################
if module is require.main then do =>
  await @demo_subtract_ranges_DRange()
  await @demo_subtract_ranges_Orange()
  await @demo_merge_ranges()
  # debug new DRange()
  u = new Urange()
  debug '^334^', Urange.xxx
  debug '^334^', u.xxx



