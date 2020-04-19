

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/BENCHMARKS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
{ jr }                    = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
### TAINT use standard JS solution ###
nf                        = require '/home/flow/jzr/benchmarks/node_modules/number-format.js'
INTERTEXT                 = require 'intertext'
#...........................................................................................................
# H                         = require '../helpers'
# DATAMILL                  = require '../..'
@types                    = require './types'
{ isa
  validate
  declare
  first_of
  last_of
  size_of
  type_of }               = @types
# VNR                       = require '../vnr'
# $fresh                    = true
# first                     = Symbol 'first'
# last                      = Symbol 'last'
# FS                        = require 'fs'

#-----------------------------------------------------------------------------------------------------------
@time_now = ->
  t = process.hrtime()
  return BigInt "#{t[ 0 ]}" + "#{t[ 1 ]}".padStart 9, '0'

#-----------------------------------------------------------------------------------------------------------
@stopwatch_sync = ( f ) ->
  ### return time needed to call `f()` synchronously, in milliseconds ###
  t0ns = @time_now()
  f()
  t1ns = @time_now()
  return ( parseInt t1ns - t0ns, 10 ) / 1e6

#-----------------------------------------------------------------------------------------------------------
@stopwatch_async = ( f ) ->
  ### return time needed to call `f()` asynchronously, in milliseconds ###
  t0ns = @time_now()
  await f()
  t1ns = @time_now()
  return ( parseInt t1ns - t0ns, 10 ) / 1e6

#-----------------------------------------------------------------------------------------------------------
@add_result = ( me, test_name, data ) -> me.records.push { test_name, data..., }

#-----------------------------------------------------------------------------------------------------------
### taken from InterShop db/011-bar.sql ###
bar_from_percentage = ( n ) ->
  if n is null or n <= 0
    R = ''
  else if n > 100
    R = '████████████▌'
  else
    R = '█'.repeat n // 8
    switch n %% 8
      when 0 then R += ''
      when 1 then R += '▏'
      when 2 then R += '▎'
      when 3 then R += '▍'
      when 4 then R += '▌'
      when 5 then R += '▋'
      when 6 then R += '▊'
      when 7 then R += '▉'
      # when 8 then R += '█'
  return '│' + ( R.padEnd 13, ' ' ) + '│'

#-----------------------------------------------------------------------------------------------------------
@_get_averages = ( me ) ->
  R         = {}
  collector = {}
  ( collector[ record.test_name ] ?= [] ).push record for record in me.records
  keys = ( key for key of me.records[ 0 ] when key isnt 'test_name' )
  for test_name, records of collector
    target = R[ test_name ] = {}
    for key in keys
      measurements              = []
      for record in records
        continue unless ( value = record[ key ] )?
        measurements.push value
      average       = ( measurements.reduce ( ( x, y ) -> x + y ), 0 ) / measurements.length
      target[ key ] = average
  return ( { test_name, data..., } for test_name, data of R )

#-----------------------------------------------------------------------------------------------------------
### TAINT use `me` argument instead of module globals ###
@show_totals = ( me ) ->
  throw new Error "µ33998 must do benchmarks before showing totals" if me.records.length is 0
  # test_names  = ( test_name for test_name, data of me.records )
  records     = @_get_averages me
  records.sort ( a, b ) ->
    return +1 if a.ops < b.ops
    return -1 if a.ops > b.ops
    return  0
  best_ops = records[ 0 ].ops
  for record in records
    { test_name
      ops }       = record
    rops          = ( ops / best_ops ) * 100
    ### TAINT code duplication ###
    test_name_txt = test_name.padEnd 40
    ops_txt       = f0l   ops
    rops_txt      = f1s   rops
    bar           = bar_from_percentage Math.round rops
    info test_name_txt, ops_txt, 'Hz', rops_txt, '%', bar

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
f0    = ( n ) -> ( nf '###,##0.',          n ).padStart 15
f0l   = ( n ) -> ( nf '###,##0.',          n ).padStart 15
f1s   = ( n ) -> ( nf '###,##0.0',         n ).padStart  7
f3    = ( n ) -> ( nf '###,##0.000',       n ).padStart 15
f3s   = ( n ) -> ( nf '###,##0.000',       n ).padStart  7
f9    = ( n ) -> ( nf '###,##0.000000000', n ).padStart 24

#-----------------------------------------------------------------------------------------------------------
@new_benchmarks = -> { records: [], }

#-----------------------------------------------------------------------------------------------------------
@benchmark = ( me, n, show, parent, test_name ) -> new Promise benchmark = ( resolve ) =>
  unless test_name?
    for test_name of parent
      continue if test_name.startsWith '_'
      await @benchmark n, show, parent, test_name
    return null
  #.........................................................................................................
  t0ns          = @time_now()
  try
    test = await parent[ test_name ] n, show
  catch error
    warn "µ77812 when trying to run test #{rpr test_name}, an error occurred"
    throw error
  t1ns          = @time_now()
  # cpu1          = process.cpuUsage()
  console.profile test_name
  count         = await test()
  console.profileEnd test_name
  # cpu2          = process.cpuUsage cpu1
  t2ns          = @time_now()
  #.........................................................................................................
  dt1ns         = parseInt t1ns - t0ns, 10
  dt2ns         = parseInt t2ns - t1ns, 10
  dt1s          = dt1ns / 1e9
  dt2s          = dt2ns / 1e9
  nspc          = dt2ns / count
  ops           = count / dt2s
  #.........................................................................................................
  test_name_txt = test_name.padEnd 40
  # dt1s_txt      = f3s   dt1s
  dt2s_txt      = f3s   dt2s
  count_txt     = f0    count
  ops_txt       = f0l   ops
  nspc_txt      = f0    nspc
  # cpuusr_txt    = f0   cpu2.user   / 1e3
  # cpusys_txt    = f0   cpu2.system / 1e3
  echo [
    "#{CND.yellow test_name_txt}"
    # "#{CND.grey dt1s_txt + ' s'}"
    "#{dt2s_txt} s"
    "#{count_txt} items"
    "#{CND.green ops_txt}⏶Hz"
    "#{CND.gold nspc_txt}⏷nspc"
    # "#{CND.gold cpuusr_txt}⏷CPU/u"
    # "#{CND.gold cpusys_txt}⏷CPU/s"
    ].join ' '
  # debug '^1662^ cpu', cpu2
  @add_result me, test_name, { ops, }
  resolve()
  return null


