
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/UDF'
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
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse



#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/UDF window functions etc." ] = ( T, done ) ->
  # T.halt_on_error()
  { DBay }          = require H.dbay_path
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fn', }
  debug { template_path, work_path, }
  db                = new DBay { path: work_path, schema, }
  numbers           = db.all_first_values SQL"select n from nnt order by n;"
  # console.table db.list db.walk_objects { schema, }
  #.........................................................................................................
  await do =>
    ### single-valued function ###
    db.create_function name: 'square', deterministic: true, varargs: false, call: ( n ) -> n ** 2
    matcher = ( ( n * n ) for n in numbers )
    result  = db.all_rows SQL"select *, square( n ) as square from nnt order by square;"
    console.table result
    result  = ( row.square for row in result )
    T?.eq result, matcher
  #.........................................................................................................
  await do =>
    ### aggregate function ###
    db.create_aggregate_function
      name:           'product'
      start:          -> null
      step:           ( total, element ) -> debug '^4476^', { total, element, }; ( total ? 1 ) * element
      # inverse:        ( total, dropped ) -> total.pop(); total
      # result:         ( total ) -> total
    # matcher = ( ( n * n ) for n in numbers )
    #.......................................................................................................
    do =>
      result  = db.all_rows SQL"select product( n ) as product from nnt where n != 0;"
      console.table result
      matcher = [ 5122922112, ]
      result  = ( row.product for row in result )
      T?.eq result, matcher
    #.......................................................................................................
    do =>
      result  = db.all_rows SQL"select product( n ) as product from nnt where n > 100;"
      console.table result
      matcher = [ null, ]
      result  = ( row.product for row in result )
      T?.eq result, matcher
    #.......................................................................................................
    do =>
      try
        db.query SQL"select product( n ) over () as product from nnt;"
      catch error
        T?.eq error.code, 'SQLITE_ERROR'
        T?.eq error.name, 'SqliteError'
        T?.eq error.message, 'product() may not be used as a window function'
      unless error?
        T.fail "expected error"
      # console.table result
      # matcher = [ null, ]
      # result  = ( row.product for row in result )
      # T?.eq result, matcher
  #.........................................................................................................
  await do =>
    ### window function ###
    db.create_window_function
      name:           'array_agg'
      varargs:        false
      deterministic:  true
      start:          -> [] # must be new object for each partition, therefore use function, not constant
      step:           ( total, element ) -> total.push element; total
      inverse:        ( total, dropped ) -> total.pop(); total
      result:         ( total ) -> jr total
    #.......................................................................................................
    do =>
      result  = db.all_rows SQL"select array_agg( t ) as names from nnt;"
      console.table result
      matcher = [ '["naught","one","one point five","two","two point three","three","three point one","four","five","six","seven","eight","nine","ten","eleven","twelve"]' ]
      result  = ( row.names for row in result )
      T?.eq result, matcher
    #.......................................................................................................
    do =>
      result  = db.all_rows SQL"""
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
      T?.eq result, matcher
  #.........................................................................................................
  await do =>
    ### table-valued function ###
    db.create_table_function
      name:         're_matches'
      columns:      [ 'match', 'capture', ]
      parameters:   [ 'text', 'pattern', ]
      rows: ( text, pattern ) ->
        regex = new RegExp pattern, 'g'
        while ( match = regex.exec text )?
          yield [ match[ 0 ], match[ 1 ], ]
        return null
    await do =>
      result  = db.all_rows SQL"""
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
      T?.eq result, matcher
    await do =>
      result  = db.all_rows SQL"""
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
      T?.eq result, matcher
  #.........................................................................................................
  await do =>
    ### virtual table ###
    FS = require 'fs'
    db.create_virtual_table
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
    db.execute SQL"""
      create virtual table contents_of_wbftsv
        using file_contents( ncrglyphwbf.tsv, any stuff goes here, and more here );"""
    result  = db.all_rows SQL"select * from contents_of_wbftsv where lnr between 10 and 14 order by 1, 2, 3;"
    console.table result
    matcher = [ 'u-cjk-xa-3417\t㐗\t<1213355>', '', 'u-cjk-xa-34ab\t㒫\t<121135>', 'u-cjk-xa-342a\t㐪\t<415234>', 'u-cjk-xa-342b\t㐫\t<413452>' ]
    result  = ( row.line for row in result )
    debug '^984^', result
    T?.eq result, matcher
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/UDF User-Defined Window Function" ] = ( T, done ) ->
  ### see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md ###
  # T.halt_on_error()
  { DBay }          = require H.dbay_path
  schema            = 'main'
  db                = new DBay()
  # db.load_extension PATH.resolve PATH.join __dirname, '../../../assets/sqlite-extensions/json1.so'
  # db.sqlt.unsafeMode true
  { I, L, V, }      = db.sql
  #.........................................................................................................
  db.create_window_function
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
    db.execute SQL"""
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
      db SQL"""insert into multiples ( n, multiples ) values ( $n, $multiples )""", { n, multiples, }
    db SQL"insert into multiples ( n, multiples ) values ( 5, '[0,5,10,15,20]' );"
    #.......................................................................................................
    console.table db.all_rows SQL"select * from multiples_idx;"
    console.table db.all_rows SQL"select * from multiples;"
    T?.eq ( db.all_rows SQL"select * from multiples_idx order by n, idx;" ), [ { n: 1, idx: 0, multiple: 0 }, { n: 1, idx: 1, multiple: 1 }, { n: 1, idx: 2, multiple: 2 }, { n: 1, idx: 3, multiple: 3 }, { n: 1, idx: 4, multiple: 4 }, { n: 1, idx: 5, multiple: 5 }, { n: 1, idx: 6, multiple: 6 }, { n: 1, idx: 7, multiple: 7 }, { n: 1, idx: 8, multiple: 8 }, { n: 1, idx: 9, multiple: 9 }, { n: 2, idx: 0, multiple: 0 }, { n: 2, idx: 1, multiple: 2 }, { n: 2, idx: 2, multiple: 4 }, { n: 2, idx: 3, multiple: 6 }, { n: 2, idx: 4, multiple: 8 }, { n: 2, idx: 5, multiple: 10 }, { n: 2, idx: 6, multiple: 12 }, { n: 2, idx: 7, multiple: 14 }, { n: 2, idx: 8, multiple: 16 }, { n: 2, idx: 9, multiple: 18 }, { n: 3, idx: 0, multiple: 0 }, { n: 3, idx: 1, multiple: 3 }, { n: 3, idx: 2, multiple: 6 }, { n: 3, idx: 3, multiple: 9 }, { n: 3, idx: 4, multiple: 12 }, { n: 3, idx: 5, multiple: 15 }, { n: 3, idx: 6, multiple: 18 }, { n: 3, idx: 7, multiple: 21 }, { n: 3, idx: 8, multiple: 24 }, { n: 3, idx: 9, multiple: 27 }, { n: 5, idx: 0, multiple: 0 }, { n: 5, idx: 1, multiple: 5 }, { n: 5, idx: 2, multiple: 10 }, { n: 5, idx: 3, multiple: 15 }, { n: 5, idx: 4, multiple: 20 } ]
    T?.eq ( db.all_rows SQL"select * from multiples order by n;" ), [ { n: 1, multiples: '[0,1,2,3,4,5,6,7,8,9]' }, { n: 2, multiples: '[0,2,4,6,8,10,12,14,16,18]' }, { n: 3, multiples: '[0,3,6,9,12,15,18,21,24,27]' }, { n: 5, multiples: '[0,5,10,15,20]' } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/UDF view with UDF" ] = ( T, done ) ->
  # T.halt_on_error()
  { DBay }          = require H.dbay_path
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fnsquareview', }
  db                = new DBay { path: work_path, schema, }
  numbers           = db.all_first_values SQL"select n from nnt order by n;"
  #.........................................................................................................
  db.create_function name: 'square', deterministic: true, varargs: false, call: ( n ) -> n ** 2
  db.execute SQL"create view squares as select n, square( n ) as square from nnt order by n;"
  matcher = [ 0, 1, 2.25, 4, 5.289999999999999, 9, 9.610000000000001, 16, 25, 36, 49, 64, 81, 100, 121, 144 ]
  result  = db.all_rows SQL"select * from squares;"
  console.table result
  result  = ( row.square for row in result )
  debug '^984^', result
  T?.eq result, matcher
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/UDF typing" ] = ( T, done ) ->
  # T.halt_on_error()
  { DBay }          = require H.dbay_path
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'small', ref: 'typing', }
  db                = new DBay { path: work_path, schema, }
  #.........................................................................................................
  ### In 'simple' cases, there's meaningful type information present: ###
  statement = db.prepare SQL"select stamped as d from main;"
  iterator  = statement.iterate []
  [ iterator..., ] ### NOTE: consume iterator to free connection ###
  d         = ( [ d.name, d.type, ] for d in statement.columns() )
  T?.eq d, [ [ 'd', 'boolean' ] ]
  #.........................................................................................................
  ### But as soon as any operation is done on data: that typing information vanishes: ###
  statement = db.prepare SQL"select ( stamped and not stamped ) as d from main;"
  iterator  = statement.iterate []
  [ iterator..., ] ### NOTE: consume iterator to free connection ###
  d         = ( [ d.name, d.type, ] for d in statement.columns() )
  T?.eq d, [ [ 'd', null ] ]
  #.........................................................................................................
  ### We can even explicitly cast results but that does not bring back typing: ###
  statement = db.prepare SQL"select cast( stamped and not stamped as boolean ) as d from main;"
  iterator  = statement.iterate []
  [ iterator..., ] ### NOTE: consume iterator to free connection ###
  d         = ( [ d.name, d.type, ] for d in statement.columns() )
  T?.eq d, [ [ 'd', null ] ]
  #.........................................................................................................
  ### We can enforce better type checking in SQLite by using `check` constraints and UDFs: ###
  as_boolean = ( d ) -> if d then 1 else 0
  db.create_function name: 'validate_integer', call: ( n ) ->
    debug '^534^', "validating #{rpr n}"
    return as_boolean types.isa.integer n
  db.execute SQL"create table x( n integer, check ( validate_integer( n ) ) );"
  db.execute SQL"insert into x ( n ) values ( 42 );"; T?.ok true
  try db.execute SQL"insert into x ( n ) values ( 1.23 );" catch error then T?.ok error.message is "CHECK constraint failed: validate_integer( n )"
  try db.execute SQL"insert into x ( n ) values ( 'foobar' );" catch error then T?.ok error.message is "CHECK constraint failed: validate_integer( n )"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/UDF concurrent UDFs 2" ] = ( T, done ) ->
  prefix            = 'dcat_'
  schema            = 'main'
  { DBay }          = require H.dbay_path
  { template_path
    work_path }     = await H.procure_db { size: 'small', ref: 'fnc', }
  debug { template_path, work_path, }
  db                = new DBay { path: work_path, }
  # db2              = new DBay(); db2.open  { schema, path: work_path, }
  #.........................................................................................................
  select_sql        = SQL"""
    select
        #{db.sql.L schema} as schema,
        type,
        name,
        tbl_name,
        rootpage
      from sqlite_schema
      order by rootpage;"""
  #.........................................................................................................
  db.create_table_function
    name:           prefix + 'reltrigs'
    columns:        [ 'schema', 'type', 'name', 'tbl_name', 'rootpage', ]
    parameters:     []
    varargs:        false
    deterministic:  false
    rows:           -> yield from db.query select_sql
  #.........................................................................................................
  show_db_objects = ->
    console.table db.all_rows SQL"""
      select
          'main' as schema,
          type,
          name,
          tbl_name,
          rootpage
        from sqlite_schema
        order by rootpage;"""
  #.........................................................................................................
  count = 0
  for row1 from db.query SQL"select * from sqlite_schema where type in ( 'table', 'view' );"
    for row2 from db.query SQL"select * from pragma_table_info( $name )", { name: row1.name, }
      count++
      break if count > 5
      info '^875-1^', row2
  #.........................................................................................................
  count = 0
  db.with_unsafe_mode ->
    for row1 from db.query SQL"select * from sqlite_schema where type in ( 'table', 'view' );"
      for row2 from db.query SQL"select * from pragma_table_info( $name )", { name: row1.name, }
        count++
        break if count > 5
        info '^875-1^', row2
        db.execute "create table if not exists foo ( n text );"
  #.........................................................................................................
  try
    for row from db.query SQL"select * from dcat_reltrigs;"
      info '^875-2^', row
  catch error
    warn CND.reverse '^875-3^', error.message
    T?.eq error.message, "This database connection is busy executing a query"
  #.........................................................................................................
  try
    db.with_unsafe_mode ->
      for row from db.query SQL"select * from dcat_reltrigs;"
        info '^875-4^', row
  catch error
    warn CND.reverse '^875-5^', error.message
    T?.eq error.message, "This database connection is busy executing a query"
  #.........................................................................................................
  show_db_objects()
  done?()


############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }
  # test @[ "DBAY/UDF window functions etc." ]
  # test @[ "DBAY/UDF User-Defined Window Function" ]
  # test @[ "DBAY/UDF view with UDF" ]
  # test @[ "DBAY/UDF typing" ]
  # test @[ "DBAY/UDF concurrent UDFs 2" ]



