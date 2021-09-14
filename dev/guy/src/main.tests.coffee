
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
test                      = require '../../../apps/guy-test'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "demo" ] = ( T, done ) ->
  { createRequire, }  = require 'module'
  guy_realpath        = require.resolve H.guy_path
  guy_realpath        = PATH.join guy_realpath, 'whatever' ### H.guy_path points to pkg folder, must be one element deeper ###
  debug '^7665^', { guy_realpath, }
  rq                  = createRequire guy_realpath
  guy                 = require H.guy_path
  urge '^83443^', H.guy_path
  help '^83443^', rq.resolve 'cnd'
  help '^83443^', rq.resolve 'intertype'
  help '^83443^', rq.resolve 'deasync'
  # help '^83443^', rq.resolve 'frob'
  # help '^83443^', rq.resolve 'steampipes'
  debug '340^', guy
  debug '340^', guy.nowait
  debug '340^', guy
  debug '340^', guy.nowait
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "nowait" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy = require H.guy_path
  result = []
  result.push 'nw1'
  #.........................................................................................................
  frob_async = ( P... ) -> new Promise ( resolve ) =>
    T?.eq P, [ 1, 2, 3, ]
    result.push 'fa1'
    guy.async.after 0.25, -> warn '^455-1^', "frob_async done"; result.push 'fa2'; resolve 'fa3'
  #.........................................................................................................
  frob_sync = guy.nowait.for_awaitable frob_async
  # frob_sync = frob_async
  result.push frob_sync 1, 2, 3
  result.push 'nw2'
  info '^455-3^', "call to frob_sync done"
  debug '^455-x^', result
  T?.eq result, [ 'nw1', 'fa1', 'fa2', 'fa3', 'nw2' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "await with async steampipes" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy         = require H.guy_path
  SP          = require 'steampipes'
  { $
    $async
    $show
    $drain }  = SP.export()
  trace       = []
  trace.push 'm1'
  #.........................................................................................................
  f_async = => new Promise ( resolve ) =>
    source    = [ 1 .. 3 ]
    pipeline  = []
    pipeline.push source
    pipeline.push $async ( d, send, done ) =>
      trace.push 'fa1'
      guy.async.after 0.25, =>
        trace.push 'fa2'
        send d ** 2
        done()
    pipeline.push $show()
    pipeline.push $drain ( collector ) ->
      debug '^4576^', collector
      resolve collector
    SP.pull pipeline...
  #.........................................................................................................
  trace.push 'm2'
  result = await f_async()
  trace.push 'm3'
  info '^8876^', trace
  T?.eq result, [ 1, 4, 9 ]
  T?.eq trace, [ 'm1', 'm2', 'fa1', 'fa2', 'fa1', 'fa2', 'fa1', 'fa2', 'm3' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "_____ HANGS ________________ nowait with async steampipes" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy         = require H.guy_path
  SP          = require 'steampipes'
  { $
    $async
    $show
    $drain }  = SP.export()
  trace       = []
  trace.push 'm1'
  #.........................................................................................................
  f_async = => new Promise ( resolve ) =>
    source    = [ 1 .. 3 ]
    pipeline  = []
    pipeline.push source
    pipeline.push $async ( d, send, done ) =>
      trace.push 'fa1'
      guy.async.after 0.25, =>
        trace.push 'fa2'
        send d ** 2
        done()
    pipeline.push $show()
    pipeline.push $drain ( collector ) ->
      debug '^4576^', collector
      resolve collector
    SP.pull pipeline...
  #.........................................................................................................
  trace.push 'm2'
  result = ( guy.nowait.for_awaitable f_async )()
  trace.push 'm3'
  info '^8876^', trace
  T?.eq result, [ 1, 4, 9 ]
  T?.eq trace, [ 'm1', 'm2', 'fa1', 'fa2', 'fa1', 'fa2', 'fa1', 'fa2', 'm3' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "configurator" ] = ( T, done ) ->
  T?.halt_on_error()
  guy         = require H.guy_path
  #.........................................................................................................
  ### minimal, must work w/out any specials present ###
  do =>
    debug '^334-1^'
    T?.eq ( type_of guy.cfg ), 'object'
    T?.eq ( type_of guy.cfg.configure_with_types ), 'function'
    #.......................................................................................................
    class Ex
      constructor: ( cfg ) ->
        debug '^334-2^', cfg
        guy.cfg.configure_with_types @, cfg
    #.......................................................................................................
    ex = new Ex { foo: 42, }
    debug '^334-3^', ex
    debug '^334-4^', ex.cfg
    debug '^334-5^', ex.constructor.C
    debug '^334-6^', ex.constructor.C?.defaults
    T?.eq ( type_of ex.constructor.C ), 'undefined'
    T?.eq ( type_of ex.constructor.C?.defaults ), 'undefined'
    return null
  #.........................................................................................................
  do =>
    ### more complete example ###
    debug '^334-7^'
    #.......................................................................................................
    class Ex
      @C: guy.lft.freeze
        foo:      'foo-constant'
        bar:      'bar-constant'
        defaults:
          constructor_cfg:
            foo:      'foo-default'
            bar:      'bar-default'
      @declare_types: ( self ) ->
        T?.eq ( type_of self ), 'ex'
        T?.eq ( type_of self.cfg ), 'object'
        # T?.ok Object.isFrozen self.cfg
        debug '^334-8^', self.cfg
        self.types.declare 'constructor_cfg', tests:
          "@isa.object x":                    ( x ) -> @isa.object x
          "x.foo in [ 'foo-default', 42, ]":  ( x ) -> x.foo in [ 'foo-default', 42, ]
          "x.bar is 'bar-default'":           ( x ) -> x.bar is 'bar-default'
        self.types.validate.constructor_cfg self.cfg
        # debug '^334-9^', types
        return null
      constructor: ( cfg ) ->
        guy.cfg.configure_with_types @, cfg
        debug '^334-10^', @cfg
        debug '^334-11^', ( type_of @cfg   ), 'object'
        debug '^334-12^', ( type_of @types ), 'object'
        T?.ok Object.isFrozen @cfg
        T?.eq @cfg, { foo: 42, bar: 'bar-default' }
        return undefined
    #.......................................................................................................
    ex = new Ex { foo: 42, }
    debug '^334-13^', ex
    debug '^334-14^', ex.cfg
    debug '^334-15^', ex.constructor.C
    debug '^334-16^', ex.constructor.C?.defaults
    T?.eq ( type_of ex.constructor.C ), 'object'
    T?.eq ( type_of ex.constructor.C?.defaults ), 'object'
    # configure_with_types
    return null
  #.........................................................................................................
  do =>
    ### example with module-level types ###
    debug '^334-17^'
    #.......................................................................................................
    mytypes = new ( require 'intertype' ).Intertype()
    mytypes.declare 'constructor_cfg', tests:
      "@isa.object x":                            ( x ) -> @isa.object x
      "x.foo in [ 'foo-default', 42, 123456, ]":  ( x ) -> x.foo in [ 'foo-default', 42, 123456, ]
      "@isa.nonempty_text x.bar":                 ( x ) -> @isa.nonempty_text x.bar
    mytypes.declare "rosy_number", tests:
      "@isa.integer x":   ( x ) -> @isa.integer x
      "123 < x < 456":    ( x ) -> 123 < x < 456
    #.......................................................................................................
    class Ex
      @C: guy.lft.freeze
        foo:      'foo-constant'
        bar:      'bar-constant'
        defaults:
          constructor_cfg:
            foo:      'foo-default'
            bar:      'bar-default'
      @declare_types: ( self ) ->
        T?.eq ( type_of self ), 'ex'
        T?.eq ( type_of self.cfg ), 'object'
        # T?.ok Object.isFrozen self.cfg
        T?.ok self.types is mytypes
        self.types.validate.constructor_cfg self.cfg
        self.types.validate.rosy_number 200
        T?.ok not self.types.isa.rosy_number 500
        return null
      constructor: ( cfg ) ->
        guy.cfg.configure_with_types @, cfg, mytypes
        return undefined
    #.......................................................................................................
    ex1 = new Ex { foo: 42, }
    T?.eq ( type_of ex1.constructor.C ), 'object'
    T?.eq ex1.cfg, { foo: 42, bar: 'bar-default' }
    T?.eq ( type_of ex1.constructor.C?.defaults ), 'object'
    ex2 = new Ex { foo: 123456, bar: 'mybar' }
    T?.eq ex2.cfg, { foo: 123456, bar: 'mybar' }
    T?.ok ex1.types is ex2.types
    # configure_with_types
    return null
  #.........................................................................................................
  done?()


#===========================================================================================================
# OBJ
#-----------------------------------------------------------------------------------------------------------
@[ "guy.obj.pick_with_fallback()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ [ { a: 1, b: 2, c: 3, },        null, [ 'a', 'c',     ], ], { a: 1, c: 3, } ]
    [ [ { foo: 'bar', baz: 'gnu', },  null, [ 'foo', 'wat', ], ], { foo: 'bar', wat: null } ]
    [ [ { foo: 'bar', baz: 'gnu', },  42,   [ 'foo', 'wat', ], ], { foo: 'bar', wat: 42 } ]
    [ [ { foo: null,  baz: 'gnu', },  42,   [ 'foo', 'wat', ], ], { foo: null, wat: 42 } ]
    [ [ {},  undefined, undefined, ], {} ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ d
        fallback
        keys      ] = probe
      # debug '^443^', { d, fallback, keys, }
      d_copy        = { d..., }
      if keys?
        result        = guy.obj.pick_with_fallback d, fallback, keys...
      else
        result        = guy.obj.pick_with_fallback d, fallback
      T?.eq d, d_copy
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.obj.pluck_with_fallback()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ [ { a: 1, b: 2, c: 3, },        null,  [ 'a', 'c',     ], { b: 2, },       ], { a: 1, c: 3, },           ]
    [ [ { foo: 'bar', baz: 'gnu', },  null,  [ 'foo', 'wat', ], { baz: 'gnu', }, ], { foo: 'bar', wat: null }, ]
    [ [ { foo: 'bar', baz: 'gnu', },  42,    [ 'foo', 'wat', ], { baz: 'gnu', }, ], { foo: 'bar', wat: 42 },   ]
    [ [ { foo: null,  baz: 'gnu', },  42,    [ 'foo', 'wat', ], { baz: 'gnu', }, ], { foo: null, wat: 42 },    ]
    [ [ {},                           null,  undefined,         {},              ], {},                        ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ d
        fallback
        keys
        d_changed ] = probe
      d_copy        = { d..., }
      if keys?
        result        = guy.obj.pluck_with_fallback d, fallback, keys...
      else
        result        = guy.obj.pluck_with_fallback d, fallback
      T?.eq d, d_changed
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.obj.nullify_undefined()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ {}, {} ]
    [ null, {} ]
    [ undefined, {} ]
    [ { a: 1, b: 2, c: 3, }, { a: 1, b: 2, c: 3, } ]
    [ { a: undefined, b: 2, c: 3, }, { a: null, b: 2, c: 3, } ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      d             = probe
      d_copy        = { d..., }
      result        = guy.obj.nullify_undefined d
      T?.eq d, d_copy if d?
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.obj.omit_nullish()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ {}, {} ]
    [ null, {} ]
    [ undefined, {} ]
    [ { a: 1, b: 2, c: 3, }, { a: 1, b: 2, c: 3, } ]
    [ { a: undefined, b: 2, c: 3, }, { b: 2, c: 3, } ]
    [ { a: undefined, b: 2, c: null, }, { b: 2, } ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      d             = probe
      d_copy        = { d..., }
      result        = guy.obj.omit_nullish d
      T?.eq d, d_copy if d?
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  test @, { timeout: 5000, }
  # test @[ "guy.obj.pick_with_fallback()" ]
  # test @[ "guy.obj.pluck_with_fallback()" ]
  # test @[ "guy.obj.nullify_undefined()" ]
  # test @[ "guy.obj.omit_nullish()" ]
  # @[ "configurator" ]()
  # test @[ "await with async steampipes" ]
  # test @[ "nowait with async steampipes" ]
  # test @[ "use-call" ]
  # @[ "await with async steampipes" ]()
  # @[ "demo" ]()
  # @[ "nowait" ]()



