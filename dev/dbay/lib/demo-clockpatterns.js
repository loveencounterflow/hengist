(function() {
  'use strict';
  var CND, FS, GUY, H, PATH, badge, debug, echo, equals, freeze, help, info, isa, lets, raw, rpr, tabulate, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  /*

  * [*A number NOBODY has thought of - Numberphile*](https://youtu.be/KdZrxkix9Mk?t=423)
  * [*Frequency of occurrence of numbers in the World Wide Web* (Dorogovtsev
    &al)](https://www.researchgate.net/publication/2172850_Frequency_of_occurrence_of_numbers_in_the_World_Wide_Web)

   */
  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE/DEMO';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  GUY = require('../../../apps/guy');

  // { HDML }                  = require '../../../apps/hdml'
  H = require('../../../lib/helpers');

  ({lets, freeze} = GUY.lft);

  ({to_width} = require('to-width'));

  ({raw} = String);

  //-----------------------------------------------------------------------------------------------------------
  tabulate = function(db, query) {
    return H.tabulate(query, db(query));
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_clockpatterns = function(cfg) {
    var DBay, SQL, db, functions, nbool, path;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    path = '/tmp/clockpatterns.sqlite';
    db = new DBay({path});
    functions = {};
    nbool = function(bool) {
      switch (bool) {
        case true:
          return 1;
        case false:
          return 0;
        default:
          throw new Error(`^345^ expected a boolean, got a ${type_of(bool)}`);
      }
    };
    db.create_stdlib();
    //---------------------------------------------------------------------------------------------------------
    db(function() {
      //.......................................................................................................
      db.create_function({
        name: 'digits_from_time',
        call: function(time) {
          var d;
          return JSON.stringify((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = time.length; i < len; i++) {
              d = time[i];
              if (d !== ':') {
                results.push(parseInt(d, 10));
              }
            }
            return results;
          })());
        }
      });
      db.create_function({
        name: 'call',
        call: function(name, time, digits) {
          return functions[name](time, ...(JSON.parse(digits)));
        }
      });
      //.......................................................................................................
      db(SQL`drop table if exists times;
create table times (
  nr      integer not null primary key,
  time    text not null unique,
  digits  json not null generated always as ( digits_from_time( time ) ) virtual,
  check ( std_re_is_match( time, '^([01][0-9]|2[0-3]):[0-5][0-9]$' ) ) );`);
      //.......................................................................................................
      return db(SQL`drop table if exists patterns;
  create table patterns (
  nr      integer not null primary key,
  name    text not null unique,
  pattern text unique,
  kind    text not null,
  check ( length( pattern ) > 0 ),
  check ( kind in ( 're', 'fn' ) ) );`);
    });
    // insert_time.run { time: '24:30', }
    // insert_time.run { time: '25:10', }
    //---------------------------------------------------------------------------------------------------------
    db(function() {
      var hour, hour_str, i, insert_time, minute, results, time;
      insert_time = db.prepare_insert({
        into: 'times',
        exclude: ['nr'],
        returning: '*'
      });
      results = [];
      for (hour = i = 0; i <= 23; hour = ++i) {
        hour_str = hour.toString().padStart(2, '0');
        results.push((function() {
          var j, results1;
          results1 = [];
          for (minute = j = 0; j <= 59; minute = ++j) {
            time = hour_str + ':' + minute.toString().padStart(2, '0');
            results1.push(insert_time.run({time}));
          }
          return results1;
        })());
      }
      return results;
    });
    //---------------------------------------------------------------------------------------------------------
    db(function() {
      var insert_pattern;
      functions.asc = function(time, d1, d2, d3, d4) {
        return nbool(((d1 < d2 && d2 < d3) && d3 < d4));
      };
      functions.inc4 = function(time, d1, d2, d3, d4) {
        var ref, ref1;
        return nbool(((d1 === (ref1 = d2 - 1) && ref1 === (ref = d3 - 2)) && ref === d4 - 3));
      };
      functions.dec4 = function(time, d1, d2, d3, d4) {
        var ref, ref1;
        return nbool(((d1 === (ref1 = d2 + 1) && ref1 === (ref = d3 + 2)) && ref === d4 + 3));
      };
      functions.dec3a = function(time, d1, d2, d3, d4) {
        var ref;
        return nbool((d1 === (ref = d2 + 1) && ref === d3 + 2));
      };
      functions.dec3b = function(time, d1, d2, d3, d4) {
        var ref;
        return nbool((d2 === (ref = d3 + 1) && ref === d4 + 2));
      };
      functions.inc3a = function(time, d1, d2, d3, d4) {
        var ref;
        return nbool((d1 === (ref = d2 - 1) && ref === d3 - 2));
      };
      functions.inc3b = function(time, d1, d2, d3, d4) {
        var ref;
        return nbool((d2 === (ref = d3 - 1) && ref === d4 - 2));
      };
      // functions.hism = ( time, d1, d2, d3, d4 ) -> nbool ( d1 is d2 - 1 is d3 - 2 ) or ( d2 is d3 - 1 is d4 - 2 )
      insert_pattern = db.prepare_insert({
        into: 'patterns',
        exclude: ['nr'],
        returning: '*'
      });
      insert_pattern.run({
        kind: 're',
        name: 'all4',
        pattern: raw`(?<d>\d)\k<d>:\k<d>\k<d>`
      });
      insert_pattern.run({
        kind: 're',
        name: 'hism',
        pattern: raw`(?<dd>\d\d):\k<dd>`
      });
      insert_pattern.run({
        kind: 're',
        name: 'pal',
        pattern: raw`(?<d1>\d)(?<d2>\d):\k<d2>\k<d1>`
      });
      // insert_pattern.run { kind: 'fn', pattern: 'asc',    }
      insert_pattern.run({
        kind: 'fn',
        name: 'inc4',
        pattern: null
      });
      insert_pattern.run({
        kind: 'fn',
        name: 'dec4',
        pattern: null
      });
      insert_pattern.run({
        kind: 'fn',
        name: 'dec3a',
        pattern: null
      });
      insert_pattern.run({
        kind: 'fn',
        name: 'dec3b',
        pattern: null
      });
      insert_pattern.run({
        kind: 'fn',
        name: 'inc3a',
        pattern: null
      });
      return insert_pattern.run({
        kind: 'fn',
        name: 'inc3b',
        pattern: null
      });
    });
    //.........................................................................................................
    tabulate(db, SQL`select * from times limit 25 offset 123;`);
    tabulate(db, SQL`select * from patterns order by kind, name;`);
    tabulate(db, SQL`-- with v1 as ( select * from times where time between '11:00' and '11:59' )
with
  v1 as ( select * from times where time between '00:00' and '23:59' ),
  v2 as ( select count(*) as count from v1 )
select
    row_number() over ( order by v1.time, p.nr )        as match_nr,
    v1.nr                                               as time_nr,
    p.nr                                                as pattern_nr,
    p.kind                                              as kind,
    p.name                                              as name,
    v2.count                                            as count,
    v1.digits                                           as digits,
    v1.time                                             as time
  from v1, v2, patterns as p
  where case p.kind
    when 're' then std_re_is_match( v1.time, pattern )
    when 'fn' then call( p.name, time, digits )
    else std_raise( 'unknown kind ' || quote( p.kind ) ) end
  order by name, time
    ;`);
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.demo_clockpatterns();
    })();
  }

  /*

Adjacent 3 equal
binary (only 0 and 1)

*/

}).call(this);

//# sourceMappingURL=demo-clockpatterns.js.map