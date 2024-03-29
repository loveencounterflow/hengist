
'use strict'

###

Variables:

* (2) **`unsafe_mode: [ true, false, ]`**: safe mode on / off
* (2) **`use_transaction: [ true, false, ]`**: explicit vs implicit transaction
* (2) **`connection_count: [ 1, 2, ]`**: single connection vs double connection
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
jr                        = JSON.stringify
guy                       = require '../../../apps/guy'
{ DBay }                  = require H.dbay_path
trash                     = require 'trash'
#-----------------------------------------------------------------------------------------------------------
cfg =
  use:                  'ramfs' # 'memory', 'file'
  journal_mode:         'wal'
  # journal_mode:         'memory'
  verbose:              true
  # verbose:              false
  # catch_errors:         false
  catch_errors:         true
  # show_na_choices:      true
  show_na_choices:      false
  # hilite:               { ft: 'scalar', }
  hilite:               { ft: 'table', }
  choices:
    um: [ true, false, ]                                            ### unsafe_mode            ###
    cc: [ 1, 2, ]                                                   ### connection_count      ###
    # cc: [ 2, ]                                                      ### connection_count      ###
    wo: [ null, ]        # [ true, false, ]                         ### use_worker            ###
    # ft: [ null, ]        # [ 'none', 'scalar', 'table', 'sqlite', ] ### function_type         ###
    # ft: [ 'none', 'scalar', 'table', ]                              ### function_type         ###
    ft: [ 'scalar', 'table', ]                              ### function_type         ###
    ne: [ true, false, ]                                            ### use_nested_statement  ###
  results:
    not_applicable:   Symbol 'not_applicable'
    not_implemented:  Symbol 'not_implemented'
    query_hangs:      Symbol 'query_hangs'

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
  scalar_fn_cfg = { deterministic: false, varargs: false, }
  #.........................................................................................................
  for [ c1, c2, ] in [ [ db.sqlt1, db.sqlt1, ], [ db.sqlt1, db.sqlt1, ], ]
    #.......................................................................................................
    c1.function 'join_x_and_y_using_word_scalar_cc1', scalar_fn_cfg, -> jr join_x_and_y_using_word c1
    c1.function 'join_x_and_y_using_word_scalar_cc2', scalar_fn_cfg, -> jr join_x_and_y_using_word c2
    c1.table 'join_x_and_y_using_word_table_cc1',
      deterministic:  false
      varargs:        false
      columns:        [ 'word', 'nrx', 'nry', ]
      rows:           -> yield from join_x_and_y_using_word_iterate c1
    c1.table 'join_x_and_y_using_word_table_cc2',
      deterministic:  false
      varargs:        false
      columns:        [ 'word', 'nrx', 'nry', ]
      rows:           -> yield from join_x_and_y_using_word_iterate c2
    #.......................................................................................................
    c1.function 'select_word_from_y_scalar_cc1', scalar_fn_cfg, ( word ) -> jr select_word_from_y_scalar c1, word
    c1.function 'select_word_from_y_scalar_cc2', scalar_fn_cfg, ( word ) -> jr select_word_from_y_scalar c2, word
    c1.table 'select_word_from_y_table_cc1',
      deterministic:  false
      varargs:        false
      columns:        [ 'word', 'nry', ]
      rows:           ( word ) -> yield from select_word_from_y_iterate c1, word
    c1.table 'select_word_from_y_table_cc2',
      deterministic:  false
      varargs:        false
      columns:        [ 'word', 'nry', ]
      rows:           ( word ) -> yield from select_word_from_y_iterate c2, word
  return null

#-----------------------------------------------------------------------------------------------------------
prepare_dbr = ( dbr ) ->
  dbr.execute SQL"create table results (
    um      boolean,
    cc      integer,
    wo      boolean,
    ft      text,
    ne      boolean,
    is_ok   boolean,
    marker  text,
    error   text );"
  return null

#-----------------------------------------------------------------------------------------------------------
insert_result = ( dbr, fingerprint, is_ok, marker, error = null ) ->
  fingerprint = { fingerprint..., }
  for k, v of fingerprint
    fingerprint[ k ] = if v is true then 1 else ( if v is false then 0 else rpr v )
  { um, cc, wo, ft, ne, } = fingerprint
  is_ok   = if is_ok then 1 else 0
  dbr.run SQL"""
    insert into results values (
      $um, $cc, $wo, $ft, $ne, $is_ok, $marker, $error );
    """, { um, cc, wo, ft, ne, is_ok, marker, error }
  return null

#-----------------------------------------------------------------------------------------------------------
show_dbr = ( dbr ) ->
  { Tbl, }  = require '../../../apps/icql-dba-tabulate'
  dtab      = new Tbl { dba: dbr, }
  echo dtab._tabulate dbr.query SQL"""select
      *
    from results
    order by error, marker desc, cc, ne, 1, 2, 3, 4, 5, 6;"""
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
join_x_and_y_using_word_iterate = ( sqlt ) ->
  statement = sqlt.prepare SQL"""
    select
        x.word  as word,
        x.nrx   as nrx,
        y.nry   as nry
      from x
      join y on ( x.word = y.word )
      order by 1, 2, 3;"""
  yield from statement.iterate()

#-----------------------------------------------------------------------------------------------------------
select_word_from_y_scalar = ( sqlt, word ) ->
  statement = sqlt.prepare SQL"select * from y where word = $word order by 1, 2;"
  return statement.all { word, }

#-----------------------------------------------------------------------------------------------------------
select_word_from_y_iterate = ( sqlt, word ) ->
  statement = sqlt.prepare SQL"select * from y where word = $word order by 1, 2;"
  return statement.iterate { word, }

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
query_with_nested_statement = ( db, fingerprint, sqlt_a, sqlt_b ) ->
  switch fingerprint.ft
    #.......................................................................................................
    when 'none'
      result = []
      outer_statement = sqlt_a.prepare SQL"select * from x order by 1, 2;"
      for outer_row from outer_statement.iterate()
        inner_statement = sqlt_b.prepare SQL"select * from y where word = $word order by 1, 2;"
        for inner_row in inner_rows = inner_statement.all { word: outer_row.word, }
          result.push { word: outer_row.word, nrx: outer_row.nrx, nry: inner_row.nry, }
      return { result, }
    #.......................................................................................................
    when 'scalar'
      result = []
      outer_statement = sqlt_a.prepare SQL"select * from x order by 1, 2;"
      for outer_row from outer_statement.iterate()
        { word, }       = outer_row
        if fingerprint.cc is 1
          inner_statement = sqlt_b.prepare SQL"select select_word_from_y_scalar_cc1( $word ) as rows;"
        else
          inner_statement = sqlt_b.prepare SQL"select select_word_from_y_scalar_cc2( $word ) as rows;"
        inner_rows      = ( inner_statement.get { word, } ).rows
        inner_rows      = JSON.parse inner_rows
        for inner_row in inner_rows
          result.push { word: outer_row.word, nrx: outer_row.nrx, nry: inner_row.nry, }
      return { result, }
    #.......................................................................................................
    when 'table'
      result = []
      outer_statement = sqlt_a.prepare SQL"select * from x order by 1, 2;"
      for outer_row from outer_statement.iterate()
        { word, }       = outer_row
        if fingerprint.cc is 1
          inner_statement = sqlt_b.prepare SQL"select * from select_word_from_y_table_cc1( $word );"
        else
          inner_statement = sqlt_b.prepare SQL"select * from select_word_from_y_table_cc2( $word );"
        inner_rows      = inner_statement.all { word, }
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
      if fingerprint.cc is 1
        statement = sqlt_a.prepare SQL"select join_x_and_y_using_word_scalar_cc1() as rows;"
      else
        statement = sqlt_a.prepare SQL"select join_x_and_y_using_word_scalar_cc2() as rows;"
      result    = statement.get()
      result    = JSON.parse result.rows
      return { result, }
    when 'table'
      if fingerprint.cc is 1
        statement = sqlt_a.prepare SQL"select * from join_x_and_y_using_word_table_cc1() as rows;"
      else
        statement = sqlt_a.prepare SQL"select * from join_x_and_y_using_word_table_cc2() as rows;"
      result    = statement.all()
      return { result, }
  return { result: cfg.results.not_implemented, error: "ft: #{rpr fingerprint.ft} not implemented", }

# #-----------------------------------------------------------------------------------------------------------
# ff = ( db, fingerprint ) ->
#   error           = null
#   result          = null
#   { um, cc,
#     wo, ft, ne, } = fingerprint
#   #.........................................................................................................
#   if um
#     db.sqlt1.unsafeMode true
#   #.........................................................................................................
#   switch cc
#     when 1
#       sqlt_a          = db.sqlt1
#       sqlt_b          = sqlt_a
#     when 2
#       sqlt_a          = db.sqlt1
#       sqlt_b          = db.sqlt1
#     else throw new Error "expected cc to be 1 or 2, got #{rpr cc}"
#   #.........................................................................................................
#   try
#     #.......................................................................................................
#     if ne ### use_nested_statement ###
#       R = query_with_nested_statement db, fingerprint, sqlt_a, sqlt_b
#     else ### do not use_nested_statement ###
#       R = query_without_nested_statement db, fingerprint, sqlt_a, sqlt_b
#   #.........................................................................................................
#   catch error
#     throw error unless cfg.catch_errors
#     error = "(#{error.message})"
#     return { error, }
#   #.........................................................................................................
#   finally
#     db.sqlt1.unsafeMode false
#   #.........................................................................................................
#   return R
#   return null

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
new_db_with_data = ->
  switch cfg.use
    when 'ramfs', 'file'
      path = if cfg.use is 'ramfs' then '/dev/shm/subselects.db' else '/tmp/subselects.db'
      try await trash path catch error # then throw error unless error.name is 'ENOENT'
        debug error.name
        debug error.code
        debug type_of error
        throw error
      db = new DBay { path, timeout: 500, }
    when 'memory'
      db = new DBay { timeout: 500, }
    else throw new Error "unknown value for cfg.use: #{rpr cfg.use}"
  db.sqlt1.exec SQL"pragma journal_mode=#{cfg.journal_mode}"
  debug '^23332^', ( db.sqlt1.prepare SQL"pragma journal_mode;" ).get()
  debug '^23332^', db.sqlt1
  prepare_db db
  return db

#-----------------------------------------------------------------------------------------------------------
demo_f = ->
  matcher   = get_matcher await new_db_with_data()
  counts    =
    total:            0
    not_implemented:  0
    not_applicable:   0
    query_hangs:      0
    other:            0
    error:            0
    test:             0
    success:          0
    fail:             0
  #.........................................................................................................
  dbr       = new ( require '../../../apps/icql-dba' ).Dba()
  dbr.open()
  prepare_dbr dbr
  #.........................................................................................................
  for             um in cfg.choices.um  ### unsafe_mode            ###
    for           cc in cfg.choices.cc  ### connection_count     ###
      for         wo in cfg.choices.wo  ### use_worker            ###
        for       ft in cfg.choices.ft  ### function_type         ###
          for     ne in cfg.choices.ne  ### use_nested_statement  ###
            counts.total++
            db            = await new_db_with_data()
            fingerprint   = { um, cc, wo, ft, ne, }
            kenning       = get_kenning fingerprint
            # #...............................................................................................
            # if false \
            #   or ( equals fingerprint, { um: true,  cc: 1, wo: null, ft: 'table', ne: false } ) \
            #   or ( equals fingerprint, { um: false, cc: 1, wo: null, ft: 'table', ne: false } ) \
            #   or ( equals fingerprint, { um: true,  cc: 1, wo: null, ft: 'table', ne: true  } ) \
            #   or ( equals fingerprint, { um: false, cc: 1, wo: null, ft: 'table', ne: true  } ) \
            #   or ( equals fingerprint, { um: true,  cc: 2, wo: null, ft: 'table', ne: true  } ) \
            #   or ( equals fingerprint, { um: false, cc: 2, wo: null, ft: 'table', ne: true  } )
            #   # warn "^338^ ad-hoc skipped"
            #   result  = cfg.results.query_hangs
            #   error   = "query hangs indefinitely"
            # #...............................................................................................
            # else
            #   { result
            #     error }     = ff db, fingerprint
            { result
              error }     = ff db, fingerprint
            #...............................................................................................
            # debug '^3453^', result, isa.symbol result
            if ( isa.symbol result )
              switch result
                when cfg.results.not_implemented
                  counts.not_implemented++
                  color = CND.red
                when cfg.results.not_applicable
                  counts.not_applicable++
                  color = CND.grey
                when cfg.results.query_hangs
                  counts.query_hangs++
                  color = CND.grey
                else
                  counts.other++
                  color = CND.yellow
              unless ( result is cfg.results.not_applicable ) and ( not cfg.show_na_choices )
                echo CND.grey ' ', 0, color kenning, result, error
              continue unless result is cfg.results.query_hangs
            #.............................................................................................
            counts.test++
            if ( is_ok = equals result, matcher ) then  counts.success++
            else                                        counts.fail++
            if error?                             then  counts.error++
            if select fingerprint                 then  marker = CND.gold '█'
            else                                        marker = ' '
            #.............................................................................................
            insert_result dbr, fingerprint, is_ok, marker, error
            echo marker, ( CND.blue counts.test, kenning ), ( CND.truth is_ok ), marker, ( CND.red CND.reverse error ? '' )
            echo CND.red CND.reverse ' ', result, ' ' if ( not is_ok ) and ( not error? )
  #.........................................................................................................
  for k, v of counts
    help ( k.padStart 20 ), ( v.toString().padStart 5 )
  #.........................................................................................................
  show_dbr dbr
  return null

#-----------------------------------------------------------------------------------------------------------
simple_demo = ->
  { DBay }  = require H.dbay_path
  db        = new DBay()
  #.........................................................................................................
  create_functions = ->
    select_from_facets_stm = null
    db.create_table_function
      name:         'subselect'
      columns:      [ 'key', 'value' ]
      parameters:   [ 'n', ]
      rows: ( n ) ->
        select_from_facets_stm ?= db.sqlt2.prepare SQL"""
          select key, value from facets where n = $n order by value, key;"""
        # select_from_facets_stm ?= db.prepare SQL"select key, value from facets where n = $n"
        yield from select_from_facets_stm.iterate { n, }
        return null
    return null
  create_functions()
  #.........................................................................................................
  db SQL"""
    create table facets (
        n     integer not null references numbers ( n ),
        key   text    not null,
        value number  not null,
      primary key ( n, key ) );
    create table numbers (
        n     integer not null,
      primary key ( n ) );"""
  #.........................................................................................................
  db ->
    for n in [ 1 .. 3 ]
      db SQL"insert into numbers ( n ) values ( $n )", { n, }
      db SQL"insert into facets ( n, key, value ) values ( ?, ?, ? )", [ n, 'double', ( n * 2 ), ]
      db SQL"insert into facets ( n, key, value ) values ( ?, ?, ? )", [ n, 'half',   ( n / 2 ), ]
      db SQL"insert into facets ( n, key, value ) values ( ?, ?, ? )", [ n, 'square', ( n * n ), ]
  #.........................................................................................................
  console.table db.all_rows SQL"select * from numbers order by n;"
  console.table db.all_rows SQL"select * from facets order by value;"
  for n from db.first_values SQL"select n from numbers order by n;"
    info '^338^', { n, }
    console.table db.all_rows SQL"""
      select
          $n      as n,
          key     as key,
          value   as value
        from subselect( $n ) as r1;""", { n, }
  #.........................................................................................................
  return null

############################################################################################################
if require.main is module then do =>
  # await demo_f()
  # simple_demo()
  throw new Error "^4343^ subselects from UDFs not supported"

