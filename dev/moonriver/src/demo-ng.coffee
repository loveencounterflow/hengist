
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
types                     = null
UTIL                      = require 'node:util'
{ hide
  def }                   = GUY.props
nameit                    = ( name, f ) -> def f, 'name', { value: name, }
stf_prefix                = '_source_transform_from_'


#===========================================================================================================
get_types = ->
  return types if types?
  types = new ( require '../../../apps/intertype' ).Intertype()

  #---------------------------------------------------------------------------------------------------------
  source_fitting_types  = new Set do =>
    ( name.replace stf_prefix, '' \
      for name in ( Object.getOwnPropertyNames Segment:: ) \ ### thx to https://stackoverflow.com/a/31055009/7568091 ###
        when name.startsWith stf_prefix )

  #---------------------------------------------------------------------------------------------------------
  types.declare.mr_source_fitting ( x ) -> source_fitting_types.has @type_of x

  #---------------------------------------------------------------------------------------------------------
  types.declare.mr_nonsource_fitting ( x ) ->
    return false unless @isa.function x
    return false unless 1 <= x.length <= 2
    return true

  #---------------------------------------------------------------------------------------------------------
  types.declare.mr_reporting_collector ( x ) -> x instanceof Reporting_collector
  types.declare.mr_collector 'list.or.mr_reporting_collector'
  types.declare.mr_fitting 'mr_nonsource_fitting.or.mr_source_fitting'

  #---------------------------------------------------------------------------------------------------------
  types.declare.mr_segment_cfg
    fields:
      input:    'mr_collector'
      output:   'mr_collector'
      fitting:  'mr_fitting'
    default:
      input:    null
      output:   null
      fitting:  null
    # create: ( x ) ->
    #   return x unless @isa.optional.object x
    #   R         = x
    #   return R

  #---------------------------------------------------------------------------------------------------------
  return types


#===========================================================================================================
class Segment

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    hide @, 'types',      get_types()
    @types.create.mr_segment_cfg cfg
    @input          = cfg.input
    @output         = cfg.output
    @has_finished   = null
    @transform_type = null
    hide @, 'transform',  @_as_transform cfg.fitting
    hide @, '_send', send = ( d ) => @output.push d; d ### 'inner' send method ###
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _as_transform: ( fitting ) ->
    ###

    * `fitting`: a value that may be used as (the central part of) a transform in a pipeline. This may be a
      function of arity 2 (a transducer), a list (a source) &c.
    * `transform`: one of the serial elements that constitute a pipeline. While a `fitting` may be of
      various types, a `transform` is always a function. `transform`s have a `type` attribute which takes
      one of the following values:
      * `source`: a `transform` that does not take any arguments and will yield one value per call
      * `observer`: a `transform` that takes one argument (the current value) and does not send any values
        into the pipeline; the value an observer gets called with will be the same value that the next
        transformer will be called with. Note that if an observer receives a mutable value it can modify it
        and thereby affect one data item at a time.
      * `transducer`: a `transform` that takes two arguments, the current data item and a `send()` function
        that can be used any number of times to send values to the ensuing transform.

    ###
    if @types.isa.mr_source_fitting fitting
      R               = @_get_source_transform fitting
      @transform_type = 'source'
    #.......................................................................................................
    else
      R = fitting
      switch arity = R.length ? 0
        when 1 then @transform_type = 'observer'
        when 2 then @transform_type = 'transducer'
        else throw new Error "fittings with arity #{arity} not implemented"
    #.......................................................................................................
    nameit 'ƒ', R if R.name is ''
    return R


  #=========================================================================================================
  # SOURCE TRANSFORMS
  #---------------------------------------------------------------------------------------------------------
  _get_source_transform: ( source ) ->
    type = @types.type_of source
    unless ( method = @[ stf_prefix + type ] )?
      throw new Error "unable to convert a #{type} to a transform"
    @has_finished = false
    return method.call @, source

  #---------------------------------------------------------------------------------------------------------
  [ stf_prefix + 'generator' ]: ( source ) ->
    @has_finished = false
    return ( send ) =>
      return null if @has_finished
      dsc           = source.next()
      @has_finished = dsc.done
      send dsc.value unless @has_finished
      return null

  #---------------------------------------------------------------------------------------------------------
  [ stf_prefix + 'text' ]: ( source ) ->
    letter_re     = /./uy
    @has_finished = false
    return ( send ) =>
      return null if @has_finished
      unless ( match = source.match letter_re )?
        @has_finished = true
        return null
      send match[ 0 ]
      return null

  #---------------------------------------------------------------------------------------------------------
  [ stf_prefix + 'generatorfunction'  ]:  ( source ) -> @_get_source_transform source()
  [ stf_prefix + 'list'               ]:  ( source ) -> @_get_source_transform source.values()
  [ stf_prefix + 'arrayiterator'      ]:  ( source ) -> @[ stf_prefix + 'generator' ] source


  #=========================================================================================================
  #
  #---------------------------------------------------------------------------------------------------------
  ### 'outer' send method ###
  send: ( d ) -> @input.push d; d

  #---------------------------------------------------------------------------------------------------------
  process: ->
    if @transform_type is 'source'
      return 0 if @transform.has_finished
      @transform @_send
      return 1
    if @input.length > 0
      d = @input.shift()
      switch @transform_type
        when 'observer'
          @transform  d
          @_send      d
        when 'transducer'
          @transform d, @_send
        else
          throw new Error "internal error: unknown transform type #{rpr @transform_type}"
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
    hide  @, 'sources',       []
    def   @, 'has_finished',  get: -> ( @datacount < 1 ) and @sources.every ( s ) -> s.has_finished
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _new_collector:                   -> new Reporting_collector ( delta ) => @datacount += delta
  send:                       ( d ) -> @input.push d; d
  run:                              -> ( d for d from @walk() )

  #---------------------------------------------------------------------------------------------------------
  push: ( fitting ) ->
    if ( count = @segments.length ) is 0
      input               = @input
    else
      prv_segment         = @segments[ count - 1 ]
      prv_segment.output  = @_new_collector()
      input               = prv_segment.output
    R = new Segment { input, fitting, output: @output, }
    @segments.push  R
    @sources.push   R if R.transform_type is 'source'
    return R

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
  walk: ->
    loop
      @process()
      yield d for d in @output
      @output.length = []
      # yield @output.shift() while @output.length > 0
      break if @has_finished
    return null

  #---------------------------------------------------------------------------------------------------------
  [UTIL.inspect.custom]:  -> @toString()
  toString:               ->
    R = []
    for segment in @segments
      R.push rpr segment.input
      R.push '▶'
      R.push segment.transform.name
      R.push '▶'
    R.push rpr @output
    return R.join ' '


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  echo '—————————————————————————————————————————————'
  _types = new ( require '../../../apps/intertype' ).Intertype()
  on_before_process = -> help '^97-1^', @
  on_after_process  = -> warn '^97-2^', @
  on_before_step    =  ( sidx ) -> urge '^97-3^', sidx, @
  on_after_step     =  ( sidx ) -> urge '^97-4^', sidx, @
  on_before_step    = null
  # on_after_step     = null
  on_after_process  = null
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  p.push times_2 = ( d, send ) ->
    if _types.isa.float d
      # send '('
      send d * 2
      # send ')'
    else
      send d
  p.push plus_2  = ( d, send ) ->
    if _types.isa.float d
      # send '['
      send d + 2
      # send ']'
    else
      send d
  p.push times_3 = ( d, send ) ->
    if _types.isa.float d
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
  echo '—————————————————————————————————————————————'
  _types = new ( require '../../../apps/intertype' ).Intertype()
  on_before_process = -> help '^98-1^', @
  on_after_process  = -> warn '^98-2^', @
  on_before_step    =  ( sidx ) -> urge '^98-3^', sidx, @
  on_after_step     =  ( sidx ) -> urge '^98-4^', sidx, @
  on_before_proces  = null
  on_before_step    = null
  on_after_step     = null
  on_after_process  = null
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  p = new Pipeline()
  p.push [ 1, 2, 3, ]
  p.push show_1 = ( d, send ) -> whisper rpr d; send d
  p.push show_2 = ( d       ) -> whisper rpr d
  info '^98-5^', p
  info '^98-6^', p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
model_2b = ->
  echo '—————————————————————————————————————————————'
  _types = new ( require '../../../apps/intertype' ).Intertype()
  ### Same as `model_2a()`, but using a generator as the more general solution. ###
  source  = [ 5, 6, 7, ]
  send    = ( d ) -> info '^61-1^', d; d
  mr      =
    _get_source_transform: ( source ) ->
      type = _types.type_of source
      unless ( method = @[ "_source_transform_from_#{type}"] )?
        throw new Error "unable to convert a #{type} to a transform"
      return method.call @, source
    _source_transform_from_generator: ( source ) ->
      done = false
      return ( send ) ->
        return null if done
        { value: d
          done      } = source.next()
        send d unless done
        return null
    _source_transform_from_generatorfunction: ( source ) -> @_get_source_transform source()
    _source_transform_from_list:              ( source ) -> @_get_source_transform source.values()
    _source_transform_from_arrayiterator:     ( source ) -> @_source_transform_from_generator source
  do ->
    whisper '...................'
    tf = mr._get_source_transform source
    tf send for _ in [ 1 .. 5 ]
  do ->
    whisper '...................'
    tf = mr._get_source_transform ( -> yield from source )
    tf send for _ in [ 1 .. 5 ]
  do ->
    whisper '...................'
    tf = mr._get_source_transform ( -> yield from source )()
    tf send for _ in [ 1 .. 5 ]
  do ->
    whisper '...................'
    tf = mr._get_source_transform source.values()
    tf send for _ in [ 1 .. 5 ]
  return null


############################################################################################################
if module is require.main then do =>
  demo_1()
  demo_2()
  # model_2b()
  # get_types()
