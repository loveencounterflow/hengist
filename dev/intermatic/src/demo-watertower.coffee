
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
{ Intermatic, }           = require '../../../apps/intermatic'
Recorder                  = require './recorder'
after                     = ( dts, f ) -> setTimeout  f, dts * 1000
every                     = ( dts, f ) -> setInterval f, dts * 1000
sleep                     = ( dts ) -> new Promise ( done ) -> after dts, done


#===========================================================================================================
# TYPES
#-----------------------------------------------------------------------------------------------------------
# declare 'toolbox_button_cfg', tests:
#   "x is an object": ( x ) -> @isa.object x

#===========================================================================================================
# FACTORIES
#-----------------------------------------------------------------------------------------------------------
new_watertower_fsm = ->
  #---------------------------------------------------------------------------------------------------------
  barrel =
    moves:
      start:  [ 'void',   'active', ]
      stop:   [ 'active', 'stopped', ]
    data:
      max_level:  110 # maximum fill level in ℓ
      min_level:   90 # minimum fill level in ℓ
      level:        0 # current fill level in ℓ
  #---------------------------------------------------------------------------------------------------------
  inlet =
    moves:
      start:  [ 'void',   'active', ]
      stop:   [ 'active', 'stopped', ]
    data:
      max_rate:   10 # maximum water filling rate in ℓ / s
      min_rate:    0 # minimum water filling rate in ℓ / s
      rate:        0 # current water filling rate in ℓ / s
  #---------------------------------------------------------------------------------------------------------
  outlet =
    moves:
      start:  [ 'void',   'active', ]
      stop:   [ 'active', 'stopped', ]
    data:
      max_rate:   20 # maximum water outflow rate in ℓ / s
      min_rate:    0 # minimum water outflow rate in ℓ / s
      rate:        0 # current water outflow rate in ℓ / s
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'tower'
    moves:
      start:  [ 'void',   'active', ]
      stop:   [ 'active', 'stopped', ]
    cascades: [ 'start', 'stop', ]
    fsms: { barrel, inlet, outlet, }
  #---------------------------------------------------------------------------------------------------------
  return new Intermatic fsmd


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_watertower = ->
  fsm       = new_watertower_fsm()
  recorder  = new Recorder fsm
  # debug '^3334^', fsm.barrel.EXP_dstate
  # debug '^3334^', fsm.inlet.EXP_dstate
  # debug '^3334^', fsm.outlet.EXP_dstate
  # echo CND.inspect fsm.EXP_dstate
  help fsm.EXP_dstate
  info 'fsm.start()';                   fsm.start()
  help fsm.EXP_dstate
  #---------------------------------------------------------------------------------------------------------
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
new_regulator_fsm = ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'regulator'
    moves:
      start:  [ 'void',       'idle',         ]
      stop:   [ 'idle',       'stopped',      ]
      tick:   [ 'idle',       'idle',         ]
      tick:   [ 'growing',    'growing',      ]
      tick:   [ 'declare',    'declare',      ]
      set:    [ 'idle',       'idle',         ]
      inc:    [ 'idle',       'growing',      ]
      # inc:    [ 'growing',    'growing',      ]
      set:    [ 'growing',    'idle',         ]
      dec:    [ 'idle',       'shrinking',    ]
      # dec:    [ 'shrinking',  'shrinking',    ]
      chill:  [ 'any',        'idle',         ]
    #.......................................................................................................
    data:
      tps:        5 # ticks per second
      target:     0
      value:      0
    #.......................................................................................................
    after:
      # #.....................................................................................................
      # tick: ( d ) -> whisper '^332^', "tick", d
      #.....................................................................................................
      inc: ( timer, handler ) ->
        @data.value++
        # urge '^44445^', @EXP_dstate
        if @data.value >= @data.target
          clearInterval timer
          @chill()
          handler()
      #.....................................................................................................
      dec: ( timer, handler ) ->
        @data.value--
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
        warn '^22332^', @move, @EXP_dstate
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
  fsm       = new_regulator_fsm()
  # recorder  = new Recorder fsm
  prv_value = null
  every 0.25, ->
    return if fsm.data.value is prv_value
    prv_value = fsm.data.value
    help fsm.EXP_dstate
  fsm.start()
  fsm.scoobydoo = ( verb, P... ) ->
    p = ( require 'util' ).promisify
    ( p @[ verb ] ) P...
  # await ( p fsm.set ) 10
  fsm.scoobydoo 'set', 10
  after 1, -> fsm.scoobydoo 'set', 3
  after 5, -> fsm.scoobydoo 'set', 8
  # ( p fsm.set ) 10
  info fsm.EXP_dstate
  return null


############################################################################################################
if module is require.main then do =>
  await demo_watertower()
  # await demo_regulator()




