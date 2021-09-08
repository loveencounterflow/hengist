
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
  validate_list_of
  equals }                = types.export()
guy                       = require H.guy_path
log                       = info

#-----------------------------------------------------------------------------------------------------------
minimal_demo = ->
  class Ex
    constructor: ( cfg ) ->
      guy.cfg.configure_with_types @, cfg
  #.........................................................................................................
  ex1 = new Ex()
  ex2 = new Ex { foo: 42, }
  #.........................................................................................................
  log ex1                         # Ex { cfg: {} }
  log ex1.cfg                     # {}
  log ex2                         # Ex { cfg: { foo: 42 } }
  log ex2.cfg                     # { foo: 42 }
  log ex1.types is ex2.types      # false
  log type_of ex1.types.validate  # function
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
medium_demo = ->
  class Ex
    @C: guy.lft.freeze
      foo:      'foo-constant'
      bar:      'bar-constant'
      defaults:
        constructor_cfg:
          foo:      'foo-default'
          bar:      'bar-default'
    @declare_types: ( self ) ->
      self.types.declare 'constructor_cfg', tests:
        "@isa.object x":                    ( x ) -> @isa.object x
        "x.foo in [ 'foo-default', 42, ]":  ( x ) -> x.foo in [ 'foo-default', 42, ]
        "x.bar is 'bar-default'":           ( x ) -> x.bar is 'bar-default'
      self.types.validate.constructor_cfg self.cfg
      return null
    constructor: ( cfg ) ->
      guy.cfg.configure_with_types @, cfg
      return undefined
  #.......................................................................................................
  ex = new Ex { foo: 42, }
  log ex
  log ex.cfg
  log ex.constructor.C
  log ex.constructor.C?.defaults
  #.......................................................................................................
  return null






############################################################################################################
if require.main is module then do =>
  # minimal_demo()
  medium_demo()
