
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
{ hide
  def }                   = GUY.props
nameit                    = ( name, f ) -> def f, 'name', { value: name, }

#===========================================================================================================
class Segment

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    @input      = cfg.input  ? []
    @output     = cfg.output ? []
    name        = cfg.transform.name
    name        = 'ƒ' if name is ''
    hide @, 'transform', nameit name, cfg.transform.bind @ ### binding is optional ###
    hide @, '_send', send = ( d ) => @output.push d; d ### 'inner' send method ###
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
  [UTIL.inspect.custom]:  -> @toString()
  toString:               -> "#{rpr @input} ▶ #{@transform.name} ▶ #{rpr @output}"

#===========================================================================================================
class Reporting_collector

  #---------------------------------------------------------------------------------------------------------
  constructor: ( callback ) ->
    hide @, 'callback', callback
    hide @, 'd',        []
    GUY.props.def @,  'length',   get: -> @d.length
    return undefined

  #---------------------------------------------------------------------------------------------------------
  push:     ( d ) -> @callback +1; @d.push d
  unshift:  ( d ) -> @callback +1; @d.unshift d
  pop:            -> @callback -1; @d.pop()
  shift:          -> @callback -1; @d.shift()

  #---------------------------------------------------------------------------------------------------------
  [UTIL.inspect.custom]:  -> @toString()
  toString:               -> rpr @d


#===========================================================================================================
class Pipeline

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    cfg             = { {}..., cfg..., }
    # cfg             = types.create.mr_pipeline_cfg cfg
    @datacount        = 0
    @input            = @_new_collector()
    @output           = [] ### pipeline output buffer does not participate in datacount ###
    @segments         = []
    @on_before_step   = cfg.on_before_step ? null
    @on_after_step    = cfg.on_after_step  ? null
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _new_collector: -> new Reporting_collector ( delta ) => @datacount += delta

  #---------------------------------------------------------------------------------------------------------
  push: ( transform ) ->
    if ( count = @segments.length ) is 0
      input               = @input
    else
      prv_segment         = @segments[ count - 1 ]
      prv_segment.output  = @_new_collector()
      input               = prv_segment.output
    R = new Segment { input, transform, output: @output, }
    @segments.push R
    return R

  #---------------------------------------------------------------------------------------------------------
  send: ( d ) -> @input.push d; d

  #---------------------------------------------------------------------------------------------------------
  process: ->
    for segment, segment_idx in @segments
      @on_before_step segment_idx if @on_before_step?
      segment.process()
      @on_after_step segment_idx if @on_after_step?
    return null

  #---------------------------------------------------------------------------------------------------------
  run: -> ( d for d from @walk() )

  #---------------------------------------------------------------------------------------------------------
  walk: ->
    loop
      @process()
      yield @output.shift() while @output.length > 0
      break if @datacount < 1
    return null

  #---------------------------------------------------------------------------------------------------------
  show: ->
    ### TAINT return string, do not output ###
    echo { input: @input, }
    echo segment for segment in @segments
    echo { output: @output, }
    return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------



############################################################################################################
if module is require.main then do =>
  on_before_step =  ( sidx ) ->
    { datacount, } = @
    info '-'.repeat 108
    info { sidx, datacount, }
    @show()
  on_after_step =  ( sidx ) ->
    { datacount, } = @
    urge { sidx, datacount, }
    @show()
  on_before_step  = null
  on_after_step   = null
  p = new Pipeline { on_before_step, on_after_step, }
  p.push times_2 = ( d, send ) ->
    if isa.float d
      send '('
      send d * 2
      send ')'
    else
      send d
  p.push plus_2  = ( d, send ) ->
    if isa.float d
      send '['
      send d + 2
      send ']'
    else
      send d
  p.push times_3 = ( d, send ) ->
    if isa.float d
      send '{'
      send d * 3
      send '}'
    else
      send d
  p.send 1
  p.send 2
  p.send 3
  # urge '^97-4^', d for d from p.walk()
  urge '^97-4^', p.run()
  return null
