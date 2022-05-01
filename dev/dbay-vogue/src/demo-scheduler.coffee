
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
  { Vogue 
    Vogue_db 
    Vogue_scraper } = require '../../../apps/dbay-vogue'
  vogue = new Vogue()
  vogue.scheduler.XXX_get_interval ->
    help '^543-1^', "start"
    await vogue.scheduler.sleep 1.5
    info '^543-1^', "stop"
  return null


############################################################################################################
if module is require.main then do =>
  await demo_scheduler()

