
############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()


#-----------------------------------------------------------------------------------------------------------
demo_dba_With_foreign_keys_off_cxm = ->
  #=========================================================================================================
  class With_foreign_keys_off extends Context_manager

    #-------------------------------------------------------------------------------------------------------
    constructor: ( P... ) ->
      R = super P...
      debug '^4746^', @cfg
      @prv_in_foreign_keys_state = @cfg.dba._get_foreign_keys_state
      return @

    #-------------------------------------------------------------------------------------------------------
    enter: ( P... ) ->
      debug '^With_foreign_keys_off.enter^'
      @prv_in_foreign_keys_state = @cfg.dba._get_foreign_keys_state()
      @cfg.dba._set_foreign_keys_state false
      return null

    #-------------------------------------------------------------------------------------------------------
    exit: ( P... ) ->
      debug '^With_foreign_keys_off.exit^', @prv_in_foreign_keys_state
      @cfg.dba._set_foreign_keys_state @prv_in_foreign_keys_state
      return null

  #=========================================================================================================
  class Dba_x extends ( require '../../../apps/icql-dba' ).Dba

    #---------------------------------------------------------------------------------------------------------
    with_foreign_keys_off: ( P... ) => ( @_with_foreign_keys_off ?= new With_foreign_keys_off { dba: @, } ) P...

  #=========================================================================================================
  do =>

    #-------------------------------------------------------------------------------------------------------
    # { Dba, }  = require '../../../apps/icql-dba'
    dba       = new Dba_x()
    debug '^70^', dba.With_foreign_keys_off
    info '^123^', dba._state
    dba.with_foreign_keys_off ( cx_value, extra_arguments... ) ->
      debug '^inside-managed-context'
      info '^123^', dba._state
      return null
    info '^123^', dba._state
    return null
  return null



#===========================================================================================================
# CLASS DEFINITION
#-----------------------------------------------------------------------------------------------------------
class Context_manager extends Function

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    super()
    @cfg = cfg
    return @manage

  #---------------------------------------------------------------------------------------------------------
  enter: ( rtas... ) -> null

  #---------------------------------------------------------------------------------------------------------
  exit: ( cx_value, rtas... ) -> null

  #---------------------------------------------------------------------------------------------------------
  manage: ( rtas..., block ) =>
    validate.function block
    cx_value = @enter rtas...
    urge '^22298^', @cfg, cx_value
    try
      block_value = block.call @, cx_value, rtas...
    finally
      @exit cx_value, rtas...
    return block_value

#===========================================================================================================
# DEMOS
#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  do =>
    manage  = new Context_manager cfg = { whatever: 'values', }
    rtas    = [ 'a', 'b', 'c', ]
    block   = ( cx_value, rtas... ) ->
      info '^block^    ', { cx_value, rtas, cfg: @cfg, }
      return 'block_value'
    block_value = manage rtas..., block
    debug '^3334^', rpr block_value
    whisper '--------------------------------'
    debug '^3334^', rpr block_value = manage 'some', 'other', 'rtas', ( cx_value, rtas... ) ->
      info '^block2^   ', { cx_value, rtas, cfg: @cfg, }
      return 'another_block_value'
    return null

#-----------------------------------------------------------------------------------------------------------
demo_3 = ->
  ### NOTE we just define context managers as a kind of pattern and are done ###
  class X
    with_unsafe_mode: ( path, foo, P..., f ) ->
      # @types.validate.function f
      validate.function f
      urge '^65^', { path, foo, }
      prv_in_unsafe_mode = @_unsafe
      @_unsafe = true
      try R = f P... finally @_unsafe = prv_in_unsafe_mode
      return R
  x = new X()
  x._unsafe = false
  result = x.with_unsafe_mode 'some/path', 'FOO', 'a', 'b', ( P... ) ->
    debug '^334^', "inside context", P
    return 42
  info '^334^', result



############################################################################################################
if require.main is module then do =>
  # urge '#############################'
  # demo_1()
  # urge '#############################'
  # demo_2()
  demo_3()
  # demo_dba_With_foreign_keys_off_cxm()


###

* RTAs / `rtas`: Run Time Arguments, the arguments passed in fron of the `block` when using the `manager`,
  as in `manager 'some', 'rtas', 'here', ( cx_value, rtas... ) -> ...`

* CX value / `cx_value`: the 'context value', commonly a resource, an object of central interest that
  enables certain operations and has to be resource-managed, such as a DB connection to be established and
  freed, or a file to be opened and closed.

* Block (payload?, run time block?, )
  * if unbound function is used, its `this` value will be the `Context_manager` instance (i.e. `manage()`);
    from inside the block, the arguments used to instantiate the context manager may be accessed as `@cfg`
    in this case.

* Manager (cxmanager, context manager): a callable return value from instantiating a `Context_manager`
  class.
  * can be called any number of times with any number of RTAs and a required callable `block` as last
    argument
  * naming: conventionally `with_${purpose}`, as in `with_foreign_keys_off()`, `with_open_file()`,
    `with_db_connection()`.
* Context manager classes conventionally declared as `With_frobulations extends Context_manager`,
  `With_foreign_keys_off extends Context_manager`, or use `cxm` suffix as in `File_cxm`, `Connection_cxm`.

# To Do

* **[–]** Following Python, define class / factory / decorator that takes a one-off generator function
  and returns a context manager, sparing users the class declaration overhead.


###

