(function() {
  'use strict';
  var CND, H, PATH, SQL, _begin_transaction, _commit_transaction, badge, cfg, debug, demo_f, echo, equals, ff, get_kenning, get_matcher, guy, help, info, isa, join_x_and_y_using_word, prepare_db, query_with_nested_statement, query_without_nested_statement, rpr, select, select_word_from_y_scalar, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/DEMOS/UDFSEL';

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

  ({equals, isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  cfg = {
    // verbose:              true
    verbose: false,
    // catch_errors:         false
    catch_errors: true,
    // show_na_choices:      true
    show_na_choices: false,
    hilite: {
      ft: 'scalar'
    },
    choices: {
      uu: [true, false],
      /* use_unsafe            */sc: [true, false],
      /* single_connection     */ut: [true, false],
      /* use_transaction       */uw: [null], // [ true, false, ]                         ### use_worker            ###
      // ft: [ null, ]        # [ 'none', 'scalar', 'table', 'sqlite', ] ### function_type         ###
      ft: ['none', 'scalar', 'table'],
      /* function_type         */un: [true, false]
    },
    /* use_nested_statement  */results: {
      not_applicable: Symbol('not_applicable'),
      not_implemented: Symbol('not_implemented')
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  prepare_db = function(db) {
    var connection, fn_cfg, i, idx, j, l, len, len1, len2, n, nrx, nry, ref, ref1, ref2, word;
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
    fn_cfg = {
      deterministic: false,
      varargs: false
    };
    ref2 = [db.sqlt1, db.sqlt2];
    /* TAINT use other connection for query */
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      connection = ref2[l];
      connection.function('join_x_and_y_using_word_scalar', fn_cfg, function() {
        return JSON.stringify(join_x_and_y_using_word(connection));
      });
      connection.function('select_word_from_y_scalar', fn_cfg, function(word) {
        return JSON.stringify(select_word_from_y_scalar(connection, word));
      });
    }
    // connection.table 'join_x_and_y_using_word_table', fn_cfg, ->
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  join_x_and_y_using_word = function(sqlt) {
    var statement;
    statement = sqlt.prepare(SQL`select
    x.word  as word,
    x.nrx   as nrx,
    y.nry   as nry
  from x
  join y on ( x.word = y.word )
  order by 1, 2, 3;`);
    return statement.all();
  };

  //-----------------------------------------------------------------------------------------------------------
  select_word_from_y_scalar = function(sqlt, word) {
    var statement;
    statement = sqlt.prepare(SQL`select * from y where word = $word order by 1, 2;`);
    return statement.all({word});
  };

  //-----------------------------------------------------------------------------------------------------------
  get_matcher = function(db) {
    return join_x_and_y_using_word(db.sqlt1);
  };

  //-----------------------------------------------------------------------------------------------------------
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
  query_with_nested_statement = function(db, fingerprint, sqlt_a, sqlt_b) {
    /* TAINT refactor */
    var i, inner_row, inner_rows, inner_statement, j, len, len1, outer_row, outer_statement, ref, ref1, ref2, result, word;
    switch (fingerprint.ft) {
      //.......................................................................................................
      case 'none':
        result = [];
        outer_statement = sqlt_a.prepare(SQL`select * from x order by 1, 2;`);
        ref = outer_statement.iterate();
        for (outer_row of ref) {
          inner_statement = sqlt_b.prepare(SQL`select * from y where word = $word order by 1, 2;`);
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
        return {result};
      //.......................................................................................................
      case 'scalar':
        /* TAINT refactor */
        result = [];
        outer_statement = sqlt_a.prepare(SQL`select * from x order by 1, 2;`);
        ref2 = outer_statement.iterate();
        for (outer_row of ref2) {
          ({word} = outer_row);
          inner_statement = sqlt_b.prepare(SQL`select select_word_from_y_scalar( $word ) as rows;`);
          inner_rows = (inner_statement.get({word})).rows;
          inner_rows = JSON.parse(inner_rows);
          for (j = 0, len1 = inner_rows.length; j < len1; j++) {
            inner_row = inner_rows[j];
            result.push({
              word: outer_row.word,
              nrx: outer_row.nrx,
              nry: inner_row.nry
            });
          }
        }
        return {result};
    }
    return {
      //.........................................................................................................
      result: cfg.results.not_implemented,
      error: `ft: ${rpr(fingerprint.ft)} not implemented`
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  query_without_nested_statement = function(db, fingerprint, sqlt_a, sqlt_b) {
    var result, statement;
    switch (fingerprint.ft) {
      case 'none':
        return {
          result: join_x_and_y_using_word(sqlt_a)
        };
      case 'scalar':
        statement = sqlt_a.prepare(SQL`select join_x_and_y_using_word_scalar() as rows;`);
        result = statement.get();
        result = JSON.parse(result.rows);
        return {result};
    }
    return {
      result: cfg.results.not_implemented,
      error: `ft: ${rpr(fingerprint.ft)} not implemented`
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  ff = function(db, fingerprint) {
    var R/* do not use_nested_statement */, error, ft, result, sc, sqlt_a, sqlt_b, un, ut, uu, uw;
    sqlt_a = db.sqlt1;
    sqlt_b = db.sqlt2;
    error = null;
    result = null;
    ({uu, sc, ut, uw, ft, un} = fingerprint);
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
      if (ut) {
        if (!un) {
          if (ut) {
            return {
              result: cfg.results.not_applicable,
              error: "need nested stms for tx:1"
            };
          }
        }
        if (!sc) {
          if (ut) {
            return {
              result: cfg.results.not_applicable,
              error: "need single conn for tx:1"
            };
          }
        }
      }
      _begin_transaction(ut, sqlt_a, sqlt_b);
      //.......................................................................................................
      if (un/* use_nested_statement */) {
        R = query_with_nested_statement(db, fingerprint, sqlt_a, sqlt_b);
      } else {
        R = query_without_nested_statement(db, fingerprint, sqlt_a, sqlt_b);
      }
      //.......................................................................................................
      _commit_transaction(ut, sqlt_a, sqlt_b);
      return R;
    } catch (error1) {
      //.........................................................................................................
      error = error1;
      if (!cfg.catch_errors) {
        throw error;
      }
      error = `(${error.message})`;
      return {error};
    } finally {
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
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  select = function(fingerprint) {
    var choice, choices, i, key, len, ref;
    if (cfg.hilite == null) {
      return false;
    }
    ref = cfg.hilite;
    for (key in ref) {
      choices = ref[key];
      switch (type_of(choices)) {
        case 'list':
          for (i = 0, len = choices.length; i < len; i++) {
            choice = choices[i];
            if (equals(choice, fingerprint[key])) {
              return true;
            }
          }
          break;
        default:
          if (equals(choices, fingerprint[key])) {
            return true;
          }
      }
    }
    return false;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_f = function() {
    var Dbay, color, counts, db, error, fingerprint, ft, i, is_ok, j, k, kenning, l, len, len1, len2, len3, len4, len5, m, marker, matcher, o, p, ref, ref1, ref2, ref3, ref4, ref5, result, sc, un, ut, uu, uw, v;
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    prepare_db(db);
    matcher = get_matcher(db);
    counts = {
      total: 0,
      not_implemented: 0,
      not_applicable: 0,
      other: 0,
      error: 0,
      test: 0,
      success: 0,
      fail: 0
    };
    ref = cfg.choices.uu;
    /* use_unsafe            */
    //.........................................................................................................
    for (i = 0, len = ref.length; i < len; i++) {
      uu = ref[i];
      ref1 = cfg.choices.sc;
      /* single_connection     */
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        sc = ref1[j];
        ref2 = cfg.choices.ut;
        /* use_transaction       */
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          ut = ref2[l];
          ref3 = cfg.choices.uw;
          /* use_worker            */
          for (m = 0, len3 = ref3.length; m < len3; m++) {
            uw = ref3[m];
            ref4 = cfg.choices.ft;
            /* function_type         */
            for (o = 0, len4 = ref4.length; o < len4; o++) {
              ft = ref4[o];
              ref5 = cfg.choices.un;
              /* use_nested_statement  */
              for (p = 0, len5 = ref5.length; p < len5; p++) {
                un = ref5[p];
                counts.total++;
                fingerprint = {uu, sc, ut, uw, ft, un};
                kenning = get_kenning(fingerprint);
                ({result, error} = ff(db, fingerprint));
                // debug '^3453^', result, isa.symbol result
                if (isa.symbol(result)) {
                  switch (result) {
                    case cfg.results.not_implemented:
                      counts.not_implemented++;
                      color = CND.red;
                      break;
                    case cfg.results.not_applicable:
                      counts.not_applicable++;
                      color = CND.grey;
                      break;
                    default:
                      counts.other++;
                      color = CND.yellow;
                  }
                  if (!((result === cfg.results.not_applicable) && (!cfg.show_na_choices))) {
                    echo(CND.grey(' ', 0, color(kenning, result, error)));
                  }
                  continue;
                }
                counts.test++;
                if ((is_ok = equals(result, matcher))) {
                  counts.success++;
                } else {
                  counts.fail++;
                }
                if (error != null) {
                  counts.error++;
                }
                if (select(fingerprint)) {
                  marker = CND.gold('█');
                } else {
                  marker = ' ';
                }
                echo(marker, CND.blue(counts.test, kenning), CND.truth(is_ok), CND.red(CND.reverse(error != null ? error : '')));
                if ((!is_ok) && (error == null)) {
                  echo(CND.red(CND.reverse(' ', result, ' ')));
                }
              }
            }
          }
        }
      }
    }
//.........................................................................................................
    for (k in counts) {
      v = counts[k];
      help(k.padStart(20), v.toString().padStart(5));
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await demo_f());
    })();
  }

}).call(this);

//# sourceMappingURL=subselects-with-udfs.demos.js.map