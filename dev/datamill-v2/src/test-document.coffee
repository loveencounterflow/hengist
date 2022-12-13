
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


#-----------------------------------------------------------------------------------------------------------
@doc_object_creation = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  T?.eq ( type_of Document ), 'class'
  #.........................................................................................................
  do ->
    db  = new DBay()
    doc = new Document { db, }
    T?.ok doc.db is db
    T?.ok doc.cfg.prefix is 'doc_'
    debug '^5534^', doc
  #.........................................................................................................
  do ->
    doc = new Document { prefix: 'doc_', }
    T?.eq ( type_of doc.db ), 'dbay'
    T?.ok doc.cfg.prefix is 'doc_'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_document_creation = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  do ->
    doc = new Document()
    T?.eq doc.get_doc_file_ids(), []
    T?.eq doc.get_doc_fads()[ ... 3 ], [
      { doc_fad_id: 'External_file_abc', doc_fad_name: 'External_file_abc',   comment: 'abstract base class for external files' },
      { doc_fad_id: 'File_adapter_abc',  doc_fad_name: 'File_adapter_abc',    comment: 'abstract base class for files' },
      { doc_fad_id: 'xtxt',              doc_fad_name: 'External_text_file',  comment: 'adapter for external text files' } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_add_and_read_file = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  do ->
    doc   = new Document()
    file  = doc.add_file { doc_fad_id: 'xtxt', doc_file_id: 'mytxt', doc_file_path: 'somewhere', }
    debug '^34-5^', { file, }
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # test @doc_object_creation
  # test @doc_document_creation
  @doc_add_and_read_file()
