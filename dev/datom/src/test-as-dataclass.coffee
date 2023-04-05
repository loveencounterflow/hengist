
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




#-----------------------------------------------------------------------------------------------------------
@datom_as_dataclass = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
  #.........................................................................................................
  do ->
    d = new Dataclass()
    info '^12-7^', ( Object.isFrozen d )
    T?.eq ( Object.isFrozen d ), true # used to be false
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
    T?.eq ( Object.isFrozen q ), true # used to be false
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
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_automatic_validation = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
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
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_deep_freezing = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
  #.........................................................................................................
  do ->
    class Something extends Dataclass
      @declaration:
        # freeze:   'deep' ### the default ###
        fields:
          values:   'list.of.integer'
        template:
          values:   []
    #.......................................................................................................
    T?.eq ( s = new Something()                     ), { values: [], }
    T?.eq ( s = new Something { values: [ 3, 5, ] } ), { values: [ 3, 5, ], }
    return null
  #.........................................................................................................
  do ->
    class Something extends Dataclass
      @declaration:
        # freeze:   'deep' ### the default ###
        fields:
          values:   'list.of.integer'
        template:
          values:   []
    #.......................................................................................................
    s = new Something { values: [ 3, 5, ] }
    debug '^23-1^', s
    T?.eq ( Object.isFrozen s         ), true
    T?.eq ( Object.isFrozen s.values  ), true
    debug '^23-2^', s
    debug '^23-3^', Object.isFrozen s
    debug '^23-4^', Object.isFrozen s.values
    try s.values.push 7 catch error then warn '^Dataclass@2^', GUY.trm.reverse error.message
    T?.throws /object is not extensible/, -> s.values.push 7
    return null
  #.........................................................................................................
  do ->
    class Something extends Dataclass
      @declaration:
        freeze:   false ### no freezing, fully mutable ###
        fields:
          values:   'list.of.integer'
        template:
          values:   []
    #.......................................................................................................
    s = new Something { values: [ 3, 5, ] }
    debug '^23-5^', s
    T?.eq ( Object.isFrozen s         ), false
    T?.eq ( Object.isFrozen s.values  ), false
    debug '^23-6^', s
    debug '^23-7^', Object.isFrozen s
    debug '^23-8^', Object.isFrozen s.values
    s.values.push 7
    s.extra = 42
    T?.eq s, { values: [ 3, 5, 7, ], extra: 42, }
    return null
  #.........................................................................................................
  do ->
    class Something extends Dataclass
      @declaration:
        freeze:   true ### freeze instance but not its properties ###
        fields:
          values:   'list.of.integer'
        template:
          values:   []
    #.......................................................................................................
    s = new Something { values: [ 3, 5, ] }
    # s.values # access property to trigger freezing
    T?.eq ( Object.isFrozen s         ), true
    T?.eq ( Object.isFrozen s.values  ), false
    debug '^23-9^', s
    debug '^23-10^', Object.isFrozen s
    debug '^23-11^', Object.isFrozen s.values
    debug '^23-11^', rpr s.extra
    s.values.push 7
    try s.extra = 42 catch error then warn '^Dataclass@3^', GUY.trm.reverse error.message
    T?.throws /Cannot assign to read only property/, -> s.extra = 42
    T?.eq s, { values: [ 3, 5, 7, ], }
    return null
  #.........................................................................................................
  do ->
    class Something extends Dataclass
      @declaration:
        freeze:   'shallow' ### freeze instance but not its properties ###
        fields:
          values:   'list.of.integer'
        template:
          values:   []
    #.......................................................................................................
    s = new Something { values: [ 3, 5, ] }
    # s.values # access property to trigger freezing
    T?.eq ( Object.isFrozen s         ), true
    T?.eq ( Object.isFrozen s.values  ), false
    debug '^23-9^', s
    debug '^23-10^', Object.isFrozen s
    debug '^23-11^', Object.isFrozen s.values
    debug '^23-11^', rpr s.extra
    s.values.push 7
    try s.extra = 42 catch error then warn '^Dataclass@3^', GUY.trm.reverse error.message
    T?.throws /Cannot assign to read only property/, -> s.extra = 42
    T?.eq s, { values: [ 3, 5, 7, ], }
    return null
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_custom_types_instance = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
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
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_computed_properties = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
  #.........................................................................................................
  do ->
    #.......................................................................................................
    class Something extends Dataclass
      #-----------------------------------------------------------------------------------------------------
      @declaration:
        freeze:   false
        fields:
          mode:   'nonempty.text'
          name:   'nonempty.text'
        template:
          mode:   null
          name:   null
        # create: ( x ) ->
        #   return x unless @isa.object x
        #   R = { x..., }
        #   GUY.props.def R, 'id', get: -> "#{@mode}:#{@name}"
      constructor: ( P... ) ->
        super P...
        GUY.props.def @, 'id',
          enumerable: true
          get: => "#{@mode}:#{@name}"
          set: ( value ) =>
            @__types.validate.nonempty.text value
            parts = value.split ':'
            @mode = parts[ 0 ]
            @name = parts[ 1 .. ].join ':'
            return null
        return undefined
    #.......................................................................................................
    s = new Something { mode: 'mymode', name: 'p', }
    debug '^464561^', s
    T?.eq s, { mode: 'mymode', name: 'p', id: 'mymode:p', }
    debug '^464561^', s.id
    s.id = 'foo:bar'
    T?.eq s, { mode: 'foo', name: 'bar', id: 'foo:bar', }
    return null
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_method_to_trigger_declaration = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
  #.........................................................................................................
  do ->
    my_types = new ( require '../../../apps/intertype' ).Intertype()
    #.......................................................................................................
    class Something extends Dataclass
      #-----------------------------------------------------------------------------------------------------
      @types: my_types
      @declaration:
        fields:
          mode:   'nonempty.text'
          name:   'nonempty.text'
          id:     'nonempty.text'
        template:
          mode:   null
          name:   null
          id:     null
        create: ( x ) ->
          return x unless @isa.object x
          R = { x..., id: "#{x.mode}:#{x.name}", }
          return R
    #.......................................................................................................
    s = new Something { mode: 'mymode', name: 'p', }
    T?.eq s, { mode: 'mymode', name: 'p', id: 'mymode:p', }
    T?.eq ( 'Something' in Object.keys my_types.registry ), true
    return null
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_dataclass_with_instance_methods = ( T, done ) ->
  { Dataclass } = require '../../../apps/datom'
  #.........................................................................................................
  get_types_and_class = ->
    base_types = new ( require '../../../apps/intertype' ).Intertype()
    base_types.declare.ilx_codeunit_idx 'positive0.integer'
    base_types.declare.ilx_line_number  'positive1.integer'
    base_types.declare.ilx_token_value  'text'
    base_types.declare.ilx_token_key ( x ) ->
      return false unless @isa.text x
      return ( x.indexOf ':' ) isnt -1
    #.......................................................................................................
    class Token extends Dataclass
      clasz = @
      @types: base_types
      @declaration:
        fields:
          $key:   'ilx_token_key'
          lnr1:   'ilx_line_number'
          x1:     'ilx_codeunit_idx'
          lnr2:   'ilx_line_number'
          x2:     'ilx_codeunit_idx'
          value:  'ilx_token_value'
        template:
          $key:   null
          lnr1:   1
          x1:     0
          lnr2:   null
          x2:     null
          value:  ''
        create: ( x ) ->
          return x if x? and not @isa.object x
          R       = { clasz.declaration.template..., x..., }
          R.lnr2 ?= R.lnr1
          R.x2   ?= R.x1
          if @isa.text R.$key ### NOTE safeguard against `$key` missing/wrong in user-supplied value ###
            g       = ( R.$key.match /^(?<mode>[^:]+):(?<lxid>.+)$/ ).groups
            R.mode  = g.mode
            R.lxid  = g.lxid
          return R
      set_mode: ( mode ) ->
        new clasz { @..., $key: "#{mode}:#{@lxid}", }
    return { base_types, Token, }
  #.........................................................................................................
  do ->
    { base_types
      Token     } = get_types_and_class()
    d = new Token { $key: 'plain:p:start', lnr1: 123, }
    # info '^93-4^', GUY.trm.truth d.set_mode?
    e = d.set_mode 'tag'
    urge '^93-3^', d
    urge '^93-5^', e
    return null
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  # test @datom_dataclass_method_to_trigger_declaration
  # @datom_dataclass_with_instance_methods()
  # test @datom_dataclass_with_instance_methods
  # test @datom_as_dataclass
  # test @datom_dataclass_automatic_validation
  # @datom_dataclass_deep_freezing()
  test @datom_dataclass_deep_freezing
  # test @datom_dataclass_computed_properties