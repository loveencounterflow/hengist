

'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MOJIKURA-IDL/tests'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
{ IDL, IDLX, }            = require '../../../apps/mojikura-idl'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate
  equals   }              = types.export()


#===========================================================================================================
# TESTS (IDLX)
#-----------------------------------------------------------------------------------------------------------
@[ "(IDLX) simple formulas" ] = ( T, done ) ->
  probes_and_matchers = [
    ["⿱刀口",["⿱","刀","口"]]
    ["⿱癶⿰弓貝",["⿱","癶",["⿰","弓","貝"]]]
    ["⿱⿰亻式貝",["⿱",["⿰","亻","式"],"貝"]]
    ["⿱⿰亻式⿱目八",["⿱",["⿰","亻","式"],["⿱","目","八"]]]
    ["⿺辶言",["⿺","辶","言"]]
    ["⿰ab",["⿰","a","b"]]
    ["⿰⿰abc",["⿰",["⿰","a","b"],"c"]]
    ["⿱⿱刀口乙",["⿱",["⿱","刀","口"],"乙"]]
    ["⿱⿱刀口乙",["⿱",["⿱","刀","口"],"乙"]]
    ["⿱&jzr#xe24a;&jzr#xe11d;",["⿱","",""]]
    ["⿰𠁣𠃛",["⿰","𠁣","𠃛"]]
    ]
  for [ probe, matcher, ] in probes_and_matchers
    # result = resume_next T, -> IDLX.parse probe
    result = IDLX.parse probe
    urge ( CND.truth equals result, matcher ), JSON.stringify [ probe, result, ]
    # urge ( rpr probe ), result
    T.ok equals result, matcher
  #.........................................................................................................
  done()
  return null



############################################################################################################
if module is require.main then do =>
  test @
  # test @[ "(IDLX) reject bogus formulas" ]



