
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/MODULES'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
# H                         = require './helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
# { DATOM }                 = require '../../../apps/datom'
# { new_datom
#   lets
#   stamp     }             = DATOM



#-----------------------------------------------------------------------------------------------------------
get_modular_pipeline_classes = ->
  { Pipeline
    Transformer } = require '../../../apps/moonriver'

  #=========================================================================================================
  class P_1 extends Transformer

    $p_1_1: -> p_1_1 = ( d, send ) -> help '$p_1_1'; d.push '$p_1_1'; send d
    $p_1_2: -> p_1_2 = ( d, send ) -> help '$p_1_2'; d.push '$p_1_2'; send d
    $p_1_3: -> p_1_3 = ( d, send ) -> help '$p_1_3'; d.push '$p_1_3'; send d

  #=========================================================================================================
  class P_2 extends Transformer

    $p_2_1: -> p_2_1 = ( d, send ) -> help '$p_2_1'; d.push '$p_2_1'; send d
    $p_2_2: -> p_2_2 = ( d, send ) -> help '$p_2_2'; d.push '$p_2_2'; send d
    $p_2_3: -> p_2_3 = ( d, send ) -> help '$p_2_3'; d.push '$p_2_3'; send d

  #=========================================================================================================
  class P_12 extends Transformer
    p_1: new P_1()
    p_2: new P_2()

  #=========================================================================================================
  p_4 = new Pipeline()
  p_4.push p_4_1 = ( d, send ) -> help 'p_4_1'; d.push 'p_4_1'; send d

  #=========================================================================================================
  class P_12_x extends Transformer

    #-------------------------------------------------------------------------------------------------------
    $: [
      direct_fn     =    ( d, send ) -> help 'direct_fn';     d.push 'direct_fn';     send d
      $indirect_fn  = -> ( d, send ) -> help '$indirect_fn';  d.push '$indirect_fn';  send d
      new P_1()
      P_2
      p_4
      ]

  #=========================================================================================================
  class P_3 extends Transformer
    foo: ( d, send ) -> d.push 'foo'; send d
    bar: ( d, send ) -> d.push 'bar'; send d
    baz: p_4_1

  #=========================================================================================================
  class P_empty extends Transformer

  #=========================================================================================================
  class P_5 extends Transformer
    foo: ( d, send ) -> d.push 'foo'; send d
    bar: ( d, send ) -> d.push 'bar'; send d
    empty: P_empty
    baz: p_4_1

  #=========================================================================================================
  class P_6 extends P_5
    last: ( d ) ->

  #=========================================================================================================
  return {
    P_1
    P_2
    P_12
    P_12_x
    P_3
    P_empty
    P_5
    P_6 }

#-----------------------------------------------------------------------------------------------------------
@can_iterate_over_transforms = ( T, done ) ->
  { Pipeline
    Transformer } = require '../../../apps/moonriver'
  { P_1
    P_2
    P_12
    P_12_x
    P_3
    P_empty
    P_5
    P_6             } = get_modular_pipeline_classes()
  #.........................................................................................................
  do ->
    whisper '^46-1^', '————————————————————————————————————————'
    p = new P_empty()
    info '^46-1^', p
    T?.ok p instanceof Transformer
    T?.eq p._transforms, []
    T?.eq p.length, 0
    T?.eq ( t.name ? t.constructor?.name ? '???' for t from p ), []
    p.length = 0
    T?.eq p.length, 0
    return null
  #.........................................................................................................
  do ->
    whisper '^46-1^', '————————————————————————————————————————'
    p = new P_1()
    info '^46-1^', p
    T?.ok p instanceof Transformer
    T?.eq p.length, 3
    T?.eq ( t.name ? t.constructor?.name ? '???' for t from p ), [ 'p_1_1', 'p_1_2', 'p_1_3' ]
    p.length = 0
    T?.eq p.length, 0
    return null
  #.........................................................................................................
  do ->
    whisper '^46-1^', '————————————————————————————————————————'
    p = new P_12_x()
    info '^46-1^', p
    info '^46-1^', p._transforms
    T?.ok p instanceof Transformer
    T?.eq p.length, 5
    T?.eq ( t.name ? t.constructor?.name ? '???' for t from p ), [ 'direct_fn', '', 'P_1', 'P_2', 'Pipeline' ]
    p.length = 0
    T?.eq p.length, 0
    return null
  #.........................................................................................................
  do ->
    whisper '^46-1^', '————————————————————————————————————————'
    p = new P_5()
    info '^46-1^', p
    info '^46-1^', p._transforms
    T?.ok p instanceof Transformer
    T?.eq p.length, 4
    T?.eq ( t.name ? t.constructor?.name ? '???' for t from p ), [ 'foo', 'bar', 'P_empty', 'p_4_1' ]
    p.length = 0
    T?.eq p.length, 0
    return null
  #.........................................................................................................
  do ->
    whisper '^46-1^', '————————————————————————————————————————'
    p = new P_6()
    info '^46-1^', p
    info '^46-1^', p._transforms
    T?.ok p instanceof Transformer
    T?.eq p.length, 5
    T?.eq ( t.name ? t.constructor?.name ? '???' for t from p ), [ 'foo', 'bar', 'P_empty', 'p_4_1', 'last' ]
    p.length = 0
    T?.eq p.length, 0
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@transformers_1 = ( T, done ) ->
  { Pipeline }              = require '../../../apps/moonriver'
  { P_1
    P_2
    P_12
    P_12_x
    P_3
    P_empty
    P_5     } = get_modular_pipeline_classes()
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push P_1
    p.send []
    urge '^234^', p
    # urge '^234^', p.run()
    T?.eq p.run(), [ [ '$p_1_1', '$p_1_2', '$p_1_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push P_2
    p.send []
    T?.eq p.run(), [ [ '$p_2_1', '$p_2_2', '$p_2_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push P_12
    p.send []
    T?.eq p.run(), [ [ '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push P_12_x
    p.send []
    T?.eq p.run(), [ [ 'direct_fn', '$indirect_fn', '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3', 'p_4_1' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push P_5
    p.send []
    T?.eq p.run(), [ [ 'foo', 'bar', 'p_4_1' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push P_empty
    p.send 1
    p.send 2
    p.send 3
    T?.eq p.run(), [ 1, 2, 3, ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@transformers_methods_called_with_current_context = ( T, done ) ->
  { Pipeline
    Transformer } = require '../../../apps/moonriver'
  #.........................................................................................................
  class X extends Transformer
    constructor: ->
      super()
      @foo = 'class X'
      return undefined
    $unbound_method: ->
      return unbound_method = ( d, send ) ->
        # debug '^98-1^', @constructor.name
        send d ** 3
  #.........................................................................................................
  class Y extends Pipeline
    constructor: ->
      super()
      @foo = 'class Y'
      @push new X()
      return undefined
  #.........................................................................................................
  y = new Y()
  y.send 12
  y.send 34
  result = y.run_and_stop()
  T?.eq result, [ 1728, 39304 ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@transformers_do_no_overrides = ( T, done ) ->
  { Pipeline
    Transformer } = require '../../../apps/moonriver'
  #.........................................................................................................
  class A extends Transformer
    $source: -> [ [ '*', ], ]
    $a1: -> ( d, send ) -> d.push 'a1'; send d
    $a2: -> ( d, send ) -> d.push 'a2'; send d
    $a3: -> ( d, send ) -> d.push 'a3'; send d
  #.........................................................................................................
  class B extends A
    $b1: -> ( d, send ) -> d.push 'b1'; send d
    $a2: -> ( d, send ) => d.push '!b2!'; send d
    $b3: -> ( d, send ) -> d.push 'b3'; send d
    $show: -> ( d ) -> urge '^a@1^', d
  #.........................................................................................................
  p = B.as_pipeline()
  result = p.run_and_stop()
  T?.eq result, [ [ '*', 'a1', 'a2', 'a3', 'b1', '!b2!', 'b3' ] ]
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @transformers_1()
  # @transformers_1()
  # test @transformers_1
  # @transformers_methods_called_with_current_context()
  # @can_iterate_over_transforms()
  # @transformers_do_no_overrides()
  test @transformers_do_no_overrides
  # test @
  # test @can_iterate_over_transforms
  # test @transformers_methods_called_with_current_context
