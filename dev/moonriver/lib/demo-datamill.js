(function() {
  'use strict';
  var GUY, H, alert, br, debug, demo_concurrency_with_two_connections, demo_concurrency_with_unsafe_mode, demo_concurrent_writes, echo, freeze, help, info, inspect, isa, lets, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

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
  demo_concurrency_with_unsafe_mode = function() {
    var $, DBay, Pipeline, SQL, T, db, insert_number, iterator, p;
    br();
    ({
      Pipeline,
      transforms: T,
      $
    } = require('../../../apps/moonriver'));
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    db = new DBay();
    db.pragma(SQL`journal_mode = wal;`);
    //.........................................................................................................
    db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
    insert_number = db.prepare_insert({
      into: 'numbers',
      on_conflict: {
        update: true
      }
    });
    //.........................................................................................................
    db(function() {
      var i, n, results;
      results = [];
      for (n = i = 0; i <= 10; n = ++i) {
        results.push(db(insert_number, {
          n,
          sqr: null
        }));
      }
      return results;
    });
    //.........................................................................................................
    p = new Pipeline({
      protocol: true
    });
    p.push(function(d) {
      return d.sqr = d.n ** 2;
    });
    p.push(function(d) {
      return urge('^35^', d);
    });
    iterator = p.walk();
    db.with_unsafe_mode(function() {
      // mode = 'deferred' # 'deferred', 'immediate', 'exclusive'
      // mode = 'immediate' # 'deferred', 'immediate', 'exclusive'
      // mode = 'exclusive' # 'deferred', 'immediate', 'exclusive'
      // db.with_transaction { mode, }, ->
      db.pragma(SQL`journal_mode = wal;`);
      return db.with_transaction(function() {
        var d, done, e, ref, results;
        ref = db(SQL`select * from numbers order by n;`);
        results = [];
        for (d of ref) {
          debug('^35^', d);
          p.send(d);
          ({
            value: e,
            done
          } = iterator.next());
          db(insert_number, e);
          if (done) {
            break;
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    });
    //.........................................................................................................
    H.tabulate("numbers", db(SQL`select * from numbers order by n;`));
    //.........................................................................................................
    return null;
  };

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
  demo_concurrent_writes = function() {
    var $initialize, $my_datamill, $process, $sink, DBay, Pipeline, SQL, db, insert_numbers, prepare, read_numbers, show;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    ({Pipeline} = require('../../../apps/moonriver'));
    //.........................................................................................................
    show = function(db) {
      return H.tabulate("numbers", db(SQL`select * from numbers order by n;`));
    };
    //.........................................................................................................
    prepare = function(db) {
      var i, insert_number, n;
      if ((db.all_rows(SQL`select name from sqlite_schema where name = 'numbers';`)).length === 0) {
        db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
      }
      //.......................................................................................................
      insert_number = db.prepare_insert({
        into: 'numbers',
        on_conflict: {
          update: true
        }
      });
      for (n = i = 0; i <= 10; n = ++i) {
        db(insert_number, {
          n,
          sqr: null
        });
      }
      return null;
    };
    //.........................................................................................................
    db = new DBay();
    prepare(db);
    show(db);
    read_numbers = db.prepare(SQL`select * from numbers order by n;`);
    insert_numbers = db.prepare_insert({
      into: 'numbers',
      on_conflict: {
        update: true
      }
    });
    //.........................................................................................................
    $initialize = function() {
      var _freeze, _show, p;
      p = new Pipeline();
      p.push(_show = function(d) {
        return urge('^22-1^', d);
      });
      p.push(_freeze = function(d) {
        return freeze(d);
      });
      return p;
    };
    //.........................................................................................................
    $process = function() {
      var p, square;
      p = new Pipeline();
      p.push(square = function(d, send) {
        return send(lets(d, function(d) {
          return d.sqr = d.n ** 2;
        }));
      });
      return p;
    };
    //.........................................................................................................
    $sink = function(write_data) {
      var _sink;
      return _sink = function(d) {
        return write_data(d);
      };
    };
    //.........................................................................................................
    $my_datamill = function(read_data, write_data) {
      var p;
      p = new Pipeline();
      p.push(function*() {
        return (yield* db(read_data));
      });
      p.push($initialize());
      p.push($process());
      p.push($sink(write_data));
      return p;
    };
    //.........................................................................................................
    db.with_deferred_write(function(write) {
      var p, write_data;
      write_data = function(d) {
        return write(insert_numbers, d);
      };
      p = $my_datamill(read_numbers, write_data);
      return p.run();
    });
    //.........................................................................................................
    show(db);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_concurrent_writes()
      return demo_concurrency_with_two_connections();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-datamill.js.map