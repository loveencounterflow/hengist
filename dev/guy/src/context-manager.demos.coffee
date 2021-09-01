
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
demo_dba_foreign_keys_off_cxm = ->
  #=========================================================================================================
  class Foreign_keys_off_cxm extends Context_manager

    #-------------------------------------------------------------------------------------------------------
    enter: ( P... ) ->
      debug '^Foreign_keys_off_cxm.enter^', P

      return null

    #-------------------------------------------------------------------------------------------------------
    exit: ( P... ) ->
      debug '^Foreign_keys_off_cxm.exit^', P
      return null

  #=========================================================================================================
  class Dba_x extends ( require '../../../apps/icql-dba' ).Dba

    #-----------------------------------------------------------------------------------------------------
    create_with_foreign_keys_off: ( cxm_arguments... ) =>
      cxm = new Foreign_keys_off_cxm { dba: @, }
      return cxm

    #-----------------------------------------------------------------------------------------------------
    with_foreign_keys_off: ( cxm_arguments... ) =>
      cxm = @create_with_foreign_keys_off cxm_arguments...
      cxm = new Foreign_keys_off_cxm { dba: @, }
      return cxm

  #=========================================================================================================
  do =>

    #-------------------------------------------------------------------------------------------------------
    dba = new Dba()
    dba.with_foreign_keys_off 'cxm_arguments', block = ( cx_value, extra_arguments... ) ->
      debug '^inside-managed-context'
      return 'block-result'
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
  enter: ( rtas... ) ->
    R = { cx: 'value', }
    debug '^enter^    ', { rtas, cfg: @cfg, }
    return R
  #---------------------------------------------------------------------------------------------------------
  exit: ( cx_value, rtas... ) ->
    debug '^exit^     ', { cx_value, rtas, cfg: @cfg, }
    return null
  #---------------------------------------------------------------------------------------------------------
  manage: ( rtas..., block ) =>
    validate.function block
    help  '^manage^   ', { rtas, cfg: @cfg, block, }
    cx_value = @enter rtas...
    help  '^manage^   ', { rtas, cfg: @cfg, block, cx_value, }
    try
      # block_value = block cx_value, rtas...
      block_value = block.call @, cx_value, rtas...
    finally
      @exit cx_value, rtas...
    help  '^manage^   ', { block_value, }
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


############################################################################################################
if require.main is module then do =>
  # urge '#############################'
  # demo_1()
  urge '#############################'
  demo_2()
  # demo_dba_foreign_keys_off_cxm()


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


###

