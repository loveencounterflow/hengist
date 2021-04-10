(function() {
  'use strict';
  var $, $async, $drain, $show, $watch, CND, DATOM, HGST, INTERTEXT, SP, after, alert, assign, async, badge, cast, debug, defer, echo, freeze, fresh_datom, help, info, isa, jr, lets, new_datom, rpr, select, stamp, sync, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'INTERPLOT/TYPESET-SVG-SLUGS-WITH-OPENTYPEJS';

  rpr = CND.rpr;

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
  HGST = require('../../../../hengist');

  types = require(HGST.resolve_project_path('apps/interplot/lib/types'));

  ({isa, validate, cast, type_of} = types);

  INTERTEXT = require(HGST.resolve_project_path('apps/intertext'));

  // { HTML
  //   RXWS }                  = require '../../../apps/paragate'
  SP = require(HGST.resolve_project_path('apps/steampipes'));

  ({$, $async, $drain, $show, $watch} = SP.export());

  DATOM = require(HGST.resolve_project_path('apps/datom'));

  ({select, stamp, freeze, lets, new_datom, fresh_datom} = DATOM.export());

  // # DB                        = require '../intershop/intershop_modules/db'
  // INTERSHOP                 = require '../intershop'
  // PGP                       = ( require 'pg-promise' ) { capSQL: false, }

  //-----------------------------------------------------------------------------------------------------------
  this.$hyphenate = function(S) {
    return $((text, send) => {
      return send(INTERTEXT.HYPH.hyphenate(text));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$slabjoints_from_text = function(S) {
    return $((text, send) => {
      return send(INTERTEXT.SLABS.slabjoints_from_text(text));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.typeset = function() {
    return new Promise((resolve, reject) => {
      var S, pipeline, source/* NOTE will hold state such as configuration */;
      S = {};
      source = ["welcome to InterPlot Typesetting客观事物。文字"];
      pipeline = [];
      pipeline.push(source);
      pipeline.push(this.$hyphenate(S));
      pipeline.push($watch(function(text) {
        return urge('^3321^', rpr(INTERTEXT.HYPH.reveal_hyphens(text, '*')));
      }));
      pipeline.push(this.$slabjoints_from_text(S));
      pipeline.push($show());
      pipeline.push($drain(function() {
        return resolve();
      }));
      SP.pull(...pipeline);
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await this.typeset());
    })();
  }

}).call(this);

//# sourceMappingURL=typeset-svg-slugs-with-opentypejs.js.map