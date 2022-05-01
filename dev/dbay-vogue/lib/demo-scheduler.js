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
    var Vogue, Vogue_db, Vogue_scraper, vogue;
    ({Vogue, Vogue_db, Vogue_scraper} = require('../../../apps/dbay-vogue'));
    vogue = new Vogue();
    vogue.scheduler.XXX_get_interval(async function() {
      help('^543-1^', "start");
      await vogue.scheduler.sleep(1.5);
      return info('^543-1^', "stop");
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