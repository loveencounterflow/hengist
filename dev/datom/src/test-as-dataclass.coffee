
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
  @declaration: null

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
    __types = new ( require '../../../apps/intertype' ).Intertype()
    GUY.props.hide @, '__types', __types
    if ( declaration = @constructor.declaration )?
      @__types.declare[ @constructor.name ] declaration
      @[ k ] = v for k, v of @__types.create[ @constructor.name ] cfg
    return @constructor.new_datom @



#===========================================================================================================

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

#-----------------------------------------------------------------------------------------------------------
@datom_as_dataclass = ( T, done ) ->
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
    class Quantity extends Datom

      #-----------------------------------------------------------------------------------------------------
      @declaration:
        fields:
          q:    'float'
          u:    'nonempty.text'
        template:
          q:    0
          u:    'unit'

      #-----------------------------------------------------------------------------------------------------
      constructor: ( cfg ) ->
        # super { template..., cfg..., }
        super cfg
        return undefined
    #.......................................................................................................
    q = new Quantity()
    T?.eq ( Object.isFrozen q ), false
    try q.foo = 42 catch error then warn '^Datom@1^', GUY.trm.reverse error.message
    T?.throws /.*/, -> q.foo = 42
    T?.eq ( Object.isFrozen q ), true
    ### TAINT should use method independent of `inspect` (which could be user-configured?) ###
    T?.eq ( ( require 'util' ).inspect q ), "Quantity { q: 0, u: 'unit' }"
    T?.eq q.q, 0
    T?.eq q.u, 'unit'
    T?.eq q, { q: 0, u: 'unit', }
    return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_automatic_validation = ( T, done ) ->
  #.........................................................................................................
  do ->
    #.......................................................................................................
    class Quantity extends Datom

      #-----------------------------------------------------------------------------------------------------
      @declaration:
        fields:
          q:    'float'
          u:    'nonempty.text'
        template:
          q:    0
          u:    'unit'

      # #-----------------------------------------------------------------------------------------------------
      # constructor: ( cfg ) ->
      #   # super { template..., cfg..., }
      #   super cfg
      #   return undefined
    #.......................................................................................................
    T?.eq ( q = new Quantity() ), { q: 0, u: 'unit', }
    T?.eq ( q = new Quantity { q: 0, u: 'unit', } ), { q: 0, u: 'unit', }
    T?.eq ( q = new Quantity { q: 23, u: 'm', } ), { q: 23, u: 'm', }
    T?.throws /not a valid Quantity/, -> q = new Quantity { q: 23, u: '', }
    return null
  #.........................................................................................................
  done()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # test @datom_as_dataclass
  test @datom_dataclass_automatic_validation

