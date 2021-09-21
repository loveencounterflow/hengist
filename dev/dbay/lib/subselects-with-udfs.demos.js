(function() {
  'use strict';
  var CND, H, PATH, SQL, _begin_transaction, _commit_transaction, badge, cfg, debug, demo_f, echo, ff, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/SUBSELECTS-WITH-UDFS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  cfg = {
    // verbose:    true
    verbose: false
  };

  //-----------------------------------------------------------------------------------------------------------
  _begin_transaction = function(ut, sqlt_a, sqlt_b) {
    if (!ut) {
      return;
    }
    if (cfg.verbose) {
      debug('^334-1^', "begin tx");
    }
    sqlt_a.exec(SQL`begin transaction;`);
    if (sqlt_a !== sqlt_b) {
      sqlt_b.exec(SQL`begin transaction;`);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  _commit_transaction = function(ut, sqlt_a, sqlt_b) {
    if (!ut) {
      return;
    }
    if (cfg.verbose) {
      debug('^334-2^', "commit tx");
    }
    sqlt_a.exec(SQL`commit;`);
    if (sqlt_a !== sqlt_b) {
      sqlt_b.exec(SQL`commit;`);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  ff = function(db, count, fingerprint) {
    var error, ft, i, inner_row, inner_rows, inner_statement, len, outer_row, outer_statement, ref, ref1, result, sc, sf, sqlt_a, sqlt_b, statement, un, ut, uu, uw;
    sqlt_a = db.sqlt1;
    sqlt_b = db.sqlt2;
    error = null;
    result = null;
    ({uu, sc, ut, uw, sf, ft, un} = fingerprint);
    //.........................................................................................................
    if (uu) {
      db.sqlt1.unsafeMode(true);
      db.sqlt2.unsafeMode(true);
    }
    //.........................................................................................................
    if (sc) {
      sqlt_b = db.sqlt1;
    }
    try {
      //.........................................................................................................
      _begin_transaction(ut, sqlt_a, sqlt_b);
      //.......................................................................................................
      if (un/* use_nested_statement */) {
        // throw new Error "test case missing"
        result = [];
        outer_statement = sqlt_a.prepare(SQL`select
    *
  from x
  order by 1, 2;`);
        ref = outer_statement.iterate();
        for (outer_row of ref) {
          inner_statement = sqlt_b.prepare(SQL`select
    *
  from y
  where word = $word
  order by 1, 2;`);
          ref1 = inner_rows = inner_statement.all({
            word: outer_row.word
          });
          for (i = 0, len = ref1.length; i < len; i++) {
            inner_row = ref1[i];
            result.push({
              word: outer_row.word,
              nrx: outer_row.nrx,
              nry: inner_row.nry
            });
          }
        }
      } else {
        //.......................................................................................................
        /* do not use_nested_statement */        statement = sqlt_a.prepare(SQL`select
    x.word  as word,
    x.nrx   as nrx,
    y.nry   as nry
  from x
  join y on ( x.word = y.word )
  order by 1, 2, 3;`);
        result = statement.all();
      }
      //.......................................................................................................
      _commit_transaction(ut, sqlt_a, sqlt_b);
    } catch (error1) {
      error = error1;
      error = `(${error.message})`;
    } finally {
      //.......................................................................................................
      //.........................................................................................................
      if (uu) {
        db.sqlt1.unsafeMode(false);
        db.sqlt2.unsafeMode(false);
      }
      //.......................................................................................................
      if (sc) {
        sqlt_b = db.sqlt2;
      }
    }
    //.........................................................................................................
    return {result, error};
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_f = function() {
    var Dbay, choices, count, db, error, fingerprint, ft, get_kenning, i, is_ok, j, kenning, l, len, len1, len2, len3, len4, len5, len6, m, matcher, o, p, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, result, sc, sf, un, ut, uu, uw;
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    (() => {      //.........................................................................................................
      var i, idx, j, len, len1, n, nrx, nry, ref, ref1, word;
      db.sqlt1.exec(SQL`create table x ( word text, nrx );`);
      db.sqlt1.exec(SQL`create table y ( word text, nry );`);
      ref = "foo bar baz".split(/\s+/);
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        word = ref[idx];
        nrx = idx + 1;
        (db.sqlt1.prepare(SQL`insert into x ( word, nrx ) values ( $word, $nrx );`)).run({word, nrx});
        ref1 = [1, 2, 3];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          n = ref1[j];
          nry = nrx + n * 2;
          (db.sqlt1.prepare(SQL`insert into y ( word, nry ) values ( $word, $nry );`)).run({word, nry});
        }
      }
      return null;
    })();
    //.........................................................................................................
    get_kenning = function(fingerprint) {
      var R, k, v;
      R = [];
      for (k in fingerprint) {
        v = fingerprint[k];
        v = v === true ? '1' : (v === false ? '0' : rpr(v));
        R.push(`${k}:${v}`);
      }
      return R.join(',');
    };
    //.........................................................................................................
    matcher = db.sqlt1.prepare(SQL`select
    x.word  as word,
    x.nrx   as nrx,
    y.nry   as nry
  from x
  join y on ( x.word = y.word )
  order by 1, 2, 3;`);
    matcher = matcher.all();
    //.........................................................................................................
    choices = {
      uu: [true, false],
      /* use_unsafe            */sc: [true, false],
      /* single_connection     */ut: [true, false],
      /* use_transaction       */uw: [null], // [ true, false, ]                         ### use_worker            ###
      sf: [null], // [ true, false, ]                         ### sf                    ###
      ft: [null], // [ 'none', 'scalar', 'table', 'sqlite', ] ### function_type         ###
      un: [true, false]
    };
    //.........................................................................................................
    /* use_nested_statement  */    count = 0;
    ref = choices.uu;
    /* use_unsafe            */
    for (i = 0, len = ref.length; i < len; i++) {
      uu = ref[i];
      ref1 = choices.sc;
      /* single_connection     */
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        sc = ref1[j];
        ref2 = choices.ut;
        /* use_transaction       */
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          ut = ref2[l];
          ref3 = choices.uw;
          /* use_worker            */
          for (m = 0, len3 = ref3.length; m < len3; m++) {
            uw = ref3[m];
            ref4 = choices.sf;
            /* sf                    */
            for (o = 0, len4 = ref4.length; o < len4; o++) {
              sf = ref4[o];
              ref5 = choices.ft;
              /* function_type         */
              for (p = 0, len5 = ref5.length; p < len5; p++) {
                ft = ref5[p];
                ref6 = choices.un;
                /* use_nested_statement  */
                for (q = 0, len6 = ref6.length; q < len6; q++) {
                  un = ref6[q];
                  count++;
                  fingerprint = {uu, sc, ut, uw, sf, ft, un};
                  kenning = get_kenning(fingerprint);
                  ({result, error} = ff(db, count++, fingerprint));
                  is_ok = types.equals(result, matcher);
                  info('^450^', CND.blue(count, kenning), CND.truth(is_ok), CND.red(error != null ? error : ''));
                  if (!is_ok) {
                    warn('^338^', result);
                  }
                }
              }
            }
          }
        }
      }
    }
    return null;
  };

  /*

  Variables:

  * (2) **`use_unsafe: [ true, false, ]`**: safe mode on / off
  * (2) **`use_transaction: [ true, false, ]`**: explicit vs implicit transaction
  * (2) **`single_connection: [ true, false, ]`**: single connection vs double connection
  * (2) **`use_worker: [ true, false, ]`**: single thread vs main thread + worker thread
  * (2) **`use_subselect_function: [ true, false, ]`**: using a function that does no sub-select vs function
    that does
  * (4) **`function_type: [ 'none', 'scalar', 'table', 'sqlite', ]`**: SQL using no UDF, using scalar UDF,
    using table UDF, using SQLite function[^1]
  * (2) **`use_nested_statement: [ true, false, ]`**: use nested statement or not

  2^6 * 4^1 = 64 * 4 = 256 possible variants (but minus some impossible combinations)

  changes:

  * (?) **`transaction_type: [ 'deferred', ..., ]`**
  * (?) **`journalling_mode: [ 'wal', 'memory', ..., ]`**

  Notes:

  [^1]: using a function provided by SQLite will not lead to equivalent results because there's no SQLite
    function that provides a sub-select.

   */
  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await demo_f());
    })();
  }

}).call(this);

//# sourceMappingURL=subselects-with-udfs.demos.js.map