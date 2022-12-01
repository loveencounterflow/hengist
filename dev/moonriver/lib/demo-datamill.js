(function() {
  'use strict';
  var GUY, H, alert, br, debug, demo_configurable_concurrent_writes, demo_datamill, echo, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

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

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_datamill = function() {
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
    // db.sqlt1.unsafeMode true
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
  demo_configurable_concurrent_writes = function() {
    var DBay, SQL, db, my_path, prepare, show;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    //.........................................................................................................
    my_path = '/tmp/helo.db';
    db = new DBay({
      path: my_path
    });
    //.........................................................................................................
    show = function(db) {
      return H.tabulate("numbers", db(SQL`select * from numbers order by n;`));
    };
    //.........................................................................................................
    prepare = function() {
      var i, insert_number, n, results;
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
      results = [];
      for (n = i = 0; i <= 10; n = ++i) {
        results.push(db(insert_number, {
          n,
          sqr: null
        }));
      }
      return results;
    };
    (function() {      //.........................................................................................................
      var insert_numbers, reader, writer;
      prepare();
      show(db);
      reader = db.prepare(SQL`select * from numbers order by n;`);
      insert_numbers = null;
      //.......................................................................................................
      writer = function(db, d) {
        if (insert_numbers == null) {
          insert_numbers = db.prepare_insert({
            into: 'numbers',
            on_conflict: {
              update: true
            }
          });
        }
        d.sqr = d.n ** 2;
        db(insert_numbers, d);
        return null;
      };
      db = db.with_concurrent({
        mode: 'shadow',
        reader,
        writer
      });
      return show(db);
    })();
    (function() {      //.........................................................................................................
      var insert_numbers, reader, writer;
      prepare();
      show(db);
      reader = db.prepare(SQL`select * from numbers order by n;`);
      insert_numbers = null;
      //.......................................................................................................
      writer = function(db, d) {
        if (insert_numbers == null) {
          insert_numbers = db.prepare_insert({
            into: 'numbers',
            on_conflict: {
              update: true
            }
          });
        }
        d.sqr = d.n ** 2;
        db(insert_numbers, d);
        return null;
      };
      db = db.with_concurrent({
        mode: 'reader',
        reader,
        writer
      });
      return show(db);
    })();
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await demo_datamill()
      return demo_configurable_concurrent_writes();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-datamill.js.map