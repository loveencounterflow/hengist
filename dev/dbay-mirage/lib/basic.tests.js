(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this["mrg.refresh_datasource"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path, prefix;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'sp';
    path = 'short-proposal.mkts.md';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    ({prefix} = mrg.cfg);
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
    //.........................................................................................................
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror order by dsk, oln, trk, pce;`));
    H.tabulate(`${prefix}_raw_mirror`, db(SQL`select * from ${prefix}_raw_mirror order by dsk, oln, trk, pce;`));
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
( dsk, oln, trk, pce )
values ( $dsk, $oln, $trk, $pce )`, {
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

  // @[ "mrg.refresh_datasource" ]()
// test @[ "mrg.refresh_datasource" ]
// @[ "altering mirrored source lines causes error" ]()
// test @[ "altering mirrored source lines causes error" ]

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Jhc2ljLnRlc3RzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsRUFBQSxPQUFBOzs7RUFJQSxHQUFBLEdBQTRCLE9BQUEsQ0FBUSxLQUFSOztFQUM1QixHQUFBLEdBQTRCLEdBQUcsQ0FBQzs7RUFDaEMsS0FBQSxHQUE0Qjs7RUFDNUIsS0FBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE9BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixPQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsU0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQVQsQ0FBYyxHQUFkLEVBYjVCOzs7RUFlQSxJQUFBLEdBQTRCLE9BQUEsQ0FBUSx3QkFBUjs7RUFDNUIsSUFBQSxHQUE0QixPQUFBLENBQVEsTUFBUixFQWhCNUI7OztFQWtCQSxLQUFBLEdBQTRCLElBQUksQ0FBRSxPQUFBLENBQVEsV0FBUixDQUFGLENBQXVCLENBQUMsU0FBNUIsQ0FBQTs7RUFDNUIsQ0FBQSxDQUFFLEdBQUYsRUFDRSxNQURGLEVBRUUsT0FGRixFQUdFLFFBSEYsRUFJRSxnQkFKRixDQUFBLEdBSTRCLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FKNUI7O0VBS0EsR0FBQSxHQUE0QixNQUFNLENBQUM7O0VBQ25DLEdBQUEsR0FBNEIsT0FBQSxDQUFRLG1CQUFSOztFQUM1QixDQUFBLEdBQTRCLE9BQUEsQ0FBUSxzQkFBUixFQTFCNUI7OztFQStCQSxJQUFDLENBQUUsd0JBQUYsQ0FBRCxHQUFnQyxRQUFBLENBQUUsQ0FBRixFQUFLLElBQUwsQ0FBQTtBQUNoQyxRQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUE7O0lBQ0UsQ0FBQSxDQUFFLElBQUYsQ0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQUFkO0lBQ0EsQ0FBQSxDQUFFLEdBQUYsQ0FBQSxHQUFjLE9BQUEsQ0FBUSwyQkFBUixDQUFkO0lBQ0EsRUFBQSxHQUFjLElBQUksSUFBSixDQUFBO0lBQ2QsR0FBQSxHQUFjLElBQUksR0FBSixDQUFRLENBQUUsRUFBRixDQUFSO0lBQ2QsR0FBQSxHQUFjO0lBQ2QsSUFBQSxHQUFjO0lBQ2QsSUFBQSxHQUFjLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGlCQUFyQixFQUF3QyxJQUF4QyxDQUFiO0lBQ2QsR0FBRyxDQUFDLFlBQUosQ0FBaUIsQ0FBRSxHQUFGLEVBQU8sSUFBUCxDQUFqQjtJQUNBLENBQUEsQ0FBRSxNQUFGLENBQUEsR0FBYyxHQUFHLENBQUMsR0FBbEI7SUFFRyxDQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUE7QUFDTCxVQUFBO01BQUksTUFBQSxHQUFVLEdBQUcsQ0FBQyxrQkFBSixDQUF1QixDQUFFLEdBQUYsQ0FBdkI7TUFDVixLQUFBLENBQU0sU0FBTixFQUFpQixNQUFqQjt5QkFDQSxDQUFDLENBQUUsRUFBSCxDQUFNLE1BQU4sRUFBYztRQUFFLEtBQUEsRUFBTyxDQUFUO1FBQVksS0FBQSxFQUFPO01BQW5CLENBQWQ7SUFIQyxDQUFBO0lBS0EsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBO0FBQ0wsVUFBQTtNQUFJLE1BQUEsR0FBVSxHQUFHLENBQUMsa0JBQUosQ0FBdUIsQ0FBRSxHQUFGLENBQXZCO01BQ1YsS0FBQSxDQUFNLFNBQU4sRUFBaUIsTUFBakI7eUJBQ0EsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxNQUFOLEVBQWM7UUFBRSxLQUFBLEVBQU8sQ0FBVDtRQUFZLEtBQUEsRUFBTztNQUFuQixDQUFkO0lBSEMsQ0FBQTtJQUtBLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTtBQUNMLFVBQUE7TUFBSSxHQUFHLENBQUMsY0FBSixDQUFtQixHQUFuQixFQUF3QixJQUF4QjtNQUNBLE1BQUEsR0FBVSxHQUFHLENBQUMsa0JBQUosQ0FBdUIsQ0FBRSxHQUFGLENBQXZCO01BQ1YsS0FBQSxDQUFNLFNBQU4sRUFBaUIsTUFBakI7eUJBQ0EsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxNQUFOLEVBQWM7UUFBRSxLQUFBLEVBQU8sQ0FBVDtRQUFZLEtBQUEsRUFBTztNQUFuQixDQUFkO0lBSkMsQ0FBQTtJQU1BLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTtBQUNMLFVBQUE7TUFBSSxNQUFBLEdBQVUsR0FBRyxDQUFDLGtCQUFKLENBQXVCO1FBQUUsR0FBRjtRQUFPLEtBQUEsRUFBTztNQUFkLENBQXZCO01BQ1YsS0FBQSxDQUFNLFNBQU4sRUFBaUIsTUFBakI7eUJBQ0EsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxNQUFOLEVBQWM7UUFBRSxLQUFBLEVBQU8sQ0FBVDtRQUFZLEtBQUEsRUFBTztNQUFuQixDQUFkO0lBSEMsQ0FBQSxJQTNCTDs7SUFnQ0UsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFBLENBQUEsQ0FBRyxNQUFILENBQUEsT0FBQSxDQUFYLEVBQW9DLEVBQUEsQ0FBRyxHQUFHLENBQUEsY0FBQSxDQUFBLENBQWlCLE1BQWpCLENBQUEsb0NBQUEsQ0FBTixDQUFwQztJQUNBLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQSxDQUFBLENBQUcsTUFBSCxDQUFBLFdBQUEsQ0FBWCxFQUFvQyxFQUFBLENBQUcsR0FBRyxDQUFBLGNBQUEsQ0FBQSxDQUFpQixNQUFqQixDQUFBLHdDQUFBLENBQU4sQ0FBcEM7O01BRUE7O0FBQ0EsV0FBTztFQXJDdUIsRUEvQmhDOzs7RUF1RUEsSUFBQyxDQUFFLDZDQUFGLENBQUQsR0FBcUQsUUFBQSxDQUFFLENBQUYsRUFBSyxJQUFMLENBQUE7QUFDckQsUUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQTs7SUFDRSxDQUFBLENBQUUsSUFBRixDQUFBLEdBQVksT0FBQSxDQUFRLG9CQUFSLENBQVo7SUFDQSxDQUFBLENBQUUsR0FBRixDQUFBLEdBQVksT0FBQSxDQUFRLDJCQUFSLENBQVo7SUFDQSxFQUFBLEdBQVksSUFBSSxJQUFKLENBQUE7SUFDWixHQUFBLEdBQVksSUFBSSxHQUFKLENBQVEsQ0FBRSxFQUFGLENBQVI7SUFDWixHQUFBLEdBQVk7SUFDWixJQUFBLEdBQVk7SUFDWixJQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsaUJBQXJCLEVBQXdDLElBQXhDLENBQWI7SUFDWixHQUFHLENBQUMsWUFBSixDQUFpQixDQUFFLEdBQUYsRUFBTyxJQUFQLENBQWpCO0lBQ0EsR0FBRyxDQUFDLGtCQUFKLENBQXVCLENBQUUsR0FBRixDQUF2QjtJQUNBLFdBQUEsR0FBYyxFQUFFLENBQUMsUUFBSCxDQUFZLEdBQUcsQ0FBQSxxREFBQSxDQUFmO0lBQ2QsT0FBTyxDQUFDLEtBQVIsQ0FBYyxXQUFkO0lBRUcsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBO0FBQ0wsVUFBQTtNQUFJLEtBQUEsR0FBUTtBQUNSO1FBQ0UsRUFBQSxDQUFHLEdBQUcsQ0FBQTs7aUNBQUEsQ0FBTixFQUV3QztVQUNwQyxHQUFBLEVBQVUsR0FEMEI7VUFFcEMsR0FBQSxFQUFVLEVBRjBCO1VBR3BDLEdBQUEsRUFBVSxDQUgwQjtVQUlwQyxHQUFBLEVBQVUsQ0FKMEI7VUFLcEMsR0FBQSxFQUFVO1FBTDBCLENBRnhDLEVBREY7T0FTQSxjQUFBO1FBQU07UUFDSixJQUFBLENBQUssR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFLLENBQUMsT0FBbEIsQ0FBTDtRQUNBLEtBQXFCLHdDQUEwQyxDQUFDLElBQTdDLENBQWtELEtBQUssQ0FBQyxPQUF4RCxDQUFuQjtVQUFBLE1BQU0sTUFBTjs7O1VBQ0EsQ0FBQyxDQUFFLEVBQUgsQ0FBTSxJQUFOO1NBSEY7O3lCQUlBLENBQUMsQ0FBRSxFQUFILENBQU0sYUFBTjtJQWZDLENBQUEsSUFiTDs7SUE4QkUsVUFBQSxHQUFhLEVBQUUsQ0FBQyxRQUFILENBQVksR0FBRyxDQUFBLHFEQUFBLENBQWY7SUFDYixPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsRUEvQkY7OztNQWlDRSxDQUFDLENBQUUsRUFBSCxDQUFNLFdBQU4sRUFBbUIsVUFBbkI7OztNQUVBOztBQUNBLFdBQU87RUFyQzRDLEVBdkVyRDs7O0VBK0dBLElBQUMsQ0FBRSxxQkFBRixDQUFELEdBQTZCLE1BQUEsUUFBQSxDQUFFLENBQUYsRUFBSyxJQUFMLENBQUE7QUFDN0IsUUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxtQkFBQTs7SUFDRSxDQUFBLENBQUUsSUFBRixDQUFBLEdBQVksT0FBQSxDQUFRLG9CQUFSLENBQVo7SUFDQSxDQUFBLENBQUUsR0FBRixDQUFBLEdBQVksT0FBQSxDQUFRLDJCQUFSLENBQVo7SUFDQSxFQUFBLEdBQVksSUFBSSxJQUFKLENBQUE7SUFDWixHQUFBLEdBQVksSUFBSSxHQUFKLENBQVEsQ0FBRSxFQUFGLENBQVI7SUFDWixtQkFBQSxHQUFzQixDQUNwQixDQUFFLFVBQUYsRUFBYyxDQUFFLGlCQUFGLEVBQXFCLFVBQXJCLENBQWQsRUFBaUQsSUFBakQsQ0FEb0IsRUFFcEIsQ0FBRSxVQUFGLEVBQWMsQ0FBRSxpQkFBRixFQUFxQixVQUFyQixDQUFkLEVBQWlELElBQWpELENBRm9CLEVBR3BCLENBQUUsc0JBQUYsRUFBMEIsQ0FBRSxpQ0FBRixFQUFxQyxzQkFBckMsQ0FBMUIsRUFBeUYsSUFBekYsQ0FIb0IsRUFJcEIsQ0FBRSwyQkFBRixFQUErQixDQUFFLHdDQUFGLEVBQTRDLDJCQUE1QyxDQUEvQixFQUEwRyxJQUExRyxDQUpvQixFQUtwQixDQUFFLGdDQUFGLEVBQW9DLENBQUUsdUNBQUYsRUFBMkMsZ0NBQTNDLENBQXBDLEVBQW1ILElBQW5ILENBTG9CO0lBT3RCLEtBQUEscURBQUE7TUFBSSxDQUFFLEtBQUYsRUFBUyxPQUFULEVBQWtCLEtBQWxCO01BQ0YsTUFBTSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMEIsS0FBMUIsRUFBaUMsUUFBQSxDQUFBLENBQUE7QUFBRyxlQUFPLElBQUksT0FBSixDQUFZLFFBQUEsQ0FBRSxPQUFGLEVBQVcsTUFBWCxDQUFBO0FBQ2pFLGNBQUEsSUFBQSxFQUFBO1VBQU0sR0FBQSxHQUFTLEdBQUcsQ0FBQyxjQUFKLENBQW1CLEtBQW5CO1VBQ1QsSUFBQSxHQUFTLEdBQUcsQ0FBQyxjQUFKLENBQW1CLEdBQW5CLEVBRGY7O2lCQUdNLE9BQUEsQ0FBUSxDQUFFLEdBQUYsRUFBTyxJQUFQLENBQVI7UUFKMkQsQ0FBWjtNQUFWLENBQWpDO0lBRFI7QUFNQSx3Q0FBTztFQW5Cb0IsRUEvRzdCOzs7RUFzSUEsSUFBRyxPQUFPLENBQUMsSUFBUixLQUFnQixNQUFuQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBO2FBQ2hDLElBQUEsQ0FBSyxJQUFMO0lBRGdDLENBQUEsSUFBbEM7OztFQXRJQTs7OztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbkNORCAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdjbmQnXG5ycHIgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELnJwclxuYmFkZ2UgICAgICAgICAgICAgICAgICAgICA9ICdEQkFZLU1JUkFHRS9CQVNJQ1MnXG5kZWJ1ZyAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2RlYnVnJywgICAgIGJhZGdlXG53YXJuICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3dhcm4nLCAgICAgIGJhZGdlXG5pbmZvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2luZm8nLCAgICAgIGJhZGdlXG51cmdlICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3VyZ2UnLCAgICAgIGJhZGdlXG5oZWxwICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2hlbHAnLCAgICAgIGJhZGdlXG53aGlzcGVyICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3doaXNwZXInLCAgIGJhZGdlXG5lY2hvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmVjaG8uYmluZCBDTkRcbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxudGVzdCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZ3V5LXRlc3QnXG5QQVRIICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcbiMgRlMgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2ZzJ1xudHlwZXMgICAgICAgICAgICAgICAgICAgICA9IG5ldyAoIHJlcXVpcmUgJ2ludGVydHlwZScgKS5JbnRlcnR5cGVcbnsgaXNhXG4gIGVxdWFsc1xuICB0eXBlX29mXG4gIHZhbGlkYXRlXG4gIHZhbGlkYXRlX2xpc3Rfb2YgfSAgICAgID0gdHlwZXMuZXhwb3J0KClcblNRTCAgICAgICAgICAgICAgICAgICAgICAgPSBTdHJpbmcucmF3XG5ndXkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9ndXknXG5IICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vbGliL2hlbHBlcnMnXG5cblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwibXJnLnJlZnJlc2hfZGF0YXNvdXJjZVwiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIFQ/LmhhbHRfb25fZXJyb3IoKVxuICB7IERCYXkgICAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheSdcbiAgeyBNcmcgICAgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXktbWlyYWdlJ1xuICBkYiAgICAgICAgICA9IG5ldyBEQmF5KClcbiAgbXJnICAgICAgICAgPSBuZXcgTXJnIHsgZGIsIH1cbiAgZHNrICAgICAgICAgPSAnc3AnXG4gIHBhdGggICAgICAgID0gJ3Nob3J0LXByb3Bvc2FsLm1rdHMubWQnXG4gIHBhdGggICAgICAgID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBfX2Rpcm5hbWUsICcuLi8uLi8uLi9hc3NldHMnLCBwYXRoXG4gIG1yZy5yZWdpc3Rlcl9kc2sgeyBkc2ssIHBhdGgsIH1cbiAgeyBwcmVmaXggIH0gPSBtcmcuY2ZnXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG8gPT5cbiAgICByZXN1bHQgID0gbXJnLnJlZnJlc2hfZGF0YXNvdXJjZSB7IGRzaywgfVxuICAgIGRlYnVnICdeNDQ0OTheJywgcmVzdWx0XG4gICAgVD8uZXEgcmVzdWx0LCB7IGZpbGVzOiAxLCBieXRlczogMzg0IH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyA9PlxuICAgIHJlc3VsdCAgPSBtcmcucmVmcmVzaF9kYXRhc291cmNlIHsgZHNrLCB9XG4gICAgZGVidWcgJ140NDQ5OF4nLCByZXN1bHRcbiAgICBUPy5lcSByZXN1bHQsIHsgZmlsZXM6IDAsIGJ5dGVzOiAwIH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyA9PlxuICAgIG1yZy5fdXBkYXRlX2RpZ2VzdCBkc2ssIG51bGxcbiAgICByZXN1bHQgID0gbXJnLnJlZnJlc2hfZGF0YXNvdXJjZSB7IGRzaywgfVxuICAgIGRlYnVnICdeNDQ0OTheJywgcmVzdWx0XG4gICAgVD8uZXEgcmVzdWx0LCB7IGZpbGVzOiAxLCBieXRlczogMzg0IH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyA9PlxuICAgIHJlc3VsdCAgPSBtcmcucmVmcmVzaF9kYXRhc291cmNlIHsgZHNrLCBmb3JjZTogdHJ1ZSwgfVxuICAgIGRlYnVnICdeNDQ0OTheJywgcmVzdWx0XG4gICAgVD8uZXEgcmVzdWx0LCB7IGZpbGVzOiAxLCBieXRlczogMzg0IH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBILnRhYnVsYXRlIFwiI3twcmVmaXh9X21pcnJvclwiLCAgICAgIGRiIFNRTFwic2VsZWN0ICogZnJvbSAje3ByZWZpeH1fbWlycm9yIG9yZGVyIGJ5IGRzaywgb2xuLCB0cmssIHBjZTtcIlxuICBILnRhYnVsYXRlIFwiI3twcmVmaXh9X3Jhd19taXJyb3JcIiwgIGRiIFNRTFwic2VsZWN0ICogZnJvbSAje3ByZWZpeH1fcmF3X21pcnJvciBvcmRlciBieSBkc2ssIG9sbiwgdHJrLCBwY2U7XCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkb25lPygpXG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQFsgXCJhbHRlcmluZyBtaXJyb3JlZCBzb3VyY2UgbGluZXMgY2F1c2VzIGVycm9yXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gICMgVD8uaGFsdF9vbl9lcnJvcigpXG4gIHsgREJheSAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheSdcbiAgeyBNcmcgICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5LW1pcmFnZSdcbiAgZGIgICAgICAgID0gbmV3IERCYXkoKVxuICBtcmcgICAgICAgPSBuZXcgTXJnIHsgZGIsIH1cbiAgZHNrICAgICAgID0gJ3R3Y20nXG4gIHBhdGggICAgICA9ICdkYmF5LXJ1c3R5YnV6ei90ZW1wbGF0ZS13aXRoLWNvbnRlbnQtbWFya2Vycy5odG1sJ1xuICBwYXRoICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uL2Fzc2V0cycsIHBhdGhcbiAgbXJnLnJlZ2lzdGVyX2RzayB7IGRzaywgcGF0aCwgfVxuICBtcmcucmVmcmVzaF9kYXRhc291cmNlIHsgZHNrLCB9XG4gIHJvd3NfYmVmb3JlID0gZGIuYWxsX3Jvd3MgU1FMXCJzZWxlY3QgKiBmcm9tIG1yZ19taXJyb3Igb3JkZXIgYnkgZHNrLCBvbG4sIHRyaywgcGNlO1wiXG4gIGNvbnNvbGUudGFibGUgcm93c19iZWZvcmVcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyA9PlxuICAgIGVycm9yID0gbnVsbFxuICAgIHRyeVxuICAgICAgZGIgU1FMXCJcIlwiaW5zZXJ0IGludG8gbXJnX21pcnJvclxuICAgICAgICAoIGRzaywgb2xuLCB0cmssIHBjZSApXG4gICAgICAgIHZhbHVlcyAoICRkc2ssICRvbG4sICR0cmssICRwY2UgKVwiXCJcIiwge1xuICAgICAgICAgIGRzazogICAgICBkc2ssXG4gICAgICAgICAgb2xuOiAgICAgIDEwLFxuICAgICAgICAgIHRyazogICAgICAxLFxuICAgICAgICAgIHBjZTogICAgICAwLFxuICAgICAgICAgIHR4dDogICAgICBcInNvbWUgdGV4dFwiLCB9XG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIHdhcm4gQ05ELnJldmVyc2UgZXJyb3IubWVzc2FnZVxuICAgICAgdGhyb3cgZXJyb3IgdW5sZXNzICggL25vdCBhbGxvd2VkIHRvIG1vZGlmeSB0YWJsZSBtcmdfbWlycm9yLyApLnRlc3QgZXJyb3IubWVzc2FnZVxuICAgICAgVD8ub2sgdHJ1ZVxuICAgIFQ/Lm9rIGVycm9yP1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJvd3NfYWZ0ZXIgPSBkYi5hbGxfcm93cyBTUUxcInNlbGVjdCAqIGZyb20gbXJnX21pcnJvciBvcmRlciBieSBkc2ssIG9sbiwgdHJrLCBwY2U7XCJcbiAgY29uc29sZS50YWJsZSByb3dzX2FmdGVyXG4gICMgZGVidWcgdHlwZXMuZXF1YWxzIHJvd3NfYmVmb3JlLCByb3dzX2FmdGVyXG4gIFQ/LmVxIHJvd3NfYmVmb3JlLCByb3dzX2FmdGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiVVJML3BhdGggY29udmVyc2lvblwiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIFQ/LmhhbHRfb25fZXJyb3IoKVxuICB7IERCYXkgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gIHsgTXJnICAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheS1taXJhZ2UnXG4gIGRiICAgICAgICA9IG5ldyBEQmF5KClcbiAgbXJnICAgICAgID0gbmV3IE1yZyB7IGRiLCB9XG4gIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4gICAgWyAnL2Zvby50eHQnLCBbICdmaWxlOi8vL2Zvby50eHQnLCAnL2Zvby50eHQnIF0sIG51bGwgXVxuICAgIFsgJy9mb28udHh0JywgWyAnZmlsZTovLy9mb28udHh0JywgJy9mb28udHh0JyBdLCBudWxsIF1cbiAgICBbICcvc29tZSB3ZWlyZCBwYXRoLmpwZycsIFsgJ2ZpbGU6Ly8vc29tZSUyMHdlaXJkJTIwcGF0aC5qcGcnLCAnL3NvbWUgd2VpcmQgcGF0aC5qcGcnIF0sIG51bGwgXVxuICAgIFsgJy9zb21lIHdlaXJkIHBhdGguanBnI29vcHMnLCBbICdmaWxlOi8vL3NvbWUlMjB3ZWlyZCUyMHBhdGguanBnJTIzb29wcycsICcvc29tZSB3ZWlyZCBwYXRoLmpwZyNvb3BzJyBdLCBudWxsIF1cbiAgICBbICcvcGF0aC93aXRoL2ZvbGRlcnMvdG8vZmlsZS50eHQnLCBbICdmaWxlOi8vL3BhdGgvd2l0aC9mb2xkZXJzL3RvL2ZpbGUudHh0JywgJy9wYXRoL3dpdGgvZm9sZGVycy90by9maWxlLnR4dCcgXSwgbnVsbCBdXG4gICAgXVxuICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgZXJyb3IsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuICAgIGF3YWl0IFQucGVyZm9ybSBwcm9iZSwgbWF0Y2hlciwgZXJyb3IsIC0+IHJldHVybiBuZXcgUHJvbWlzZSAoIHJlc29sdmUsIHJlamVjdCApIC0+XG4gICAgICB1cmwgICAgPSBtcmcuX3VybF9mcm9tX3BhdGggcHJvYmVcbiAgICAgIHBhdGggICA9IG1yZy5fcGF0aF9mcm9tX3VybCB1cmxcbiAgICAgICMgdXJnZSB7IHByb2JlLCB1cmwsIHBhdGgsIH1cbiAgICAgIHJlc29sdmUgWyB1cmwsIHBhdGgsIF1cbiAgcmV0dXJuIGRvbmU/KClcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmlmIHJlcXVpcmUubWFpbiBpcyBtb2R1bGUgdGhlbiBkbyA9PlxuICB0ZXN0IEBcbiAgIyBAWyBcIm1yZy5yZWZyZXNoX2RhdGFzb3VyY2VcIiBdKClcbiAgIyB0ZXN0IEBbIFwibXJnLnJlZnJlc2hfZGF0YXNvdXJjZVwiIF1cbiAgIyBAWyBcImFsdGVyaW5nIG1pcnJvcmVkIHNvdXJjZSBsaW5lcyBjYXVzZXMgZXJyb3JcIiBdKClcbiAgIyB0ZXN0IEBbIFwiYWx0ZXJpbmcgbWlycm9yZWQgc291cmNlIGxpbmVzIGNhdXNlcyBlcnJvclwiIF1cbiJdfQ==
