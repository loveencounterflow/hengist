
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
first_q   = []
last_q    = []
pipeline  = []
last_idx  = raw_pipeline.length - 1
inputs    = []
for tf, idx in raw_pipeline
  do =>
    input       = if idx is 0         then first_q  else pipeline[ idx - 1 ].output
    output      = if idx is last_idx  then last_q   else []
    send        = ( d ) ->
      switch d
        when symbol.drop
          info "dropped: #{rpr d}"
        when symbol.done
          info "done: #{rpr d}"
        else
          output.push d
      return null
    send.symbol = symbol
    send.done   = -> send send.symbol.done
    pipeline.push { tf, input, output, send, }
    inputs.push input

count = 0
# for segment in pipeline
# first_q.unshift 123
pipeline[ 0 ].tf symbol.drop, pipeline[ 0 ].send
# pipeline[ 0 ].output.unshift 'o0'
# pipeline[ 1 ].input.unshift 'i1'
# pipeline[ 1 ].output.unshift 'o1'
# pipeline[ 2 ].input.unshift 'i2'
# pipeline[ 2 ].output.unshift 'o2'
# pipeline[ 1 ].send 99

show_pipeline = ->
  urge inputs[ 0 ]
  for segment in pipeline
    urge segment.tf.name ? '?', segment.output
  return null


driver_A = ->
  show_pipeline()
  round = 0
  loop
    round++
    whisper '^4958^', "round #{round} -------------------------------"
    for idx in [ 0 .. 3 ]
      segment = pipeline[ idx ]
      if idx is 0
        segment.tf symbol.drop, segment.send
        continue
      while segment.input.length > 0
        segment.tf segment.input.shift(), segment.send
      show_pipeline()
    debug '^59587^', inputs
    break unless inputs.some ( x ) -> x.length > 0
  return null

driver_B = ->
  show_pipeline()
  round = 0
  loop
    round++
    whisper '^4958^', "round #{round} -------------------------------"
    for idx in [ 0 .. 3 ]
      segment = pipeline[ idx ]
      if idx is 0
        segment.tf symbol.drop, segment.send
        continue
      if segment.input.length > 0
        segment.tf segment.input.shift(), segment.send
      show_pipeline()
    debug '^59587^', inputs
    break unless inputs.some ( x ) -> x.length > 0
  return null

driver_A()
# driver_B()




