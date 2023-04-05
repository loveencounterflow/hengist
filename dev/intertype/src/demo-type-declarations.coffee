
'use strict'



#===========================================================================================================
GUY                       = require 'guy'
{ debug
  info
  warn
  urge
  help }                  = GUY.trm.get_loggers 'INTERTYPE'
{ rpr }                   = GUY.trm

split = ( source ) -> source.split /[\s_]+/u


#===========================================================================================================
class Attributor extends Function

  #---------------------------------------------------------------------------------------------------------
  clasz = @
  @create_proxy: ( x ) -> new Proxy x,
    get: ( target, key, receiver ) ->
      urge '^98-1^', { key, }
      urge '^98-2^', target
      return ( P... ) -> target key, P...

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super '...P', 'return this._me.do(...P)'
    @_me        = @bind @
    return clasz.create_proxy @_me

  #---------------------------------------------------------------------------------------------------------
  do: ( P... ) ->
    info '^98-3^', P, split P[ 0 ]
    return 123


#===========================================================================================================
class Isa extends Attributor

  #---------------------------------------------------------------------------------------------------------
  do: isa = ( P... ) ->
    [ name, P..., ] = P
    help '^98-4^', P, split name
    return 789

#===========================================================================================================
if module is require.main then do =>
  debug '^98-5^', isa = new Isa()
  info '^98-6^', isa
  debug '^98-7^', isa 'float', 42
  debug '^98-8^', isa.float 42
  debug '^98-9^', isa.float_or_text 42
  debug '^98-10^', isa.float___or_text 42
  debug '^98-11^', isa 'float   or text', 42







