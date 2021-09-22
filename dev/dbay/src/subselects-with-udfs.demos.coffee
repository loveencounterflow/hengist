
'use strict'

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
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/DEMOS/UDFSEL'
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
{ equals
  isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
#-----------------------------------------------------------------------------------------------------------
cfg =
  # verbose:              true
  verbose:              false
  # catch_errors:         false
  catch_errors:         true
  # show_na_choices:      true
  show_na_choices:      false
  hilite:               { ft: 'scalar', }
  choices:
    uu: [ true, false, ]                                            ### use_unsafe            ###
    sc: [ true, false, ]                                            ### single_connection     ###
    ut: [ true, false, ]                                            ### use_transaction       ###
    uw: [ null, ]        # [ true, false, ]                         ### use_worker            ###
    # ft: [ null, ]        # [ 'none', 'scalar', 'table', 'sqlite', ] ### function_type         ###
    ft: [ 'none', 'scalar', 'table', ]                              ### function_type         ###
    un: [ true, false, ]                                            ### use_nested_statement  ###
  results:
    not_applicable:   Symbol 'not_applicable'
    not_implemented:  Symbol 'not_implemented'

#-----------------------------------------------------------------------------------------------------------
prepare_db = ( db ) ->
  db.sqlt1.exec SQL"create table x ( word text, nrx );"
  db.sqlt1.exec SQL"create table y ( word text, nry );"
  for word, idx in "foo bar baz".split /\s+/
    nrx = idx + 1
    ( db.sqlt1.prepare SQL"insert into x ( word, nrx ) values ( $word, $nrx );" ).run { word, nrx, }
    for n in [ 1, 2, 3, ]
      nry = nrx + n * 2
      ( db.sqlt1.prepare SQL"insert into y ( word, nry ) values ( $word, $nry );" ).run { word, nry, }
  fn_cfg = { deterministic: false, varargs: false, }
  ### TAINT use other connection for query ###
  for connection in [ db.sqlt1, db.sqlt2, ]
    connection.function 'join_x_and_y_using_word_scalar', fn_cfg, ->
      return JSON.stringify join_x_and_y_using_word connection
    connection.function 'select_word_from_y_scalar', fn_cfg, ( word ) ->
      return JSON.stringify select_word_from_y_scalar connection, word
    # connection.table 'join_x_and_y_using_word_table', fn_cfg, ->
  return null

#-----------------------------------------------------------------------------------------------------------
join_x_and_y_using_word = ( sqlt ) ->
  statement = sqlt.prepare SQL"""
    select
        x.word  as word,
        x.nrx   as nrx,
        y.nry   as nry
      from x
      join y on ( x.word = y.word )
      order by 1, 2, 3;"""
  return statement.all()

#-----------------------------------------------------------------------------------------------------------
select_word_from_y_scalar = ( sqlt, word ) ->
  statement = sqlt.prepare SQL"select * from y where word = $word order by 1, 2;"
  return statement.all { word, }

#-----------------------------------------------------------------------------------------------------------
get_matcher = ( db ) -> join_x_and_y_using_word db.sqlt1

#-----------------------------------------------------------------------------------------------------------
get_kenning = ( fingerprint ) ->
  R = []
  for k, v of fingerprint
    v = if v is true then '1' else ( if v is false then '0' else rpr v )
    R.push "#{k}:#{v}"
  return R.join ','

#-----------------------------------------------------------------------------------------------------------
_begin_transaction = ( ut, sqlt_a, sqlt_b ) ->
  return unless ut
  debug '^334-1^', "begin tx" if cfg.verbose
  sqlt_a.exec SQL"begin transaction;"
  sqlt_b.exec SQL"begin transaction;" if sqlt_a isnt sqlt_b
  return null

#-----------------------------------------------------------------------------------------------------------
_commit_transaction = ( ut, sqlt_a, sqlt_b ) ->
  return unless ut
  debug '^334-2^', "commit tx" if cfg.verbose
  sqlt_a.exec SQL"commit;"
  sqlt_b.exec SQL"commit;" if sqlt_a isnt sqlt_b
  return null

#-----------------------------------------------------------------------------------------------------------
query_with_nested_statement = ( db, fingerprint, sqlt_a, sqlt_b ) ->
  switch fingerprint.ft
    #.......................................................................................................
    when 'none'
      ### TAINT refactor ###
      result = []
      outer_statement = sqlt_a.prepare SQL"select * from x order by 1, 2;"
      for outer_row from outer_statement.iterate()
        inner_statement = sqlt_b.prepare SQL"select * from y where word = $word order by 1, 2;"
        for inner_row in inner_rows = inner_statement.all { word: outer_row.word, }
          result.push { word: outer_row.word, nrx: outer_row.nrx, nry: inner_row.nry, }
      return { result, }
    #.......................................................................................................
    when 'scalar'
      ### TAINT refactor ###
      result = []
      outer_statement = sqlt_a.prepare SQL"select * from x order by 1, 2;"
      for outer_row from outer_statement.iterate()
        { word, }       = outer_row
        inner_statement = sqlt_b.prepare SQL"select select_word_from_y_scalar( $word ) as rows;"
        inner_rows      = ( inner_statement.get { word, } ).rows
        inner_rows      = JSON.parse inner_rows
        for inner_row in inner_rows
          result.push { word: outer_row.word, nrx: outer_row.nrx, nry: inner_row.nry, }
      return { result, }
  #.........................................................................................................
  return { result: cfg.results.not_implemented, error: "ft: #{rpr fingerprint.ft} not implemented", }

#-----------------------------------------------------------------------------------------------------------
query_without_nested_statement = ( db, fingerprint, sqlt_a, sqlt_b ) ->
  switch fingerprint.ft
    when 'none'
      return { result: ( join_x_and_y_using_word sqlt_a ), }
    when 'scalar'
      statement = sqlt_a.prepare SQL"""
        select join_x_and_y_using_word_scalar() as rows;"""
      result = statement.get()
      result = JSON.parse result.rows
      return { result, }
  return { result: cfg.results.not_implemented, error: "ft: #{rpr fingerprint.ft} not implemented", }

#-----------------------------------------------------------------------------------------------------------
ff = ( db, fingerprint ) ->
  sqlt_a          = db.sqlt1
  sqlt_b          = db.sqlt2
  error           = null
  result          = null
  { uu, sc, ut,
    uw, ft, un, } = fingerprint
  #.........................................................................................................
  if uu
    db.sqlt1.unsafeMode true
    db.sqlt2.unsafeMode true
  #.........................................................................................................
  if sc
    sqlt_b = db.sqlt1
  #.........................................................................................................
  try
    if ut
      unless un then return { result: cfg.results.not_applicable, error: "need nested stms for tx:1", } if ut
      unless sc then return { result: cfg.results.not_applicable, error: "need single conn for tx:1", } if ut
    _begin_transaction ut, sqlt_a, sqlt_b
    #.......................................................................................................
    if un ### use_nested_statement ###
      R = query_with_nested_statement db, fingerprint, sqlt_a, sqlt_b
    else ### do not use_nested_statement ###
      R = query_without_nested_statement db, fingerprint, sqlt_a, sqlt_b
    #.......................................................................................................
    _commit_transaction ut, sqlt_a, sqlt_b
    return R
  #.........................................................................................................
  catch error
    throw error unless cfg.catch_errors
    error = "(#{error.message})"
    return { error, }
  #.........................................................................................................
  finally
    if uu
      db.sqlt1.unsafeMode false
      db.sqlt2.unsafeMode false
    #.......................................................................................................
    if sc
      sqlt_b = db.sqlt2
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
select = ( fingerprint ) ->
  return false unless cfg.hilite?
  for key, choices of cfg.hilite
    switch type_of choices
      when 'list'
        for choice in choices
          return true if equals choice, fingerprint[ key ]
      else
        return true if equals choices, fingerprint[ key ]
  return false

#-----------------------------------------------------------------------------------------------------------
demo_f = ->
  { Dbay }  = require H.dbay_path
  db        = new Dbay()
  prepare_db db
  matcher   = get_matcher db
  counts    =
    total:            0
    not_implemented:  0
    not_applicable:   0
    other:            0
    error:            0
    test:             0
    success:          0
    fail:             0
  #.........................................................................................................
  for             uu in cfg.choices.uu  ### use_unsafe            ###
    for           sc in cfg.choices.sc  ### single_connection     ###
      for         ut in cfg.choices.ut  ### use_transaction       ###
        for       uw in cfg.choices.uw  ### use_worker            ###
          for     ft in cfg.choices.ft  ### function_type         ###
            for   un in cfg.choices.un  ### use_nested_statement  ###
              counts.total++
              fingerprint   = { uu, sc, ut, uw, ft, un, }
              kenning       = get_kenning fingerprint
              { result
                error }     = ff db, fingerprint
              # debug '^3453^', result, isa.symbol result
              if ( isa.symbol result )
                switch result
                  when cfg.results.not_implemented
                    counts.not_implemented++
                    color = CND.red
                  when cfg.results.not_applicable
                    counts.not_applicable++
                    color = CND.grey
                  else
                    counts.other++
                    color = CND.yellow
                unless ( result is cfg.results.not_applicable ) and ( not cfg.show_na_choices )
                  echo CND.grey ' ', 0, color kenning, result, error
                continue
              counts.test++
              if ( is_ok = equals result, matcher ) then  counts.success++
              else                                        counts.fail++
              if error?                             then  counts.error++
              if select fingerprint                 then  marker = CND.gold '█'
              else                                        marker = ' '
              echo marker, ( CND.blue counts.test, kenning ), ( CND.truth is_ok ), marker, ( CND.red CND.reverse error ? '' )
              echo CND.red CND.reverse ' ', result, ' ' if ( not is_ok ) and ( not error? )
  #.........................................................................................................
  for k, v of counts
    help ( k.padStart 20 ), ( v.toString().padStart 5 )
  return null


############################################################################################################
if require.main is module then do =>
  await demo_f()

