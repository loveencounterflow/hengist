(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE';

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
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["location marker matching"] = async function(T, done) {
    var Mrg, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        '<mrg:loc#first/>',
        [
          ['',
          '<mrg:loc#first/>',
          ''],
          {
            locid: 'first'
          }
        ]
      ],
      [
        '<mrg:loc#foo-bar-123/>',
        [
          ['',
          '<mrg:loc#foo-bar-123/>',
          ''],
          {
            locid: 'foo-bar-123'
          }
        ]
      ],
      [
        '<mrg:loc# foo-bar-123/>',
        [
          ['<mrg:loc# foo-bar-123/>'],
          {
            locid: ' foo-bar-123'
          }
        ]
      ],
      [
        '<MRG:loc#foo-bar-123/>',
        [
          ['<MRG:loc#foo-bar-123/>'],
          {
            locid: 'foo-bar-123'
          }
        ]
      ],
      [
        '<mrg:loc#first />',
        [
          ['<mrg:loc#first />'],
          {
            locid: 'first '
          }
        ]
      ],
      ['<mrg:loc id="first"/>',
      [['<mrg:loc id="first"/>'],
      null]],
      [
        '<mrg:loc#first>',
        [
          ['<mrg:loc#first>'],
          {
            locid: 'first>'
          }
        ]
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var ref, ref1, result;
          // result = ( { d.groups..., } for d from probe.matchAll Mrg.C.defaults.constructor_cfg.loc_splitter )
          result = [probe.split(Mrg.C.defaults.constructor_cfg.loc_splitter), (ref = (ref1 = probe.match(Mrg.C.defaults.constructor_cfg.locid_re)) != null ? ref1.groups : void 0) != null ? ref : null];
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["mrg.refresh_datasource"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
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
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    rows_before = db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`);
    (() => {      //.........................................................................................................
      var error;
      error = null;
      try {
        db(SQL`insert into mrg_mirror
( dsk, lnr, lnpart, xtra, isloc, line )
values ( $dsk, $lnr, $lnpart, $xtra, $isloc, $line )`, {
          dsk: dsk,
          lnr: 10,
          lnpart: 0,
          xtra: 0,
          isloc: 0,
          line: "some text"
        });
      } catch (error1) {
        error = error1;
        warn(CND.reverse(error.message));
        if (T != null) {
          T.ok(/not allowed to modify table mrg_mirror/.test(error.message));
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    //.........................................................................................................
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    rows_after = db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`);
    if (T != null) {
      T.eq(rows_before, rows_after);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["loc markers 1"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    info('^33298-1^', mrg.refresh_datasource({dsk}));
    //.........................................................................................................
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    console.table(db.all_rows(SQL`select * from mrg_locs   order by dsk, locid;`));
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`), [
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 0,
          xtra: 0,
          isloc: 0,
          line: '<title>'
        },
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 1,
          xtra: 0,
          isloc: 1,
          line: '<mrg:loc#title/>'
        },
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 2,
          xtra: 0,
          isloc: 0,
          line: '</title>'
        },
        {
          dsk: 'twcm',
          lnr: 2,
          lnpart: 0,
          xtra: 0,
          isloc: 0,
          line: '<article>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 0,
          xtra: 0,
          isloc: 0,
          line: '  <p>Here comes some '
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 1,
          xtra: 0,
          isloc: 1,
          line: '<mrg:loc#content/>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 2,
          xtra: 0,
          isloc: 0,
          line: '.</p>'
        },
        {
          dsk: 'twcm',
          lnr: 4,
          lnpart: 0,
          xtra: 0,
          isloc: 0,
          line: '  </article>'
        },
        {
          dsk: 'twcm',
          lnr: 5,
          lnpart: 0,
          xtra: 0,
          isloc: 0,
          line: ''
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from mrg_locs order by dsk, locid;`), [
        {
          dsk: 'twcm',
          locid: 'content',
          lnr: 3,
          lnpart: 1
        },
        {
          dsk: 'twcm',
          locid: 'title',
          lnr: 1,
          lnpart: 1
        }
      ]);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["loc markers 2"] = function(T, done) {
    var DBay, Mrg, db, dsk, line, mrg, path, ref, rows, x;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    //.........................................................................................................
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    //.........................................................................................................
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    rows = db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`);
    if (T != null) {
      T.eq(rows[0], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '<title>'
      });
    }
    if (T != null) {
      T.eq(rows[1], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 0,
        isloc: 1,
        line: '<mrg:loc#title/>'
      });
    }
    if (T != null) {
      T.eq(rows[2], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 2,
        xtra: 0,
        isloc: 0,
        line: '</title>'
      });
    }
    if (T != null) {
      T.eq(rows[3], {
        dsk: 'twcm',
        lnr: 2,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '<article>'
      });
    }
    if (T != null) {
      T.eq(rows[4], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '  <p>Here comes some '
      });
    }
    if (T != null) {
      T.eq(rows[5], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 0,
        isloc: 1,
        line: '<mrg:loc#content/>'
      });
    }
    if (T != null) {
      T.eq(rows[6], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 2,
        xtra: 0,
        isloc: 0,
        line: '.</p>'
      });
    }
    if (T != null) {
      T.eq(rows[7], {
        dsk: 'twcm',
        lnr: 4,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '  </article>'
      });
    }
    if (T != null) {
      T.eq(rows[8], {
        dsk: 'twcm',
        lnr: 5,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: ''
      });
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(mrg.append_to_loc({
        dsk,
        locid: 'title',
        text: "A Grand Union"
      }), {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 1,
        isloc: 0,
        line: 'A Grand Union'
      });
    }
    if (T != null) {
      T.eq(mrg.append_to_loc({
        dsk,
        locid: 'content',
        text: "more "
      }), {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 1,
        isloc: 0,
        line: 'more '
      });
    }
    if (T != null) {
      T.eq(mrg.append_to_loc({
        dsk,
        locid: 'content',
        text: "content"
      }), {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 2,
        isloc: 0,
        line: 'content'
      });
    }
    // info '^33298-4^', mrg.prepend_to_loc { dsk, locid: 'content', text: "content goes here" }
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    rows = db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`);
    if (T != null) {
      T.eq(rows[0], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '<title>'
      });
    }
    if (T != null) {
      T.eq(rows[1], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 0,
        isloc: 1,
        line: '<mrg:loc#title/>'
      });
    }
    if (T != null) {
      T.eq(rows[2], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 1,
        isloc: 0,
        line: 'A Grand Union'
      });
    }
    if (T != null) {
      T.eq(rows[3], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 2,
        xtra: 0,
        isloc: 0,
        line: '</title>'
      });
    }
    if (T != null) {
      T.eq(rows[4], {
        dsk: 'twcm',
        lnr: 2,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '<article>'
      });
    }
    if (T != null) {
      T.eq(rows[5], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '  <p>Here comes some '
      });
    }
    if (T != null) {
      T.eq(rows[6], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 0,
        isloc: 1,
        line: '<mrg:loc#content/>'
      });
    }
    if (T != null) {
      T.eq(rows[7], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 1,
        isloc: 0,
        line: 'more '
      });
    }
    if (T != null) {
      T.eq(rows[8], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 2,
        isloc: 0,
        line: 'content'
      });
    }
    if (T != null) {
      T.eq(rows[9], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 2,
        xtra: 0,
        isloc: 0,
        line: '.</p>'
      });
    }
    if (T != null) {
      T.eq(rows[10], {
        dsk: 'twcm',
        lnr: 4,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: '  </article>'
      });
    }
    if (T != null) {
      T.eq(rows[11], {
        dsk: 'twcm',
        lnr: 5,
        lnpart: 0,
        xtra: 0,
        isloc: 0,
        line: ''
      });
    }
    ref = mrg.walk_line_rows({dsk});
    //.........................................................................................................
    for (x of ref) {
      ({line} = x);
      urge('^587^', rpr(line));
    }
    if (T != null) {
      T.eq(mrg.get_line_rows({dsk}), [
        {
          dsk: 'twcm',
          lnr: 1,
          line: '<title><mrg:loc#title/>A Grand Union</title>'
        },
        {
          dsk: 'twcm',
          lnr: 2,
          line: '<article>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          line: '  <p>Here comes some <mrg:loc#content/>more content.</p>'
        },
        {
          dsk: 'twcm',
          lnr: 4,
          line: '  </article>'
        },
        {
          dsk: 'twcm',
          lnr: 5,
          line: ''
        }
      ]);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["loc markers 3"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    //.........................................................................................................
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    //.........................................................................................................
    mrg.append_to_loc({
      dsk,
      locid: 'title',
      text: "A Grand Union"
    });
    mrg.append_to_loc({
      dsk,
      locid: 'content',
      text: "more "
    });
    mrg.append_to_loc({
      dsk,
      locid: 'content',
      text: "content"
    });
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: true
      }), '<title><mrg:loc#title/>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#content/>more content.</p>\n  </article>\n');
    }
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: false
      }), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some more content.</p>\n  </article>\n');
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["loc markers 4"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    //.........................................................................................................
    debug('^68667-1^');
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    //.........................................................................................................
    debug('^68667-2^');
    db.setv('dsk', dsk);
    db.setv('locid', 'title');
    console.table(db.all_rows(SQL`select * from mrg_location_from_dsk_locid;`));
    console.table(db.all_rows(SQL`select * from mrg_prv_nxt_xtra_from_dsk_locid;`));
    (() => {      //.........................................................................................................
      var error;
      error = null;
      db.setv('dsk', dsk);
      db.setv('locid', 'nonexistentloc');
      debug('^68667-3^');
      try {
        console.table(db.all_rows(SQL`select * from mrg_location_from_dsk_locid;`));
      } catch (error1) {
        error = error1;
        help('^68667-4^', CND.reverse(error.message));
        if (T != null) {
          T.ok((error.message.match(/unknown locid/)) != null);
        }
      }
      debug('^68667-5^');
      return T != null ? T.ok(error != null) : void 0;
    })();
    (() => {      //.........................................................................................................
      var error;
      error = null;
      db.setv('dsk', dsk);
      db.setv('locid', 'nonexistentloc');
      debug('^68667-6^');
      try {
        console.table(db.all_rows(SQL`select * from mrg_prv_nxt_xtra_from_dsk_locid;`));
      } catch (error1) {
        error = error1;
        help('^68667-7^', CND.reverse(error.message));
        if (T != null) {
          T.ok((error.message.match(/unknown locid/)) != null);
        }
      }
      debug('^68667-8^');
      return T != null ? T.ok(error != null) : void 0;
    })();
    (() => {      //.........................................................................................................
      var error;
      debug('^68667-9^');
      error = null;
      try {
        mrg.append_to_loc({
          dsk,
          locid: 'nonexistentloc',
          text: "A Grand Union"
        });
      } catch (error1) {
        error = error1;
        help('^68667-10^', CND.reverse(error.message));
        if (T != null) {
          T.ok((error.message.match(/unknown locid/)) != null);
        }
      }
      debug('^68667-11^');
      return T != null ? T.ok(error != null) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "altering mirrored source lines causes error" ]
      // @[ "altering mirrored source lines causes error" ]()
      // test @[ "location marker matching" ]
      // test @[ "mrg.refresh_datasource" ]
      // test @[ "loc markers 1" ]
      // test @[ "loc markers 2" ]
      // test @[ "loc markers 3" ]
      return test(this["loc markers 4"]);
    })();
  }

}).call(this);

//# sourceMappingURL=mirage.tests.js.map