(function() {
  'use strict';
  var DBay, DEMO, Demo, GUY, H, SQL, alert, br, debug, echo, freeze, help, info, inspect, isa, lets, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DATAMILL/DEMO/SERVER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  ({lets, freeze} = require('../../../apps/letsfreezethat'));

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  H = require('../../../lib/helpers');

  br = function() {
    return echo('—————————————————————————————————————————————');
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

    // #---------------------------------------------------------------------------------------------------------
    // _get_db: ->
    //   db      = new DBay()
    //   db SQL"""create table documents (
    //     n1_lnr      integer not null,
    //     n2_version  integer not null,
    //     n3_part     integer not null,
    //     line  text    not null,
    //     primary key ( n1_lnr, n2_version, n3_part ) );"""
    //   #.......................................................................................................
    //   write_data  = db.prepare_insert { into: 'documents', on_conflict: { update: true, }, }
    //   read_data   = db.prepare SQL"""select * from documents order by n1_lnr, n3_part;"""
    //   db write_data, { n1_lnr: 1, n3_part: 1, n2_version: 1, line: "helo world", }
    //   return { db, read_data, write_data, }

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
        write_data = db.prepare_insert({
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