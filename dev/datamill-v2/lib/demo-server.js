(function() {
  'use strict';
  var DEMO, Demo, Document, FS, GUY, H, PATH, SQL, alert, br, create_document, debug, echo, freeze, help, info, inspect, isa, lets, log, mkdirp, plain, praise, rpr, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DATAMILL/DEMO/SERVER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  ({lets, freeze} = require('../../../apps/letsfreezethat'));

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  ({SQL} = require('../../../apps/dbay'));

  ({Document} = require('../../../apps/datamill-v2/lib/document'));

  H = require('../../../lib/helpers');

  br = function() {
    return echo('—————————————————————————————————————————————');
  };

  PATH = require('node:path');

  FS = require('node:fs');

  mkdirp = require('mkdirp');

  //-----------------------------------------------------------------------------------------------------------
  create_document = function(T, done) {
    var assets_home, data_home, doc, doc_file_id, doc_file_path, file, files, home, i, len, read_data, source_home, source_path, target_home, target_path, write_data;
    // { rm, path: home_parent, } = GUY.temp.create_directory { prefix: 'dmdoc-', }
    // GUY.process.on_exit -> warn "removing #{home_parent}"; rm()
    assets_home = PATH.resolve(__dirname, '../../../assets');
    data_home = PATH.resolve(__dirname, '../../../data');
    source_home = PATH.resolve(assets_home, 'datamill');
    target_home = PATH.resolve(data_home, 'datamill');
    home = PATH.resolve(target_home, 'dmdoc');
    info('^34-1^', 'assets_home: ', assets_home);
    info('^34-1^', 'data_home:   ', data_home);
    info('^34-1^', 'source_home: ', source_home);
    info('^34-1^', 'target_home: ', target_home);
    info('^34-1^', 'home:        ', home);
    mkdirp.sync(target_home);
    if (FS.existsSync(home)) {
      FS.rmSync(home, {
        recursive: true
      });
    }
    mkdirp.sync(home);
    warn(`created ${home}`);
    //.........................................................................................................
    doc = new Document({home});
    files = [
      {
        doc_file_id: 'f1',
        doc_file_path: 'datamill/demo1.mkts.md'
      },
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
      source_path = PATH.resolve(assets_home, doc_file_path);
      doc_file_path = PATH.basename(doc_file_path);
      target_path = PATH.resolve(home, doc_file_path);
      FS.cpSync(source_path, target_path);
      file = doc.add_file({doc_file_id, doc_file_path});
    }
    // H.tabulate "files", doc.db SQL"select * from doc_files;"
    // H.tabulate "lines", doc.db SQL"select * from doc_lines;"
    //.........................................................................................................
    read_data = doc.db.prepare(SQL`select * from doc_lines order by 1, 2;`);
    /* NOTE writing postponed */
    // write_data      = doc.db.alt.prepare_insert { into: 'doc_lines', on_conflict: { update: true, }, }
    write_data = null;
    return {doc, read_data, write_data};
  };

  //===========================================================================================================
  Demo = class Demo {
    //---------------------------------------------------------------------------------------------------------
    async datamill_server() {
      var Datamill_server, doc, server;
      ({Datamill_server} = require('../../../apps/datamill-v2/lib/server'));
      ({doc} = this.create_datamill_pipeline());
      server = new Datamill_server({doc});
      await server.start();
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    create_datamill_pipeline() {
      var $initialize, $my_datamill, $process, HDML, Pipeline, doc, p, read_data, show, write_data;
      ({Pipeline} = require('../../../apps/moonriver'));
      ({HDML} = require('../../../apps/hdml'));
      //.......................................................................................................
      show = function(doc) {
        return H.tabulate("doc_lines", doc.db(SQL`select * from doc_lines order by 1, 2;`));
      };
      //.......................................................................................................
      $initialize = function() {
        var _freeze, p;
        p = new Pipeline();
        // p.push _show    = ( d ) -> whisper '^34-1^', d
        p.push(_freeze = function(d) {
          return freeze(d);
        });
        return p;
      };
      //.......................................................................................................
      $process = function() {
        var foobar, p;
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
        // p.push _show    = ( d ) -> urge '^34-2^', d
        return p;
      };
      //.......................................................................................................
      $my_datamill = function(doc, read_data, write_data) {
        var p, source;
        p = new Pipeline();
        p.push(source = function*() {
          return (yield* doc.db(read_data));
        });
        p.push($initialize());
        p.push($process());
        // p.push sink = ( d ) -> doc.db write_data, d
        return p;
      };
      //.......................................................................................................
      ({doc, read_data, write_data} = create_document());
      p = $my_datamill(doc, read_data, write_data);
      info('^34-3^', p);
      p.run();
      //.......................................................................................................
      // show doc
      return {doc};
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
// create_document()

}).call(this);

//# sourceMappingURL=demo-server.js.map