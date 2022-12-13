(function() {
  'use strict';
  var GUY, H, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DATAMILL/TESTS/DOCUMENT'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.doc_object_creation = function(T, done) {
    var DBay, Document;
    ({DBay} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    if (T != null) {
      T.eq(type_of(Document), 'class');
    }
    (function() {      //.........................................................................................................
      var db, doc;
      db = new DBay();
      doc = new Document({db});
      if (T != null) {
        T.ok(doc.db === db);
      }
      if (T != null) {
        T.ok(doc.cfg.prefix === 'doc_');
      }
      return debug('^5534^', doc);
    })();
    (function() {      //.........................................................................................................
      var doc;
      doc = new Document({
        prefix: 'doc_'
      });
      if (T != null) {
        T.eq(type_of(doc.db), 'dbay');
      }
      return T != null ? T.ok(doc.cfg.prefix === 'doc_') : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_document_creation = function(T, done) {
    var DBay, Document;
    ({DBay} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    (function() {      //.........................................................................................................
      var doc;
      doc = new Document();
      if (T != null) {
        T.eq(doc.get_doc_file_ids(), []);
      }
      return T != null ? T.eq(doc.get_doc_fads().slice(0, 3), [
        {
          doc_fad_id: 'External_file_abc',
          doc_fad_name: 'External_file_abc',
          comment: 'abstract base class for external files'
        },
        {
          doc_fad_id: 'File_adapter_abc',
          doc_fad_name: 'File_adapter_abc',
          comment: 'abstract base class for files'
        },
        {
          doc_fad_id: 'xtxt',
          doc_fad_name: 'External_text_file',
          comment: 'adapter for external text files'
        }
      ]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_add_and_read_file = function(T, done) {
    var DBay, Document;
    ({DBay} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    (function() {      //.........................................................................................................
      var doc, file;
      doc = new Document();
      file = doc.add_file({
        doc_fad_id: 'xtxt',
        doc_file_id: 'mytxt',
        doc_file_path: 'somewhere'
      });
      return debug('^34-5^', {file});
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @doc_object_creation
      // test @doc_document_creation
      return this.doc_add_and_read_file();
    })();
  }

}).call(this);

//# sourceMappingURL=test-document.js.map