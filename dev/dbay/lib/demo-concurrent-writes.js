(function() {
  'use strict';
  var CND, GUY, H, PATH, X, after, badge, cease, debug, defer, demo_concurrent_writes_block_and_error_out, demo_concurrent_writes_with_implicit_transactions_multiple_connections, demo_concurrent_writes_with_implicit_transactions_single_connection, echo, equals, every, help, info, isa, rpr, sleep, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/DEMOS/CONCURRENT-WRITES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  H = require('../../../lib/helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  GUY = require('../../../apps/guy');

  X = require('../../../lib/helpers');

  ({every, after, sleep, defer, cease} = GUY.async);

  //-----------------------------------------------------------------------------------------------------------
  demo_concurrent_writes_block_and_error_out = async function() {
    var DBay, SQL, count, insert_numbers, insert_one, insert_two, p1, p2, path, show_table;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/concurrent-writes.sqlite'));
    count = 0;
    insert_numbers = null;
    (() => {      //.........................................................................................................
      var db;
      db = new DBay({path});
      db(() => {
        return db(SQL`drop table if exists c;
create table c (
    count integer not null,
    src   text    not null,
    n     integer not null,
    s     integer not null,
  primary key ( src, n ) );`);
      });
      return insert_numbers = db.create_insert({
        into: 'c',
        returning: '*'
      });
    })();
    //.........................................................................................................
    show_table = () => {
      var db;
      db = new DBay({path});
      return H.tabulate("two c", db(SQL`select * from c order by src, n;`));
    };
    //.........................................................................................................
    insert_one = async() => {
      var db, error, i, n, row, s, src;
      db = new DBay({path});
      db.begin_transaction();
      urge('^603-1^', "start one");
      await sleep(0.1);
      src = 'one';
      for (n = i = 1; i <= 10; n = ++i) {
        count++;
        s = n ** 2;
        row = {count, src, n, s};
        try {
          // show_table()
          row = db.single_row(insert_numbers, row);
        } catch (error1) {
          error = error1;
          warn('^603-1^', error.message, row);
        }
        help('^603-one^', db.single_value(SQL`select count(*) from c;`));
        await sleep(0.1);
        db.commit_transaction();
      }
      // loop
      //   error = null
      //   try db.commit_transaction() catch error
      //     warn '^603-1^', error.message
      //   break unless error?
      return null;
    };
    //.........................................................................................................
    insert_two = async() => {
      var db, error, i, n, row, s, src;
      db = new DBay({path});
      db.begin_transaction();
      urge('^603-1^', "start two");
      await sleep(0.1);
      src = 'two';
      for (n = i = 1; i <= 10; n = ++i) {
        count++;
        s = n ** 2;
        row = {count, src, n, s};
        try {
          // show_table()
          row = db.single_row(insert_numbers, row);
        } catch (error1) {
          error = error1;
          warn('^603-2^', error.message, row);
        }
        help('^603-two^', db.single_value(SQL`select count(*) from c;`));
        await sleep(0.1);
      }
      db.commit_transaction();
      return null;
    };
    //.........................................................................................................
    p1 = () => {
      return new Promise((resolve) => {
        return after(0.5, async() => {
          await insert_one();
          return resolve();
        });
      });
    };
    //.........................................................................................................
    p2 = () => {
      return new Promise((resolve) => {
        return after(0.5, async() => {
          await insert_two();
          return resolve();
        });
      });
    };
    await (() => {      //.........................................................................................................
      return new Promise((resolve) => {
        return (Promise.all([p1(), p2()])).then(() => {
          var db;
          db = new DBay({path});
          H.tabulate("c", db(SQL`select * from c order by src, n;`));
          return resolve();
        });
      });
    })();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_concurrent_writes_with_implicit_transactions_multiple_connections = async function() {
    var DBay, SQL, count, insert_numbers, insert_one, insert_two, p1, p2, path, show_table;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/concurrent-writes.sqlite'));
    count = 0;
    insert_numbers = null;
    (() => {      //.........................................................................................................
      var db;
      db = new DBay({path});
      db(() => {
        return db(SQL`drop table if exists c;
create table c (
    count integer not null,
    src   text    not null,
    n     integer not null,
    s     integer not null,
  primary key ( src, n ) );`);
      });
      return insert_numbers = db.create_insert({
        into: 'c',
        returning: '*'
      });
    })();
    //.........................................................................................................
    show_table = () => {
      var db;
      db = new DBay({path});
      return H.tabulate("two c", db(SQL`select * from c order by src, n;`));
    };
    //.........................................................................................................
    insert_one = async() => {
      var db, error, i, n, row, s, src;
      db = new DBay({path});
      urge('^603-1^', "start one");
      src = 'one';
      for (n = i = 1; i <= 10; n = ++i) {
        count++;
        s = n ** 2;
        row = {count, src, n, s};
        try {
          // show_table()
          row = db.single_row(insert_numbers, row);
        } catch (error1) {
          error = error1;
          warn('^603-1^', error.message, row);
        }
        help('^603-one^', db.single_value(SQL`select count(*) from c;`));
        await defer();
      }
      return null;
    };
    //.........................................................................................................
    insert_two = async() => {
      var db, error, i, n, row, s, src;
      db = new DBay({path});
      urge('^603-1^', "start two");
      src = 'two';
      for (n = i = 1; i <= 10; n = ++i) {
        count++;
        s = n ** 2;
        row = {count, src, n, s};
        try {
          // show_table()
          row = db.single_row(insert_numbers, row);
        } catch (error1) {
          error = error1;
          warn('^603-2^', error.message, row);
        }
        help('^603-two^', db.single_value(SQL`select count(*) from c;`));
        await defer();
      }
      return null;
    };
    //.........................................................................................................
    p1 = () => {
      return new Promise((resolve) => {
        return after(0.5, async() => {
          await insert_one();
          return resolve();
        });
      });
    };
    //.........................................................................................................
    p2 = () => {
      return new Promise((resolve) => {
        return after(0.5, async() => {
          await insert_two();
          return resolve();
        });
      });
    };
    //.........................................................................................................
    await Promise.all([p1(), p2()]);
    (() => {
      var db;
      db = new DBay({path});
      return H.tabulate("c", db(SQL`select * from c order by src, n;`));
    })();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_concurrent_writes_with_implicit_transactions_single_connection = async function() {
    var DBay, SQL, count, db, insert_numbers, insert_one, insert_two, p1, p2, path, show_table;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/concurrent-writes.sqlite'));
    count = 0;
    insert_numbers = null;
    db = new DBay({path});
    (() => {      //.........................................................................................................
      db(() => {
        return db(SQL`drop table if exists c;
create table c (
    count integer not null,
    src   text    not null,
    n     integer not null,
    s     integer not null,
  primary key ( src, n ) );`);
      });
      return insert_numbers = db.create_insert({
        into: 'c',
        returning: '*'
      });
    })();
    //.........................................................................................................
    show_table = () => {
      return H.tabulate("two c", db(SQL`select * from c order by src, n;`));
    };
    //.........................................................................................................
    insert_one = async() => {
      var error, i, n, row, s, src;
      urge('^603-1^', "start one");
      src = 'one';
      for (n = i = 1; i <= 10; n = ++i) {
        count++;
        s = n ** 2;
        row = {count, src, n, s};
        try {
          // show_table()
          row = db.single_row(insert_numbers, row);
        } catch (error1) {
          error = error1;
          warn('^603-1^', error.message, row);
        }
        help('^603-one^', db.single_value(SQL`select count(*) from c;`));
        await defer();
      }
      return null;
    };
    //.........................................................................................................
    insert_two = async() => {
      var error, i, n, row, s, src;
      urge('^603-1^', "start two");
      src = 'two';
      for (n = i = 1; i <= 10; n = ++i) {
        count++;
        s = n ** 2;
        row = {count, src, n, s};
        try {
          // show_table()
          row = db.single_row(insert_numbers, row);
        } catch (error1) {
          error = error1;
          warn('^603-2^', error.message, row);
        }
        help('^603-two^', db.single_value(SQL`select count(*) from c;`));
        await defer();
      }
      return null;
    };
    //.........................................................................................................
    p1 = () => {
      return new Promise((resolve) => {
        return after(0.5, async() => {
          await insert_one();
          return resolve();
        });
      });
    };
    //.........................................................................................................
    p2 = () => {
      return new Promise((resolve) => {
        return after(0.5, async() => {
          await insert_two();
          return resolve();
        });
      });
    };
    //.........................................................................................................
    await Promise.all([p1(), p2()]);
    (() => {
      return H.tabulate("c", db(SQL`select * from c order by src, n;`));
    })();
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await demo_concurrent_writes_block_and_error_out()
      // await demo_concurrent_writes_with_implicit_transactions_multiple_connections()
      return (await demo_concurrent_writes_with_implicit_transactions_single_connection());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-concurrent-writes.js.map