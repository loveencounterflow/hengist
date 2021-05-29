
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/BASICS'
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



#-----------------------------------------------------------------------------------------------------------
@[ "DBA: open()" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba } = require '../../../apps/icql-dba'
  dba     = new Dba()
  schemas = {}
  #.........................................................................................................
  T.eq dba.sqlt.name,           ''
  T.eq dba.sqlt.open,           true
  T.eq dba.sqlt.inTransaction,  false
  T.eq dba.sqlt.readonly,       false
  T.eq dba.sqlt.memory,         true
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open', }
    schema            = 'dm1'
    schemas[ schema ] = { path: work_path, }
    urge '^344-1^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok H.types.isa.datamill_db_lookalike { dba, schema, }
  #.........................................................................................................
  await do =>
    ### Possible to attach same file for Continuous Peristency DB multiple times ###
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open', reuse: true, }
    schema            = 'dm2'
    schema_i          = dba.as_identifier schema
    schemas[ schema ] = { path: work_path, }
    urge '^344-1^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok H.types.isa.datamill_db_lookalike { dba, schema, }
    dba.execute "create table dm1.extra ( id integer );"
    dba.execute "insert into dm1.extra values ( 1 ), ( 2 ), ( 3 );"
    info dba.list dba.query "select * from dm1.extra order by id;"
    help ( d.name for d from ( dba.walk_objects { schema: 'dm1', } ) )
    help ( d.name for d from ( dba.walk_objects { schema: 'dm2', } ) )
    T.ok 'extra' in ( d.name for d from ( dba.walk_objects { schema: 'dm1', } ) )
    T.ok 'extra' in ( d.name for d from ( dba.walk_objects { schema: 'dm2', } ) )
    T.eq ( dba.list dba.query "select * from dm1.extra order by id;" ), [ { id: 1, }, { id: 2, }, { id: 3, }, ]
    T.eq ( dba.list dba.query "select * from dm2.extra order by id;" ), [ { id: 1, }, { id: 2, }, { id: 3, }, ]
    T.ok not dba.is_ram_db { schema, }
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open', }
    schema            = 'dm1'
    # schemas[ schema ] = { path: work_path, }
    urge '^344-2^', { template_path, work_path, schema, }
    try dba.open { path: work_path, schema, } catch error
      warn '^3234^', error
      warn '^3234^', error.message
    # dba.open { path: work_path, schema, }
    T.throws /schema 'dm1' already exists/, => dba.open { path: work_path, schema, }
    T.ok not dba.is_ram_db { schema, }
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'big', ref: 'F-open', }
    schema            = 'chinook'
    schemas[ schema ] = { path: work_path, }
    urge '^344-3^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok not H.types.isa.datamill_db_lookalike { dba, schema, }
    T.ok H.types.isa.chinook_db_lookalike { dba, schema, }
    T.ok not dba.is_ram_db { schema, }
  #.........................................................................................................
  await do =>
    { template_path
      work_path }     = await H.procure_db { size: 'micro', ref: 'F-open', }
    schema            = 'micro'
    schemas[ schema ] = { path: work_path, }
    urge '^344-3^', { template_path, work_path, schema, }
    dba.open { path: work_path, schema, }
    T.ok not H.types.isa.datamill_db_lookalike { dba, schema, }
    T.ok H.types.isa.micro_db_lookalike { dba, schema, }
    T.ok not dba.is_ram_db { schema, }
  #.........................................................................................................
  T.eq dba._schemas, schemas
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: open() RAM DB" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba } = require '../../../apps/icql-dba'
  dba     = new Dba()
  schemas = {}
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    { template_path
      work_path }     = await H.procure_db { size: 'small', ref: 'F-open-2', }
    schema            = 'ramdb'
    schemas[ schema ] = { path: work_path, }
    urge '^344-3^', { template_path, work_path, schema, ram: true, }
    dba.open { path: work_path, schema, ram: true, }
    T.ok H.types.isa.datamill_db_lookalike { dba, schema, }
    # help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
    # info d for d from dba.query "select * from pragma_database_list order by seq;"
    db_path           = dba.first_value dba.query "select file from pragma_database_list where name = ?;", [ schema, ]
    T.eq db_path, ''
    T.eq db_path, dba._path_of_schema schema
    T.ok dba.is_ram_db { schema, }
  #.........................................................................................................
  await do =>
    ### Opening an empty RAM DB ###
    schema            = 'r2'
    ram               = true
    schemas[ schema ] = { path: null, }
    dba.open { schema, ram, }
    # help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
    # info d for d from dba.query "select * from pragma_database_list order by seq;"
    db_path           = dba.first_value dba.query "select file from pragma_database_list where name = ?;", [ schema, ]
    T.eq db_path, ''
    T.ok dba.is_ram_db { schema, }
  #.........................................................................................................
  await do =>
    # dba.is_ram_db { schema: 'nosuchschema', }
    T.throws /\(Dba_schema_unknown\) schema 'nosuchschema' does not exist/, => dba.is_ram_db { schema: 'nosuchschema', }
  #.........................................................................................................
  info '^35345^', dba._schemas
  T.eq dba._schemas, schemas
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: save() RAM DB" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  ramdb_path        = null
  matcher           = null
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    dba               = new Dba()
    { template_path
      work_path }     = await H.procure_db { size: 'micro', ref: 'F-save-1', }
    schema            = 'ramdb'
    ramdb_path        = work_path
    digest_1          = CND.id_from_route work_path
    dba.open { path: work_path, schema, ram: true, }
    debug '^422423^', dba._schemas
    T.ok dba.is_ram_db { schema, }
    #.......................................................................................................
    dba.execute "create table ramdb.d ( id integer, t text );"
    for id in [ 1 .. 9 ]
      dba.run "insert into d values ( ?, ? );", [ id, "line Nr. #{id}", ]
    matcher           = dba.list dba.query "select * from ramdb.d order by id;"
    #.......................................................................................................
    digest_2          = CND.id_from_route work_path
    T.eq digest_1, digest_2
    T.throws /\(Dba_argument_not_allowed\) argument path not allowed/, =>
      dba.save { path: '/tmp/x', schema: 'xxx' }
    dba.save { schema, }
    #.......................................................................................................
    digest_3          = CND.id_from_route work_path
    T.ok not types.equals digest_1, digest_3
    #.......................................................................................................
    T.ok dba.is_ram_db { schema, }
    return null
  #.........................................................................................................
  await do =>
    ### Check whether file DB was updated by `dba.save()` ###
    dba               = new Dba()
    schema            = 'filedb'
    dba.open { path: ramdb_path, schema, ram: false, }
    probe             = dba.list dba.query "select * from filedb.d order by id;"
    T.eq probe, matcher
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: export() RAM DB" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  ramdb_path        = null
  matcher           = null
  export_path       = H.nonexistant_path_from_ref 'export-ram-db'
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    dba               = new Dba()
    { template_path
      work_path }     = await H.procure_db { size: 'micro', ref: 'F-save-1', }
    schema            = 'ramdb'
    ramdb_path        = work_path
    dba.open { path: work_path, schema, ram: true, }
    #.......................................................................................................
    dba.execute "create table ramdb.d ( id integer, t text );"
    for id in [ 1 .. 9 ]
      dba.run "insert into d values ( ?, ? );", [ id, "line Nr. #{id}", ]
    matcher           = dba.list dba.query "select * from ramdb.d order by id;"
    #.......................................................................................................
    T.throws /\(Dba_argument_not_allowed\) argument path not allowed/, =>
      dba.save { path: '/tmp/x', schema: 'xxx' }
    dba.export { schema, path: export_path, }
    #.......................................................................................................
    return null
  # #.........................................................................................................
  # await do =>
  #   ### Check whether file DB was updated by `dba.save()` ###
  #   dba               = new Dba()
  #   schema            = 'filedb'
  #   dba.open { path: ramdb_path, schema, ram: false, }
  #   probe             = dba.list dba.query "select * from filedb.d order by id;"
  #   T.eq probe, matcher
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: import() CSV" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  # ramdb_path        = null
  matcher           = null
  export_path       = H.nonexistant_path_from_ref 'import-csv'
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    dba               = new Dba()
    import_path       = H.get_cfg().csv.small
    schema            = 'chlex'
    columns           = null
    seen_chrs         = new Set()
    transform         = ( d ) ->
      if d.columns?
        columns = [
          'C1'
          'C1Type'
          'C1Pinyin'
          'C1PRPinyin'
          'C1Strokes'
          'C1Pixels'
          'C1PictureSize'
          'C1SR'
          'C1PR'
          ]
        return columns
      #.....................................................................................................
      return [] if seen_chrs.has d.row.C1
      seen_chrs.add d.row.C1
      row       = {}
      for column in columns
        value         = d.row[ column ]
        value         = if value is 'NA' then null else value
        # debug '^4448^', column, value, r
        # switch column
        #   # when 'C1Pixels'       then ( parseFloat value ) / 1000
        #   # when 'C1PictureSize'  then ( parseFloat value ) / 1000
        #   when 'complexity'
        #     value = ( parseFloat row.C1Pixels ) * ( parseFloat row.C1PictureSize ) * ( parseFloat row.C1Strokes )
        #     value = value / 1e6
        #     value = Math.max value, 1
        #     value = value.toFixed 0
        #     value = value.padStart 5, '0'
        #   else null
        row[ column ] = value
      return [ row, ]
    #.......................................................................................................
    dba.import { path: import_path, format: 'csv', schema, ram: true, transform, }
    #.......................................................................................................
    dba.execute "alter table chlex.main add column cpx_raw integer;"
    dba.execute "alter table chlex.main add column cpx integer;"
    dba.execute "update chlex.main set cpx_raw = C1Strokes * C1Pixels * C1PictureSize;"
    cpxr_max    = dba.single_value dba.query "select max( cpx_raw ) from chlex.main;"
    cpxr_min    = dba.single_value dba.query "select min( cpx_raw ) from chlex.main;"
    cpxr_delta  = cpxr_max - cpxr_min
    cpx_min     = 10
    cpx_max     = 99
    precision   = 0
    cpx_delta   = cpx_max - cpx_min
    debug '^7946^', { cpxr_max, }
    update  = dba.prepare """
      update chlex.main set
        cpx = round(
          ( cpx_raw - $cpxr_min ) / $cpxr_delta * $cpx_delta + $cpx_min,
          $precision );
      """
    # update  = dba.prepare "update chlex.main set cpx = max( round( cpx_raw / ? * 99, 0 ), 1 );"
    # update  = dba.prepare "update chlex.main set cpx = cpx_raw / ?;"
    update.run { cpxr_min, cpxr_max, cpxr_delta, cpx_min, cpx_max, cpx_delta, precision, }
    #.......................................................................................................
    matcher = dba.list dba.query """select C1Type, C1, C1SR, C1PR, cpx from chlex.main order by cpx, cpx_raw asc;"""
    # for row in matcher
    console.table matcher
    dba.export { schema, path: export_path, }
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "___ DBA: import() (big file)" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  # ramdb_path        = null
  matcher           = null
  export_path       = H.nonexistant_path_from_ref 'import-csv'
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    dba               = new Dba()
    import_path       = PATH.resolve PATH.join __dirname, '../../../assets/jizura-datasources/data/flat-files/shape/shape-strokeorder-zhaziwubifa.txt'
    # import_path       = PATH.resolve PATH.join __dirname, '../../../assets/icql/ncrglyphwbf.tsv'
    schema            = 'wbf'
    columns           = null
    seen_chrs         = new Set()
    count             = 0
    transform         = null
    #.......................................................................................................
    transform         = ( d ) ->
      count++
      { ncr
        glyph
        wbf } = d.row
      return null if ( not ncr? ) or ( not glyph? ) or ( not wbf? )
      return null unless ( match = wbf.match /^<(?<wbf>[0-9]+)>$/ )?
      { wbf, } = match.groups
      return d.stop if count > 1000
      return { ncr, glyph, wbf, }
    #.......................................................................................................
    _extra =
      delimiter:                '\t'
      # columns:                  [ 'ncr', 'glyph', 'wbf', ]
      relax_column_count:       true
      # relax_column_count_less:  true
      # relax_column_count_more:  true
    columns = [ 'ncr', 'glyph', 'wbf', ]
    t0 = Date.now()
    dba.import { path: import_path, format: 'csv', schema, ram: true, transform, _extra, columns, }
    t1 = Date.now()
    debug '^44545^', "dt:", ( t1 - t0 ) / 1000
    matcher = dba.list dba.query """select * from wbf.main order by wbf limit 1000;"""
    for row in matcher
      info row
    #.......................................................................................................
    sql = """
      select
        glyph as glyph,
        cast( substring( wbf, 1, 1 ) as integer ) +
          cast( substring( wbf, -1, 1 ) as integer ) as wbfs
      from wbf.main
      order by wbfs;
      """
    for row from dba.query sql
      info row
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "___ DBA: import() (four corner)" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  # ramdb_path        = null
  matcher           = null
  export_path       = H.nonexistant_path_from_ref 'import-csv'
  #.........................................................................................................
  await do =>
    ### Opening a RAM DB from file ###
    dba               = new Dba()
    import_path       = PATH.resolve PATH.join __dirname, '../../../../../io/mingkwai-rack/jizura-datasources/data/flat-files/shape/shape-fourcorner-wikipedia.txt'
    # import_path       = PATH.resolve PATH.join __dirname, '../../../assets/icql/ncrglyphwbf.tsv'
    schema            = 'fc'
    columns           = null
    seen_chrs         = new Set()
    count             = 0
    transform         = null
    #.......................................................................................................
    transform         = ( d ) ->
      # debug '^44554^', d
      count++
      # return d.stop if count > 100
      ### TAINT must specify columns for source, target separately ###
      { fc4
        fcx } = d.row
      { lnr } = d
      return null if ( not fc4? ) or ( not fcx? )
      fc      = fc4
      glyphs  = fcx
      glyphs  = Array.from glyphs
      unless ( match = fc.match /^(?<fc4>[0-9]+)(-(?<fcx>[0-9]))?$/ )?
        warn "^334^ omitted: #{rpr d}"
        return null
      { fc4
        fcx } = match.groups
      return ( { fc4, fcx, glyph, } for glyph in glyphs )
    #.......................................................................................................
    _extra =
      delimiter:                '\t'
      # columns:                  [ 'ncr', 'glyph', 'wbf', ]
      relax_column_count:       true
      # relax_column_count_less:  true
      # relax_column_count_more:  true
    ### TAINT must specify columns for source, target separately ###
    columns = [ 'fc4', 'fcx', 'glyph', ]
    t0 = Date.now()
    dba.import { path: import_path, format: 'csv', schema, ram: true, transform, _extra, columns, }
    t1 = Date.now()
    debug '^44545^', "dt:", ( t1 - t0 ) / 1000
    #.......................................................................................................
    matcher = dba.list dba.query """select * from fc.main where fc4 like '_3__' order by fc4, fcx limit 10;"""
    for row in matcher
      info "#{row.fc4} #{row.glyph}"
    #.......................................................................................................
    clauses       = []
    with_clauses  = []
    for idx in [ 0 .. 3 ]
      for digit in [ 0 .. 9 ]
        position  = idx + 1
        pattern   = ( '_'.repeat idx ) + ( "#{digit}" ) + ( '_'.repeat 3 - idx )
        with_clauses.push "v#{position}#{digit} as ( select count(*) as c from fc.main where fc4 like '#{pattern}' )"
    clauses.push "with #{with_clauses.join ',\n'}\n"
    clauses.push """select null as c, null as p1, null as p2, null as p3, null as p4 where false union all"""
    for digit in [ 0 .. 9 ]
      clauses.push """select #{digit}, v1#{digit}.c, v2#{digit}.c, v3#{digit}.c, v4#{digit}.c from v1#{digit}, v2#{digit}, v3#{digit}, v4#{digit} union all"""
    clauses.push """select null, null, null, null, null where false;"""
    sql = clauses.join '\n'
    # debug '^348^', sql
    for row from dba.query sql
      info row
  #.........................................................................................................
  done()


############################################################################################################
if module is require.main then do =>
  # test @
  # test @[ "___ DBA: import() (four corner)" ]
  test @[ "___ DBA: import() (big file)" ]
  # test @[ "DBA: open() RAM DB" ]
  # test @[ "DBA: export() RAM DB" ]
  # test @[ "DBA: import() CSV" ]



