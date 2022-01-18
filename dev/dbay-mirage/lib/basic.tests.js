(function() {
  'use strict';
  var CND, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE/BASICS';

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

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["mrg.refresh_datasource"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'sp';
    path = 'short-proposal.mkts.md';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    (() => {      //.........................................................................................................
      var result;
      result = mrg.refresh_datasource({dsk});
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 1,
        bytes: 384
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      result = mrg.refresh_datasource({dsk});
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 0,
        bytes: 0
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      mrg._update_digest(dsk, null);
      result = mrg.refresh_datasource({dsk});
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 1,
        bytes: 384
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      result = mrg.refresh_datasource({
        dsk,
        force: true
      });
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 1,
        bytes: 384
      }) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["altering mirrored source lines causes error"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path, rows_after, rows_before;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    rows_before = db.all_rows(SQL`select * from mrg_mirror order by dsk, oln, trk, pce;`);
    console.table(rows_before);
    (() => {      //.........................................................................................................
      var error;
      error = null;
      try {
        db(SQL`insert into mrg_mirror
( dsk, oln, trk, pce, txt )
values ( $dsk, $oln, $trk, $pce, $txt )`, {
          dsk: dsk,
          oln: 10,
          trk: 1,
          pce: 0,
          txt: "some text"
        });
      } catch (error1) {
        error = error1;
        warn(CND.reverse(error.message));
        if (!/not allowed to modify table mrg_mirror/.test(error.message)) {
          throw error;
        }
        if (T != null) {
          T.ok(true);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    //.........................................................................................................
    rows_after = db.all_rows(SQL`select * from mrg_mirror order by dsk, oln, trk, pce;`);
    console.table(rows_after);
    // debug types.equals rows_before, rows_after
    if (T != null) {
      T.eq(rows_before, rows_after);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["URL/path conversion"] = async function(T, done) {
    var DBay, Mrg, db, error, i, len, matcher, mrg, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    probes_and_matchers = [['/foo.txt', ['file:///foo.txt', '/foo.txt'], null], ['/foo.txt', ['file:///foo.txt', '/foo.txt'], null], ['/some weird path.jpg', ['file:///some%20weird%20path.jpg', '/some weird path.jpg'], null], ['/some weird path.jpg#oops', ['file:///some%20weird%20path.jpg%23oops', '/some weird path.jpg#oops'], null], ['/path/with/folders/to/file.txt', ['file:///path/with/folders/to/file.txt', '/path/with/folders/to/file.txt'], null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var path, url;
          url = mrg._url_from_path(probe);
          path = mrg._path_from_url(url);
          // urge { probe, url, path, }
          return resolve([url, path]);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "altering mirrored source lines causes error" ]
// @[ "altering mirrored source lines causes error" ]()

}).call(this);

//# sourceMappingURL=basic.tests.js.map