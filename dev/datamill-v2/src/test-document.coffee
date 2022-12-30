
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DATAMILL/TESTS/DOCUMENT'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate              } = types
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
PATH                      = require 'node:path'
FS                        = require 'node:fs'

#-----------------------------------------------------------------------------------------------------------
@doc_object_creation = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  T?.eq ( type_of Document ), 'class'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    db  = new DBay()
    doc = new Document { db, home, }
    T?.ok doc.db is db
    T?.ok doc.cfg.prefix is 'doc_'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc = new Document { prefix: 'doc_', home, }
    T?.eq ( type_of doc.db ), 'dbay'
    T?.ok doc.cfg.prefix is 'doc_'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_document_creation = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc = new Document { home, }
    T?.eq doc.get_doc_file_ids(), [ 'layout', ]
    # T?.eq doc.get_doc_fads()[ ... 3 ], [
    #   { doc_fad_id: 'External_file_abc', doc_fad_name: 'External_file_abc',   comment: 'abstract base class for external files' },
    #   { doc_fad_id: 'File_adapter_abc',  doc_fad_name: 'File_adapter_abc',    comment: 'abstract base class for files' },
    #   { doc_fad_id: 'xtxt',              doc_fad_name: 'External_text_file',  comment: 'adapter for external text files' } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_file_path_resolution = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home  = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc   = new Document { home, }
    # debug '^34-5^', { doc, }
    # debug '^34-5^', doc.cfg.home is home
    T?.eq ( doc.get_doc_file_abspath '.'                ), "#{home_parent}/dmd"
    T?.eq ( doc.get_doc_file_abspath 'foo.md'           ), "#{home_parent}/dmd/foo.md"
    T?.eq ( doc.get_doc_file_abspath '/path/to/foo.md'  ), "/path/to/foo.md"
    T?.eq ( doc.get_doc_file_abspath './path/to/foo.md' ), "#{home_parent}/dmd/path/to/foo.md"
    T?.eq ( doc.get_doc_file_abspath 'path/to/foo.md'   ), "#{home_parent}/dmd/path/to/foo.md"
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_add_and_read_file = ( T, done ) ->
  { SQL }       = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home    = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc     = new Document { home, }
    result  = []
    # debug '^34-5^', { doc, }
    files   = [
      { doc_file_id: 'ef', doc_file_path: 'datamill/empty-file.txt',                   }
      { doc_file_id: '3n', doc_file_path: 'datamill/file-with-3-lines-no-eofnl.txt',   }
      { doc_file_id: '3w', doc_file_path: 'datamill/file-with-3-lines-with-eofnl.txt', }
      { doc_file_id: '1n', doc_file_path: 'datamill/file-with-single-nl.txt',          } ]
    for { doc_file_id, doc_file_path, } in files
      source_path   = PATH.resolve __dirname, '../../../assets/', doc_file_path
      target_path   = PATH.resolve home, doc_file_path
      FS.cpSync source_path, target_path
      file          = doc.add_file { doc_file_id, doc_file_path, }
      result.push file
    H.tabulate "files", result
    H.tabulate "lines", doc.db SQL"select * from doc_raw_lines;"
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_paragraphs = ( T, done ) ->
  { SQL  }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home    = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc     = new Document { home, }
    result  = []
    # debug '^34-5^', { doc, }
    files   = [
      { doc_file_id: 'sp', doc_file_path: 'short-proposal.mkts.md',                   }
      { doc_file_id: '3p', doc_file_path: 'datamill/three-paragraphs.txt',            }
      { doc_file_id: '3n', doc_file_path: 'datamill/file-with-3-lines-no-eofnl.txt',  }
      { doc_file_id: '1n', doc_file_path: 'datamill/file-with-single-nl.txt',         } ]
    for { doc_file_id, doc_file_path, } in files
      source_path   = PATH.resolve __dirname, '../../../assets/', doc_file_path
      doc_file_path = PATH.basename doc_file_path
      target_path   = PATH.resolve home, doc_file_path
      FS.cpSync source_path, target_path
      file          = doc.add_file { doc_file_id, doc_file_path, }
      result.push file
    H.tabulate "files", result
    H.tabulate "lines", doc.db SQL"select * from doc_raw_lines;"
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_walk_concatenated_lines_of_files = ( T, done ) ->
  { SQL  }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home    = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc     = new Document { home, }
    result  = []
    # debug '^34-5^', { doc, }
    files   = [
      { doc_file_id: '3p', doc_file_path: 'datamill/three-paragraphs.txt',            }
      { doc_file_id: '3n', doc_file_path: 'datamill/file-with-3-lines-no-eofnl.txt',  }
      { doc_file_id: '1n', doc_file_path: 'datamill/file-with-single-nl.txt',         } ]
    for { doc_file_id, doc_file_path, } in files
      source_path   = PATH.resolve __dirname, '../../../assets/', doc_file_path
      doc_file_path = PATH.basename doc_file_path
      target_path   = PATH.resolve home, doc_file_path
      FS.cpSync source_path, target_path
      file          = doc.add_file { doc_file_id, doc_file_path, }
      result.push file
    do ->
      T?.eq [ ( doc.walk_raw_lines [] )..., ], []
    do ->
      matcher = doc.db.all_rows SQL"""
        select 1 as doc_file_nr, * from doc_raw_lines where doc_file_id = '1n'
        union all
        select 2 as doc_file_nr, * from doc_raw_lines where doc_file_id = '3n'
        union all
        select 3 as doc_file_nr, * from doc_raw_lines where doc_file_id = '3p'
        order by doc_file_nr, doc_line_nr;"""
      urge '^9856^', matcher
      H.tabulate "matcher", matcher
      H.tabulate "select * from doc_raw_lines", doc.db SQL"select * from doc_raw_lines;"
      H.tabulate "doc.walk_raw_lines '1n', '3n', '3p'", doc.walk_raw_lines '1n', '3n', '3p'
      T?.eq [ ( doc.walk_raw_lines '1n', '3n', '3p' )..., ], matcher
    #.......................................................................................................
    H.tabulate "view doc_raw_lines", doc.db SQL"select * from doc_raw_lines;"
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_loc_matcher = ( T, done ) ->
  { SQL  }                = require '../../../apps/dbay'
  { get_document_types }  = require '../../../apps/datamill-v2/lib/types'
  types                   = get_document_types()
  pattern                 = types.registry.doc_document_cfg.default.loc_marker_re
  #.........................................................................................................
  probes_and_matchers = [
    [   "<dm:loc#prologue>", [ { left_slash: '',  doc_loc_name: 'prologue', right_slash: ''  }, ], ]
    [  "<dm:loc#prologue/>", [ { left_slash: '',  doc_loc_name: 'prologue', right_slash: '/' }, ], ]
    [  "</dm:loc#prologue>", [ { left_slash: '/', doc_loc_name: 'prologue', right_slash: ''  }, ], ]
    [ "</dm:loc#prologue/>", [ { left_slash: '/', doc_loc_name: 'prologue', right_slash: '/' }, ], ]
    [ "<dm:loc#L1/>xxx<dm:loc#L2/>", [ { left_slash: '', doc_loc_name: 'L1', right_slash: '/' }, { left_slash: '', doc_loc_name: 'L2', right_slash: '/' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result  = [ ( probe.matchAll pattern )..., ]
      result  = ( { m.groups..., } for m in result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_walk_locs = ( T, done ) ->
  { SQL  }                = require '../../../apps/dbay'
  { Document }            = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc     = new Document { home, }
    file    = doc.db.first_row SQL"select * from doc_files where doc_file_id = 'layout';"
    result  = [ ( doc._walk_locs_of_file file )..., ]
    H.tabulate "locations in `layout`", result
    T?.eq result, [
        { doc_file_id: 'layout', doc_line_nr: 2, doc_loc_name: 'prologue', doc_loc_kind: 'start', doc_loc_start: 0, doc_loc_stop: 17, doc_loc_mark: 17 },
        { doc_file_id: 'layout', doc_line_nr: 10, doc_loc_name: 'prologue', doc_loc_kind: 'stop', doc_loc_start: 0, doc_loc_stop: 18, doc_loc_mark: 0 },
        { doc_file_id: 'layout', doc_line_nr: 12, doc_loc_name: 'epilogue', doc_loc_kind: 'start', doc_loc_start: 0, doc_loc_stop: 17, doc_loc_mark: 17 },
        { doc_file_id: 'layout', doc_line_nr: 12, doc_loc_name: 'epilogue', doc_loc_kind: 'stop', doc_loc_start: 56, doc_loc_stop: 74, doc_loc_mark: 56 },
        { doc_file_id: 'layout', doc_line_nr: 14, doc_loc_name: 'empty', doc_loc_kind: 'start', doc_loc_start: 8, doc_loc_stop: 22, doc_loc_mark: 22 },
        { doc_file_id: 'layout', doc_line_nr: 14, doc_loc_name: 'empty', doc_loc_kind: 'stop', doc_loc_start: 22, doc_loc_stop: 37, doc_loc_mark: 22 },
        { doc_file_id: 'layout', doc_line_nr: 15, doc_loc_name: 'single', doc_loc_kind: 'start', doc_loc_start: 8, doc_loc_stop: 24, doc_loc_mark: 24 },
        { doc_file_id: 'layout', doc_line_nr: 15, doc_loc_name: 'single', doc_loc_kind: 'stop', doc_loc_start: 8, doc_loc_stop: 24, doc_loc_mark: 24 } ]
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @doc_object_creation()
  # test @doc_object_creation
  # test @doc_document_creation
  # @doc_file_path_resolution()
  # test @doc_file_path_resolution
  # @doc_add_and_read_file()
  # test @doc_add_and_read_file
  # @doc_paragraphs()
  # test @doc_paragraphs
  # @doc_walk_locs()
  # test @doc_walk_locs
  # @doc_loc_matcher()
  # test @doc_loc_matcher
  # @doc_walk_concatenated_lines_of_files()
  # test @doc_walk_concatenated_lines_of_files
  # @doc_alternative_formulation()
  test @
