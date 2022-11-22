
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
@modifiers_first_and_last = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline, \
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
  $collect            = ->
    return $ { last, }, do ->
      collector = []
      return collect = ( d, send ) ->
        debug '^234^', d
        return send collector if d is last
        collector.push d
        return null
  #.........................................................................................................
  p.push Array.from '氣場全開'
  p.push $with_stars()
  p.push $add_parentheses()
  # p.push $collect()
  p.push show = ( d ) -> whisper rpr d
  result = p.run()
  urge '^735^', result
  T?.eq result, [ '(', '*氣*', '*場*', '*全*', '*開*', ')' ]
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
    protocol            = []
    p                   = new Pipeline { protocol, }
    { $ }               = p
    p.push []
    p.push                             ( d, send ) -> send d * 2
    p.push $ { first,              },  ( d, send ) -> send d
    p.push $ { last,               },  ( d, send ) -> send d
    p.push                             ( d       ) -> urge '^309^', d
    p.push                             ( d, send ) -> collector.push d #; help collector
    p.run()
    T?.eq collector, [ first, last, ]
    # debug '^453^', d for d in protocol
    # H.tabulate 'protocol', protocol
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_appending_data_before_closing = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  last          = Symbol 'last'
  collector     = []
  p            = new Pipeline()
  #.......................................................................................................
  p.push [ -1, ]
  p.push show    = ( d ) -> urge '^4948-1^', d
  p.push $ { last, }, at_last = ( d, send ) ->
    return send d unless d is last
    send e for e in [ 'a', 'b', 'c', ]
  p.push show    = ( d ) -> urge '^4948-2^', d
  p.push collect = ( d ) -> collector.push d
  p.run()
  T?.eq collector, [ -1, 'a', 'b', 'c' ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_modifier_last_does_not_leak_into_pipeline_when_used_with_observer = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  last1        = Symbol 'last1'
  last2        = Symbol 'last2'
  collector     = []
  #.......................................................................................................
  do =>
    p = new Pipeline()
    p.push Array.from 'abc'
    p.push $ { last: last1, }, ( d )       -> debug '^765-1^', rpr d
    p.push $ { last: last2, }, ( d, send ) -> debug '^765-2^', rpr d; send d unless d is last2
    p.push ( d ) -> collector.push d
    #.....................................................................................................
    p.run()
    urge '^859^', collector
    T?.eq collector, Array.from 'abc'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_modifier_last = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  first         = Symbol 'first'
  last          = Symbol 'last'
  collector     = []
  p            = new Pipeline()
  #.......................................................................................................
  p.push [ 'first', 'second', 'third', ]
  s1 = p.push $ { last, }, finalize = ( d, send ) ->
    debug '^347^', rpr d
    if d is last
      collector.push collector.length
      return send 'fourth'
    send d
    return null
  p.push collect = ( d ) -> collector.push d
  #.........................................................................................................
  T?.eq s1.modifiers.last,          true
  T?.eq s1.modifiers.values?.last,  last
  #.........................................................................................................
  p.run()
  debug '^343^', collector
  T?.eq collector, [ 'first', 'second', 'third', 3, 'fourth', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_modifier_once_after_last = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  collector     = []
  p            = new Pipeline()
  #.......................................................................................................
  p.push [ 'first', 'second', 'third', ]
  s1 = p.push $ { once_after_last: true, }, finalize = ( d ) ->
    collector.push collector.length
    return null
  p.push ( d ) -> collector.push d
  #.........................................................................................................
  T?.eq s1.is_sender,                 true
  T?.eq s1.modifiers.once_after_last, true
  #.........................................................................................................
  p.run()
  T?.eq collector, [ 'first', 'second', 'third', 3, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_exit_symbol = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  collector     = []
  protocol      = []
  p            = new Pipeline { protocol, }
  #.......................................................................................................
  p.push [ 'first', 'second', 'third', 'fourth', 'fifth', ]
  p.push look_for_third = ( d, send ) ->
    send if d is 'third' then Symbol.for 'exit' else d
  p.push collect = ( d, send ) ->
    collector.push d
  p.run()
  echo rpr d for d in collector
  T?.eq collector, [ 'first', 'second', ]
  H.tabulate 'protocol', protocol
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_once_before_first_and_once_after_last_called_even_when_pipeline_empty = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  collector         = []
  once_before_first = true
  once_after_last   = true
  counts            =
    once_before_first:  0
    once_after_last:    0
  p                = new Pipeline()
  #.......................................................................................................
  p.push []
  p.push $ { once_before_first,  },  on_once_before  = ( d ) -> counts.once_before_first++
  p.push show_1  = ( d       ) -> urge '^498-1^', rpr d
  p.push $ { once_after_last,    },  on_once_after   = ( d ) -> counts.once_after_last++
  p.push collect = ( d       ) -> collector.push d
  p.push show_2  = ( d       ) -> urge '^498-2^', rpr d
  p.run()
  T?.eq counts, { once_before_first: 1, once_after_last: 1 }
  T?.eq collector, []
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_modifier_first_does_not_leak_into_pipeline_when_used_with_observer = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  first1        = Symbol 'first1'
  first2        = Symbol 'first2'
  collector     = []
  #.......................................................................................................
  do =>
    p = new Pipeline()
    p.push Array.from 'abc'
    p.push $ { first: first1, }, ( d )       -> debug '^765-1^', rpr d
    p.push $ { first: first2, }, ( d, send ) -> debug '^765-2^', rpr d; send d unless d is first2
    p.push ( d ) -> collector.push d
    #.....................................................................................................
    p.run()
    urge '^859^', collector
    T?.eq collector, Array.from 'abc'
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @modifiers_first_and_last()
  # test @modifiers_first_and_last
  @modifiers_with_empty_pipeline()
  test @modifiers_with_empty_pipeline
  # test @




