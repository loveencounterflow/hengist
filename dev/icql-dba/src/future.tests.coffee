
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
          # 'Word'
          'C1'
          # 'C2'
          # 'C3'
          # 'C4'
          # 'Length'
          # 'C1Structure'
          # 'C2Structure'
          # 'C3Structure'
          # 'C4Structure'
          'C1Type'
          # 'C2Type'
          # 'C3Type'
          # 'C4Type'
          # 'Pinyin'
          'C1Pinyin'
          # 'C2Pinyin'
          # 'C3Pinyin'
          # 'C4Pinyin'
          # 'IPA'
          # 'C1IPA'
          # 'C2IPA'
          # 'C3IPA'
          # 'C4IPA'
          # 'InitialPhoneme'
          # 'FinalPhoneme'
          'C1PRPinyin'
          # 'C2PRPinyin'
          # 'C3PRPinyin'
          # 'C4PRPinyin'
          # 'Phonemes'
          # 'C1Phonemes'
          # 'C2Phonemes'
          # 'C3Phonemes'
          # 'C4Phonemes'
          # 'C1Tone'
          # 'C2Tone'
          # 'C3Tone'
          # 'C4Tone'
          # 'Frequency'
          # 'C1Frequency'
          # 'C2Frequency'
          # 'C3Frequency'
          # 'C4Frequency'
          # 'FrequencyRaw'
          # 'C1FrequencyRaw'
          # 'C2FrequencyRaw'
          # 'C3FrequencyRaw'
          # 'C4FrequencyRaw'
          # 'FrequencySUBTL'
          # 'C1FrequencySUBTL'
          # 'C2FrequencySUBTL'
          # 'C3FrequencySUBTL'
          # 'C4FrequencySUBTL'
          # 'FrequencyRawSUBTL'
          # 'C1FrequencyRawSUBTL'
          # 'C2FrequencyRawSUBTL'
          # 'C3FrequencyRawSUBTL'
          # 'C4FrequencyRawSUBTL'
          # 'FrequencyWeibo'
          # 'C1FrequencyWeibo'
          # 'C2FrequencyWeibo'
          # 'C3FrequencyWeibo'
          # 'C4FrequencyWeibo'
          # 'FrequencyRawWeibo'
          # 'C1FrequencyRawWeibo'
          # 'C2FrequencyRawWeibo'
          # 'C3FrequencyRawWeibo'
          # 'C4FrequencyRawWeibo'
          # 'PhonologicalFrequency'
          # 'C1PhonologicalFrequency'
          # 'C2PhonologicalFrequency'
          # 'C3PhonologicalFrequency'
          # 'C4PhonologicalFrequency'
          # 'C1FamilySize'
          # 'C2FamilySize'
          # 'C3FamilySize'
          # 'C4FamilySize'
          # 'C1FamilyFrequency'
          # 'C2FamilyFrequency'
          # 'C3FamilyFrequency'
          # 'C4FamilyFrequency'
          # 'Strokes'
          'C1Strokes'
          # 'C2Strokes'
          # 'C3Strokes'
          # 'C4Strokes'
          'C1Pixels'
          # 'C2Pixels'
          # 'C3Pixels'
          # 'C4Pixels'
          'C1PictureSize'
          # 'complexity'
          # 'C2PictureSize'
          # 'C3PictureSize'
          # 'C4PictureSize'
          # 'C1OLDPixels'
          # 'C2OLDPixels'
          # 'C3OLDPixels'
          # 'C4OLDPixels'
          # 'PhonologicalN'
          # 'C1PhonologicalN'
          # 'C2PhonologicalN'
          # 'C3PhonologicalN'
          # 'C4PhonologicalN'
          # 'PLD'
          # 'C1PLD'
          # 'C2PLD'
          # 'C3PLD'
          # 'C4PLD'
          'C1SR'
          # 'C2SR'
          # 'C3SR'
          # 'C4SR'
          # 'C1SRFrequency'
          # 'C2SRFrequency'
          # 'C3SRFrequency'
          # 'C4SRFrequency'
          # 'C1SRFamilySize'
          # 'C2SRFamilySize'
          # 'C3SRFamilySize'
          # 'C4SRFamilySize'
          # 'C1SRStrokes'
          # 'C2SRStrokes'
          # 'C3SRStrokes'
          # 'C4SRStrokes'
          'C1PR'
          # 'C2PR'
          # 'C3PR'
          # 'C4PR'
          # 'C1PRFrequency'
          # 'C2PRFrequency'
          # 'C3PRFrequency'
          # 'C4PRFrequency'
          # 'C1PRFamilySize'
          # 'C2PRFamilySize'
          # 'C3PRFamilySize'
          # 'C4PRFamilySize'
          # 'C1PRStrokes'
          # 'C2PRStrokes'
          # 'C3PRStrokes'
          # 'C4PRStrokes'
          # 'C1PRRegularity'
          # 'C2PRRegularity'
          # 'C3PRRegularity'
          # 'C4PRRegularity'
          # 'C1PRFriends'
          # 'C2PRFriends'
          # 'C3PRFriends'
          # 'C4PRFriends'
          # 'C1PREnemiesTypes'
          # 'C2PREnemiesTypes'
          # 'C3PREnemiesTypes'
          # 'C4PREnemiesTypes'
          # 'C1PREnemiesTokens'
          # 'C2PREnemiesTokens'
          # 'C3PREnemiesTokens'
          # 'C4PREnemiesTokens'
          # 'C1PRFriendsFrequency'
          # 'C2PRFriendsFrequency'
          # 'C3PRFriendsFrequency'
          # 'C4PRFriendsFrequency'
          # 'C1PREnemiesFrequency'
          # 'C2PREnemiesFrequency'
          # 'C3PREnemiesFrequency'
          # 'C4PREnemiesFrequency'
          # 'C1PRBackwardEnemiesTypes'
          # 'C2PRBackwardEnemiesTypes'
          # 'C3PRBackwardEnemiesTypes'
          # 'C4PRBackwardEnemiesTypes'
          # 'C1PRBackwardEnemiesTokens'
          # 'C2PRBackwardEnemiesTokens'
          # 'C3PRBackwardEnemiesTokens'
          # 'C4PRBackwardEnemiesTokens'
          # 'C1PRBackwardEnemiesFrequency'
          # 'C2PRBackwardEnemiesFrequency'
          # 'C3PRBackwardEnemiesFrequency'
          # 'C4PRBackwardEnemiesFrequency'
          # 'MeanPhonemeFrequency'
          # 'C1MeanPhonemeFrequency'
          # 'C2MeanPhonemeFrequency'
          # 'C3MeanPhonemeFrequency'
          # 'C4MeanPhonemeFrequency'
          # 'MinPhonemeFrequency'
          # 'C1MinPhonemeFrequency'
          # 'C2MinPhonemeFrequency'
          # 'C3MinPhonemeFrequency'
          # 'C4MinPhonemeFrequency'
          # 'MaxPhonemeFrequency'
          # 'C1MaxPhonemeFrequency'
          # 'C2MaxPhonemeFrequency'
          # 'C3MaxPhonemeFrequency'
          # 'C4MaxPhonemeFrequency'
          # 'C1InitialPhonemeFrequency'
          # 'C2InitialPhonemeFrequency'
          # 'C3InitialPhonemeFrequency'
          # 'C4InitialPhonemeFrequency'
          # 'MeanDiphoneFrequency'
          # 'C1MeanDiphoneFrequency'
          # 'C2MeanDiphoneFrequency'
          # 'C3MeanDiphoneFrequency'
          # 'C4MeanDiphoneFrequency'
          # 'MinDiphoneFrequency'
          # 'C1MinDiphoneFrequency'
          # 'C2MinDiphoneFrequency'
          # 'C3MinDiphoneFrequency'
          # 'C4MinDiphoneFrequency'
          # 'MaxDiphoneFrequency'
          # 'C1MaxDiphoneFrequency'
          # 'C2MaxDiphoneFrequency'
          # 'C3MaxDiphoneFrequency'
          # 'C4MaxDiphoneFrequency'
          # 'C1InitialDiphoneFrequency'
          # 'C2InitialDiphoneFrequency'
          # 'C3InitialDiphoneFrequency'
          # 'C4InitialDiphoneFrequency'
          # 'TransitionalDiphone1Frequency'
          # 'TransitionalDiphone2Frequency'
          # 'TransitionalDiphone3Frequency'
          # 'C1Friends'
          # 'C2Friends'
          # 'C3Friends'
          # 'C4Friends'
          # 'C1HomographTypes'
          # 'C2HomographTypes'
          # 'C3HomographTypes'
          # 'C4HomographTypes'
          # 'C1HomographTokens'
          # 'C2HomographTokens'
          # 'C3HomographTokens'
          # 'C4HomographTokens'
          # 'C1FriendsFrequency'
          # 'C2FriendsFrequency'
          # 'C3FriendsFrequency'
          # 'C4FriendsFrequency'
          # 'C1HomographsFrequency'
          # 'C2HomographsFrequency'
          # 'C3HomographsFrequency'
          # 'C4HomographsFrequency'
          # 'C1HomophoneTypes'
          # 'C2HomophoneTypes'
          # 'C3HomophoneTypes'
          # 'C4HomophoneTypes'
          # 'C1HomophoneTokens'
          # 'C2HomophoneTokens'
          # 'C3HomophoneTokens'
          # 'C4HomophoneTokens'
          # 'C1HomophonesFrequency'
          # 'C2HomophonesFrequency'
          # 'C3HomophonesFrequency'
          # 'C4HomophonesFrequency'
          # 'C1Entropy'
          # 'C12Entropy'
          # 'C123Entropy'
          # 'C1BackwardEntropy'
          # 'C12BackwardEntropy'
          # 'C123BackwardEntropy'
          # 'C1RE'
          # 'C2RE'
          # 'PMI'
          # 'PSPMI'
          # 'TScore'
          # 'PSTScore'
          # 'C1ConditionalProbability'
          # 'C12ConditionalProbability'
          # 'C123ConditionalProbability'
          # 'C1BackwardConditionalProbability'
          # 'C12BackwardConditionalProbability'
          # 'C123BackwardConditionalProbability'
          # 'EntropyCharacterFrequencies'
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
    cpx_max = dba.single_value dba.query "select max( cpx_raw ) from chlex.main;"
    debug '^7946^', { cpx_max, }
    update  = dba.prepare "update chlex.main set cpx = max( round( cpx_raw / ? * 99, 0 ), 1 );"
    # update  = dba.prepare "update chlex.main set cpx = cpx_raw / ?;"
    update.run [ cpx_max, ]
    #.......................................................................................................
    matcher           = dba.list dba.query """select "C1", cpx from chlex.main order by cpx, cpx_raw asc;"""
    # for row in matcher
    console.table matcher
    dba.export { schema, path: export_path, }
  #.........................................................................................................
  done()


############################################################################################################
unless module.parent?
  test @
  # test @[ "DBA: open()" ]
  # test @[ "DBA: open() RAM DB" ]
  # test @[ "DBA: export() RAM DB" ]
  # test @[ "DBA: import() CSV" ]




