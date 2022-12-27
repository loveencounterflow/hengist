(function() {
  'use strict';
  var DBay, DEMO, Demo, Document, GUY, H, SQL, alert, br, create_document, debug, echo, freeze, help, info, inspect, isa, lets, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DATAMILL/DEMO/SERVER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  ({lets, freeze} = require('../../../apps/letsfreezethat'));

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  ({DBay, SQL} = require('../../../apps/dbay'));

  ({Document} = require('../../../apps/datamill-v2/lib/document'));

  H = require('../../../lib/helpers');

  br = function() {
    return echo('—————————————————————————————————————————————');
  };

  //-----------------------------------------------------------------------------------------------------------
  create_document = function(T, done) {
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: home_parent
      }) {
      var doc, doc_file_id, doc_file_path, file, files, home, i, len, source_path, target_path;
      home = PATH.resolve(home_parent, 'dmd');
      FS.mkdirSync(home);
      doc = new Document({home});
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
      H.tabulate("lines", doc.db(SQL`select * from doc_lines;`));
      //.......................................................................................................
      return null;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  Demo = class Demo {
    //---------------------------------------------------------------------------------------------------------
    async datamill_server() {
      var Datamill_server, db, server;
      ({Datamill_server} = require('../../../apps/datamill-v2/lib/server'));
      // { db }              = @_get_db()
      ({db} = this.create_datamill_pipeline());
      server = new Datamill_server({db});
      await server.start();
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    create_datamill_pipeline() {
      var $initialize, $my_datamill, $process, HDML, Pipeline, db, p, prepare, read_data, show, write_data;
      ({DBay} = require('../../../apps/dbay'));
      ({SQL} = DBay);
      ({Pipeline} = require('../../../apps/moonriver'));
      ({HDML} = require('../../../apps/hdml'));
      //.......................................................................................................
      show = function(db) {
        return H.tabulate("documents", db(SQL`select * from documents order by n1_lnr, n3_part;`));
      };
      //.......................................................................................................
      prepare = function(db) {
        var read_data, write_data;
        db = new DBay();
        // if ( db.all_rows SQL"select name from sqlite_schema where name = 'documents';" ).length is 0
        db(SQL`create table documents (
n1_lnr      integer not null,
n2_version  integer not null,
n3_part     integer not null,
line  text    not null,
primary key ( n1_lnr, n2_version, n3_part ) );`);
        //.....................................................................................................
        write_data = db.alt.prepare_insert({
          into: 'documents',
          on_conflict: {
            update: true
          }
        });
        read_data = db.prepare(SQL`select * from documents order by n1_lnr, n3_part;`);
        db(write_data, {
          n1_lnr: 1,
          n3_part: 1,
          n2_version: 1,
          line: "helo world"
        });
        return {db, read_data, write_data};
      };
      //.......................................................................................................
      $initialize = function() {
        var _freeze, _show, p;
        p = new Pipeline();
        p.push(_show = function(d) {
          return whisper('^34-1^', d);
        });
        p.push(_freeze = function(d) {
          return freeze(d);
        });
        return p;
      };
      //.......................................................................................................
      $process = function() {
        var _show, foobar, p;
        p = new Pipeline();
        p.push(foobar = function(d, send) {
          return send(lets(d, function(d) {
            return d.line = `*${d.line}*`;
          }));
        });
        p.push(foobar = function(d, send) {
          return send(lets(d, function(d) {
            d.line = HDML.pair('div.foo', HDML.text(d.line));
            return d.n2_version++;
          }));
        });
        p.push(_show = function(d) {
          return urge('^34-2^', d);
        });
        return p;
      };
      //.......................................................................................................
      $my_datamill = function(db, read_data, write_data) {
        var p, sink, source;
        p = new Pipeline();
        p.push(source = function*() {
          return (yield* db(read_data));
        });
        p.push($initialize());
        p.push($process());
        p.push(sink = function(d) {
          return db(write_data, d);
        });
        return p;
      };
      //.......................................................................................................
      ({db, read_data, write_data} = prepare());
      show(db);
      p = $my_datamill(db, read_data, write_data);
      info('^34-3^', p);
      p.run();
      //.......................................................................................................
      show(db);
      return {db};
    }

  };

  //===========================================================================================================
  DEMO = new Demo();

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await DEMO.datamill_server());
    })();
  }

  // DEMO.create_datamill_pipeline()

}).call(this);

//# sourceMappingURL=demo-server.js.map