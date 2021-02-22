

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'IN-MEMORY-SQL'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
DATA                      = require '../../../lib/data-providers-nocache'
test                      = require 'guy-test'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null
gcfg                      = { verbose: false, }

#-----------------------------------------------------------------------------------------------------------
show_result = ( name, result ) ->
  info '-----------------------------------------------'
  urge name
  whisper result
  info '-----------------------------------------------'
  return null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  DATOM = require '../../../apps/datom'
  #.........................................................................................................
  texts       = DATA.get_text_lines cfg
  font        =
    path:       'EBGaramond12-Italic.otf'
    ### TAINT use single type/format for features ###
    features:   'liga,clig,dlig,hlig'
    features_obj: { liga: true, clig: true, dlig: true, hlig: true, }
  font.path   = PATH.resolve PATH.join __dirname, '../../../assets/jizura-fonts', font.path
  #.........................................................................................................
  data_cache  = { texts, font, }
  data_cache  = DATOM.freeze data_cache
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@pgmem = ( cfg ) -> new Promise ( resolve ) =>
  db            = ( require 'pg-mem' ).newDb()
  # HB.ensure_harfbuzz_version() ### NOTE: optional diagnostic ###
  # data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    sql = """
      create table foo ( n integer not null );
      insert into foo values ( 1 ), ( 2 ), ( 3 ), ( 4 ), ( 5 ), ( 6 ), ( 7 ), ( 8 );
      """
    debug '^22233^', db.public.none sql
    resolve count
  return null


#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  # gcfg.verbose  = true
  bench         = BM.new_benchmarks()
  n             = 10
  gcfg.verbose  = ( n is 1 )
  cfg           = { line_count: n, word_count: n, }
  repetitions   = 2
  test_names    = [
    'pgmem'
    ]
  global.gc() if global.gc?
  data_cache = null
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      global.gc() if global.gc?
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()



