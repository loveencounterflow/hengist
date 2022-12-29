(function() {
  'use strict';
  var FS, GUY, H, PATH, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper;

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

  PATH = require('node:path');

  FS = require('node:fs');

  //-----------------------------------------------------------------------------------------------------------
  this.doc_object_creation = function(T, done) {
    var DBay, Document;
    ({DBay} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    if (T != null) {
      T.eq(type_of(Document), 'class');
    }
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var db, doc;
      db = new DBay();
      doc = new Document({db, home});
      if (T != null) {
        T.ok(doc.db === db);
      }
      if (T != null) {
        T.ok(doc.cfg.prefix === 'doc_');
      }
      return debug('^5534^', doc);
    });
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var doc;
      doc = new Document({
        prefix: 'doc_',
        home
      });
      if (T != null) {
        T.eq(type_of(doc.db), 'dbay');
      }
      return T != null ? T.ok(doc.cfg.prefix === 'doc_') : void 0;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_document_creation = function(T, done) {
    var DBay, Document;
    ({DBay} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var doc;
      doc = new Document({home});
      return T != null ? T.eq(doc.get_doc_file_ids(), ['layout']) : void 0;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_file_path_resolution = function(T, done) {
    var DBay, Document;
    ({DBay} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, home;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      debug('^34-5^', {doc});
      debug('^34-5^', doc.cfg.home === home);
      if (T != null) {
        T.eq(doc.get_doc_file_abspath('.'), `${home_parent}/dmd`);
      }
      if (T != null) {
        T.eq(doc.get_doc_file_abspath('foo.md'), `${home_parent}/dmd/foo.md`);
      }
      if (T != null) {
        T.eq(doc.get_doc_file_abspath('/path/to/foo.md'), "/path/to/foo.md");
      }
      if (T != null) {
        T.eq(doc.get_doc_file_abspath('./path/to/foo.md'), `${home_parent}/dmd/path/to/foo.md`);
      }
      if (T != null) {
        T.eq(doc.get_doc_file_abspath('path/to/foo.md'), `${home_parent}/dmd/path/to/foo.md`);
      }
      //.......................................................................................................
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_add_and_read_file = function(T, done) {
    var Document, SQL;
    ({SQL} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, doc_file_id, doc_file_path, file, files, home, i, len, result, source_path, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      result = [];
      debug('^34-5^', {doc});
      files = [
        {
          doc_file_id: 'ef',
          doc_file_path: 'datamill/empty-file.txt'
        },
        {
          doc_file_id: '3n',
          doc_file_path: 'datamill/file-with-3-lines-no-eofnl.txt'
        },
        {
          doc_file_id: '3w',
          doc_file_path: 'datamill/file-with-3-lines-with-eofnl.txt'
        },
        {
          doc_file_id: '1n',
          doc_file_path: 'datamill/file-with-single-nl.txt'
        }
      ];
      for (i = 0, len = files.length; i < len; i++) {
        ({doc_file_id, doc_file_path} = files[i]);
        source_path = PATH.resolve(__dirname, '../../../assets/', doc_file_path);
        target_path = PATH.resolve(home, doc_file_path);
        FS.cpSync(source_path, target_path);
        file = doc.add_file({doc_file_id, doc_file_path});
        result.push(file);
      }
      H.tabulate("files", result);
      H.tabulate("lines", doc.db(SQL`select * from doc_raw_lines;`));
      //.......................................................................................................
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_paragraphs = function(T, done) {
    var Document, SQL;
    ({SQL} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, doc_file_id, doc_file_path, file, files, home, i, len, result, source_path, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      result = [];
      debug('^34-5^', {doc});
      files = [
        {
          doc_file_id: 'sp',
          doc_file_path: 'short-proposal.mkts.md'
        },
        {
          doc_file_id: '3p',
          doc_file_path: 'datamill/three-paragraphs.txt'
        },
        {
          doc_file_id: '3n',
          doc_file_path: 'datamill/file-with-3-lines-no-eofnl.txt'
        },
        {
          doc_file_id: '1n',
          doc_file_path: 'datamill/file-with-single-nl.txt'
        }
      ];
      for (i = 0, len = files.length; i < len; i++) {
        ({doc_file_id, doc_file_path} = files[i]);
        source_path = PATH.resolve(__dirname, '../../../assets/', doc_file_path);
        doc_file_path = PATH.basename(doc_file_path);
        target_path = PATH.resolve(home, doc_file_path);
        FS.cpSync(source_path, target_path);
        file = doc.add_file({doc_file_id, doc_file_path});
        result.push(file);
      }
      H.tabulate("files", result);
      H.tabulate("lines", doc.db(SQL`select * from doc_raw_lines;`));
      //.......................................................................................................
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_walk_concatenated_lines_of_files = function(T, done) {
    var Document, SQL;
    ({SQL} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, doc_file_id, doc_file_path, file, files, home, i, len, result, source_path, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      result = [];
      debug('^34-5^', {doc});
      files = [
        {
          doc_file_id: '3p',
          doc_file_path: 'datamill/three-paragraphs.txt'
        },
        {
          doc_file_id: '3n',
          doc_file_path: 'datamill/file-with-3-lines-no-eofnl.txt'
        },
        {
          doc_file_id: '1n',
          doc_file_path: 'datamill/file-with-single-nl.txt'
        }
      ];
      for (i = 0, len = files.length; i < len; i++) {
        ({doc_file_id, doc_file_path} = files[i]);
        source_path = PATH.resolve(__dirname, '../../../assets/', doc_file_path);
        doc_file_path = PATH.basename(doc_file_path);
        target_path = PATH.resolve(home, doc_file_path);
        FS.cpSync(source_path, target_path);
        file = doc.add_file({doc_file_id, doc_file_path});
        result.push(file);
      }
      (function() {
        var matcher;
        doc._delete_file('layout');
        matcher = doc.db.all_rows(SQL`select
    dense_rank() over w as doc_file_nr,
    *
  from doc_raw_lines
  window w as ( order by doc_file_id )
  order by doc_file_id, doc_line_nr;`);
        H.tabulate("matcher", matcher);
        return T != null ? T.eq([...doc.walk_raw_lines()], matcher) : void 0;
      })();
      (function() {
        var matcher;
        matcher = doc.db.all_rows(SQL`select 1 as doc_file_nr, * from doc_raw_lines where doc_file_id = '1n'
union all
select 2 as doc_file_nr, * from doc_raw_lines where doc_file_id = '3n'
union all
select 3 as doc_file_nr, * from doc_raw_lines where doc_file_id = '3p'
order by doc_file_nr, doc_line_nr;`);
        urge('^9856^', matcher);
        H.tabulate("matcher", matcher);
        return T != null ? T.eq([...(doc.walk_raw_lines('1n', '3n', '3p'))], matcher) : void 0;
      })();
      //.......................................................................................................
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @doc_object_creation()
      // test @doc_object_creation
      // test @doc_document_creation
      // @doc_file_path_resolution()
      // test @doc_file_path_resolution
      // @doc_add_and_read_file()
      // test @doc_add_and_read_file
      // @doc_paragraphs()
      // test @doc_paragraphs
      this.doc_walk_concatenated_lines_of_files();
      return test(this.doc_walk_concatenated_lines_of_files);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-document.js.map