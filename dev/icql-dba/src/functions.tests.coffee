
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/FUNCTIONS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
on_process_exit           = require 'exit-hook'
sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse



#-----------------------------------------------------------------------------------------------------------
@[ "DBA: window functions etc." ] = ( T, done ) ->
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  dba               = new Dba()
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fn', }
  debug { template_path, work_path, }
  dba.open { path: work_path, schema, }
  numbers           = dba.all_first_values dba.query SQL"select n from nnt order by n;"
  # console.table dba.list dba.walk_objects { schema, }
  #.........................................................................................................
  await do =>
    ### single-valued function ###
    dba.create_function name: 'square', deterministic: true, varargs: false, call: ( n ) -> n ** 2
    matcher = ( ( n * n ) for n in numbers )
    result  = dba.list dba.query SQL"select *, square( n ) as square from nnt order by square;"
    console.table result
    result  = ( row.square for row in result )
    T.eq result, matcher
  #.........................................................................................................
  await do =>
    ### aggregate function ###
    dba.create_aggregate_function
      name:           'product'
      start:          -> null
      step:           ( total, element ) -> debug '^4476^', { total, element, }; ( total ? 1 ) * element
      # inverse:        ( total, dropped ) -> total.pop(); total
      # result:         ( total ) -> total
    # matcher = ( ( n * n ) for n in numbers )
    #.......................................................................................................
    do =>
      result  = dba.list dba.query SQL"select product( n ) as product from nnt where n != 0;"
      console.table result
      matcher = [ 5122922112, ]
      result  = ( row.product for row in result )
      T.eq result, matcher
    #.......................................................................................................
    do =>
      result  = dba.list dba.query SQL"select product( n ) as product from nnt where n > 100;"
      console.table result
      matcher = [ null, ]
      result  = ( row.product for row in result )
      T.eq result, matcher
    #.......................................................................................................
    do =>
      try
        dba.query SQL"select product( n ) over () as product from nnt;"
      catch error
        T.eq error.code, 'SQLITE_ERROR'
        T.eq error.name, 'SqliteError'
        T.eq error.message, 'product() may not be used as a window function'
      unless error?
        T.fail "expected error"
      # console.table result
      # matcher = [ null, ]
      # result  = ( row.product for row in result )
      # T.eq result, matcher
  #.........................................................................................................
  await do =>
    ### window function ###
    dba.create_window_function
      name:           'array_agg'
      varargs:        false
      deterministic:  true
      start:          -> [] # must be new object for each partition, therefore use function, not constant
      step:           ( total, element ) -> total.push element; total
      inverse:        ( total, dropped ) -> total.pop(); total
      result:         ( total ) -> jr total
    #.......................................................................................................
    do =>
      result  = dba.list dba.query SQL"select array_agg( t ) as names from nnt;"
      console.table result
      matcher = [ '["naught","one","one point five","two","two point three","three","three point one","four","five","six","seven","eight","nine","ten","eleven","twelve"]' ]
      result  = ( row.names for row in result )
      T.eq result, matcher
    #.......................................................................................................
    do =>
      result  = dba.list dba.query SQL"""
        select distinct
            array_agg( t ) over w as names
          from nnt
          window w as (
            partition by substring( t, 1, 1 )
            order by t
            range between unbounded preceding and unbounded following
            );"""
      console.table result
      matcher = [ '["eight","eleven"]', '["five","four"]', '["naught","nine"]', '["one","one point five"]', '["seven","six"]', '["ten","three","three point one","twelve","two","two point three"]' ]
      result  = ( row.names for row in result )
      debug '^878^', result
      T.eq result, matcher
  #.........................................................................................................
  await do =>
    ### table-valued function ###
    dba.create_table_function
      name:         're_matches'
      columns:      [ 'match', 'capture', ]
      parameters:   [ 'text', 'pattern', ]
      rows: ( text, pattern ) ->
        regex = new RegExp pattern, 'g'
        while ( match = regex.exec text )?
          yield [ match[ 0 ], match[ 1 ], ]
        return null
    await do =>
      result  = dba.list dba.query SQL"""
        select
            *
          from
            nnt,
            re_matches( t, '^.*([aeiou].e).*$' ) as rx
          order by rx.match;"""
      console.table result
      matcher = [ 'eleven:eve', 'five:ive', 'nine:ine', 'one:one', 'one point five:ive', 'seven:eve', 'three point one:one' ]
      result  = ( "#{row.t}:#{row.capture}" for row in result )
      debug '^984^', result
      T.eq result, matcher
    await do =>
      result  = dba.list dba.query SQL"""
        select
            *
          from
            nnt,
            re_matches( t, 'o' ) as rx
          order by t;"""
      console.table result
      matcher = [ 'four', 'one', 'one point five', 'one point five', 'three point one', 'three point one', 'two', 'two point three', 'two point three' ]
      result  = ( row.t for row in result )
      debug '^984^', result
      T.eq result, matcher
  #.........................................................................................................
  await do =>
    ### virtual table ###
    FS = require 'fs'
    dba.create_virtual_table
      name:   'file_contents'
      create: ( filename, P... ) ->
        urge '^46456^', { filename, P, }
        R =
          columns: [ 'path', 'lnr', 'line', ],
          rows: ->
            path  = PATH.resolve PATH.join __dirname, '../../../assets/icql', filename
            lines = ( FS.readFileSync path, { encoding: 'utf-8', } ).split '\n'
            for line, line_idx in lines
              yield { path, lnr: line_idx + 1, line, }
            return null
        return R
    dba.execute SQL"""
      create virtual table contents_of_wbftsv
        using file_contents( ncrglyphwbf.tsv, any stuff goes here, and more here );"""
    result  = dba.list dba.query SQL"select * from contents_of_wbftsv where lnr between 10 and 14 order by 1, 2, 3;"
    console.table result
    matcher = [ 'u-cjk-xa-3417\t㐗\t<1213355>', '', 'u-cjk-xa-34ab\t㒫\t<121135>', 'u-cjk-xa-342a\t㐪\t<415234>', 'u-cjk-xa-342b\t㐫\t<413452>' ]
    result  = ( row.line for row in result )
    debug '^984^', result
    T.eq result, matcher
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: User-Defined Window Function" ] = ( T, done ) ->
  ### see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md ###
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  dba               = new Dba()
  dba.load_extension PATH.resolve PATH.join __dirname, '../../../assets/sqlite-extensions/json1.so'
  # dba.sqlt.unsafeMode true
  { I, L, V, }      = new ( require '../../../apps/icql-dba/lib/sql' ).Sql
  #.........................................................................................................
  dba.create_window_function
    name:           'udf_json_array_agg'
    varargs:        false
    deterministic:  true
    start:          -> [] # must be new object for each partition, therefore use function, not constant
    step:           ( total, element ) -> total.push element; total
    inverse:        ( total, dropped ) -> total.pop(); total
    result:         ( total ) -> jr total
  #.........................................................................................................
  await do =>
    #.......................................................................................................
    dba.execute SQL"""
      create view multiples as select distinct
          n                                               as n,
          udf_json_array_agg( multiple ) over w           as multiples
        from multiples_idx
        window w as ( partition by n order by idx range between unbounded preceding and unbounded following )
        order by n;
      -- ...................................................................................................
      create table multiples_idx (
        n         integer not null,
        idx       integer not null,
        multiple  integer not null,
        primary key ( n, idx ) );
      create index multiples_idx_idx_idx on multiples_idx ( idx );
      create index multiples_idx_multiple_idx on multiples_idx ( multiple );
      -- ...................................................................................................
      create trigger multiple_instead_insert instead of insert on multiples begin
        insert into multiples_idx( n, idx, multiple )
          select new.n, j.key, j.value from json_each( new.multiples ) as j;
        end;
      -- ...................................................................................................
      create trigger multiple_instead_delete instead of delete on multiples begin
        delete from multiples_idx where n = old.n;
        end;
      -- ...................................................................................................
      create trigger multiple_instead_update instead of update on multiples begin
        delete from multiples_idx where n = old.n;
        insert into multiples_idx( n, idx, multiple )
          select new.n, j.key, j.value from json_each( new.multiples ) as j;
        end;
      """
    #.......................................................................................................
    for n in [ 1 .. 3 ]
      multiples = jr ( n * idx for idx in [ 0 .. 9 ] )
      dba.run SQL"""insert into multiples ( n, multiples ) values ( $n, $multiples )""", { n, multiples, }
    dba.execute SQL"insert into multiples ( n, multiples ) values ( 5, '[0,5,10,15,20]' );"
    #.......................................................................................................
    console.table dba.list dba.query SQL"select * from multiples_idx;"
    console.table dba.list dba.query SQL"select * from multiples;"
    T.eq ( dba.list dba.query SQL"select * from multiples_idx order by n, idx;" ), [ { n: 1, idx: 0, multiple: 0 }, { n: 1, idx: 1, multiple: 1 }, { n: 1, idx: 2, multiple: 2 }, { n: 1, idx: 3, multiple: 3 }, { n: 1, idx: 4, multiple: 4 }, { n: 1, idx: 5, multiple: 5 }, { n: 1, idx: 6, multiple: 6 }, { n: 1, idx: 7, multiple: 7 }, { n: 1, idx: 8, multiple: 8 }, { n: 1, idx: 9, multiple: 9 }, { n: 2, idx: 0, multiple: 0 }, { n: 2, idx: 1, multiple: 2 }, { n: 2, idx: 2, multiple: 4 }, { n: 2, idx: 3, multiple: 6 }, { n: 2, idx: 4, multiple: 8 }, { n: 2, idx: 5, multiple: 10 }, { n: 2, idx: 6, multiple: 12 }, { n: 2, idx: 7, multiple: 14 }, { n: 2, idx: 8, multiple: 16 }, { n: 2, idx: 9, multiple: 18 }, { n: 3, idx: 0, multiple: 0 }, { n: 3, idx: 1, multiple: 3 }, { n: 3, idx: 2, multiple: 6 }, { n: 3, idx: 3, multiple: 9 }, { n: 3, idx: 4, multiple: 12 }, { n: 3, idx: 5, multiple: 15 }, { n: 3, idx: 6, multiple: 18 }, { n: 3, idx: 7, multiple: 21 }, { n: 3, idx: 8, multiple: 24 }, { n: 3, idx: 9, multiple: 27 }, { n: 5, idx: 0, multiple: 0 }, { n: 5, idx: 1, multiple: 5 }, { n: 5, idx: 2, multiple: 10 }, { n: 5, idx: 3, multiple: 15 }, { n: 5, idx: 4, multiple: 20 } ]
    T.eq ( dba.list dba.query SQL"select * from multiples order by n;" ), [ { n: 1, multiples: '[0,1,2,3,4,5,6,7,8,9]' }, { n: 2, multiples: '[0,2,4,6,8,10,12,14,16,18]' }, { n: 3, multiples: '[0,3,6,9,12,15,18,21,24,27]' }, { n: 5, multiples: '[0,5,10,15,20]' } ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: view with UDF" ] = ( T, done ) ->
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  dba               = new Dba()
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fnsquareview', }
  dba.open { path: work_path, schema, }
  numbers           = dba.all_first_values dba.query SQL"select n from nnt order by n;"
  #.........................................................................................................
  dba.create_function name: 'square', deterministic: true, varargs: false, call: ( n ) -> n ** 2
  dba.execute SQL"create view squares as select n, square( n ) as square from nnt order by n;"
  matcher = [ 0, 1, 2.25, 4, 5.289999999999999, 9, 9.610000000000001, 16, 25, 36, 49, 64, 81, 100, 121, 144 ]
  result  = dba.list dba.query SQL"select * from squares;"
  console.table result
  result  = ( row.square for row in result )
  debug '^984^', result
  T.eq result, matcher
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: typing" ] = ( T, done ) ->
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  dba               = new Dba()
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'small', ref: 'typing', }
  dba.open { path: work_path, schema, }
  #.........................................................................................................
  ### In 'simple' cases, there's meaningful type information present: ###
  statement = dba.sqlt.prepare SQL"select stamped as d from main;"
  iterator  = statement.iterate []
  [ iterator..., ] ### NOTE: consume iterator to free connection ###
  d         = ( [ d.name, d.type, ] for d in statement.columns() )
  T.eq d, [ [ 'd', 'boolean' ] ]
  #.........................................................................................................
  ### But as soon as any operation is done on data: that typing information vanishes: ###
  statement = dba.sqlt.prepare SQL"select ( stamped and not stamped ) as d from main;"
  iterator  = statement.iterate []
  [ iterator..., ] ### NOTE: consume iterator to free connection ###
  d         = ( [ d.name, d.type, ] for d in statement.columns() )
  T.eq d, [ [ 'd', null ] ]
  #.........................................................................................................
  ### We can even explicitly cast results but that does not bring back typing: ###
  statement = dba.sqlt.prepare SQL"select cast( stamped and not stamped as boolean ) as d from main;"
  iterator  = statement.iterate []
  [ iterator..., ] ### NOTE: consume iterator to free connection ###
  d         = ( [ d.name, d.type, ] for d in statement.columns() )
  T.eq d, [ [ 'd', null ] ]
  #.........................................................................................................
  ### We can enforce better type checking in SQLite by using `check` constraints and UDFs: ###
  as_boolean = ( d ) -> if d then 1 else 0
  dba.create_function name: 'validate_integer', call: ( n ) ->
    debug '^534^', "validating #{rpr n}"
    return as_boolean types.isa.integer n
  dba.execute SQL"create table x( n integer, check ( validate_integer( n ) ) );"
  dba.execute SQL"insert into x ( n ) values ( 42 );"; T.ok true
  try dba.execute SQL"insert into x ( n ) values ( 1.23 );" catch error then T.ok error.message is "CHECK constraint failed: validate_integer( n )"
  try dba.execute SQL"insert into x ( n ) values ( 'foobar' );" catch error then T.ok error.message is "CHECK constraint failed: validate_integer( n )"
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: virtual tables" ] = ( T, done ) ->
  ### new in 7.4.0, see https://github.com/JoshuaWise/better-sqlite3/issues/581 ###
  # T.halt_on_error()
  { Dba }           = require H.icql_dba_path
  FS                = require 'fs'
  #.........................................................................................................
  dba               = new Dba()
  # schema            = 'csv'
  # schema_i          = dba.sql.I schema
  transform         = null
  is_first          = true
  #.........................................................................................................
  cfg =
    columns: [ 'path', 'data', ],
    rows: ->
      for filename in FS.readdirSync __dirname
        path  = PATH.resolve PATH.join __dirname, filename
        data  = ( FS.readFileSync path, { encoding: 'utf-8', } ).trim()[ .. 50 ]
        yield { path, data }
      return null
  dba.sqlt.table "files", cfg
  matcher = dba.list dba.query "select * from files order by data;"
  console.table matcher
  #.........................................................................................................
  cfg =
    columns: [ 'match', 'capture', ]
    parameters: [ 'pattern', 'text', ]
    rows: ( pattern, text ) ->
      regex = new RegExp pattern, 'g'
      while ( match = regex.exec text )?
        yield [ match[ 0 ], match[ 1 ], ]
      return null
  dba.sqlt.table 're_matches', cfg
  sql     = "select pattern, text, match, capture from re_matches( ?, ? ) order by 1, 2, 3, 4;"
  matcher = dba.list dba.query sql, [ '€([-,.0-9]+)', "between €30,-- and €40,--", ]
  console.table matcher
  #.........................................................................................................
  cfg = ( filename, P... ) ->
    urge '^46456^', { filename, P, }
    columns: [ 'path', 'lnr', 'line', ],
    rows: ->
      path  = PATH.resolve PATH.join __dirname, '../../../assets/icql', filename
      lines = ( FS.readFileSync path, { encoding: 'utf-8', } ).split '\n'
      for line, line_idx in lines
        yield { path, lnr: line_idx + 1, line, }
      return null
  dba.sqlt.table 'file_contents', cfg
  dba.execute "create virtual table contents_of_wbftsv using file_contents( ncrglyphwbf.tsv, any stuff goes here, and more here );"
  sql     = "select * from contents_of_wbftsv order by 1, 2, 3;"
  matcher = dba.list dba.query sql
  console.table matcher
  #.........................................................................................................
  cfg =
    columns: [ 'n', ]
    parameters: [ 'start', 'stop', 'step', ]
    rows: ( start, stop, step = null ) ->
      # stop ?= start
      step ?= 1
      n     = start
      loop
        break if n > stop
        # if n %% 2 is 0 then yield [ "*#{n}*", ]
        # else                yield [ n, ]
        yield [ n, ]
        n += step
      return null
  dba.sqlt.table 'generate_series', cfg
  console.table dba.list dba.query "select * from generate_series( ?, ? )", [ 1, 5, ]
  console.table dba.list dba.query "select * from generate_series( ?, ?, ? )", [ 1, 10, 2, ]
  console.table dba.list dba.query "select * from generate_series( ?, ?, ? ) limit 10;", [ 500, Infinity, 1234, ]
  #.........................................................................................................
  cfg =
    columns: [ 'path', 'vnr', 'line', 'vnr_h', ]
    parameters: [ '_path', ]
    rows: ( path ) ->
      readlines = new ( require 'n-readlines' ) path
      lnr       = 0
      while ( bytes = readlines.next() ) isnt false
        lnr++
        vnr       = [ lnr, ]
        vnr_json  = JSON.stringify vnr
        line      = bytes.toString 'utf-8'
        vnr_h     = dba.as_hollerith vnr
        yield [ path, vnr_json, line, vnr_h, ]
      return null
  dba.sqlt.table 'readlines', cfg
  path = H.get_cfg().tsv.micro
  urge "^44558^ reading from #{path}"
  dba.execute "create table foolines ( path text, vnr json, line text, vnr_h bytea );"
  # dba.execute "insert into foolines select * from readlines( ? );", [ path, ]
  dba.execute "insert into foolines select * from readlines( #{dba.sql.L path} );"
  # console.table dba.list dba.query "select * from readlines( ? ) order by vnr_h;", [ path, ]
  console.table dba.list dba.query "select * from foolines;"
  #.........................................................................................................
  export_path       = H.nonexistant_path_from_ref 'export-virtual-tables'
  schema            = 'main'
  dba.export { schema, path: export_path, }
  urge "^35345^ schema #{rpr schema} exported to #{export_path}"
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: concurrent UDFs" ] = ( T, done ) ->
  ###
  See
    * https://github.com/JoshuaWise/better-sqlite3/issues/338
    * https://github.com/JoshuaWise/better-sqlite3/pull/367
    * https://github.com/JoshuaWise/better-sqlite3/issues/203
    * https://github.com/JoshuaWise/better-sqlite3/issues/368
    * https://github.com/JoshuaWise/better-sqlite3/pull/371

      > I'm not sure if any of the use-cases that had been discussed actually require
      > SQLITE_DBCONFIG_DEFENSIVE to be disabled? That might cross the border of what is sensible. I think
      > all we need was to allow behavior that SQLIte3 considers undefined but I don't think that means you
      > can corrupt the database.
      >
      > Unfortunately unsafeMode does not solve #338, which I believe is even allowed by SQLite3 and not
      > even considered undefined behavior. What I had in mind with this PR was to disable the checks that
      > better-sqlite3 puts in place that might not even be needed by SQLite3 itself.
      >
      > This is a stupid example, but you get the gist. I cannot execute queries inside user-defined
      > functions even though everything is even read-only and cannot possibly cause damage. Sure currently
      > better-sqlite3 currently catches things like endless recursions this way, but that's the kind of
      > responsibility I'm willing to take when going into unsafeMode.

    * https://github.com/JoshuaWise/better-sqlite3/issues/483

      > The string passed to the Database constructor is passed directly to the underlying SQLite3 library.
      > The reason you can't use file: is because the default build configuration bundled in better-sqlite3
      > uses the SQLITE_USE_URI=0 option. You can get around this by supplying your own build configuration
      > instead.

  From v7.1.0 on ICQL/DBA uses a recent algamation from https://sqlite.com/download.html with
  `SQLITE_USE_URI` set to `1` so concurrent UDFs are possible.

  ###
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'small', ref: 'typing', }
  #.........................................................................................................
  f1 = =>
    error             = null
    dba               = new Dba()
    dba.open { path: work_path, schema, }
    dba.create_function name: 'udf', call: -> [ ( dba.query SQL"select 42 as x;" )..., ][ 0 ].x
    try
      dba.with_unsafe_mode -> console.table dba.list dba.query SQL"select udf();"
      console.table dba.list dba.query SQL"select udf();"
    catch error
      if error.message is 'This database connection is busy executing a query'
        T?.ok true
      else
        throw error
    unless error?
      T?.fail "expected an error, but none was thrown; this could mean that better-sqlite3 has been updated to accept queries in UDFs using the same connection"
    return null
  #.........................................................................................................
  f2 = =>
    new_sqlt          = require '../../../apps/icql-dba/node_modules/better-sqlite3'
    sqlt1             = new_sqlt work_path
    sqlt2             = new_sqlt work_path
    urge '^4453^', { work_path, }
    sqlt1.function 'udf', ->
      s = sqlt2.prepare SQL"select 42 as x;"
      return [ s.iterate()..., ][ 0 ].x
    statement         = sqlt1.prepare SQL"select udf();"
    result            = [ statement.iterate()..., ]
    T.eq result, [ { 'udf()': 42 } ]
    return null
  #.........................................................................................................
  f3 = =>
    Db                = require '../../../apps/icql-dba/node_modules/better-sqlite3'
    path              = 'file:memdb1?mode=memory&cache=shared'
    sqlt1             = new Db path
    sqlt2             = new Db path
    urge '^4453^', { path, }
    sqlt1.function 'udf', ->
      s = sqlt2.prepare SQL"select 42 as x;"
      return [ s.iterate()..., ][ 0 ].x
    statement         = sqlt1.prepare SQL"select udf();"
    result            = [ statement.iterate()..., ]
    T.eq result, [ { 'udf()': 42 } ]
    return null
  #.........................................................................................................
  f4 = =>
    path              = 'file:memdb1?mode=memory&cache=shared'
    dba               = new Dba(); dba.open { path, schema, }
    dba2              = new Dba(); dba2.open { path, schema, }
    urge '^4453^', { path, }
    dba.create_function name: 'udf', call: ->
      R = dba2.query SQL"select 42 as x;"
      return [ R..., ][ 0 ].x
    result            = dba.list dba.query SQL"select udf();"
    T.eq result, [ { 'udf()': 42 } ]
    return null
  #.........................................................................................................
  f1()
  f2()
  f3()
  f4()
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: with_transaction() 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  #.........................................................................................................
  do =>
    dba = new Dba()
    T?.throws /not a valid function/, -> dba.with_transaction()
  #.........................................................................................................
  do =>
    dba   = new Dba()
    # dba.open { schema: 'main', }
    create_table = ( cfg ) ->
      debug '^435^', { cfg, }
      dba.with_transaction ->
        help '^70^', "creating a table with", cfg
        dba.execute SQL"create table foo ( bar integer );"
        throw new Error "oops" if cfg.throw_error
    #.......................................................................................................
    error = null
    try create_table { throw_error: true, } catch error
      T?.ok error.message is "oops"
      T?.eq ( dba.list dba.query "select * from sqlite_schema;" ), []
    T.fail "expected error but none was thrown" unless error?
    #.......................................................................................................
    create_table { throw_error: false, }
    T?.eq ( dba.all_first_values dba.query "select name from sqlite_schema;" ), [ 'foo', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: with_transaction() 2" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  #.........................................................................................................
  do =>
    dba = new Dba()
    T?.throws /not a valid function/, -> dba.with_transaction()
  #.........................................................................................................
  do =>
    error = null
    dba   = new Dba()
    try
      dba.with_transaction ->
        help '^70^', "creating a table"
        dba.execute SQL"create table foo ( bar integer );"
        throw new Error "oops"
    catch error
      warn error.message
      T?.ok error.message is "oops"
    T.fail "expected error but none was thrown" unless error?
    T?.eq ( dba.list dba.query "select * from sqlite_schema;" ), []
    #.......................................................................................................
    dba.with_transaction ->
      help '^70^', "creating a table"
      dba.execute SQL"create table foo ( bar integer );"
    #.......................................................................................................
    T?.eq ( dba.all_first_values dba.query SQL"select name from sqlite_schema;" ), [ 'foo', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: with_unsafe_mode()" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  #.........................................................................................................
  do =>
    dba = new Dba()
    T?.throws /not a valid function/, -> dba.with_unsafe_mode()
  #.........................................................................................................
  do =>
    error = null
    dba   = new Dba()
    # dba.open { schema: 'main', }
    dba.execute SQL"create table foo ( n integer, is_new boolean default false );"
    for n in [ 10 .. 19 ]
      dba.run SQL"insert into foo ( n ) values ( $n );", { n, }
    dba.with_unsafe_mode ->
      for row from dba.query SQL"select * from foo where not is_new;"
        dba.run SQL"insert into foo ( n, is_new ) values ( $n, $is_new );", { n: row.n * 3, is_new: 1, }
      dba.execute SQL"update foo set is_new = false where is_new;"
    #.......................................................................................................
    console.table rows = dba.list dba.query SQL"select * from foo order by n;"
    result = ( d.n for d in rows )
    T?.eq result, [ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57 ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: with_foreign_keys_deferred(), preliminaries" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  list_table_a      = ( dba ) -> ( row.n for row from dba.query SQL"select n from a;" )
  list_table_b      = ( dba ) -> ( row.n for row from dba.query SQL"select n from b;" )
  #---------------------------------------------------------------------------------------------------------
  do =>
    urge '^50-1^', "begin transaction, then defer fks"
    dba               = new Dba()
    { sqlt, }         = dba
    dba.execute SQL"""
      create table a ( n integer not null primary key references b ( n ) );
      create table b ( n integer not null primary key references a ( n ) );
      """
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-2^', sqlt.inTransaction;                   T?.eq sqlt.inTransaction, false
    info '^50-3^', dba.get_foreign_keys_state();        T?.eq dba.get_foreign_keys_state(), true
    info '^50-4^', sqlt.pragma SQL"defer_foreign_keys;"; T?.eq ( sqlt.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
    #.......................................................................................................
    ### begin transaction, then  start deferred fks ###
    debug '^50-5^'; dba.execute SQL"begin transaction;"
    debug '^50-6^'; sqlt.pragma SQL"defer_foreign_keys=1;"
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-7^', sqlt.inTransaction;                   T?.eq sqlt.inTransaction, true
    info '^50-8^', dba.get_foreign_keys_state();        T?.eq dba.get_foreign_keys_state(), true
    info '^50-9^', sqlt.pragma SQL"defer_foreign_keys;"; T?.eq ( sqlt.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 1 } ]
    #.......................................................................................................
    ### insert partly bogus values, check ###
    debug '^50-10^'; dba.execute SQL"insert into a ( n ) values ( 1 );"
    debug '^50-11^'; dba.execute SQL"insert into b ( n ) values ( 1 );"
    debug '^50-12^'; dba.execute SQL"insert into a ( n ) values ( 2 );"
    # debug '^50-13^'; dba.execute SQL"insert into b ( n ) values ( 2 );"
    error = null
    debug '^50-14^', list_table_a dba; T?.eq ( list_table_a dba ), [ 1, 2, ]
    debug '^50-15^', list_table_b dba; T?.eq ( list_table_b dba ), [ 1, ]
    #.......................................................................................................
    ### try to commit, rollback on error ###
    try
      debug '^50-16^'; dba.execute SQL"commit;"
    catch error
      debug '^50-17^', sqlt.inTransaction; T?.eq sqlt.inTransaction, true
      warn error.message
      T?.eq error.message, "FOREIGN KEY constraint failed"
      debug '^50-18^'; dba.execute SQL"rollback;"
      debug '^50-19^', sqlt.inTransaction; T?.eq sqlt.inTransaction, false
    finally
      debug '^50-20^', sqlt.inTransaction; T?.eq sqlt.inTransaction, false
    #.......................................................................................................
    ### Ensure error happened, tables empty as before ###
    T.fail '^50-21^', "expected error, got none" unless error?
    debug '^50-22^', list_table_a dba; T?.eq ( list_table_a dba ), []
    debug '^50-23^', list_table_b dba; T?.eq ( list_table_b dba ), []
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-24^', sqlt.inTransaction;                   T?.eq sqlt.inTransaction, false
    info '^50-25^', dba.get_foreign_keys_state();        T?.eq dba.get_foreign_keys_state(), true
    info '^50-26^', sqlt.pragma SQL"defer_foreign_keys;"; T?.eq ( sqlt.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
  #---------------------------------------------------------------------------------------------------------
  do =>
    urge '^50-27^', "defer fks, then begin transaction"
    dba               = new Dba()
    { sqlt, }         = dba
    dba.execute SQL"""
      create table a ( n integer not null primary key references b ( n ) );
      create table b ( n integer not null primary key references a ( n ) );
      """
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-28^', sqlt.inTransaction;                   T?.eq sqlt.inTransaction, false
    info '^50-29^', dba.get_foreign_keys_state();        T?.eq dba.get_foreign_keys_state(), true
    info '^50-30^', sqlt.pragma SQL"defer_foreign_keys;"; T?.eq ( sqlt.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
    #.......................................................................................................
    ### begin transaction, then  start deferred fks ###
    debug '^50-31^'; sqlt.pragma SQL"defer_foreign_keys=1;"
    debug '^50-32^'; dba.execute SQL"begin transaction;"
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-33^', sqlt.inTransaction;                   T?.eq sqlt.inTransaction, true
    info '^50-34^', dba.get_foreign_keys_state();        T?.eq dba.get_foreign_keys_state(), true
    info '^50-35^', sqlt.pragma SQL"defer_foreign_keys;"; T?.eq ( sqlt.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 1 } ]
    #.......................................................................................................
    ### insert partly bogus values, check ###
    debug '^50-36^'; dba.execute SQL"insert into a ( n ) values ( 1 );"
    debug '^50-37^'; dba.execute SQL"insert into b ( n ) values ( 1 );"
    debug '^50-38^'; dba.execute SQL"insert into a ( n ) values ( 2 );"
    # debug '^50-39^'; dba.execute SQL"insert into b ( n ) values ( 2 );"
    error = null
    debug '^50-40^', list_table_a dba; T?.eq ( list_table_a dba ), [ 1, 2, ]
    debug '^50-41^', list_table_b dba; T?.eq ( list_table_b dba ), [ 1, ]
    #.......................................................................................................
    ### try to commit, rollback on error ###
    try
      debug '^50-42^'; dba.execute SQL"commit;"
    catch error
      debug '^50-43^', sqlt.inTransaction; T?.eq sqlt.inTransaction, true
      warn error.message
      T?.eq error.message, "FOREIGN KEY constraint failed"
      debug '^50-44^'; dba.execute SQL"rollback;"
      debug '^50-45^', sqlt.inTransaction; T?.eq sqlt.inTransaction, false
      # throw error ### in production, re-throw error after rollback ###
    finally
      debug '^50-46^', sqlt.inTransaction; T?.eq sqlt.inTransaction, false
    #.......................................................................................................
    ### Ensure error happened, tables empty as before ###
    T.fail '^50-47^', "expected error, got none" unless error?
    debug '^50-48^', list_table_a dba; T?.eq ( list_table_a dba ), []
    debug '^50-49^', list_table_b dba; T?.eq ( list_table_b dba ), []
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-50^', sqlt.inTransaction;                   T?.eq sqlt.inTransaction, false
    info '^50-51^', dba.get_foreign_keys_state();        T?.eq dba.get_foreign_keys_state(), true
    info '^50-52^', sqlt.pragma SQL"defer_foreign_keys;"; T?.eq ( sqlt.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: with_foreign_keys_deferred(), ensure checks" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  #.........................................................................................................
  list_table_a      = ( dba ) -> ( row.n for row from dba.query SQL"select n from a;" )
  #.........................................................................................................
  error             = null
  dba               = new Dba()
  # dba.open { schema: 'main', }
  dba.execute SQL"""
    create table a ( n integer not null primary key references b ( n ) );
    create table b ( n integer not null primary key references a ( n ) );
    """
  #.........................................................................................................
  T?.eq CND.truth dba.sqlt.inTransaction, false
  T?.eq dba.get_foreign_keys_state(), true
  dba.with_foreign_keys_deferred ->
    T?.eq CND.truth dba.sqlt.inTransaction, true
    T?.eq dba.get_foreign_keys_state(), true
    dba.execute SQL"insert into a ( n ) values ( 1 );"
    dba.execute SQL"insert into a ( n ) values ( 2 );"
    dba.execute SQL"insert into a ( n ) values ( 3 );"
    dba.execute SQL"insert into b ( n ) values ( 1 );"
    dba.execute SQL"insert into b ( n ) values ( 2 );"
    dba.execute SQL"insert into b ( n ) values ( 3 );"
    # dba.execute SQL"insert into a ( n ) values ( 4 );"
    console.table dba.list dba.query SQL"select * from a;"
    console.table dba.list dba.query SQL"select * from b;"
  T?.eq CND.truth dba.sqlt.inTransaction, false
  #.........................................................................................................
  T?.eq dba.get_foreign_keys_state(), true
  T?.eq ( dba.pragma SQL"foreign_key_check;" ), []
  T?.eq ( dba.pragma SQL"integrity_check;"   ), [ { integrity_check: 'ok' } ]
  #.........................................................................................................
  debug '^778-1^', ( prv_values = list_table_a dba )
  T?.eq ( nxt_values = list_table_a dba ), prv_values; prv_values = nxt_values
  debug '^778-2^'
  T?.eq dba.sqlt.inTransaction, false
  try
    dba.with_foreign_keys_deferred ->
      T?.eq dba.sqlt.inTransaction, true
      dba.execute SQL"insert into a ( n ) values ( 101 );"
  catch error
    warn error.message
    T?.eq error.message, "FOREIGN KEY constraint failed"
  T?.eq dba.sqlt.inTransaction, false
  debug '^778-4^', list_table_a dba
  T?.eq ( nxt_values = list_table_a dba ), prv_values; prv_values = nxt_values
  #.........................................................................................................
  debug '^778-5^'
  try
    dba.with_transaction ->
      dba.with_foreign_keys_deferred ->
        dba.execute SQL"insert into a ( n ) values ( 102 );"
  catch error
    warn error.message
    T?.eq error.message, "^dba-functions@901^ (Dba_no_deferred_fks_in_tx) cannot defer foreign keys inside a transaction"
  debug '^778-6^', list_table_a dba
  T?.eq ( nxt_values = list_table_a dba ), prv_values; prv_values = nxt_values
  #.........................................................................................................
  debug '^778-7^'
  try
    dba.with_foreign_keys_deferred ->
      dba.with_transaction ->
        dba.execute SQL"insert into a ( n ) values ( 103 );"
  catch error
    warn error.message
    T?.eq error.message, "^dba-functions@901^ (Dba_no_nested_transactions) cannot start a transaction within a transaction"
  debug '^778-8^', list_table_a dba
  T?.eq ( nxt_values = list_table_a dba ), prv_values; prv_values = nxt_values
  #.........................................................................................................
  T?.eq ( dba.pragma SQL"foreign_key_check;" ), []
  T?.eq ( dba.pragma SQL"integrity_check;"   ), [ { integrity_check: 'ok' } ]
  #.........................................................................................................
  console.table rows = dba.list dba.query SQL"""
    select
        a.n as a_n,
        b.n as b_n
      from a
      left join b using ( n )
      order by n;"""
  debug '^400^', rows
  result = ( [ d.a_n, d.b_n ] for d in rows )
  T?.eq result, [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # debug f '𠖏'
  # test @[ "DBA: concurrent UDFs" ]
  # test @[ "DBA: create_with_unsafe_mode()" ]
  # @[ "DBA: with_foreign_keys_deferred(), preliminaries" ]()
  # test @[ "DBA: with_foreign_keys_deferred(), preliminaries" ]
  # test @[ "DBA: with_foreign_keys_deferred(), ensure checks" ]
  @[ "DBA: with_unsafe_mode()" ]()
  # test @[ "DBA: with_transaction() 1" ]
  # @[ "DBA: with_transaction() 2" ]()
  # test @[ "DBA: with_transaction()" ]
  # @[ "DBA: concurrent UDFs" ]()
  # debug process.env[ 'icql-dba-use' ]
  # debug process.argv
  f = ->
    debugger
    error = null
    try
      xxx
      null
    catch error then null
      # debug '^34-catch^', error?.message
      # throw error
    finally
      debug '^34-finally^'
      if error?
        debug '^34-finally-2', error.message
        throw error
    return null




