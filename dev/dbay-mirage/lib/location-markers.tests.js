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

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "location marker matching" ] = ( T, done ) ->
  //   # T?.halt_on_error()
  //   { Mrg } = require '../../../apps/dbay-mirage'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [ '<mrg:loc#first/>',         [ [ '', '<mrg:loc#first/>', ''       ], { locid: 'first'        }, ], ]
  //     [ '<mrg:loc#foo-bar-123/>',   [ [ '', '<mrg:loc#foo-bar-123/>', '' ], { locid: 'foo-bar-123'  }, ], ]
  //     [ '<mrg:loc# foo-bar-123/>',  [ [ '<mrg:loc# foo-bar-123/>'        ], { locid: ' foo-bar-123' }, ], ]
  //     [ '<MRG:loc#foo-bar-123/>',   [ [ '<MRG:loc#foo-bar-123/>'         ], { locid: 'foo-bar-123'  }, ], ]
  //     [ '<mrg:loc#first />',        [ [ '<mrg:loc#first />'              ], { locid: 'first '       }, ], ]
  //     [ '<mrg:loc id="first"/>',    [ [ '<mrg:loc id="first"/>'          ], null                     , ], ]
  //     [ '<mrg:loc#first>',          [ [ '<mrg:loc#first>'                ], { locid: 'first>'       }, ], ]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       # result = ( { d.groups..., } for d from probe.matchAll Mrg.C.defaults.constructor_cfg.loc_splitter )
  //       result = [
  //         ( probe.split Mrg.C.defaults.constructor_cfg.loc_splitter ),
  //         ( ( probe.match Mrg.C.defaults.constructor_cfg.locid_re )?.groups ? null ) ]
  //       resolve result
  //       return null
  //   #.........................................................................................................
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "___ extended location marker matching" ] = ( T, done ) ->
  //   # T?.halt_on_error()
  //   { Mrg } = require '../../../apps/dbay-mirage'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [ '<mrg:loc.delete#title/>',         [ [ '', '<mrg:loc#first/>', ''       ], { locid: 'first'        }, ], ]
  //     [ '<mrg:loc#title.delete/>',         [ [ '', '<mrg:loc#first/>', ''       ], { locid: 'first'        }, ], ]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       # result = ( { d.groups..., } for d from probe.matchAll Mrg.C.defaults.constructor_cfg.loc_splitter )
  //       result = [
  //         ( probe.split Mrg.C.defaults.constructor_cfg.loc_splitter ),
  //         ( ( probe.match Mrg.C.defaults.constructor_cfg.locid_re )?.groups ? null ) ]
  //       naked_probe = probe[ 1 ... probe.length - 2 ]
  //       debug '^545575^', INTERTEXT.HTML.parse_compact_tagname naked_probe
  //       resolve result
  //       return null
  //   #.........................................................................................................
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this["______________________ loc markers 1"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
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
          locid: null,
          line: '<title>'
        },
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 1,
          xtra: 0,
          locid: 'title',
          line: '<mrg:loc.delete-marker#title/>'
        },
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 2,
          xtra: 0,
          locid: null,
          line: '</title>'
        },
        {
          dsk: 'twcm',
          lnr: 2,
          lnpart: 0,
          xtra: 0,
          locid: null,
          line: '<article>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 0,
          xtra: 0,
          locid: null,
          line: '  <p>Here comes some '
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 1,
          xtra: 0,
          locid: 'content',
          line: '<mrg:loc#content/>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 2,
          xtra: 0,
          locid: null,
          line: '.</p>'
        },
        {
          dsk: 'twcm',
          lnr: 4,
          lnpart: 0,
          xtra: 0,
          locid: null,
          line: '  </article>'
        },
        {
          dsk: 'twcm',
          lnr: 5,
          lnpart: 0,
          xtra: 0,
          locid: null,
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
          lnpart: 1,
          props: null,
          del: 0
        },
        {
          dsk: 'twcm',
          locid: 'title',
          lnr: 1,
          lnpart: 1,
          props: '["delete-marker"]',
          del: 1
        }
      ]);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["______________________ loc markers 2"] = function(T, done) {
    var DBay, Mrg, db, dsk, line, mrg, path, ref, rows, x;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
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
        locid: null,
        line: '<title>'
      });
    }
    if (T != null) {
      T.eq(rows[1], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 0,
        locid: 'title',
        line: '<mrg:loc.delete-marker#title/>'
      });
    }
    if (T != null) {
      T.eq(rows[2], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 2,
        xtra: 0,
        locid: null,
        line: '</title>'
      });
    }
    if (T != null) {
      T.eq(rows[3], {
        dsk: 'twcm',
        lnr: 2,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '<article>'
      });
    }
    if (T != null) {
      T.eq(rows[4], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '  <p>Here comes some '
      });
    }
    if (T != null) {
      T.eq(rows[5], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 0,
        locid: 'content',
        line: '<mrg:loc#content/>'
      });
    }
    if (T != null) {
      T.eq(rows[6], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 2,
        xtra: 0,
        locid: null,
        line: '.</p>'
      });
    }
    if (T != null) {
      T.eq(rows[7], {
        dsk: 'twcm',
        lnr: 4,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '  </article>'
      });
    }
    if (T != null) {
      T.eq(rows[8], {
        dsk: 'twcm',
        lnr: 5,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: ''
      });
    }
    if (T != null) {
      T.eq(mrg.append_to_loc({
        dsk,
        locid: 'title',
        text: "A Grand Union",
        nl: false
      }), {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 1,
        locid: null,
        line: 'A Grand Union'
      });
    }
    if (T != null) {
      T.eq(mrg.append_to_loc({
        dsk,
        locid: 'content',
        text: "more ",
        nl: false
      }), {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 1,
        locid: null,
        line: 'more '
      });
    }
    if (T != null) {
      T.eq(mrg.append_to_loc({
        dsk,
        locid: 'content',
        text: "content",
        nl: false
      }), {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 2,
        locid: null,
        line: 'content'
      });
    }
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    rows = db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`);
    if (T != null) {
      T.eq(rows[0], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '<title>'
      });
    }
    if (T != null) {
      T.eq(rows[1], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 0,
        locid: 'title',
        line: '<mrg:loc.delete-marker#title/>'
      });
    }
    if (T != null) {
      T.eq(rows[2], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 1,
        xtra: 1,
        locid: null,
        line: 'A Grand Union'
      });
    }
    if (T != null) {
      T.eq(rows[3], {
        dsk: 'twcm',
        lnr: 1,
        lnpart: 2,
        xtra: 0,
        locid: null,
        line: '</title>'
      });
    }
    if (T != null) {
      T.eq(rows[4], {
        dsk: 'twcm',
        lnr: 2,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '<article>'
      });
    }
    if (T != null) {
      T.eq(rows[5], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '  <p>Here comes some '
      });
    }
    if (T != null) {
      T.eq(rows[6], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 0,
        locid: 'content',
        line: '<mrg:loc#content/>'
      });
    }
    if (T != null) {
      T.eq(rows[7], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 1,
        locid: null,
        line: 'more '
      });
    }
    if (T != null) {
      T.eq(rows[8], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 1,
        xtra: 2,
        locid: null,
        line: 'content'
      });
    }
    if (T != null) {
      T.eq(rows[9], {
        dsk: 'twcm',
        lnr: 3,
        lnpart: 2,
        xtra: 0,
        locid: null,
        line: '.</p>'
      });
    }
    if (T != null) {
      T.eq(rows[10], {
        dsk: 'twcm',
        lnr: 4,
        lnpart: 0,
        xtra: 0,
        locid: null,
        line: '  </article>'
      });
    }
    if (T != null) {
      T.eq(rows[11], {
        dsk: 'twcm',
        lnr: 5,
        lnpart: 0,
        xtra: 0,
        locid: null,
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
          line: '<title>A Grand Union</title>'
        },
        {
          dsk: 'twcm',
          lnr: 2,
          line: '<article>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          line: '  <p>Here comes some more content.</p>'
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
  this["______________________ loc markers 3"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
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
      text: "A Grand Union",
      nl: false
    });
    mrg.append_to_loc({
      dsk,
      locid: 'content',
      text: "more ",
      nl: false
    });
    mrg.append_to_loc({
      dsk,
      locid: 'content',
      text: "content",
      nl: false
    });
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: null
      }), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#content/>more content.</p>\n  </article>\n');
    }
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: true
      }), '<title><mrg:loc.delete-marker#title/>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#content/>more content.</p>\n  </article>\n');
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
  this["______________________ multiple loc markers in one line"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm2';
    path = 'dbay-rustybuzz/template-with-content-markers-2.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    //.........................................................................................................
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    //.........................................................................................................
    mrg.append_to_loc({
      dsk,
      locid: 'title',
      text: "A Grand Union",
      nl: false
    });
    mrg.append_to_loc({
      dsk,
      locid: 'some-content',
      text: "some content",
      nl: false
    });
    mrg.append_to_loc({
      dsk,
      locid: 'more-content',
      text: "and more content",
      nl: false
    });
    debug('^45346^', mrg.get_text({
      dsk,
      keep_locs: null
    }));
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: null
      }), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#some-content/>some content and some more <mrg:loc#more-content/>and more content.</p>\n  </article>\n');
    }
    if (T != null) {
      T.eq(mrg.get_text({dsk}), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some some content and some more and more content.</p>\n  </article>\n');
    }
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: true
      }), '<title><mrg:loc.delete-marker#title/>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#some-content/>some content and some more <mrg:loc#more-content/>and more content.</p>\n  </article>\n');
    }
    if (T != null) {
      T.eq(mrg.get_text({
        dsk,
        keep_locs: false
      }), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some some content and some more and more content.</p>\n  </article>\n');
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["______________________ loc markers 4"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
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
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=location-markers.tests.js.map