(function() {
  'use strict';
  var CND, FS, GUY, H, PATH, badge, debug, echo, equals, freeze, help, info, isa, lets, raw, rpr, tabulate, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/DEMO';

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
  this.demo_datetime = function(cfg) {
    /* https://day.js.org */
    var DBay, SQL, dayjs, db;
    dayjs = require('dayjs');
    (() => {
      var relativeTime, toObject, utc;
      utc = require('dayjs/plugin/utc');
      dayjs.extend(utc);
      relativeTime = require('dayjs/plugin/relativeTime');
      dayjs.extend(relativeTime);
      toObject = require('dayjs/plugin/toObject');
      return dayjs.extend(toObject);
    })();
    //.........................................................................................................
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    db = new DBay();
    db.create_stdlib();
    // #---------------------------------------------------------------------------------------------------------
    // db ->
    //   #.......................................................................................................
    //   db.create_function
    //     name:     'digits_from_time'
    //     call:     ( time ) -> JSON.stringify ( parseInt d, 10 for d in time when d isnt ':' )
    //   #.......................................................................................................
    //   db SQL"""
    //     drop table if exists times;
    //     create table times (
    //       nr      integer not null primary key,
    //       time    text not null unique,
    //       digits  json not null generated always as ( digits_from_time( time ) ) virtual,
    //       check ( std_re_is_match( time, '^([01][0-9]|2[0-3]):[0-5][0-9]$' ) ) );"""
    //---------------------------------------------------------------------------------------------------------
    db(function() {
      tabulate(db, SQL`select date(     1092941466, 'auto', 'utc' ) as date;`);
      tabulate(db, SQL`select time(     1092941466, 'auto', 'utc' ) as time;`);
      tabulate(db, SQL`select datetime( 1092941466, 'auto', 'utc' ) as datetime;`);
      debug('^45354-1^', dayjs().format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-2^', dayjs().utc().format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-3^', (dayjs('2022-01-01,18:30')).format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-4^', (dayjs('2022-01-01,18:30')).utc().format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-5^', dayjs.utc('2022-01-01,18:30').format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-6^', dayjs.utc('2022-01-01,18:30').fromNow());
      debug('^45354-7^', dayjs.utc('2023-01-01,18:30').fromNow());
      debug('^45354-8^', dayjs.utc('2022-01-01,18:30:00Z').format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-9^', dayjs.utc('2022-01-01,18:30:00Z Mon').format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^45354-10^', dayjs().toISOString());
      debug('^45354-11^', dayjs().utc().toISOString());
      debug('^45354-12^', dayjs().toObject());
      return debug('^45354-13^', dayjs().utc().toObject());
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_stdlib_api_pre = function(cfg) {
    /* https://day.js.org */
    var DBay, SQL, create_stdlib, dayjs, db;
    dayjs = require('dayjs');
    (() => {
      var relativeTime, toObject, utc;
      utc = require('dayjs/plugin/utc');
      dayjs.extend(utc);
      relativeTime = require('dayjs/plugin/relativeTime');
      dayjs.extend(relativeTime);
      toObject = require('dayjs/plugin/toObject');
      return dayjs.extend(toObject);
    })();
    //.........................................................................................................
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    db = new DBay();
    db.create_stdlib();
    db.types.declare('dbay_dt_valid_dayjs', {
      tests: {
        "( @type_of x ) is 'm'": function(x) {
          return (this.type_of(x)) === 'm';
        },
        "@isa.float x.$y": function(x) {
          return this.isa.float(x.$y);
        },
        "@isa.float x.$M": function(x) {
          return this.isa.float(x.$M);
        },
        "@isa.float x.$D": function(x) {
          return this.isa.float(x.$D);
        },
        "@isa.float x.$W": function(x) {
          return this.isa.float(x.$W);
        },
        "@isa.float x.$H": function(x) {
          return this.isa.float(x.$H);
        },
        "@isa.float x.$m": function(x) {
          return this.isa.float(x.$m);
        },
        "@isa.float x.$s": function(x) {
          return this.isa.float(x.$s);
        },
        "@isa.float x.$ms": function(x) {
          return this.isa.float(x.$ms);
        }
      }
    });
    //---------------------------------------------------------------------------------------------------------
    create_stdlib = function() {
      var DBay_timestamp_template, prefix;
      DBay_timestamp_template = 'YYYY-MM-DD,HH:mm:ss[Z]';
      prefix = 'std_';
      //-------------------------------------------------------------------------------------------------------
      this.create_function({
        /* Returns a DBay_timestamp representing the present point in time. */
        name: prefix + 'dt_now',
        deterministic: false,
        varargs: false,
        call: () => {
          return dayjs().utc().format(DBay_timestamp_template);
        }
      });
      //-------------------------------------------------------------------------------------------------------
      this.create_function({
        /* Given a DBay_timestamp, returns an English human-readable text indicating the remoteness of that
             time relative to now, like 'four minutes ago' or 'in a week'. */
        name: prefix + 'dt_from_now',
        deterministic: false,
        varargs: false,
        call: (dt) => {
          return (dayjs().utc(dt)).fromNow();
        }
      });
      //-------------------------------------------------------------------------------------------------------
      return this.dt_parse = function(dbay_timestamp) {
        var R;
        if (!/^\d\d\d\d-\d\d-\d\d,\d\d:\d\d:\d\dZ$/.test(dbay_timestamp)) {
          throw new Error(`not a valid dbay_timestamp: ${rpr(dbay_timestamp)}`);
        }
        R = dayjs.utc(dbay_timestamp);
        if (!this.types.isa.dbay_dt_valid_dayjs(R)) {
          throw new Error(`not a valid dbay_timestamp: ${rpr(dbay_timestamp)}`);
        }
        return R;
      };
    };
    //---------------------------------------------------------------------------------------------------------
    create_stdlib.apply(db);
    db(function() {
      // tabulate db, SQL"""select date(     1092941466, 'auto', 'utc' ) as date;"""
      // tabulate db, SQL"""select time(     1092941466, 'auto', 'utc' ) as time;"""
      // tabulate db, SQL"""select datetime( 1092941466, 'auto', 'utc' ) as datetime;"""
      debug('^453-1^', dayjs().format('YYYY-MM-DD,HH:mm:ss[Z]'));
      tabulate(db, SQL`select std_dt_now() as dt;`);
      debug('^453-2^', dayjs().utc().format('YYYY-MM-DD,HH:mm:ss[Z]'));
      debug('^453-3^', db.dt_parse('2022-01-01,18:30:00Z'));
      return debug('^453-3^', db.dt_parse('2022-01-01,18:30:99Z'));
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_dayjs_parse_custom_format = function() {
    var dayjs;
    dayjs = require('dayjs');
    (() => {
      var customParseFormat, relativeTime, toObject, utc;
      utc = require('dayjs/plugin/utc');
      dayjs.extend(utc);
      relativeTime = require('dayjs/plugin/relativeTime');
      dayjs.extend(relativeTime);
      toObject = require('dayjs/plugin/toObject');
      dayjs.extend(toObject);
      customParseFormat = require('dayjs/plugin/customParseFormat');
      return dayjs.extend(customParseFormat);
    })();
    debug('^34534534^', dayjs('19951225-123456Z', 'YYYYMMDD-HHmmssZ'));
    debug('^34534534^', (dayjs('19951225-123456Z', 'YYYYMMDD-HHmmssZ')).toISOString());
    debug('^34534534^', dayjs('20220101-123456Z', 'YYYYMMDD-HHmmssZ'));
    debug('^34534534^', (dayjs('20220101-123456Z', 'YYYYMMDD-HHmmssZ')).toISOString());
    debug('^34534534^', dayjs().utc().format('YYYYMMDD-HHmmssZ'));
    debug('^34534534^', dayjs().utc().format('YYYYMMDD-HHmmss[Z]'));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_stdlib_api = function(cfg) {
    var DBay, SQL, db;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    db = new DBay();
    db.create_stdlib();
    //---------------------------------------------------------------------------------------------------------
    db(function() {
      debug('^34534^', db.dt_now());
      debug('^34534^', db.dt_from_now('20220101-183000Z'));
      tabulate(db, SQL`select std_dt_now() as date;`);
      tabulate(db, SQL`select std_dt_from_now( '20220101-183000Z' ) as date;`);
      debug('^34534^', db.dt_format(db.dt_now(), 'YYYYMMDD-HHmmssZ'));
      return debug('^34534^', db.dt_format(db.dt_now(), 'YYYY-MM-DD HH:mm UTC'));
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_dayjs_duration = function() {
    var DBay, dayjs;
    ({DBay} = require('../../../apps/dbay'));
    debug('^353453^', DBay._dayjs);
    debug('^353453^', (new DBay())._dayjs);
    dayjs = require('dayjs');
    (() => {
      var customParseFormat, duration, relativeTime, toObject, utc;
      utc = require('dayjs/plugin/utc');
      dayjs.extend(utc);
      relativeTime = require('dayjs/plugin/relativeTime');
      dayjs.extend(relativeTime);
      toObject = require('dayjs/plugin/toObject');
      dayjs.extend(toObject);
      customParseFormat = require('dayjs/plugin/customParseFormat');
      dayjs.extend(customParseFormat);
      duration = require('dayjs/plugin/duration');
      return dayjs.extend(duration);
    })();
    help('^45323^', (dayjs.duration({
      hours: 1
    })).asSeconds());
    help('^45323^', (dayjs.duration({
      minutes: 1
    })).asSeconds());
    help('^45323^', (dayjs.duration({
      minutes: -1
    })).asSeconds());
    // help '^45323^', ( dayjs.duration "1 minute" ).asSeconds()
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @demo_datetime()
      return this.demo_stdlib_api();
    })();
  }

  // @demo_dayjs_parse_custom_format()
// @demo_dayjs_duration()

}).call(this);

//# sourceMappingURL=demo-datetime.js.map