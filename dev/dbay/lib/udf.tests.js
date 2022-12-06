(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, jp, jr, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/UDF';

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

  SQL = String.raw;

  jr = JSON.stringify;

  jp = JSON.parse;

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY/UDF window functions etc."] = async function(T, done) {
    var DBay, db, numbers, schema, template_path, work_path;
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fn'
    })));
    debug({template_path, work_path});
    db = new DBay({
      path: work_path,
      schema
    });
    numbers = db.all_first_values(SQL`select n from nnt order by n;`);
    await (() => {      // console.table db.list db.walk_objects { schema, }
      //.........................................................................................................
      var matcher, n, result, row;
      /* single-valued function */
      db.create_function({
        name: 'square',
        deterministic: true,
        varargs: false,
        call: function(n) {
          return n ** 2;
        }
      });
      matcher = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = numbers.length; i < len; i++) {
          n = numbers[i];
          results.push(n * n);
        }
        return results;
      })();
      result = db.all_rows(SQL`select *, square( n ) as square from nnt order by square;`);
      console.table(result);
      result = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = result.length; i < len; i++) {
          row = result[i];
          results.push(row.square);
        }
        return results;
      })();
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    await (() => {      //.........................................................................................................
      /* aggregate function */
      db.create_aggregate_function({
        name: 'product',
        start: function() {
          return null;
        },
        step: function(total, element) {
          debug('^4476^', {total, element});
          return (total != null ? total : 1) * element;
        }
      });
      (() => {        // inverse:        ( total, dropped ) -> total.pop(); total
        // result:         ( total ) -> total
        // matcher = ( ( n * n ) for n in numbers )
        //.......................................................................................................
        var matcher, result, row;
        result = db.all_rows(SQL`select product( n ) as product from nnt where n != 0;`);
        console.table(result);
        matcher = [5122922112];
        result = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            row = result[i];
            results.push(row.product);
          }
          return results;
        })();
        return T != null ? T.eq(result, matcher) : void 0;
      })();
      (() => {        //.......................................................................................................
        var matcher, result, row;
        result = db.all_rows(SQL`select product( n ) as product from nnt where n > 100;`);
        console.table(result);
        matcher = [null];
        result = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            row = result[i];
            results.push(row.product);
          }
          return results;
        })();
        return T != null ? T.eq(result, matcher) : void 0;
      })();
      return (() => {        //.......................................................................................................
        var error;
        try {
          db.query(SQL`select product( n ) over () as product from nnt;`);
        } catch (error1) {
          error = error1;
          if (T != null) {
            T.eq(error.code, 'SQLITE_ERROR');
          }
          if (T != null) {
            T.eq(error.name, 'SqliteError');
          }
          if (T != null) {
            T.eq(error.message, 'product() may not be used as a window function');
          }
        }
        if (error == null) {
          return T.fail("expected error");
        }
      })();
    })();
    await (() => {      // console.table result
      // matcher = [ null, ]
      // result  = ( row.product for row in result )
      // T?.eq result, matcher
      //.........................................................................................................
      /* window function */
      db.create_window_function({
        name: 'array_agg',
        varargs: false,
        deterministic: true,
        start: function() { // must be new object for each partition, therefore use function, not constant
          return [];
        },
        step: function(total, element) {
          total.push(element);
          return total;
        },
        inverse: function(total, dropped) {
          total.pop();
          return total;
        },
        result: function(total) {
          return jr(total);
        }
      });
      (() => {        //.......................................................................................................
        var matcher, result, row;
        result = db.all_rows(SQL`select array_agg( t ) as names from nnt;`);
        console.table(result);
        matcher = ['["naught","one","one point five","two","two point three","three","three point one","four","five","six","seven","eight","nine","ten","eleven","twelve"]'];
        result = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            row = result[i];
            results.push(row.names);
          }
          return results;
        })();
        return T != null ? T.eq(result, matcher) : void 0;
      })();
      return (() => {        //.......................................................................................................
        var matcher, result, row;
        result = db.all_rows(SQL`select distinct
    array_agg( t ) over w as names
  from nnt
  window w as (
    partition by substring( t, 1, 1 )
    order by t
    range between unbounded preceding and unbounded following
    );`);
        console.table(result);
        matcher = ['["eight","eleven"]', '["five","four"]', '["naught","nine"]', '["one","one point five"]', '["seven","six"]', '["ten","three","three point one","twelve","two","two point three"]'];
        result = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            row = result[i];
            results.push(row.names);
          }
          return results;
        })();
        debug('^878^', result);
        return T != null ? T.eq(result, matcher) : void 0;
      })();
    })();
    await (async() => {      //.........................................................................................................
      /* table-valued function */
      db.create_table_function({
        name: 're_matches',
        columns: ['match', 'capture'],
        parameters: ['text', 'pattern'],
        rows: function*(text, pattern) {
          var match, regex;
          regex = new RegExp(pattern, 'g');
          while ((match = regex.exec(text)) != null) {
            yield [match[0], match[1]];
          }
          return null;
        }
      });
      await (() => {
        var matcher, result, row;
        result = db.all_rows(SQL`select
    *
  from
    nnt,
    re_matches( t, '^.*([aeiou].e).*$' ) as rx
  order by rx.match;`);
        console.table(result);
        matcher = ['eleven:eve', 'five:ive', 'nine:ine', 'one:one', 'one point five:ive', 'seven:eve', 'three point one:one'];
        result = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            row = result[i];
            results.push(`${row.t}:${row.capture}`);
          }
          return results;
        })();
        debug('^984^', result);
        return T != null ? T.eq(result, matcher) : void 0;
      })();
      return (await (() => {
        var matcher, result, row;
        result = db.all_rows(SQL`select
    *
  from
    nnt,
    re_matches( t, 'o' ) as rx
  order by t;`);
        console.table(result);
        matcher = ['four', 'one', 'one point five', 'one point five', 'three point one', 'three point one', 'two', 'two point three', 'two point three'];
        result = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            row = result[i];
            results.push(row.t);
          }
          return results;
        })();
        debug('^984^', result);
        return T != null ? T.eq(result, matcher) : void 0;
      })());
    })();
    await (() => {      //.........................................................................................................
      /* virtual table */
      var FS, matcher, result, row;
      FS = require('fs');
      db.create_virtual_table({
        name: 'file_contents',
        create: function(filename, ...P) {
          var R;
          urge('^46456^', {filename, P});
          R = {
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
          return R;
        }
      });
      db.execute(SQL`create virtual table contents_of_wbftsv
  using file_contents( ncrglyphwbf.tsv, any stuff goes here, and more here );`);
      result = db.all_rows(SQL`select * from contents_of_wbftsv where lnr between 10 and 14 order by 1, 2, 3;`);
      console.table(result);
      matcher = ['u-cjk-xa-3417\t㐗\t<1213355>', '', 'u-cjk-xa-34ab\t㒫\t<121135>', 'u-cjk-xa-342a\t㐪\t<415234>', 'u-cjk-xa-342b\t㐫\t<413452>'];
      result = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = result.length; i < len; i++) {
          row = result[i];
          results.push(row.line);
        }
        return results;
      })();
      debug('^984^', result);
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY/UDF User-Defined Window Function"] = async function(T, done) {
    var DBay, I, L, V, db, schema;
    /* see https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md */
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    schema = 'main';
    db = new DBay();
    // db.load_extension PATH.resolve PATH.join __dirname, '../../../assets/sqlite-extensions/json1.so'
    // db.sqlt.unsafeMode true
    ({I, L, V} = db.sql);
    //.........................................................................................................
    db.create_window_function({
      name: 'udf_json_array_agg',
      varargs: false,
      deterministic: true,
      start: function() { // must be new object for each partition, therefore use function, not constant
        return [];
      },
      step: function(total, element) {
        total.push(element);
        return total;
      },
      inverse: function(total, dropped) {
        total.pop();
        return total;
      },
      result: function(total) {
        return jr(total);
      }
    });
    await (() => {      //.........................................................................................................
      var i, idx, multiples, n;
      //.......................................................................................................
      db.execute(SQL`create view multiples as select distinct
    n                                               as n,
    udf_json_array_agg( multiple ) over w           as multiples
  from multiples_idx
  window w as ( partition by n order by idx range between unbounded preceding and unbounded following )
  order by n;
-- ...................................................................................................
create table multiples_idx (
  n         integer not null,
  idx       integer not null,
  multiple  integer not null,
  primary key ( n, idx ) );
create index multiples_idx_idx_idx on multiples_idx ( idx );
create index multiples_idx_multiple_idx on multiples_idx ( multiple );
-- ...................................................................................................
create trigger multiple_instead_insert instead of insert on multiples begin
  insert into multiples_idx( n, idx, multiple )
    select new.n, j.key, j.value from json_each( new.multiples ) as j;
  end;
-- ...................................................................................................
create trigger multiple_instead_delete instead of delete on multiples begin
  delete from multiples_idx where n = old.n;
  end;
-- ...................................................................................................
create trigger multiple_instead_update instead of update on multiples begin
  delete from multiples_idx where n = old.n;
  insert into multiples_idx( n, idx, multiple )
    select new.n, j.key, j.value from json_each( new.multiples ) as j;
  end;`);
//.......................................................................................................
      for (n = i = 1; i <= 3; n = ++i) {
        multiples = jr((function() {
          var j, results;
          results = [];
          for (idx = j = 0; j <= 9; idx = ++j) {
            results.push(n * idx);
          }
          return results;
        })());
        db(SQL`insert into multiples ( n, multiples ) values ( $n, $multiples )`, {n, multiples});
      }
      db(SQL`insert into multiples ( n, multiples ) values ( 5, '[0,5,10,15,20]' );`);
      //.......................................................................................................
      console.table(db.all_rows(SQL`select * from multiples_idx;`));
      console.table(db.all_rows(SQL`select * from multiples;`));
      if (T != null) {
        T.eq(db.all_rows(SQL`select * from multiples_idx order by n, idx;`), [
          {
            n: 1,
            idx: 0,
            multiple: 0
          },
          {
            n: 1,
            idx: 1,
            multiple: 1
          },
          {
            n: 1,
            idx: 2,
            multiple: 2
          },
          {
            n: 1,
            idx: 3,
            multiple: 3
          },
          {
            n: 1,
            idx: 4,
            multiple: 4
          },
          {
            n: 1,
            idx: 5,
            multiple: 5
          },
          {
            n: 1,
            idx: 6,
            multiple: 6
          },
          {
            n: 1,
            idx: 7,
            multiple: 7
          },
          {
            n: 1,
            idx: 8,
            multiple: 8
          },
          {
            n: 1,
            idx: 9,
            multiple: 9
          },
          {
            n: 2,
            idx: 0,
            multiple: 0
          },
          {
            n: 2,
            idx: 1,
            multiple: 2
          },
          {
            n: 2,
            idx: 2,
            multiple: 4
          },
          {
            n: 2,
            idx: 3,
            multiple: 6
          },
          {
            n: 2,
            idx: 4,
            multiple: 8
          },
          {
            n: 2,
            idx: 5,
            multiple: 10
          },
          {
            n: 2,
            idx: 6,
            multiple: 12
          },
          {
            n: 2,
            idx: 7,
            multiple: 14
          },
          {
            n: 2,
            idx: 8,
            multiple: 16
          },
          {
            n: 2,
            idx: 9,
            multiple: 18
          },
          {
            n: 3,
            idx: 0,
            multiple: 0
          },
          {
            n: 3,
            idx: 1,
            multiple: 3
          },
          {
            n: 3,
            idx: 2,
            multiple: 6
          },
          {
            n: 3,
            idx: 3,
            multiple: 9
          },
          {
            n: 3,
            idx: 4,
            multiple: 12
          },
          {
            n: 3,
            idx: 5,
            multiple: 15
          },
          {
            n: 3,
            idx: 6,
            multiple: 18
          },
          {
            n: 3,
            idx: 7,
            multiple: 21
          },
          {
            n: 3,
            idx: 8,
            multiple: 24
          },
          {
            n: 3,
            idx: 9,
            multiple: 27
          },
          {
            n: 5,
            idx: 0,
            multiple: 0
          },
          {
            n: 5,
            idx: 1,
            multiple: 5
          },
          {
            n: 5,
            idx: 2,
            multiple: 10
          },
          {
            n: 5,
            idx: 3,
            multiple: 15
          },
          {
            n: 5,
            idx: 4,
            multiple: 20
          }
        ]);
      }
      return T != null ? T.eq(db.all_rows(SQL`select * from multiples order by n;`), [
        {
          n: 1,
          multiples: '[0,1,2,3,4,5,6,7,8,9]'
        },
        {
          n: 2,
          multiples: '[0,2,4,6,8,10,12,14,16,18]'
        },
        {
          n: 3,
          multiples: '[0,3,6,9,12,15,18,21,24,27]'
        },
        {
          n: 5,
          multiples: '[0,5,10,15,20]'
        }
      ]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY/UDF view with UDF"] = async function(T, done) {
    var DBay, db, matcher, numbers, result, row, schema, template_path, work_path;
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fnsquareview'
    })));
    db = new DBay({
      path: work_path,
      schema
    });
    numbers = db.all_first_values(SQL`select n from nnt order by n;`);
    //.........................................................................................................
    db.create_function({
      name: 'square',
      deterministic: true,
      varargs: false,
      call: function(n) {
        return n ** 2;
      }
    });
    db.execute(SQL`create view squares as select n, square( n ) as square from nnt order by n;`);
    matcher = [0, 1, 2.25, 4, 5.289999999999999, 9, 9.610000000000001, 16, 25, 36, 49, 64, 81, 100, 121, 144];
    result = db.all_rows(SQL`select * from squares;`);
    console.table(result);
    result = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = result.length; i < len; i++) {
        row = result[i];
        results.push(row.square);
      }
      return results;
    })();
    debug('^984^', result);
    if (T != null) {
      T.eq(result, matcher);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["assertions, warnings"] = async function(T, done) {
    var DBay, schema, template_path, work_path;
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fnsquareview'
    })));
    (function() {      //.........................................................................................................
      var FS, db;
      db = new DBay({
        path: work_path,
        schema
      });
      FS = require('fs');
      // output_fd = FS.openSync '/tmp/mystdout.txt', 'w'
      db.create_stdlib();
      console.table(db.all_rows(SQL`with v1 as ( select
  std_info( t ) as info,
  std_warn_unless(
    count(*) > 0,
    '^2734-1^ expected one or more rows, got ' || count(*) ) as _message
  from nnt
  where true
    and ( n != 0 ) )
select
    *
  from nnt, v1
  where true
    and ( n != 0 );`));
      console.table(db.all_rows(SQL`select
    *
    ,std_warn_unless( count(*) > 0, '^2734-1^ expected one or more rows, got ' || count(*) ) as _message
  from nnt
  where true
    and ( n != 0 );`));
      console.table(db.all_rows(SQL`select
    *,
    std_warn_unless( count(*) > 0, '^2734-2^ expected one or more rows, got ' || count(*) ) as _message
  from nnt
  where true
    and ( n != 0 )
    and ( t = 'nonexistant' );`));
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["XXXXXX aggregate function"] = async function(T, done) {
    var DBay, db, numbers, schema, template_path, work_path;
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fnsquareview'
    })));
    db = new DBay({
      path: work_path,
      schema
    });
    numbers = db.all_first_values(SQL`select n from nnt order by n;`);
    //.........................................................................................................
    db.create_aggregate_function({
      name: 'product',
      start: function() {
        return null;
      },
      step: function(total, element) {
        debug('^4476^', {total, element});
        return (total != null ? total : 1) * element;
      }
    });
    //.........................................................................................................
    db.create_aggregate_function({
      name: 'std_keep',
      start: 1,
      step: function(total, element) {
        debug('^4476^', {total, element});
        return (total != null ? total : 1) * element;
      },
      result: function(x) {
        debug('^4476^', {x});
        return 42;
      }
    });
    //.........................................................................................................
    console.table(db.all_rows(SQL`select
    *,
    product( null ) as keep
  from nnt
  where true
    -- and ( t = 'xxx' )
    and ( n != 0 )
  ;
`));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY/UDF typing"] = async function(T, done) {
    var DBay, as_boolean, d/* NOTE: consume iterator to free connection */, db, error, iterator, schema, statement, template_path, work_path;
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'typing'
    })));
    db = new DBay({
      path: work_path,
      schema
    });
    //.........................................................................................................
    /* In 'simple' cases, there's meaningful type information present: */
    statement = db.prepare(SQL`select stamped as d from main;`);
    iterator = statement.iterate([]);
    [...iterator];
    d = (function() {
      var i, len, ref, results;
      ref = statement.columns();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        results.push([d.name, d.type]);
      }
      return results;
    })();
    if (T != null) {
      T.eq(d, [['d', 'boolean']]);
    }
    //.........................................................................................................
    /* But as soon as any operation is done on data: that typing information vanishes: */
    statement = db.prepare(SQL`select ( stamped and not stamped ) as d from main;`);
    iterator = statement.iterate([]);
    [...iterator];
    /* NOTE: consume iterator to free connection */    d = (function() {
      var i, len, ref, results;
      ref = statement.columns();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        results.push([d.name, d.type]);
      }
      return results;
    })();
    if (T != null) {
      T.eq(d, [['d', null]]);
    }
    //.........................................................................................................
    /* We can even explicitly cast results but that does not bring back typing: */
    statement = db.prepare(SQL`select cast( stamped and not stamped as boolean ) as d from main;`);
    iterator = statement.iterate([]);
    [...iterator];
    /* NOTE: consume iterator to free connection */    d = (function() {
      var i, len, ref, results;
      ref = statement.columns();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        results.push([d.name, d.type]);
      }
      return results;
    })();
    if (T != null) {
      T.eq(d, [['d', null]]);
    }
    //.........................................................................................................
    /* We can enforce better type checking in SQLite by using `check` constraints and UDFs: */
    as_boolean = function(d) {
      if (d) {
        return 1;
      } else {
        return 0;
      }
    };
    db.create_function({
      name: 'validate_integer',
      call: function(n) {
        debug('^534^', `validating ${rpr(n)}`);
        return as_boolean(types.isa.integer(n));
      }
    });
    db.execute(SQL`create table x( n integer, check ( validate_integer( n ) ) );`);
    db.execute(SQL`insert into x ( n ) values ( 42 );`);
    if (T != null) {
      T.ok(true);
    }
    try {
      db.execute(SQL`insert into x ( n ) values ( 1.23 );`);
    } catch (error1) {
      error = error1;
      if (T != null) {
        T.ok(error.message === "CHECK constraint failed: validate_integer( n )");
      }
    }
    try {
      db.execute(SQL`insert into x ( n ) values ( 'foobar' );`);
    } catch (error1) {
      error = error1;
      if (T != null) {
        T.ok(error.message === "CHECK constraint failed: validate_integer( n )");
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY/UDF concurrent UDFs 2"] = async function(T, done) {
    var DBay, count, db, error, prefix, ref, ref1, ref2, row, row1, row2, schema, select_sql, show_db_objects, template_path, work_path;
    prefix = 'dcat_';
    schema = 'main';
    ({DBay} = require(H.dbay_path));
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'fnc'
    })));
    debug({template_path, work_path});
    db = new DBay({
      path: work_path
    });
    // db2              = new DBay(); db2.open  { schema, path: work_path, }
    //.........................................................................................................
    select_sql = SQL`select
    ${db.sql.L(schema)} as schema,
    type,
    name,
    tbl_name,
    rootpage
  from sqlite_schema
  order by rootpage;`;
    //.........................................................................................................
    db.create_table_function({
      name: prefix + 'reltrigs',
      columns: ['schema', 'type', 'name', 'tbl_name', 'rootpage'],
      parameters: [],
      varargs: false,
      deterministic: false,
      rows: function*() {
        return (yield* db.query(select_sql));
      }
    });
    //.........................................................................................................
    show_db_objects = function() {
      return console.table(db.all_rows(SQL`select
    'main' as schema,
    type,
    name,
    tbl_name,
    rootpage
  from sqlite_schema
  order by rootpage;`));
    };
    //.........................................................................................................
    count = 0;
    ref = db.query(SQL`select * from sqlite_schema where type in ( 'table', 'view' );`);
    for (row1 of ref) {
      ref1 = db.query(SQL`select * from pragma_table_info( $name )`, {
        name: row1.name
      });
      for (row2 of ref1) {
        count++;
        if (count > 5) {
          break;
        }
        info('^875-1^', row2);
      }
    }
    //.........................................................................................................
    count = 0;
    db.with_unsafe_mode(function() {
      var ref2, results;
      ref2 = db.query(SQL`select * from sqlite_schema where type in ( 'table', 'view' );`);
      results = [];
      for (row1 of ref2) {
        results.push((function() {
          var ref3, results1;
          ref3 = db.query(SQL`select * from pragma_table_info( $name )`, {
            name: row1.name
          });
          results1 = [];
          for (row2 of ref3) {
            count++;
            if (count > 5) {
              break;
            }
            info('^875-1^', row2);
            results1.push(db.execute("create table if not exists foo ( n text );"));
          }
          return results1;
        })());
      }
      return results;
    });
    try {
      ref2 = db.query(SQL`select * from dcat_reltrigs;`);
      //.........................................................................................................
      for (row of ref2) {
        info('^875-2^', row);
      }
    } catch (error1) {
      error = error1;
      warn(CND.reverse('^875-3^', error.message));
      if (T != null) {
        T.eq(error.message, "This database connection is busy executing a query");
      }
    }
    try {
      //.........................................................................................................
      db.with_unsafe_mode(function() {
        var ref3, results;
        ref3 = db.query(SQL`select * from dcat_reltrigs;`);
        results = [];
        for (row of ref3) {
          results.push(info('^875-4^', row));
        }
        return results;
      });
    } catch (error1) {
      error = error1;
      warn(CND.reverse('^875-5^', error.message));
      if (T != null) {
        T.eq(error.message, "This database connection is busy executing a query");
      }
    }
    //.........................................................................................................
    show_db_objects();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      return test(this["DBAY/UDF window functions etc."]);
    })();
  }

  // test @[ "DBAY/UDF User-Defined Window Function" ]
// test @[ "DBAY/UDF view with UDF" ]
// test @[ "DBAY/UDF typing" ]
// test @[ "DBAY/UDF concurrent UDFs 2" ]
// @[ "XXXXXX aggregate function" ]()
// @[ "assertions, warnings" ]()

}).call(this);

//# sourceMappingURL=udf.tests.js.map