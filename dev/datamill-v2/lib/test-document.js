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
      return T != null ? T.ok(doc.db === db) : void 0;
    });
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var doc;
      doc = new Document({home});
      return T != null ? T.eq(type_of(doc.db), 'dbay') : void 0;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_document_creation = function(T, done) {
    var Document;
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var doc;
      doc = new Document({home});
      return T != null ? T.eq(doc.get_doc_src_ids(), ['layout']) : void 0;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_src_path_resolution = function(T, done) {
    var Document;
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, home;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      // debug '^34-5^', { doc, }
      // debug '^34-5^', doc.cfg.home is home
      if (T != null) {
        T.eq(doc.get_doc_src_abspath('.'), `${home_parent}/dmd`);
      }
      if (T != null) {
        T.eq(doc.get_doc_src_abspath('foo.md'), `${home_parent}/dmd/foo.md`);
      }
      if (T != null) {
        T.eq(doc.get_doc_src_abspath('/path/to/foo.md'), "/path/to/foo.md");
      }
      if (T != null) {
        T.eq(doc.get_doc_src_abspath('./path/to/foo.md'), `${home_parent}/dmd/path/to/foo.md`);
      }
      if (T != null) {
        T.eq(doc.get_doc_src_abspath('path/to/foo.md'), `${home_parent}/dmd/path/to/foo.md`);
      }
      //.......................................................................................................
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_add_and_read_source = function(T, done) {
    var Document, SQL;
    ({SQL} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, doc_src_id, doc_src_path, home, i, len, result, source, source_path, sources, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      result = [];
      // debug '^34-5^', { doc, }
      sources = [
        {
          doc_src_id: 'ef',
          doc_src_path: 'datamill/empty-file.txt'
        },
        {
          doc_src_id: '3n',
          doc_src_path: 'datamill/file-with-3-lines-no-eofnl.txt'
        },
        {
          doc_src_id: '3w',
          doc_src_path: 'datamill/file-with-3-lines-with-eofnl.txt'
        },
        {
          doc_src_id: '1n',
          doc_src_path: 'datamill/file-with-single-nl.txt'
        }
      ];
      for (i = 0, len = sources.length; i < len; i++) {
        ({doc_src_id, doc_src_path} = sources[i]);
        source_path = PATH.resolve(__dirname, '../../../assets/', doc_src_path);
        target_path = PATH.resolve(home, doc_src_path);
        FS.cpSync(source_path, target_path);
        source = doc.add_source({doc_src_id, doc_src_path});
        result.push(source);
      }
      H.tabulate("sources", result);
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
      var doc, doc_src_id, doc_src_path, home, i, len, result, source, source_path, sources, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      result = [];
      // debug '^34-5^', { doc, }
      sources = [
        {
          doc_src_id: 'sp',
          doc_src_path: 'short-proposal.mkts.md'
        },
        {
          doc_src_id: '3p',
          doc_src_path: 'datamill/three-paragraphs.txt'
        },
        {
          doc_src_id: '3n',
          doc_src_path: 'datamill/file-with-3-lines-no-eofnl.txt'
        },
        {
          doc_src_id: '1n',
          doc_src_path: 'datamill/file-with-single-nl.txt'
        }
      ];
      for (i = 0, len = sources.length; i < len; i++) {
        ({doc_src_id, doc_src_path} = sources[i]);
        source_path = PATH.resolve(__dirname, '../../../assets/', doc_src_path);
        doc_src_path = PATH.basename(doc_src_path);
        target_path = PATH.resolve(home, doc_src_path);
        FS.cpSync(source_path, target_path);
        source = doc.add_source({doc_src_id, doc_src_path});
        result.push(source);
      }
      H.tabulate("sources", result);
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
      var doc, doc_src_id, doc_src_path, home, i, len, result, source, source_path, sources, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
      result = [];
      // debug '^34-5^', { doc, }
      sources = [
        {
          doc_src_id: '3p',
          doc_src_path: 'datamill/three-paragraphs.txt'
        },
        {
          doc_src_id: '3n',
          doc_src_path: 'datamill/file-with-3-lines-no-eofnl.txt'
        },
        {
          doc_src_id: '1n',
          doc_src_path: 'datamill/file-with-single-nl.txt'
        }
      ];
      for (i = 0, len = sources.length; i < len; i++) {
        ({doc_src_id, doc_src_path} = sources[i]);
        source_path = PATH.resolve(__dirname, '../../../assets/', doc_src_path);
        doc_src_path = PATH.basename(doc_src_path);
        target_path = PATH.resolve(home, doc_src_path);
        FS.cpSync(source_path, target_path);
        source = doc.add_source({doc_src_id, doc_src_path});
        result.push(source);
      }
      (function() {
        return T != null ? T.eq([...(doc.walk_raw_lines([]))], []) : void 0;
      })();
      (function() {
        var matcher;
        matcher = doc.db.all_rows(SQL`select 1 as doc_src_nr, * from doc_raw_lines where doc_src_id = '1n'
union all
select 2 as doc_src_nr, * from doc_raw_lines where doc_src_id = '3n'
union all
select 3 as doc_src_nr, * from doc_raw_lines where doc_src_id = '3p'
order by doc_src_nr, doc_line_nr;`);
        // urge '^9856^', matcher
        // H.tabulate "matcher", matcher
        // H.tabulate "select * from doc_raw_lines", doc.db SQL"select * from doc_raw_lines;"
        H.tabulate("doc.walk_raw_lines '1n', '3n', '3p'", doc.walk_raw_lines('1n', '3n', '3p'));
        return T != null ? T.eq([...(doc.walk_raw_lines('1n', '3n', '3p'))], matcher) : void 0;
      })();
      //.......................................................................................................
      // H.tabulate "view doc_raw_lines", doc.db SQL"select * from doc_raw_lines;"
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_loc_matcher = async function(T, done) {
    var SQL, error, get_document_types, i, len, matcher, pattern, probe, probes_and_matchers;
    ({SQL} = require('../../../apps/dbay'));
    ({get_document_types} = require('../../../apps/datamill-v2/lib/types'));
    types = get_document_types();
    pattern = types.registry.doc_document_cfg.default._loc_marker_re;
    //.........................................................................................................
    probes_and_matchers = [
      [
        "<dm:loc#prologue>",
        [
          {
            left_slash: '',
            doc_loc_id: 'prologue',
            right_slash: ''
          }
        ]
      ],
      [
        "<dm:loc#prologue/>",
        [
          {
            left_slash: '',
            doc_loc_id: 'prologue',
            right_slash: '/'
          }
        ]
      ],
      [
        "</dm:loc#prologue>",
        [
          {
            left_slash: '/',
            doc_loc_id: 'prologue',
            right_slash: ''
          }
        ]
      ],
      [
        "</dm:loc#prologue/>",
        [
          {
            left_slash: '/',
            doc_loc_id: 'prologue',
            right_slash: '/'
          }
        ]
      ],
      [
        "<dm:loc#L1/>xxx<dm:loc#L2/>",
        [
          {
            left_slash: '',
            doc_loc_id: 'L1',
            right_slash: '/'
          },
          {
            left_slash: '',
            doc_loc_id: 'L2',
            right_slash: '/'
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var m, result;
          result = [...(probe.matchAll(pattern))];
          result = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              m = result[j];
              results.push({...m.groups});
            }
            return results;
          })();
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.doc_walk_locs = function(T, done) {
    var Document, SQL, matcher;
    ({SQL} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    matcher = [
      {
        doc_src_id: 'lt',
        doc_line_nr: 1,
        doc_loc_id: '*',
        doc_loc_kind: 'start',
        doc_loc_start: 0,
        doc_loc_stop: 0,
        doc_loc_mark: 0
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 18,
        doc_loc_id: '*',
        doc_loc_kind: 'stop',
        doc_loc_start: 0,
        doc_loc_stop: 0,
        doc_loc_mark: 0
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 2,
        doc_loc_id: 'prologue',
        doc_loc_kind: 'start',
        doc_loc_start: 0,
        doc_loc_stop: 17,
        doc_loc_mark: 17
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 10,
        doc_loc_id: 'prologue',
        doc_loc_kind: 'stop',
        doc_loc_start: 0,
        doc_loc_stop: 18,
        doc_loc_mark: 0
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 12,
        doc_loc_id: 'epilogue',
        doc_loc_kind: 'start',
        doc_loc_start: 0,
        doc_loc_stop: 17,
        doc_loc_mark: 17
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 12,
        doc_loc_id: 'epilogue',
        doc_loc_kind: 'stop',
        doc_loc_start: 56,
        doc_loc_stop: 74,
        doc_loc_mark: 56
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 14,
        doc_loc_id: 'empty',
        doc_loc_kind: 'start',
        doc_loc_start: 8,
        doc_loc_stop: 22,
        doc_loc_mark: 22
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 14,
        doc_loc_id: 'empty',
        doc_loc_kind: 'stop',
        doc_loc_start: 22,
        doc_loc_stop: 37,
        doc_loc_mark: 22
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 15,
        doc_loc_id: 'single',
        doc_loc_kind: 'start',
        doc_loc_start: 8,
        doc_loc_stop: 24,
        doc_loc_mark: 24
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 15,
        doc_loc_id: 'single',
        doc_loc_kind: 'stop',
        doc_loc_start: 8,
        doc_loc_stop: 24,
        doc_loc_mark: 24
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 17,
        doc_loc_id: 'one',
        doc_loc_kind: 'start',
        doc_loc_start: 3,
        doc_loc_stop: 15,
        doc_loc_mark: 15
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 17,
        doc_loc_id: 'one',
        doc_loc_kind: 'stop',
        doc_loc_start: 18,
        doc_loc_stop: 31,
        doc_loc_mark: 18
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 17,
        doc_loc_id: 'two',
        doc_loc_kind: 'start',
        doc_loc_start: 34,
        doc_loc_stop: 46,
        doc_loc_mark: 46
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 17,
        doc_loc_id: 'two',
        doc_loc_kind: 'stop',
        doc_loc_start: 49,
        doc_loc_stop: 62,
        doc_loc_mark: 49
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 17,
        doc_loc_id: 'three',
        doc_loc_kind: 'start',
        doc_loc_start: 65,
        doc_loc_stop: 79,
        doc_loc_mark: 79
      },
      {
        doc_src_id: 'lt',
        doc_line_nr: 17,
        doc_loc_id: 'three',
        doc_loc_kind: 'stop',
        doc_loc_start: 84,
        doc_loc_stop: 99,
        doc_loc_mark: 84
      }
    ];
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var doc, doc_src_id, doc_src_path, i, len, source, sources;
      doc = new Document({home});
      sources = [
        {
          doc_src_id: 'lt',
          doc_src_path: 'datamill/layout.dm.html'
        }
      ];
      for (i = 0, len = sources.length; i < len; i++) {
        ({doc_src_id, doc_src_path} = sources[i]);
        doc_src_path = PATH.resolve(__dirname, '../../../assets/', doc_src_path);
        source = doc.add_source({doc_src_id, doc_src_path});
      }
      (function() {
        var result;
        result = [...(doc._walk_locs_of_source(source))];
        H.tabulate("locations in `layout.dm.html`", result);
        H.tabulate("matcher", matcher);
        if (T != null) {
          T.eq(result, matcher);
        }
        return null;
      })();
      return (function() {
        var result;
        matcher.sort(function(a, b) {
          if (a.doc_line_nr > b.doc_line_nr) {
            return +1;
          }
          if (a.doc_line_nr < b.doc_line_nr) {
            return -1;
          }
          if (a.doc_loc_start > b.doc_loc_start) {
            return +1;
          }
          if (a.doc_loc_start < b.doc_loc_start) {
            return -1;
          }
          return 0;
        });
        result = [
          ...(doc.db.all_rows(SQL`select
    *
  from doc_locs
  where doc_src_id = 'lt'
  order by doc_line_nr, doc_loc_start;`))
        ];
        H.tabulate("locations in `layout`", result);
        if (T != null) {
          T.eq(result, matcher);
        }
        return null;
      })();
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.___________doc_walk_lines_of_regions = function(T, done) {
    var Document, SQL;
    ({SQL} = require('../../../apps/dbay'));
    ({Document} = require('../../../apps/datamill-v2/lib/document'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home
      }) {
      var doc, doc_src_id, doc_src_path, i, j, len, len1, line, ref, results, source, sources;
      doc = new Document({home});
      sources = [
        {
          doc_src_id: 'lt',
          doc_src_path: 'datamill/layout.dm.html'
        }
      ];
      for (i = 0, len = sources.length; i < len; i++) {
        ({doc_src_id, doc_src_path} = sources[i]);
        doc_src_path = PATH.resolve(__dirname, '../../../assets/', doc_src_path);
        source = doc.add_source({doc_src_id, doc_src_path});
      }
      ref = doc.walk_loc_lines('lt#prologue');
      results = [];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        line = ref[j];
        results.push(debug('^56-1^', rpr(line)));
      }
      return results;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @doc_object_creation()
      // test @doc_object_creation
      // test @doc_document_creation
      // @doc_src_path_resolution()
      // test @doc_src_path_resolution
      // @doc_add_and_read_file()
      // test @doc_add_and_read_file
      // @doc_paragraphs()
      // test @doc_paragraphs
      // @doc_walk_locs()
      // test @doc_walk_locs
      // @doc_loc_matcher()
      // test @doc_loc_matcher
      // @doc_walk_concatenated_lines_of_files()
      // test @doc_walk_concatenated_lines_of_files
      // @doc_alternative_formulation()
      // @___________doc_walk_lines_of_regions()
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-document.js.map