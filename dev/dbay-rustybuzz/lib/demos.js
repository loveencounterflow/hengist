(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, RBW, SQL, ZLIB, badge, debug, echo, equals, guy, help, info, isa, rpr, settings_from_set_id, show_db, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/DEMOS';

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

  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'
  RBW = require('rustybuzz-wasm');

  H = require('./helpers');

  ZLIB = require('zlib');

  ({DBay} = require(H.dbay_path));

  ({Drb} = require(H.drb_path));

  //-----------------------------------------------------------------------------------------------------------
  show_db = function(db, schema) {
    var Tbl, dtab;
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({db});
    // echo dtab._tabulate db SQL"select * from #{schema}.outlines order by fontnick, gid;"
    echo(dtab._tabulate(db(SQL`select * from ${schema}.fontnicks order by fontnick;`)));
    echo(dtab._tabulate(db(SQL`select
    fontnick,
    gid,
    cid,
    glyph,
    uoid,
    -- soid,
    x,
    y,
    x1,
    y1,
    -- pd
    substring( pd, 0, 25 ) || '...' as "(pd)"
    -- substring( pd_blob, 0, 25 ) || '...' as "(pd_blob)"
  from ${schema}.outlines
  order by fontnick, gid
  limit 100;`)));
    echo(dtab._tabulate(db(SQL`select distinct
    fontnick,
    count(*) over ( partition by fontnick ) as outlines
  from ${schema}.outlines
  order by fontnick, gid
  limit 100;`)));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  settings_from_set_id = function(set_id) {
    var cgid_map, chrs, cids, fontnick, fspath, text;
    chrs = null;
    cids = null;
    cgid_map = null;
    fontnick = null;
    fspath = null;
    //.........................................................................................................
    switch (set_id) {
      case 'small':
        fontnick = 'djvs';
        fspath = 'DejaVuSerif.ttf';
        chrs = "sampletext算";
        text = "äöü the affirmation.";
        break;
      case 'all':
        fontnick = 'qkai';
        fspath = 'cwTeXQKai-Medium.ttf';
        cids = drb.get_unicode_codepoints();
        break;
      default:
        // fontnick = 'jzr';   fspath = 'jizura3b.ttf'
        /* TAINT obtain list of all valid Unicode codepoints (again) */
        // cids                = [ 0x0021 .. 0xd000 ]
        // cids                = [ 0x4e00 .. 0x9fff ]
        // cids                = [ 0x4e00 .. 0x4e02 ]
        throw new Error(`^345^ unknown set_id ${rpr(set_id)}`);
    }
    //.........................................................................................................
    fspath = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts/', fspath));
    return {chrs, cids, cgid_map, text, fontnick, fspath};
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_store_outlines = function(cfg) {
    /* NOTE exactly one of `cids`, `chrs` must be set */
    var bbox, cgid_map, chrs, cids, db, defaults, drb, drb_cfg, dt, fontnick, fspath, path, pd, schema, set_id, t0, t1;
    defaults = {
      set_id: 'small'
    };
    cfg = {...defaults, ...cfg};
    ({set_id} = cfg);
    path = '/tmp/dbay-rustybuzz.sqlite';
    db = new DBay({path});
    schema = 'drb';
    drb_cfg = {
      db: db,
      path: '/dev/shm/rustybuzz.sqlite',
      create: true,
      schema: schema
    };
    drb = new Drb(drb_cfg);
    //.........................................................................................................
    ({chrs, cids, cgid_map, fontnick, fspath} = settings_from_set_id(set_id));
    //.........................................................................................................
    drb.register_fontnick({fontnick, fspath});
    whisper('^3334^', `loading font ${rpr(fontnick)}...`);
    drb.prepare_font({fontnick});
    whisper('^3334^', "... done");
    //.........................................................................................................
    urge('^290^', ({bbox, pd} = drb.get_single_outline({
      fontnick,
      gid: 74
    })));
    //.........................................................................................................
    t0 = Date.now();
    cgid_map = drb.get_cgid_map({cids, chrs, fontnick});
    t1 = Date.now();
    /* TAINT might want to turn this into a benchmark (or improve reporting) */
    debug('^324^', cgid_map.size + ' gids');
    debug('^324^', (dt = (t1 - t0) / 1000) + 's');
    help('^290^', (rpr(cgid_map)).slice(0, 200) + '...');
    //.........................................................................................................
    t0 = Date.now();
    drb.insert_outlines({fontnick, cgid_map});
    t1 = Date.now();
    debug('^324^', (dt = (t1 - t0) / 1000) + 's');
    //.........................................................................................................
    // echo dtab._tabulate db SQL"""
    //   with v1 as ( select count(*) as outline_count from #{schema}.outlines )
    //   select
    //     v1.outline_count / ? as "outlines per second"
    //   from v1;""", [ dt, ]
    //.........................................................................................................
    return show_db(db, schema);
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @demo_text_shaping = ->

  //-----------------------------------------------------------------------------------------------------------
  this.demo_typesetting = function(cfg) {
    var cgid_map, chrs, cids, db, defaults, drb, fontnick, fspath, schema, set_id, size_mm, text;
    defaults = {
      set_id: 'small'
    };
    cfg = {...defaults, ...cfg};
    ({set_id} = cfg);
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    schema = 'drb';
    drb = new Drb({
      db,
      create: true,
      schema,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    //.........................................................................................................
    ({chrs, cids, cgid_map, text, fontnick, fspath} = settings_from_set_id(set_id));
    size_mm = 5;
    //.........................................................................................................
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    drb.insert_outlines({fontnick, cgid_map, cids, chrs});
    drb.shape_text({fontnick, text, size_mm});
    drb.shape_text({
      fontnick,
      text,
      size_mm: 10
    });
    //.........................................................................................................
    /* TAINT rename method to distinguish getting outlines from rustybuzz-wasm vs getting them from DB */
    // urge '^290^', { bbox, pd, } = drb.get_single_outline { fontnick, gid: 74, }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await @demo_store_outlines()
      // await @demo_store_outlines { set_id: 'all', }
      return (await this.demo_typesetting());
    })();
  }

  // await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demos.js.map