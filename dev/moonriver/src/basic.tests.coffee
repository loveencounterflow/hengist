
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MOONRIVER/BASICS'
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
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'


  # #.........................................................................................................
  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->


#-----------------------------------------------------------------------------------------------------------
@[ "send.call_count" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Moonriver
    $once     } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    pipeline  = [
      [ 1, 2, 3, 5, ]
      ( d, send ) -> send d * 2
      ( d, send ) -> send d #; urge d
      ( d, send ) -> collector.push d #; help collector
      ]
    mr = new Moonriver pipeline
    mr.drive()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  do =>
    collector = []
    pipeline  = [
      [ 'a', 'b', ]
      ( d, send ) -> urge '^598^', d; send d
      ( d, send ) ->
        send d
        if send.call_count is 1
          send e for e from [ 1, 2, 3, 5, ].values()
        return null
      ( d, send ) -> send if isa.float d then d * 2 else d
      ( d       ) -> urge d
      ( d, send ) -> collector.push d #; help collector
      ]
    mr = new Moonriver pipeline
    mr.drive()
    T?.eq collector, [ 'a', 2, 4, 6, 10, 'b' ]
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  test @
  # @[ "send.call_count" ]()



