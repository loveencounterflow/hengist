
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'PSEUDO-ARRAY'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
GUY                       = require 'guy'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types
# { Moonriver }             = require '../../../apps/moonriver'
UTIL                      = require 'util'
misfit                    = Symbol 'misfit'


#-----------------------------------------------------------------------------------------------------------
add_length_prop = ( target, key ) ->
  Object.defineProperty target, 'length',
    get:        -> @[ key ].length
    set: ( x )  -> @[ key ].length = x


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Pond

  #---------------------------------------------------------------------------------------------------------
  @C: GUY.lft.freeze
    misfit:       misfit
    defaults:
      constructor:
        on_change:  null
        devnull:    false

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    @cfg        = GUY.lft.freeze { @constructor.C.defaults.constructor..., cfg..., }
    @on_change  = @cfg.on_change if @cfg.on_change?
    @d          = []
    @delta      = 0
    @rear       = null
    @fore       = null
    @pipeline   = null
    @consumer   = null ### transform to be called when data arrives ###
    @prv_length = 0
    add_length_prop @, 'd'
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _on_change: ->
    @delta      = @length - @prv_length
    info '^348^', @length, ( @delta ), rpr @
    @prv_length = @length
    @pipeline?.on_change delta
    @on_change?()
    return null

  #---------------------------------------------------------------------------------------------------------
  set_rear:  ( x ) ->
    # validate.pond x
    @rear = x
    return null

  #---------------------------------------------------------------------------------------------------------
  set_fore: ( x ) ->
    # validate.pond x
    @fore = x
    return null

  #---------------------------------------------------------------------------------------------------------
  push: ( x ) ->
    return null if @devnull
    R = @d.push x
    @_on_change()
    return R

  #---------------------------------------------------------------------------------------------------------
  pop: ( fallback = misfit ) ->
    if @d.length is 0
      return fallback unless fallback is misfit
      throw new Error "^XXX@1^ cannot pop() from empty list"
    R = @d.pop()
    @_on_change()
    return R

  #---------------------------------------------------------------------------------------------------------
  unshift: ( x ) ->
    return null if @devnull
    R = @d.unshift x
    @_on_change()
    return R

  #---------------------------------------------------------------------------------------------------------
  shift: ( fallback = misfit ) ->
    if @d.length is 0
      return fallback unless fallback is misfit
      throw new Error "^XXX@1^ cannot shift() from empty list"
    return null if @devnull
    R = @d.shift()
    @_on_change()
    return R

  #---------------------------------------------------------------------------------------------------------
  clear: ->
    @d.length = 0
    @_on_change()
    return null

  #---------------------------------------------------------------------------------------------------------
  toString:               -> rpr @d
  [UTIL.inspect.custom]:  -> rpr @d


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Segment

  #---------------------------------------------------------------------------------------------------------
  constructor: ( input, output ) ->
    return undefined


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Pipeline

  #---------------------------------------------------------------------------------------------------------
  constructor: ( segments ) ->
    @data_count   = 0
    @segments     = []
    @last_segment = null
    add_length_prop @, 'segments'
    @push segment for segment in segments
    return undefined

  #---------------------------------------------------------------------------------------------------------
  push: ( segment ) ->
    @segments.push segment
    @last_segment = segment
    return null

  #---------------------------------------------------------------------------------------------------------
  on_change: ( delta ) ->
    @data_count += delta
    return null

  #---------------------------------------------------------------------------------------------------------
  [Symbol.iterator]: -> yield segment for segment in @segments; return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo = ->
  d = new Pond on_change: ( delta ) ->
    return null

  d.push 42
  d.push 43
  d.push 44
  d.shift()
  # d.splice 1, 0, 'a', 'b', 'c'
  urge '^948^', d
  urge '^948^', d.length
  return null


############################################################################################################
if module is require.main then do =>
  demo()





