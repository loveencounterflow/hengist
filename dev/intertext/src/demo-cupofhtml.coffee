


'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/INTERTEXT/DEMO-CUPOFHTML'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
INTERTEXT                 = require '../../../apps/intertext'


#-----------------------------------------------------------------------------------------------------------
demo = ->
  cupofhtml         = new INTERTEXT.HTML.Cupofhtml { flatten: true, }
  { cram
    expand
    tag }  = cupofhtml.export()
  tag 'mytag', =>
    tag 'h1', => #, { id: 'c67', }
      tag 'p', "helo world"
  debug '^3344^', cupofhtml
  ds = expand()
  debug '^3344^', ds
  debug '^3344^', INTERTEXT.HTML.html_from_datoms ds


############################################################################################################
if module is require.main then do =>
  demo()




