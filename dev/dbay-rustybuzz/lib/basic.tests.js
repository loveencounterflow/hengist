(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/TESTS/BASIC';

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

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "DRB foobar" ] = ( T, done ) ->
  //   # ### explicit path, explicitly temporary ###
  //   # T?.halt_on_error()
  //   # { DBay }            = require H.dbay_path
  //   { DBay }            = require H.dbay_path
  //   { Drb }             = require H.drb_path
  //   { Tbl, }            = require '../../../apps/icql-dba-tabulate'
  //   path                = PATH.resolve DBay.C.autolocation, 'drb.sqlite'
  //   # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  //   db                  = new DBay()
  //   drb                 = new Drb { path, db, temporary: true, }
  //   dtab                = new Tbl { db, }
  //   schema              = drb.cfg.schema
  //   #.........................................................................................................
  //   db =>
  //     echo dtab._tabulate db SQL"select type, name from #{schema}.sqlite_schema;"
  //     echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( 'outlines' );"
  //   #.........................................................................................................
  //   #.........................................................................................................
  //   db =>
  //     echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( 'fontnicks' );"
  //     echo dtab._tabulate db SQL"select * from #{schema}.outlines order by fontnick, gid;"
  //     echo dtab._tabulate db SQL"select * from #{schema}.fontnicks order by fontnick;"
  //   #.........................................................................................................
  //   return done?()

  //-----------------------------------------------------------------------------------------------------------
  this["DRB no shared state in WASM module"] = function(T, done) {
    var DBay, Drb, font_idx, fontnick, gid;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    fontnick = 'gi';
    gid = 74;
    font_idx = 0;
    (() => {      //.........................................................................................................
      /* Establish that trying to retrieve an outline with an unused `font_idx` throws an error: */
      var db, drb, error, message, name, outline;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      try {
        urge('^290^', outline = JSON.parse(drb.RBW.glyph_to_svg_pathdata(font_idx, gid)));
      } catch (error1) {
        error = error1;
        ({name, message} = error);
        warn({name, message});
      }
      if (error == null) {
        return T != null ? T.fail("^5568347-1^ failed to throw an error") : void 0;
      }
    })();
    (() => {      //.........................................................................................................
      /* Establish that after associating `font_idx` with a loaded font, outline retrieval does work: */
      var db, drb, outline;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      drb.prepare_font({fontnick});
      return urge('^290^', outline = JSON.parse(drb.RBW.glyph_to_svg_pathdata(font_idx, gid)));
    })();
    (() => {      //.........................................................................................................
      var db, drb, error, message, name, outline;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      try {
        /* we do not call `drb.prepare_font { fontnick, }` */
        urge('^290^', outline = JSON.parse(drb.RBW.glyph_to_svg_pathdata(font_idx, gid)));
      } catch (error1) {
        error = error1;
        ({name, message} = error);
        warn({name, message});
      }
      if (error == null) {
        return T != null ? T.fail("^5568347-2^ failed to throw an error") : void 0;
      }
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___________ DRB path compression"] = function(T, done) {
    var R, SVGO, matcher, optimize, probe, result;
    SVGO = require('svgo');
    probe = 'M 759 -105 Q 787 -105 844 -57 Q 844 -34 835 -34 Q 803 -34 680 -37 Q 558 -40 541 -40 Q 427 -40 271 -20 L 136 3 Q 131 3 126 3 Q 122 4 119 4 Q 78 4 55 -31 Q 55 -40 63 -40 L 288 -57 L 288 -69 Q 288 -102 285 -147 Q 281 -192 277 -237 Q 272 -282 271 -296 Q 264 -378 221 -454 L 221 -456 Q 221 -474 235 -474 Q 245 -474 264 -465 Q 282 -457 289 -451 L 384 -535 Q 433 -581 452 -624 L 452 -629 Q 452 -646 457 -652 Q 462 -657 472 -657 Q 488 -657 531 -649 Q 574 -642 580 -636 Q 590 -627 590 -610 Q 555 -595 449 -524 Q 343 -454 308 -438 Q 315 -428 315 -395 Q 315 -383 314 -368 Q 313 -354 313 -351 Q 420 -357 626 -410 Q 647 -415 660 -415 Q 697 -415 718 -393 Q 718 -367 592 -348 L 536 -338 Q 571 -316 576 -293 L 534 -80 Q 539 -79 552 -79 Q 591 -79 667 -92 Q 742 -105 759 -105 Z M 316 -318 Q 316 -292 320 -237 Q 323 -182 328 -125 Q 333 -69 333 -63 Q 482 -74 490 -74 Q 490 -86 497 -154 Q 503 -222 503 -243 Q 503 -295 490 -329 L 380 -311 Q 374 -310 362 -310 Q 337 -310 316 -318 Z';
    matcher = 'M759-105q28 0 85 48 0 23-9 23-32 0-155-3-122-3-139-3-114 0-270 20L136 3h-10q-4 1-7 1-41 0-64-35 0-9 8-9l225-17v-12q0-33-3-78l-8-90q-5-45-6-59-7-82-50-158v-2q0-18 14-18 10 0 29 9 18 8 25 14l95-84q49-46 68-89v-5q0-17 5-23 5-5 15-5 16 0 59 8 43 7 49 13 10 9 10 26-35 15-141 86-106 70-141 86 7 10 7 43 0 12-1 27-1 14-1 17 107-6 313-59 21-5 34-5 37 0 58 22 0 26-126 45l-56 10q35 22 40 45L534-80q5 1 18 1 39 0 115-13 75-13 92-13ZM316-318q0 26 4 81 3 55 8 112 5 56 5 62 149-11 157-11 0-12 7-80 6-68 6-89 0-52-13-86l-110 18q-6 1-18 1-25 0-46-8Z';
    //.........................................................................................................
    optimize = function(svg_path) {
      var svg, svg_optimized;
      svg = `<svg><path d='${svg_path}'/></svg>`;
      ({
        data: svg_optimized
      } = SVGO.optimize(svg));
      return svg_optimized.replace(/^.*d="([^"]+)".*$/, '$1');
    };
    //.........................................................................................................
    R = probe;
    R = R.replace(/([0-9])\x20([^0-9])/g, '$1$2');
    R = R.replace(/([^0-9])\x20([0-9])/g, '$1$2');
    result = R;
    debug('^280^', probe);
    debug('^280^', result);
    debug('^280^', optimize(result));
    debug('^280^', result === matcher);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB can pass in custom RBW"] = function(T, done) {
    var DBay, Drb, RBW, db, drb;
    // T?.halt_on_error()
    RBW = require('../../../assets/dbay-rustybuzz/pkg');
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    drb = new Drb({
      db,
      temporary: true,
      RBW
    });
    if (T != null) {
      T.ok(drb.RBW === RBW);
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "DRB use object as namespace for interpolation" ] = ( T, done ) ->
  //   # T?.halt_on_error()
  //   { DBay }            = require H.dbay_path
  //   { Drb }             = require H.drb_path
  //   db                  = new DBay()
  //   drb                 = new Drb { db, temporary: true, }
  //   #.........................................................................................................
  //   db SQL"create table d ( x integer );"
  //   db SQL"insert into d values ( 42 );"
  //   db SQL"select * from d where x = ${namespace.key};", { namespace: { key: 42, }, }
  //   #.........................................................................................................
  //   return done?()

  //-----------------------------------------------------------------------------------------------------------
  this["DRB RBW returns despaced pathdata"] = function(T, done) {
    var DBay, Drb, FS, bbox, db, drb, fontnick, fspath, pd;
    // T?.halt_on_error()
    FS = require('fs');
    // RBW                 = require '../../../apps/rustybuzz-wasm/pkg'
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    // drb                 = new Drb { db, temporary: true, RBW, }
    drb = new Drb({
      db,
      temporary: true
    });
    fontnick = 'djvs';
    fspath = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/jizura-fonts/DejaVuSerif.ttf'));
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    ({bbox, pd} = drb.get_single_outline({
      fontnick,
      gid: 74
    }));
    debug('^3344^', rpr(pd));
    if (T != null) {
      T.eq(pd, 'M525-467L525-11Q525 101 463 161Q402 222 288 222Q237 222 190 213Q143 204 100 185L100 76L147 76Q156 127 188 150Q221 174 282 174Q361 174 398 129Q435 84 435-11L435-81Q409-32 368-9Q327 14 267 14Q171 14 111-62Q50-138 50-260Q50-382 110-458Q171-533 267-533Q327-533 368-510Q409-487 435-438L435-519L611-519L611-467L525-467Z M435-285Q435-378 399-428Q363-477 295-477Q226-477 190-422Q155-368 155-260Q155-152 190-97Q226-42 295-42Q363-42 399-91Q435-140 435-234L435-285Z');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "DRB RBW decode_ncrs()" ]
      return test(this["DRB use object as namespace for interpolation"]);
    })();
  }

}).call(this);

//# sourceMappingURL=basic.tests.js.map