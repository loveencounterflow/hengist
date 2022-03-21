
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


  # #.........................................................................................................
  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->


#-----------------------------------------------------------------------------------------------------------
@[ "send.call_count" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver
    $once     } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    mr        = new Moonriver()
    mr.push [ 1, 2, 3, 5, ]
    mr.push ( d, send ) -> send d * 2
    mr.push ( d, send ) -> send d #; urge d
    mr.push ( d, send ) -> collector.push d #; help collector
    mr.drive()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  do =>
    collector = []
    mr        = new Moonriver()
    mr.push [ 'a', 'b', ]
    mr.push ( d, send ) -> urge '^598^', d; send d
    mr.push ( d, send ) ->
      send d
      if @call_count is 1
        send e for e from [ 1, 2, 3, 5, ].values()
      return null
    mr.push ( d, send ) -> send if isa.float d then d * 2 else d
    mr.push ( d       ) -> urge d
    mr.push ( d, send ) -> collector.push d #; help collector
    mr.drive()
    T?.eq collector, [ 'a', 2, 4, 6, 10, 'b' ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "modifiers" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver   }   = require '../../../apps/moonriver'
  { $           }   = Moonriver
  first             = Symbol 'first'
  last              = Symbol 'last'
  once_before_first = true
  once_after_last   = true
  #.........................................................................................................
  do =>
    collector         = []
    protocol          = []
    mr                = new Moonriver { protocol, }
    mr.push [ 1, 2, 3, 5, ]
    mr.push                             ( d, send ) -> send d * 2
    mr.push $ { first,              },  ( d, send ) -> send d
    mr.push $ { last,               },  ( d, send ) -> send d
    mr.push                             ( d       ) -> urge '^309^', d
    mr.push                             ( d, send ) -> collector.push d #; help collector
    mr.drive()
    T?.eq collector, [ first, 2, 4, 6, 10, last, ]
    # debug '^453^', d for d in protocol
    # console.table protocol
    H.tabulate 'protocol', protocol
  #.........................................................................................................
  do =>
    collector         = []
    protocol          = []
    mr                = new Moonriver { protocol, }
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
    mr.drive()
    T?.eq collector, [ 'once_before_first', first, 2, 4, 6, 10, last, 'once_after_last', ]
    debug '^453^', collector
    # console.table protocol
    H.tabulate 'protocol', protocol
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "can access pipeline from within transform, get user area" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    pipeline  = [
      [ '^4564^', ]
      ( d ) -> urge d
      #.....................................................................................................
      can_access_pipeline_1 = ( d ) ->
        if @ is mr then T?.ok true
        else            T?.fail "^478-1^ not ok"
        return null
      #.....................................................................................................
      can_access_pipeline_2 = ( d, send ) ->
        send d
        if @ is mr then T?.ok true
        else            T?.fail "^478-2^ not ok"
        return null
      #.....................................................................................................
      has_user_area = ( d, send ) ->
        send d
        if isa.object @user then  T?.ok true
        else                      T?.fail "^478-3^ not ok"
        return null
      #.....................................................................................................
      ]
    mr = new Moonriver pipeline
    debug '^558^', mr
    mr.drive()
    # T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "resettable state shared across transforms" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
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
    mr                = new Moonriver()
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
      debug '^487^', @call_count
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
    mr.drive()
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
@[ "modifier first does not leak into pipeline when used with observer" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  first1        = Symbol 'first1'
  first2        = Symbol 'first2'
  collector     = []
  #.......................................................................................................
  do =>
    mr = new Moonriver()
    mr.push Array.from 'abc'
    mr.push $ { first: first1, }, ( d )       -> debug '^765-1^', rpr d
    mr.push $ { first: first2, }, ( d, send ) -> debug '^765-2^', rpr d; send d unless d is first2
    mr.push ( d ) -> collector.push d
    #.....................................................................................................
    mr.drive()
    urge '^859^', collector
    T?.eq collector, Array.from 'abc'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "modifier last does not leak into pipeline when used with observer" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  last1        = Symbol 'last1'
  last2        = Symbol 'last2'
  collector     = []
  #.......................................................................................................
  do =>
    mr = new Moonriver()
    mr.push Array.from 'abc'
    mr.push $ { last: last1, }, ( d )       -> debug '^765-1^', rpr d
    mr.push $ { last: last2, }, ( d, send ) -> debug '^765-2^', rpr d; send d unless d is last2
    mr.push ( d ) -> collector.push d
    #.....................................................................................................
    mr.drive()
    urge '^859^', collector
    T?.eq collector, Array.from 'abc'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "modifier last" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  first         = Symbol 'first'
  last          = Symbol 'last'
  collector     = []
  mr            = new Moonriver()
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
  mr.drive()
  debug '^343^', collector
  T?.eq collector, [ 'first', 'second', 'third', 3, 'fourth', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "modifier once_after_last" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  collector     = []
  mr            = new Moonriver()
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
  mr.drive()
  T?.eq collector, [ 'first', 'second', 'third', 3, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "exit symbol" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  collector     = []
  protocol      = []
  mr            = new Moonriver { protocol, }
  #.......................................................................................................
  mr.push [ 'first', 'second', 'third', 'fourth', 'fifth', ]
  mr.push look_for_third = ( d, send ) ->
    send if d is 'third' then Symbol.for 'exit' else d
  mr.push collect = ( d, send ) ->
    collector.push d
  mr.drive()
  echo rpr d for d in collector
  T?.eq collector, [ 'first', 'second', ]
  H.tabulate 'protocol', protocol
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "called even when pipeline empty: once_before_first, once_after_last" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver }     = require '../../../apps/moonriver'
  { $ }             = Moonriver
  collector         = []
  once_before_first = true
  once_after_last   = true
  counts            =
    once_before_first:  0
    once_after_last:    0
  mr                = new Moonriver()
  #.......................................................................................................
  mr.push []
  mr.push $ { once_before_first,  },  on_once_before  = ( d ) -> counts.once_before_first++
  mr.push show_1  = ( d       ) -> urge '^498-1^', rpr d
  mr.push $ { once_after_last,    },  on_once_after   = ( d ) -> counts.once_after_last++
  mr.push collect = ( d       ) -> collector.push d
  mr.push show_2  = ( d       ) -> urge '^498-2^', rpr d
  mr.drive()
  T?.eq counts, { once_before_first: 1, once_after_last: 1 }
  T?.eq collector, []
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "transforms with once_after_last can (not yet) be senders" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver }   = require '../../../apps/moonriver'
  { $ }           = Moonriver
  once_after_last = true
  collector       = []
  mr              = new Moonriver()
  #.......................................................................................................
  # mr.push [ 1, 2, 3, ]
  error = null
  try
    mr.push $ { once_after_last, }, on_once_after = ( d, send ) -> send 'last'
  catch error
    if ( error.message.match /transform with arity 2 not implemented for modifiers once_before_first, once_after_last/ )?
      T?.ok true
    else
      throw error
  T?.ok error?
  # mr.push collect = ( d ) -> collector.push d
  # mr.drive()
  # debug '^498^', collector
  # T?.eq collector, [ 1, 2, 3, 'last', ]
  #.........................................................................................................
  done?()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "using send() in once_before_first, once_after_last transforms" ] = ( T, done ) ->
#   # T?.halt_on_error()
#   { Moonriver } = require '../../../apps/moonriver'
#   { $ }         = Moonriver
#   collector     = []
#   mr            = new Moonriver()
#   #.......................................................................................................
#   mr.push [ 0, ]
#   mr.push $ { once_before_first:  true, }, once_before_first = ( send ) -> send e for e in [ 42, 43, 44, ]
#   mr.push $ { once_after_last:    true, }, once_after_last   = ( send ) -> send e for e in [ 45, 46, 47, ]
#   mr.push show    = ( d ) -> urge '^4948^', d
#   mr.push collect = ( d ) -> collector.push d
#   mr.drive()
#   T?.eq collector, [ 42, 43, 44, 0, 45, 46, 47, ]
#   #.........................................................................................................
#   done?()
#   return null

#-----------------------------------------------------------------------------------------------------------
@[ "appending data before closing" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  last          = Symbol 'last'
  collector     = []
  mr            = new Moonriver()
  #.......................................................................................................
  mr.push [ -1, ]
  mr.push show    = ( d ) -> urge '^4948-1^', d
  mr.push $ { last, }, at_last = ( d, send ) ->
    return send d unless d is last
    send e for e in [ 'a', 'b', 'c', ]
  mr.push show    = ( d ) -> urge '^4948-2^', d
  mr.push collect = ( d ) -> collector.push d
  mr.drive()
  T?.eq collector, [ -1, 'a', 'b', 'c' ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "once_before_first, once_after_last transformers transparent to data" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  collectors    =
    c1: []
    c2: []
    c3: []
    c4: []
  mr            = new Moonriver()
  #.......................................................................................................
  mr.push Array.from 'bcd'
  mr.push $ { once_before_first:  true,   }, once_before_first  = ( send  ) -> send 'A';                                  T?.eq [ arguments..., ].length, 1
  mr.push $ { once_before_first:  true,   }, once_before_first  =           -> collectors.c1.push 'E';                    T?.eq [ arguments..., ].length, 0
  mr.push collect2                                              = ( d     ) -> debug '^453-2^', d;  collectors.c2.push d; T?.eq [ arguments..., ].length, 1
  mr.push $ { once_after_last:    true,   }, once_after_last    = ( send  ) -> send 'Z';                                  T?.eq [ arguments..., ].length, 1
  mr.push $ { once_after_last:    true,   }, once_after_last    =           -> collectors.c3.push 'F';                    T?.eq [ arguments..., ].length, 0
  mr.push collect4                                              = ( d     ) -> debug '^453-4^', d;  collectors.c4.push d; T?.eq [ arguments..., ].length, 1
  mr.drive()
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



############################################################################################################
if require.main is module then do =>
  test @
  # @[ "called even when pipeline empty: once_before_first, once_after_last" ](); test @[ "called even when pipeline empty: once_before_first, once_after_last" ]
  # @[ "appending data before closing" ](); test @[ "appending data before closing" ]
  # @[ "once_before_first, once_after_last transformers transparent to data" ](); test @[ "once_before_first, once_after_last transformers transparent to data" ]

