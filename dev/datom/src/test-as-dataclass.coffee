
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
types                     = new ( require 'intertype' ).Intertype()
{ isa
  equals
  validate }              = types


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


#===========================================================================================================
class Dataclass

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
    clasz   = @constructor
    __types = clasz.types ? new ( require '../../../apps/intertype' ).Intertype()
    GUY.props.hide @, '__types', __types
    if ( declaration = clasz.declaration )?
      @__types.declare[ clasz.name ] declaration
      @[ k ] = v for k, v of @__types.create[ clasz.name ] cfg
    return clasz.new_datom @



#-----------------------------------------------------------------------------------------------------------
@datom_as_dataclass = ( T, done ) ->
  #.........................................................................................................
  do ->
    d = new Dataclass()
    info '^12-7^', ( Object.isFrozen d )
    T?.eq ( Object.isFrozen d ), false
    try d.foo = 42 catch error then warn GUY.trm.reverse error.message
    T?.eq ( Object.isFrozen d ), true
    T?.throws /.*/, -> d.foo = 42
    return null
  #.........................................................................................................
  do ->
    class Quantity extends Dataclass

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
    try q.foo = 42 catch error then warn '^Dataclass@1^', GUY.trm.reverse error.message
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
    class Quantity extends Dataclass

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
    T?.eq ( q = new Quantity()                    ), { q: 0, u: 'unit', }
    T?.eq ( q = new Quantity { q: 0, u: 'unit', } ), { q: 0, u: 'unit', }
    T?.eq ( q = new Quantity { q: 23, u: 'm', }   ), { q: 23, u: 'm', }
    T?.throws /not a valid Quantity/, -> q = new Quantity { q: 23, u: '', }
    return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_deep_freezing = ( T, done ) ->
  #.........................................................................................................
  class Something extends Dataclass

    #-------------------------------------------------------------------------------------------------------
    @declaration:
      freeze:   'deep'
      fields:
        values:   'list.of.integer'
      template:
        values:   []
  #.........................................................................................................
  do ->
    T?.eq ( s = new Something()                     ), { values: [], }
    T?.eq ( s = new Something { values: [ 3, 5, ] } ), { values: [ 3, 5, ], }
    return null
  #.........................................................................................................
  do ->
    s = new Something { values: [ 3, 5, ] }
    debug '^23-1^', s
    T?.eq ( Object.isFrozen s         ), true
    T?.eq ( Object.isFrozen s.values  ), true
    try s.values.push 7 catch error then warn '^Dataclass@1^', GUY.trm.reverse error.message
    T?.throws /object is not extensible/, -> s.values.push 7
    return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_custom_types_instance = ( T, done ) ->
  #.........................................................................................................
  do ->
    my_types = new ( require '../../../apps/intertype' ).Intertype()
    my_types.declare.awesome_list isa: 'list.of.integer'
    #.......................................................................................................
    class Something extends Dataclass
      #-----------------------------------------------------------------------------------------------------
      @types: my_types
      @declaration:
        freeze:   'deep'
        fields:
          values:   'awesome_list'
        template:
          values:   []
    #.......................................................................................................
    s = new Something [ 4, 5, 6, ]
    T?.eq ( my_types is s.__types ), true
    return null
  #.........................................................................................................
  do ->
    my_types = new ( require '../../../apps/intertype' ).Intertype()
    my_types.declare.awesome_list isa: 'list.of.integer'
    #.......................................................................................................
    class Something extends Dataclass
      #-----------------------------------------------------------------------------------------------------
      @types: my_types
      @declaration:
        freeze:   'deep'
        fields:
          values:   'awesome_list'
        template:
          values:   []
    #.......................................................................................................
    T?.throws /not a valid Something/, -> new Something { values: [ 'wronk', ], }
    return null
  #.........................................................................................................
  done()
  return null




############################################################################################################
if require.main is module then do =>
  test @
  # test @datom_as_dataclass
  # test @datom_dataclass_automatic_validation

