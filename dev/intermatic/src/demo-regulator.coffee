
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/WATERTOWER'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
log                       = urge
#...........................................................................................................
test                      = require 'guy-test'
PATH                      = require 'path'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  equals
  validate
  declare
  type_of }               = types.export()
{ freeze
  lets }                  = require 'letsfreezethat'
Intermatic                = require '../../../apps/intermatic'
Recorder                  = require './recorder'
after                     = ( dts, f ) -> setTimeout  f, dts * 1000
every                     = ( dts, f ) -> setInterval f, dts * 1000
sleep                     = ( dts ) -> new Promise ( done ) -> after dts, done


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
new_regulator_fsm = ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'regulator'
    moves:
      start:        'idle'
      chill:        'idle'
      stop:
        idle:       'stopped'
      tick:
        idle:       'idle'
        growing:    'growing'
        declare:    'declare'
      set:
        idle:       'idle'
        growing:    'idle'
      inc:
        idle:       'growing'
        growing:    'growing'
      inc:
        idle:       'shrinking'
        shrinking:  'shrinking'
    #.......................................................................................................
    data:
      tps:        5 # ticks per second
      delta:     10
      target:     0
      value:      0
    #.......................................................................................................
    after:
      # #.....................................................................................................
      # tick: ( d ) -> whisper '^332^', "tick", d
      #.....................................................................................................
      inc: ( timer, handler ) ->
        @data.value += @data.delta
        # urge '^44445^', @EXP_dstate
        if @data.value >= @data.target
          clearInterval timer
          @chill()
          handler()
      #.....................................................................................................
      dec: ( timer, handler ) ->
        @data.value -= @data.delta
        # urge '^44445^', @EXP_dstate
        if @data.value <= @data.target
          clearInterval timer
          @chill()
          handler()
      #.....................................................................................................
      set: ( target, handler ) ->
        @stop_all_timers()
        @data.target  = target
        delta         = Math.sign target - @data.value
        # warn '^22332^', @move, @EXP_dstate
        #...................................................................................................
        if @data.value is target
          return handler()
        if @data.value < target then  timer = every 1 / @data.tps, => @inc timer, handler
        else                          timer = every 1 / @data.tps, => @dec timer, handler
        #...................................................................................................
        @timers.push timer
        return null
    #.......................................................................................................
    stop_all_timers: ->
      for timer in @timers
        clearInterval timer
      return null
    timers: []
  #---------------------------------------------------------------------------------------------------------
  return new Intermatic fsmd

#-----------------------------------------------------------------------------------------------------------
demo_regulator = ->
  BAR = require '../../../apps/intertext/lib/bar'
  new_spinner = require 'ora' ### https://www.skypack.dev/view/ora ###
  # spinner     = new_spinner { spinner: 'boxBounce2', }
  # spinner     = new_spinner { spinner: 'noise', }
  spinner     = new_spinner { spinner: 'growVertical', }
  # spinner     = new_spinner { spinner: 'moon', }
  # spinner     = new_spinner { spinner: 'bouncingBall', }
  # spinner     = new_spinner { spinner: 'material', }
  spinner.start()
  # after 1, ->
  #   spinner.color = 'yellow'
  #   # spinner.text  = 'Loading rainbows'
  fsm       = new_regulator_fsm()
  # recorder  = new Recorder fsm
  prv_value = null
  every 0.21, ->
    return if fsm.data.value is prv_value
    # spinner.succeed()
    prv_value = fsm.data.value
    bar       = BAR.percentage_bar fsm.data.value
    help bar, fsm.EXP_dstate
  fsm.start()
  fsm.scoobydoo = ( verb, P... ) ->
    p = ( require 'util' ).promisify
    ( p @[ verb ] ) P...
  # await ( p fsm.set ) 10
  fsm.scoobydoo 'set', 100
  after 2, -> fsm.scoobydoo 'set', 30
  after 5, -> fsm.scoobydoo 'set', 80
  # ( p fsm.set ) 10
  info fsm.EXP_dstate
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_watertower()
  await demo_regulator()



