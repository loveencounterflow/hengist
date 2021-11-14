(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/WINDOWED-SEARCH.DEMO';

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

  // types                     = new ( require 'intertype' ).Intertype
  // { isa
  //   type_of
  //   validate
  //   validate_list_of }      = types.export()
  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this.demo_1 = function() {
    var DBay, Tbl, db, dtab;
    ({DBay} = require(H.dbay_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    db = new DBay();
    dtab = new Tbl({db});
    db(() => {
      var i, insert, len, part, parts, results, text;
      db(SQL`create table ads (
  nr    integer not null primary key,
  chrs  text    not null,
  nobr  boolean not null,
  br    text );`);
      insert = db.prepare_insert({
        into: 'ads',
        exclude: ['nr']
      });
      text = "The Affirmation";
      text = text.replace(/&shy;/g, '\xad');
      parts = [
        {
          chrs: "T",
          nobr: 0,
          br: null
        },
        {
          chrs: "h",
          nobr: 0,
          br: null
        },
        {
          chrs: "e",
          nobr: 0,
          br: null
        },
        {
          chrs: " ",
          nobr: 0,
          br: null
        },
        {
          chrs: "A",
          nobr: 0,
          br: null
        },
        {
          chrs: "f",
          nobr: 0,
          br: null
        },
        {
          chrs: "f",
          nobr: 1,
          br: null
        },
        {
          chrs: "i",
          nobr: 1,
          br: 'shy'
        },
        {
          chrs: "r",
          nobr: 0,
          br: null
        },
        {
          chrs: "m",
          nobr: 1,
          br: null
        },
        {
          chrs: "a",
          nobr: 0,
          br: null
        },
        {
          chrs: "t",
          nobr: 0,
          br: 'shy'
        },
        {
          chrs: "i",
          nobr: 1,
          br: null
        },
        {
          chrs: "o",
          nobr: 0,
          br: null
        },
        {
          chrs: "n",
          nobr: 0,
          br: null
        }
      ];
      results = [];
      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i];
        results.push(insert.run(part));
      }
      return results;
    });
    //.........................................................................................................
    echo(dtab._tabulate(db(SQL`select * from ads order by nr;`)));
    // echo dtab._tabulate db SQL"""
    //   with v1 as ( select
    //       nr,
    //       chrs,
    //       nobr,
    //       br,
    //       lag( nr ) over () as prv_nr
    //     from ads )
    //   select
    //       nr,
    //       chrs,
    //       case when nobr then lag( prv_nr ) over () else nr end as first_nr_1,
    //       case when nobr then prv_nr else nr end as first_nr_2
    //     from v1
    //     order by nr;"""
    echo(dtab._tabulate(db(SQL`with v1 as ( select
    nr,
    chrs,
    nobr,
    dense_rank() over ( partition by nobr order by nr ) as rank,
    case when lead( nobr ) over ( order by nr ) = nobr then lag( nr ) over ( order by nr ) else
      nr end as group_nr,
    -- first_value( nr ) over ( partition by nobr order by nr ) as group_nr,
    br
  from ads )
select * from v1
order by nr;`)));
    echo(dtab._tabulate(db(SQL`with v1 as ( select
    nr,
    chrs,
    nobr,
    lead( nobr ) over ( order by nr ) as nxt_nobr,
    br
  from ads ),
v2 as ( select
    *,
    dense_rank() over ( order by nr ) - nr as group_id
  from v1
  where nobr or nxt_nobr
  )
select
    * -- first_value( nr )
  from v2
  order by nr;`)));
    //.........................................................................................................
    // echo dtab._tabulate db SQL"""
    //   with v1 as ( select
    //       dense_rank() over ( order by nr, nobr ) - nr as group_id,
    //       nr
    //     from ads )
    //   select
    //       min( group_id ) as nr_1,
    //       max( group_id ) as nr_2
    //     from v1
    //     group by group_id
    //     -- where br = 'shy'
    //     order by nr;"""
    // #.........................................................................................................
    // echo dtab._tabulate db SQL"""
    //   select
    //       nr                                                  as nr_0,
    //       chrs                                                as chrs_0,
    //       nobr                                                as nobr_0,
    //       rank() over ( partition by nobr order by nr ) as nobr_x,
    //       -- case when nobr then lag( nr, 1 ) over () else null end as yyy,
    //       case when nobr then first_value( nr ) over ( partition by br, nobr order by nr ) - 1 else nr end as zzz,
    //       br                                                  as br_0
    //       -- row_number() over ( partition by nobr order by nr ) as xxx
    //     from ads
    //     -- where br = 'shy'
    //     order by nr;"""
    // #.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_2 = function() {
    var DBay, Tbl, db, dtab;
    ({DBay} = require(H.dbay_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    db = new DBay();
    dtab = new Tbl({db});
    db(() => {
      return db(SQL`create table t1(
    a integer primary key,
    b,
    c,
    nobr boolean );
insert into t1 values
  (1, 'a', 'one',   0,  ),
  (2, 'b', 'two',   0,  ),
  (3, 'c', 'three', 0,  ),
  (4, 'd', 'one',   1,  ),
  (5, 'e', 'two',   0,  ),
  (6, 'f', 'three', 0,  ),
  (7, 'g', 'one',   0,  );`);
    });
    //.........................................................................................................
    echo(dtab._tabulate(db(SQL`select * from t1 order by 1, 2, 3;`)));
    echo(dtab._tabulate(db(SQL`select
    b                               as b,
    lead( b, 2, 'n/a' )     over w1 as lead,
    lag( b )                over w1 as lag,
    first_value( b )        over w1 as first_value,
    last_value( b )         over w1 as last_value,
    nth_value( b, 3 )       over w1 as nth_value_3
  from t1
  window w1 as (
    order by b
    rows between unbounded preceding and current row );`)));
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_1();
    })();
  }

  // @demo_2()

}).call(this);

//# sourceMappingURL=windowed-search-demo.js.map