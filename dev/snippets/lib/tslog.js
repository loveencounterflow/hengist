(function() {
  'use strict';
  var CND, Logger, alert, badge, debug, demo, f, g, h, help, info, jr, rpr, settings, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SNIPPETS/TSLOG';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  jr = JSON.stringify;

  ({Logger} = require('tslog'));

  settings = {
    exposeStack: false,
    exposeErrorCodeFrameLinesBeforeAndAfter: 1
  };

  // debug '^430^', log = new Logger settings
  f = function() {
    return new Promise(async function(resolve, reject) {
      return (await g());
    });
  };

  g = function() {
    return new Promise(async function(resolve, reject) {
      return (await h());
    });
  };

  h = function() {
    return new Promise(function(resolve, reject) {
      return reject(new Error("foobar"));
    });
  };

  demo = async function() {
    // log.silly	"I am a silly log."
    // log.trace	"I am a trace log with a stack trace."
    // log.debug	"I am a debug log."
    // log.info 	"I am an info log."
    // log.warn 	"I am a warn log with a json object:", settings
    // log.error	"I am an error log."
    // log.fatal	new Error("I am a pretty Error with a stacktrace.")
    // throw new Error "^7765^ a test"
    return (await f());
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=tslog.js.map