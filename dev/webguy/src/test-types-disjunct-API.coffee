
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
  whisper }               = GUY.trm.get_loggers 'webguy/tests/test-types-disjunct-API'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
types                     = new ( require 'intertype-newest' ).Intertype()
{ isa }                   = types



