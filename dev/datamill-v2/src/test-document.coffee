
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
    debug '^5534^', doc
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
    debug '^34-5^', { doc, }
    debug '^34-5^', doc.cfg.home is home
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
    debug '^34-5^', { doc, }
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
    debug '^34-5^', { doc, }
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
  test @
