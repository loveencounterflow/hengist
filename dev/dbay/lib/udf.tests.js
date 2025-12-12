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
    var DBay, count, db, error, prefix, row, row1, row2, schema, select_sql, show_db_objects, template_path, work_path;
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
    for (row1 of db.query(SQL`select * from sqlite_schema where type in ( 'table', 'view' );`)) {
      for (row2 of db.query(SQL`select * from pragma_table_info( $name )`, {
        name: row1.name
      })) {
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
      var results;
      results = [];
      for (row1 of db.query(SQL`select * from sqlite_schema where type in ( 'table', 'view' );`)) {
        results.push((function() {
          var results1;
          results1 = [];
          for (row2 of db.query(SQL`select * from pragma_table_info( $name )`, {
            name: row1.name
          })) {
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
    //.........................................................................................................
      for (row of db.query(SQL`select * from dcat_reltrigs;`)) {
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
        var results;
        results = [];
        for (row of db.query(SQL`select * from dcat_reltrigs;`)) {
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
      return test(this, {
        timeout: 10e3
      });
    })();
  }

  // test @[ "DBAY/UDF window functions etc." ]
// test @[ "DBAY/UDF User-Defined Window Function" ]
// test @[ "DBAY/UDF view with UDF" ]
// test @[ "DBAY/UDF typing" ]
// test @[ "DBAY/UDF concurrent UDFs 2" ]
// @[ "XXXXXX aggregate function" ]()
// @[ "assertions, warnings" ]()

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3VkZi50ZXN0cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7O0VBSUEsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsR0FBQSxHQUE0QixHQUFHLENBQUM7O0VBQ2hDLEtBQUEsR0FBNEI7O0VBQzVCLEtBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxPQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsT0FBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLFNBQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFULENBQWMsR0FBZCxFQWI1Qjs7O0VBZUEsSUFBQSxHQUE0QixPQUFBLENBQVEsd0JBQVI7O0VBQzVCLElBQUEsR0FBNEIsT0FBQSxDQUFRLE1BQVI7O0VBQzVCLENBQUEsR0FBNEIsT0FBQSxDQUFRLFdBQVI7O0VBQzVCLEtBQUEsR0FBNEIsSUFBSSxDQUFFLE9BQUEsQ0FBUSxXQUFSLENBQUYsQ0FBdUIsQ0FBQyxTQUE1QixDQUFBOztFQUM1QixDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxRQUZGLEVBR0UsZ0JBSEYsQ0FBQSxHQUc0QixLQUFLLENBQUMsTUFBTixDQUFBLENBSDVCOztFQUlBLEdBQUEsR0FBNEIsTUFBTSxDQUFDOztFQUNuQyxFQUFBLEdBQTRCLElBQUksQ0FBQzs7RUFDakMsRUFBQSxHQUE0QixJQUFJLENBQUMsTUF6QmpDOzs7RUE4QkEsSUFBQyxDQUFFLGdDQUFGLENBQUQsR0FBd0MsTUFBQSxRQUFBLENBQUUsQ0FBRixFQUFLLElBQUwsQ0FBQTtBQUN4QyxRQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxhQUFBLEVBQUEsU0FBQTs7SUFDRSxDQUFBLENBQUUsSUFBRixDQUFBLEdBQW9CLE9BQUEsQ0FBUSxDQUFDLENBQUMsU0FBVixDQUFwQjtJQUNBLE1BQUEsR0FBb0I7SUFDcEIsQ0FBQSxDQUFFLGFBQUYsRUFDRSxTQURGLENBQUEsR0FDb0IsQ0FBQSxNQUFNLENBQUMsQ0FBQyxVQUFGLENBQWE7TUFBRSxJQUFBLEVBQU0sS0FBUjtNQUFlLEdBQUEsRUFBSztJQUFwQixDQUFiLENBQU4sQ0FEcEI7SUFFQSxLQUFBLENBQU0sQ0FBRSxhQUFGLEVBQWlCLFNBQWpCLENBQU47SUFDQSxFQUFBLEdBQW9CLElBQUksSUFBSixDQUFTO01BQUUsSUFBQSxFQUFNLFNBQVI7TUFBbUI7SUFBbkIsQ0FBVDtJQUNwQixPQUFBLEdBQW9CLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixHQUFHLENBQUEsNkJBQUEsQ0FBdkI7SUFHcEIsTUFBUyxDQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUE7O0FBQ1gsVUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBOztNQUNJLEVBQUUsQ0FBQyxlQUFILENBQW1CO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFBZ0IsYUFBQSxFQUFlLElBQS9CO1FBQXFDLE9BQUEsRUFBUyxLQUE5QztRQUFxRCxJQUFBLEVBQU0sUUFBQSxDQUFFLENBQUYsQ0FBQTtpQkFBUyxDQUFBLElBQUs7UUFBZDtNQUEzRCxDQUFuQjtNQUNBLE9BQUE7O0FBQVk7UUFBQSxLQUFBLHlDQUFBOzt1QkFBRSxDQUFBLEdBQUk7UUFBTixDQUFBOzs7TUFDWixNQUFBLEdBQVUsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUEseURBQUEsQ0FBZjtNQUNWLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZDtNQUNBLE1BQUE7O0FBQVk7UUFBQSxLQUFBLHdDQUFBOzt1QkFBQSxHQUFHLENBQUM7UUFBSixDQUFBOzs7eUJBQ1osQ0FBQyxDQUFFLEVBQUgsQ0FBTSxNQUFOLEVBQWMsT0FBZDtJQVBPLENBQUE7SUFTVCxNQUFTLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTs7TUFFUCxFQUFFLENBQUMseUJBQUgsQ0FDRTtRQUFBLElBQUEsRUFBZ0IsU0FBaEI7UUFDQSxLQUFBLEVBQWdCLFFBQUEsQ0FBQSxDQUFBO2lCQUFHO1FBQUgsQ0FEaEI7UUFFQSxJQUFBLEVBQWdCLFFBQUEsQ0FBRSxLQUFGLEVBQVMsT0FBVCxDQUFBO1VBQXNCLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLENBQUUsS0FBRixFQUFTLE9BQVQsQ0FBaEI7aUJBQXFDLGlCQUFFLFFBQVEsQ0FBVixDQUFBLEdBQWdCO1FBQTNFO01BRmhCLENBREY7TUFRRyxDQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUE7Ozs7QUFDUCxZQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7UUFBTSxNQUFBLEdBQVUsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUEscURBQUEsQ0FBZjtRQUNWLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZDtRQUNBLE9BQUEsR0FBVSxDQUFFLFVBQUY7UUFDVixNQUFBOztBQUFZO1VBQUEsS0FBQSx3Q0FBQTs7eUJBQUEsR0FBRyxDQUFDO1VBQUosQ0FBQTs7OzJCQUNaLENBQUMsQ0FBRSxFQUFILENBQU0sTUFBTixFQUFjLE9BQWQ7TUFMQyxDQUFBO01BT0EsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBO0FBQ1AsWUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO1FBQU0sTUFBQSxHQUFVLEVBQUUsQ0FBQyxRQUFILENBQVksR0FBRyxDQUFBLHNEQUFBLENBQWY7UUFDVixPQUFPLENBQUMsS0FBUixDQUFjLE1BQWQ7UUFDQSxPQUFBLEdBQVUsQ0FBRSxJQUFGO1FBQ1YsTUFBQTs7QUFBWTtVQUFBLEtBQUEsd0NBQUE7O3lCQUFBLEdBQUcsQ0FBQztVQUFKLENBQUE7OzsyQkFDWixDQUFDLENBQUUsRUFBSCxDQUFNLE1BQU4sRUFBYyxPQUFkO01BTEMsQ0FBQTthQU9BLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTtBQUNQLFlBQUE7QUFBTTtVQUNFLEVBQUUsQ0FBQyxLQUFILENBQVMsR0FBRyxDQUFBLGdEQUFBLENBQVosRUFERjtTQUVBLGNBQUE7VUFBTTs7WUFDSixDQUFDLENBQUUsRUFBSCxDQUFNLEtBQUssQ0FBQyxJQUFaLEVBQWtCLGNBQWxCOzs7WUFDQSxDQUFDLENBQUUsRUFBSCxDQUFNLEtBQUssQ0FBQyxJQUFaLEVBQWtCLGFBQWxCOzs7WUFDQSxDQUFDLENBQUUsRUFBSCxDQUFNLEtBQUssQ0FBQyxPQUFaLEVBQXFCLGdEQUFyQjtXQUhGOztRQUlBLElBQU8sYUFBUDtpQkFDRSxDQUFDLENBQUMsSUFBRixDQUFPLGdCQUFQLEVBREY7O01BUEMsQ0FBQTtJQXhCSSxDQUFBO0lBc0NULE1BQVMsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBOzs7Ozs7TUFFUCxFQUFFLENBQUMsc0JBQUgsQ0FDRTtRQUFBLElBQUEsRUFBZ0IsV0FBaEI7UUFDQSxPQUFBLEVBQWdCLEtBRGhCO1FBRUEsYUFBQSxFQUFnQixJQUZoQjtRQUdBLEtBQUEsRUFBZ0IsUUFBQSxDQUFBLENBQUEsRUFBQTtpQkFBRztRQUFILENBSGhCO1FBSUEsSUFBQSxFQUFnQixRQUFBLENBQUUsS0FBRixFQUFTLE9BQVQsQ0FBQTtVQUFzQixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVg7aUJBQW9CO1FBQTFDLENBSmhCO1FBS0EsT0FBQSxFQUFnQixRQUFBLENBQUUsS0FBRixFQUFTLE9BQVQsQ0FBQTtVQUFzQixLQUFLLENBQUMsR0FBTixDQUFBO2lCQUFhO1FBQW5DLENBTGhCO1FBTUEsTUFBQSxFQUFnQixRQUFBLENBQUUsS0FBRixDQUFBO2lCQUFhLEVBQUEsQ0FBRyxLQUFIO1FBQWI7TUFOaEIsQ0FERjtNQVNHLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTtBQUNQLFlBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQTtRQUFNLE1BQUEsR0FBVSxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQSx3Q0FBQSxDQUFmO1FBQ1YsT0FBTyxDQUFDLEtBQVIsQ0FBYyxNQUFkO1FBQ0EsT0FBQSxHQUFVLENBQUUsd0pBQUY7UUFDVixNQUFBOztBQUFZO1VBQUEsS0FBQSx3Q0FBQTs7eUJBQUEsR0FBRyxDQUFDO1VBQUosQ0FBQTs7OzJCQUNaLENBQUMsQ0FBRSxFQUFILENBQU0sTUFBTixFQUFjLE9BQWQ7TUFMQyxDQUFBO2FBT0EsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBO0FBQ1AsWUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO1FBQU0sTUFBQSxHQUFVLEVBQUUsQ0FBQyxRQUFILENBQVksR0FBRyxDQUFBOzs7Ozs7O01BQUEsQ0FBZjtRQVNWLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZDtRQUNBLE9BQUEsR0FBVSxDQUFFLG9CQUFGLEVBQXdCLGlCQUF4QixFQUEyQyxtQkFBM0MsRUFBZ0UsMEJBQWhFLEVBQTRGLGlCQUE1RixFQUErRyxvRUFBL0c7UUFDVixNQUFBOztBQUFZO1VBQUEsS0FBQSx3Q0FBQTs7eUJBQUEsR0FBRyxDQUFDO1VBQUosQ0FBQTs7O1FBQ1osS0FBQSxDQUFNLE9BQU4sRUFBZSxNQUFmOzJCQUNBLENBQUMsQ0FBRSxFQUFILENBQU0sTUFBTixFQUFjLE9BQWQ7TUFkQyxDQUFBO0lBbEJJLENBQUE7SUFrQ1QsTUFBUyxDQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTs7TUFFUCxFQUFFLENBQUMscUJBQUgsQ0FDRTtRQUFBLElBQUEsRUFBYyxZQUFkO1FBQ0EsT0FBQSxFQUFjLENBQUUsT0FBRixFQUFXLFNBQVgsQ0FEZDtRQUVBLFVBQUEsRUFBYyxDQUFFLE1BQUYsRUFBVSxTQUFWLENBRmQ7UUFHQSxJQUFBLEVBQU0sU0FBQSxDQUFFLElBQUYsRUFBUSxPQUFSLENBQUE7QUFDWixjQUFBLEtBQUEsRUFBQTtVQUFRLEtBQUEsR0FBUSxJQUFJLE1BQUosQ0FBVyxPQUFYLEVBQW9CLEdBQXBCO0FBQ1IsaUJBQU0sa0NBQU47WUFDRSxNQUFNLENBQUUsS0FBSyxDQUFFLENBQUYsQ0FBUCxFQUFjLEtBQUssQ0FBRSxDQUFGLENBQW5CO1VBRFI7QUFFQSxpQkFBTztRQUpIO01BSE4sQ0FERjtNQVNBLE1BQVMsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUNiLFlBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQTtRQUFNLE1BQUEsR0FBVSxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQTs7Ozs7b0JBQUEsQ0FBZjtRQU9WLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZDtRQUNBLE9BQUEsR0FBVSxDQUFFLFlBQUYsRUFBZ0IsVUFBaEIsRUFBNEIsVUFBNUIsRUFBd0MsU0FBeEMsRUFBbUQsb0JBQW5ELEVBQXlFLFdBQXpFLEVBQXNGLHFCQUF0RjtRQUNWLE1BQUE7O0FBQVk7VUFBQSxLQUFBLHdDQUFBOzt5QkFBQSxDQUFBLENBQUEsQ0FBRyxHQUFHLENBQUMsQ0FBUCxDQUFBLENBQUEsQ0FBQSxDQUFZLEdBQUcsQ0FBQyxPQUFoQixDQUFBO1VBQUEsQ0FBQTs7O1FBQ1osS0FBQSxDQUFNLE9BQU4sRUFBZSxNQUFmOzJCQUNBLENBQUMsQ0FBRSxFQUFILENBQU0sTUFBTixFQUFjLE9BQWQ7TUFaTyxDQUFBO2FBYVQsQ0FBQSxNQUFTLENBQUEsQ0FBQSxDQUFBLEdBQUE7QUFDYixZQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7UUFBTSxNQUFBLEdBQVUsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUE7Ozs7O2FBQUEsQ0FBZjtRQU9WLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZDtRQUNBLE9BQUEsR0FBVSxDQUFFLE1BQUYsRUFBVSxLQUFWLEVBQWlCLGdCQUFqQixFQUFtQyxnQkFBbkMsRUFBcUQsaUJBQXJELEVBQXdFLGlCQUF4RSxFQUEyRixLQUEzRixFQUFrRyxpQkFBbEcsRUFBcUgsaUJBQXJIO1FBQ1YsTUFBQTs7QUFBWTtVQUFBLEtBQUEsd0NBQUE7O3lCQUFBLEdBQUcsQ0FBQztVQUFKLENBQUE7OztRQUNaLEtBQUEsQ0FBTSxPQUFOLEVBQWUsTUFBZjsyQkFDQSxDQUFDLENBQUUsRUFBSCxDQUFNLE1BQU4sRUFBYyxPQUFkO01BWk8sQ0FBQSxHQUFUO0lBeEJPLENBQUE7SUFzQ1QsTUFBUyxDQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUE7O0FBQ1gsVUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQTtNQUNJLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjtNQUNMLEVBQUUsQ0FBQyxvQkFBSCxDQUNFO1FBQUEsSUFBQSxFQUFRLGVBQVI7UUFDQSxNQUFBLEVBQVEsUUFBQSxDQUFFLFFBQUYsRUFBQSxHQUFZLENBQVosQ0FBQTtBQUNkLGNBQUE7VUFBUSxJQUFBLENBQUssU0FBTCxFQUFnQixDQUFFLFFBQUYsRUFBWSxDQUFaLENBQWhCO1VBQ0EsQ0FBQSxHQUNFO1lBQUEsT0FBQSxFQUFTLENBQUUsTUFBRixFQUFVLEtBQVYsRUFBaUIsTUFBakIsQ0FBVDtZQUNBLElBQUEsRUFBTSxTQUFBLENBQUEsQ0FBQTtBQUNoQixrQkFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBO2NBQVksSUFBQSxHQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLHNCQUFyQixFQUE2QyxRQUE3QyxDQUFiO2NBQ1IsS0FBQSxHQUFRLENBQUUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBaEIsRUFBc0I7Z0JBQUUsUUFBQSxFQUFVO2NBQVosQ0FBdEIsQ0FBRixDQUFnRCxDQUFDLEtBQWpELENBQXVELElBQXZEO2NBQ1IsS0FBQSw2REFBQTs7Z0JBQ0UsTUFBTSxDQUFBO2tCQUFFLElBQUY7a0JBQVEsR0FBQSxFQUFLLFFBQUEsR0FBVyxDQUF4QjtrQkFBMkI7Z0JBQTNCLENBQUE7Y0FEUjtBQUVBLHFCQUFPO1lBTEg7VUFETjtBQU9GLGlCQUFPO1FBVkQ7TUFEUixDQURGO01BYUEsRUFBRSxDQUFDLE9BQUgsQ0FBVyxHQUFHLENBQUE7NkVBQUEsQ0FBZDtNQUdBLE1BQUEsR0FBVSxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQSw4RUFBQSxDQUFmO01BQ1YsT0FBTyxDQUFDLEtBQVIsQ0FBYyxNQUFkO01BQ0EsT0FBQSxHQUFVLENBQUUsNkJBQUYsRUFBaUMsRUFBakMsRUFBcUMsNEJBQXJDLEVBQW1FLDRCQUFuRSxFQUFpRyw0QkFBakc7TUFDVixNQUFBOztBQUFZO1FBQUEsS0FBQSx3Q0FBQTs7dUJBQUEsR0FBRyxDQUFDO1FBQUosQ0FBQTs7O01BQ1osS0FBQSxDQUFNLE9BQU4sRUFBZSxNQUFmO3lCQUNBLENBQUMsQ0FBRSxFQUFILENBQU0sTUFBTixFQUFjLE9BQWQ7SUF4Qk8sQ0FBQTt3Q0EwQlQ7RUE1SnNDLEVBOUJ4Qzs7O0VBNkxBLElBQUMsQ0FBRSx1Q0FBRixDQUFELEdBQStDLE1BQUEsUUFBQSxDQUFFLENBQUYsRUFBSyxJQUFMLENBQUE7QUFDL0MsUUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUE7OztJQUVFLENBQUEsQ0FBRSxJQUFGLENBQUEsR0FBb0IsT0FBQSxDQUFRLENBQUMsQ0FBQyxTQUFWLENBQXBCO0lBQ0EsTUFBQSxHQUFvQjtJQUNwQixFQUFBLEdBQW9CLElBQUksSUFBSixDQUFBLEVBSnRCOzs7SUFPRSxDQUFBLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBQUEsR0FBb0IsRUFBRSxDQUFDLEdBQXZCLEVBUEY7O0lBU0UsRUFBRSxDQUFDLHNCQUFILENBQ0U7TUFBQSxJQUFBLEVBQWdCLG9CQUFoQjtNQUNBLE9BQUEsRUFBZ0IsS0FEaEI7TUFFQSxhQUFBLEVBQWdCLElBRmhCO01BR0EsS0FBQSxFQUFnQixRQUFBLENBQUEsQ0FBQSxFQUFBO2VBQUc7TUFBSCxDQUhoQjtNQUlBLElBQUEsRUFBZ0IsUUFBQSxDQUFFLEtBQUYsRUFBUyxPQUFULENBQUE7UUFBc0IsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFYO2VBQW9CO01BQTFDLENBSmhCO01BS0EsT0FBQSxFQUFnQixRQUFBLENBQUUsS0FBRixFQUFTLE9BQVQsQ0FBQTtRQUFzQixLQUFLLENBQUMsR0FBTixDQUFBO2VBQWE7TUFBbkMsQ0FMaEI7TUFNQSxNQUFBLEVBQWdCLFFBQUEsQ0FBRSxLQUFGLENBQUE7ZUFBYSxFQUFBLENBQUcsS0FBSDtNQUFiO0lBTmhCLENBREY7SUFTQSxNQUFTLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTtBQUNYLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsQ0FBQTs7TUFDSSxFQUFFLENBQUMsT0FBSCxDQUFXLEdBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFBLENBQWQsRUFESjs7TUFpQ0ksS0FBUywwQkFBVDtRQUNFLFNBQUEsR0FBWSxFQUFBOztBQUFLO1VBQUEsS0FBbUIsOEJBQW5CO3lCQUFBLENBQUEsR0FBSTtVQUFKLENBQUE7O1lBQUw7UUFDWixFQUFBLENBQUcsR0FBRyxDQUFBLGdFQUFBLENBQU4sRUFBOEUsQ0FBRSxDQUFGLEVBQUssU0FBTCxDQUE5RTtNQUZGO01BR0EsRUFBQSxDQUFHLEdBQUcsQ0FBQSxzRUFBQSxDQUFOLEVBcENKOztNQXNDSSxPQUFPLENBQUMsS0FBUixDQUFjLEVBQUUsQ0FBQyxRQUFILENBQVksR0FBRyxDQUFBLDRCQUFBLENBQWYsQ0FBZDtNQUNBLE9BQU8sQ0FBQyxLQUFSLENBQWMsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUEsd0JBQUEsQ0FBZixDQUFkOztRQUNBLENBQUMsQ0FBRSxFQUFILENBQVEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUEsNENBQUEsQ0FBZixDQUFSLEVBQXlFO1VBQUU7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUFGO1VBQWlDO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBakM7VUFBZ0U7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUFoRTtVQUErRjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQS9GO1VBQThIO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBOUg7VUFBNko7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUE3SjtVQUE0TDtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQTVMO1VBQTJOO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBM047VUFBMFA7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUExUDtVQUF5UjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQXpSO1VBQXdUO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBeFQ7VUFBdVY7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUF2VjtVQUFzWDtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQXRYO1VBQXFaO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBclo7VUFBb2I7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUFwYjtVQUFtZDtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQW5kO1VBQW1mO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBbmY7VUFBbWhCO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBbmhCO1VBQW1qQjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQW5qQjtVQUFtbEI7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUFubEI7VUFBbW5CO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBbm5CO1VBQWtwQjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQWxwQjtVQUFpckI7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUFqckI7VUFBZ3RCO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBaHRCO1VBQSt1QjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQS91QjtVQUErd0I7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUEvd0I7VUFBK3lCO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBL3lCO1VBQSswQjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQS8wQjtVQUErMkI7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUEvMkI7VUFBKzRCO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBLzRCO1VBQSs2QjtZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQS82QjtVQUE4OEI7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUE5OEI7VUFBNitCO1lBQUUsQ0FBQSxFQUFHLENBQUw7WUFBUSxHQUFBLEVBQUssQ0FBYjtZQUFnQixRQUFBLEVBQVU7VUFBMUIsQ0FBNytCO1VBQTZnQztZQUFFLENBQUEsRUFBRyxDQUFMO1lBQVEsR0FBQSxFQUFLLENBQWI7WUFBZ0IsUUFBQSxFQUFVO1VBQTFCLENBQTdnQztVQUE2aUM7WUFBRSxDQUFBLEVBQUcsQ0FBTDtZQUFRLEdBQUEsRUFBSyxDQUFiO1lBQWdCLFFBQUEsRUFBVTtVQUExQixDQUE3aUM7U0FBekU7O3lCQUNBLENBQUMsQ0FBRSxFQUFILENBQVEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUEsbUNBQUEsQ0FBZixDQUFSLEVBQWdFO1FBQUU7VUFBRSxDQUFBLEVBQUcsQ0FBTDtVQUFRLFNBQUEsRUFBVztRQUFuQixDQUFGO1FBQWdEO1VBQUUsQ0FBQSxFQUFHLENBQUw7VUFBUSxTQUFBLEVBQVc7UUFBbkIsQ0FBaEQ7UUFBbUc7VUFBRSxDQUFBLEVBQUcsQ0FBTDtVQUFRLFNBQUEsRUFBVztRQUFuQixDQUFuRztRQUF1SjtVQUFFLENBQUEsRUFBRyxDQUFMO1VBQVEsU0FBQSxFQUFXO1FBQW5CLENBQXZKO09BQWhFO0lBMUNPLENBQUE7d0NBNENUO0VBL0Q2QyxFQTdML0M7OztFQStQQSxJQUFDLENBQUUsd0JBQUYsQ0FBRCxHQUFnQyxNQUFBLFFBQUEsQ0FBRSxDQUFGLEVBQUssSUFBTCxDQUFBO0FBQ2hDLFFBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLGFBQUEsRUFBQSxTQUFBOztJQUNFLENBQUEsQ0FBRSxJQUFGLENBQUEsR0FBb0IsT0FBQSxDQUFRLENBQUMsQ0FBQyxTQUFWLENBQXBCO0lBQ0EsTUFBQSxHQUFvQjtJQUNwQixDQUFBLENBQUUsYUFBRixFQUNFLFNBREYsQ0FBQSxHQUNvQixDQUFBLE1BQU0sQ0FBQyxDQUFDLFVBQUYsQ0FBYTtNQUFFLElBQUEsRUFBTSxLQUFSO01BQWUsR0FBQSxFQUFLO0lBQXBCLENBQWIsQ0FBTixDQURwQjtJQUVBLEVBQUEsR0FBb0IsSUFBSSxJQUFKLENBQVM7TUFBRSxJQUFBLEVBQU0sU0FBUjtNQUFtQjtJQUFuQixDQUFUO0lBQ3BCLE9BQUEsR0FBb0IsRUFBRSxDQUFDLGdCQUFILENBQW9CLEdBQUcsQ0FBQSw2QkFBQSxDQUF2QixFQU50Qjs7SUFRRSxFQUFFLENBQUMsZUFBSCxDQUFtQjtNQUFBLElBQUEsRUFBTSxRQUFOO01BQWdCLGFBQUEsRUFBZSxJQUEvQjtNQUFxQyxPQUFBLEVBQVMsS0FBOUM7TUFBcUQsSUFBQSxFQUFNLFFBQUEsQ0FBRSxDQUFGLENBQUE7ZUFBUyxDQUFBLElBQUs7TUFBZDtJQUEzRCxDQUFuQjtJQUNBLEVBQUUsQ0FBQyxPQUFILENBQVcsR0FBRyxDQUFBLDJFQUFBLENBQWQ7SUFDQSxPQUFBLEdBQVUsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLElBQVIsRUFBYyxDQUFkLEVBQWlCLGlCQUFqQixFQUFvQyxDQUFwQyxFQUF1QyxpQkFBdkMsRUFBMEQsRUFBMUQsRUFBOEQsRUFBOUQsRUFBa0UsRUFBbEUsRUFBc0UsRUFBdEUsRUFBMEUsRUFBMUUsRUFBOEUsRUFBOUUsRUFBa0YsR0FBbEYsRUFBdUYsR0FBdkYsRUFBNEYsR0FBNUY7SUFDVixNQUFBLEdBQVUsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUEsc0JBQUEsQ0FBZjtJQUNWLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZDtJQUNBLE1BQUE7O0FBQVk7TUFBQSxLQUFBLHdDQUFBOztxQkFBQSxHQUFHLENBQUM7TUFBSixDQUFBOzs7SUFDWixLQUFBLENBQU0sT0FBTixFQUFlLE1BQWY7O01BQ0EsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxNQUFOLEVBQWMsT0FBZDs7d0NBRUE7RUFsQjhCLEVBL1BoQzs7O0VBb1JBLElBQUMsQ0FBRSxzQkFBRixDQUFELEdBQThCLE1BQUEsUUFBQSxDQUFFLENBQUYsRUFBSyxJQUFMLENBQUE7QUFDOUIsUUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLGFBQUEsRUFBQSxTQUFBOztJQUNFLENBQUEsQ0FBRSxJQUFGLENBQUEsR0FBb0IsT0FBQSxDQUFRLENBQUMsQ0FBQyxTQUFWLENBQXBCO0lBQ0EsTUFBQSxHQUFvQjtJQUNwQixDQUFBLENBQUUsYUFBRixFQUNFLFNBREYsQ0FBQSxHQUNvQixDQUFBLE1BQU0sQ0FBQyxDQUFDLFVBQUYsQ0FBYTtNQUFFLElBQUEsRUFBTSxLQUFSO01BQWUsR0FBQSxFQUFLO0lBQXBCLENBQWIsQ0FBTixDQURwQjtJQUdHLENBQUEsUUFBQSxDQUFBLENBQUEsRUFBQTtBQUNMLFVBQUEsRUFBQSxFQUFBO01BQUksRUFBQSxHQUFNLElBQUksSUFBSixDQUFTO1FBQUUsSUFBQSxFQUFNLFNBQVI7UUFBbUI7TUFBbkIsQ0FBVDtNQUNOLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixFQURUOztNQUdJLEVBQUUsQ0FBQyxhQUFILENBQUE7TUFDQSxPQUFPLENBQUMsS0FBUixDQUFjLEVBQUUsQ0FBQyxRQUFILENBQVksR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7bUJBQUEsQ0FBZixDQUFkO01BY0EsT0FBTyxDQUFDLEtBQVIsQ0FBYyxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQTs7Ozs7bUJBQUEsQ0FBZixDQUFkO01BT0EsT0FBTyxDQUFDLEtBQVIsQ0FBYyxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQTs7Ozs7OzhCQUFBLENBQWYsQ0FBZDtBQVFBLGFBQU87SUFsQ04sQ0FBQTt3Q0FvQ0g7RUEzQzRCLEVBcFI5Qjs7O0VBa1VBLElBQUMsQ0FBRSwyQkFBRixDQUFELEdBQW1DLE1BQUEsUUFBQSxDQUFFLENBQUYsRUFBSyxJQUFMLENBQUE7QUFDbkMsUUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsYUFBQSxFQUFBLFNBQUE7O0lBQ0UsQ0FBQSxDQUFFLElBQUYsQ0FBQSxHQUFvQixPQUFBLENBQVEsQ0FBQyxDQUFDLFNBQVYsQ0FBcEI7SUFDQSxNQUFBLEdBQW9CO0lBQ3BCLENBQUEsQ0FBRSxhQUFGLEVBQ0UsU0FERixDQUFBLEdBQ29CLENBQUEsTUFBTSxDQUFDLENBQUMsVUFBRixDQUFhO01BQUUsSUFBQSxFQUFNLEtBQVI7TUFBZSxHQUFBLEVBQUs7SUFBcEIsQ0FBYixDQUFOLENBRHBCO0lBRUEsRUFBQSxHQUFvQixJQUFJLElBQUosQ0FBUztNQUFFLElBQUEsRUFBTSxTQUFSO01BQW1CO0lBQW5CLENBQVQ7SUFDcEIsT0FBQSxHQUFvQixFQUFFLENBQUMsZ0JBQUgsQ0FBb0IsR0FBRyxDQUFBLDZCQUFBLENBQXZCLEVBTnRCOztJQVFFLEVBQUUsQ0FBQyx5QkFBSCxDQUNFO01BQUEsSUFBQSxFQUFnQixTQUFoQjtNQUNBLEtBQUEsRUFBZ0IsUUFBQSxDQUFBLENBQUE7ZUFBRztNQUFILENBRGhCO01BRUEsSUFBQSxFQUFnQixRQUFBLENBQUUsS0FBRixFQUFTLE9BQVQsQ0FBQTtRQUFzQixLQUFBLENBQU0sUUFBTixFQUFnQixDQUFFLEtBQUYsRUFBUyxPQUFULENBQWhCO2VBQXFDLGlCQUFFLFFBQVEsQ0FBVixDQUFBLEdBQWdCO01BQTNFO0lBRmhCLENBREYsRUFSRjs7SUFhRSxFQUFFLENBQUMseUJBQUgsQ0FDRTtNQUFBLElBQUEsRUFBZ0IsVUFBaEI7TUFDQSxLQUFBLEVBQWdCLENBRGhCO01BRUEsSUFBQSxFQUFnQixRQUFBLENBQUUsS0FBRixFQUFTLE9BQVQsQ0FBQTtRQUFzQixLQUFBLENBQU0sUUFBTixFQUFnQixDQUFFLEtBQUYsRUFBUyxPQUFULENBQWhCO2VBQXFDLGlCQUFFLFFBQVEsQ0FBVixDQUFBLEdBQWdCO01BQTNFLENBRmhCO01BR0EsTUFBQSxFQUFnQixRQUFBLENBQUUsQ0FBRixDQUFBO1FBQVMsS0FBQSxDQUFNLFFBQU4sRUFBZ0IsQ0FBRSxDQUFGLENBQWhCO2VBQXdCO01BQWpDO0lBSGhCLENBREYsRUFiRjs7SUFtQkUsT0FBTyxDQUFDLEtBQVIsQ0FBYyxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQTs7Ozs7Ozs7QUFBQSxDQUFmLENBQWQ7d0NBbUJBO0VBdkNpQyxFQWxVbkM7OztFQTRXQSxJQUFDLENBQUUsaUJBQUYsQ0FBRCxHQUF5QixNQUFBLFFBQUEsQ0FBRSxDQUFGLEVBQUssSUFBTCxDQUFBO0FBQ3pCLFFBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxDQVVtQiwrQ0FWbkIsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLGFBQUEsRUFBQSxTQUFBOztJQUNFLENBQUEsQ0FBRSxJQUFGLENBQUEsR0FBb0IsT0FBQSxDQUFRLENBQUMsQ0FBQyxTQUFWLENBQXBCO0lBQ0EsTUFBQSxHQUFvQjtJQUNwQixDQUFBLENBQUUsYUFBRixFQUNFLFNBREYsQ0FBQSxHQUNvQixDQUFBLE1BQU0sQ0FBQyxDQUFDLFVBQUYsQ0FBYTtNQUFFLElBQUEsRUFBTSxPQUFSO01BQWlCLEdBQUEsRUFBSztJQUF0QixDQUFiLENBQU4sQ0FEcEI7SUFFQSxFQUFBLEdBQW9CLElBQUksSUFBSixDQUFTO01BQUUsSUFBQSxFQUFNLFNBQVI7TUFBbUI7SUFBbkIsQ0FBVCxFQUx0Qjs7O0lBUUUsU0FBQSxHQUFZLEVBQUUsQ0FBQyxPQUFILENBQVcsR0FBRyxDQUFBLDhCQUFBLENBQWQ7SUFDWixRQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsRUFBbEI7SUFDWixDQUFFLEdBQUEsUUFBRjtJQUNBLENBQUE7O0FBQWM7QUFBQTtNQUFBLEtBQUEscUNBQUE7O3FCQUFBLENBQUUsQ0FBQyxDQUFDLElBQUosRUFBVSxDQUFDLENBQUMsSUFBWjtNQUFBLENBQUE7Ozs7TUFDZCxDQUFDLENBQUUsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFFLENBQUUsR0FBRixFQUFPLFNBQVAsQ0FBRixDQUFUO0tBWkY7OztJQWVFLFNBQUEsR0FBWSxFQUFFLENBQUMsT0FBSCxDQUFXLEdBQUcsQ0FBQSxrREFBQSxDQUFkO0lBQ1osUUFBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEVBQWxCO0lBQ1osQ0FBRSxHQUFBLFFBQUY7QUFBaUIsdURBQ2pCLENBQUE7O0FBQWM7QUFBQTtNQUFBLEtBQUEscUNBQUE7O3FCQUFBLENBQUUsQ0FBQyxDQUFDLElBQUosRUFBVSxDQUFDLENBQUMsSUFBWjtNQUFBLENBQUE7Ozs7TUFDZCxDQUFDLENBQUUsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFFLENBQUUsR0FBRixFQUFPLElBQVAsQ0FBRixDQUFUO0tBbkJGOzs7SUFzQkUsU0FBQSxHQUFZLEVBQUUsQ0FBQyxPQUFILENBQVcsR0FBRyxDQUFBLGlFQUFBLENBQWQ7SUFDWixRQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsRUFBbEI7SUFDWixDQUFFLEdBQUEsUUFBRjtBQUFpQix1REFDakIsQ0FBQTs7QUFBYztBQUFBO01BQUEsS0FBQSxxQ0FBQTs7cUJBQUEsQ0FBRSxDQUFDLENBQUMsSUFBSixFQUFVLENBQUMsQ0FBQyxJQUFaO01BQUEsQ0FBQTs7OztNQUNkLENBQUMsQ0FBRSxFQUFILENBQU0sQ0FBTixFQUFTLENBQUUsQ0FBRSxHQUFGLEVBQU8sSUFBUCxDQUFGLENBQVQ7S0ExQkY7OztJQTZCRSxVQUFBLEdBQWEsUUFBQSxDQUFFLENBQUYsQ0FBQTtNQUFTLElBQUcsQ0FBSDtlQUFVLEVBQVY7T0FBQSxNQUFBO2VBQWlCLEVBQWpCOztJQUFUO0lBQ2IsRUFBRSxDQUFDLGVBQUgsQ0FBbUI7TUFBQSxJQUFBLEVBQU0sa0JBQU47TUFBMEIsSUFBQSxFQUFNLFFBQUEsQ0FBRSxDQUFGLENBQUE7UUFDakQsS0FBQSxDQUFNLE9BQU4sRUFBZSxDQUFBLFdBQUEsQ0FBQSxDQUFjLEdBQUEsQ0FBSSxDQUFKLENBQWQsQ0FBQSxDQUFmO0FBQ0EsZUFBTyxVQUFBLENBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFWLENBQWtCLENBQWxCLENBQVg7TUFGMEM7SUFBaEMsQ0FBbkI7SUFHQSxFQUFFLENBQUMsT0FBSCxDQUFXLEdBQUcsQ0FBQSw2REFBQSxDQUFkO0lBQ0EsRUFBRSxDQUFDLE9BQUgsQ0FBVyxHQUFHLENBQUEsa0NBQUEsQ0FBZDs7TUFBb0QsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxJQUFOOztBQUNwRDtNQUFJLEVBQUUsQ0FBQyxPQUFILENBQVcsR0FBRyxDQUFBLG9DQUFBLENBQWQsRUFBSjtLQUF5RCxjQUFBO01BQU07O1FBQVcsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxLQUFLLENBQUMsT0FBTixLQUFpQixnREFBdkI7T0FBakI7O0FBQ3pEO01BQUksRUFBRSxDQUFDLE9BQUgsQ0FBVyxHQUFHLENBQUEsd0NBQUEsQ0FBZCxFQUFKO0tBQTZELGNBQUE7TUFBTTs7UUFBVyxDQUFDLENBQUUsRUFBSCxDQUFNLEtBQUssQ0FBQyxPQUFOLEtBQWlCLGdEQUF2QjtPQUFqQjs7d0NBRTdEO0VBdkN1QixFQTVXekI7OztFQXNaQSxJQUFDLENBQUUsNEJBQUYsQ0FBRCxHQUFvQyxNQUFBLFFBQUEsQ0FBRSxDQUFGLEVBQUssSUFBTCxDQUFBO0FBQ3BDLFFBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGVBQUEsRUFBQSxhQUFBLEVBQUE7SUFBRSxNQUFBLEdBQW9CO0lBQ3BCLE1BQUEsR0FBb0I7SUFDcEIsQ0FBQSxDQUFFLElBQUYsQ0FBQSxHQUFvQixPQUFBLENBQVEsQ0FBQyxDQUFDLFNBQVYsQ0FBcEI7SUFDQSxDQUFBLENBQUUsYUFBRixFQUNFLFNBREYsQ0FBQSxHQUNvQixDQUFBLE1BQU0sQ0FBQyxDQUFDLFVBQUYsQ0FBYTtNQUFFLElBQUEsRUFBTSxPQUFSO01BQWlCLEdBQUEsRUFBSztJQUF0QixDQUFiLENBQU4sQ0FEcEI7SUFFQSxLQUFBLENBQU0sQ0FBRSxhQUFGLEVBQWlCLFNBQWpCLENBQU47SUFDQSxFQUFBLEdBQW9CLElBQUksSUFBSixDQUFTO01BQUUsSUFBQSxFQUFNO0lBQVIsQ0FBVCxFQU50Qjs7O0lBU0UsVUFBQSxHQUFvQixHQUFHLENBQUE7SUFBQSxDQUFBLENBRWYsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFQLENBQVMsTUFBVCxDQUZlLENBQUE7Ozs7OztvQkFBQSxFQVR6Qjs7SUFtQkUsRUFBRSxDQUFDLHFCQUFILENBQ0U7TUFBQSxJQUFBLEVBQWdCLE1BQUEsR0FBUyxVQUF6QjtNQUNBLE9BQUEsRUFBZ0IsQ0FBRSxRQUFGLEVBQVksTUFBWixFQUFvQixNQUFwQixFQUE0QixVQUE1QixFQUF3QyxVQUF4QyxDQURoQjtNQUVBLFVBQUEsRUFBZ0IsRUFGaEI7TUFHQSxPQUFBLEVBQWdCLEtBSGhCO01BSUEsYUFBQSxFQUFnQixLQUpoQjtNQUtBLElBQUEsRUFBZ0IsU0FBQSxDQUFBLENBQUE7ZUFBRyxDQUFBLE9BQVcsRUFBRSxDQUFDLEtBQUgsQ0FBUyxVQUFULENBQVg7TUFBSDtJQUxoQixDQURGLEVBbkJGOztJQTJCRSxlQUFBLEdBQWtCLFFBQUEsQ0FBQSxDQUFBO2FBQ2hCLE9BQU8sQ0FBQyxLQUFSLENBQWMsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFHLENBQUE7Ozs7Ozs7b0JBQUEsQ0FBZixDQUFkO0lBRGdCLEVBM0JwQjs7SUFzQ0UsS0FBQSxHQUFRO0lBQ1IsS0FBQSxxRkFBQTtNQUNFLEtBQUE7O1FBQUE7UUFDRSxLQUFBO1FBQ0EsSUFBUyxLQUFBLEdBQVEsQ0FBakI7QUFBQSxnQkFBQTs7UUFDQSxJQUFBLENBQUssU0FBTCxFQUFnQixJQUFoQjtNQUhGO0lBREYsQ0F2Q0Y7O0lBNkNFLEtBQUEsR0FBUTtJQUNSLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixRQUFBLENBQUEsQ0FBQTtBQUN0QixVQUFBO0FBQUk7TUFBQSxLQUFBLHFGQUFBOzs7QUFDRTtVQUFBLEtBQUE7O1lBQUE7WUFDRSxLQUFBO1lBQ0EsSUFBUyxLQUFBLEdBQVEsQ0FBakI7QUFBQSxvQkFBQTs7WUFDQSxJQUFBLENBQUssU0FBTCxFQUFnQixJQUFoQjswQkFDQSxFQUFFLENBQUMsT0FBSCxDQUFXLDRDQUFYO1VBSkYsQ0FBQTs7O01BREYsQ0FBQTs7SUFEa0IsQ0FBcEI7QUFRQTs7TUFDRSxLQUFBLGtEQUFBO1FBQ0UsSUFBQSxDQUFLLFNBQUwsRUFBZ0IsR0FBaEI7TUFERixDQURGO0tBR0EsY0FBQTtNQUFNO01BQ0osSUFBQSxDQUFLLEdBQUcsQ0FBQyxPQUFKLENBQVksU0FBWixFQUF1QixLQUFLLENBQUMsT0FBN0IsQ0FBTDs7UUFDQSxDQUFDLENBQUUsRUFBSCxDQUFNLEtBQUssQ0FBQyxPQUFaLEVBQXFCLG9EQUFyQjtPQUZGOztBQUlBOztNQUNFLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixRQUFBLENBQUEsQ0FBQTtBQUN4QixZQUFBO0FBQU07UUFBQSxLQUFBLGtEQUFBO3VCQUNFLElBQUEsQ0FBSyxTQUFMLEVBQWdCLEdBQWhCO1FBREYsQ0FBQTs7TUFEa0IsQ0FBcEIsRUFERjtLQUlBLGNBQUE7TUFBTTtNQUNKLElBQUEsQ0FBSyxHQUFHLENBQUMsT0FBSixDQUFZLFNBQVosRUFBdUIsS0FBSyxDQUFDLE9BQTdCLENBQUw7O1FBQ0EsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxLQUFLLENBQUMsT0FBWixFQUFxQixvREFBckI7T0FGRjtLQWpFRjs7SUFxRUUsZUFBQSxDQUFBO3dDQUNBO0VBdkVrQyxFQXRacEM7OztFQWllQSxJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTthQUNoQyxJQUFBLENBQUssSUFBTCxFQUFRO1FBQUUsT0FBQSxFQUFTO01BQVgsQ0FBUjtJQURnQyxDQUFBLElBQWxDOzs7RUFqZUE7Ozs7Ozs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5DTkQgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnY25kJ1xucnByICAgICAgICAgICAgICAgICAgICAgICA9IENORC5ycHJcbmJhZGdlICAgICAgICAgICAgICAgICAgICAgPSAnREJBWS9URVNUUy9VREYnXG5kZWJ1ZyAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2RlYnVnJywgICAgIGJhZGdlXG53YXJuICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3dhcm4nLCAgICAgIGJhZGdlXG5pbmZvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2luZm8nLCAgICAgIGJhZGdlXG51cmdlICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3VyZ2UnLCAgICAgIGJhZGdlXG5oZWxwICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2hlbHAnLCAgICAgIGJhZGdlXG53aGlzcGVyICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3doaXNwZXInLCAgIGJhZGdlXG5lY2hvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmVjaG8uYmluZCBDTkRcbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxudGVzdCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZ3V5LXRlc3QnXG5QQVRIICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcbkggICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL2hlbHBlcnMnXG50eXBlcyAgICAgICAgICAgICAgICAgICAgID0gbmV3ICggcmVxdWlyZSAnaW50ZXJ0eXBlJyApLkludGVydHlwZVxueyBpc2FcbiAgdHlwZV9vZlxuICB2YWxpZGF0ZVxuICB2YWxpZGF0ZV9saXN0X29mIH0gICAgICA9IHR5cGVzLmV4cG9ydCgpXG5TUUwgICAgICAgICAgICAgICAgICAgICAgID0gU3RyaW5nLnJhd1xuanIgICAgICAgICAgICAgICAgICAgICAgICA9IEpTT04uc3RyaW5naWZ5XG5qcCAgICAgICAgICAgICAgICAgICAgICAgID0gSlNPTi5wYXJzZVxuXG5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIkRCQVkvVURGIHdpbmRvdyBmdW5jdGlvbnMgZXRjLlwiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIFQuaGFsdF9vbl9lcnJvcigpXG4gIHsgREJheSB9ICAgICAgICAgID0gcmVxdWlyZSBILmRiYXlfcGF0aFxuICBzY2hlbWEgICAgICAgICAgICA9ICdtYWluJ1xuICB7IHRlbXBsYXRlX3BhdGhcbiAgICB3b3JrX3BhdGggfSAgICAgPSBhd2FpdCBILnByb2N1cmVfZGIgeyBzaXplOiAnbm50JywgcmVmOiAnZm4nLCB9XG4gIGRlYnVnIHsgdGVtcGxhdGVfcGF0aCwgd29ya19wYXRoLCB9XG4gIGRiICAgICAgICAgICAgICAgID0gbmV3IERCYXkgeyBwYXRoOiB3b3JrX3BhdGgsIHNjaGVtYSwgfVxuICBudW1iZXJzICAgICAgICAgICA9IGRiLmFsbF9maXJzdF92YWx1ZXMgU1FMXCJzZWxlY3QgbiBmcm9tIG5udCBvcmRlciBieSBuO1wiXG4gICMgY29uc29sZS50YWJsZSBkYi5saXN0IGRiLndhbGtfb2JqZWN0cyB7IHNjaGVtYSwgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGF3YWl0IGRvID0+XG4gICAgIyMjIHNpbmdsZS12YWx1ZWQgZnVuY3Rpb24gIyMjXG4gICAgZGIuY3JlYXRlX2Z1bmN0aW9uIG5hbWU6ICdzcXVhcmUnLCBkZXRlcm1pbmlzdGljOiB0cnVlLCB2YXJhcmdzOiBmYWxzZSwgY2FsbDogKCBuICkgLT4gbiAqKiAyXG4gICAgbWF0Y2hlciA9ICggKCBuICogbiApIGZvciBuIGluIG51bWJlcnMgKVxuICAgIHJlc3VsdCAgPSBkYi5hbGxfcm93cyBTUUxcInNlbGVjdCAqLCBzcXVhcmUoIG4gKSBhcyBzcXVhcmUgZnJvbSBubnQgb3JkZXIgYnkgc3F1YXJlO1wiXG4gICAgY29uc29sZS50YWJsZSByZXN1bHRcbiAgICByZXN1bHQgID0gKCByb3cuc3F1YXJlIGZvciByb3cgaW4gcmVzdWx0IClcbiAgICBUPy5lcSByZXN1bHQsIG1hdGNoZXJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBhd2FpdCBkbyA9PlxuICAgICMjIyBhZ2dyZWdhdGUgZnVuY3Rpb24gIyMjXG4gICAgZGIuY3JlYXRlX2FnZ3JlZ2F0ZV9mdW5jdGlvblxuICAgICAgbmFtZTogICAgICAgICAgICdwcm9kdWN0J1xuICAgICAgc3RhcnQ6ICAgICAgICAgIC0+IG51bGxcbiAgICAgIHN0ZXA6ICAgICAgICAgICAoIHRvdGFsLCBlbGVtZW50ICkgLT4gZGVidWcgJ140NDc2XicsIHsgdG90YWwsIGVsZW1lbnQsIH07ICggdG90YWwgPyAxICkgKiBlbGVtZW50XG4gICAgICAjIGludmVyc2U6ICAgICAgICAoIHRvdGFsLCBkcm9wcGVkICkgLT4gdG90YWwucG9wKCk7IHRvdGFsXG4gICAgICAjIHJlc3VsdDogICAgICAgICAoIHRvdGFsICkgLT4gdG90YWxcbiAgICAjIG1hdGNoZXIgPSAoICggbiAqIG4gKSBmb3IgbiBpbiBudW1iZXJzIClcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRvID0+XG4gICAgICByZXN1bHQgID0gZGIuYWxsX3Jvd3MgU1FMXCJzZWxlY3QgcHJvZHVjdCggbiApIGFzIHByb2R1Y3QgZnJvbSBubnQgd2hlcmUgbiAhPSAwO1wiXG4gICAgICBjb25zb2xlLnRhYmxlIHJlc3VsdFxuICAgICAgbWF0Y2hlciA9IFsgNTEyMjkyMjExMiwgXVxuICAgICAgcmVzdWx0ICA9ICggcm93LnByb2R1Y3QgZm9yIHJvdyBpbiByZXN1bHQgKVxuICAgICAgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkbyA9PlxuICAgICAgcmVzdWx0ICA9IGRiLmFsbF9yb3dzIFNRTFwic2VsZWN0IHByb2R1Y3QoIG4gKSBhcyBwcm9kdWN0IGZyb20gbm50IHdoZXJlIG4gPiAxMDA7XCJcbiAgICAgIGNvbnNvbGUudGFibGUgcmVzdWx0XG4gICAgICBtYXRjaGVyID0gWyBudWxsLCBdXG4gICAgICByZXN1bHQgID0gKCByb3cucHJvZHVjdCBmb3Igcm93IGluIHJlc3VsdCApXG4gICAgICBUPy5lcSByZXN1bHQsIG1hdGNoZXJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRvID0+XG4gICAgICB0cnlcbiAgICAgICAgZGIucXVlcnkgU1FMXCJzZWxlY3QgcHJvZHVjdCggbiApIG92ZXIgKCkgYXMgcHJvZHVjdCBmcm9tIG5udDtcIlxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgVD8uZXEgZXJyb3IuY29kZSwgJ1NRTElURV9FUlJPUidcbiAgICAgICAgVD8uZXEgZXJyb3IubmFtZSwgJ1NxbGl0ZUVycm9yJ1xuICAgICAgICBUPy5lcSBlcnJvci5tZXNzYWdlLCAncHJvZHVjdCgpIG1heSBub3QgYmUgdXNlZCBhcyBhIHdpbmRvdyBmdW5jdGlvbidcbiAgICAgIHVubGVzcyBlcnJvcj9cbiAgICAgICAgVC5mYWlsIFwiZXhwZWN0ZWQgZXJyb3JcIlxuICAgICAgIyBjb25zb2xlLnRhYmxlIHJlc3VsdFxuICAgICAgIyBtYXRjaGVyID0gWyBudWxsLCBdXG4gICAgICAjIHJlc3VsdCAgPSAoIHJvdy5wcm9kdWN0IGZvciByb3cgaW4gcmVzdWx0IClcbiAgICAgICMgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgYXdhaXQgZG8gPT5cbiAgICAjIyMgd2luZG93IGZ1bmN0aW9uICMjI1xuICAgIGRiLmNyZWF0ZV93aW5kb3dfZnVuY3Rpb25cbiAgICAgIG5hbWU6ICAgICAgICAgICAnYXJyYXlfYWdnJ1xuICAgICAgdmFyYXJnczogICAgICAgIGZhbHNlXG4gICAgICBkZXRlcm1pbmlzdGljOiAgdHJ1ZVxuICAgICAgc3RhcnQ6ICAgICAgICAgIC0+IFtdICMgbXVzdCBiZSBuZXcgb2JqZWN0IGZvciBlYWNoIHBhcnRpdGlvbiwgdGhlcmVmb3JlIHVzZSBmdW5jdGlvbiwgbm90IGNvbnN0YW50XG4gICAgICBzdGVwOiAgICAgICAgICAgKCB0b3RhbCwgZWxlbWVudCApIC0+IHRvdGFsLnB1c2ggZWxlbWVudDsgdG90YWxcbiAgICAgIGludmVyc2U6ICAgICAgICAoIHRvdGFsLCBkcm9wcGVkICkgLT4gdG90YWwucG9wKCk7IHRvdGFsXG4gICAgICByZXN1bHQ6ICAgICAgICAgKCB0b3RhbCApIC0+IGpyIHRvdGFsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkbyA9PlxuICAgICAgcmVzdWx0ICA9IGRiLmFsbF9yb3dzIFNRTFwic2VsZWN0IGFycmF5X2FnZyggdCApIGFzIG5hbWVzIGZyb20gbm50O1wiXG4gICAgICBjb25zb2xlLnRhYmxlIHJlc3VsdFxuICAgICAgbWF0Y2hlciA9IFsgJ1tcIm5hdWdodFwiLFwib25lXCIsXCJvbmUgcG9pbnQgZml2ZVwiLFwidHdvXCIsXCJ0d28gcG9pbnQgdGhyZWVcIixcInRocmVlXCIsXCJ0aHJlZSBwb2ludCBvbmVcIixcImZvdXJcIixcImZpdmVcIixcInNpeFwiLFwic2V2ZW5cIixcImVpZ2h0XCIsXCJuaW5lXCIsXCJ0ZW5cIixcImVsZXZlblwiLFwidHdlbHZlXCJdJyBdXG4gICAgICByZXN1bHQgID0gKCByb3cubmFtZXMgZm9yIHJvdyBpbiByZXN1bHQgKVxuICAgICAgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkbyA9PlxuICAgICAgcmVzdWx0ICA9IGRiLmFsbF9yb3dzIFNRTFwiXCJcIlxuICAgICAgICBzZWxlY3QgZGlzdGluY3RcbiAgICAgICAgICAgIGFycmF5X2FnZyggdCApIG92ZXIgdyBhcyBuYW1lc1xuICAgICAgICAgIGZyb20gbm50XG4gICAgICAgICAgd2luZG93IHcgYXMgKFxuICAgICAgICAgICAgcGFydGl0aW9uIGJ5IHN1YnN0cmluZyggdCwgMSwgMSApXG4gICAgICAgICAgICBvcmRlciBieSB0XG4gICAgICAgICAgICByYW5nZSBiZXR3ZWVuIHVuYm91bmRlZCBwcmVjZWRpbmcgYW5kIHVuYm91bmRlZCBmb2xsb3dpbmdcbiAgICAgICAgICAgICk7XCJcIlwiXG4gICAgICBjb25zb2xlLnRhYmxlIHJlc3VsdFxuICAgICAgbWF0Y2hlciA9IFsgJ1tcImVpZ2h0XCIsXCJlbGV2ZW5cIl0nLCAnW1wiZml2ZVwiLFwiZm91clwiXScsICdbXCJuYXVnaHRcIixcIm5pbmVcIl0nLCAnW1wib25lXCIsXCJvbmUgcG9pbnQgZml2ZVwiXScsICdbXCJzZXZlblwiLFwic2l4XCJdJywgJ1tcInRlblwiLFwidGhyZWVcIixcInRocmVlIHBvaW50IG9uZVwiLFwidHdlbHZlXCIsXCJ0d29cIixcInR3byBwb2ludCB0aHJlZVwiXScgXVxuICAgICAgcmVzdWx0ICA9ICggcm93Lm5hbWVzIGZvciByb3cgaW4gcmVzdWx0IClcbiAgICAgIGRlYnVnICdeODc4XicsIHJlc3VsdFxuICAgICAgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgYXdhaXQgZG8gPT5cbiAgICAjIyMgdGFibGUtdmFsdWVkIGZ1bmN0aW9uICMjI1xuICAgIGRiLmNyZWF0ZV90YWJsZV9mdW5jdGlvblxuICAgICAgbmFtZTogICAgICAgICAncmVfbWF0Y2hlcydcbiAgICAgIGNvbHVtbnM6ICAgICAgWyAnbWF0Y2gnLCAnY2FwdHVyZScsIF1cbiAgICAgIHBhcmFtZXRlcnM6ICAgWyAndGV4dCcsICdwYXR0ZXJuJywgXVxuICAgICAgcm93czogKCB0ZXh0LCBwYXR0ZXJuICkgLT5cbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwIHBhdHRlcm4sICdnJ1xuICAgICAgICB3aGlsZSAoIG1hdGNoID0gcmVnZXguZXhlYyB0ZXh0ICk/XG4gICAgICAgICAgeWllbGQgWyBtYXRjaFsgMCBdLCBtYXRjaFsgMSBdLCBdXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgYXdhaXQgZG8gPT5cbiAgICAgIHJlc3VsdCAgPSBkYi5hbGxfcm93cyBTUUxcIlwiXCJcbiAgICAgICAgc2VsZWN0XG4gICAgICAgICAgICAqXG4gICAgICAgICAgZnJvbVxuICAgICAgICAgICAgbm50LFxuICAgICAgICAgICAgcmVfbWF0Y2hlcyggdCwgJ14uKihbYWVpb3VdLmUpLiokJyApIGFzIHJ4XG4gICAgICAgICAgb3JkZXIgYnkgcngubWF0Y2g7XCJcIlwiXG4gICAgICBjb25zb2xlLnRhYmxlIHJlc3VsdFxuICAgICAgbWF0Y2hlciA9IFsgJ2VsZXZlbjpldmUnLCAnZml2ZTppdmUnLCAnbmluZTppbmUnLCAnb25lOm9uZScsICdvbmUgcG9pbnQgZml2ZTppdmUnLCAnc2V2ZW46ZXZlJywgJ3RocmVlIHBvaW50IG9uZTpvbmUnIF1cbiAgICAgIHJlc3VsdCAgPSAoIFwiI3tyb3cudH06I3tyb3cuY2FwdHVyZX1cIiBmb3Igcm93IGluIHJlc3VsdCApXG4gICAgICBkZWJ1ZyAnXjk4NF4nLCByZXN1bHRcbiAgICAgIFQ/LmVxIHJlc3VsdCwgbWF0Y2hlclxuICAgIGF3YWl0IGRvID0+XG4gICAgICByZXN1bHQgID0gZGIuYWxsX3Jvd3MgU1FMXCJcIlwiXG4gICAgICAgIHNlbGVjdFxuICAgICAgICAgICAgKlxuICAgICAgICAgIGZyb21cbiAgICAgICAgICAgIG5udCxcbiAgICAgICAgICAgIHJlX21hdGNoZXMoIHQsICdvJyApIGFzIHJ4XG4gICAgICAgICAgb3JkZXIgYnkgdDtcIlwiXCJcbiAgICAgIGNvbnNvbGUudGFibGUgcmVzdWx0XG4gICAgICBtYXRjaGVyID0gWyAnZm91cicsICdvbmUnLCAnb25lIHBvaW50IGZpdmUnLCAnb25lIHBvaW50IGZpdmUnLCAndGhyZWUgcG9pbnQgb25lJywgJ3RocmVlIHBvaW50IG9uZScsICd0d28nLCAndHdvIHBvaW50IHRocmVlJywgJ3R3byBwb2ludCB0aHJlZScgXVxuICAgICAgcmVzdWx0ICA9ICggcm93LnQgZm9yIHJvdyBpbiByZXN1bHQgKVxuICAgICAgZGVidWcgJ145ODReJywgcmVzdWx0XG4gICAgICBUPy5lcSByZXN1bHQsIG1hdGNoZXJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBhd2FpdCBkbyA9PlxuICAgICMjIyB2aXJ0dWFsIHRhYmxlICMjI1xuICAgIEZTID0gcmVxdWlyZSAnZnMnXG4gICAgZGIuY3JlYXRlX3ZpcnR1YWxfdGFibGVcbiAgICAgIG5hbWU6ICAgJ2ZpbGVfY29udGVudHMnXG4gICAgICBjcmVhdGU6ICggZmlsZW5hbWUsIFAuLi4gKSAtPlxuICAgICAgICB1cmdlICdeNDY0NTZeJywgeyBmaWxlbmFtZSwgUCwgfVxuICAgICAgICBSID1cbiAgICAgICAgICBjb2x1bW5zOiBbICdwYXRoJywgJ2xucicsICdsaW5lJywgXSxcbiAgICAgICAgICByb3dzOiAtPlxuICAgICAgICAgICAgcGF0aCAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uL2Fzc2V0cy9pY3FsJywgZmlsZW5hbWVcbiAgICAgICAgICAgIGxpbmVzID0gKCBGUy5yZWFkRmlsZVN5bmMgcGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JywgfSApLnNwbGl0ICdcXG4nXG4gICAgICAgICAgICBmb3IgbGluZSwgbGluZV9pZHggaW4gbGluZXNcbiAgICAgICAgICAgICAgeWllbGQgeyBwYXRoLCBsbnI6IGxpbmVfaWR4ICsgMSwgbGluZSwgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgcmV0dXJuIFJcbiAgICBkYi5leGVjdXRlIFNRTFwiXCJcIlxuICAgICAgY3JlYXRlIHZpcnR1YWwgdGFibGUgY29udGVudHNfb2Zfd2JmdHN2XG4gICAgICAgIHVzaW5nIGZpbGVfY29udGVudHMoIG5jcmdseXBod2JmLnRzdiwgYW55IHN0dWZmIGdvZXMgaGVyZSwgYW5kIG1vcmUgaGVyZSApO1wiXCJcIlxuICAgIHJlc3VsdCAgPSBkYi5hbGxfcm93cyBTUUxcInNlbGVjdCAqIGZyb20gY29udGVudHNfb2Zfd2JmdHN2IHdoZXJlIGxuciBiZXR3ZWVuIDEwIGFuZCAxNCBvcmRlciBieSAxLCAyLCAzO1wiXG4gICAgY29uc29sZS50YWJsZSByZXN1bHRcbiAgICBtYXRjaGVyID0gWyAndS1jamsteGEtMzQxN1xcdOOQl1xcdDwxMjEzMzU1PicsICcnLCAndS1jamsteGEtMzRhYlxcdOOSq1xcdDwxMjExMzU+JywgJ3UtY2prLXhhLTM0MmFcXHTjkKpcXHQ8NDE1MjM0PicsICd1LWNqay14YS0zNDJiXFx045CrXFx0PDQxMzQ1Mj4nIF1cbiAgICByZXN1bHQgID0gKCByb3cubGluZSBmb3Igcm93IGluIHJlc3VsdCApXG4gICAgZGVidWcgJ145ODReJywgcmVzdWx0XG4gICAgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiREJBWS9VREYgVXNlci1EZWZpbmVkIFdpbmRvdyBGdW5jdGlvblwiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIyMgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9uYWxnZW9uL3NxbGVhbi9ibG9iL21haW4vZG9jcy92c3YubWQgIyMjXG4gICMgVC5oYWx0X29uX2Vycm9yKClcbiAgeyBEQmF5IH0gICAgICAgICAgPSByZXF1aXJlIEguZGJheV9wYXRoXG4gIHNjaGVtYSAgICAgICAgICAgID0gJ21haW4nXG4gIGRiICAgICAgICAgICAgICAgID0gbmV3IERCYXkoKVxuICAjIGRiLmxvYWRfZXh0ZW5zaW9uIFBBVEgucmVzb2x2ZSBQQVRILmpvaW4gX19kaXJuYW1lLCAnLi4vLi4vLi4vYXNzZXRzL3NxbGl0ZS1leHRlbnNpb25zL2pzb24xLnNvJ1xuICAjIGRiLnNxbHQudW5zYWZlTW9kZSB0cnVlXG4gIHsgSSwgTCwgViwgfSAgICAgID0gZGIuc3FsXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZGIuY3JlYXRlX3dpbmRvd19mdW5jdGlvblxuICAgIG5hbWU6ICAgICAgICAgICAndWRmX2pzb25fYXJyYXlfYWdnJ1xuICAgIHZhcmFyZ3M6ICAgICAgICBmYWxzZVxuICAgIGRldGVybWluaXN0aWM6ICB0cnVlXG4gICAgc3RhcnQ6ICAgICAgICAgIC0+IFtdICMgbXVzdCBiZSBuZXcgb2JqZWN0IGZvciBlYWNoIHBhcnRpdGlvbiwgdGhlcmVmb3JlIHVzZSBmdW5jdGlvbiwgbm90IGNvbnN0YW50XG4gICAgc3RlcDogICAgICAgICAgICggdG90YWwsIGVsZW1lbnQgKSAtPiB0b3RhbC5wdXNoIGVsZW1lbnQ7IHRvdGFsXG4gICAgaW52ZXJzZTogICAgICAgICggdG90YWwsIGRyb3BwZWQgKSAtPiB0b3RhbC5wb3AoKTsgdG90YWxcbiAgICByZXN1bHQ6ICAgICAgICAgKCB0b3RhbCApIC0+IGpyIHRvdGFsXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgYXdhaXQgZG8gPT5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRiLmV4ZWN1dGUgU1FMXCJcIlwiXG4gICAgICBjcmVhdGUgdmlldyBtdWx0aXBsZXMgYXMgc2VsZWN0IGRpc3RpbmN0XG4gICAgICAgICAgbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMgbixcbiAgICAgICAgICB1ZGZfanNvbl9hcnJheV9hZ2coIG11bHRpcGxlICkgb3ZlciB3ICAgICAgICAgICBhcyBtdWx0aXBsZXNcbiAgICAgICAgZnJvbSBtdWx0aXBsZXNfaWR4XG4gICAgICAgIHdpbmRvdyB3IGFzICggcGFydGl0aW9uIGJ5IG4gb3JkZXIgYnkgaWR4IHJhbmdlIGJldHdlZW4gdW5ib3VuZGVkIHByZWNlZGluZyBhbmQgdW5ib3VuZGVkIGZvbGxvd2luZyApXG4gICAgICAgIG9yZGVyIGJ5IG47XG4gICAgICAtLSAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGNyZWF0ZSB0YWJsZSBtdWx0aXBsZXNfaWR4IChcbiAgICAgICAgbiAgICAgICAgIGludGVnZXIgbm90IG51bGwsXG4gICAgICAgIGlkeCAgICAgICBpbnRlZ2VyIG5vdCBudWxsLFxuICAgICAgICBtdWx0aXBsZSAgaW50ZWdlciBub3QgbnVsbCxcbiAgICAgICAgcHJpbWFyeSBrZXkgKCBuLCBpZHggKSApO1xuICAgICAgY3JlYXRlIGluZGV4IG11bHRpcGxlc19pZHhfaWR4X2lkeCBvbiBtdWx0aXBsZXNfaWR4ICggaWR4ICk7XG4gICAgICBjcmVhdGUgaW5kZXggbXVsdGlwbGVzX2lkeF9tdWx0aXBsZV9pZHggb24gbXVsdGlwbGVzX2lkeCAoIG11bHRpcGxlICk7XG4gICAgICAtLSAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGNyZWF0ZSB0cmlnZ2VyIG11bHRpcGxlX2luc3RlYWRfaW5zZXJ0IGluc3RlYWQgb2YgaW5zZXJ0IG9uIG11bHRpcGxlcyBiZWdpblxuICAgICAgICBpbnNlcnQgaW50byBtdWx0aXBsZXNfaWR4KCBuLCBpZHgsIG11bHRpcGxlIClcbiAgICAgICAgICBzZWxlY3QgbmV3Lm4sIGoua2V5LCBqLnZhbHVlIGZyb20ganNvbl9lYWNoKCBuZXcubXVsdGlwbGVzICkgYXMgajtcbiAgICAgICAgZW5kO1xuICAgICAgLS0gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBjcmVhdGUgdHJpZ2dlciBtdWx0aXBsZV9pbnN0ZWFkX2RlbGV0ZSBpbnN0ZWFkIG9mIGRlbGV0ZSBvbiBtdWx0aXBsZXMgYmVnaW5cbiAgICAgICAgZGVsZXRlIGZyb20gbXVsdGlwbGVzX2lkeCB3aGVyZSBuID0gb2xkLm47XG4gICAgICAgIGVuZDtcbiAgICAgIC0tIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgY3JlYXRlIHRyaWdnZXIgbXVsdGlwbGVfaW5zdGVhZF91cGRhdGUgaW5zdGVhZCBvZiB1cGRhdGUgb24gbXVsdGlwbGVzIGJlZ2luXG4gICAgICAgIGRlbGV0ZSBmcm9tIG11bHRpcGxlc19pZHggd2hlcmUgbiA9IG9sZC5uO1xuICAgICAgICBpbnNlcnQgaW50byBtdWx0aXBsZXNfaWR4KCBuLCBpZHgsIG11bHRpcGxlIClcbiAgICAgICAgICBzZWxlY3QgbmV3Lm4sIGoua2V5LCBqLnZhbHVlIGZyb20ganNvbl9lYWNoKCBuZXcubXVsdGlwbGVzICkgYXMgajtcbiAgICAgICAgZW5kO1xuICAgICAgXCJcIlwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBmb3IgbiBpbiBbIDEgLi4gMyBdXG4gICAgICBtdWx0aXBsZXMgPSBqciAoIG4gKiBpZHggZm9yIGlkeCBpbiBbIDAgLi4gOSBdIClcbiAgICAgIGRiIFNRTFwiXCJcImluc2VydCBpbnRvIG11bHRpcGxlcyAoIG4sIG11bHRpcGxlcyApIHZhbHVlcyAoICRuLCAkbXVsdGlwbGVzIClcIlwiXCIsIHsgbiwgbXVsdGlwbGVzLCB9XG4gICAgZGIgU1FMXCJpbnNlcnQgaW50byBtdWx0aXBsZXMgKCBuLCBtdWx0aXBsZXMgKSB2YWx1ZXMgKCA1LCAnWzAsNSwxMCwxNSwyMF0nICk7XCJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGNvbnNvbGUudGFibGUgZGIuYWxsX3Jvd3MgU1FMXCJzZWxlY3QgKiBmcm9tIG11bHRpcGxlc19pZHg7XCJcbiAgICBjb25zb2xlLnRhYmxlIGRiLmFsbF9yb3dzIFNRTFwic2VsZWN0ICogZnJvbSBtdWx0aXBsZXM7XCJcbiAgICBUPy5lcSAoIGRiLmFsbF9yb3dzIFNRTFwic2VsZWN0ICogZnJvbSBtdWx0aXBsZXNfaWR4IG9yZGVyIGJ5IG4sIGlkeDtcIiApLCBbIHsgbjogMSwgaWR4OiAwLCBtdWx0aXBsZTogMCB9LCB7IG46IDEsIGlkeDogMSwgbXVsdGlwbGU6IDEgfSwgeyBuOiAxLCBpZHg6IDIsIG11bHRpcGxlOiAyIH0sIHsgbjogMSwgaWR4OiAzLCBtdWx0aXBsZTogMyB9LCB7IG46IDEsIGlkeDogNCwgbXVsdGlwbGU6IDQgfSwgeyBuOiAxLCBpZHg6IDUsIG11bHRpcGxlOiA1IH0sIHsgbjogMSwgaWR4OiA2LCBtdWx0aXBsZTogNiB9LCB7IG46IDEsIGlkeDogNywgbXVsdGlwbGU6IDcgfSwgeyBuOiAxLCBpZHg6IDgsIG11bHRpcGxlOiA4IH0sIHsgbjogMSwgaWR4OiA5LCBtdWx0aXBsZTogOSB9LCB7IG46IDIsIGlkeDogMCwgbXVsdGlwbGU6IDAgfSwgeyBuOiAyLCBpZHg6IDEsIG11bHRpcGxlOiAyIH0sIHsgbjogMiwgaWR4OiAyLCBtdWx0aXBsZTogNCB9LCB7IG46IDIsIGlkeDogMywgbXVsdGlwbGU6IDYgfSwgeyBuOiAyLCBpZHg6IDQsIG11bHRpcGxlOiA4IH0sIHsgbjogMiwgaWR4OiA1LCBtdWx0aXBsZTogMTAgfSwgeyBuOiAyLCBpZHg6IDYsIG11bHRpcGxlOiAxMiB9LCB7IG46IDIsIGlkeDogNywgbXVsdGlwbGU6IDE0IH0sIHsgbjogMiwgaWR4OiA4LCBtdWx0aXBsZTogMTYgfSwgeyBuOiAyLCBpZHg6IDksIG11bHRpcGxlOiAxOCB9LCB7IG46IDMsIGlkeDogMCwgbXVsdGlwbGU6IDAgfSwgeyBuOiAzLCBpZHg6IDEsIG11bHRpcGxlOiAzIH0sIHsgbjogMywgaWR4OiAyLCBtdWx0aXBsZTogNiB9LCB7IG46IDMsIGlkeDogMywgbXVsdGlwbGU6IDkgfSwgeyBuOiAzLCBpZHg6IDQsIG11bHRpcGxlOiAxMiB9LCB7IG46IDMsIGlkeDogNSwgbXVsdGlwbGU6IDE1IH0sIHsgbjogMywgaWR4OiA2LCBtdWx0aXBsZTogMTggfSwgeyBuOiAzLCBpZHg6IDcsIG11bHRpcGxlOiAyMSB9LCB7IG46IDMsIGlkeDogOCwgbXVsdGlwbGU6IDI0IH0sIHsgbjogMywgaWR4OiA5LCBtdWx0aXBsZTogMjcgfSwgeyBuOiA1LCBpZHg6IDAsIG11bHRpcGxlOiAwIH0sIHsgbjogNSwgaWR4OiAxLCBtdWx0aXBsZTogNSB9LCB7IG46IDUsIGlkeDogMiwgbXVsdGlwbGU6IDEwIH0sIHsgbjogNSwgaWR4OiAzLCBtdWx0aXBsZTogMTUgfSwgeyBuOiA1LCBpZHg6IDQsIG11bHRpcGxlOiAyMCB9IF1cbiAgICBUPy5lcSAoIGRiLmFsbF9yb3dzIFNRTFwic2VsZWN0ICogZnJvbSBtdWx0aXBsZXMgb3JkZXIgYnkgbjtcIiApLCBbIHsgbjogMSwgbXVsdGlwbGVzOiAnWzAsMSwyLDMsNCw1LDYsNyw4LDldJyB9LCB7IG46IDIsIG11bHRpcGxlczogJ1swLDIsNCw2LDgsMTAsMTIsMTQsMTYsMThdJyB9LCB7IG46IDMsIG11bHRpcGxlczogJ1swLDMsNiw5LDEyLDE1LDE4LDIxLDI0LDI3XScgfSwgeyBuOiA1LCBtdWx0aXBsZXM6ICdbMCw1LDEwLDE1LDIwXScgfSBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiREJBWS9VREYgdmlldyB3aXRoIFVERlwiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIFQuaGFsdF9vbl9lcnJvcigpXG4gIHsgREJheSB9ICAgICAgICAgID0gcmVxdWlyZSBILmRiYXlfcGF0aFxuICBzY2hlbWEgICAgICAgICAgICA9ICdtYWluJ1xuICB7IHRlbXBsYXRlX3BhdGhcbiAgICB3b3JrX3BhdGggfSAgICAgPSBhd2FpdCBILnByb2N1cmVfZGIgeyBzaXplOiAnbm50JywgcmVmOiAnZm5zcXVhcmV2aWV3JywgfVxuICBkYiAgICAgICAgICAgICAgICA9IG5ldyBEQmF5IHsgcGF0aDogd29ya19wYXRoLCBzY2hlbWEsIH1cbiAgbnVtYmVycyAgICAgICAgICAgPSBkYi5hbGxfZmlyc3RfdmFsdWVzIFNRTFwic2VsZWN0IG4gZnJvbSBubnQgb3JkZXIgYnkgbjtcIlxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRiLmNyZWF0ZV9mdW5jdGlvbiBuYW1lOiAnc3F1YXJlJywgZGV0ZXJtaW5pc3RpYzogdHJ1ZSwgdmFyYXJnczogZmFsc2UsIGNhbGw6ICggbiApIC0+IG4gKiogMlxuICBkYi5leGVjdXRlIFNRTFwiY3JlYXRlIHZpZXcgc3F1YXJlcyBhcyBzZWxlY3Qgbiwgc3F1YXJlKCBuICkgYXMgc3F1YXJlIGZyb20gbm50IG9yZGVyIGJ5IG47XCJcbiAgbWF0Y2hlciA9IFsgMCwgMSwgMi4yNSwgNCwgNS4yODk5OTk5OTk5OTk5OTksIDksIDkuNjEwMDAwMDAwMDAwMDAxLCAxNiwgMjUsIDM2LCA0OSwgNjQsIDgxLCAxMDAsIDEyMSwgMTQ0IF1cbiAgcmVzdWx0ICA9IGRiLmFsbF9yb3dzIFNRTFwic2VsZWN0ICogZnJvbSBzcXVhcmVzO1wiXG4gIGNvbnNvbGUudGFibGUgcmVzdWx0XG4gIHJlc3VsdCAgPSAoIHJvdy5zcXVhcmUgZm9yIHJvdyBpbiByZXN1bHQgKVxuICBkZWJ1ZyAnXjk4NF4nLCByZXN1bHRcbiAgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiYXNzZXJ0aW9ucywgd2FybmluZ3NcIiBdID0gKCBULCBkb25lICkgLT5cbiAgIyBULmhhbHRfb25fZXJyb3IoKVxuICB7IERCYXkgfSAgICAgICAgICA9IHJlcXVpcmUgSC5kYmF5X3BhdGhcbiAgc2NoZW1hICAgICAgICAgICAgPSAnbWFpbidcbiAgeyB0ZW1wbGF0ZV9wYXRoXG4gICAgd29ya19wYXRoIH0gICAgID0gYXdhaXQgSC5wcm9jdXJlX2RiIHsgc2l6ZTogJ25udCcsIHJlZjogJ2Zuc3F1YXJldmlldycsIH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyAtPlxuICAgIGRiICA9IG5ldyBEQmF5IHsgcGF0aDogd29ya19wYXRoLCBzY2hlbWEsIH1cbiAgICBGUyA9IHJlcXVpcmUgJ2ZzJ1xuICAgICMgb3V0cHV0X2ZkID0gRlMub3BlblN5bmMgJy90bXAvbXlzdGRvdXQudHh0JywgJ3cnXG4gICAgZGIuY3JlYXRlX3N0ZGxpYigpXG4gICAgY29uc29sZS50YWJsZSBkYi5hbGxfcm93cyBTUUxcIlwiXCJcbiAgICAgIHdpdGggdjEgYXMgKCBzZWxlY3RcbiAgICAgICAgc3RkX2luZm8oIHQgKSBhcyBpbmZvLFxuICAgICAgICBzdGRfd2Fybl91bmxlc3MoXG4gICAgICAgICAgY291bnQoKikgPiAwLFxuICAgICAgICAgICdeMjczNC0xXiBleHBlY3RlZCBvbmUgb3IgbW9yZSByb3dzLCBnb3QgJyB8fCBjb3VudCgqKSApIGFzIF9tZXNzYWdlXG4gICAgICAgIGZyb20gbm50XG4gICAgICAgIHdoZXJlIHRydWVcbiAgICAgICAgICBhbmQgKCBuICE9IDAgKSApXG4gICAgICBzZWxlY3RcbiAgICAgICAgICAqXG4gICAgICAgIGZyb20gbm50LCB2MVxuICAgICAgICB3aGVyZSB0cnVlXG4gICAgICAgICAgYW5kICggbiAhPSAwICk7XCJcIlwiXG4gICAgY29uc29sZS50YWJsZSBkYi5hbGxfcm93cyBTUUxcIlwiXCJcbiAgICAgIHNlbGVjdFxuICAgICAgICAgICpcbiAgICAgICAgICAsc3RkX3dhcm5fdW5sZXNzKCBjb3VudCgqKSA+IDAsICdeMjczNC0xXiBleHBlY3RlZCBvbmUgb3IgbW9yZSByb3dzLCBnb3QgJyB8fCBjb3VudCgqKSApIGFzIF9tZXNzYWdlXG4gICAgICAgIGZyb20gbm50XG4gICAgICAgIHdoZXJlIHRydWVcbiAgICAgICAgICBhbmQgKCBuICE9IDAgKTtcIlwiXCJcbiAgICBjb25zb2xlLnRhYmxlIGRiLmFsbF9yb3dzIFNRTFwiXCJcIlxuICAgICAgc2VsZWN0XG4gICAgICAgICAgKixcbiAgICAgICAgICBzdGRfd2Fybl91bmxlc3MoIGNvdW50KCopID4gMCwgJ14yNzM0LTJeIGV4cGVjdGVkIG9uZSBvciBtb3JlIHJvd3MsIGdvdCAnIHx8IGNvdW50KCopICkgYXMgX21lc3NhZ2VcbiAgICAgICAgZnJvbSBubnRcbiAgICAgICAgd2hlcmUgdHJ1ZVxuICAgICAgICAgIGFuZCAoIG4gIT0gMCApXG4gICAgICAgICAgYW5kICggdCA9ICdub25leGlzdGFudCcgKTtcIlwiXCJcbiAgICByZXR1cm4gbnVsbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvbmU/KClcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIlhYWFhYWCBhZ2dyZWdhdGUgZnVuY3Rpb25cIiBdID0gKCBULCBkb25lICkgLT5cbiAgIyBULmhhbHRfb25fZXJyb3IoKVxuICB7IERCYXkgfSAgICAgICAgICA9IHJlcXVpcmUgSC5kYmF5X3BhdGhcbiAgc2NoZW1hICAgICAgICAgICAgPSAnbWFpbidcbiAgeyB0ZW1wbGF0ZV9wYXRoXG4gICAgd29ya19wYXRoIH0gICAgID0gYXdhaXQgSC5wcm9jdXJlX2RiIHsgc2l6ZTogJ25udCcsIHJlZjogJ2Zuc3F1YXJldmlldycsIH1cbiAgZGIgICAgICAgICAgICAgICAgPSBuZXcgREJheSB7IHBhdGg6IHdvcmtfcGF0aCwgc2NoZW1hLCB9XG4gIG51bWJlcnMgICAgICAgICAgID0gZGIuYWxsX2ZpcnN0X3ZhbHVlcyBTUUxcInNlbGVjdCBuIGZyb20gbm50IG9yZGVyIGJ5IG47XCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkYi5jcmVhdGVfYWdncmVnYXRlX2Z1bmN0aW9uXG4gICAgbmFtZTogICAgICAgICAgICdwcm9kdWN0J1xuICAgIHN0YXJ0OiAgICAgICAgICAtPiBudWxsXG4gICAgc3RlcDogICAgICAgICAgICggdG90YWwsIGVsZW1lbnQgKSAtPiBkZWJ1ZyAnXjQ0NzZeJywgeyB0b3RhbCwgZWxlbWVudCwgfTsgKCB0b3RhbCA/IDEgKSAqIGVsZW1lbnRcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkYi5jcmVhdGVfYWdncmVnYXRlX2Z1bmN0aW9uXG4gICAgbmFtZTogICAgICAgICAgICdzdGRfa2VlcCdcbiAgICBzdGFydDogICAgICAgICAgMVxuICAgIHN0ZXA6ICAgICAgICAgICAoIHRvdGFsLCBlbGVtZW50ICkgLT4gZGVidWcgJ140NDc2XicsIHsgdG90YWwsIGVsZW1lbnQsIH07ICggdG90YWwgPyAxICkgKiBlbGVtZW50XG4gICAgcmVzdWx0OiAgICAgICAgICggeCApIC0+IGRlYnVnICdeNDQ3Nl4nLCB7IHgsIH07IDQyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgY29uc29sZS50YWJsZSBkYi5hbGxfcm93cyBTUUxcIlwiXCJcbiAgICBzZWxlY3RcbiAgICAgICAgKixcbiAgICAgICAgcHJvZHVjdCggbnVsbCApIGFzIGtlZXBcbiAgICAgIGZyb20gbm50XG4gICAgICB3aGVyZSB0cnVlXG4gICAgICAgIC0tIGFuZCAoIHQgPSAneHh4JyApXG4gICAgICAgIGFuZCAoIG4gIT0gMCApXG4gICAgICA7XG5cbiAgICBcIlwiXCJcbiAgIyBkYi5leGVjdXRlIFNRTFwiY3JlYXRlIHZpZXcgc3F1YXJlcyBhcyBzZWxlY3Qgbiwgc3F1YXJlKCBuICkgYXMgc3F1YXJlIGZyb20gbm50IG9yZGVyIGJ5IG47XCJcbiAgIyBtYXRjaGVyID0gWyAwLCAxLCAyLjI1LCA0LCA1LjI4OTk5OTk5OTk5OTk5OSwgOSwgOS42MTAwMDAwMDAwMDAwMDEsIDE2LCAyNSwgMzYsIDQ5LCA2NCwgODEsIDEwMCwgMTIxLCAxNDQgXVxuICAjIHJlc3VsdCAgPSBkYi5hbGxfcm93cyBTUUxcInNlbGVjdCAqIGZyb20gc3F1YXJlcztcIlxuICAjIGNvbnNvbGUudGFibGUgcmVzdWx0XG4gICMgcmVzdWx0ICA9ICggcm93LnNxdWFyZSBmb3Igcm93IGluIHJlc3VsdCApXG4gICMgZGVidWcgJ145ODReJywgcmVzdWx0XG4gICMgVD8uZXEgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiREJBWS9VREYgdHlwaW5nXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gICMgVC5oYWx0X29uX2Vycm9yKClcbiAgeyBEQmF5IH0gICAgICAgICAgPSByZXF1aXJlIEguZGJheV9wYXRoXG4gIHNjaGVtYSAgICAgICAgICAgID0gJ21haW4nXG4gIHsgdGVtcGxhdGVfcGF0aFxuICAgIHdvcmtfcGF0aCB9ICAgICA9IGF3YWl0IEgucHJvY3VyZV9kYiB7IHNpemU6ICdzbWFsbCcsIHJlZjogJ3R5cGluZycsIH1cbiAgZGIgICAgICAgICAgICAgICAgPSBuZXcgREJheSB7IHBhdGg6IHdvcmtfcGF0aCwgc2NoZW1hLCB9XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyMjIEluICdzaW1wbGUnIGNhc2VzLCB0aGVyZSdzIG1lYW5pbmdmdWwgdHlwZSBpbmZvcm1hdGlvbiBwcmVzZW50OiAjIyNcbiAgc3RhdGVtZW50ID0gZGIucHJlcGFyZSBTUUxcInNlbGVjdCBzdGFtcGVkIGFzIGQgZnJvbSBtYWluO1wiXG4gIGl0ZXJhdG9yICA9IHN0YXRlbWVudC5pdGVyYXRlIFtdXG4gIFsgaXRlcmF0b3IuLi4sIF0gIyMjIE5PVEU6IGNvbnN1bWUgaXRlcmF0b3IgdG8gZnJlZSBjb25uZWN0aW9uICMjI1xuICBkICAgICAgICAgPSAoIFsgZC5uYW1lLCBkLnR5cGUsIF0gZm9yIGQgaW4gc3RhdGVtZW50LmNvbHVtbnMoKSApXG4gIFQ/LmVxIGQsIFsgWyAnZCcsICdib29sZWFuJyBdIF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjIyMgQnV0IGFzIHNvb24gYXMgYW55IG9wZXJhdGlvbiBpcyBkb25lIG9uIGRhdGE6IHRoYXQgdHlwaW5nIGluZm9ybWF0aW9uIHZhbmlzaGVzOiAjIyNcbiAgc3RhdGVtZW50ID0gZGIucHJlcGFyZSBTUUxcInNlbGVjdCAoIHN0YW1wZWQgYW5kIG5vdCBzdGFtcGVkICkgYXMgZCBmcm9tIG1haW47XCJcbiAgaXRlcmF0b3IgID0gc3RhdGVtZW50Lml0ZXJhdGUgW11cbiAgWyBpdGVyYXRvci4uLiwgXSAjIyMgTk9URTogY29uc3VtZSBpdGVyYXRvciB0byBmcmVlIGNvbm5lY3Rpb24gIyMjXG4gIGQgICAgICAgICA9ICggWyBkLm5hbWUsIGQudHlwZSwgXSBmb3IgZCBpbiBzdGF0ZW1lbnQuY29sdW1ucygpIClcbiAgVD8uZXEgZCwgWyBbICdkJywgbnVsbCBdIF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjIyMgV2UgY2FuIGV2ZW4gZXhwbGljaXRseSBjYXN0IHJlc3VsdHMgYnV0IHRoYXQgZG9lcyBub3QgYnJpbmcgYmFjayB0eXBpbmc6ICMjI1xuICBzdGF0ZW1lbnQgPSBkYi5wcmVwYXJlIFNRTFwic2VsZWN0IGNhc3QoIHN0YW1wZWQgYW5kIG5vdCBzdGFtcGVkIGFzIGJvb2xlYW4gKSBhcyBkIGZyb20gbWFpbjtcIlxuICBpdGVyYXRvciAgPSBzdGF0ZW1lbnQuaXRlcmF0ZSBbXVxuICBbIGl0ZXJhdG9yLi4uLCBdICMjIyBOT1RFOiBjb25zdW1lIGl0ZXJhdG9yIHRvIGZyZWUgY29ubmVjdGlvbiAjIyNcbiAgZCAgICAgICAgID0gKCBbIGQubmFtZSwgZC50eXBlLCBdIGZvciBkIGluIHN0YXRlbWVudC5jb2x1bW5zKCkgKVxuICBUPy5lcSBkLCBbIFsgJ2QnLCBudWxsIF0gXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMjIyBXZSBjYW4gZW5mb3JjZSBiZXR0ZXIgdHlwZSBjaGVja2luZyBpbiBTUUxpdGUgYnkgdXNpbmcgYGNoZWNrYCBjb25zdHJhaW50cyBhbmQgVURGczogIyMjXG4gIGFzX2Jvb2xlYW4gPSAoIGQgKSAtPiBpZiBkIHRoZW4gMSBlbHNlIDBcbiAgZGIuY3JlYXRlX2Z1bmN0aW9uIG5hbWU6ICd2YWxpZGF0ZV9pbnRlZ2VyJywgY2FsbDogKCBuICkgLT5cbiAgICBkZWJ1ZyAnXjUzNF4nLCBcInZhbGlkYXRpbmcgI3tycHIgbn1cIlxuICAgIHJldHVybiBhc19ib29sZWFuIHR5cGVzLmlzYS5pbnRlZ2VyIG5cbiAgZGIuZXhlY3V0ZSBTUUxcImNyZWF0ZSB0YWJsZSB4KCBuIGludGVnZXIsIGNoZWNrICggdmFsaWRhdGVfaW50ZWdlciggbiApICkgKTtcIlxuICBkYi5leGVjdXRlIFNRTFwiaW5zZXJ0IGludG8geCAoIG4gKSB2YWx1ZXMgKCA0MiApO1wiOyBUPy5vayB0cnVlXG4gIHRyeSBkYi5leGVjdXRlIFNRTFwiaW5zZXJ0IGludG8geCAoIG4gKSB2YWx1ZXMgKCAxLjIzICk7XCIgY2F0Y2ggZXJyb3IgdGhlbiBUPy5vayBlcnJvci5tZXNzYWdlIGlzIFwiQ0hFQ0sgY29uc3RyYWludCBmYWlsZWQ6IHZhbGlkYXRlX2ludGVnZXIoIG4gKVwiXG4gIHRyeSBkYi5leGVjdXRlIFNRTFwiaW5zZXJ0IGludG8geCAoIG4gKSB2YWx1ZXMgKCAnZm9vYmFyJyApO1wiIGNhdGNoIGVycm9yIHRoZW4gVD8ub2sgZXJyb3IubWVzc2FnZSBpcyBcIkNIRUNLIGNvbnN0cmFpbnQgZmFpbGVkOiB2YWxpZGF0ZV9pbnRlZ2VyKCBuIClcIlxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvbmU/KClcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIkRCQVkvVURGIGNvbmN1cnJlbnQgVURGcyAyXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gIHByZWZpeCAgICAgICAgICAgID0gJ2RjYXRfJ1xuICBzY2hlbWEgICAgICAgICAgICA9ICdtYWluJ1xuICB7IERCYXkgfSAgICAgICAgICA9IHJlcXVpcmUgSC5kYmF5X3BhdGhcbiAgeyB0ZW1wbGF0ZV9wYXRoXG4gICAgd29ya19wYXRoIH0gICAgID0gYXdhaXQgSC5wcm9jdXJlX2RiIHsgc2l6ZTogJ3NtYWxsJywgcmVmOiAnZm5jJywgfVxuICBkZWJ1ZyB7IHRlbXBsYXRlX3BhdGgsIHdvcmtfcGF0aCwgfVxuICBkYiAgICAgICAgICAgICAgICA9IG5ldyBEQmF5IHsgcGF0aDogd29ya19wYXRoLCB9XG4gICMgZGIyICAgICAgICAgICAgICA9IG5ldyBEQmF5KCk7IGRiMi5vcGVuICB7IHNjaGVtYSwgcGF0aDogd29ya19wYXRoLCB9XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgc2VsZWN0X3NxbCAgICAgICAgPSBTUUxcIlwiXCJcbiAgICBzZWxlY3RcbiAgICAgICAgI3tkYi5zcWwuTCBzY2hlbWF9IGFzIHNjaGVtYSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdGJsX25hbWUsXG4gICAgICAgIHJvb3RwYWdlXG4gICAgICBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgIG9yZGVyIGJ5IHJvb3RwYWdlO1wiXCJcIlxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRiLmNyZWF0ZV90YWJsZV9mdW5jdGlvblxuICAgIG5hbWU6ICAgICAgICAgICBwcmVmaXggKyAncmVsdHJpZ3MnXG4gICAgY29sdW1uczogICAgICAgIFsgJ3NjaGVtYScsICd0eXBlJywgJ25hbWUnLCAndGJsX25hbWUnLCAncm9vdHBhZ2UnLCBdXG4gICAgcGFyYW1ldGVyczogICAgIFtdXG4gICAgdmFyYXJnczogICAgICAgIGZhbHNlXG4gICAgZGV0ZXJtaW5pc3RpYzogIGZhbHNlXG4gICAgcm93czogICAgICAgICAgIC0+IHlpZWxkIGZyb20gZGIucXVlcnkgc2VsZWN0X3NxbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHNob3dfZGJfb2JqZWN0cyA9IC0+XG4gICAgY29uc29sZS50YWJsZSBkYi5hbGxfcm93cyBTUUxcIlwiXCJcbiAgICAgIHNlbGVjdFxuICAgICAgICAgICdtYWluJyBhcyBzY2hlbWEsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIHRibF9uYW1lLFxuICAgICAgICAgIHJvb3RwYWdlXG4gICAgICAgIGZyb20gc3FsaXRlX3NjaGVtYVxuICAgICAgICBvcmRlciBieSByb290cGFnZTtcIlwiXCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBjb3VudCA9IDBcbiAgZm9yIHJvdzEgZnJvbSBkYi5xdWVyeSBTUUxcInNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSB3aGVyZSB0eXBlIGluICggJ3RhYmxlJywgJ3ZpZXcnICk7XCJcbiAgICBmb3Igcm93MiBmcm9tIGRiLnF1ZXJ5IFNRTFwic2VsZWN0ICogZnJvbSBwcmFnbWFfdGFibGVfaW5mbyggJG5hbWUgKVwiLCB7IG5hbWU6IHJvdzEubmFtZSwgfVxuICAgICAgY291bnQrK1xuICAgICAgYnJlYWsgaWYgY291bnQgPiA1XG4gICAgICBpbmZvICdeODc1LTFeJywgcm93MlxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGNvdW50ID0gMFxuICBkYi53aXRoX3Vuc2FmZV9tb2RlIC0+XG4gICAgZm9yIHJvdzEgZnJvbSBkYi5xdWVyeSBTUUxcInNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSB3aGVyZSB0eXBlIGluICggJ3RhYmxlJywgJ3ZpZXcnICk7XCJcbiAgICAgIGZvciByb3cyIGZyb20gZGIucXVlcnkgU1FMXCJzZWxlY3QgKiBmcm9tIHByYWdtYV90YWJsZV9pbmZvKCAkbmFtZSApXCIsIHsgbmFtZTogcm93MS5uYW1lLCB9XG4gICAgICAgIGNvdW50KytcbiAgICAgICAgYnJlYWsgaWYgY291bnQgPiA1XG4gICAgICAgIGluZm8gJ144NzUtMV4nLCByb3cyXG4gICAgICAgIGRiLmV4ZWN1dGUgXCJjcmVhdGUgdGFibGUgaWYgbm90IGV4aXN0cyBmb28gKCBuIHRleHQgKTtcIlxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHRyeVxuICAgIGZvciByb3cgZnJvbSBkYi5xdWVyeSBTUUxcInNlbGVjdCAqIGZyb20gZGNhdF9yZWx0cmlncztcIlxuICAgICAgaW5mbyAnXjg3NS0yXicsIHJvd1xuICBjYXRjaCBlcnJvclxuICAgIHdhcm4gQ05ELnJldmVyc2UgJ144NzUtM14nLCBlcnJvci5tZXNzYWdlXG4gICAgVD8uZXEgZXJyb3IubWVzc2FnZSwgXCJUaGlzIGRhdGFiYXNlIGNvbm5lY3Rpb24gaXMgYnVzeSBleGVjdXRpbmcgYSBxdWVyeVwiXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgdHJ5XG4gICAgZGIud2l0aF91bnNhZmVfbW9kZSAtPlxuICAgICAgZm9yIHJvdyBmcm9tIGRiLnF1ZXJ5IFNRTFwic2VsZWN0ICogZnJvbSBkY2F0X3JlbHRyaWdzO1wiXG4gICAgICAgIGluZm8gJ144NzUtNF4nLCByb3dcbiAgY2F0Y2ggZXJyb3JcbiAgICB3YXJuIENORC5yZXZlcnNlICdeODc1LTVeJywgZXJyb3IubWVzc2FnZVxuICAgIFQ/LmVxIGVycm9yLm1lc3NhZ2UsIFwiVGhpcyBkYXRhYmFzZSBjb25uZWN0aW9uIGlzIGJ1c3kgZXhlY3V0aW5nIGEgcXVlcnlcIlxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHNob3dfZGJfb2JqZWN0cygpXG4gIGRvbmU/KClcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICB0ZXN0IEAsIHsgdGltZW91dDogMTBlMywgfVxuICAjIHRlc3QgQFsgXCJEQkFZL1VERiB3aW5kb3cgZnVuY3Rpb25zIGV0Yy5cIiBdXG4gICMgdGVzdCBAWyBcIkRCQVkvVURGIFVzZXItRGVmaW5lZCBXaW5kb3cgRnVuY3Rpb25cIiBdXG4gICMgdGVzdCBAWyBcIkRCQVkvVURGIHZpZXcgd2l0aCBVREZcIiBdXG4gICMgdGVzdCBAWyBcIkRCQVkvVURGIHR5cGluZ1wiIF1cbiAgIyB0ZXN0IEBbIFwiREJBWS9VREYgY29uY3VycmVudCBVREZzIDJcIiBdXG4gICMgQFsgXCJYWFhYWFggYWdncmVnYXRlIGZ1bmN0aW9uXCIgXSgpXG4gICMgQFsgXCJhc3NlcnRpb25zLCB3YXJuaW5nc1wiIF0oKVxuXG5cbiJdfQ==
