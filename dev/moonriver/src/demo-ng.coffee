
'xxxxxxxxxuse strict'


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
    hide @, 'transform', @_as_transform cfg.fitting
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
    transform_type = null
    switch fitting_type = type_of fitting
      when 'function'
        ### TAINT validate arity ###
        R = fitting
      when 'list'
        R       = ( -> yield d for d in fitting )()
      else
        throw new Error "unable to use a #{rpr fitting_type} as a fitting"
    #.......................................................................................................
    switch arity = R.length ? 0
      when 0 then transform_type = 'source'
      when 1 then transform_type = 'observer'
      when 2 then transform_type = 'transducer'
      else throw new Error "fittings with arity #{arity} not implemented"
    #.......................................................................................................
    nameit 'ƒ', R if R.name is ''
    R.type = transform_type
    return R

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
      R.push segment.transform.name
      R.push '▶'
    R.push rpr @output
    return R.join ' '


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  echo '—————————————————————————————————————————————'
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
  echo '—————————————————————————————————————————————'
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

#-----------------------------------------------------------------------------------------------------------
model_1 = ->
  echo '—————————————————————————————————————————————'
  ### use a transform of arity 0 whose return value is the next data item. Must use special value `nothing`
  to unambiguously decide between 'has value', has no value'. Flag `done` could be made attribute of `tf`
  so unwarranted calls can be avoided. ###
  s       = [ 5, 6, 7, ]
  # g       = ( -> yield from s )() # the more general formulation
  g       = s.values()
  nothing = Symbol 'nothing'
  $tf     = ( g ) ->
    done = false
    return ->
      return nothing if done
      { value
        done }      = g.next()
      whisper '^59-1^', { value, done, }
      return if done then nothing else value
  tf    = $tf g
  info '^59-2^', tf() for _ in [ 1 .. 5 ]
  return null

#-----------------------------------------------------------------------------------------------------------
model_2a = ->
  echo '—————————————————————————————————————————————'
  ### use a transform of arity 0, to be called with `send()` method as other transforms are, too. ###
  s     = [ 5, 6, 7, ]
  # gf  = -> yield from s # s.values()
  # g   = gf()
  send  = ( d ) -> info '^60-1^', d; d
  $tf   = ( source ) ->
    idx       = -1
    last_idx  = s.length - 1
    return ( send ) ->
      return null if idx >= last_idx
      idx++
      send s[ idx ]
      return null
  tf = $tf s
  debug tf send for _ in [ 1 .. 5 ]
  return null

#-----------------------------------------------------------------------------------------------------------
model_2b = ->
  echo '—————————————————————————————————————————————'
  ### Same as `model_2a()`, but using a generator as the more general solution. ###
  s     = [ 5, 6, 7, ]
  # gf  = -> yield from s # s.values()
  # g   = gf()
  send  = ( d ) -> info '^61-1^', d; d
  mr =
    get_tf: ( s ) ->
      type = type_of s
      unless ( method = @[ "tf_from_#{type}"] )?
        throw new Error "unable to convert a #{type} to a transform"
      return method.call @, s
    tf_from_generator: ( s ) ->
      debug '^61-2^', s
      done = false
      return ( send ) ->
        return null if done
        { value: d
          done      } = s.next()
        send d unless done
        return null
    tf_from_generatorfunction: ( s ) -> debug '^61-3^', type_of s; @get_tf s()
    tf_from_list:              ( s ) -> debug '^61-4^', type_of s; @get_tf s.values()
    tf_from_arrayiterator:     ( s ) -> debug '^61-4^', type_of s; @tf_from_generator s
  debug '^61-5^', type_of s
  debug '^61-6^', type_of s.values
  debug '^61-7^', type_of s.values()
  debug '^61-8^', type_of ( -> yield 1 )
  debug '^61-9^', type_of ( -> yield 1 )()
  do ->
    whisper '...................'
    tf = mr.get_tf s
    debug tf send for _ in [ 1 .. 5 ]
  do ->
    whisper '...................'
    tf = mr.get_tf ( -> yield from 'ABC' )
    debug tf send for _ in [ 1 .. 5 ]
  do ->
    whisper '...................'
    tf = mr.get_tf s.values()
    debug tf send for _ in [ 1 .. 5 ]
  return null


############################################################################################################
if module is require.main then do =>
  demo_1()
  demo_2()
  model_1()
  model_2a()
  model_2b()
