

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
  whisper }               = GUY.trm.get_loggers 'DATOM/DEMO-VNR-HKEY'
{ rpr
  inspect
  echo
  log     }               = GUY.trm


###

Vectorial Numbers (VNRs)
Hierarchical Keys (HKeys)


###

#-----------------------------------------------------------------------------------------------------------
demo_vnrs = ->
  ###
  ###
  d = { $v1_lnr: 1, $v2_col: 1, }
  return null

#-----------------------------------------------------------------------------------------------------------
demo_hkeys = ->
  ###
  'lexer:plain:text'
  'lexer:html:tag:start:em'
  'lexer:md:markup:stars3'
  'lexer:md:text'
  'mdnish:html:tag:start:em'
  'mdnish:html:tag:stop:em'
  ###
  d = { $kr1_origin: 'lexer', $kr2_mode: 'html', }
  return null


#===========================================================================================================
if module is require.main then do =>
  demo_vnrs()
  demo_hkeys()

