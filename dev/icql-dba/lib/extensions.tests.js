(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, rpr, test, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({to_width} = require('to-width'));

  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this["load_extension"] = function(T, done) {
    var Dba;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    (() => {      //---------------------------------------------------------------------------------------------------------
      var cfg, dba, r1, r2;
      dba = new Dba();
      cfg = H.get_cfg();
      // dba.load_extension PATH.resolve PATH.join '/home/flow/jzr/hengist/dev/in-memory-sql/json1.so'
      // # dba.load_extension PATH.resolve PATH.join '/home/flow/3rd-party-repos/sqlite/ext/fts5/fts5'
      //.......................................................................................................
      info('^334-1^', r1 = dba.list(dba.query(SQL`select json(' { "this" : "is", "a": [ "test" ] } ') as d;`)));
      info('^334-1^', r2 = dba.list(dba.query(SQL`select json_array(1,2,'3',4) as d;`)));
      if (T != null) {
        T.eq(r1, [
          {
            d: '{"this":"is","a":["test"]}'
          }
        ]);
      }
      if (T != null) {
        T.eq(r2, [
          {
            d: '[1,2,"3",4]'
          }
        ]);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SQLite math functions"] = function(T, done) {
    var Dba;
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    (() => {      //---------------------------------------------------------------------------------------------------------
      var cfg, dba, r1;
      dba = new Dba();
      cfg = H.get_cfg();
      // dba.load_extension PATH.resolve PATH.join '/home/flow/jzr/hengist/dev/in-memory-sql/json1.so'
      // # dba.load_extension PATH.resolve PATH.join '/home/flow/3rd-party-repos/sqlite/ext/fts5/fts5'
      //.......................................................................................................
      info('^334-1^', r1 = dba.list(dba.query(SQL`select sin( ? ) as d;`, [Math.PI])));
      if (T != null) {
        T.eq(r1, [
          {
            d: 1.2246467991473532e-16
          }
        ]);
      }
      return null;
    })();
    //---------------------------------------------------------------------------------------------------------
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: sqlean vsv extension"] = async function(T, done) {
    var Dba, I, L, V, csv_path, dba, extension_path, schema, work_path;
    /* see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md */
    // T.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    schema = 'main';
    dba = new Dba();
    extension_path = PATH.resolve(PATH.join(__dirname, '../../../assets/sqlite-extensions/vsv.so'));
    csv_path = H.get_cfg().csv.holes;
    work_path = (await H.procure_file({
      path: csv_path,
      name: 'vsv-sample.csv'
    }));
    // debug '^857^', { csv_path, work_path, }
    ({I, L, V} = new (require('../../../apps/icql-dba/lib/sql')).Sql());
    await (() => {      //.........................................................................................................
      var ref, results, row;
      dba.load_extension(extension_path);
      dba.run(SQL`create virtual table myvsv using vsv(
  filename  = ${L(work_path)},      -- the filename, passed to the Operating System
  -- data=STRING         -- alternative data
  -- schema=STRING       -- Alternate Schema to use
  -- columns=N           -- columns parsed from the VSV file
  -- header=BOOL         -- whether or not a header row is present
  -- skip=N              -- number of leading data rows to skip
  -- rsep=STRING         -- record separator
  -- fsep=STRING         -- field separator
  -- validatetext=BOOL   -- validate UTF-8 encoding of text fields
  -- affinity=AFFINITY   -- affinity to apply to each returned value
  nulls     = true                -- empty fields are returned as NULL
  );`);
      ref = dba.query(SQL`select * from myvsv;`);
      results = [];
      for (row of ref) {
        results.push(info('^5554^', row));
      }
      return results;
    })();
    // dba.execute SQL"insert into myvsv ( c0 ) values ( '1111' );"
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @
    // test @[ "load_extension" ]
    test(this["SQLite math functions"]);
  }

}).call(this);

//# sourceMappingURL=extensions.tests.js.map