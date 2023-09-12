

'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'webguy/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify

# #-----------------------------------------------------------------------------------------------------------
# @[ "_XEMITTER: _" ] = ( T, done ) ->
#   { DATOM }                 = require '../../../apps/datom'
#   { new_datom
#     select }                = DATOM
  # { Djehuti }               = require '../../../apps/intertalk'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ key, value, ] = probe
#       resolve new_datom key, value
#   done()
#   return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_basic = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  a = { number: 12, a_f: null, }
  b = { number: 123, text: 123, b_f: 123, a_f: 123, }
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_skips_constructor = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      return undefined
    a_f: ->
  a = new A()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_inludes_inherited = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      return undefined
    a_f: ->
  class B extends A
    constructor: ->
      super()
      @text = 'abcd'
      return undefined
    b_f: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_skips_underscores_and_symbols = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      @_do_not_touch_me = false
      return undefined
    a_f: ->
  class B extends A
    constructor: ->
      super()
      @text = 'abcd'
      @[Symbol 'helo'] = 456
      @_do_not_touch_me_either = false
      return undefined
    b_f: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null



############################################################################################################
if require.main is module then do =>
  test @



