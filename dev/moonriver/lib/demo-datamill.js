(function() {
  'use strict';
  var GUY, H, alert, br, debug, demo_concurrency_with_two_connections, demo_datamill_pipeline, echo, freeze, help, info, inspect, isa, lets, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  br = function() {
    return echo('—————————————————————————————————————————————');
  };

  H = require('../../../lib/helpers');

  ({lets, freeze} = require('../../../apps/letsfreezethat'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_concurrency_with_two_connections = function() {
    var $, DBay, Pipeline, SQL, T, d, dbr, dbw, insert_number, ref;
    br();
    ({
      Pipeline,
      transforms: T,
      $
    } = require('../../../apps/moonriver'));
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    dbr = new DBay();
    dbw = new DBay({
      path: dbr.cfg.path
    });
    // dbr.set_journal_mode 'delete'
    // dbw.set_journal_mode 'delete'
    //.........................................................................................................
    dbr(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
    insert_number = dbw.prepare_insert({
      into: 'numbers',
      on_conflict: {
        update: true
      }
    });
    //.........................................................................................................
    dbr(function() {
      var i, n, results;
      results = [];
      for (n = i = 0; i <= 10; n = ++i) {
        results.push(dbr(insert_number, {
          n,
          sqr: null
        }));
      }
      return results;
    });
    //.........................................................................................................
    H.tabulate("numbers", dbr(SQL`select * from numbers order by n;`));
    ref = dbr(SQL`select * from numbers order by n;`);
    //.........................................................................................................
    // dbr.with_transaction ->
    for (d of ref) {
      d.sqr = d.n ** 2;
      dbw(insert_number, d);
      d.n = d.n + 100;
      d.sqr = d.n ** 2;
      dbw(insert_number, d);
    }
    //.........................................................................................................
    H.tabulate("numbers", dbr(SQL`select * from numbers order by n;`));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_datamill_pipeline = function() {
    var $initialize, $my_datamill, $process, DBay, Pipeline, SQL, db, p, prepare, read_data, show, write_data;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    ({Pipeline} = require('../../../apps/moonriver'));
    //.........................................................................................................
    show = function(db) {
      return H.tabulate("texts", db(SQL`select * from texts order by lnr, part;`));
    };
    //.........................................................................................................
    prepare = function(db) {
      var read_data, write_data;
      db = new DBay();
      // if ( db.all_rows SQL"select name from sqlite_schema where name = 'texts';" ).length is 0
      db(SQL`create table texts (
lnr   integer not null,
part  integer not null,
line  text    not null,
primary key ( lnr, part ) );`);
      //.......................................................................................................
      write_data = db.prepare_insert({
        into: 'texts',
        on_conflict: {
          update: true
        }
      });
      read_data = db.prepare(SQL`select * from texts order by lnr, part;`);
      db(write_data, {
        lnr: 1,
        part: 1,
        line: "helo world"
      });
      return {db, read_data, write_data};
    };
    //.........................................................................................................
    $initialize = function() {
      var _freeze, _show, p;
      p = new Pipeline();
      p.push(_show = function(d) {
        return whisper('^22-1^', d);
      });
      p.push(_freeze = function(d) {
        return freeze(d);
      });
      return p;
    };
    //.........................................................................................................
    $process = function() {
      var _show, foobar, p;
      p = new Pipeline();
      p.push(foobar = function(d, send) {
        return send(lets(d, function(d) {
          return d.line = `*${d.line}*`;
        }));
      });
      p.push(_show = function(d) {
        return urge('^22-1^', d);
      });
      return p;
    };
    //.........................................................................................................
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
    //.........................................................................................................
    ({db, read_data, write_data} = prepare());
    show(db);
    p = $my_datamill(db, read_data, write_data);
    p.run();
    //.........................................................................................................
    show(db);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_datamill_pipeline();
    })();
  }

  // demo_concurrency_with_two_connections()

}).call(this);

//# sourceMappingURL=demo-datamill.js.map