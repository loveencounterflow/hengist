
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/SUBSELECTS-WITH-UDFS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
ff = ( db, count, fingerprint ) ->
  sqlt_a        = db.sqlt1
  sqlt_b        = db.sqlt2
  error         = null
  rows          = null
  { uu, sc, ut,
    uw, sf, ft,
    un, }       = fingerprint
  #...........................................................................................
  if uu
    db.sqlt1.unsafeMode true
    db.sqlt2.unsafeMode true
  #...........................................................................................
  if sc
    sqlt_b = db.sqlt1
  #...........................................................................................
  if ut
    # debug '^334-1^', "begin tx"
    sqlt_a.exec SQL"begin transaction;"
    sqlt_b.exec SQL"begin transaction;" if sqlt_a isnt sqlt_b
  #...........................................................................................
  try
    #.........................................................................................
    if un ### use_nested ###
      # throw new Error "test case missing"
      rows            = []
      outer_statement = sqlt_a.prepare SQL"""
        select
            *
          from x
          order by 1, 2;"""
      for outer_row from outer_statement.iterate()
        inner_statement = sqlt_b.prepare SQL"""
          select
              *
            from y
            where word = $word
            order by 1, 2;"""
        for inner_row in inner_rows = inner_statement.all { word: outer_row.word, }
          rows.push { word: outer_row.word, nrx: outer_row.nrx, nry: inner_row.nry, }
    #.........................................................................................
    else
      statement = sqlt_a.prepare SQL"""
        select
            x.word  as word,
            x.nrx   as nrx,
            y.nry   as nry
          from x
          join y on ( x.word = y.word )
          order by 1, 2, 3;"""
      rows  = statement.all()
  catch error
    error = "(#{error.message})"
  #...........................................................................................
  finally
    #.........................................................................................
    if uu
      db.sqlt1.unsafeMode false
      db.sqlt2.unsafeMode false
    #.........................................................................................
    if ut
      # debug '^334-2^', "commit tx"
      sqlt_a.exec SQL"commit;"
      sqlt_b.exec SQL"commit;" if sqlt_a isnt sqlt_b
    #.........................................................................................
    if sc
      sqlt_b = db.sqlt2
  #...........................................................................................
  return { rows, error, }

#-----------------------------------------------------------------------------------------------------------
demo_f = ->
  { Dbay }  = require H.dbay_path
  db        = new Dbay()
  #.........................................................................................................
  do =>
    db.sqlt1.exec SQL"create table x ( word text, nrx );"
    db.sqlt1.exec SQL"create table y ( word text, nry );"
    for word, idx in "foo bar baz".split /\s+/
      nrx = idx + 1
      ( db.sqlt1.prepare SQL"insert into x ( word, nrx ) values ( $word, $nrx );" ).run { word, nrx, }
      for n in [ 1, 2, 3, ]
        nry = nrx + n * 2
        ( db.sqlt1.prepare SQL"insert into y ( word, nry ) values ( $word, $nry );" ).run { word, nry, }
    return null
  #.........................................................................................................
  get_kenning = ( fingerprint ) ->
    R = []
    for k, v of fingerprint
      v = if v is true then '1' else ( if v is false then '0' else rpr v )
      R.push "#{k}:#{v}"
    return R.join ','
  #.........................................................................................................
  matcher = [
      { word: 'bar', nrx: 2, nry: 4 }
      { word: 'bar', nrx: 2, nry: 6 }
      { word: 'bar', nrx: 2, nry: 8 }
      { word: 'baz', nrx: 3, nry: 5 }
      { word: 'baz', nrx: 3, nry: 7 }
      { word: 'baz', nrx: 3, nry: 9 }
      { word: 'foo', nrx: 1, nry: 3 }
      { word: 'foo', nrx: 1, nry: 5 }
      { word: 'foo', nrx: 1, nry: 7 }
      ]
  #.........................................................................................................
  choices =
    uu: [ true, false, ]                                            ### use_unsafe            ###
    sc: [ true, false, ]                                            ### single_connection     ###
    ut: [ true, false, ]                                            ### use_transaction       ###
    uw: [ null, ]        # [ true, false, ]                         ### use_worker            ###
    sf: [ null, ]        # [ true, false, ]                         ### sf                    ###
    ft: [ null, ]        # [ 'none', 'scalar', 'table', 'sqlite', ] ### function_type         ###
    un: [ true, false, ]                                            ### use_nested_statement  ###
  #.........................................................................................................
  count = 0
  for             uu in choices.uu  ### use_unsafe            ###
    for           sc in choices.sc  ### single_connection     ###
      for         ut in choices.ut  ### use_transaction       ###
        for       uw in choices.uw  ### use_worker            ###
          for     sf in choices.sf  ### sf                    ###
            for   ft in choices.ft  ### function_type         ###
              for un in choices.un  ### use_nested_statement  ###
                count++
                fingerprint   = { uu, sc, ut, uw, sf, ft, un, }
                kenning       = get_kenning fingerprint
                { rows
                  error }     = ff db, count++, fingerprint
                is_ok = types.equals rows, matcher
                debug '^4509^', ( CND.blue count, kenning ), ( CND.truth is_ok ), ( CND.red error_message ? '' )
                unless is_ok
                  debug '^338^', rows
  return null

###

Variables:

* (2) **`use_unsafe: [ true, false, ]`**: safe mode on / off
* (2) **`use_transaction: [ true, false, ]`**: explicit vs implicit transaction
* (2) **`single_connection: [ true, false, ]`**: single connection vs double connection
* (2) **`use_worker: [ true, false, ]`**: single thread vs main thread + worker thread
* (2) **`use_subselect_function: [ true, false, ]`**: using a function that does no sub-select vs function
  that does
* (4) **`function_type: [ 'none', 'scalar', 'table', 'sqlite', ]`**: SQL using no UDF, using scalar UDF,
  using table UDF, using SQLite function[^1]
* (2) **`use_nested_statement: [ true, false, ]`**: use nested statement or not

2^6 * 4^1 = 64 * 4 = 256 possible variants (but minus some impossible combinations)

changes:

* (?) **`transaction_type: [ 'deferred', ..., ]`**
* (?) **`journalling_mode: [ 'wal', 'memory', ..., ]`**

Notes:

[^1]: using a function provided by SQLite will not lead to equivalent results because there's no SQLite
  function that provides a sub-select.

###

############################################################################################################
if require.main is module then do =>
  await demo_f()

