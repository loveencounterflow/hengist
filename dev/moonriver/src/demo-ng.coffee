
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/NG'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate
  validate_optional }     = types
UTIL                      = require 'node:util'


#===========================================================================================================
class Segment

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    @input      = cfg.input  ? []
    @output     = cfg.output ? []
    GUY.props.hide @, 'transform', cfg.transform.bind @ ### binding is optional ###
    GUY.props.hide @, '_send', send = ( d ) => @output.push d; d ### 'inner' send method ###
    return undefined

  #---------------------------------------------------------------------------------------------------------
  ### 'outer' send method ###
  send: ( d ) -> @input.push d; d

  #---------------------------------------------------------------------------------------------------------
  process: ->
    if @input.length > 0
      @transform.call null, @input.shift(), @_send
      return 1
    return 0

  #---------------------------------------------------------------------------------------------------------
  # unshift: ->


#===========================================================================================================
class Collector

  #---------------------------------------------------------------------------------------------------------
  constructor: ( host ) ->
    GUY.props.hide @, 'host', host
    GUY.props.hide @, 'd',    []
    GUY.props.def @, 'length', get: -> @d.length
    return undefined

  #---------------------------------------------------------------------------------------------------------
  push:     ( d ) -> @host._on_change_datacount +1; @d.push d
  unshift:  ( d ) -> @host._on_change_datacount +1; @d.unshift d
  pop:            -> @host._on_change_datacount -1; @d.pop()
  shift:          -> @host._on_change_datacount -1; @d.shift()

  #---------------------------------------------------------------------------------------------------------
  [UTIL.inspect.custom]:  -> @toString()
  toString:               -> rpr @d


#===========================================================================================================
class Pipeline

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    @datacount  = 0
    @input      = new Collector @
    @output     = new Collector @
    @segments   = []
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _on_change_datacount: ( delta ) -> @datacount += delta

  #---------------------------------------------------------------------------------------------------------
  push: ( transform ) ->
    output  = @output
    if ( count = @segments.length ) is 0
      input               = @input
    else
      prv_segment         = @segments[ count - 1 ]
      prv_segment.output  = new Collector @
      input               = prv_segment.output
    R       = new Segment { input, transform, output, }
    @segments.push R
    return R

  #---------------------------------------------------------------------------------------------------------
  send: ( d ) -> @input.push d; d

  #---------------------------------------------------------------------------------------------------------
  walk: ->
    loop
      for segment in @segments
        debug '^56-1^', @
        segment.process()
        debug '^56-1^', @
        debug '^56-1^', { output: @output, datacount: @datacount, }
        yield @output.shift() while @output.length > 0
      debug '^56-1^', { output: @output, datacount: @datacount, }
      break if @datacount < 1
    return null

  #---------------------------------------------------------------------------------------------------------
  show: ->
    echo { input: @input, }
    echo segment for segment in @segments
    echo { output: @output, }
    return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------



############################################################################################################
if module is require.main then do =>
  p = new Pipeline()
  p.push ( d, send ) -> send d * 2
  p.push ( d, send ) -> send d + 2
  debug p.input.host
  debug p.input.host is p
  p.send 1
  p.send 2
  p.send 3
  p.show()
  # info '^97-3^', p.segments[ 0 ].process()
  # p.show()
  # info '^97-3^', p.segments[ 1 ].process()
  # p.show()
  for d from p.walk()
    urge '^97-4^', d
  return null
