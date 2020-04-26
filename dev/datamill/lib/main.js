(function() {
  'use strict';
  var CND, DATAMILL, INTERTEXT, after, alert, assign, async, badge, cast, debug, defer, echo, help, info, isa, jr, rpr, sync, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'DATAMILL-DEMO';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  defer = setImmediate;

  async = {};

  sync = {
    concurrency: 1
  };

  // async                     = { async: true, }
  //...........................................................................................................
  DATAMILL = require('../../../apps/datamill');

  ({isa, validate, cast, type_of} = DATAMILL.types);

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  //-----------------------------------------------------------------------------------------------------------
  this.demo = async function() {
    var DISPLAY, grammar, i, len, source, token, tokens;
    // debug '^4554^', rpr ( k for k of DATAMILL )
    DISPLAY = require('../../paragate/lib/display');
    grammar = require('../../../apps/paragate/lib/htmlish.grammar');
    source = `<title>A Proposal</title>
<h1>Motivation</h1>
<p>It has been suggested to further the cause.</p>
<p>This is <i>very</i> desirable indeed.</p>`;
    tokens = grammar.parse(source);
    for (i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      info(rpr(token));
    }
    await DISPLAY.show_tokens_as_table(tokens);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      await this.demo();
      return null;
    })();
  }

}).call(this);
