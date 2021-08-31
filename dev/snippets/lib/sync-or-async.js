(function() {
  'use strict';
  var CND, alert, badge, create_sync_or_async_function, debug, declare, demo, echo, first_of, guy, help, info, isa, last_of, log, rpr, size_of, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SYNC-OR-ASYNC';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  ({isa, validate, declare, first_of, last_of, size_of, type_of} = types);

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  create_sync_or_async_function = function(type) {
    switch (type) {
      case 'sync':
        return function() {
          urge("it's sync");
          return null;
        };
      case 'async':
        return async function() {          // return -> new Promise ( resolve ) => defer -> ( urge "it's sync"; resolve null )
          await guy.async.sleep(0.1);
          urge("it's async");
          return null;
        };
    }
    throw new Error(`expected 'sync' or 'async', got ${rpr(type)}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = async function() {
    var f;
    debug('^3378^', type_of(create_sync_or_async_function));
    debug('^3378^', type_of(f = create_sync_or_async_function('sync')));
    f();
    debug('^3378^', type_of(f = create_sync_or_async_function('async')));
    await f();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=sync-or-async.js.map