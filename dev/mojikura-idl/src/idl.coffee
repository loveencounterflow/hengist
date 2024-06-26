
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
# TESTS (IDL)
#-----------------------------------------------------------------------------------------------------------
@[ "(IDL) parse simple formulas" ] = ( T, done ) ->
  probes_and_matchers = [
    ["⿲木木木",["⿲","木","木","木"]]
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
    # result = resume_next T, -> IDL.parse probe
    result = IDL.parse probe
    urge ( CND.truth equals result, matcher ), JSON.stringify [ probe, result, ]
    # urge ( rpr probe ), result
    T.ok equals result, matcher
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(IDL) reject bogus formulas" ] = ( T, done ) ->
  probes_and_matchers = [
    ["木",'Syntax error at index 0 (木)\nUnexpected "木"']
    [42,'expected a text, got a float']
    ["","expected a non-empty text, got an empty text"]
    ["⿱⿰亻式⿱目八木木木",'Syntax error at index 7 (⿱⿰亻式⿱目八木木木)\nUnexpected "木"']
    ["⿺廴聿123",'Syntax error at index 3 (⿺廴聿123)\nUnexpected "1".']
    ["⿺","Syntax Error: '⿺'"]
    ["⿺⿺⿺⿺","Syntax Error: '⿺⿺⿺⿺'"]
    ["(⿰亻聿式)",'Syntax error at index 0 ((⿰亻聿式))\nUnexpected "(".']
    ["≈〇",'Syntax error at index 0 (≈〇)\nUnexpected "≈".']
    ["●",'Syntax error at index 0 (●)\nUnexpected "●".']
    ]
  for [ probe, matcher, ] in probes_and_matchers
    try
      result = IDL.parse probe
      debug ( rpr probe ), ( rpr result )
      warn "expected an exception, got result #{rpr result}"
      T.fail "expected an exception, got result #{rpr result}"
    catch error
      { message, } = error
      unless message.startsWith matcher
        urge '^334^', "probe:             ", rpr probe
        warn '^334^', "expected message:  ", ( rpr matcher )[ ... 100 ]
        help '^334^', "got message:       ", ( rpr message )[ ... 100 ]
        message = ( rpr message )[ ... 100 ]
        T.fail "message #{rpr message} doesn't start with #{rpr matcher}"
      else
        T.ok true
  #.........................................................................................................
  done()
  return null

############################################################################################################
if module is require.main then do =>
  test @
  # test @[ "(IDL) reject bogus formulas" ]



