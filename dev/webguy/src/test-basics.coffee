
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
  whisper }               = GUY.trm.get_loggers 'webguy/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
types                     = new ( require 'intertype-newest' ).Intertype()
{ isa }                   = types

# #-----------------------------------------------------------------------------------------------------------
# @[ "_XEMITTER: _" ] = ( T, done ) ->
#   { DATOM }                 = require '../../../apps/datom'
#   { new_datom
#     select }                = DATOM
  # { Djehuti }               = require '../../../apps/intertalk'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ key, value, ] = probe
#       resolve new_datom key, value
#   done()
#   return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_basic = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  a = { number: 12, a_f: null, }
  b = { number: 123, text: 123, b_f: 123, a_f: 123, }
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_skips_constructor = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      return undefined
    a_f: ->
  a = new A()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_inludes_inherited = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      return undefined
    a_f: ->
  class B extends A
    constructor: ->
      super()
      @text = 'abcd'
      return undefined
    b_f: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_skips_underscores_and_symbols = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      @_do_not_touch_me = false
      return undefined
    a_f: ->
  class B extends A
    constructor: ->
      super()
      @text = 'abcd'
      @[Symbol 'helo'] = 456
      @_do_not_touch_me_either = false
      return undefined
    b_f: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null


#===========================================================================================================
# TIME
#-----------------------------------------------------------------------------------------------------------
@time_exports = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  T?.ok WGUY.time instanceof WGUY.time.Time
  T?.ok isa.function WGUY.time.stamp_f
  T?.ok isa.function WGUY.time.stamp_s
  T?.ok isa.function WGUY.time.monostamp_f2
  T?.ok isa.function WGUY.time.monostamp_s2
  T?.ok isa.function WGUY.time.monostamp_s1
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@time_datatypes = ( T, done ) ->
  WGUY  = require '../../../apps/webguy'
  time  = new WGUY.time.Time { format: 'milliseconds', }
  #.........................................................................................................
  T?.ok isa.float           time.stamp_f()
  T?.ok isa.nonempty.text   time.stamp_s 0
  T?.ok isa.nonempty.text   time.stamp_s()
  T?.ok isa.list.of.float   time.monostamp_f2()
  T?.eq time.monostamp_f2().length, 2
  T?.eq ( time.stamp_s 0               ), '0000000000000.000'
  T?.eq ( time.monostamp_s1 45678      ), '0000000045678.000:000'
  T?.eq ( time.monostamp_s1 45678, 123 ), '0000000045678.000:123'
  T?.eq ( time.monostamp_s2 45678      ), [ '0000000045678.000', '000', ]
  T?.eq ( time.monostamp_s2 45678, 123 ), [ '0000000045678.000', '123', ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@time_stamp = ( T, done ) ->
  WGUY  = require '../../../apps/webguy'
  #.........................................................................................................
  ts_f    = WGUY.time.stamp_f()
  ts_s_1  = WGUY.time.stamp_s ts_f
  ts_s_2  = WGUY.time.stamp_s()
  T?.eq ( ts_f.toFixed 3 ), ts_s_1
  T?.ok ts_s_2 > ts_s_1 # Note: comparing digit strings should be OK
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@time_monostamp = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  stamp_f_matcher = performance.timeOrigin + performance.now()
  delta_ms        = 500
  await GUY.async.sleep delta_ms / 1000
  stamp_f_result  = WGUY.time.monostamp_f2()[ 0 ]
  # debug '^223^', { stamp_f_matcher, stamp_f_result, }
  T?.ok stamp_f_matcher - delta_ms * 2 < stamp_f_result < stamp_f_matcher + delta_ms * 2
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@time_configurability = ( T, done ) ->
  WGUY  = require '../../../apps/webguy'
  #.........................................................................................................
  do =>
    time  = new WGUY.time.Time { format: 'milliseconds', counter_joiner: '-', ms_padder: '_', count_digits: 2, }
    T?.eq ( time.stamp_s 0               ), '____________0.000'
    T?.eq ( time.monostamp_s1 456.789      ), '__________456.789-00'
    T?.eq ( time.monostamp_s1 456.789, 123 ), '__________456.789-123'
    T?.eq ( time.monostamp_s2 456.789      ), [ '__________456.789', '00', ]
    T?.eq ( time.monostamp_s2 456.789, 123 ), [ '__________456.789', '123', ]
  #.........................................................................................................
  do =>
    time  = new WGUY.time.Time { format: 'milliseconds', }
    T?.eq ( time.stamp_s 0               ), '0000000000000.000'
    T?.eq ( time.monostamp_s1 456.789      ), '0000000000456.789:000'
    T?.eq ( time.monostamp_s1 456.789, 123 ), '0000000000456.789:123'
    T?.eq ( time.monostamp_s2 456.789      ), [ '0000000000456.789', '000', ]
    T?.eq ( time.monostamp_s2 456.789, 123 ), [ '0000000000456.789', '123', ]
  #.........................................................................................................
  do =>
    time  = new WGUY.time.Time { format: 'iso', }
    T?.eq ( time.stamp_s 0               ), '0000000000000.000'
    T?.eq ( time.monostamp_s1 456.789      ), '1970-01-01T00:00:00.456789Z:000'
    T?.eq ( time.monostamp_s1 456.789, 123 ), '1970-01-01T00:00:00.456789Z:123'
    T?.eq ( time.monostamp_s2 456.789      ), [ '1970-01-01T00:00:00.456789Z', '000' ]
    T?.eq ( time.monostamp_s2 456.789, 123 ), [ '1970-01-01T00:00:00.456789Z', '123' ]
  #.........................................................................................................
  do =>
    time  = new WGUY.time.Time { format: 'YYYY MM DD HH:mm:ss.µ [Z]', }
    T?.eq ( time.stamp_s 0               ), '0000000000000.000'
    T?.eq ( time.stamp        456.789      ), '1970 01 01 00:00:00.456789 Z:000'
    T?.eq ( time.stamp        456.789, 123 ), '1970 01 01 00:00:00.456789 Z:123'
    T?.eq ( time.monostamp_s2 456.789      ), [ '1970 01 01 00:00:00.456789 Z', '000' ]
    T?.eq ( time.monostamp_s2 456.789, 123 ), [ '1970 01 01 00:00:00.456789 Z', '123' ]
  #.........................................................................................................
  do =>
    time  = new WGUY.time.Time { format: 'YYYYMMDDHHmmssµ', }
    T?.eq ( time.stamp_s 0               ), '0000000000000.000'
    T?.eq ( time.stamp        456.789      ), '19700101000000456789:000'
    T?.eq ( time.stamp        456.789, 123 ), '19700101000000456789:123'
    T?.eq ( time.monostamp_s2 456.789      ), [ '19700101000000456789', '000' ]
    T?.eq ( time.monostamp_s2 456.789, 123 ), [ '19700101000000456789', '123' ]
    debug '^34347^', time.stamp()
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@time_default = ( T, done ) ->
  WGUY  = require '../../../apps/webguy'
  T?.eq ( WGUY.time.stamp 1234567890123 ), '2009-02-13T23:31:30.123000Z:000'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo = ( T, done ) ->
  WGUY  = require '../../../apps/webguy'
  #.........................................................................................................
  # stamps = ( WGUY.time.monostamp_s1() for _ in [ 1 .. 10e6 ] )
  # stamps = ( stamp for stamp in stamps when /[1-9]$/.test stamp )
  # debug '^2342-4^', stamp for stamp in stamps
  #.........................................................................................................
  done?()
  return null

#===========================================================================================================
@environment_node = ( T, done ) ->
  WGUY  = require '../../../apps/webguy'
  T?.eq ( WGUY.environment ), {
    browser: false, nodejs: true, webworker: false, jsdom: false, deno: false, name: 'nodejs', }
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  test @
  # test @time_exports
  # @time_stamp()
  # @time_monostamp()
  # test @time_datatypes



