(function() {
  'use strict';
  var CND, ICQL, PATH, VNR, assign, badge, cast, debug, declare, echo, help, info, isa, jr, provide_VNR, rpr, size_of, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL/EXPERIMENTS/VNR';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  // PATH                      = require 'path'
  // PD                        = require 'pipedreams'
  // { $
  //   $async
  //   select }                = PD
  ({assign, jr} = CND);

  //...........................................................................................................
  this.types = require('../types');

  ({isa, validate, cast, declare, size_of, type_of} = this.types);

  ICQL = require('../..');

  //-----------------------------------------------------------------------------------------------------------
  PATH = require('path');

  this.cwd_abspath = CND.cwd_abspath;

  this.cwd_relpath = CND.cwd_relpath;

  this.here_abspath = CND.here_abspath;

  this._drop_extension = (path) => {
    return path.slice(0, path.length - (PATH.extname(path)).length);
  };

  this.project_abspath = (...P) => {
    return CND.here_abspath(__dirname, '../..', ...P);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.get_icql_settings = function() {
    var R;
    R = {
      connector: require('better-sqlite3'),
      db_path: '/tmp/icql.db',
      icql_path: this.project_abspath('src/experiments/vnr.icql')
    };
    // clear:        true
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_casts = function() {
    var c, db, i, len, ref, row, rows, statement;
    db = ICQL.bind(this.get_icql_settings());
    db.$.clear();
    // urge 'µ33092', jr db.$.all_rows db.read_sqlite_master()
    db.create_demo_table();
    // urge 'µ33092', jr db.$.all_rows db.read_sqlite_master()
    db.create_myview();
    // db.create_trigger_on_master()
    // urge 'µ33092', jr db.$.all_rows db.read_sqlite_master()
    //---------------------------------------------------------------------------------------------------------
    // types = db.$.column_types 'mytable'
    // insert_into_mytable =
    rows = [
      {
        vnr: 'x',
        bytes: 'x',
        n: 'x',
        is_great: 'x',
        something: 'x'
      },
      {
        vnr: 'x',
        bytes: 1,
        n: 'x',
        is_great: 'x',
        something: 'x'
      }
    ];
// { vnr: 'x', bytes: true, n: 'x', is_great: 'x', something: 'x', }
    for (i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      db.insert_into_mytable(row);
    }
    ref = db.read_mytable();
    //---------------------------------------------------------------------------------------------------------
    for (row of ref) {
      info(jr(row));
    }
    debug(db.$.column_types('mytable'));
    debug(db.$.column_types('myview'));
    debug(cast.boolean('number', true));
    debug(cast.boolean('number', false));
    //---------------------------------------------------------------------------------------------------------
    statement = db.$.prepare("select * from mytable limit 0;");
    help(jr((function() {
      var j, len1, ref1, results;
      ref1 = statement.columns();
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        c = ref1[j];
        results.push(`${c.name}: ${c.type}`);
      }
      return results;
    })()));
    statement = db.$.prepare("select * from myview limit 0;");
    help(jr((function() {
      var j, len1, ref1, results;
      ref1 = statement.columns();
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        c = ref1[j];
        results.push(`${c.name}: ${rpr(c.type)}`);
      }
      return results;
    })()));
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  provide_VNR = function() {
    var HOLLERITH;
    HOLLERITH = require('hollerith-codec');
    //-----------------------------------------------------------------------------------------------------------
    this.deepen = function(vnr, start = 0) {
      validate.vnr(vnr);
      return vnr.push(start);
    };
    //-----------------------------------------------------------------------------------------------------------
    this.advance = function(vnr) {
      validate.vnr(vnr);
      vnr[vnr.length - 1]++;
      return vnr;
    };
    //-----------------------------------------------------------------------------------------------------------
    this.encode = function(vnr) {
      validate.vnr(vnr);
      return HOLLERITH.encode(R.vnr);
    };
    //-----------------------------------------------------------------------------------------------------------
    this.decode = function(buffer) {
      validate.buffer(buffer);
      return HOLLERITH.decode(buffer);
    };
    return this;
  };

  VNR = provide_VNR.apply({});

  //-----------------------------------------------------------------------------------------------------------
  this.demo_vnr = function() {
    var HOLLERITH, db, i, len, ref, row, rows;
    HOLLERITH = require('hollerith-codec');
    db = ICQL.bind(this.get_icql_settings());
    db.$.clear();
    db.create_vnrtable();
    // debug 'µ44433', @types.specs
    //.........................................................................................................
    db.insert_into_vnrtable = function(Q) {
      var R;
      validate.vnr(Q.vnr);
      R = assign({}, Q);
      R.vnr_blob = HOLLERITH.encode(R.vnr);
      R.vnr = jr(R.vnr);
      R.is_stamped = cast.boolean('number', R.is_stamped);
      return this._insert_into_vnrtable(R);
    };
    //.........................................................................................................
    db.read_vnrtable = function*() {
      var R, ref, results;
      ref = this._read_vnrtable();
      results = [];
      for (R of ref) {
        R.vnr_blob = R.vnr_blob.toString('hex');
        R.vnr = JSON.parse(R.vnr);
        R.is_stamped = cast.number('boolean', R.is_stamped);
        results.push((yield R));
      }
      return results;
    };
    //.........................................................................................................
    rows = [
      {
        vnr: [-1],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [-10],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [-2],
        is_stamped: false,
        text: "some text"
      },
      {
        vnr: [-20],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [0],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [1],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10,
      -1],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10,
      -2],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10,
      0],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10,
      1],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10,
      2],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [10,
      10],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [12],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [2],
        is_stamped: true,
        text: "some text"
      },
      {
        vnr: [20],
        is_stamped: true,
        text: "some text"
      }
    ];
    for (i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      // delete db.vnr_blob
      db.insert_into_vnrtable(row);
    }
    ref = db.read_vnrtable();
    //.........................................................................................................
    for (row of ref) {
      // delete row.vnr_blob
      info(jr(row));
    }
    return null;
  };

  //###########################################################################################################
  if (module.parent == null) {
    (async() => {
      // await @demo_casts()
      return (await this.demo_vnr());
    })();
  }

}).call(this);

//# sourceMappingURL=vnr.js.map