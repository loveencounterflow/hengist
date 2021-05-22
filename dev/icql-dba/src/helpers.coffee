

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL/TESTS/HELPERS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
# #...........................................................................................................
# test                      = require 'guy-test'
# jr                        = JSON.stringify
# { inspect, }              = require 'util'
# xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
# xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
FSP                       = require 'fs/promises'
dba_types                 = require '../../../apps/icql-dba/lib/types'
@types                    = new ( require 'intertype' ).Intertype
{ isa
  validate
  validate_list_of
  equals }                = @types.export()
DATA                      = require '../../../lib/data-providers-nocache'
DATOM                     = require 'datom'
{ Dba }                   = require '../../../apps/icql-dba'


#-----------------------------------------------------------------------------------------------------------
@types.declare 'interpolatable_value', ( x ) ->
  return true if @isa.text x
  return true if @isa.float x
  return true if @isa.boolean x
  return false

#-----------------------------------------------------------------------------------------------------------
@types.declare 'procure_db_cfg', tests:
  "@isa.object x":                      ( x ) -> @isa.object x
  "@isa.nonempty_text x.ref":           ( x ) -> @isa.nonempty_text x.ref
  "@isa.nonempty_text x.size":          ( x ) -> @isa.nonempty_text x.size
  "@isa.boolean x.reuse":               ( x ) -> @isa.boolean x.reuse

#-----------------------------------------------------------------------------------------------------------
@types.declare 'looks_like_db_cfg', tests:
  "@isa.object x":                      ( x ) -> @isa.object x
  "dba_types.isa.dba x.dba":            ( x ) -> dba_types.isa.dba x.dba
  "dba_types.isa.ic_schema x.schema":   ( x ) -> dba_types.isa.ic_schema x.schema

#-----------------------------------------------------------------------------------------------------------
@types.declare 'datamill_db_lookalike', ( cfg ) ->
  @validate.looks_like_db_cfg cfg
  { dba, schema, }  = cfg
  schema_i          = dba.as_identifier schema
  try
    return false unless ( dba.first_value dba.query "select count(*) from #{schema_i}.main;" ) is 327
    debug '^35354^', dba.list dba.query "select * from #{schema_i}.main order by vnr_blob limit 3;"
  catch error
    throw error unless error.code is 'SQLITE_ERROR'
    return false
  return true

#-----------------------------------------------------------------------------------------------------------
@types.declare 'chinook_db_lookalike', ( cfg ) ->
  @validate.looks_like_db_cfg cfg
  { dba, schema, }  = cfg
  schema_i          = dba.as_identifier schema
  try
    db_objects = dba.list dba.query "select type, name from #{schema_i}.sqlite_schema where true or type is 'table' order by name;"
    info db_objects
    return false unless equals db_objects, [
      { type: 'table', name: 'Album',                             }
      { type: 'table', name: 'Artist',                            }
      { type: 'table', name: 'Customer',                          }
      { type: 'table', name: 'Employee',                          }
      { type: 'table', name: 'Genre',                             }
      { type: 'index', name: 'IFK_AlbumArtistId',                 }
      { type: 'index', name: 'IFK_CustomerSupportRepId',          }
      { type: 'index', name: 'IFK_EmployeeReportsTo',             }
      { type: 'index', name: 'IFK_InvoiceCustomerId',             }
      { type: 'index', name: 'IFK_InvoiceLineInvoiceId',          }
      { type: 'index', name: 'IFK_InvoiceLineTrackId',            }
      { type: 'index', name: 'IFK_PlaylistTrackTrackId',          }
      { type: 'index', name: 'IFK_TrackAlbumId',                  }
      { type: 'index', name: 'IFK_TrackGenreId',                  }
      { type: 'index', name: 'IFK_TrackMediaTypeId',              }
      { type: 'table', name: 'Invoice',                           }
      { type: 'table', name: 'InvoiceLine',                       }
      { type: 'table', name: 'MediaType',                         }
      { type: 'table', name: 'Playlist',                          }
      { type: 'table', name: 'PlaylistTrack',                     }
      { type: 'table', name: 'Track',                             }
      { type: 'index', name: 'sqlite_autoindex_PlaylistTrack_1',  }
      { type: 'table', name: 'sqlite_sequence',                   } ]
  catch error
    throw error unless error.code is 'SQLITE_ERROR'
    return false
  return true

#-----------------------------------------------------------------------------------------------------------
@types.declare 'micro_db_lookalike', ( cfg ) ->
  @validate.looks_like_db_cfg cfg
  { dba, schema, }  = cfg
  schema_i          = dba.as_identifier schema
  try
    db_objects = dba.list dba.query "select type, name from #{schema_i}.sqlite_schema order by name;"
    info db_objects
    return false unless equals db_objects, [
      { type: 'table', name: 'main',                   } ]
  catch error
    throw error unless error.code is 'SQLITE_ERROR'
    return false
  return true


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@get_icql_settings = ( remove_db = false ) ->
  R                 = {}
  R.connector       = require 'better-sqlite3'
  R.db_path         = '/tmp/icql.db'
  R.icql_path       = PATH.resolve PATH.join __dirname, '../../../assets/icql/test.icql'
  if remove_db
    try
      ( require 'fs' ).unlinkSync R.db_path
    catch error
      throw error unless ( error.code is 'ENOENT' )
  return R

#-----------------------------------------------------------------------------------------------------------
@file_exists = ( path ) ->
  try ( stat = FS.statSync path ) catch error
    return false if error.code is 'ENOENT'
    throw error
  return true if stat.isFile()
  throw new Error "^434534^ not a file: #{rpr path}\n#{rpr stat}"

#-----------------------------------------------------------------------------------------------------------
@ensure_file_exists = ( path ) ->
  throw new Error "^434534^ not a file: #{rpr path}" unless @file_exists path
  return null

#-----------------------------------------------------------------------------------------------------------
@try_to_remove_file = ( path ) ->
  try FS.unlinkSync path catch error
    return if error.code is 'ENOENT'
    throw error
  return null

#-----------------------------------------------------------------------------------------------------------
@resolve_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../../', path

#-----------------------------------------------------------------------------------------------------------
@copy_over = ( from_path, to_path ) ->
  @try_to_remove_file to_path unless to_path in [ ':memory:', '', ]
  await FSP.copyFile from_path, to_path
  return null

#-----------------------------------------------------------------------------------------------------------
@interpolate  = ( template, namespace ) ->
  validate.text template
  validate.object namespace
  R = template
  for name, value of namespace
    continue unless ( R.indexOf ( pattern = "{#{name}}" ) ) > -1
    validate.interpolatable_value value
    R = R.replaceAll pattern, value
  if ( match = R.match /(?<!\\)\{/ )
    throw new Error "unresolved curly bracket in template #{rpr template}"
  R = R.replaceAll '\\{', '{'
  R = R.replaceAll '\\}', '}'
  return R

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "retrieving test data..."
  #.........................................................................................................
  texts       = DATA.get_words cfg.word_count
  #.........................................................................................................
  data_cache  = { texts, }
  data_cache  = DATOM.freeze data_cache
  whisper "...done"
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@get_cfg = ->
  R =
    # word_count: 10_000
    word_count: 10
    sql:
      small:  @resolve_path 'assets/icql/small-datamill.sql'
      big:    @resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.sql'
    db:
      templates:
        micro:  @resolve_path 'assets/icql/micro.db'
        small:  @resolve_path 'assets/icql/small-datamill.db'
        big:    @resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.db'
      target:
        small:  @resolve_path 'data/icql/icql-{ref}-{size}.db'
        big:    @resolve_path 'data/icql/icql-{ref}-{size}.db'
      work:
        mem:    ':memory:'
        fle:    @resolve_path 'data/icql/icql-{ref}-{size}.db'
      temp:
        small:  @resolve_path 'data/icql/icql-{ref}-{size}-temp.db'
        big:    @resolve_path 'data/icql/icql-{ref}-{size}-temp.db'
      old:
        small:  @resolve_path 'data/icql/icql-{ref}-{size}-old.db'
        big:    @resolve_path 'data/icql/icql-{ref}-{size}-old.db'
    pragma_sets:
      #.....................................................................................................
      ### thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 ###
      fle: [
        'page_size = 4096'
        'cache_size = 16384'
        'temp_store = MEMORY'
        'journal_mode = WAL'
        'locking_mode = EXCLUSIVE'
        'synchronous = OFF' ]
      #.....................................................................................................
      mem: []
      bare: []
  return R

#-----------------------------------------------------------------------------------------------------------
@nonexistant_path_from_ref = ( ref ) ->
  R = @interpolate @get_cfg().db.work.fle, { ref, size: 'any', }
  @try_to_remove_file R
  return R

#-----------------------------------------------------------------------------------------------------------
@procure_db = ( cfg ) ->
  cfg           = { reuse: false, cfg..., }
  validate.procure_db_cfg cfg
  xcfg          = @get_cfg()
  template_path = @interpolate xcfg.db.templates[ cfg.size ], cfg
  @ensure_file_exists template_path
  # work_path     = @interpolate xcfg.db.work[      cfg.mode ], cfg
  work_path     = @interpolate xcfg.db.work.fle, cfg
  unless cfg.reuse and @file_exists work_path
    help "^4341^ procuring DB #{work_path}"
    await @copy_over template_path, work_path
  else
    warn "^4341^ skipping DB file creation (#{work_path} already exists)"
  return { template_path, work_path, }


