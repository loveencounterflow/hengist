(function() {
  'use strict';
  var CND, H, PATH, badge, debug, echo, help, info, isa, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/BASICS';

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

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: open()"] = async function(T, done) {
    var Dba, dba, schemas;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
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
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
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
  this["DBA: save() RAM DB"] = async function(T, done) {
    var Dba, matcher, ramdb_path;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    ramdb_path = null;
    matcher = null;
    await (async() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var dba, digest_1, digest_2, digest_3, i, id, schema, template_path, work_path;
      dba = new Dba();
      ({template_path, work_path} = (await H.procure_db({
        size: 'micro',
        ref: 'F-save-1'
      })));
      schema = 'ramdb';
      ramdb_path = work_path;
      digest_1 = CND.id_from_route(work_path);
      dba.open({
        path: work_path,
        schema,
        ram: true
      });
      debug('^422423^', dba._schemas);
      T.ok(dba.is_ram_db({schema}));
      //.......................................................................................................
      dba.execute("create table ramdb.d ( id integer, t text );");
      for (id = i = 1; i <= 9; id = ++i) {
        dba.run("insert into d values ( ?, ? );", [id, `line Nr. ${id}`]);
      }
      matcher = dba.list(dba.query("select * from ramdb.d order by id;"));
      //.......................................................................................................
      digest_2 = CND.id_from_route(work_path);
      T.eq(digest_1, digest_2);
      T.throws(/\(Dba_argument_not_allowed\) argument path not allowed/, () => {
        return dba.save({
          path: '/tmp/x',
          schema: 'xxx'
        });
      });
      dba.save({schema});
      //.......................................................................................................
      digest_3 = CND.id_from_route(work_path);
      T.ok(!types.equals(digest_1, digest_3));
      //.......................................................................................................
      T.ok(dba.is_ram_db({schema}));
      return null;
    })();
    await (() => {      //.........................................................................................................
      /* Check whether file DB was updated by `dba.save()` */
      var dba, probe, schema;
      dba = new Dba();
      schema = 'filedb';
      dba.open({
        path: ramdb_path,
        schema,
        ram: false
      });
      probe = dba.list(dba.query("select * from filedb.d order by id;"));
      return T.eq(probe, matcher);
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: export() RAM DB"] = async function(T, done) {
    var Dba, export_path, matcher, ramdb_path;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    ramdb_path = null;
    matcher = null;
    export_path = H.nonexistant_path_from_ref('export-ram-db');
    await (async() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var dba, i, id, schema, template_path, work_path;
      dba = new Dba();
      ({template_path, work_path} = (await H.procure_db({
        size: 'micro',
        ref: 'F-save-1'
      })));
      schema = 'ramdb';
      ramdb_path = work_path;
      dba.open({
        path: work_path,
        schema,
        ram: true
      });
      //.......................................................................................................
      dba.execute("create table ramdb.d ( id integer, t text );");
      for (id = i = 1; i <= 9; id = ++i) {
        dba.run("insert into d values ( ?, ? );", [id, `line Nr. ${id}`]);
      }
      matcher = dba.list(dba.query("select * from ramdb.d order by id;"));
      //.......................................................................................................
      T.throws(/\(Dba_argument_not_allowed\) argument path not allowed/, () => {
        return dba.save({
          path: '/tmp/x',
          schema: 'xxx'
        });
      });
      dba.export({
        schema,
        path: export_path
      });
      //.......................................................................................................
      return null;
    })();
    // #.........................................................................................................
    // await do =>
    //   ### Check whether file DB was updated by `dba.save()` ###
    //   dba               = new Dba()
    //   schema            = 'filedb'
    //   dba.open { path: ramdb_path, schema, ram: false, }
    //   probe             = dba.list dba.query "select * from filedb.d order by id;"
    //   T.eq probe, matcher
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import() CSV"] = async function(T, done) {
    var Dba, export_path, matcher;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    // ramdb_path        = null
    matcher = null;
    export_path = H.nonexistant_path_from_ref('import-csv');
    await (async() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var cfg, columns, cpx_delta, cpx_max, cpx_min, cpxr_delta, cpxr_max, cpxr_min, dba, import_path, precision, schema, seen_chrs, table_columns, transform, update;
      dba = new Dba();
      import_path = H.get_cfg().csv.small;
      schema = 'chlex';
      columns = null;
      seen_chrs = new Set();
      table_columns = ['C1', 'C1Type', 'C1Pinyin', 'C1PRPinyin', 'C1Strokes', 'C1Pixels', 'C1PictureSize', 'C1SR', 'C1PR'];
      transform = function(d) {
        var column, i, len, row, value;
        if (seen_chrs.has(d.row.C1)) {
          return [];
        }
        seen_chrs.add(d.row.C1);
        if (seen_chrs.size > 100) {
          return d.stop;
        }
        // debug '^4454^', d.row
        row = {};
        for (i = 0, len = table_columns.length; i < len; i++) {
          column = table_columns[i];
          value = d.row[column];
          value = value === 'NA' ? null : value;
          // debug '^4448^', column, value, r
          // switch column
          //   # when 'C1Pixels'       then ( parseFloat value ) / 1000
          //   # when 'C1PictureSize'  then ( parseFloat value ) / 1000
          //   when 'complexity'
          //     value = ( parseFloat row.C1Pixels ) * ( parseFloat row.C1PictureSize ) * ( parseFloat row.C1Strokes )
          //     value = value / 1e6
          //     value = Math.max value, 1
          //     value = value.toFixed 0
          //     value = value.padStart 5, '0'
          //   else null
          row[column] = value;
        }
        return [row];
      };
      //.......................................................................................................
      cfg = {
        schema: schema,
        transform: transform,
        path: import_path,
        format: 'csv',
        input_columns: true,
        table_columns: table_columns,
        skip_first: true,
        ram: true
      };
      await dba.import(cfg);
      //.......................................................................................................
      dba.execute("alter table chlex.main add column cpx_raw integer;");
      dba.execute("alter table chlex.main add column cpx integer;");
      dba.execute("update chlex.main set cpx_raw = C1Strokes * C1Pixels * C1PictureSize;");
      cpxr_max = dba.single_value(dba.query("select max( cpx_raw ) from chlex.main;"));
      cpxr_min = dba.single_value(dba.query("select min( cpx_raw ) from chlex.main;"));
      cpxr_delta = cpxr_max - cpxr_min;
      // cpx_min     = 10
      cpx_min = 0;
      cpx_max = 99;
      precision = 0;
      cpx_delta = cpx_max - cpx_min;
      debug('^7946^', {cpxr_max});
      update = dba.prepare(`update chlex.main set
  cpx = round(
    ( cpx_raw - $cpxr_min ) / $cpxr_delta * $cpx_delta + $cpx_min,
    $precision );`);
      // update  = dba.prepare "update chlex.main set cpx = max( round( cpx_raw / ? * 99, 0 ), 1 );"
      // update  = dba.prepare "update chlex.main set cpx = cpx_raw / ?;"
      update.run({cpxr_min, cpxr_max, cpxr_delta, cpx_min, cpx_max, cpx_delta, precision});
      //.......................................................................................................
      // matcher = dba.list dba.query """select C1Type, C1, C1SR, C1PR, cpx from chlex.main order by cpx, cpx_raw asc;"""
      matcher = dba.list(dba.query(`select C1Type, C1, cpx from chlex.main order by cpx, cpx_raw asc;`));
      // matcher = dba.list dba.query """select * from chlex.main order by cpx, cpx_raw asc;"""
      // for row in matcher
      console.table(matcher);
      return dba.export({
        schema,
        path: export_path
      });
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import() TSV"] = async function(T, done) {
    var Dba, export_path, matcher;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    // ramdb_path        = null
    matcher = null;
    export_path = H.nonexistant_path_from_ref('import-tcsv');
    await (async() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var cfg, dba, import_path, schema, transform;
      dba = new Dba();
      import_path = H.get_cfg().tsv.micro;
      schema = 'tsv';
      transform = function(d) {
        var row;
        // return d.stop if seen_chrs.size > 10
        ({row} = d);
        info('^4454^', row);
        if (!((row.ncr != null) && (row.glyph != null) && (row.wbf != null))) {
          return null;
        }
        row.wbf = row.wbf.replace(/^<(.*)>$/, '$1');
        return row;
      };
      //.......................................................................................................
      cfg = {
        schema: schema,
        transform: transform,
        path: import_path,
        format: 'csv',
        input_columns: true,
        // input_columns:  [ 'a', 'b', 'c', ]
        // table_columns:  [ 'a', 'b', 'c', ]
        // table_columns:  { a: 'integer', b: 'integer', c: 'text', }
        skip_first: true,
        ram: true,
        _extra: {
          // headers:    true
          separator: '\t'
        }
      };
      // mapHeaders: ( { header, index, } ) -> header.toUpperCase()
      urge('^22432^', (await dba.import(cfg)));
      //.......................................................................................................
      matcher = dba.list(dba.query(`select * from tsv.main order by 1, 2, 3;`));
      console.table(matcher);
      return dba.export({
        schema,
        path: export_path
      });
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___ DBA: import() (big file)"] = async function(T, done) {
    var Dba, export_path, matcher;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    // ramdb_path        = null
    matcher = null;
    export_path = H.nonexistant_path_from_ref('import-csv');
    await (() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var _extra, columns, count, dba, i, import_path, len, ref, results, row, schema, seen_chrs, sql, t0, t1, transform;
      dba = new Dba();
      import_path = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-datasources/data/flat-files/shape/shape-strokeorder-zhaziwubifa.txt'));
      // import_path       = PATH.resolve PATH.join __dirname, '../../../assets/icql/ncrglyphwbf.tsv'
      schema = 'wbf';
      columns = null;
      seen_chrs = new Set();
      count = 0;
      transform = null;
      //.......................................................................................................
      transform = function(d) {
        var glyph, match, ncr, wbf;
        count++;
        ({ncr, glyph, wbf} = d.row);
        if ((ncr == null) || (glyph == null) || (wbf == null)) {
          return null;
        }
        if ((match = wbf.match(/^<(?<wbf>[0-9]+)>$/)) == null) {
          return null;
        }
        ({wbf} = match.groups);
        if (count > 1000) {
          return d.stop;
        }
        return {ncr, glyph, wbf};
      };
      //.......................................................................................................
      _extra = {
        delimiter: '\t',
        // columns:                  [ 'ncr', 'glyph', 'wbf', ]
        relax_column_count: true
      };
      // relax_column_count_less:  true
      // relax_column_count_more:  true
      columns = ['ncr', 'glyph', 'wbf'];
      t0 = Date.now();
      dba.import({
        path: import_path,
        format: 'csv',
        schema,
        ram: true,
        transform,
        _extra,
        columns
      });
      t1 = Date.now();
      debug('^44545^', "dt:", (t1 - t0) / 1000);
      matcher = dba.list(dba.query(`select * from wbf.main order by wbf limit 1000;`));
      for (i = 0, len = matcher.length; i < len; i++) {
        row = matcher[i];
        info(row);
      }
      //.......................................................................................................
      sql = `select
  glyph as glyph,
  cast( substring( wbf, 1, 1 ) as integer ) +
    cast( substring( wbf, -1, 1 ) as integer ) as wbfs
from wbf.main
order by wbfs;`;
      ref = dba.query(sql);
      results = [];
      for (row of ref) {
        results.push(info(row));
      }
      return results;
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___ DBA: import() (four corner)"] = async function(T, done) {
    var Dba, export_path, matcher;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    // ramdb_path        = null
    matcher = null;
    export_path = H.nonexistant_path_from_ref('import-csv');
    await (() => {      //.........................................................................................................
      /* Opening a RAM DB from file */
      var _extra, clauses, columns, count, dba, digit, i, idx, import_path, j, k, l, len, pattern, position, ref, results, row, schema, seen_chrs, sql, t0, t1, transform, with_clauses;
      dba = new Dba();
      import_path = PATH.resolve(PATH.join(__dirname, '../../../../../io/mingkwai-rack/jizura-datasources/data/flat-files/shape/shape-fourcorner-wikipedia.txt'));
      // import_path       = PATH.resolve PATH.join __dirname, '../../../assets/icql/ncrglyphwbf.tsv'
      schema = 'fc';
      columns = null;
      seen_chrs = new Set();
      count = 0;
      transform = null;
      //.......................................................................................................
      transform = function(d) {
        var fc, fc4, fcx, glyph, glyphs, lnr, match;
        // debug '^44554^', d
        count++;
        // return d.stop if count > 100
        /* TAINT must specify columns for source, target separately */
        ({fc4, fcx} = d.row);
        ({lnr} = d);
        if ((fc4 == null) || (fcx == null)) {
          return null;
        }
        fc = fc4;
        glyphs = fcx;
        glyphs = Array.from(glyphs);
        if ((match = fc.match(/^(?<fc4>[0-9]+)(-(?<fcx>[0-9]))?$/)) == null) {
          warn(`^334^ omitted: ${rpr(d)}`);
          return null;
        }
        ({fc4, fcx} = match.groups);
        return (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = glyphs.length; i < len; i++) {
            glyph = glyphs[i];
            results.push({fc4, fcx, glyph});
          }
          return results;
        })();
      };
      //.......................................................................................................
      _extra = {
        delimiter: '\t',
        // columns:                  [ 'ncr', 'glyph', 'wbf', ]
        relax_column_count: true
      };
      // relax_column_count_less:  true
      // relax_column_count_more:  true
      /* TAINT must specify columns for source, target separately */
      columns = ['fc4', 'fcx', 'glyph'];
      t0 = Date.now();
      dba.import({
        path: import_path,
        format: 'csv',
        schema,
        ram: true,
        transform,
        _extra,
        columns
      });
      t1 = Date.now();
      debug('^44545^', "dt:", (t1 - t0) / 1000);
      //.......................................................................................................
      matcher = dba.list(dba.query(`select * from fc.main where fc4 like '_3__' order by fc4, fcx limit 10;`));
      for (i = 0, len = matcher.length; i < len; i++) {
        row = matcher[i];
        info(`${row.fc4} ${row.glyph}`);
      }
      //.......................................................................................................
      clauses = [];
      with_clauses = [];
      for (idx = j = 0; j <= 3; idx = ++j) {
        for (digit = k = 0; k <= 9; digit = ++k) {
          position = idx + 1;
          pattern = ('_'.repeat(idx)) + `${digit}` + ('_'.repeat(3 - idx));
          with_clauses.push(`v${position}${digit} as ( select count(*) as c from fc.main where fc4 like '${pattern}' )`);
        }
      }
      clauses.push(`with ${with_clauses.join(',\n')}\n`);
      clauses.push(`select null as c, null as p1, null as p2, null as p3, null as p4 where false union all`);
      for (digit = l = 0; l <= 9; digit = ++l) {
        clauses.push(`select ${digit}, v1${digit}.c, v2${digit}.c, v3${digit}.c, v4${digit}.c from v1${digit}, v2${digit}, v3${digit}, v4${digit} union all`);
      }
      clauses.push(`select null, null, null, null, null where false;`);
      sql = clauses.join('\n');
      ref = dba.query(sql);
      // debug '^348^', sql
      results = [];
      for (row of ref) {
        results.push(info(row));
      }
      return results;
    })();
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import TSV; cfg variants 1"] = async function(T, done) {
    var Dba, cfg, dba, import_path, is_first, matcher, schema, table_columns, transform;
    // T.halt_on_error()
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = H.get_cfg().tsv.micro;
    //.........................................................................................................
    whisper('-'.repeat(108));
    dba = new Dba();
    schema = 'tsv';
    // input_columns     = null
    table_columns = ['c1', 'c2', 'c3'];
    transform = null;
    is_first = true;
    //.........................................................................................................
    transform = function(d) {
      var glyph, match, ncr, wbf;
      debug('^58471^', d.row);
      T.eq(type_of(d.row), 'object');
      ({ncr, glyph, wbf} = d.row);
      if ((ncr == null) || (glyph == null) || (wbf == null)) {
        return null;
      }
      if ((match = wbf.match(/^<(?<wbf>[0-9]+)>$/)) == null) {
        return null;
      }
      wbf = match.groups.wbf;
      return {
        c1: ncr,
        c2: glyph,
        c3: wbf
      };
    };
    // return { ncr, glyph, wbf, }
    //.........................................................................................................
    cfg = {
      schema: schema,
      transform: transform,
      path: import_path,
      format: 'csv',
      input_columns: true,
      table_columns: {
        c1: 'text',
        c2: 'text',
        c3: 'text'
      },
      // columns = [ 'ncr', 'glyph', 'wbf', ]
      // skip_first:     true
      ram: true,
      _extra: {
        separator: '\t'
      }
    };
    // columns:                  [ 'ncr', 'glyph', 'wbf', ]
    // quotes:                   false ?????????
    // relax_column_count:       true
    await dba.import(cfg);
    //.........................................................................................................
    matcher = dba.list(dba.query(`select * from tsv.main order by 1, 2, 3;`));
    // debug '^5697^', matcher
    console.table(matcher);
    T.eq(matcher.length, 12);
    T.eq(matcher[0].c1, 'u-cjk-xa-3413');
    T.eq(matcher[0].c2, '㐓');
    T.eq(matcher[0].c3, '125125');
    // T.eq matcher[ 0 ].ncr,    'u-cjk-xa-3413'
    // T.eq matcher[ 0 ].glyph,  '㐓'
    // T.eq matcher[ 0 ].wbf,    '125125'
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import TSV; cfg variants 2"] = async function(T, done) {
    var Dba, cfg, dba, import_path, is_first, matcher, schema, transform;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = H.get_cfg().tsv.micro;
    //.........................................................................................................
    whisper('-'.repeat(108));
    dba = new Dba();
    schema = 'tsv';
    transform = null;
    is_first = true;
    //.........................................................................................................
    transform = function(d) {
      var glyph, match, ncr, wbf;
      urge('^58472^', d.row);
      ({ncr, glyph, wbf} = d.row);
      T.eq(type_of(d.row), 'object');
      if ((match = wbf.match(/^<(?<wbf>[0-9]+)>$/)) == null) {
        // return null if ( not ncr? ) or ( not glyph? ) or ( not wbf? )
        // if not wbf? then T.fail "^3455^ invalid row #{rpr d.row}"; return null
        return null;
      }
      wbf = match.groups.wbf;
      return {
        c1: ncr,
        c2: glyph,
        c3: wbf
      };
    };
    //.........................................................................................................
    cfg = {
      schema: schema,
      transform: transform,
      path: import_path,
      format: 'tsv',
      skip_any_null: true,
      // skip_all_null:  true
      input_columns: true,
      table_columns: {
        c1: 'text',
        c2: 'text',
        c3: 'text'
      },
      ram: true
    };
    await dba.import(cfg);
    //.........................................................................................................
    matcher = dba.list(dba.query(`select * from tsv.main order by 1, 2, 3;`));
    // matcher = dba.list dba.query """select * from tsv.main;"""
    // debug '^5697^', matcher
    console.table(matcher);
    T.eq(matcher.length, 12);
    T.eq(matcher[0].c1, 'u-cjk-xa-3413');
    T.eq(matcher[0].c2, '㐓');
    T.eq(matcher[0].c3, '125125');
    T.eq(matcher[11].c1, 'u-cjk-xa-3566');
    T.eq(matcher[11].c2, '㕦');
    T.eq(matcher[11].c3, '251134');
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import TSV; cfg variants 3"] = async function(T, done) {
    var Dba, cfg, dba, import_path, is_first, matcher, schema, transform;
    // T.halt_on_error()
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = H.get_cfg().tsv.micro;
    //.........................................................................................................
    whisper('-'.repeat(108));
    dba = new Dba();
    schema = 'tsv';
    transform = null;
    is_first = true;
    //.........................................................................................................
    transform = function(d) {
      var glyph, match, ncr, wbf;
      urge('^58472^', d.row);
      ({ncr, glyph, wbf} = d.row);
      T.eq(type_of(d.row), 'object');
      // return null if ( not ncr? ) or ( not glyph? ) or ( not wbf? )
      if (wbf == null) {
        T.fail(`^3455^ invalid row ${rpr(d.row)}`);
        return null;
      }
      if ((match = wbf.match(/^<(?<wbf>[0-9]+)>$/)) == null) {
        return null;
      }
      wbf = match.groups.wbf;
      return {ncr, glyph, wbf};
    };
    //.........................................................................................................
    cfg = {
      schema: schema,
      transform: transform,
      path: import_path,
      format: 'tsv',
      skip_all_null: true,
      skip_comments: true,
      input_columns: true,
      ram: true
    };
    await dba.import(cfg);
    //.........................................................................................................
    matcher = dba.list(dba.query(`select * from tsv.main order by 1, 2, 3;`));
    // matcher = dba.list dba.query """select * from tsv.main;"""
    // debug '^5697^', matcher
    console.table(matcher);
    T.eq(matcher.length, 12);
    T.eq(matcher[0].ncr, 'u-cjk-xa-3413');
    T.eq(matcher[0].glyph, '㐓');
    T.eq(matcher[0].wbf, '125125');
    T.eq(matcher[11].ncr, 'u-cjk-xa-3566');
    T.eq(matcher[11].glyph, '㕦');
    T.eq(matcher[11].wbf, '251134');
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import TSV; cfg variants 4"] = async function(T, done) {
    var Dba, cfg, dba, import_path, is_first, matcher, schema, transform;
    // T.halt_on_error()
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = H.get_cfg().tsv.holes;
    //.........................................................................................................
    whisper('-'.repeat(108));
    dba = new Dba();
    schema = 'tsv';
    transform = null;
    is_first = true;
    //.........................................................................................................
    transform = function(d) {
      var glyph, lnr, ncr, wbf;
      urge('^58472^', d.row);
      ({lnr, ncr, glyph, wbf} = d.row);
      lnr = parseInt(lnr, 10);
      return {lnr, ncr, glyph, wbf};
    };
    //.........................................................................................................
    cfg = {
      schema: schema,
      transform: transform,
      path: import_path,
      // skip_all_null:  true
      skip_comments: false,
      default_value: 'EMPTY',
      input_columns: true,
      table_columns: {
        lnr: 'integer',
        ncr: 'text',
        glyph: 'text',
        wbf: 'text'
      },
      ram: true
    };
    await dba.import(cfg);
    //.........................................................................................................
    matcher = dba.list(dba.query(`select * from tsv.main order by 1, 2, 3;`));
    // matcher = dba.list dba.query """select * from tsv.main;"""
    debug('^5697^', matcher);
    console.table(matcher);
    T.eq(matcher, [
      {
        lnr: 1,
        ncr: 'EMPTY',
        glyph: 'EMPTY',
        wbf: 'EMPTY'
      },
      {
        lnr: 2,
        ncr: '# this line to be discarded',
        glyph: 'EMPTY',
        wbf: 'EMPTY'
      },
      {
        lnr: 3,
        ncr: 'EMPTY',
        glyph: 'EMPTY',
        wbf: 'EMPTY'
      },
      {
        lnr: 4,
        ncr: '"a line with \\"quotes\\""',
        glyph: 'nothing',
        wbf: 'empty'
      },
      {
        lnr: 5,
        ncr: 'u-cjk-xa-3413',
        glyph: '㐓',
        wbf: '<125125>'
      },
      {
        lnr: 6,
        ncr: 'u-cjk-xa-3414',
        glyph: '㐔',
        wbf: '<412515>'
      },
      {
        lnr: 7,
        ncr: 'u-cjk-xa-3415',
        glyph: '㐕',
        wbf: '<251215>'
      },
      {
        lnr: 8,
        ncr: 'u-cjk-xa-3416',
        glyph: '㐖',
        wbf: '<1212515>'
      },
      {
        lnr: 9,
        ncr: 'EMPTY',
        glyph: '㐗',
        wbf: '<1213355>'
      },
      {
        lnr: 10,
        ncr: 'u-cjk-xa-34ab',
        glyph: 'EMPTY',
        wbf: '<121135>'
      },
      {
        lnr: 11,
        ncr: 'u-cjk-xa-342a',
        glyph: '㐪',
        wbf: 'EMPTY'
      },
      {
        lnr: 12,
        ncr: 'u-cjk-xa-342b',
        glyph: '㐫',
        wbf: '<413452>'
      },
      {
        lnr: 13,
        ncr: 'u-cjk-xa-3563',
        glyph: '㕣',
        wbf: '<34251>'
      },
      {
        lnr: 14,
        ncr: 'u-cjk-xa-3564',
        glyph: '㕤',
        wbf: '<25135>'
      },
      {
        lnr: 15,
        ncr: 'u-cjk-xa-3565',
        glyph: '㕥',
        wbf: '<25134>'
      },
      {
        lnr: 16,
        ncr: 'u-cjk-xa-3566',
        glyph: '㕦',
        wbf: '<251134>'
      },
      {
        lnr: 17,
        ncr: 'EMPTY',
        glyph: 'EMPTY',
        wbf: 'EMPTY'
      }
    ]);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: import CSV; cfg variants 5"] = async function(T, done) {
    var Dba, cfg, dba, import_path, is_first, matcher, schema, transform;
    // T.halt_on_error()
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = H.get_cfg().csv.holes;
    //.........................................................................................................
    whisper('-'.repeat(108));
    dba = new Dba();
    schema = 'csv';
    transform = null;
    is_first = true;
    //.........................................................................................................
    transform = function(d) {
      var glyph, lnr, ncr, wbf;
      urge('^58472^', d.row);
      ({lnr, ncr, glyph, wbf} = d.row);
      lnr = parseInt(lnr, 10);
      return {lnr, ncr, glyph, wbf};
    };
    //.........................................................................................................
    cfg = {
      schema: schema,
      transform: transform,
      path: import_path,
      // skip_all_null:  true
      skip_comments: true,
      default_value: null,
      input_columns: true,
      table_columns: {
        lnr: 'integer',
        ncr: 'text',
        glyph: 'text',
        wbf: 'text'
      },
      ram: true
    };
    await dba.import(cfg);
    //.........................................................................................................
    matcher = dba.list(dba.query(`select * from csv.main order by 1, 2, 3;`));
    // matcher = dba.list dba.query """select * from csv.main;"""
    debug('^5697^', matcher);
    console.table(matcher);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: VNRs"] = function(T, done) {
    var Dba, SQL, bcd, dba, hollerith_tng, matcher, name, schema, sql, to_hex, use_probe;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
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
    dba.function('hollerith_encode', {
      deterministic: true,
      varargs: false
    }, function(vnr_json) {
      debug('^3338^', rpr(vnr_json));
      return dba.as_hollerith(JSON.parse(vnr_json));
    });
    //.........................................................................................................
    dba.function('hollerith_classic', {
      deterministic: true,
      varargs: false
    }, function(vnr_json) {
      var vnr;
      vnr = JSON.parse(vnr_json);
      while (vnr.length < 5) {
        vnr.push(0);
      }
      debug('^3338^', rpr(vnr));
      return dba.as_hollerith(vnr);
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
    dba.function('hollerith_tng', {
      deterministic: true,
      varargs: false
    }, function(vnr_json) {
      return hollerith_tng(JSON.parse(vnr_json));
    });
    dba.function('bcd', {
      deterministic: true,
      varargs: false
    }, function(vnr_json) {
      return bcd(JSON.parse(vnr_json));
    });
    //.........................................................................................................
    to_hex = function(blob) {
      return blob.toString('hex');
    };
    dba.function('to_hex', {
      deterministic: true,
      varargs: false
    }, to_hex);
    //.........................................................................................................
    dba.execute(`create table v.main (
    nr                int   unique not null,
    vnr               json  unique not null,
    vnr_hollerith_tng blob  generated always as ( hollerith_tng(  vnr ) ) stored,
    vnr_bcd           blob  generated always as ( bcd(            vnr ) ) stored,
  primary key ( nr ) );`);
    //.........................................................................................................
    dba.execute(`create unique index v.main_vnr_hollerith_tng on main ( hollerith_tng( vnr ) );`);
    dba.execute(`create unique index v.main_vnr_bcd on main ( bcd( vnr ) );`);
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
          results.push(dba.run("insert into v.main ( nr, vnr ) values ( ?, ? )", values));
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
  this["DBA: import TSV; big file"] = async function(T, done) {
    var Dba, count, dba, export_path, formula_count, import_cfg, import_path, is_first, matcher, non_components, schema, spread_cfg, transform;
    // T.halt_on_error()
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = '../../../assets/jzrds/shape/shape-breakdown-formula-v2.txt';
    import_path = PATH.resolve(PATH.join(__dirname, import_path));
    debug('^343^', import_path);
    //.........................................................................................................
    whisper('-'.repeat(108));
    dba = new Dba();
    schema = 'formulas';
    transform = null;
    is_first = true;
    count = 0;
    transform = null;
    //.........................................................................................................
    transform = function(d) {
      var elements, formula, glyph, ncr;
      count++;
      if (count > 15_100) {
        // return null if count < 15_000
        return d.stop;
      }
      if (modulo(count, 1000) === 0) {
        urge('^346664^', count);
      }
      ({ncr, glyph, formula} = d.row);
      elements = null;
      elements = formula.replace(/(&[a-z0-9\x23]+;|.)/gu, '"$1",');
      elements = elements.slice(0, elements.length - 1);
      elements = `[${elements}]`;
      // debug '^4697^', { ncr, glyph, formula, elements, }
      return {ncr, glyph, formula, elements};
    };
    //.........................................................................................................
    import_cfg = {
      schema: schema,
      transform: transform,
      format: 'tsv',
      path: import_path,
      // skip_all_null:  true
      skip_comments: true,
      default_value: null,
      input_columns: ['ncr', 'glyph', 'formula'],
      table_columns: ['ncr', 'glyph', 'formula', 'elements'],
      // table_columns:  { lnr: 'integer', ncr: 'text', glyph: 'text', wbf: 'text', }
      ram: true
    };
    await dba.import(import_cfg);
    console.table(dba.list(dba.query(`select * from formulas.main limit 10;`)));
    //.........................................................................................................
    urge('^4486^', "updating...");
    //.........................................................................................................
    non_components = new Set(Array.from("()[]§'≈'●⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻〓≈ ↻↔ ↕ ▽"));
    spread_cfg = {
      columns: ['nr', 'element'],
      parameters: ['elements'],
      rows: function*(elements) {
        var element, i, idx, len;
        elements = JSON.parse(elements);
// components  = ( d for d in components when not non_components.has d )
        for (idx = i = 0, len = elements.length; i < len; idx = ++i) {
          element = elements[idx];
          yield [idx + 1, element];
        }
        return null;
      }
    };
    dba.sqlt.table('spread', spread_cfg);
    // console.table dba.list dba.query """select glyph, formula, spread( elements ) from main;"""
    dba.execute(`create table formulas.elements (
glyph text    not null,
nr1   integer not null,
nr2   integer default 0,
nr3   integer default 0,
nr4   integer default 0,
nr5   integer default 0,
nr6   integer default 0,
e1    text    not null,
e2    text,
e3    text,
e4    text,
e5    text,
e6    text );`);
    urge('^4486^', "inserting elements level 1");
    dba.execute(`insert into formulas.elements ( glyph, nr1, e1 ) select
    v1.glyph    as glyph,
    v2.nr       as nr1,
    v2.element  as e1
  from
    main                  as v1,
    spread( v1.elements ) as v2
  -- limit 500
  ;`);
    urge('^4486^', "inserting elements level 2");
    dba.execute(`insert into formulas.elements ( glyph, nr1, nr2, e1, e2 ) select
    v1.glyph    as glyph,
    v1.nr1      as nr1,
    v2.nr1      as nr2,
    v1.e1       as e1,
    v2.e1       as e2
  from
    formulas.elements     as v1
  join
    formulas.elements     as v2
    on ( true
      and ( v1.glyph  = v2.glyph  )
      and ( v1.nr1    = v2.nr1    ) )
  limit 500
  ;`);
    console.table(dba.list(dba.query(`select * from formulas.elements limit 10;`)));
    console.table(dba.list(dba.query(`select * from formulas.elements where glyph in ( '凁', '凂', '一', '凃', '丁', '凄', '丂', '凲', '並' ) order by nr1, nr2;`)));
    // console.table dba.list dba.query """
    //   select
    //       v1.ncr,
    //       v1.glyph,
    //       v1.formula,
    //       v2.nr,
    //       v2.element
    //     from
    //       main                  as v1,
    //       spread( v1.elements ) as v2
    //     limit 500;"""
    // dba.execute """
    //   create view formulas.occurrences as select 1;"""
    // dba.execute """update formulas.main set xformula0 = glyph || '[' || formula || ']';"""
    // dba.execute """update formulas.main set xformula = glyph || '[' || formula || ']';"""
    //.........................................................................................................
    // matcher = dba.list dba.query """
    //   select
    //       *
    //     from formulas.main
    //     where true
    //       and ( glyph not like '&%' )
    //       and ( formula not in ( '∅', '▽', '●' ) )
    //       and ( formula not like '%(%' )
    //       and ( formula not like '%&%' )
    //     order by formula
    //     limit 300;"""
    // debug '^5697^', matcher
    formula_count = dba.first_value(dba.query(`select count(*) from formulas.main;`));
    export_path = H.nonexistant_path_from_ref('export-formulas');
    help(`^343589^ exporting ${formula_count} formulas to ${export_path}`);
    dba.export({
      schema,
      path: export_path
    });
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___ DBA: safe eventual persistency"] = async function(T, done) {
    var Dba, cfg, dba, import_path, is_first, matcher, schema, transform;
    // T.halt_on_error()
    ({Dba} = require('../../../apps/icql-dba'));
    matcher = null;
    import_path = H.get_cfg().csv.holes;
    //.........................................................................................................
    dba = new Dba();
    schema = 'csv';
    transform = null;
    is_first = true;
    //.........................................................................................................
    transform = function(d) {
      var glyph, lnr, ncr, wbf;
      urge('^58472^', d.row);
      ({lnr, ncr, glyph, wbf} = d.row);
      lnr = parseInt(lnr, 10);
      return {lnr, ncr, glyph, wbf};
    };
    //.........................................................................................................
    cfg = {
      schema: schema,
      transform: transform,
      path: import_path,
      // skip_all_null:  true
      skip_comments: true,
      default_value: null,
      input_columns: true,
      table_columns: {
        lnr: 'integer',
        ncr: 'text',
        glyph: 'text',
        wbf: 'text'
      },
      ram: true
    };
    await dba.import(cfg);
    //.........................................................................................................
    matcher = dba.list(dba.query(`select * from csv.main order by 1, 2, 3;`));
    // matcher = dba.list dba.query """select * from csv.main;"""
    debug('^5697^', matcher);
    console.table(matcher);
    process.once('uncaughtException', exit_handler);
    process.once('unhandledRejection', exit_handler);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: virtual tables"] = function(T, done) {
    var Dba, FS, cfg, dba, export_path, is_first, matcher, path, schema, sql, transform;
    /* new in 7.4.0, see https://github.com/JoshuaWise/better-sqlite3/issues/581 */
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    FS = require('fs');
    //.........................................................................................................
    dba = new Dba();
    // schema            = 'csv'
    // schema_i          = dba.sql.I schema
    transform = null;
    is_first = true;
    //.........................................................................................................
    cfg = {
      columns: ['path', 'data'],
      rows: function*() {
        var data, filename, i, len, path, ref;
        ref = FS.readdirSync(__dirname);
        for (i = 0, len = ref.length; i < len; i++) {
          filename = ref[i];
          path = PATH.resolve(PATH.join(__dirname, filename));
          data = (FS.readFileSync(path, {
            encoding: 'utf-8'
          })).trim().slice(0, 51);
          yield ({path, data});
        }
        return null;
      }
    };
    dba.sqlt.table("files", cfg);
    matcher = dba.list(dba.query("select * from files order by data;"));
    console.table(matcher);
    //.........................................................................................................
    cfg = {
      columns: ['match', 'capture'],
      parameters: ['pattern', 'text'],
      rows: function*(pattern, text) {
        var match, regex;
        regex = new RegExp(pattern, 'g');
        while ((match = regex.exec(text)) != null) {
          yield [match[0], match[1]];
        }
        return null;
      }
    };
    dba.sqlt.table('re_matches', cfg);
    sql = "select pattern, text, match, capture from re_matches( ?, ? ) order by 1, 2, 3, 4;";
    matcher = dba.list(dba.query(sql, ['€([-,.0-9]+)', "between €30,-- and €40,--"]));
    console.table(matcher);
    //.........................................................................................................
    cfg = function(filename, ...P) {
      urge('^46456^', {filename, P});
      return {
        columns: ['path', 'lnr', 'line'],
        rows: function*() {
          var i, len, line, line_idx, lines, path;
          path = PATH.resolve(PATH.join(__dirname, '../../../assets/icql', filename));
          lines = (FS.readFileSync(path, {
            encoding: 'utf-8'
          })).split('\n');
          for (line_idx = i = 0, len = lines.length; i < len; line_idx = ++i) {
            line = lines[line_idx];
            yield ({
              path,
              lnr: line_idx + 1,
              line
            });
          }
          return null;
        }
      };
    };
    dba.sqlt.table('file_contents', cfg);
    dba.execute("create virtual table contents_of_wbftsv using file_contents( ncrglyphwbf.tsv, any stuff goes here, and more here );");
    sql = "select * from contents_of_wbftsv order by 1, 2, 3;";
    matcher = dba.list(dba.query(sql));
    console.table(matcher);
    //.........................................................................................................
    cfg = {
      columns: ['n'],
      parameters: ['start', 'stop', 'step'],
      rows: function*(start, stop, step = null) {
        var n;
        // stop ?= start
        if (step == null) {
          step = 1;
        }
        n = start;
        while (true) {
          if (n > stop) {
            break;
          }
          // if n %% 2 is 0 then yield [ "*#{n}*", ]
          // else                yield [ n, ]
          yield [n];
          n += step;
        }
        return null;
      }
    };
    dba.sqlt.table('generate_series', cfg);
    console.table(dba.list(dba.query("select * from generate_series( ?, ? )", [1, 5])));
    console.table(dba.list(dba.query("select * from generate_series( ?, ?, ? )", [1, 10, 2])));
    console.table(dba.list(dba.query("select * from generate_series( ?, ?, ? ) limit 10;", [500, 2e308, 1234])));
    //.........................................................................................................
    cfg = {
      columns: ['path', 'vnr', 'line', 'vnr_h'],
      parameters: ['_path'],
      rows: function*(path) {
        var bytes, line, lnr, readlines, vnr, vnr_h, vnr_json;
        readlines = new (require('n-readlines'))(path);
        lnr = 0;
        while ((bytes = readlines.next()) !== false) {
          lnr++;
          vnr = [lnr];
          vnr_json = JSON.stringify(vnr);
          line = bytes.toString('utf-8');
          vnr_h = dba.as_hollerith(vnr);
          yield [path, vnr_json, line, vnr_h];
        }
        return null;
      }
    };
    dba.sqlt.table('readlines', cfg);
    path = H.get_cfg().tsv.micro;
    urge(`^44558^ reading from ${path}`);
    dba.execute("create table foolines ( path text, vnr json, line text, vnr_h bytea );");
    // dba.execute "insert into foolines select * from readlines( ? );", [ path, ]
    dba.execute(`insert into foolines select * from readlines( ${dba.sql.L(path)} );`);
    // console.table dba.list dba.query "select * from readlines( ? ) order by vnr_h;", [ path, ]
    console.table(dba.list(dba.query("select * from foolines;")));
    //.........................................................................................................
    export_path = H.nonexistant_path_from_ref('export-virtual-tables');
    schema = 'main';
    dba.export({
      schema,
      path: export_path
    });
    urge(`^35345^ schema ${rpr(schema)} exported to ${export_path}`);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_csv_parser = function() {
    return new Promise((resolve) => {
      var Dba, csv, csv_cfg, dba, fs, import_path, rows, tcfg;
      ({Dba} = require('../../../apps/icql-dba'));
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
  this["DBA: open() DB in schema main"] = async function(T, done) {
    var Dba, schema, schemas, template_path, work_path;
    T.halt_on_error();
    ({Dba} = require('../../../apps/icql-dba'));
    schemas = {};
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'F-open-in-main'
    })));
    schema = 'main';
    await (() => {      //.........................................................................................................
      var d, db_path, dba, ref;
      /* Opening a RAM DB from file */
      urge('^344-3^', {template_path, work_path, schema});
      // dba     = new Dba()
      dba = new Dba();
      dba.open({
        path: work_path
      });
      T.ok(H.types.isa.datamill_db_lookalike({dba, schema}));
      ref = dba.query("select * from pragma_database_list order by seq;");
      for (d of ref) {
        // help '^43451^', dba.list dba.query "select * from ramdb.sqlite_schema;"
        info(d);
      }
      db_path = dba.first_value(dba.query("select file from pragma_database_list where name = ?;", [schema]));
      T.eq(db_path, work_path);
      T.eq(db_path, dba._path_of_schema(schema));
      T.ok(!dba.is_ram_db({schema}));
      info('^35345^', dba._schemas);
      dba.execute("create table main.x ( id int primary key ); insert into x ( id ) values ( 123 );");
      return null;
    })();
    await (() => {      //.........................................................................................................
      var d, dba, i, len, ref;
      /* Opening a RAM DB from file */
      urge('^344-3^', {template_path, work_path, schema});
      // dba     = new Dba()
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
      T.eq(dba.list(dba.query("select * from main.x;")), [
        {
          id: 123
        }
      ]);
      return debug('^3334^', dba);
    })();
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this, {
        timeout: 10e3
      });
    })();
  }

  // test @[ "DBA: VNRs" ], { timeout: 5e3, }
// test @[ "DBA: import TSV; big file" ], { timeout: 60e3, }
// test @[ "DBA: open() DB in schema main" ]
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

}).call(this);

//# sourceMappingURL=future.tests.js.map