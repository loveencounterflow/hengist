

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'LFTNG'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
Multimix                  = require 'multimix'
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
frozen                    = Object.isFrozen
assign                    = Object.assign
shallow_freeze            = Object.freeze
shallow_copy              = ( x ) -> assign ( if Array.isArray x then [] else {} ), x
{ klona: deep_copy, }     = require 'klona/json'


#===========================================================================================================
types.declare 'mutable', ( x ) -> ( @isa.object x ) or ( @isa.list x )

#-----------------------------------------------------------------------------------------------------------
types.declare 'lft_cfg', tests:
  "x is an object":                       ( x ) -> @isa.object x
  "x.freeze is a boolean":                ( x ) -> @isa.boolean x.freeze
  ### NOTE the following restriction is only there to help API transition and will be omitted in the realease version ###
  "x.copy must not be used":              ( x ) -> not x.copy?

#-----------------------------------------------------------------------------------------------------------
defaults =
  cfg:
    freeze: true

#===========================================================================================================
deep_freeze = ( d ) ->
  ### immediately return for zero, empty string, null, undefined, NaN, false, true: ###
  return d if ( not d ) or d is true
  ### thx to https://github.com/lukeed/klona/blob/master/src/json.js ###
  switch ( Object::toString.call d )
    when '[object Array]'
      k = d.length
      while ( k-- )
        continue unless ( v = d[ k ] )? and ( ( typeof v ) is 'object' )
        d[ k ] = deep_freeze v
      return shallow_freeze d
    when '[object Object]'
      for k, v of d
        continue unless v? and ( ( typeof v ) is 'object' )
        d[ k ] = deep_freeze v
      return shallow_freeze d
  return d

#===========================================================================================================
f1_set = ( me, k, v ) ->
  R       = shallow_copy me
  R[ k ]  = v
  return shallow_freeze R

#-----------------------------------------------------------------------------------------------------------
f0_set = ( me, k, v ) ->
  R       = shallow_copy me
  R[ k ]  = v
  return R

#===========================================================================================================
f1_assign = ( me, P... ) -> deep_freeze deep_copy assign {}, me, P...
f0_assign = ( me, P... ) ->             deep_copy assign {}, me, P...

#===========================================================================================================
f1_lets = ( original, modifier ) ->
  draft = @thaw original
  modifier draft if modifier?
  return deep_freeze draft

#-----------------------------------------------------------------------------------------------------------
f0_lets = ( original, modifier ) ->
  draft = @thaw original
  modifier draft if modifier?
  ### TAINT do not copy ###
  return deep_copy draft

#===========================================================================================================
f1_freeze  = ( me ) -> deep_freeze me
f0_freeze  = ( me ) -> me

#===========================================================================================================
f1_thaw    = ( me ) -> deep_copy me
f0_thaw    = ( me ) -> deep_copy me


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Lft extends Multimix

  #---------------------------------------------------------------------------------------------------------
  @types: types

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    super()
    types.validate.lft_cfg @cfg = shallow_freeze { defaults.cfg..., cfg..., }
    if @cfg.freeze
      @set        = f1_set
      @assign     = f1_assign
      @lets       = f1_lets
      @freeze     = f1_freeze
      @thaw       = f1_thaw
    else
      @set        = f0_set
      @assign     = f0_assign
      @lets       = f0_lets
      @freeze     = f0_freeze
      @thaw       = f0_thaw
    return @

  #---------------------------------------------------------------------------------------------------------
  get: ( me, k ) -> me[ k ]



############################################################################################################
module.exports = LFT = new Lft()
assign LFT, { Lft, }



