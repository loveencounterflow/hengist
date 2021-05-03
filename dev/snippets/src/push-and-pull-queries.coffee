

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'PUSH&PULL'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND


#-----------------------------------------------------------------------------------------------------------
customers = [
  { id: 1, firstName: "justin", balance: 10 },
  { id: 2, firstName: "sissel", balance: 0 },
  { id: 3, firstName: "justin", balance: -3 },
  { id: 4, firstName: "smudge", balance: 2 },
  { id: 5, firstName: "smudge", balance: 0 },
  ]

#===========================================================================================================
pull_query = ->

  #---------------------------------------------------------------------------------------------------------
  Scan = ( collection ) ->
    for x from collection
      yield x
    return null

  #---------------------------------------------------------------------------------------------------------
  Select = ( filter, iterator ) ->
    for x from iterator
      continue unless filter x
      yield x
    return null

  #---------------------------------------------------------------------------------------------------------
  Map = ( f, iterator ) ->
    for x from iterator
      yield f x
    return null

  #---------------------------------------------------------------------------------------------------------
  Distinct = ( iterator ) ->
    seen = new Set()
    for x from iterator
      continue if seen.has x
      seen.add x
      yield x
    return null

  #---------------------------------------------------------------------------------------------------------
  ### SELECT DISTINCT customer_first_name FROM customers WHERE customer_balance > 0 ###
  info [ ( Distinct \
    ( Map \
      ( ( c ) => c.firstName ),
      ( Select ( ( c ) => c.balance > 0 ), ( Scan customers ) ) ) \
    )... ]

  #---------------------------------------------------------------------------------------------------------
  return null


#===========================================================================================================
push_query = ->

  #---------------------------------------------------------------------------------------------------------
  Scan = ( relation, send ) ->
    for r from relation
      send r
    return null

  #---------------------------------------------------------------------------------------------------------
  Select = ( test, send ) -> ( x ) => send x if test x

  #---------------------------------------------------------------------------------------------------------
  Map = ( f, send ) -> ( x ) => send f x

  #---------------------------------------------------------------------------------------------------------
  Distinct = ( send ) ->
    seen = new Set()
    return ( x ) =>
      return null if seen.has x
      seen.add x
      send x
      return null

  #---------------------------------------------------------------------------------------------------------
  result = []
  ( Scan \
    customers,
    ( Select \
      ( ( c ) => c.balance > 0 ),
      Map(
        ( ( c ) => c.firstName ),
        ( Distinct ( ( r ) => result.push(r) ) )
        )
      )
    )
  help result

  #---------------------------------------------------------------------------------------------------------
  return null


############################################################################################################
if module is require.main then do =>
  pull_query()
  push_query()





