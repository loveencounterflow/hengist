
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
  whisper }               = GUY.trm.get_loggers 'DATOM/TESTS/AS-DATACLASS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  validate }              = types


#===========================================================================================================
class Datom

  #---------------------------------------------------------------------------------------------------------
  @declaration:
    template: null

  #---------------------------------------------------------------------------------------------------------
  @new_datom: ( x ) -> new Proxy x,
    #.......................................................................................................
    get: ( target, key, receiver ) ->
      Object.freeze target unless Object.isFrozen target
      return Reflect.get target, key, receiver
    #.......................................................................................................
    set: ( target, key, value, receiver ) ->
      Object.freeze target unless Object.isFrozen target
      throw new TypeError "Cannot assign to read only property #{rpr key} of object #{rpr target}"

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    ### TAINT naive implementation, check for validity ###
    # debug '^12-1^', [ @constructor.declaration.template, cfg, ]
    # debug '^12-2^', [ @, ]
    # debug '^12-3^', [ @constructor, ]
    # debug '^12-4^', [ new.target, ]
    # debug '^12-5^', [ new.target.constructor, ]
    # debug '^12-6^', [ new.target?.constructor?.declaration?.template, ]
    debug '^12-6^', [ @constructor?.declaration?.template, ]
    for k, v of { ( @constructor.declaration?.template ? null )..., cfg..., }
      @[ k ] = v
    return @constructor.new_datom @


#-----------------------------------------------------------------------------------------------------------
@datom_as_dataclass = ( T, done ) ->
  # DATOM = new ( require '../../../apps/datom' ).Datom { freeze: false, }
  # probes_and_matchers = [
  #   [ [ '^foo' ], { '$fresh': true, '$key': '^foo' }, null ]
  #   [ [ '^foo', { foo: 'bar' } ], { foo: 'bar', '$fresh': true, '$key': '^foo' }, null ]
  #   [ [ '^foo', { value: 42 } ], { value: 42, '$fresh': true, '$key': '^foo' }, null ]
  #   [ [ '^foo', { value: 42 }, { '$fresh': false } ], { value: 42, '$fresh': true, '$key': '^foo' }, null ]
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     d = DATOM.new_fresh_datom probe...
  #     T.ok not Object.isFrozen d
  #     resolve d
  #     return null
  #.........................................................................................................
  do ->
    d = new Datom()
    info '^12-7^', ( Object.isFrozen d )
    T?.eq ( Object.isFrozen d ), false
    try d.foo = 42 catch error then warn GUY.trm.reverse error.message
    T?.eq ( Object.isFrozen d ), true
    T?.throws /.*/, -> d.foo = 42
    return null
  #.........................................................................................................
  do ->
    class E extends Datom

      #-----------------------------------------------------------------------------------------------------
      @declaration:
        template:
          foo: 41
          bar: 42
          baz: 43

      #-----------------------------------------------------------------------------------------------------
      constructor: ( cfg ) ->
        # super { template..., cfg..., }
        super cfg
        return undefined
    e = new E()
    T?.eq ( Object.isFrozen e ), false
    try e.foo = 42 catch error then warn '^Datom@1^', GUY.trm.reverse error.message
    T?.throws /.*/, -> e.foo = 42
    T?.eq ( Object.isFrozen e ), true
    ### TAINT should use method independent of `inspect` (which could be user-configured?) ###
    T?.eq ( ( require 'util' ).inspect e ), 'E { foo: 41, bar: 42, baz: 43 }'
    T?.eq e.foo, 41
    T?.eq e.bar, 42
    T?.eq e.baz, 43
    T?.eq e, { foo: 41, bar: 42, baz: 43, }
    return null
  #.........................................................................................................
  done()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # test @fresh_datom_with_freeze
  test @datom_as_dataclass


