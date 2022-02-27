
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
  $source_C = ( a_list ) ->
    return source = ( d, send ) ->
      send d
      for e in a_list
        help '^source C^', e if trace
        send e
      # send.over()
      return null
  #.........................................................................................................
  $source_B = ( a_list ) ->
    last_idx  = a_list.length - 1
    idx       = -1
    return source = ( d, send ) ->
      send d
      idx++
      # debug '^2242^', { idx, }
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
  pipeline  = []
  # pipeline.push $source_A [ 1, 2, 3, ]
  # pipeline.push $source_B [ 1, 2, ]
  pipeline.push [ 1, 2, ]
  pipeline.push [ 'A', 'B', ]
  pipeline.push $source_C [ 5, 7, 11, ]
  pipeline.push $addsome()
  pipeline.push $embellish()
  pipeline.push $show()
  trace = false
  drive = ( mode ) ->
    whisper '———————————————————————————————————————'
    sp = new Steampipe pipeline
    sp.drive { mode, }
    whisper '———————————————————————————————————————'
    sp.drive { mode, }
  drive 'breadth'
  drive 'depth'
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Steampipe
  @C =
    symbol =
      drop:       Symbol.for 'drop' # this value will not go to output
      exit:       Symbol.for 'exit' # exit pipeline processing
      # done:       Symbol.for 'done' # done for this iteration
      over:       Symbol.for 'over' # do not call again in this round

  #---------------------------------------------------------------------------------------------------------
  constructor: ( raw_pipeline ) ->
    @first_input  = []
    @last_output  = []
    @pipeline     = []
    last_idx      = raw_pipeline.length - 1
    @inputs       = []
    @sources      = []
    for raw_transform, idx in raw_pipeline
      { is_source
        transform } = @_get_transform raw_transform
      do ( transform, idx, is_source ) =>
        input       = if idx is 0         then @first_input else @pipeline[ idx - 1 ].output
        output      = if idx is last_idx  then @last_output else []
        segment     = { transform, input, output, over: false, exit: false, is_source, }
        send        = ( d ) ->
          switch d
            when symbol.drop  then  null
            when symbol.over  then  @over = true
            when symbol.exit  then  @exit = true
            else @output.push d
          return null
        send        = send.bind segment
        send.symbol = symbol
        send.over   = -> send send.symbol.over
        send.exit   = -> send send.symbol.exit
        GUY.props.hide segment, 'send', send
        @pipeline.push  segment
        @sources.push   segment if is_source
        @inputs.push    input
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _get_transform: ( raw_transform ) ->
    is_source = false
    switch type = type_of raw_transform
      when 'function'
        transform = raw_transform
        unless ( arity = transform.length ) is 2
          throw new Error "^323^ expected function with arity 2 got one with arity #{arity}"
      when 'list'
        is_source = true
        transform = @_source_from_list raw_transform
      else
        throw new Error "^324^ cannot convert a #{type} to a source"
    return { transform, is_source, }

  #---------------------------------------------------------------------------------------------------------
  _source_from_list: ( list ) ->
    last_idx  = list.length - 1
    idx       = -1
    return list_source = ( d, send ) ->
      send d
      idx++
      if idx > last_idx
        idx = -1
        return send.over()
      send list[ idx ]
      return null

  #---------------------------------------------------------------------------------------------------------
  drive: ( cfg ) ->
    { mode      } = cfg
    segment.over  = false for segment in @pipeline
    try
      loop
        for segment, idx in @pipeline
          continue if segment.over
          if segment.is_source and segment.input.length is 0
            segment.transform symbol.drop, segment.send
          else
            while segment.input.length > 0
              segment.transform segment.input.shift(), segment.send
              break if mode is 'depth'
          @last_output.length = 0
          throw symbol.exit if segment.exit
        if @sources.every ( source ) -> source.over
          unless @inputs.some ( input ) -> input.length > 0
            break
    catch error
      # throw error unless typeof error is 'symbol'
      throw error unless error is symbol.exit
    return null

  #---------------------------------------------------------------------------------------------------------
  _show_pipeline: ->
    urge @inputs[ 0 ]
    for segment in @pipeline
      urge segment.transform.name ? '?', segment.output
    return null


############################################################################################################
if module is require.main then do =>
  demo()



