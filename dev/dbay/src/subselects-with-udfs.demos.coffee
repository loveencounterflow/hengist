
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
{ equals
  isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
#-----------------------------------------------------------------------------------------------------------
cfg =
  # verbose:    true
  verbose:    false
  choices:
    uu: [ true, false, ]                                            ### use_unsafe            ###
    sc: [ true, false, ]                                            ### single_connection     ###
    ut: [ true, false, ]                                            ### use_transaction       ###
    uw: [ null, ]        # [ true, false, ]                         ### use_worker            ###
    sf: [ null, ]        # [ true, false, ]                         ### sf                    ###
    # ft: [ null, ]        # [ 'none', 'scalar', 'table', 'sqlite', ] ### function_type         ###
    ft: [ 'none', 'scalar', ]                                       ### function_type         ###
    un: [ true, false, ]                                            ### use_nested_statement  ###
  results:
    not_applicable: Symbol 'not_applicable'

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
  for connection in [ db.sqlt1, db.sqlt2, ]
    connection.function 'join_x_and_y_using_word', fn_cfg, -> "[]"
  return null

#-----------------------------------------------------------------------------------------------------------
get_matcher = ( db ) ->
  matcher = db.sqlt1.prepare SQL"""
    select
        x.word  as word,
        x.nrx   as nrx,
        y.nry   as nry
      from x
      join y on ( x.word = y.word )
      order by 1, 2, 3;"""
  return matcher.all()

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
query_with_nested_statement = ( db, count, fingerprint, sqlt_a, sqlt_b ) ->
  R          = []
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
      R.push { word: outer_row.word, nrx: outer_row.nrx, nry: inner_row.nry, }
  return R

#-----------------------------------------------------------------------------------------------------------
query_without_nested_statement = ( db, count, fingerprint, sqlt_a, sqlt_b ) ->
  switch fingerprint.ft
    when 'none'
      statement = sqlt_a.prepare SQL"""
        select
            x.word  as word,
            x.nrx   as nrx,
            y.nry   as nry
          from x
          join y on ( x.word = y.word )
          order by 1, 2, 3;"""
      return statement.all()
    when 'scalar'
      statement = sqlt_a.prepare SQL"""
        select join_x_and_y_using_word() as rows;"""
      debug '^321^', statement.get()
      return null
    else
      throw new Error "ft: {rpr fingerprint.ft} not implemented"
  return statement.all()

#-----------------------------------------------------------------------------------------------------------
ff = ( db, count, fingerprint ) ->
  sqlt_a        = db.sqlt1
  sqlt_b        = db.sqlt2
  error         = null
  result        = null
  { uu, sc, ut,
    uw, sf, ft,
    un, }       = fingerprint
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
      unless un then return { result: cfg.results.not_applicable, error: "(need nested stms for tx:1)", } if ut
      unless sc then return { result: cfg.results.not_applicable, error: "(need single conn for tx:1)", } if ut
    _begin_transaction ut, sqlt_a, sqlt_b
    #.......................................................................................................
    if un ### use_nested_statement ###
      result = query_with_nested_statement db, count, fingerprint, sqlt_a, sqlt_b
    else ### do not use_nested_statement ###
      result = query_without_nested_statement db, count, fingerprint, sqlt_a, sqlt_b
    #.......................................................................................................
    _commit_transaction ut, sqlt_a, sqlt_b
  catch error
    error = "(#{error.message})"
  #.........................................................................................................
  finally
    #.......................................................................................................
    if uu
      db.sqlt1.unsafeMode false
      db.sqlt2.unsafeMode false
    #.......................................................................................................
    if sc
      sqlt_b = db.sqlt2
  #.........................................................................................................
  return { result, error, }

#-----------------------------------------------------------------------------------------------------------
demo_f = ->
  { Dbay }  = require H.dbay_path
  db        = new Dbay()
  prepare_db db
  matcher   = get_matcher db
  #.........................................................................................................
  count = 0
  for             uu in cfg.choices.uu  ### use_unsafe            ###
    for           sc in cfg.choices.sc  ### single_connection     ###
      for         ut in cfg.choices.ut  ### use_transaction       ###
        for       uw in cfg.choices.uw  ### use_worker            ###
          for     sf in cfg.choices.sf  ### sf                    ###
            for   ft in cfg.choices.ft  ### function_type         ###
              for un in cfg.choices.un  ### use_nested_statement  ###
                fingerprint   = { uu, sc, ut, uw, sf, ft, un, }
                kenning       = get_kenning fingerprint
                { result
                  error }     = ff db, count, fingerprint
                switch result
                  when cfg.results.not_applicable
                    whisper '^450^', 0, kenning, "N/A", error
                    continue
                count++
                is_ok         = equals result, matcher
                info '^450^', ( CND.blue count, kenning ), ( CND.truth is_ok ), ( CND.red error ? '' )
                unless is_ok
                  warn '^338^', result
  return null


############################################################################################################
if require.main is module then do =>
  await demo_f()

