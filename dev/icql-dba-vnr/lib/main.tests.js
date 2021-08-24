(function() {
  'use strict';
  var CATALOGUE, CND, PATH, SQL, badge, dba_path, debug, echo, equals, freeze, help, info, isa, jp, jr, lets, rpr, test, type_of, types, urge, validate, validate_list_of, vnr_path, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA-VNR/TESTS';

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

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  SQL = String.raw;

  vnr_path = '../../../apps/icql-dba-vnr';

  dba_path = '../../../apps/icql-dba';

  ({lets, freeze} = require('letsfreezethat'));

  CATALOGUE = require('multimix/lib/cataloguing');

  jr = JSON.stringify;

  jp = JSON.parse;

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this["API"] = function(T, done) {
    var Dba, Vnr, dba, fq, prefix, vnr;
    // T?.halt_on_error()
    //.........................................................................................................
    ({Vnr} = require(vnr_path));
    ({Dba} = require(dba_path));
    prefix = 'vnr_';
    dba = new Dba();
    vnr = new Vnr({dba, prefix});
    fq = function(...P) {
      return dba.first_value(dba.query(...P));
    };
    //.........................................................................................................
    /* NOTE these are just shallow sanity checks; for tests proper see
     https://github.com/loveencounterflow/hengist/blob/master/dev/datom/src/vnr.test.coffee */
    if (T != null) {
      T.eq(vnr.advance([1, 2, 3]), [1, 2, 4]);
    }
    if (T != null) {
      T.eq(vnr.recede([1, 2, 3]), [1, 2, 2]);
    }
    if (T != null) {
      T.eq(vnr.deepen([1, 2, 3]), [1, 2, 3, 0]);
    }
    if (T != null) {
      T.eq(vnr.cmp_fair([1, 2, 3], [1, 2]), 1);
    }
    if (T != null) {
      T.eq(vnr.cmp_partial([1, 2, 3], [1, 2]), 1);
    }
    if (T != null) {
      T.eq(vnr.cmp_total([1, 2, 3], [1, 2]), 1);
    }
    if (T != null) {
      T.eq(vnr.new_vnr([1, 2, 3]), [1, 2, 3]);
    }
    if (T != null) {
      T.eq(vnr.new_vnr(null), [0]);
    }
    if (T != null) {
      T.eq(vnr.encode([1, 2, 3]), Buffer.from('8000000180000002800000038000000080000000', 'hex'));
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(jp(fq(SQL`select vnr_advance(     '[ 1, 2, 3 ]' );`)), [1, 2, 4]);
    }
    if (T != null) {
      T.eq(jp(fq(SQL`select vnr_recede(      '[ 1, 2, 3 ]' );`)), [1, 2, 2]);
    }
    if (T != null) {
      T.eq(jp(fq(SQL`select vnr_deepen(      '[ 1, 2, 3 ]' );`)), [1, 2, 3, 0]);
    }
    if (T != null) {
      T.eq(fq(SQL`select vnr_cmp_fair(    '[ 1, 2, 3 ]', '[ 1, 2 ]' );`), 1);
    }
    if (T != null) {
      T.eq(fq(SQL`select vnr_cmp_partial( '[ 1, 2, 3 ]', '[ 1, 2 ]' );`), 1);
    }
    if (T != null) {
      T.eq(fq(SQL`select vnr_cmp_total(   '[ 1, 2, 3 ]', '[ 1, 2 ]' );`), 1);
    }
    if (T != null) {
      T.eq(jp(fq(SQL`select vnr_new_vnr(     '[ 1, 2, 3 ]' );`)), [1, 2, 3]);
    }
    if (T != null) {
      T.eq(jp(fq(SQL`select vnr_new_vnr(      null         );`)), [0]);
    }
    if (T != null) {
      T.eq(fq(SQL`select vnr_encode(      '[ 1, 2, 3 ]' );`), Buffer.from('8000000180000002800000038000000080000000', 'hex'));
    }
    if (T != null) {
      T.eq(vnr.hollerith.nr_min, -2147483648);
    }
    if (T != null) {
      T.eq(vnr.hollerith.nr_max, 2147483647);
    }
    if (T != null) {
      T.eq(vnr.encode([vnr.hollerith.nr_min, vnr.hollerith.nr_max]), Buffer.from('00000000ffffffff800000008000000080000000', 'hex'));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["VNR basics (JS)"] = function(T, done) {
    var Dba, Tbl, Vnr, d, dba, vnr;
    // T?.halt_on_error()
    //.........................................................................................................
    ({Vnr} = require(vnr_path));
    ({Dba} = require(dba_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dba = new Dba();
    vnr = new Vnr({dba});
    //.........................................................................................................
    if (T != null) {
      T.eq((d = vnr.new_vnr()), [0]);
    }
    if (T != null) {
      T.eq((d = vnr.new_vnr([4, 6, 5])), [4, 6, 5]);
    }
    if (T != null) {
      T.eq((d = vnr.deepen(d)), [4, 6, 5, 0]);
    }
    if (T != null) {
      T.eq((d = vnr.deepen(d, 42)), [4, 6, 5, 0, 42]);
    }
    if (T != null) {
      T.eq((d = vnr.advance(d)), [4, 6, 5, 0, 43]);
    }
    if (T != null) {
      T.eq((d = vnr.recede(d)), [4, 6, 5, 0, 42]);
    }
    if (T != null) {
      T.ok((vnr.new_vnr(d)) !== d);
    }
    if (T != null) {
      T.ok((vnr.deepen(d)) !== d);
    }
    if (T != null) {
      T.ok((vnr.advance(d)) !== d);
    }
    if (T != null) {
      T.ok((vnr.recede(d)) !== d);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["VNR basics (SQL)"] = function(T, done) {
    var Dba, Tbl, Vnr, d, dba, fq, vnr;
    // T?.halt_on_error()
    //.........................................................................................................
    ({Vnr} = require(vnr_path));
    ({Dba} = require(dba_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dba = new Dba();
    vnr = new Vnr({dba});
    fq = function(...P) {
      return dba.first_value(dba.query(...P));
    };
    //.........................................................................................................
    if (T != null) {
      T.eq((d = jp(fq(SQL`select vnr_new_vnr();`))), [0]);
    }
    if (T != null) {
      T.eq((d = jp(fq(SQL`select vnr_new_vnr(  '[ 4, 6, 5 ]' );`))), [4, 6, 5]);
    }
    if (T != null) {
      T.eq((d = jp(fq(SQL`select vnr_deepen(   $d            );`, {
        d: jr(d)
      }))), [4, 6, 5, 0]);
    }
    if (T != null) {
      T.eq((d = jp(fq(SQL`select vnr_deepen(   $d, 42        );`, {
        d: jr(d)
      }))), [4, 6, 5, 0, 42]);
    }
    if (T != null) {
      T.eq((d = jp(fq(SQL`select vnr_advance(  $d            );`, {
        d: jr(d)
      }))), [4, 6, 5, 0, 43]);
    }
    if (T != null) {
      T.eq((d = jp(fq(SQL`select vnr_recede(   $d            );`, {
        d: jr(d)
      }))), [4, 6, 5, 0, 42]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["alter_table"] = function(T, done) {
    var Dba, Tbl, Vnr, blob_column_name, dba, error, insert_sql, json_column_name, schema, table_name, tbl, vnr;
    if (T != null) {
      T.halt_on_error();
    }
    //.........................................................................................................
    ({Vnr} = require(vnr_path));
    ({Dba} = require(dba_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dba = new Dba();
    vnr = new Vnr({dba});
    tbl = new Tbl({dba});
    // debug '^3342^', CATALOGUE.all_keys_of vnr.hollerith
    //.........................................................................................................
    dba.execute(SQL`create table myfile ( line text not null );`);
    //.........................................................................................................
    schema = 'main';
    table_name = 'myfile';
    json_column_name = 'vnr';
    blob_column_name = null;
    vnr.alter_table({schema, table_name, json_column_name, blob_column_name});
    insert_sql = SQL`insert into myfile ( line, vnr ) values ( $line, $vnr )`;
    dba.run(insert_sql, {
      line: "third",
      vnr: jr([3])
    });
    dba.run(insert_sql, {
      line: "second",
      vnr: jr([2])
    });
    dba.run(insert_sql, {
      line: "first",
      vnr: jr([1])
    });
    //.........................................................................................................
    error = null;
    try {
      dba.run(insert_sql, {
        line: "fourth",
        vnr: jr([3])
      });
    } catch (error1) {
      error = error1;
      if (T != null) {
        T.eq(error.code, 'SQLITE_CONSTRAINT_UNIQUE');
      }
      debug(error.name);
    }
    if (T != null) {
      T.ok(error != null);
    }
    //.........................................................................................................
    debug(tbl.dump_db({
      order_by: '1'
    }));
    T.eq(dba.list(dba.query(SQL`select * from myfile order by vnr_blob;`)), [
      {
        line: 'first',
        vnr: '[1]',
        vnr_blob: Buffer.from('8000000180000000800000008000000080000000',
      'hex')
      },
      {
        line: 'second',
        vnr: '[2]',
        vnr_blob: Buffer.from('8000000280000000800000008000000080000000',
      'hex')
      },
      {
        line: 'third',
        vnr: '[3]',
        vnr_blob: Buffer.from('8000000380000000800000008000000080000000',
      'hex')
      }
    ]);
    return typeof done === "function" ? done() : void 0;
  };

  // for [ probe, matcher, error, ] in probes_and_matchers
  //   await T.perform probe, matcher, error, -> new Promise ( resolve ) ->

  //-----------------------------------------------------------------------------------------------------------
  this["_"] = function(T, done) {
    var Dba, Vnr, dba, probes_and_matchers, vnr;
    if (T != null) {
      T.halt_on_error();
    }
    //.........................................................................................................
    probes_and_matchers = [];
    ({Vnr} = require(vnr_path));
    ({Dba} = require(dba_path));
    dba = new Dba();
    vnr = new Vnr({dba});
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this, {
        timeout: 10e3
      });
    })();
  }

  // @[ "alter_table" ]()

}).call(this);

//# sourceMappingURL=main.tests.js.map