(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/DEMO-AD-CHAIN';

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

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'
  ({DBay} = require(H.dbay_path));

  ({Drb} = require(H.drb_path));

  ({width_of, to_width} = require('to-width'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_ad_chain_1 = function(cfg) {
    var ad, b1, b1_b2, b2, chrs, collector, db, drb, gid, hborder, i, idx, j, len, len1, line, ref, ref1, width;
    // defaults        = { fontnick: 'b42', fspath: null, gid_1: 1, gid_2: 100, }
    // cfg             = { defaults..., cfg..., }
    // { fontnick
    //   fspath
    //   gid_1
    //   gid_2    }    = cfg
    // { Tbl, }        = require '../../../apps/icql-dba-tabulate'
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    drb = new Drb({
      db,
      rebuild: false,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    // dtab            = new Tbl { db, }
    collector = [[], [], [], [], []];
    ref = db(SQL`select
    *
  from ads
  where true
    and ( alt = 1 )
  order by b1
  limit 50;`, {});
    for (ad of ref) {
      ({gid, chrs, b1, b2} = ad);
      chrs = chrs.replace('\xad', '¬');
      chrs = chrs.replace('\x20', '␣');
      // chrs    = ' ' + chrs + ' '
      // chrs    = to_width chrs, 5, { align: 'center', }
      width = (width_of(chrs)) + 3 * 2;
      hborder = '─'.repeat(width);
      gid = to_width(gid.toString(), width, {
        align: 'center'
      });
      b1_b2 = `${b1}, ${b2}`;
      b1_b2 = to_width(b1_b2, width, {
        align: 'center'
      });
      ref1 = [`  ${gid}  `, ` ┌${hborder}┐ `, `─┼─▶ ${chrs} ◀─┼─`, ` └${hborder}┘ `, `  ${b1_b2}  `];
      for (idx = i = 0, len = ref1.length; i < len; idx = ++i) {
        line = ref1[idx];
        collector[idx].push(line);
      }
    }
    for (j = 0, len1 = collector.length; j < len1; j++) {
      line = collector[j];
      echo(to_width(line.join(''), 200, {
        align: 'center',
        ellipsis: ''
      }));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_ad_chain_compact = function(cfg) {
    var db, drb;
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    drb = new Drb({
      db,
      rebuild: false,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    echo(drb.render_ad_chain({
      format: 'compact',
      b: 25,
      context: 10
    }));
    return null;
  };

  /*

  b       10 11 12 14 15  16 17  18 19
           ┬──┬──┬──┬──┬───┬──┬───┬──┬───
  chrs     │a │f │ ¬│ f│ i │r │ m │ ␣│
  gid      │23|85| 3|-1|176|40|180| 3│
           ┴──┴──┴──┴──┴───┴──┴───┴──┴───

  */
  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @demo_ad_chain_1()
      // @demo_ad_chain_2()
      return this.demo_ad_chain_compact();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-ad-chain.js.map