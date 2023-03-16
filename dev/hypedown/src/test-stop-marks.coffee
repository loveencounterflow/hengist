
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
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/STOP-MARKERS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require './helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@parse_stop_marks = ( T, done ) ->
  { Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  { XXX_new_token }   = require '../../../apps/hypedown/lib/helpers'
  probes_and_matchers = [
    [ '*abc*', '<p><i>abc</i>\n', null ]
    [ '*abc*<?stop?>*xyz*', '<p><i>abc</i>\n', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p           = new Hypedown_parser()
      p.send probe
      result      = p.run()
      result_html = ( d.value for d in result when not d.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_html}", result
      console.table result
      H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in result when not t.$stamped )
      #.....................................................................................................
      resolve result_html
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  test @

