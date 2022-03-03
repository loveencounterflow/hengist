
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
    pipeline  = [
      [ 1, 2, 3, 5, ]
      ( d, send ) -> send d * 2
      ( d, send ) -> send d #; urge d
      ( d, send ) -> collector.push d #; help collector
      ]
    mr = new Moonriver pipeline
    mr.drive()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  do =>
    collector = []
    pipeline  = [
      [ 'a', 'b', ]
      ( d, send ) -> urge '^598^', d; send d
      ( d, send ) ->
        send d
        if send.call_count is 1
          send e for e from [ 1, 2, 3, 5, ].values()
        return null
      ( d, send ) -> send if isa.float d then d * 2 else d
      ( d       ) -> urge d
      ( d, send ) -> collector.push d #; help collector
      ]
    mr = new Moonriver pipeline
    mr.drive()
    T?.eq collector, [ 'a', 2, 4, 6, 10, 'b' ]
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
    first       = Symbol 'first'
    last        = Symbol 'last'
    once_before = Symbol.for 'once_before'
    once_after  = Symbol.for 'once_after'
    collector   = []
    counts      =
      once_before:  0
      first:        0
      last:         0
      once_after:   0
    #.......................................................................................................
    pipeline  = [
      #.....................................................................................................
      source
      #.....................................................................................................
      $ { once_before, }, on_first = ( d ) ->
        counts.once_before++
      #.....................................................................................................
      $ { first, }, initialize_stack = ( d ) ->
        counts.first++
        if d is first
          @user.stack = []
          urge '^3487^', 'initialize_stack()', @.user
        return null
      #.....................................................................................................
      push_opening_to_stack = ( d, send ) ->
        return send d if  not isa.text d
        return send d if  not d.startsWith '<'
        return send d if      d.startsWith '</'
        left_d  = d.replace /^<([^\s>]+).*$/, '$1'
        # debug '^039850^', { left_d, }
        @user.stack.push left_d
        send d
      #.....................................................................................................
      pop_closing_from_stack = ( d, send ) ->
        return send d if  not isa.text d
        return send d if  not d.startsWith '</'
        # debug '^4564^', 'pop_closing_from_stack', @user.stack, d
        if @user.stack.length < 1
          send "error: extraneous closing tag #{rpr d}"
          return send d
        left_d  = @user.stack.pop()
        right_d = d.replace /^<\/([^\s>]+).*$/, '$1'
        # debug '^039850^', { left_d, right_d, }
        unless left_d is right_d
          send "error: expected closing tag for <#{rpr left_d}>, got #{rpr d}"
          return send d
        send d
      #.....................................................................................................
      $ { once_after, }, pop_remaining_from_stack = ( d ) ->
        debug '^309-1^', d
        # counts.last++
        # send d
      #.....................................................................................................
      collect = ( d ) ->
        debug '^309-1^', d
        collector.push d
      #.....................................................................................................
      $ { once_after, }, cleanup = ( d ) ->
        debug '^309-2^', d
        counts.once_after++
      #.....................................................................................................
      $ { last, }, cleanup = ( d ) ->
        debug '^309-2^', d
        counts.last++
      #.....................................................................................................
      ]
    mr = new Moonriver pipeline
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
      once_before:  1
      first:        source.length + 1
      last:         source.length + 3 + 1
      once_after:   1 }
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "modifier last" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  first         = Symbol 'first'
  last          = Symbol 'last'
  collector     = []
  #.......................................................................................................
  pipeline      = [
    [ 'first', 'second', 'third', ]
    #.....................................................................................................
    $ { last, }, finalize = ( d, send ) ->
      if d is last
        collector.push collector.length
        return send 'fourth'
      send d
      return null
    #.....................................................................................................
    ( d ) -> collector.push d
    #.....................................................................................................
    ]
  #.........................................................................................................
  mr      = new Moonriver pipeline
  segment = mr.pipeline[ 1 ]
  T?.eq segment.modifications.do_last,  true
  T?.eq segment.modifications.last,     last
  #.........................................................................................................
  error = null
  try mr.drive() catch error
    T?.ok /cannot send values after pipeline has terminated/.test error.message
  T?.ok error?
  #.........................................................................................................
  echo rpr d for d in collector
  T?.eq collector, [ 'first', 'second', 'third', 3, ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "modifier once_after" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  once_after    = Symbol 'once_after'
  collector     = []
  #.......................................................................................................
  pipeline      = [
    [ 'first', 'second', 'third', ]
    #.....................................................................................................
    $ { once_after, }, finalize = ( d ) ->
      if d is once_after
        collector.push collector.length
      return null
    #.....................................................................................................
    ( d ) -> collector.push d
    #.....................................................................................................
    ]
  #.........................................................................................................
  mr      = new Moonriver pipeline
  segment = mr.pipeline[ 1 ]
  T?.eq segment.is_sender,                    false
  T?.eq segment.is_listener,                  false
  T?.eq segment.modifications.do_once_after,  true
  T?.eq segment.modifications.once_after,     once_after
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
  #.......................................................................................................
  pipeline      = [
    [ 'first', 'second', 'third', 'fourth', 'fifth', ]
    #.....................................................................................................
    look_for_third = ( d, send ) ->
      send if d is 'third' then Symbol.for 'exit' else d
    #.....................................................................................................
    collect = ( d, send ) ->
      collector.push d
    #.....................................................................................................
    ]
  mr = new Moonriver pipeline
  mr.drive()
  echo rpr d for d in collector
  T?.eq collector, [ 'first', 'second', ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "called even when pipeline empty: once_before, once_after" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  collector     = []
  once_before   = Symbol.for 'once_before'
  once_after    = Symbol.for 'once_after'
  counts        =
    once_before:  0
    once_after:   0
  #.......................................................................................................
  pipeline      = [
    []
    #.....................................................................................................
    $ { once_before, }, on_once_before = ( d ) ->
      counts.once_before++
    #.....................................................................................................
    show_1 = ( d, send ) -> urge '^498-1^', rpr d; send d
    #.....................................................................................................
    $ { once_after, }, on_once_after = ( d ) ->
      counts.once_after++
    #.....................................................................................................
    collect = ( d, send ) ->
      collector.push d
      send d
    #.....................................................................................................
    show_2 = ( d, send ) -> urge '^498-2^', rpr d; send d
    #.....................................................................................................
    ]
  mr = new Moonriver pipeline
  mr.drive()
  T?.eq counts, { once_before: 1, once_after: 1 }
  T?.eq collector, []
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "transforms with once_after must not be senders" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  once_after    = Symbol.for 'once_after'
  #.......................................................................................................
  pipeline      = [
    $ { once_after, }, on_once_after = ( d, send ) ->
    ]
  #.........................................................................................................
  error = null
  try mr = new Moonriver pipeline catch error
    # throw error
    T?.ok /transforms with modifier once_after cannot be senders/.test error.message
  T?.ok error?
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "using send() in a once_before transform" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  once_before   = [ 42, 43, 44, ]
  collector     = []
  #.......................................................................................................
  pipeline      = [
    $ { once_before, }, on_once_before = ( d, send ) ->
      debug '^4532^', d
      send e for e in d
    show    = ( d ) -> urge '^4948^', d
    collect = ( d ) -> collector.push d
    ]
  mr = new Moonriver pipeline
  mr.drive()
  T?.eq collector, [ 42, 43, 44, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "appending data before closing" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  before_last   = Symbol 'before_last'
  collector     = []
  #.......................................................................................................
  pipeline      = [
    [ -1, ]
    show    = ( d ) -> urge '^4948-1^', d
    $ { before_last, }, on_once_before = ( d, send ) ->
      debug '^4532^', d
      return send d unless d is before_last
      send e for e in [ 'a', 'b', 'c', ]
    show    = ( d ) -> urge '^4948-2^', d
    collect = ( d ) -> collector.push d
    ]
  mr = new Moonriver pipeline
  mr.drive()
  help '^894^', collector
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "once_before, once_after transformers transparent to data" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver } = require '../../../apps/moonriver'
  { $ }         = Moonriver
  collectors    =
    c1: []
    c2: []
    c3: []
    c4: []
    c5: []
  #.......................................................................................................
  pipeline      = [
    [ 'a', 'b', 'c', ]
    collect = ( d ) ->                                                          collectors.c1.push d
    $ { once_before:  'bfr', }, on_once_before  = ( d ) -> debug '^453-1^', d;  collectors.c2.push d
    collect = ( d ) ->                                                          collectors.c3.push d
    $ { once_after:   'aft', }, on_once_after   = ( d ) -> debug '^453-2^', d;  collectors.c4.push d
    collect = ( d ) ->                                                          collectors.c5.push d
    show    = ( d ) -> urge '^4948^', d
    ]
  mr = new Moonriver pipeline
  mr.drive()
  help '^894^', collectors.c1
  help '^894^', collectors.c2
  help '^894^', collectors.c3
  help '^894^', collectors.c4
  help '^894^', collectors.c5
  T?.eq collectors.c1, [ 'a', 'b', 'c', ]
  T?.eq collectors.c2, [ 'bfr', ]
  T?.eq collectors.c3, [ 'a', 'b', 'c', ]
  T?.eq collectors.c4, [ 'aft', ]
  T?.eq collectors.c5, [ 'a', 'b', 'c', ]
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # @[ "send.call_count" ]()
  @[ "appending data before closing" ]()
  # test @[ "appending data before closing" ]
  # test @[ "using send() in a once_before transform" ]
  # @[ "once_before, once_after transformers transparent to data" ]()
  # test @[ "once_before, once_after transformers transparent to data" ]
  # @[ "resettable state shared across transforms" ]()
  # test @[ "resettable state shared across transforms" ]
  # @[ "modifier once_after" ]()
  # test @[ "modifier once_after" ]
  # @[ "modifier last" ]()
  # test @[ "modifier last" ]
  # test @[ "modifier last" ]
  # @[ "called even when pipeline empty: once_before, once_after" ]()
  # test @[ "called even when pipeline empty: once_before, once_after" ]
  # test @[ "transforms with once_after must not be senders" ]
  # test @[ "exit symbol" ]
  # @[ "can access pipeline from within transform, get user area" ]()
  # test @[ "can access pipeline from within transform, get user area" ]


