
'use strict'



#===========================================================================================================
GUY                       = require 'guy'
{ debug
  info
  warn
  urge
  help }                  = GUY.trm.get_loggers 'INTERTYPE'
{ rpr }                   = GUY.trm

###


* **Attributor**: a `class Atr extends Accessor` that instantiates `atr = new Atr()` as a function which allows to be accessed in two ways:
  classical `atr 'acc', p, q, r...` or compressed `atr.acc p, q, r...`
* **Accessor**: the key used as first argument to access an attributor as in `atr.acc()`, sometimes symbolized as `acc`
* **Phrase**: list of 'words'/keys resulting from splitting the accessor by whitespace and underscores. This allows
  to build complex accessors like `isa.text_or_integer 42` (phrase: `[ 'text', 'or', 'integer', ]`)
* **Details**: arguments used in a attributor after the accessor. Ex.: In `atr.foo_bar 3, 4, 5`, `foo_bar` is the accessor key,
  `[ 'foo', 'bar', ]` is the accessor phrase, and `3, 4, 5` are the accessor details.
* **NCC**, *Normalized Accessor*: the `phrase` equivalent of an accessor, the words being joined with single
  `_` underscores. Ex.: All of `empty_text`, `empty text`, `empty_____text` are normalized to `empty_text`.
* *Alternative Accessors* are all the spelling variants (with multiple underscores, or words
  separated by whitespace) that result in the same NCC.

* all methods and other instance properties whose names starts with a double underscore `__` are not proxied and
  returned directly; this allows users to implement functionality in derived classes while keeping the system's
  namespace separated from the instances' proxied accessors.


# Analyzing Attributor

class Aa extends Analyzing_attributor

aa = new Aa
resolution = aa

## To Do

* **[–]** docs
* **[–]** find a good name

## Is Done

* **[+]** name generated functions using the NCC

###

#-----------------------------------------------------------------------------------------------------------
### TAINT move this to Guy ###
class Guy_error_base_class extends Error
  constructor: ( ref, message ) ->
    super()
    if ref is null
      @message  = message
      return undefined
    @message  = "#{ref} (#{@constructor.name}) #{message}"
    @ref      = ref
    return undefined ### always return `undefined` from constructor ###

#-----------------------------------------------------------------------------------------------------------
class Wrong_use_of_abstract_base_class_method extends Guy_error_base_class
  constructor: ( ref, instance, method_name )     ->
    class_name = instance.constructor.name
    super ref, "not allowed to call method #{rpr method_name} of abstract base class #{rpr class_name}"


#===========================================================================================================
class Attributor extends Function

  #---------------------------------------------------------------------------------------------------------
  clasz = @

  #---------------------------------------------------------------------------------------------------------
  @create_proxy: ( x ) -> new Proxy x,
    get: ( target, accessor, receiver ) ->
      # info '^98-1^', rpr accessor
      return target[ accessor ] if ( typeof accessor ) is 'symbol'
      return target[ accessor ] if accessor is 'constructor'
      return target[ accessor ] if accessor.startsWith? and accessor.startsWith '__'
      return ( P... ) -> target accessor, P...

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    ### Trick to make this work; these are strings containing JS code: ###
    super '...P', 'return this._me.__do(...P)'
    @_me        = @bind @
    return clasz.create_proxy @_me

  #---------------------------------------------------------------------------------------------------------
  __do: ( P... ) ->
    ### Attributor instances are functions, and the `__do()` method is the code that they execute when being
    called. This method should be overridden in derived classes. ###
    throw new Wrong_use_of_abstract_base_class_method '^Attributor.__do^', @, '__do'


#===========================================================================================================
class Analyzing_attributor extends Attributor

  #---------------------------------------------------------------------------------------------------------
  @__cache: null

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    clasz     = @constructor
    @__cache  = if clasz.__cache? then ( new Map clasz.__cache ) else new Map()
    return undefined

  #---------------------------------------------------------------------------------------------------------
  __do: ( accessor, details... ) -> ( @__get_handler accessor ) details...

  #---------------------------------------------------------------------------------------------------------
  __get_handler: ( accessor ) ->
    ### Given a accessor, returns a method to use for that accessor, either from cache a newly generated by
    calling `__create_handler()` which must be declared in derived classes. When used with alternative
    accessors, care has been taken to only call `__create_handler()` once and to cache alternative accessors
    along with the normalized one. ###
    return @__cache.get accessor if @__cache.has accessor
    [ ncc, phrase  ] = @__get_ncc_and_phrase accessor
    #.......................................................................................................
    if @__cache.has ncc
      R = @__cache.get ncc
    #.......................................................................................................
    else
      R = @__nameit ncc, @__create_handler
      @__cache.set ncc,       R
    #.......................................................................................................
    @__cache.set accessor,  R
    return R

  #---------------------------------------------------------------------------------------------------------
  __create_handler: ( phrase ) ->
    ### Given a phrase (the parts of an accessor when split), return a function that takes details as
    arguments and returns a resolution. ###
    throw new Wrong_use_of_abstract_base_class_method '^Analyzing_attributor.__create_handler^', @, '__create_handler'

  #---------------------------------------------------------------------------------------------------------
  __get_ncc_and_phrase: ( accessor ) ->
    ### Given an accessor (string), return a phrase (list of strings): ###
    phrase  = accessor.split /[\s_]+/u
    ncc     = phrase.join '_'
    return [ ncc, phrase, ]

  #---------------------------------------------------------------------------------------------------------
  __declare: ( accessor, handler ) ->
    ### Associate an accessor with a handler method: ###
    ### TAINT check for overwrites ###
    @__cache.set accessor, handler
    return null

  #---------------------------------------------------------------------------------------------------------
  __nameit: ( name, f ) -> Object.defineProperty f, 'name', { value: name, }; f

#===========================================================================================================
class Isa extends Analyzing_attributor

  #---------------------------------------------------------------------------------------------------------
  @__cache: new Map Object.entries
    null:       ( x ) -> x is null
    undefined:  ( x ) -> x is undefined
    boolean:    ( x ) -> ( x is true ) or ( x is false )
    float:      ( x ) -> Number.isFinite x
    symbol:     ( x ) -> ( typeof x ) is 'symbol'

  #---------------------------------------------------------------------------------------------------------
  __create_handler: ( phrase ) ->
    return ( details ) -> 'Yo'

#===========================================================================================================
if module is require.main then do =>
  isa = new Isa()
  debug '^98-2^', isa.__cache
  try debug '^98-3^', ( new Attributor() ).__do() catch e then warn GUY.trm.reverse e.message
  # info '^98-4^', isa
  debug '^98-5^', isa 'float', 42
  debug '^98-6^', isa.float 42
  debug '^98-7^', isa.float NaN
  debug '^98-8^', isa.float '22'
  info '^98-9^', [ isa.__cache.keys()..., ]
  debug '^98-10^', isa.float_or_text 42;         info '^98-11^', [ isa.__cache.keys()..., ]
  debug '^98-12^', isa.float___or_text 42;      info '^98-13^', [ isa.__cache.keys()..., ]
  debug '^98-14^', isa 'float   or text', 42;   info '^98-15^', [ isa.__cache.keys()..., ]
  debug '^98-16^', isa.__cache.get 'float_or_text'
  debug '^98-17^', isa.float_or_text
  debug '^98-18^', ( isa.__cache.get 'float___or_text' ) is ( isa.__cache.get 'float_or_text' )
  debug '^98-19^', ( isa.__cache.get 'float___or_text' ) is ( isa.__cache.get 'float   or text' )
  debug '^98-20^', ( isa.__cache.get 'float_or_text' ).name is 'float_or_text'
  debug '^98-21^', ( isa.__cache.get 'float_or_text' ) is isa.float_or_text







