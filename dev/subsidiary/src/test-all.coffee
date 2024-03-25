


'use strict'


#===========================================================================================================
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'subsidiary'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
test                      = require 'guy-test'



# #-----------------------------------------------------------------------------------------------------------
# @imports = ( T, done ) ->
#   # T?.halt_on_error()
#   SUB                 = require '../../../apps/subsidiary'
#   T?.eq ( k for k of SUB ).sort(), [ 'SUBSIDIARY', 'Subsidiary', ]
#   probes_and_matchers = []
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       result = eval probe
#       resolve result
#       return null
#   done?()
#   return null

#-----------------------------------------------------------------------------------------------------------
@imports = ( T, done ) ->
  # T?.halt_on_error()
  SUB = require '../../../apps/subsidiary'
  T?.eq ( k for k of SUB ).sort(), [ 'SUBSIDIARY', 'Subsidiary', ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@api = ( T, done ) ->
  # T?.halt_on_error()
  { SUBSIDIARY }  = require '../../../apps/subsidiary'
  keys            = GUY.props.keys SUBSIDIARY, { hidden: true, }
  keys            = keys.sort()
  debug keys
  T?.eq keys, [
    'constructor'
    'create'
    'get_host'
    'hosts'
    'is_subsidiary'
    'subsidiaries'
    'tie_all'
    'tie_host_and_subsidiary'
    'walk_subsidiaries' ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@ad_hoc_use = ( T, done ) ->
  # T?.halt_on_error()
  { SUBSIDIARY } = require '../../../apps/subsidiary'
  #.........................................................................................................
  host        = { a: true, }
  subsidiary  = SUBSIDIARY.create { b: true, }
  SUBSIDIARY.tie_host_and_subsidiary { host, subsidiary, enumerable: true, }
  #.........................................................................................................
  urge '^722-1^', host
  urge '^722-2^', host.$
  urge '^722-3^', subsidiary
  urge '^722-4^', subsidiary._
  #.........................................................................................................
  T?.ok host.$          is subsidiary
  T?.ok subsidiary._    is host
  T?.ok host.$.b        is true
  T?.ok subsidiary._.a  is true
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@use_in_class_1 = ( T, done ) ->
  # T?.halt_on_error()
  { SUBSIDIARY }          = require '../../../apps/subsidiary'
  host_$a                 = null
  host_$b                 = null
  host_$not_a_subsidiary  = null
  #=========================================================================================================
  class Host
    #-------------------------------------------------------------------------------------------------------
    constructor: ->
      for { subsidiary_key, subsidiary, } from SUBSIDIARY.walk_subsidiaries @
        SUBSIDIARY.tie_host_and_subsidiary { host: @, subsidiary, host_key: '_', subsidiary_key, }
      return undefined
    #-------------------------------------------------------------------------------------------------------
    show: ->
      return null
    #-------------------------------------------------------------------------------------------------------
    ### use plain object ###
    $a: host_$a = SUBSIDIARY.create
      $a: true
      show: ->
        @_.show()
        return null
    #-------------------------------------------------------------------------------------------------------
    ### use instance ###
    $b: host_$b = SUBSIDIARY.create new class B
      $b: true
      show: ->
        @_.show()
        return null
    #-------------------------------------------------------------------------------------------------------
    $not_a_subsidiary: host_$not_a_subsidiary = {}
  #=========================================================================================================
  host        = new Host()
  #.........................................................................................................
  urge '^722-5^', host
  T?.eq ( SUBSIDIARY.is_subsidiary host.$a                ), true
  T?.eq ( SUBSIDIARY.is_subsidiary host.$b                ), true
  T?.eq ( SUBSIDIARY.is_subsidiary host.$not_a_subsidiary ), false
  #.........................................................................................................
  T?.ok host.$a                   is host_$a
  T?.ok host.$b                   is host_$b
  T?.ok host.$not_a_subsidiary    is host_$not_a_subsidiary
  debug host.$not_a_subsidiary
  debug host_$not_a_subsidiary
  T?.ok host.$a._                 is host
  T?.ok host.$b._                 is host
  T?.ok host.$not_a_subsidiary._  is undefined
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@use_in_class_2 = ( T, done ) ->
  # T?.halt_on_error()
  { SUBSIDIARY }          = require '../../../apps/subsidiary'
  host_$a                 = null
  host_$b                 = null
  host_$not_a_subsidiary  = null
  #=========================================================================================================
  class Host
    #-------------------------------------------------------------------------------------------------------
    constructor: ->
      SUBSIDIARY.tie_all { host: @, host_key: '_', enumerable: true, }
      return undefined
    #-------------------------------------------------------------------------------------------------------
    show: ->
      return null
    #-------------------------------------------------------------------------------------------------------
    ### use plain object ###
    $a: host_$a = SUBSIDIARY.create
      $a: true
      show: ->
        @_.show()
        return null
    #-------------------------------------------------------------------------------------------------------
    ### use instance ###
    $b: host_$b = SUBSIDIARY.create new class B
      $b: true
      show: ->
        @_.show()
        return null
    #-------------------------------------------------------------------------------------------------------
    $not_a_subsidiary: host_$not_a_subsidiary = {}
  #=========================================================================================================
  host        = new Host()
  #.........................................................................................................
  urge '^722-5^', host
  T?.eq ( SUBSIDIARY.is_subsidiary host.$a                ), true
  T?.eq ( SUBSIDIARY.is_subsidiary host.$b                ), true
  T?.eq ( SUBSIDIARY.is_subsidiary host.$not_a_subsidiary ), false
  #.........................................................................................................
  T?.ok host.$a                   is host_$a
  T?.ok host.$b                   is host_$b
  T?.ok host.$not_a_subsidiary    is host_$not_a_subsidiary
  debug host.$not_a_subsidiary
  debug host_$not_a_subsidiary
  T?.ok host.$a._                 is host
  T?.ok host.$b._                 is host
  T?.ok host.$not_a_subsidiary._  is undefined
  #.........................................................................................................
  done?()
  return null


#===========================================================================================================
if module is require.main then await do =>
  await test @
