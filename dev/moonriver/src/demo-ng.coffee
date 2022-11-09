
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
    hide @, 'fitting', @_as_fitting cfg.fitting
    hide @, '_send', send = ( d ) => @output.push d; d ### 'inner' send method ###
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _as_fitting: ( fitting ) ->
    fitting_type = null
    switch type = type_of fitting
      when 'function'
        ### TAINT validate arity ###
        R = fitting
      when 'list'
        R       = ( -> yield d for d in fitting )()
      else
        throw new Error "unable to use a #{rpr type} as a fitting"
    #.......................................................................................................
    switch arity = R.length ? 0
      when 0 then fitting_type = 'source'
      when 1 then fitting_type = 'observer'
      when 2 then fitting_type = 'transform'
      else throw new Error "fittings with arity #{arity} not implemented"
    #.......................................................................................................
    nameit 'ƒ', R if R.name is ''
    R.type = fitting_type
    return R

  #---------------------------------------------------------------------------------------------------------
  ### 'outer' send method ###
  send: ( d ) -> @input.push d; d

  #---------------------------------------------------------------------------------------------------------
  process: ->
    if @input.length > 0
      @fitting.call null, @input.shift(), @_send
      return 1
    return 0

  #---------------------------------------------------------------------------------------------------------
  [UTIL.inspect.custom]:  -> @toString()
  toString:               -> "#{rpr @input} ▶ #{@fitting.name} ▶ #{rpr @output}"

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
    cfg                 = { {}..., cfg..., }
    # cfg                 = types.create.mr_pipeline_cfg cfg
    @datacount          = 0
    @input              = @_new_collector()
    @output             = [] ### pipeline output buffer does not participate in datacount ###
    @segments           = []
    @on_before_step     = cfg.on_before_step ? null
    @on_after_step      = cfg.on_after_step  ? null
    @on_before_process  = cfg.on_before_process ? null
    @on_after_process   = cfg.on_after_process  ? null
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _new_collector: -> new Reporting_collector ( delta ) => @datacount += delta

  #---------------------------------------------------------------------------------------------------------
  push: ( fitting ) ->
    if ( count = @segments.length ) is 0
      input               = @input
    else
      prv_segment         = @segments[ count - 1 ]
      prv_segment.output  = @_new_collector()
      input               = prv_segment.output
    R = new Segment { input, fitting, output: @output, }
    @segments.push R
    return R

  #---------------------------------------------------------------------------------------------------------
  send: ( d ) -> @input.push d; d

  #---------------------------------------------------------------------------------------------------------
  process: ->
    @on_before_process() if @on_before_process?
    for segment, segment_idx in @segments
      @on_before_step segment_idx if @on_before_step?
      segment.process()
      @on_after_step segment_idx if @on_after_step?
    @on_after_process() if @on_after_process?
    return null

  #---------------------------------------------------------------------------------------------------------
  run: -> ( d for d from @walk() )

  #---------------------------------------------------------------------------------------------------------
  walk: ->
    loop
      @process()
      yield d for d in @output
      @output.length = []
      # yield @output.shift() while @output.length > 0
      break if @datacount < 1
    return null

  #---------------------------------------------------------------------------------------------------------
  [UTIL.inspect.custom]:  -> @toString()
  toString:               ->
    R = []
    for segment in @segments
      R.push rpr segment.input
      R.push '▶'
      R.push segment.fitting.name
      R.push '▶'
    R.push rpr @output
    return R.join ' '


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  on_before_process = -> help '^97-1^', @
  on_after_process  = -> warn '^97-2^', @
  on_before_step    =  ( sidx ) -> urge '^97-3^', sidx, @
  on_after_step     =  ( sidx ) -> urge '^97-4^', sidx, @
  on_before_step    = null
  # on_after_step     = null
  on_after_process  = null
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  p.push times_2 = ( d, send ) ->
    if isa.float d
      # send '('
      send d * 2
      # send ')'
    else
      send d
  p.push plus_2  = ( d, send ) ->
    if isa.float d
      # send '['
      send d + 2
      # send ']'
    else
      send d
  p.push times_3 = ( d, send ) ->
    if isa.float d
      # send '{'
      send d * 3
      # send '}'
    else
      send d
  p.send 1
  p.send 2
  p.send 3
  # urge '^97-4^', d for d from p.walk()
  info '^97-4^', p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  on_before_process = -> help '^97-1^', @
  on_after_process  = -> warn '^97-2^', @
  on_before_step    =  ( sidx ) -> urge '^97-3^', sidx, @
  on_after_step     =  ( sidx ) -> urge '^97-4^', sidx, @
  on_before_step    = null
  # on_after_step     = null
  on_after_process  = null
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  p.push [ 1, 2, 3, ]
  info '^97-4^', p.run()
  return null

############################################################################################################
if module is require.main then do =>
  demo_1()
  demo_2()
