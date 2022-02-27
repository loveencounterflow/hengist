
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




$source = ( a_list ) ->
  exhausted = false
  return source = ( d, send ) ->
    send d
    unless exhausted
      for e in a_list
        help '^source^', e
        send e
      send.done()
      exhausted = true
    return null

$addsome = ->
  return addsome = ( d, send ) ->
    help '^addsome^', d
    send d + 100
    # send.stop() if d is 2
    # throw send.symbol.stop if d is 2
    throw send.symbol.done if d is 2
    send d + 200
    return null

$embellish = ->
  return embellish = ( d, send ) ->
    help '^embellish^', d
    send "*#{rpr d}*"
    return null

$show = ->
  return show = ( d, send ) ->
    help '^show^', d
    info d
    send d
    return null

raw_pipeline = [
  $source [ 1, 2, 3, ]
  $addsome()
  $embellish()
  $show()
  ]

symbol    =
  done:       Symbol.for 'done'
  drop:       Symbol.for 'drop'
  stop:       Symbol.for 'stop'
first_q   = []
last_q    = []
pipeline  = []
last_idx  = raw_pipeline.length - 1
inputs    = []
for tf, idx in raw_pipeline
  do =>
    input       = if idx is 0         then first_q  else pipeline[ idx - 1 ].output
    output      = if idx is last_idx  then last_q   else []
    entry       = { tf, input, output, done: false, stop: false, }
    send        = ( d ) ->
      switch d
        when symbol.drop
          info "dropped: #{rpr d}"
        when symbol.done
          info "done: #{rpr d}"
          @done = true
        when symbol.stop
          info "stop: #{rpr d}"
          @stop = true
        else
          @output.push d
      return null
    send        = send.bind entry
    send.symbol = symbol
    send.done   = -> send send.symbol.done
    send.stop   = -> send send.symbol.stop
    entry.send  = send
    pipeline.push entry
    inputs.push input

show_pipeline = ->
  urge inputs[ 0 ]
  for segment in pipeline
    urge segment.tf.name ? '?', segment.output
  return null

drive = ( cfg ) ->
  { mode } = cfg
  show_pipeline()
  round = 0
  try
    loop
      round++
      whisper '^4958^', "round #{round} -------------------------------"
      for idx in [ 0 .. 3 ]
        segment = pipeline[ idx ]
        if idx is 0
          segment.tf symbol.drop, segment.send
        else
          while segment.input.length > 0
            segment.tf segment.input.shift(), segment.send
            break if mode is 'depth'
        show_pipeline()
        if segment.stop
          info '^443^', "stopped by #{rpr segment}"
          throw symbol.stop
      break unless inputs.some ( x ) -> x.length > 0
  catch error
    # throw error unless typeof error is 'symbol'
    throw error unless error is symbol.stop
    warn error
  return null


# drive { mode: 'breadth', }
drive { mode: 'depth', }



