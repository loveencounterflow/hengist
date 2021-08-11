
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DPAN/TESTS/HELPERS'
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
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
#-----------------------------------------------------------------------------------------------------------
do =>
  if '--dpan-use-installed' in process.argv
    H.dpan_use_installed  = true
    H.dpan_path           = 'dpan'
    message                   = "using installed version of dpan"
  else
    H.dpan_use_installed  = false
    H.dpan_path           = '../../../apps/dpan'
    message                   = "using linked dpan"
  debug '^3337^', CND.reverse message
  process.on 'exit', ->
    debug '^3337^', CND.reverse message
  return null
#-----------------------------------------------------------------------------------------------------------
{ Dpan }                  = require H.dpan_path
# dpan_types                = require H.dpan_path + '/lib/types'
