
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MINIMAL'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
GUY                       = require 'guy'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types
{ Moonriver }             = require '../../../apps/moonriver'


#-----------------------------------------------------------------------------------------------------------
demo = ->
  #.........................................................................................................
  $source_A = ( a_list ) ->
    return source = ( d, send ) ->
      send d
      for e in a_list
        help '^source A^', e if trace
        send e
      send.over()
      return null
  #.........................................................................................................
  $source_B = ( a_list ) ->
    last_idx  = a_list.length - 1
    idx       = -1
    return source = ( d, send ) ->
      send d
      idx++
      if idx > last_idx
        idx = -1
        return send.over()
      help '^source B^', a_list[ idx ] if trace
      send a_list[ idx ]
      return null
  #.........................................................................................................
  $addsome = ->
    return addsome = ( d, send ) ->
      help '^addsome^', d if trace
      return send ( rpr d ) + ' * 100 + 1' unless isa.float d
      send d * 100 + 1
      return null
  #.........................................................................................................
  $embellish = ->
    return embellish = ( d, send ) ->
      help '^embellish^', d if trace
      send "*#{rpr d}*"
      return null
  #.........................................................................................................
  $show = ->
    return show = ( d, send ) ->
      help '^show^', d if trace
      info d
      send d
      return null
  #.........................................................................................................
  $generator = ->
    return ->
      yield 22
      yield 33
      return null
  #.........................................................................................................
  pipeline  = []
  # pipeline.push $source_A [ 1, 2, 3, ]
  # pipeline.push $source_B [ 1, 2, ]
  pipeline.push [ 1, 2, ]
  pipeline.push [ 'A', 'B', ]
  pipeline.push [ 'C', 'D', 'E', ].values()
  pipeline.push ( new Map [ [ 'a', 42, ], ] ).entries()
  pipeline.push $generator()
  pipeline.push $addsome()
  pipeline.push $embellish()
  pipeline.push $show()
  trace = false
  drive = ( mode ) ->
    mr = new Moonriver pipeline
    for _ in [ 1, 2, ]
      unless mr.can_repeat()
        warn "not repeatable"
        break
      whisper '————————————————————————————————————————'
      mr.drive { mode, }
  drive 'breadth'
  drive 'depth'
  return null




############################################################################################################
if module is require.main then do =>
  demo()



