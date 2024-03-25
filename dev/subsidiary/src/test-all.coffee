


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
  urge '^722-1^', host.$
  urge '^722-1^', subsidiary
  urge '^722-1^', subsidiary._
  #.........................................................................................................
  T?.ok host.$          is subsidiary
  T?.ok subsidiary._    is host
  T?.ok host.$.b        is true
  T?.ok subsidiary._.a  is true
  #.........................................................................................................
  done?()
  return null

    show: ->
      return null

    show: ->
      return null


#===========================================================================================================
if module is require.main then await do =>
  await test @
