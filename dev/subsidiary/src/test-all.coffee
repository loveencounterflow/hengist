


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


#===========================================================================================================
class Subsidiary_helpers

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    @subsidiaries = new WeakSet()
    @hosts        = new WeakMap()

  #---------------------------------------------------------------------------------------------------------
  walk_subsidiaries: ( host ) ->
    ### TAINT this loop should be changed so we catch all relevant objects, including from inherited classes ###
    yield { subsidiary_key, subsidiary, } \
      for subsidiary_key, subsidiary of host \
        when @is_subsidiary subsidiary

  #---------------------------------------------------------------------------------------------------------
  create: ( subsidiary ) ->
    if @subsidiaries.has subsidiary
      throw new Error "object already in use as subsidiary"
    @subsidiaries.add subsidiary
    return subsidiary

  #---------------------------------------------------------------------------------------------------------
  ### TAINT safeguard against non-object values ###
  is_subsidiary: ( x ) -> @subsidiaries.has x

  #---------------------------------------------------------------------------------------------------------
  tie_host_and_subsidiary: ( cfg ) ->
    ### TAINT use types, validate ###
    template  = { host: null, subsidiary: null, subsidiary_key: '$', host_key: '_', enumerable: false, }
    cfg       = { template..., cfg..., }
    #.......................................................................................................
    { host
      subsidiary
      host_key
      subsidiary_key
      enumerable      } = cfg
    #.......................................................................................................
    debug '^340-1^', cfg
    ### TAINT shouldn't be necessary if done explicitly? ###
    unless @subsidiaries.has subsidiary
      throw new Error "object isn't a subsidiary"
    if @hosts.has subsidiary
      throw new Error "subsidiary already has a host"
    ### host->subsidiary is a standard containment/compository relationship and is expressed directly;
    subsidiary-> host is a backlink that would create a circular reference which we avoid by using a
    `WeakMap` instance, `@hosts`: ###
    Object.defineProperty host, subsidiary_key, { value: subsidiary, enumerable, }
    Object.defineProperty subsidiary, host_key, { get: ( => @get_host subsidiary ), enumerable, }
    @hosts.set subsidiary, host
    return subsidiary

  #---------------------------------------------------------------------------------------------------------
  get_host: ( subsidiary ) ->
    return R if ( R = @hosts.get subsidiary )?
    throw new Error "no host registered for object"

#===========================================================================================================
SUBSIDIARY = new Subsidiary_helpers

#===========================================================================================================
class Host

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    for { subsidiary_key, subsidiary, } from SUBSIDIARY.walk_subsidiaries @
      SUBSIDIARY.tie_host_and_subsidiary { host: @, subsidiary, host_key: '_', subsidiary_key, }
      debug '^233-1^', subsidiary_key, ( SUBSIDIARY.is_subsidiary subsidiary ), ( subsidiary._ is @ )
      debug '^233-1^', @[ subsidiary_key ]
    #   continue unless subsidiary_key.startsWith '$'
    #   debug '^233-2^', subsidiary_key, subsidiary, subsidiary?.prototype
    # @$ = new Secondary @
    return undefined

  #---------------------------------------------------------------------------------------------------------
  show: ->
    help '^650-1^', @
    help '^650-2^', @$a, @$a.show
    help '^650-2^', @$b, @$b.show
    return null

  #---------------------------------------------------------------------------------------------------------
  $a: SUBSIDIARY.create
    show: ->
      warn '^650-1^', "$a.show"
      @_.show()
      return null

  #---------------------------------------------------------------------------------------------------------
  $b: SUBSIDIARY.create new class B
    show: ->
      warn '^650-1^', "$b.show"
      @_.show()
      return null

  #---------------------------------------------------------------------------------------------------------
  $not_a_subsidiary: {}


#===========================================================================================================
if module is require.main then await do =>
  await test @

  # #.........................................................................................................
  # host        = { a: true, }
  # subsidiary  = SUBSIDIARY.create { b: true, }
  # SUBSIDIARY.tie_host_and_subsidiary { host, subsidiary, enumerable: true, }
  # urge '^722-1^', host
  # urge '^722-1^', host.$
  # urge '^722-1^', subsidiary
  # urge '^722-1^', subsidiary._
