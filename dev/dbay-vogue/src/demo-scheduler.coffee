
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/DEMO-SCHEDULER'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_scheduler = ->
  { AUDIOPLAYER   } = require '../../snippets/lib/demo-node-beep'
  { Vogue 
    Vogue_db 
    Vogue_scraper } = require '../../../apps/dbay-vogue'
  vogue       = new Vogue()
  paths       =
    a: '/usr/share/sounds/LinuxMint/stereo/button-pressed.ogg'
    b: '/usr/share/mint-artwork/sounds/notification.oga'
    c: '/usr/share/mint-artwork/sounds/logout.ogg'
  get_metronome_callee  = -> ( path ) => process.stdout.write '.'
  get_callee  = ( sigil, path ) =>
    return callee  = ->
      process.stdout.write sigil
      AUDIOPLAYER.play path
      await vogue.scheduler.sleep 0.2
  vogue.scheduler.add_interval { callee: get_metronome_callee(), repeat: "0.1 seconds", }
  vogue.scheduler.add_interval { callee: ( get_callee '+', paths.a ), repeat: "1.2 seconds", }
  vogue.scheduler.add_interval { callee: ( get_callee 'X', paths.b ), repeat: "1.5 seconds", }
  vogue.scheduler.add_interval { callee: ( get_callee '@', paths.c ), repeat: "2.1 seconds", }
  return null


############################################################################################################
if module is require.main then do =>
  await demo_scheduler()

