
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/MODIFIERS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'

#-----------------------------------------------------------------------------------------------------------
@modifiers_first_and_last_1 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms,     } = require '../../../apps/moonriver'
  p                   = new Pipeline()
  { $ }               = p
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  $with_stars         = -> with_stars = ( d, send ) -> send "*#{d}*"
  $add_parentheses    = ->
    return $ { first, last, }, add_parentheses = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
  #.........................................................................................................
  do ->
    p.push Array.from '氣場全開'
    p.push $with_stars()
    p.push $add_parentheses()
    # p.push transforms.$collect()
    p.push show = ( d ) -> whisper rpr d
    result = p.run()
    urge '^735^', result
    T?.eq result, [ '(', '*氣*', '*場*', '*全*', '*開*', ')' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@modifiers_start_and_stop = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    $,                \
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  start               = Symbol 'start'
  stop                = Symbol 'stop'
  #.........................................................................................................
  $with_stars                 = -> with_stars = ( d, send ) -> send "*#{d}*"
  $add_parentheses_start_stop = ->
    return $ { start, stop, }, add_parentheses_start_stop = ( d, send ) ->
      return send '(' if d is start
      return send ')' if d is stop
      send d
  $add_parentheses_first_last  = ->
    return $ { first, last, }, add_parentheses_first_last = ( d, send ) ->
      return send '[' if d is first
      return send ']' if d is last
      send d
  new_pipeline_start_stop = ( cfg ) ->
    p = new Pipeline { cfg..., }
    p.push $with_stars()
    p.push $add_parentheses_start_stop()
    # p.push transforms.$collect()
    # p.push show = ( d ) -> whisper rpr d
    return p
  new_pipeline_first_last = ( cfg ) ->
    p = new Pipeline { cfg..., }
    p.push $with_stars()
    p.push $add_parentheses_first_last()
    # p.push transforms.$collect()
    # p.push show = ( d ) -> whisper rpr d
    return p
  #.........................................................................................................
  do ->
    p       = new_pipeline_start_stop()
    result  = []
    for chr in Array.from '氣場全開'
      p.send chr
    result.push d for d from p.walk()
    result.push d for d from p.stop_walk()
    urge '^735^', result
    T?.eq result, [ '(', '*氣*', '*場*', '*全*', '*開*', ')' ]
  #.........................................................................................................
  do ->
    p       = new_pipeline_first_last()
    result  = []
    for chr in Array.from '氣場全開'
      p.send chr
    result.push d for d from p.walk()
    result.push d for d from p.stop_walk()
    urge '^735^', result
    T?.eq result, [ '[', '*氣*', '*場*', '*全*', '*開*', ']' ]
  #.........................................................................................................
  do ->
    p       = new_pipeline_first_last()
    result  = []
    for chr in Array.from '氣場全開'
      p.send chr
      result.push d for d from p.walk()
    result.push d for d from p.stop_walk()
    urge '^735^', result
    T?.eq result, [ '[', '*氣*', ']', '[', '*場*', ']', '[', '*全*', ']', '[', '*開*', ']' ]
  #.........................................................................................................
  do ->
    p       = new_pipeline_start_stop()
    result  = []
    for chr in Array.from '氣場全開'
      p.send chr
      result.push d for d from p.walk()
    result.push d for d from p.stop_walk()
    urge '^735^', result
    T?.eq result, [ '(', '*氣*', '*場*', '*全*', '*開*', ')' ]
  #.........................................................................................................
  do ->
    p       = new_pipeline_start_stop()
    result  = []
    p.send chr for chr in Array.from '氣場全開'
    result.push d for d from p.walk_and_stop()
    urge '^735^', result
    T?.eq result, [ '(', '*氣*', '*場*', '*全*', '*開*', ')' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@modifiers_first_and_last_2 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  $with_stars         = -> with_stars = ( d, send ) -> send "*#{d}*"
  $add_parentheses    = ->
    return $ { first, last, }, add_parentheses = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push Array.from '氣場全開'
    p.push $with_stars()
    p.push $add_parentheses()
    # p.push transforms.$collect()
    p.push show = ( d ) -> whisper rpr d
    result = p.run()
    urge '^735^', result
    T?.eq result, [ '(', '*氣*', '*場*', '*全*', '*開*', ')' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@modifiers_first_and_last_3 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  $with_stars         = -> with_stars = ( d, send ) -> send "*#{d}*"
  $add_parentheses    = ->
    return $ { first, last, }, add_parentheses = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push Array.from '氣場全開'
    p.push $with_stars()
    # p.push ( d ) -> info '^77-1^', p, p.segments[ 0 ].output
    p.push $add_parentheses()
    # p.push ( d ) -> info '^77-2^', p # .segments[ 1 ].output
    p.push show = ( d ) -> help rpr d
    p.push transforms.$collect()
    p.push show = ( d ) -> urge rpr d
    p.push join = ( d, send ) -> send d.join ''
    result = p.run()
    result.push d for d from p.stop_walk()
    urge '^77-3^', p
    urge '^77-4^', result
    T?.eq result, [ '(*氣**場**全**開*)' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@modifiers_of_observers_do_not_leak = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    Async_pipeline
    $
    transforms      } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  start               = Symbol 'start'
  stop                = Symbol 'stop'
  #.........................................................................................................
  do ->
    p = new Pipeline { protocol: true, }
    p.push Array.from '氣場全開'
    p.push $ { first, last, start, stop, }, observe = ( d ) -> info '^79-1^', rpr d
    result = p.run()
    result.push d for d from p.stop_walk()
    urge '^79-2^', p
    urge '^79-3^', result
    T?.eq result, [ '氣', '場', '全', '開', ]
    H.tabulate "modifiers_of_observers_do_not_leak", p.journal
  #.........................................................................................................
  await do ->
    p = new Async_pipeline { protocol: true, }
    p.push Array.from '氣場全開'
    p.push $ { first, last, start, stop, }, observe = ( d ) -> await GUY.async.after 0.1, -> info '^79-4^', rpr d
    result = await p.run()
    result.push d for await d from p.stop_walk()
    urge '^79-5^', p
    urge '^79-6^', result
    T?.eq result, [ '氣', '場', '全', '開', ]
    H.tabulate "modifiers_of_observers_do_not_leak", p.journal
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@modifiers_with_empty_pipeline = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline    }     = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  do =>
    collector           = []
    p                   = new Pipeline { protocol: true, }
    { $ }               = p
    p.push []
    p.push                             ( d, send ) -> send d * 2
    p.push $ { first,              },  ( d, send ) -> send d
    p.push $ { last,               },  ( d, send ) -> send d
    p.push                             ( d       ) -> urge '^309^', d
    p.push                             ( d, send ) -> collector.push d #; help collector
    p.run()
    T?.eq collector, [ first, last, ]
    H.tabulate 'modifiers_with_empty_pipeline #2', p.journal
  #.........................................................................................................
  do =>
    collector           = []
    p                   = new Pipeline { protocol: true, }
    { $ }               = p
    p.push []
    p.push                             ( d, send ) -> send d * 2
    p.push $ { first, last, },         ( d, send ) -> send d
    p.push                             ( d       ) -> urge '^309^', d
    p.push                             ( d, send ) -> collector.push d #; help collector
    p.run()
    T?.eq collector, [ first, last, ]
    # debug '^453^', d for d in protocol
    H.tabulate 'modifiers_with_empty_pipeline #2', p.journal
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@modifiers_preserved_for_pipeline_segments = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline,           \
    $,                  \
    transforms: TF    } = require '../../../apps/moonriver'
  first                 = Symbol 'first'
  last                  = Symbol 'last'
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push 'abcd'
    p.push $ { first, last, }, ( d, send ) ->
      debug '^53-1^', rpr d
      return send '(' if d is first
      return send ')' if d is last
      send d.toUpperCase()
    p.push TF.$collect()
    # p.push do ->
    #   collector = []
    #   return $ { last, }, ( d, send ) ->
    #     return send collector if d is last
    #     collector.push d
    p.push ( d, send ) -> send d.join ''
    result = p.run()
    result.push d for await d from p.stop_walk()
    T?.eq result, [ '(ABCD)', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@unknown_modifiers_cause_error = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline,           \
    $,                  \
    transforms: TF    } = require '../../../apps/moonriver'
  unknown               = Symbol 'unknown'
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push 'abcd'
    T?.throws /not a valid/, -> p.push $ { unknown, }, ( d ) ->
  #.........................................................................................................
  done?()




############################################################################################################
if require.main is module then do =>
  # @modifiers_first_and_last()
  # test @modifiers_first_and_last_1
  # @modifiers_first_and_last_2()
  # @modifiers_first_and_last_3()
  # test @modifiers_first_and_last_2
  # test @modifiers_first_and_last_3
  # @modifiers_with_empty_pipeline()
  # test @modifiers_with_empty_pipeline
  # await @modifiers_of_observers_do_not_leak()
  # await test @modifiers_of_observers_do_not_leak
  test @modifiers_start_and_stop
  # @unknown_modifiers_cause_error()
  # test @unknown_modifiers_cause_error
  # test @modifiers_with_empty_pipeline
  # test @




