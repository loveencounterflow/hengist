(function() {
  'use strict';
  var CND, DATA, H, PATH, SQL, badge, debug, echo, help, info, isa, jp, jr, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/FUTURE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  on_process_exit = require('exit-hook');

  sleep = function(dts) {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  SQL = String.raw;

  jr = JSON.stringify;

  jp = JSON.parse;

  DATA = require('../../../lib/data-providers-nocache');

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open()"] = async function(T, done) {
    var Dba, dba, schemas;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dba} = require(H.icql_dba_path));
    dba = new Dba();
    schemas = {};
    //.........................................................................................................
    T.eq(dba.sqlt.name, '');
    T.eq(dba.sqlt.open, true);
    T.eq(dba.sqlt.inTransaction, false);
    T.eq(dba.sqlt.readonly, false);
    T.eq(dba.sqlt.memory, true);
    await (async() => {      //.........................................................................................................
      var schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open'
      })));
      schema = 'dm1';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-1^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      return T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
    })();
    await (async() => {      //.........................................................................................................
      /* Possible to attach same file for Continuous Peristency DB multiple times */
      var d, schema, schema_i, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open',
        reuse: true
      })));
      schema = 'dm2';
      schema_i = dba.sql.I(schema);
      schemas[schema] = {
        path: work_path
      };
      urge('^344-1^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      dba.execute("create table dm1.extra ( id integer );");
      dba.execute("insert into dm1.extra values ( 1 ), ( 2 ), ( 3 );");
      info(dba.list(dba.query("select * from dm1.extra order by id;")));
      help((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm1'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })());
      help((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm2'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })());
      T.ok(indexOf.call((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm1'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })(), 'extra') >= 0);
      T.ok(indexOf.call((function() {
        var ref, results;
        ref = dba.walk_objects({
          schema: 'dm2'
        });
        results = [];
        for (d of ref) {
          results.push(d.name);
        }
        return results;
      })(), 'extra') >= 0);
      T.eq(dba.list(dba.query("select * from dm1.extra order by id;")), [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]);
      T.eq(dba.list(dba.query("select * from dm2.extra order by id;")), [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ]);
      return T.ok(!dba.is_ram_db({schema}));
    })();
    await (async() => {      //.........................................................................................................
      var error, schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open'
      })));
      schema = 'dm1';
      // schemas[ schema ] = { path: work_path, }
      urge('^344-2^', {template_path, work_path, schema});
      try {
        dba.open({
          path: work_path,
          schema
        });
      } catch (error1) {
        error = error1;
        warn('^3234^', error);
        warn('^3234^', error.message);
      }
      // dba.open { path: work_path, schema, }
      T.throws(/schema 'dm1' already exists/, () => {
        return dba.open({
          path: work_path,
          schema
        });
      });
      return T.ok(!dba.is_ram_db({schema}));
    })();
    await (async() => {      //.........................................................................................................
      var schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'big',
        ref: 'F-open'
      })));
      schema = 'chinook';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-3^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      T.ok(!H.types.isa.datamill_db_lookalike({dba, schema}));
      T.ok(H.types.isa.chinook_db_lookalike({dba, schema}));
      return T.ok(!dba.is_ram_db({schema}));
    })();
    await (async() => {      //.........................................................................................................
      var schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'micro',
        ref: 'F-open'
      })));
      schema = 'micro';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-3^', {template_path, work_path, schema});
      dba.open({
        path: work_path,
        schema
      });
      T.ok(!H.types.isa.datamill_db_lookalike({dba, schema}));
      T.ok(H.types.isa.micro_db_lookalike({dba, schema}));
      return T.ok(!dba.is_ram_db({schema}));
    })();
    //.........................................................................................................
    T.eq(dba._schemas, schemas);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() RAM DB"] = async function(T, done) {
    var Dba, dba, schemas;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    dba = new Dba();
    schemas = {};
    await (async() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var db_path, schema, template_path, work_path;
      ({template_path, work_path} = (await H.procure_db({
        size: 'small',
        ref: 'F-open-2'
      })));
      schema = 'ramdb';
      schemas[schema] = {
        path: work_path
      };
      urge('^344-3^', {
        template_path,
        work_path,
        schema,
        ram: true
      });
      dba.open({
        path: work_path,
        schema,
        ram: true
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
      // info d for d from dba.query "select * from pragma_database_list order by seq;"
      db_path = dba.first_value(dba.query("select file from pragma_database_list where name = ?;", [schema]));
      T.eq(db_path, '');
      T.eq(db_path, dba._path_of_schema(schema));
      return T.ok(dba.is_ram_db({schema}));
    })();
    await (() => {      //.........................................................................................................
      /* Opening an empty RAM DB */
      var db_path, ram, schema;
      schema = 'r2';
      ram = true;
      schemas[schema] = {
        path: null
      };
      dba.open({schema, ram});
      // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
      // info d for d from dba.query "select * from pragma_database_list order by seq;"
      db_path = dba.first_value(dba.query("select file from pragma_database_list where name = ?;", [schema]));
      T.eq(db_path, '');
      return T.ok(dba.is_ram_db({schema}));
    })();
    await (() => {      //.........................................................................................................
      // dba.is_ram_db { schema: 'nosuchschema', }
      return T.throws(/\(Dba_schema_unknown\) schema 'nosuchschema' does not exist/, () => {
        return dba.is_ram_db({
          schema: 'nosuchschema'
        });
      });
    })();
    //.........................................................................................................
    info('^35345^', dba._schemas);
    T.eq(dba._schemas, schemas);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: VNRs"] = function(T, done) {
    var Dba, bcd, dba, hollerith_tng, matcher, name, schema, sql, to_hex, use_probe;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    matcher = null;
    //.........................................................................................................
    whisper('-'.repeat(108));
    schema = 'v';
    dba = new Dba();
    dba._attach({
      schema,
      ram: true
    });
    //.........................................................................................................
    /* TAINT by using a generated column with a UDF we are also forced to convert the VNR to JSON and
     then parse that value vefore Hollerith-encoding the value: */
    dba.create_function({
      name: 'hollerith_encode',
      deterministic: true,
      varargs: false,
      call: function(vnr_json) {
        debug('^3338^', rpr(vnr_json));
        return dba.as_hollerith(JSON.parse(vnr_json));
      }
    });
    //.........................................................................................................
    dba.create_function({
      name: 'hollerith_classic',
      deterministic: true,
      varargs: false,
      call: function(vnr_json) {
        var vnr;
        vnr = JSON.parse(vnr_json);
        while (vnr.length < 5) {
          vnr.push(0);
        }
        debug('^3338^', rpr(vnr));
        return dba.as_hollerith(vnr);
      }
    });
    //.........................................................................................................
    hollerith_tng = function(vnr) {
      var R, i, idx, nr_max, nr_min, offset, ref, ref1, ref2, sign_delta, u32_width, vnr_width;
      sign_delta = 0x80000000/* used to lift negative numbers to non-negative */
      u32_width = 4/* bytes per element */
      vnr_width = 5/* maximum elements in VNR vector */
      nr_min = -0x80000000/* smallest possible VNR element */
      nr_max = +0x7fffffff/* largest possible VNR element */
      if (!((0 < (ref = vnr.length) && ref <= vnr_width))) {
        throw new Error(`^44798^ expected VNR to be between 1 and ${vnr_width} elements long, got length ${vnr.length}`);
      }
      R = Buffer.alloc(vnr_width * u32_width, 0x00);
      offset = -u32_width;
      for (idx = i = 0, ref1 = vnr_width; (0 <= ref1 ? i < ref1 : i > ref1); idx = 0 <= ref1 ? ++i : --i) {
        R.writeUInt32BE(((ref2 = vnr[idx]) != null ? ref2 : 0) + sign_delta, (offset += u32_width));
      }
      return R;
    };
    //.........................................................................................................
    bcd = function(vnr) {
      var R, base, dpe, i, idx, minus, nr, padder, plus, ref, ref1, sign, vnr_width;
      vnr_width = 5/* maximum elements in VNR vector */
      dpe = 4/* digits per element */
      base = 36;
      plus = '+';
      minus = '!';
      padder = '.';
      R = [];
      for (idx = i = 0, ref = vnr_width; (0 <= ref ? i < ref : i > ref); idx = 0 <= ref ? ++i : --i) {
        nr = (ref1 = vnr[idx]) != null ? ref1 : 0;
        sign = nr >= 0 ? plus : minus;
        R.push(sign + ((Math.abs(nr)).toString(base)).padStart(dpe, padder));
      }
      R = R.join(',');
      return R;
    };
    //.........................................................................................................
    dba.create_function({
      name: 'hollerith_tng',
      call: function(vnr_json) {
        return hollerith_tng(JSON.parse(vnr_json));
      }
    });
    dba.create_function({
      name: 'bcd',
      call: function(vnr_json) {
        return bcd(JSON.parse(vnr_json));
      }
    });
    //.........................................................................................................
    to_hex = function(blob) {
      return blob.toString('hex');
    };
    dba.create_function({
      name: 'to_hex',
      deterministic: true,
      varargs: false,
      call: to_hex
    });
    //.........................................................................................................
    dba.execute(SQL`create table v.main (
    nr                int   unique not null,
    vnr               json  unique not null,
    vnr_hollerith_tng blob  generated always as ( hollerith_tng(  vnr ) ) stored,
    vnr_bcd           blob  generated always as ( bcd(            vnr ) ) stored,
  primary key ( nr ) );`);
    //.........................................................................................................
    dba.execute(SQL`create unique index v.main_vnr_hollerith_tng on main ( hollerith_tng( vnr ) );`);
    dba.execute(SQL`create unique index v.main_vnr_bcd on main ( bcd( vnr ) );`);
    use_probe = 2;
    (() => {      //.........................................................................................................
      var error, i, idx, len, nr, results, values, vnr, vnr_json, vnrs;
      switch (use_probe) {
        case 1:
          vnrs = [[-8], [-7], [-6], [-5], [-4], [-3], [-2], [-1], [0], [1], [2], [3], [4], [5], [6], [7]];
          break;
        //.........................................................................................................
        case 2:
          vnrs = [
            [0,
            -1],
            // []
            [0],
            [0,
            1,
            -1],
            [0,
            1],
            [0,
            1,
            1],
            [1,
            -1,
            -1],
            [1,
            -1,
            0],
            // [ 1, -1, ]
            [1,
            0,
            -1],
            [1],
            // [ 1, 0, ]
            [2],
            [3,
            5,
            8,
            -1],
            // [ 3, 5, 8, 0, -11, -1, ]
            [3,
            5,
            8,
            0,
            -11],
            [3,
            5,
            8],
            [10003,
            10005,
            10008]
          ];
      }
      vnrs = (function() {
        var i, len, results;
        results = [];
        for (idx = i = 0, len = vnrs.length; i < len; idx = ++i) {
          vnr = vnrs[idx];
          results.push([idx + 1, vnr]);
        }
        return results;
      })();
      vnrs = CND.shuffle(vnrs);
      results = [];
      for (i = 0, len = vnrs.length; i < len; i++) {
        [nr, vnr] = vnrs[i];
        vnr_json = JSON.stringify(vnr);
        values = [nr, vnr_json];
        try {
          results.push(dba.run(SQL`insert into v.main ( nr, vnr ) values ( ?, ? )`, values));
        } catch (error1) {
          error = error1;
          warn(`when trying to insert values ${rpr(values)}, an error occurred: ${error.message}`);
          throw error;
        }
      }
      return results;
    })();
    //.........................................................................................................
    // matcher = dba.list dba.query """select * from v.main order by hollerith_tng( vnr );"""
    // console.table dba.list dba.query """explain query plan select * from v.main order by vnr_bcd;"""
    // console.table dba.list dba.query """explain query plan select * from v.main order by bcd( vnr );"""
    // console.table dba.list dba.query """explain query plan select * from v.main order by hollerith_tng( vnr );"""
    SQL = function(parts, ...expressions) {
      var R, expression, i, idx, len;
      // debug '^345^', parts
      // debug '^345^', parts.raw
      // debug '^345^', expressions
      R = parts[0];
      for (idx = i = 0, len = expressions.length; i < len; idx = ++i) {
        expression = expressions[idx];
        R += expression.toUpperCase() + parts[idx + 1];
      }
      // debug '^334^', rpr R
      return R;
    };
    name = 'world';
    debug('^23423^', SQL`select 'helo ${name}!!'`);
    debug('^23423^', String.raw`select 'helo ${name}!!'`);
    SQL = String.raw;
    sql = SQL`select nr, vnr, to_hex( hollerith_tng( vnr ) ) as hollerith_tng_hex, vnr_bcd from v.main order by $order_by$;`;
    help('^345^', SQL`order by hollerith_tng( vnr )`);
    console.table(dba.list(dba.query(sql.replace('$order_by$', 'hollerith_tng( vnr )'))));
    help('^345^', SQL`order by bcd( vnr )`);
    console.table(dba.list(dba.query(sql.replace('$order_by$', 'bcd( vnr )'))));
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_csv_parser = function() {
    return new Promise((resolve) => {
      var Dba, csv, csv_cfg, dba, fs, import_path, rows, tcfg;
      ({Dba} = require(H.icql_dba_path));
      dba = new Dba();
      //.........................................................................................................
      csv = require('csv-parser');
      fs = require('fs');
      tcfg = H.get_cfg();
      import_path = tcfg.tsv.micro;
      rows = [];
      csv_cfg = {
        separator: '\t',
        escape: '"',
        headers: ['foo', 'gnat', 'gnu', 'blah'],
        // raw:        true
        skipComments: '#'
      };
      // strict:       true
      csv_cfg = {...dba.types.defaults.dba_import_cfg_csv_extra, ...csv_cfg};
      debug('^4458577^', csv_cfg);
      // .pipe csv()
      fs.createReadStream(import_path).pipe(csv(csv_cfg)).on('data', (d) => {
        return rows.push(d);
      }).on('end', () => {
        var i, len, row;
        for (i = 0, len = rows.length; i < len; i++) {
          row = rows[i];
          info('^54596^', row);
        }
        return resolve();
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() file DB in schema main"] = async function(T, done) {
    var Dba, schema, schemas, template_path, work_path;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schemas = {};
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'F-open-in-main'
    })));
    schema = 'main';
    await (() => {      //.........................................................................................................
      var d, db_path, dba, ref;
      urge('^344-3^', {template_path, work_path, schema});
      // dba     = new Dba()
      dba = new Dba();
      dba.open({
        path: work_path
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      ref = dba.query(SQL`select * from pragma_database_list order by seq;`);
      for (d of ref) {
        // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
        info(d);
      }
      db_path = dba.first_value(dba.query(SQL`select file from pragma_database_list where name = ?;`, [schema]));
      T.eq(db_path, work_path);
      T.eq(db_path, dba._path_of_schema(schema));
      T.ok(!dba.is_ram_db({schema}));
      info('^35345^', dba._schemas);
      dba.execute(SQL`create table main.x ( id int primary key ); insert into x ( id ) values ( 123 );`);
      return null;
    })();
    await (() => {      //.........................................................................................................
      var d, dba, i, len, ref;
      dba = new Dba();
      dba.open({
        path: work_path
      });
      info('^35345^', dba._schemas);
      ref = dba.list(dba.walk_objects({schema}));
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        info('^334^', `${d.type}:${d.schema}.${d.name}`);
      }
      T.eq(dba.list(dba.query(SQL`select * from main.x;`)), [
        {
          id: 123
        }
      ]);
      return debug('^3334^', dba);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() RAM DB from file in schema main"] = async function(T, done) {
    var Dba, schema, schemas, template_path, work_path;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schemas = {};
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'F-open-in-main'
    })));
    schema = 'main';
    await (() => {      //.........................................................................................................
      var d, db_path, dba, ref, ref1, ref2;
      /* Opening a RAM DB from file */
      urge('^344-3^', {template_path, work_path, schema});
      // dba     = new Dba()
      dba = new Dba();
      dba.open({
        path: work_path,
        ram: true
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      ref = dba.query(SQL`select * from pragma_database_list order by seq;`);
      for (d of ref) {
        // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
        info(d);
      }
      db_path = dba.first_value(dba.query(SQL`select file from pragma_database_list where name = ?;`, [schema]));
      T.eq(db_path, '');
      T.ok(dba.is_ram_db({schema}));
      db_path = dba.first_value(dba.query(SQL`select file from pragma_database_list where name = ?;`, [schema]));
      T.ok((ref1 = dba._schemas.main) != null ? (ref2 = ref1.path) != null ? ref2.endsWith('data/icql/icql-F-open-in-main-small.db') : void 0 : void 0);
      T.eq(dba.first_value(dba.query(SQL`select count(*) from main.main;`)), 327);
      return null;
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() many RAM DBs"] = function(T, done) {
    var Dba, SQLITE_MAX_ATTACHED, dba, i, j, nr, ref, ref1, schema, schema_i, sql;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    dba = new Dba();
    //.........................................................................................................
    SQLITE_MAX_ATTACHED = 125;
    for (nr = i = 1, ref = SQLITE_MAX_ATTACHED; (1 <= ref ? i <= ref : i >= ref); nr = 1 <= ref ? ++i : --i) {
      (() => {
        var idx, j, n, rnd, schema_i;
        schema = `s${nr}`;
        schema_i = dba.sql.I(schema);
        dba.open({
          schema,
          ram: true
        });
        dba.run(SQL`create table ${schema_i}.numbers (
  schema  text    not null,
  nr      integer not null,
  n       integer not null unique primary key,
  rnd     integer not null );`);
        for (idx = j = 0; j <= 5; idx = ++j) {
          n = idx + 1;
          rnd = nr * n;
          dba.run(SQL`insert into ${schema_i}.numbers ( schema, nr, n, rnd )
  values ( $schema, $nr, $n, $rnd );`, {schema, nr, n, rnd});
        }
        return null;
      })();
    }
    //.........................................................................................................
    sql = [];
    for (nr = j = 1, ref1 = SQLITE_MAX_ATTACHED; (1 <= ref1 ? j <= ref1 : j >= ref1); nr = 1 <= ref1 ? ++j : --j) {
      schema = `s${nr}`;
      schema_i = dba.sql.I(schema);
      sql.push(SQL`select * from ${schema_i}.numbers`);
    }
    sql = sql.join('\n' + SQL`union all `);
    sql += '\n' + SQL`order by nr, n;`;
    console.table(dba.list(dba.query(sql)));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open() empty RAM DB in schema main"] = async function(T, done) {
    var Dba, schema;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    await (() => {      //.........................................................................................................
      /* Opening an empty RAM DB */
      var dba;
      dba = new Dba();
      dba.open({
        ram: true
      });
      T.eq(dba._schemas, {
        main: {
          path: null
        }
      });
      T.eq(dba.list(dba.walk_objects({schema})), []);
      dba.execute(SQL`create table main.x ( id int primary key ); insert into x ( id ) values ( 123 );`);
      info('^443^', dba.list(dba.walk_objects({schema})));
      T.eq(dba.list(dba.walk_objects({schema})), [
        {
          seq: 0,
          schema: 'main',
          name: 'sqlite_autoindex_x_1',
          type: 'index',
          sql: null
        },
        {
          seq: 0,
          schema: 'main',
          name: 'x',
          type: 'table',
          sql: 'CREATE TABLE x ( id int primary key )'
        }
      ]);
      return debug('^3334^', dba);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: writing while reading 1"] = async function(T, done) {
    var Dba, dba, new_bsqlt3, schema;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    new_bsqlt3 = require('../../../apps/icql-dba/node_modules/better-sqlite3');
    dba = new Dba();
    await (() => {      //.........................................................................................................
      var i, n, results;
      dba.execute(SQL`create table main.x ( n int primary key, locked boolean not null default false );`);
      results = [];
      for (n = i = 1; i <= 10; n = ++i) {
        results.push(dba.run(SQL`insert into x ( n ) values ( ? );`, [n]));
      }
      return results;
    })();
    await (() => {      //.........................................................................................................
      var ref, row;
      dba.execute(SQL`update x set locked = true;`);
      dba.sqlt.unsafeMode(true);
      ref = dba.query(SQL`select * from x where locked;`);
      for (row of ref) {
        // info '^44555^', row
        dba.run(SQL`insert into x ( n ) values ( ? );`, [row.n + 100]);
      }
      return dba.sqlt.unsafeMode(false);
    })();
    await (() => {      //.........................................................................................................
      var d;
      // for row from dba.query SQL"select * from x;"
      //   info '^44555^', row
      return T.eq((function() {
        var ref, results;
        ref = dba.query(SQL`select * from x;`);
        results = [];
        for (d of ref) {
          results.push(d.n);
        }
        return results;
      })(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110]);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: writing while reading 2"] = async function(T, done) {
    var Dba, dba, new_bsqlt3, schema;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    new_bsqlt3 = require('../../../apps/icql-dba/node_modules/better-sqlite3');
    dba = new Dba();
    await (() => {      //.........................................................................................................
      var i, n, results;
      dba.execute(SQL`create table main.x ( n int primary key, locked boolean not null default false );`);
      results = [];
      for (n = i = 1; i <= 10; n = ++i) {
        results.push(dba.run(SQL`insert into x ( n ) values ( ? );`, [n]));
      }
      return results;
    })();
    await (() => {      //.........................................................................................................
      dba.execute(SQL`update x set locked = true;`);
      dba.with_unsafe_mode(() => {
        var ref, results, row;
        ref = dba.query(SQL`select * from x where locked;`);
        results = [];
        for (row of ref) {
          info('^44555^', dba._state);
          results.push(dba.run(SQL`insert into x ( n ) values ( ? );`, [row.n + 100]));
        }
        return results;
      });
      return info('^44555^', dba._state);
    })();
    await (() => {      //.........................................................................................................
      var d;
      // for row from dba.query SQL"select * from x;"
      //   info '^44555^', row
      return T.eq((function() {
        var ref, results;
        ref = dba.query(SQL`select * from x;`);
        results = [];
        for (d of ref) {
          results.push(d.n);
        }
        return results;
      })(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110]);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: indexing JSON lists (de-constructing method)"] = async function(T, done) {
    var Dba, I, L, V, dba, schema;
    /* see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md */
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    dba = new Dba();
    dba.load_extension(PATH.resolve(PATH.join(__dirname, '../../../assets/sqlite-extensions/json1.so')));
    ({I, L, V} = new (require('../../../apps/icql-dba/lib/sql')).Sql());
    await (() => {      //.........................................................................................................
      var i, k, multiples, mutations_allowed, n, ref, ref1, row;
      //.......................................................................................................
      mutations_allowed = 0;
      dba.create_function({
        name: 'mutations_allowed',
        varargs: true,
        call: function(value = null) {
          if (value !== null && value !== 0 && value !== 1) {
            // debug '^mutations_allowed@334^', { value, }
            /* TAINT consider to use `validate()` */
            throw new Error(`^3446^ expected null, 0 or 1, got ${rpr(value)}`);
          }
          if (value == null) {
            return mutations_allowed;
          }
          return mutations_allowed = value;
        }
      });
      // if value?
      //   mutations_allowed = if val
      //.......................................................................................................
      dba.execute(SQL`create table multiples (
  n         integer unique not null primary key,
  multiples json not null );
-- ...................................................................................................
-- ### see https://sqlite.org/forum/forumpost/9f06fedaa5 ###
create table multiples_idx (
  n         integer not null,
  idx       integer not null,
  multiple  integer not null,
  primary key ( n, idx ) );
create index multiples_idx_multiple_idx on multiples_idx ( multiple );
-- ...................................................................................................
create trigger multiple_after_insert after insert on multiples begin
  select mutations_allowed( true );
  insert into multiples_idx( n, idx, multiple )
    select new.n, j.key, j.value from json_each( new.multiples ) as j;
  select mutations_allowed( false );
  end;
-- ...................................................................................................
create trigger multiple_after_delete after delete on multiples begin
  select mutations_allowed( true );
  delete from multiples_idx where n = old.n;
  select mutations_allowed( false );
  end;
-- ...................................................................................................
create trigger multiple_after_update after update on multiples begin
  select mutations_allowed( true );
  delete from multiples_idx where n = old.n;
  insert into multiples_idx( n, idx, multiple )
    select new.n, j.key, j.value from json_each( new.multiples ) as j;
  select mutations_allowed( false );
  end;
-- ...................................................................................................
create trigger multiples_idx_before_insert before insert on multiples_idx begin
  select raise( abort, '^376^ mutations of multiples_idx not allowed' )
    where not ( select mutations_allowed() );
  end;
-- ...................................................................................................
create trigger multiples_idx_before_delete before delete on multiples_idx begin
  select raise( abort, '^376^ mutations of multiples_idx not allowed' )
    where not ( select mutations_allowed() );
  end;
-- ...................................................................................................
create trigger multiples_idx_before_update before update on multiples_idx begin
  select raise( abort, '^376^ mutations of multiples_idx not allowed' )
    where not ( select mutations_allowed() );
  end;`);
//.......................................................................................................
      for (n = i = 1; i <= 5; n = ++i) {
        multiples = jr((function() {
          var j, results;
          results = [];
          for (k = j = 0; j <= 9; k = ++j) {
            results.push(n * k);
          }
          return results;
        })());
        dba.run(SQL`insert into multiples values ( $n, $multiples )`, {n, multiples});
      }
      dba.execute(SQL`delete from multiples where n = 4;`);
      ref = dba.query(SQL`select * from multiples;`);
      for (row of ref) {
        info('^5554^', row);
      }
      ref1 = dba.query(SQL`select * from multiples_idx;`);
      for (row of ref1) {
        info('^5554^', row);
      }
      //.......................................................................................................
      console.table(dba.list(dba.query(SQL`explain query plan select * from multiples;`)));
      return console.table(dba.list(dba.query(SQL`explain query plan select * from multiples_idx where multiple > 3;`)));
    })();
    // console.table dba.list dba.query SQL"explain query plan select * from multiples where json_array_at( multiples, 3 ) > 10;"
    //.......................................................................................................
    // dba.execute SQL"create index multiples_array_idx on json_array_at( multiples, 3 );"
    // console.table dba.list dba.query SQL"explain query plan select * from multiples where json_array_at( multiples, 3 ) > 10;"
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: indexing JSON lists (constructing method)"] = async function(T, done) {
    var Dba, I, L, V, dba, schema;
    /* see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md */
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    dba = new Dba();
    dba.load_extension(PATH.resolve(PATH.join(__dirname, '../../../assets/sqlite-extensions/json1.so')));
    // dba.sqlt.unsafeMode true
    ({I, L, V} = new (require('../../../apps/icql-dba/lib/sql')).Sql());
    await (() => {      //.........................................................................................................
      var i, idx, j, multiple, n, ref, ref1, row;
      //.......................................................................................................
      dba.execute(SQL`create view multiples as select distinct
    n                                     as n,
    json_group_array( multiple ) over w   as multiples
  from multiples_idx
  window w as ( partition by n order by idx range between unbounded preceding and unbounded following )
  order by n;
-- ...................................................................................................
-- ### see https://sqlite.org/forum/forumpost/9f06fedaa5 ###
create table multiples_idx (
  n         integer not null,
  idx       integer not null,
  multiple  integer not null,
  primary key ( n, idx ) );
create index multiples_idx_multiple_idx on multiples_idx ( multiple );`);
//.......................................................................................................
      for (n = i = 1; i <= 3; n = ++i) {
        for (idx = j = 0; j <= 9; idx = ++j) {
          multiple = n * idx;
          if (multiple > 10) {
            continue;
          }
          dba.run(SQL`insert into multiples_idx ( n, idx, multiple )
values ( $n, $idx, $multiple )`, {n, idx, multiple});
        }
      }
      ref = dba.query(SQL`select * from multiples_idx;`);
      //.......................................................................................................
      for (row of ref) {
        info('^5554^', row);
      }
      ref1 = dba.query(SQL`select * from multiples;`);
      for (row of ref1) {
        info('^5554^', row);
      }
      //.......................................................................................................
      console.table(dba.list(dba.query(SQL`explain query plan select * from multiples;`)));
      console.table(dba.list(dba.query(SQL`explain query plan select * from multiples_idx where idx > 3;`)));
      return console.table(dba.list(dba.query(SQL`explain query plan select * from multiples_idx where multiple > 3;`)));
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: advanced interpolation"] = function(T, done) {
    var Dba, E, dba;
    ({Dba} = require(H.icql_dba_path));
    E = require(H.icql_dba_path + '/lib/errors');
    dba = new Dba();
    (() => { //...................................................................................................
      var d, result, sql;
      sql = SQL`select $:col_a, $:col_b where $:col_b in $V:choices`;
      d = {
        col_a: 'foo',
        col_b: 'bar',
        choices: [1, 2, 3]
      };
      result = dba.sql.interpolate(sql, d);
      info('^23867^', result);
      return T.eq(result, `select "foo", "bar" where "bar" in ( 1, 2, 3 )`);
    })();
    (() => { //...................................................................................................
      var d, result, sql;
      sql = SQL`select ?:, ?: where ?: in ?V:`;
      d = ['foo', 'bar', 'bar', [1, 2, 3]];
      result = dba.sql.interpolate(sql, d);
      info('^23867^', result);
      return T.eq(result, `select "foo", "bar" where "bar" in ( 1, 2, 3 )`);
    })();
    T.throws(/unknown interpolation format 'X'/, () => { //.........................................................
      var d, result, sql;
      sql = SQL`select ?:, ?X: where ?: in ?V:`;
      d = ['foo', 'bar', 'bar', [1, 2, 3]];
      return result = dba.sql.interpolate(sql, d);
    });
    return done(); //..................................................................................................
  };

  
  //-----------------------------------------------------------------------------------------------------------
  this["DBA: foreign keys enforced"] = function(T, done) {
    var Dba, E, dba, error;
    ({Dba} = require(H.icql_dba_path));
    E = require(H.icql_dba_path + '/lib/errors');
    dba = new Dba();
    //.........................................................................................................
    if (T != null) {
      T.eq(dba._get_foreign_keys_state(), true);
    }
    dba.execute(SQL`create table keys ( key text primary key );`);
    dba.execute(SQL`create table main ( foo text not null references keys ( key ) );`);
    error = null;
    try {
      dba.execute(SQL`insert into main values ( 'x' );`);
    } catch (error1) {
      error = error1;
      warn(error.message);
      warn(error.name);
      warn(error.code);
      if (T != null) {
        T.eq(error.code, 'SQLITE_CONSTRAINT_FOREIGNKEY');
      }
    }
    if (!error) {
      if (T != null) {
        T.fail("expected error, got none");
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  
  // use table valued functions to do joins over 2+ dba instances

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: clear()"] = function(T, done) {
    var ICQLDBA, d, dba, i, id, ref, schema;
    if (T != null) {
      T.halt_on_error();
    }
    ICQLDBA = require(H.icql_dba_path);
    dba = new ICQLDBA.Dba();
    schema = 'main';
    //.........................................................................................................
    // Create tables, indexes:
    dba.execute("create table main.k1 ( id integer primary key, fk_k2 integer unique references k2 ( id ) );");
    dba.execute("create table main.k2 ( id integer primary key, fk_k1 integer unique references k1 ( id ) );");
    ref = dba.walk_objects({schema});
    //.........................................................................................................
    for (d of ref) {
      info("^557-300^", {
        type: d.type,
        name: d.name
      });
    }
    //.........................................................................................................
    // Insert rows:
    if (T != null) {
      T.eq(dba._get_foreign_keys_state(), true);
    }
    dba._set_foreign_keys_state(false);
    if (T != null) {
      T.eq(dba._get_foreign_keys_state(), false);
    }
    for (id = i = 1; i <= 9; id = ++i) {
      dba.execute(`insert into main.k1 values ( ${id}, ${id} );`);
      dba.execute(`insert into main.k2 values ( ${id}, ${id} );`);
    }
    dba._set_foreign_keys_state(true);
    if (T != null) {
      T.eq(dba._get_foreign_keys_state(), true);
    }
    //.........................................................................................................
    debug('^544734^', (function() {
      var ref1, results;
      ref1 = dba.walk_objects({schema});
      results = [];
      for (d of ref1) {
        results.push(d.name);
      }
      return results;
    })());
    if (T != null) {
      T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), ['sqlite_autoindex_k1_1', 'sqlite_autoindex_k2_1', 'k1', 'k2']);
    }
    if (T != null) {
      T.eq(dba.list(dba.query("select * from k1 join k2 on ( k1.fk_k2 = k2.id );")), [
        {
          id: 1,
          fk_k2: 1,
          fk_k1: 1
        },
        {
          id: 2,
          fk_k2: 2,
          fk_k1: 2
        },
        {
          id: 3,
          fk_k2: 3,
          fk_k1: 3
        },
        {
          id: 4,
          fk_k2: 4,
          fk_k1: 4
        },
        {
          id: 5,
          fk_k2: 5,
          fk_k1: 5
        },
        {
          id: 6,
          fk_k2: 6,
          fk_k1: 6
        },
        {
          id: 7,
          fk_k2: 7,
          fk_k1: 7
        },
        {
          id: 8,
          fk_k2: 8,
          fk_k1: 8
        },
        {
          id: 9,
          fk_k2: 9,
          fk_k1: 9
        }
      ]);
    }
    //.........................................................................................................
    dba.clear({schema});
    if (T != null) {
      T.eq((function() {
        var ref1, results;
        ref1 = dba.walk_objects({schema});
        results = [];
        for (d of ref1) {
          results.push(d.name);
        }
        return results;
      })(), []);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: _is_sqlite3_db()"] = function(T, done) {
    var Dba, cfg, dba, path_1, path_2;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    dba = new Dba();
    cfg = H.get_cfg();
    debug('^556^', path_1 = cfg.db.templates.nnt);
    debug('^556^', path_2 = cfg.sql.small);
    //.........................................................................................................
    if (T != null) {
      T.eq(dba._is_sqlite3_db(path_1), true);
    }
    if (T != null) {
      T.eq(dba._is_sqlite3_db(path_2), false);
    }
    if (T != null) {
      T.throws(/must be of type string/, function() {
        return dba._is_sqlite3_db(void 0);
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      // debug f '𠖏'
      // test @[ "DBA: concurrent UDFs" ]
      // @[ "DBA: concurrent UDFs" ]()
      // test @[ "DBA: advanced interpolation" ]
      // test @[ "DBA: typing" ]
      // test @[ "DBA: window functions etc." ]
      // test @[ "DBA: view with UDF" ]
      // test @[ "DBA: sqlean vsv extension" ]
      // test @[ "DBA: indexing JSON lists (de-constructing method)" ]
      // test @[ "DBA: indexing JSON lists (constructing method)" ]
      // test @[ "DBA: User-Defined Window Function" ]
      // test @[ "DBA: VNRs" ], { timeout: 5e3, }
      // test @[ "DBA: import TSV; big file" ], { timeout: 60e3, }
      // test @[ "DBA: open() file DB in schema main" ]
      // test @[ "DBA: writing while reading 2" ]
      // test @[ "DBA: open() RAM DB from file in schema main" ]
      // test @[ "DBA: open() empty RAM DB in schema main" ]
      // test @[ "DBA: virtual tables" ]
      // test @[ "DBA: import TSV; cfg variants 2" ]
      // test @[ "DBA: import TSV; cfg variants 2" ]
      // test @[ "DBA: import TSV; cfg variants 3" ]
      // test @[ "DBA: import TSV; cfg variants 4" ]
      // test @[ "DBA: import CSV; cfg variants 5" ]
      // await @_demo_csv_parser()
      // test @[ "___ DBA: import() (four corner)" ]
      // test @[ "___ DBA: import() (big file)" ]
      // test @[ "DBA: open() RAM DB" ]
      // test @[ "DBA: export() RAM DB" ]
      // test @[ "DBA: import() CSV" ]
      // test @[ "DBA: import() TSV" ]
      // @[ "DBA: import() CSV" ]()
      // test @[ "DBA: clear()" ]
      // test @[ "DBA: foreign keys enforced" ]
      // test @[ "DBA: clear()" ]
      // test @[ "DBA: open() many RAM DBs" ]
      // @[ "DBA: open() many RAM DBs" ]()
      // test @[ "DBA: _is_sqlite3_db()" ]
      // test @[ "DBA: writing while reading 1" ]
      return test(this["DBA: writing while reading 2"]);
    })();
  }

}).call(this);

//# sourceMappingURL=future.tests.js.map