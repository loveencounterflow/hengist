
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/FUTURE'
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
DATA                      = require '../../../lib/data-providers-nocache'
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
@[ "DBA: VNRs" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  matcher           = null
  #.........................................................................................................
  whisper '-'.repeat 108
  schema            = 'v'
  dba               = new Dba()
  dba._attach { schema, ram: true, }
  #.........................................................................................................
  ### TAINT by using a generated column with a UDF we are also forced to convert the VNR to JSON and
  then parse that value vefore Hollerith-encoding the value: ###
  dba.create_function
    name:           'hollerith_encode',
    deterministic:  true,
    varargs:        false,
    call:           ( vnr_json ) ->
      debug '^3338^', rpr vnr_json
      return dba.as_hollerith JSON.parse vnr_json
  #.........................................................................................................
  dba.create_function
    name:           'hollerith_classic',
    deterministic:  true,
    varargs:        false,
    call:           ( vnr_json ) ->
      vnr = JSON.parse vnr_json
      vnr.push 0 while vnr.length < 5
      debug '^3338^', rpr vnr
      return dba.as_hollerith vnr
  #.........................................................................................................
  hollerith_tng = ( vnr ) ->
    sign_delta  = 0x80000000  ### used to lift negative numbers to non-negative ###
    u32_width   = 4           ### bytes per element ###
    vnr_width   = 5           ### maximum elements in VNR vector ###
    nr_min      = -0x80000000 ### smallest possible VNR element ###
    nr_max      = +0x7fffffff ### largest possible VNR element ###
    unless 0 < vnr.length <= vnr_width
      throw new Error "^44798^ expected VNR to be between 1 and #{vnr_width} elements long, got length #{vnr.length}"
    R           = Buffer.alloc vnr_width * u32_width, 0x00
    offset      = -u32_width
    for idx in [ 0 ... vnr_width ]
      R.writeUInt32BE ( vnr[ idx ] ? 0 ) + sign_delta, ( offset += u32_width )
    return R
  #.........................................................................................................
  bcd = ( vnr ) ->
    vnr_width   = 5           ### maximum elements in VNR vector ###
    dpe         = 4           ### digits per element ###
    base        = 36
    plus        = '+'
    minus       = '!'
    padder      = '.'
    R           = []
    for idx in [ 0 ... vnr_width ]
      nr    = vnr[ idx ] ? 0
      sign  = if nr >= 0 then plus else minus
      R.push sign + ( ( Math.abs nr ).toString base ).padStart dpe, padder
    R           = R.join ','
    return R
  #.........................................................................................................
  dba.create_function
    name:             'hollerith_tng'
    call:             ( vnr_json ) ->
      return hollerith_tng JSON.parse vnr_json
  dba.create_function
    name:             'bcd'
    call:             ( vnr_json ) ->
      return bcd JSON.parse vnr_json
  #.........................................................................................................
  to_hex = ( blob ) -> blob.toString 'hex'
  dba.create_function name: 'to_hex', deterministic: true, varargs: false, call: to_hex
  #.........................................................................................................
  dba.execute SQL"""
    create table v.main (
        nr                int   unique not null,
        vnr               json  unique not null,
        vnr_hollerith_tng blob  generated always as ( hollerith_tng(  vnr ) ) stored,
        vnr_bcd           blob  generated always as ( bcd(            vnr ) ) stored,
      primary key ( nr ) );"""
  #.........................................................................................................
  dba.execute SQL"""create unique index v.main_vnr_hollerith_tng on main ( hollerith_tng( vnr ) );"""
  dba.execute SQL"""create unique index v.main_vnr_bcd on main ( bcd( vnr ) );"""
  use_probe = 2
  #.........................................................................................................
  do =>
    switch use_probe
      when 1
        vnrs = [
          [ -8, ]
          [ -7, ]
          [ -6, ]
          [ -5, ]
          [ -4, ]
          [ -3, ]
          [ -2, ]
          [ -1, ]
          [ 0, ]
          [ 1, ]
          [ 2, ]
          [ 3, ]
          [ 4, ]
          [ 5, ]
          [ 6, ]
          [ 7, ]
          ]
    #.........................................................................................................
      when 2
        vnrs = [
          [ 0, -1, ]
          # []
          [ 0, ]
          [ 0, 1, -1 ]
          [ 0, 1, ]
          [ 0, 1, 1 ]
          [ 1, -1, -1, ]
          [ 1, -1, 0, ]
          # [ 1, -1, ]
          [ 1, 0, -1, ]
          [ 1, ]
          # [ 1, 0, ]
          [ 2, ]
          [ 3, 5, 8, -1, ]
          # [ 3, 5, 8, 0, -11, -1, ]
          [ 3, 5, 8, 0, -11, ]
          [ 3, 5, 8, ]
          [ 10003, 10005, 10008, ]
          ]
    vnrs  = ( [ idx + 1, vnr ] for vnr, idx in vnrs )
    vnrs  = CND.shuffle vnrs
    for [ nr, vnr, ] in vnrs
      vnr_json  = JSON.stringify vnr
      values    = [ nr, vnr_json, ]
      try
        dba.run SQL"insert into v.main ( nr, vnr ) values ( ?, ? )", values
      catch error
        warn "when trying to insert values #{rpr values}, an error occurred: #{error.message}"
        throw error
  #.........................................................................................................
  # matcher = dba.list dba.query """select * from v.main order by hollerith_tng( vnr );"""
  # console.table dba.list dba.query """explain query plan select * from v.main order by vnr_bcd;"""
  # console.table dba.list dba.query """explain query plan select * from v.main order by bcd( vnr );"""
  # console.table dba.list dba.query """explain query plan select * from v.main order by hollerith_tng( vnr );"""
  SQL = ( parts, expressions... ) ->
    # debug '^345^', parts
    # debug '^345^', parts.raw
    # debug '^345^', expressions
    R = parts[ 0 ]
    for expression, idx in expressions
      R += expression.toUpperCase() + parts[ idx + 1 ]
    # debug '^334^', rpr R
    return R
  name = 'world'
  debug '^23423^', SQL"select 'helo #{name}!!'"
  debug '^23423^', String.raw"select 'helo #{name}!!'"
  SQL = String.raw
  sql = SQL"""select nr, vnr, to_hex( hollerith_tng( vnr ) ) as hollerith_tng_hex, vnr_bcd from v.main order by $order_by$;"""
  help '^345^', SQL"order by hollerith_tng( vnr )"; console.table dba.list dba.query sql.replace '$order_by$', 'hollerith_tng( vnr )'
  help '^345^', SQL"order by bcd( vnr )";           console.table dba.list dba.query sql.replace '$order_by$', 'bcd( vnr )'
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@_demo_csv_parser = -> new Promise ( resolve ) =>
  { Dba }     = require H.icql_dba_path
  dba         = new Dba()
  #.........................................................................................................
  csv         = require 'csv-parser'
  fs          = require 'fs'
  tcfg        = H.get_cfg()
  import_path = tcfg.tsv.micro
  rows        = [];
  csv_cfg     =
    separator:  '\t'
    escape:     '"'
    headers:    [ 'foo', 'gnat', 'gnu', 'blah', ]
    # raw:        true
    skipComments: '#'
    # strict:       true
  csv_cfg     = { dba.types.defaults.dba_import_cfg_csv_extra..., csv_cfg..., }
  debug '^4458577^', csv_cfg
  fs.createReadStream import_path
    .pipe csv csv_cfg
    # .pipe csv()
    .on 'data', ( d ) => rows.push d
    .on 'end', =>
      for row in rows
        info '^54596^', row
      resolve()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: writing while reading 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  new_bsqlt3        = require '../../../apps/icql-dba/node_modules/better-sqlite3'
  dba               = new Dba()
  #.........................................................................................................
  await do =>
    dba.execute SQL"create table main.x ( n int primary key, locked boolean not null default false );"
    for n in [ 1 .. 10 ]
      dba.run SQL"insert into x ( n ) values ( ? );", [ n, ]
  #.........................................................................................................
  await do =>
    dba.execute SQL"update x set locked = true;"
    dba.sqlt.unsafeMode true
    for row from dba.query SQL"select * from x where locked;"
      # info '^44555-1^', row
      dba.run SQL"insert into x ( n ) values ( ? );", [ row.n + 100, ]
    dba.sqlt.unsafeMode false
  #.........................................................................................................
  await do =>
    # for row from dba.query SQL"select * from x;"
    #   info '^44555-2^', row
    T.eq ( d.n for d from dba.query SQL"select * from x;" ), [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110 ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: writing while reading 2" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  new_bsqlt3        = require '../../../apps/icql-dba/node_modules/better-sqlite3'
  dba               = new Dba()
  #.........................................................................................................
  await do =>
    dba.execute SQL"create table main.x ( n int primary key, locked boolean not null default false );"
    for n in [ 1 .. 10 ]
      dba.run SQL"insert into x ( n ) values ( ? );", [ n, ]
  #.........................................................................................................
  await do =>
    dba.execute SQL"update x set locked = true;"
    dba.with_unsafe_mode =>
      for row from dba.query SQL"select * from x where locked;"
        info '^44555-3^', dba._state
        dba.run SQL"insert into x ( n ) values ( ? );", [ row.n + 100, ]
    info '^44555-4^', dba._state
  #.........................................................................................................
  await do =>
    # for row from dba.query SQL"select * from x;"
    #   info '^44555-5^', row
    T.eq ( d.n for d from dba.query SQL"select * from x;" ), [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110 ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: indexing JSON lists (de-constructing method)" ] = ( T, done ) ->
  ### see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md ###
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  dba               = new Dba()
  dba.load_extension PATH.resolve PATH.join __dirname, '../../../assets/sqlite-extensions/json1.so'
  { I, L, V, }      = new ( require '../../../apps/icql-dba/lib/sql' ).Sql
  #.........................................................................................................
  await do =>
    #.......................................................................................................
    mutations_allowed = 0
    dba.create_function name: 'mutations_allowed', varargs: true, call: ( value = null ) ->
      # debug '^mutations_allowed@334^', { value, }
      ### TAINT consider to use `validate()` ###
      throw new Error "^3446^ expected null, 0 or 1, got #{rpr value}" unless value in [ null, 0, 1, ]
      return mutations_allowed unless value?
      return mutations_allowed = value
      # if value?
      #   mutations_allowed = if val
    #.......................................................................................................
    dba.execute SQL"""
      create table multiples (
        n         integer unique not null primary key,
        multiples json not null );
      -- ...................................................................................................
      -- ### see https://sqlite.org/forum/forumpost/9f06fedaa5 ###
      create table multiples_idx (
        n         integer not null,
        idx       integer not null,
        multiple  integer not null,
        primary key ( n, idx ) );
      create index multiples_idx_multiple_idx on multiples_idx ( multiple );
      -- ...................................................................................................
      create trigger multiple_after_insert after insert on multiples begin
        select mutations_allowed( true );
        insert into multiples_idx( n, idx, multiple )
          select new.n, j.key, j.value from json_each( new.multiples ) as j;
        select mutations_allowed( false );
        end;
      -- ...................................................................................................
      create trigger multiple_after_delete after delete on multiples begin
        select mutations_allowed( true );
        delete from multiples_idx where n = old.n;
        select mutations_allowed( false );
        end;
      -- ...................................................................................................
      create trigger multiple_after_update after update on multiples begin
        select mutations_allowed( true );
        delete from multiples_idx where n = old.n;
        insert into multiples_idx( n, idx, multiple )
          select new.n, j.key, j.value from json_each( new.multiples ) as j;
        select mutations_allowed( false );
        end;
      -- ...................................................................................................
      create trigger multiples_idx_before_insert before insert on multiples_idx begin
        select raise( abort, '^376^ mutations of multiples_idx not allowed' )
          where not ( select mutations_allowed() );
        end;
      -- ...................................................................................................
      create trigger multiples_idx_before_delete before delete on multiples_idx begin
        select raise( abort, '^376^ mutations of multiples_idx not allowed' )
          where not ( select mutations_allowed() );
        end;
      -- ...................................................................................................
      create trigger multiples_idx_before_update before update on multiples_idx begin
        select raise( abort, '^376^ mutations of multiples_idx not allowed' )
          where not ( select mutations_allowed() );
        end;
      """
    #.......................................................................................................
    for n in [ 1 .. 5 ]
      multiples = jr ( n * k for k in [ 0 .. 9 ] )
      dba.run SQL"insert into multiples values ( $n, $multiples )", { n, multiples, }
    dba.execute SQL"delete from multiples where n = 4;"
    for row from dba.query SQL"select * from multiples;"
      info '^5554^', row
    for row from dba.query SQL"select * from multiples_idx;"
      info '^5554^', row
    #.......................................................................................................
    console.table dba.list dba.query SQL"explain query plan select * from multiples;"
    console.table dba.list dba.query SQL"explain query plan select * from multiples_idx where multiple > 3;"
    # console.table dba.list dba.query SQL"explain query plan select * from multiples where json_array_at( multiples, 3 ) > 10;"
    #.......................................................................................................
    # dba.execute SQL"create index multiples_array_idx on json_array_at( multiples, 3 );"
    # console.table dba.list dba.query SQL"explain query plan select * from multiples where json_array_at( multiples, 3 ) > 10;"
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: indexing JSON lists (constructing method)" ] = ( T, done ) ->
  ### see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md ###
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  schema            = 'main'
  dba               = new Dba()
  dba.load_extension PATH.resolve PATH.join __dirname, '../../../assets/sqlite-extensions/json1.so'
  # dba.sqlt.unsafeMode true
  { I, L, V, }      = new ( require '../../../apps/icql-dba/lib/sql' ).Sql
  #.........................................................................................................
  await do =>
    #.......................................................................................................
    dba.execute SQL"""
      create view multiples as select distinct
          n                                     as n,
          json_group_array( multiple ) over w   as multiples
        from multiples_idx
        window w as ( partition by n order by idx range between unbounded preceding and unbounded following )
        order by n;
      -- ...................................................................................................
      -- ### see https://sqlite.org/forum/forumpost/9f06fedaa5 ###
      create table multiples_idx (
        n         integer not null,
        idx       integer not null,
        multiple  integer not null,
        primary key ( n, idx ) );
      create index multiples_idx_multiple_idx on multiples_idx ( multiple );
      """
    #.......................................................................................................
    for n in [ 1 .. 3 ]
      for idx in [ 0 .. 9 ]
        multiple = n * idx
        continue if multiple > 10
        dba.run SQL"""insert into multiples_idx ( n, idx, multiple )
          values ( $n, $idx, $multiple )""", { n, idx, multiple, }
    #.......................................................................................................
    for row from dba.query SQL"select * from multiples_idx;"
      info '^5554^', row
    for row from dba.query SQL"""select * from multiples;"""
      info '^5554^', row
    #.......................................................................................................
    console.table dba.list dba.query SQL"explain query plan select * from multiples;"
    console.table dba.list dba.query SQL"explain query plan select * from multiples_idx where idx > 3;"
    console.table dba.list dba.query SQL"explain query plan select * from multiples_idx where multiple > 3;"
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: advanced interpolation" ] = ( T, done ) ->
  { Dba }           = require H.icql_dba_path
  E                 = require H.icql_dba_path + '/lib/errors'
  dba               = new Dba()
  do => #...................................................................................................
    sql     = SQL"select $:col_a, $:col_b where $:col_b in $V:choices"
    d       = { col_a: 'foo', col_b: 'bar', choices: [ 1, 2, 3, ], }
    result  = dba.sql.interpolate sql, d
    info '^23867^', result
    T.eq result, """select "foo", "bar" where "bar" in ( 1, 2, 3 )"""
  do => #...................................................................................................
    sql     = SQL"select ?:, ?: where ?: in ?V:"
    d       = [ 'foo', 'bar', 'bar', [ 1, 2, 3, ], ]
    result  = dba.sql.interpolate sql, d
    info '^23867^', result
    T.eq result, """select "foo", "bar" where "bar" in ( 1, 2, 3 )"""
  T.throws /unknown interpolation format 'X'/, => #.........................................................
    sql     = SQL"select ?:, ?X: where ?: in ?V:"
    d       = [ 'foo', 'bar', 'bar', [ 1, 2, 3, ], ]
    result  = dba.sql.interpolate sql, d
  done() #..................................................................................................

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: foreign keys enforced" ] = ( T, done ) ->
  { Dba }           = require H.icql_dba_path
  E                 = require H.icql_dba_path + '/lib/errors'
  dba               = new Dba()
  #.........................................................................................................
  T?.eq dba.get_foreign_keys_state(), true
  dba.execute SQL"create table keys ( key text primary key );"
  dba.execute SQL"create table main ( foo text not null references keys ( key ) );"
  error = null
  try
    dba.execute SQL"insert into main values ( 'x' );"
  catch error
    warn error.message
    warn error.name
    warn error.code
    T?.eq error.code, 'SQLITE_CONSTRAINT_FOREIGNKEY'
  unless error
    T?.fail "expected error, got none"
  done?() #.................................................................................................

# use table valued functions to do joins over 2+ dba instances

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: _is_sqlite3_db()" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }               = require H.icql_dba_path
  dba                   = new Dba()
  cfg                   = H.get_cfg()
  debug '^556^', path_1 = cfg.db.templates.nnt
  debug '^556^', path_2 = cfg.sql.small
  #.........................................................................................................
  T?.eq ( dba._is_sqlite3_db path_1    ), true
  T?.eq ( dba._is_sqlite3_db path_2    ), false
  T?.throws /must be of type string/, -> ( dba._is_sqlite3_db undefined )
  #.........................................................................................................
  done?()


############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }
  # test @[ "DBA: _get_connection_url()" ]
  # debug f '𠖏'
  # test @[ "DBA: advanced interpolation" ]
  # test @[ "DBA: typing" ]
  # test @[ "DBA: window functions etc." ]
  # test @[ "DBA: view with UDF" ]
  # test @[ "DBA: sqlean vsv extension" ]
  # test @[ "DBA: indexing JSON lists (de-constructing method)" ]
  # test @[ "DBA: indexing JSON lists (constructing method)" ]
  # test @[ "DBA: User-Defined Window Function" ]
  # test @[ "DBA: VNRs" ], { timeout: 5e3, }
  # test @[ "DBA: import TSV; big file" ], { timeout: 60e3, }
  # test @[ "DBA: open() file DB in schema main" ]
  # test @[ "DBA: writing while reading 2" ]
  # test @[ "DBA: open() RAM DB from file in schema main" ]
  # test @[ "DBA: open() empty RAM DB in schema main" ]
  # test @[ "DBA: virtual tables" ]
  # test @[ "DBA: import TSV; cfg variants 2" ]
  # test @[ "DBA: import TSV; cfg variants 2" ]
  # test @[ "DBA: import TSV; cfg variants 3" ]
  # test @[ "DBA: import TSV; cfg variants 4" ]
  # test @[ "DBA: import CSV; cfg variants 5" ]
  # await @_demo_csv_parser()
  # test @[ "___ DBA: import() (four corner)" ]
  # test @[ "___ DBA: import() (big file)" ]
  # test @[ "DBA: open() RAM DB" ]
  # test @[ "DBA: export() RAM DB" ]
  # test @[ "DBA: import() CSV" ]
  # test @[ "DBA: import() TSV" ]
  # @[ "DBA: import() CSV" ]()
  # test @[ "DBA: clear()" ]
  # test @[ "DBA: foreign keys enforced" ]
  # test @[ "DBA: clear()" ]
  # test @[ "DBA: open() many RAM DBs" ]
  # @[ "DBA: open() many RAM DBs" ]()
  # test @[ "DBA: _is_sqlite3_db()" ]
  # test @[ "DBA: writing while reading 1" ]
  # test @[ "DBA: writing while reading 2" ]








