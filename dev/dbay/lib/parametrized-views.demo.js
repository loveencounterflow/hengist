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
  this.demo_2 = function() {
    var DBay, Tbl, cities, db, dtab, get_var, path, v;
    ({DBay} = require(H.dbay_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    path = '/dev/shm/cities.sqlite';
    db = new DBay({path});
    dtab = new Tbl({db});
    v = {
      city: null
    };
    cities = require('../../../assets/german-cities.json');
    //.........................................................................................................
    db.create_function({
      name: 'euclidean_distance',
      deterministic: true,
      call: (x1, y1, x2, y2) => {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
      }
    });
    //.........................................................................................................
    get_var = (name) => {
      var R;
      if ((R = v[name]) == null) {
        throw new Error(`value not set: ${rpr(name)}`);
      }
      switch (false) {
        case R !== true:
          return 1;
        case R !== false:
          return 0;
        default:
          return R;
      }
    };
    //.........................................................................................................
    db.create_function({
      name: 'get_var',
      deterministic: false,
      call: get_var
    });
    //.........................................................................................................
    db.create_table_function({
      name: 'variables',
      deterministic: false,
      columns: ['name', 'value'],
      parameters: [],
      rows: function*(name) {
        var results;
        results = [];
        for (name in v) {
          results.push((yield [name, get_var(name)]));
        }
        return results;
      }
    });
    //.........................................................................................................
    db(() => {
      return db(SQL`drop view   if exists distance_from_current_city;
drop view   if exists current_city;
drop table  if exists cities;
create table cities(
    city text not null primary key,
    lat float not null,
    lng float not null,
    x float generated always as ( lat * 111 ) virtual,
    y float generated always as ( lng *  85 ) virtual );
create view current_city as select * from cities where city = get_var( 'city' );
create view distance_from_current_city as
  with v1 as ( select * from cities where city = get_var( 'city' ) limit 1 )
  select
    v1.city                                     as city_from,
    c.city                                      as city_to,
    -- c.lat ,
    -- c.lng,
    -- c.x,
    -- c.y,
    euclidean_distance( c.x, c.y, v1.x, v1.y )  as distance
  from cities as c, v1
  where city_from != city_to`);
    });
    //.........................................................................................................
    db(() => {
      var city, error, i, insert_city, len, results;
      insert_city = db.prepare_insert({
        into: 'cities'
      });
      results = [];
      for (i = 0, len = cities.length; i < len; i++) {
        city = cities[i];
        try {
          results.push(insert_city.run(city));
        } catch (error1) {
          error = error1;
          results.push(warn(error.message, rpr(city.city)));
        }
      }
      return results;
    });
    //.........................................................................................................
    echo(dtab._tabulate(db(SQL`select * from cities order by city limit 10;`)));
    v.city = 'Bremen';
    echo(dtab._tabulate(db(SQL`select get_var( 'city' ) as city;`)));
    echo(dtab._tabulate(db(SQL`select * from current_city;`)));
    echo(dtab._tabulate(db(SQL`select * from distance_from_current_city where distance < 50 order by distance;`)));
    v.x = 20;
    v.n = 123.4567890123456789;
    v.foo = 'bar';
    v.baz = true;
    v.sqrt2 = Math.sqrt(2);
    echo(dtab._tabulate(db(SQL`select * from variables();`)));
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_2();
    })();
  }

}).call(this);

//# sourceMappingURL=parametrized-views.demo.js.map