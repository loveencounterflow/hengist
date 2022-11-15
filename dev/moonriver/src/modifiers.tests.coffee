
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MOONRIVER/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
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
@_modifiers = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  first             = Symbol 'first'
  last              = Symbol 'last'
  once_before_first = true
  once_after_last   = true
  #.........................................................................................................
  do =>
    collector         = []
    protocol          = []
    mr                = new Pipeline { protocol, }
    mr.push [ 1, 2, 3, 5, ]
    mr.push                             ( d, send ) -> send d * 2
    mr.push $ { first,              },  ( d, send ) -> send d
    mr.push $ { last,               },  ( d, send ) -> send d
    mr.push                             ( d       ) -> urge '^309^', d
    mr.push                             ( d, send ) -> collector.push d #; help collector
    mr.run()
    T?.eq collector, [ first, 2, 4, 6, 10, last, ]
    # debug '^453^', d for d in protocol
    # console.table protocol
    H.tabulate 'protocol', protocol
  #.........................................................................................................
  do =>
    collector         = []
    protocol          = []
    mr                = new Pipeline { protocol, }
    mr.push [ 1, 2, 3, 5, ]
    mr.push                             ( d, send ) -> send d * 2
    mr.push $ { first,              },  ( d, send ) -> send d
    # mr.push $ { once_after_last,    },  ( d       ) -> debug '^987^', 'once_after_last'
    mr.push $ { last,               },  ( d, send ) -> send d
    mr.push $ { once_before_first,  },  ( d       ) -> debug '^276^ once_before_first'; collector.push 'once_before_first'
    mr.push $ { once_after_last,    },  ( d       ) -> debug '^276^ once_after_last';   collector.push 'once_after_last'
    mr.push                             ( d       ) -> urge '^309^', d
    mr.push                             ( d, send ) -> collector.push d #; help collector
    T?.eq mr.on_once_before_first.length, 1
    T?.eq mr.on_once_after_last.length,   1
    mr.run()
    T?.eq collector, [ 'once_before_first', first, 2, 4, 6, 10, last, 'once_after_last', ]
    debug '^453^', collector
    # console.table protocol
    H.tabulate 'protocol', protocol
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_resettable_state_shared_across_transforms = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  #.........................................................................................................
  source = [
    '<h1>'
    'The Opening'
    '</h1>'
    '<p>'
    'Twas brillig, and the slithy toves Did gyre and gimble in the'
    '<em>'
    'wabe'
    '</p>'
    '</body>'
    '</html>'
    ]
  #.........................................................................................................
  do =>
    first             = Symbol 'first'
    last              = Symbol 'last'
    once_before_first = true
    once_after_last   = true
    collector         = []
    counts            =
      once_before_first:  0
      first:              0
      last:               0
      once_after_last:    0
    mr                = new Pipeline()
    #.......................................................................................................
    mr.push source
    #.......................................................................................................
    mr.push $ { once_before_first, }, on_first = ( d ) ->
      debug '^373^', 'once_before_first'
      debug '^336^', @
      debug '^336^', type_of @
      debug '^336^', ( k for k of @ )
      counts.once_before_first++
    #.......................................................................................................
    mr.push $ { first, }, initialize_stack = ( d ) ->
      debug '^487^', d
      counts.first++
      if d is first
        mr.user.stack = []
        urge '^3487^', 'initialize_stack()', @.user
      return null
    #.......................................................................................................
    mr.push push_opening_to_stack = ( d, send ) ->
      return send d if  not isa.text d
      return send d if  not d.startsWith '<'
      return send d if      d.startsWith '</'
      left_d  = d.replace /^<([^\s>]+).*$/, '$1'
      # debug '^039850^', { left_d, }
      mr.user.stack.push left_d
      send d
    #.......................................................................................................
    mr.push pop_closing_from_stack = ( d, send ) ->
      return send d if  not isa.text d
      return send d if  not d.startsWith '</'
      # debug '^4564^', 'pop_closing_from_stack', mr.user.stack, d
      if mr.user.stack.length < 1
        send "error: extraneous closing tag #{rpr d}"
        return send d
      left_d  = mr.user.stack.pop()
      right_d = d.replace /^<\/([^\s>]+).*$/, '$1'
      # debug '^039850^', { left_d, right_d, }
      unless left_d is right_d
        send "error: expected closing tag for <#{rpr left_d}>, got #{rpr d}"
        return send d
      send d
    #.......................................................................................................
    mr.push $ { once_after_last, }, pop_remaining_from_stack = ( d ) ->
      debug '^309-1^', d
      # counts.last++
      # send d
    #.......................................................................................................
    mr.push collect = ( d ) ->
      debug '^309-1^', d
      collector.push d
    #.......................................................................................................
    mr.push $ { once_after_last, }, cleanup = ( d ) ->
      debug '^309-2^', d
      counts.once_after_last++
    #.......................................................................................................
    mr.push $ { last, }, cleanup = ( d ) ->
      debug '^309-2^', d
      counts.last++
    #.......................................................................................................
    mr.run()
    debug '^558^', mr.user
    echo rpr d for d in collector
    T?.eq collector, [
      '<h1>'
      'The Opening'
      '</h1>'
      '<p>'
      'Twas brillig, and the slithy toves Did gyre and gimble in the'
      '<em>'
      'wabe'
      "error: expected closing tag for <'em'>, got '</p>'"
      '</p>'
      "error: expected closing tag for <'p'>, got '</body>'"
      '</body>'
      "error: extraneous closing tag '</html>'"
      '</html>'
      ]
    T?.eq counts, {
      once_before_first:  1
      first:        source.length + 1
      last:         source.length + 3 + 1
      once_after_last:   1 }
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@_once_before_first_once_after_last_transformers_transparent_to_data = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline
    $           }   = require '../../../apps/moonriver'
  collectors    =
    c1: []
    c2: []
    c3: []
    c4: []
  mr            = new Pipeline()
  #.......................................................................................................
  mr.push Array.from 'bcd'
  mr.push $ { once_before_first:  true,   }, once_before_first  = ( send  ) -> send 'A';                                  T?.eq [ arguments..., ].length, 1
  mr.push $ { once_before_first:  true,   }, once_before_first  =           -> collectors.c1.push 'E';                    T?.eq [ arguments..., ].length, 0
  mr.push collect2                                              = ( d     ) -> debug '^453-2^', d;  collectors.c2.push d; T?.eq [ arguments..., ].length, 1
  mr.push $ { once_after_last:    true,   }, once_after_last    = ( send  ) -> send 'Z';                                  T?.eq [ arguments..., ].length, 1
  mr.push $ { once_after_last:    true,   }, once_after_last    =           -> collectors.c3.push 'F';                    T?.eq [ arguments..., ].length, 0
  mr.push collect4                                              = ( d     ) -> debug '^453-4^', d;  collectors.c4.push d; T?.eq [ arguments..., ].length, 1
  mr.run()
  help '^894^', collectors.c1
  help '^894^', collectors.c2
  help '^894^', collectors.c3
  help '^894^', collectors.c4
  T?.eq collectors.c1, [ 'E', ]
  T?.eq collectors.c2, [ 'A', 'b', 'c', 'd', ]
  T?.eq collectors.c3, [ 'F', ]
  T?.eq collectors.c4, [ 'A', 'b', 'c', 'd', 'Z', ]
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
  mr            = new Pipeline()
  #.......................................................................................................
  mr.push [ -1, ]
  mr.push show    = ( d ) -> urge '^4948-1^', d
  mr.push $ { last, }, at_last = ( d, send ) ->
    return send d unless d is last
    send e for e in [ 'a', 'b', 'c', ]
  mr.push show    = ( d ) -> urge '^4948-2^', d
  mr.push collect = ( d ) -> collector.push d
  mr.run()
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
    mr = new Pipeline()
    mr.push Array.from 'abc'
    mr.push $ { last: last1, }, ( d )       -> debug '^765-1^', rpr d
    mr.push $ { last: last2, }, ( d, send ) -> debug '^765-2^', rpr d; send d unless d is last2
    mr.push ( d ) -> collector.push d
    #.....................................................................................................
    mr.run()
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
  mr            = new Pipeline()
  #.......................................................................................................
  mr.push [ 'first', 'second', 'third', ]
  s1 = mr.push $ { last, }, finalize = ( d, send ) ->
    debug '^347^', rpr d
    if d is last
      collector.push collector.length
      return send 'fourth'
    send d
    return null
  mr.push collect = ( d ) -> collector.push d
  #.........................................................................................................
  T?.eq s1.modifiers.last,          true
  T?.eq s1.modifiers.values?.last,  last
  #.........................................................................................................
  mr.run()
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
  mr            = new Pipeline()
  #.......................................................................................................
  mr.push [ 'first', 'second', 'third', ]
  s1 = mr.push $ { once_after_last: true, }, finalize = ( d ) ->
    collector.push collector.length
    return null
  mr.push ( d ) -> collector.push d
  #.........................................................................................................
  T?.eq s1.is_sender,                 true
  T?.eq s1.modifiers.once_after_last, true
  #.........................................................................................................
  mr.run()
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
  mr            = new Pipeline { protocol, }
  #.......................................................................................................
  mr.push [ 'first', 'second', 'third', 'fourth', 'fifth', ]
  mr.push look_for_third = ( d, send ) ->
    send if d is 'third' then Symbol.for 'exit' else d
  mr.push collect = ( d, send ) ->
    collector.push d
  mr.run()
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
  mr                = new Pipeline()
  #.......................................................................................................
  mr.push []
  mr.push $ { once_before_first,  },  on_once_before  = ( d ) -> counts.once_before_first++
  mr.push show_1  = ( d       ) -> urge '^498-1^', rpr d
  mr.push $ { once_after_last,    },  on_once_after   = ( d ) -> counts.once_after_last++
  mr.push collect = ( d       ) -> collector.push d
  mr.push show_2  = ( d       ) -> urge '^498-2^', rpr d
  mr.run()
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
    mr = new Pipeline()
    mr.push Array.from 'abc'
    mr.push $ { first: first1, }, ( d )       -> debug '^765-1^', rpr d
    mr.push $ { first: first2, }, ( d, send ) -> debug '^765-2^', rpr d; send d unless d is first2
    mr.push ( d ) -> collector.push d
    #.....................................................................................................
    mr.run()
    urge '^859^', collector
    T?.eq collector, Array.from 'abc'
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  test @




