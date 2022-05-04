(function() {
  'use strict';
  var CND, badge, debug, demo_scheduler, echo, help, info, rpr, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/DEMO-SCHEDULER';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_scheduler = function() {
    var AUDIOPLAYER, Vogue, Vogue_db, Vogue_scraper, get_callee, get_metronome_callee, paths, vogue;
    ({AUDIOPLAYER} = require('../../snippets/lib/demo-node-beep'));
    ({Vogue, Vogue_db, Vogue_scraper} = require('../../../apps/dbay-vogue'));
    vogue = new Vogue();
    paths = {
      a: '/usr/share/sounds/LinuxMint/stereo/button-pressed.ogg',
      b: '/usr/share/mint-artwork/sounds/notification.oga',
      c: '/usr/share/mint-artwork/sounds/logout.ogg'
    };
    get_metronome_callee = function() {
      return (path) => {
        return process.stdout.write('.');
      };
    };
    get_callee = (sigil, path) => {
      var callee;
      return callee = async function() {
        process.stdout.write(sigil);
        AUDIOPLAYER.play(path);
        return (await vogue.scheduler.sleep(0.2));
      };
    };
    vogue.scheduler.add_interval({
      callee: get_metronome_callee(),
      repeat: "0.1 seconds"
    });
    vogue.scheduler.add_interval({
      callee: get_callee('+', paths.a),
      repeat: "1.2 seconds"
    });
    vogue.scheduler.add_interval({
      callee: get_callee('X', paths.b),
      repeat: "1.5 seconds"
    });
    vogue.scheduler.add_interval({
      callee: get_callee('@', paths.c),
      repeat: "2.1 seconds"
    });
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo_scheduler());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-scheduler.js.map